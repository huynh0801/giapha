# Hoà Trạch News Crawler Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatically crawl the 20 latest news articles from `https://hoatrach.quangtri.gov.vn/` into the `blog_posts` database table on a 24-hour daily schedule (via Vercel Cron) and via an on-demand Super Admin button, with permanent image mirroring to Cloudflare R2 / Storage and deduplication.

**Architecture:** Next.js Route Handler (`/api/cron/crawl-hoatrach`) triggered by Vercel Cron once every 24 hours (`0 23 * * *` UTC / 06:00 AM VN) or Super Admin action, calling a robust crawler engine (`lib/crawler/hoatrach.ts`) that parses Liferay HTML, uploads cover images to Cloudflare R2, deduplicates by `source_url`, and inserts published posts directly into `public.blog_posts`.

**Tech Stack:** Next.js 16 (App Router, Server Actions, Route Handlers), Supabase (PostgreSQL with Service Role), Cloudflare R2 (`@aws-sdk/client-s3`), Cheerio/Regex HTML parsing, TypeScript, Node.js test runner.

## Global Constraints

- **Scope:** All crawled posts must have `scope = 'system'`, `family_id = null`, `is_published = true`, `status = 'published'`, `visibility = 'public'`.
- **Deduplication:** Posts already in `blog_posts` with the same `source_url` or slug must not be duplicated.
- **Image Persistence:** Cover images must be downloaded from `hoatrach.quangtri.gov.vn` and uploaded to Cloudflare R2 / Supabase Storage via `uploadStorageImage()`.
- **Execution Limit:** Next.js Route Handler must set `export const maxDuration = 60;` to avoid serverless timeouts.
- **Cron Schedule:** `0 23 * * *` (Daily at 23:00 UTC = 06:00 AM UTC+7).
- **Quality Gates:** Maintain 100% pass across all 94+ existing tests (`npm test`) and clean `npm run build`.

---

### Task 1: Database Migration for `source_url`

**Files:**
- Create: `supabase/migrations/20261028150000_add_source_url_to_blog_posts.sql`
- Test: `tests/hoatrach-crawler-db.test.mjs`

**Interfaces:**
- Produces: `blog_posts.source_url text` column and `idx_blog_posts_source_url` index.

- [ ] **Step 1: Write the failing test**
Create `tests/hoatrach-crawler-db.test.mjs`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('migration adds source_url column and index to blog_posts', () => {
  const sql = fs.readFileSync('supabase/migrations/20261028150000_add_source_url_to_blog_posts.sql', 'utf8');
  assert.match(sql, /ALTER TABLE public\.blog_posts\s+ADD COLUMN IF NOT EXISTS source_url text;/i);
  assert.match(sql, /CREATE INDEX IF NOT EXISTS idx_blog_posts_source_url\s+ON public\.blog_posts\s*\(source_url\);/i);
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/hoatrach-crawler-db.test.mjs`
Expected: FAIL (file does not exist).

- [ ] **Step 3: Write migration file**
Create `supabase/migrations/20261028150000_add_source_url_to_blog_posts.sql`:
```sql
-- Migration: Add source_url column and index for news crawler deduplication
ALTER TABLE public.blog_posts 
  ADD COLUMN IF NOT EXISTS source_url text;

CREATE INDEX IF NOT EXISTS idx_blog_posts_source_url 
  ON public.blog_posts (source_url);
```

- [ ] **Step 4: Run test to verify it passes**
Run: `node --test tests/hoatrach-crawler-db.test.mjs`
Expected: PASS.

- [ ] **Step 5: Apply migration to Supabase DB**
Execute SQL query in Supabase via Postgres client / script to add column and index.

- [ ] **Step 6: Commit**
```bash
git add supabase/migrations/20261028150000_add_source_url_to_blog_posts.sql tests/hoatrach-crawler-db.test.mjs
git commit -m "feat(db): add source_url to blog_posts for crawler deduplication"
```

---

### Task 2: Crawler Engine Core

**Files:**
- Create: `lib/crawler/hoatrach.ts`
- Test: `tests/hoatrach-crawler.test.ts`

**Interfaces:**
- Consumes: `uploadStorageImage` from `lib/storage.ts`, `generateUniqueSlug` from `lib/slug.ts`.
- Produces: `crawlHoatrachLatestNews(options?: { limit?: number; dryRun?: boolean }): Promise<{ success: boolean; totalCrawled: number; totalSkipped: number; errors: string[] }>`

- [ ] **Step 1: Write unit tests for crawler parser**
Create `tests/hoatrach-crawler.test.ts`:
```typescript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseArticleDetail, extractArticleListUrls } from '../lib/crawler/hoatrach';

test('extractArticleListUrls extracts article URLs sorted by epoch timestamp descending', () => {
  const sampleHtml = `
    <div class="artItem">
      <a href="https://hoatrach.quangtri.gov.vn/chi-tiet-tin/-/view-article/1/0/1793161906731" class="article_title_link">Tin 1</a>
    </div>
    <div class="artItem">
      <a href="https://hoatrach.quangtri.gov.vn/chi-tiet-tin/-/view-article/1/541511447209827415/1793171184429" class="article_title_link">Tin 2</a>
    </div>
  `;
  const urls = extractArticleListUrls(sampleHtml);
  assert.equal(urls.length, 2);
  assert.equal(urls[0], 'https://hoatrach.quangtri.gov.vn/chi-tiet-tin/-/view-article/1/541511447209827415/1793171184429');
});

test('parseArticleDetail extracts title, date, excerpt and content', () => {
  const sampleDetailHtml = `
    <h3 class="h1_title_news">NỀN KINH TẾ HÒA TRẠCH</h3>
    <p id="pPost-date">Ngày đăng: 28/10/2026</p>
    <div class="article_summary_detail"><span class="summary_detail_news"><p>Kinh tế xã...</p></span></div>
    <div class="detail_content_news"><p>Chi tiết bài viết xã Hòa Trạch...</p></div>
  `;
  const parsed = parseArticleDetail(sampleDetailHtml, 'https://hoatrach.quangtri.gov.vn/chi-tiet-tin/-/view-article/1/0/1793171184429');
  assert.equal(parsed.title, 'NỀN KINH TẾ HÒA TRẠCH');
  assert.match(parsed.excerpt, /Kinh tế xã/);
  assert.match(parsed.content, /Chi tiết bài viết/);
  assert.equal(parsed.dateStr, '28/10/2026');
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx tsx --test tests/hoatrach-crawler.test.ts`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement `lib/crawler/hoatrach.ts`**
Write parser functions, image downloader/uploader, database insertion logic with Service Role client, error handling, and deduplication check.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx tsx --test tests/hoatrach-crawler.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add lib/crawler/hoatrach.ts tests/hoatrach-crawler.test.ts
git commit -m "feat(crawler): implement hoatrach portal scraping engine"
```

---

### Task 3: Vercel Cron Configuration & API Route Handler

**Files:**
- Create: `app/api/cron/crawl-hoatrach/route.ts`
- Modify: `vercel.json`
- Test: `tests/hoatrach-cron-route.test.mjs`

**Interfaces:**
- Consumes: `crawlHoatrachLatestNews` from `lib/crawler/hoatrach.ts`.
- Produces: `GET /api/cron/crawl-hoatrach` and `POST /api/cron/crawl-hoatrach`.

- [ ] **Step 1: Write the test**
Create `tests/hoatrach-cron-route.test.mjs`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('vercel.json schedules crawl-hoatrach every 24 hours at 23:00 UTC (06:00 VN)', () => {
  const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  assert.ok(Array.isArray(vercel.crons), 'crons array must exist');
  const cron = vercel.crons.find(c => c.path === '/api/cron/crawl-hoatrach');
  assert.ok(cron, 'crawl-hoatrach cron must be configured');
  assert.equal(cron.schedule, '0 23 * * *');
});

test('api route exports maxDuration = 60 and handles authorization', () => {
  const code = fs.readFileSync('app/api/cron/crawl-hoatrach/route.ts', 'utf8');
  assert.match(code, /export\s+const\s+maxDuration\s*=\s*60/);
  assert.match(code, /CRON_SECRET/);
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/hoatrach-cron-route.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Update `vercel.json` & Create `app/api/cron/crawl-hoatrach/route.ts`**
Configure cron in `vercel.json`:
```json
{
  "regions": ["sin1"],
  "crons": [
    {
      "path": "/api/cron/crawl-hoatrach",
      "schedule": "0 23 * * *"
    }
  ]
}
```
Implement `app/api/cron/crawl-hoatrach/route.ts`:
Check `Authorization: Bearer ${process.env.CRON_SECRET}` or Super Admin session, execute `crawlHoatrachLatestNews({ limit: 20 })`, return JSON response.

- [ ] **Step 4: Run test to verify it passes**
Run: `node --test tests/hoatrach-cron-route.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add vercel.json app/api/cron/crawl-hoatrach/route.ts tests/hoatrach-cron-route.test.mjs
git commit -m "feat(cron): add daily 24h cron job for hoatrach news crawler"
```

---

### Task 4: Server Action & Admin UI Integration

**Files:**
- Create: `app/actions/crawler.ts`
- Modify: `app/admin/blog/page.tsx`
- Test: `tests/hoatrach-admin-crawler.test.mjs`

**Interfaces:**
- Produces: `triggerHoatrachCrawlAction(): Promise<{ success: boolean; message: string; count?: number }>`
- Updates: `app/admin/blog/page.tsx` with a button "Cập nhật tin từ Hòa Trạch" and real-time status.

- [ ] **Step 1: Write test for server action and Admin UI**
Create `tests/hoatrach-admin-crawler.test.mjs`:
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('app/actions/crawler.ts exports triggerHoatrachCrawlAction with admin guard', () => {
  const code = fs.readFileSync('app/actions/crawler.ts', 'utf8');
  assert.match(code, /export\s+async\s+function\s+triggerHoatrachCrawlAction/);
  assert.match(code, /is_super_admin|is_active/);
});

test('app/admin/blog/page.tsx contains crawler button', () => {
  const code = fs.readFileSync('app/admin/blog/page.tsx', 'utf8');
  assert.match(code, /Hòa Trạch|crawl|Cập nhật tin/i);
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/hoatrach-admin-crawler.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Implement `app/actions/crawler.ts` and Admin UI button**
Create `app/actions/crawler.ts` guarding for Super Admin role, and add the action button to `app/admin/blog/page.tsx` with Heritage styling (`border-[#caa455] bg-[#8c1d1d] hover:bg-[#a62424] text-white`).

- [ ] **Step 4: Run test to verify it passes**
Run: `node --test tests/hoatrach-admin-crawler.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add app/actions/crawler.ts app/admin/blog/page.tsx tests/hoatrach-admin-crawler.test.mjs
git commit -m "feat(admin): integrate on-demand hoatrach crawl action into admin blog"
```

---

### Task 5: Live Initial Crawl & Full Regression Testing

**Files:**
- Verify: Database `blog_posts` rows count, `/news` rendering, `/` rendering.

- [ ] **Step 1: Execute initial crawl for 20 latest articles**
Run the crawler script or server action to populate the database with the 20 latest articles from `hoatrach.quangtri.gov.vn`.

- [ ] **Step 2: Verify database records**
Confirm:
- `blog_posts` has 20 articles with `scope = 'system'`, `is_published = true`, `status = 'published'`.
- All cover images are successfully hosted on R2 / Storage.
- `source_url` is stored for every article.

- [ ] **Step 3: Run full regression tests**
Run: `npm test`
Expected: All tests pass (original 94 tests + new crawler tests).

- [ ] **Step 4: Run Next.js production build**
Run: `npm run build`
Expected: Exit 0 (all 28 routes compiled).

- [ ] **Step 5: Commit & Push to `main`**
```bash
git push origin main
```
