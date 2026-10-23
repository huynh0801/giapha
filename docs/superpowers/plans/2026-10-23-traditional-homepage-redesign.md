# Traditional Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the landing page (`app/page.tsx`) to match 100% of the user-provided traditional Vietnamese folk art design mockup using modular Next.js Server Components, localized typography, and dynamic Supabase news integration.

**Architecture:** Decompose the homepage into 5 clean, single-responsibility components in `components/landing/` (`LandingHeader`, `LandingHero`, `LandingQuickNav`, `LandingAbout`, `LandingLatestNews`, `LandingFooter`), standardize assets from `icon/` into `public/images/landing/`, and render everything server-side in `app/page.tsx` with fallback data resilience.

**Tech Stack:** Next.js 16.2.9 (App Router, Server Components), React 19, Tailwind CSS v4, Lucide React, Supabase SSR.

## Global Constraints

- Preserve all existing 37 tests in `tests/`.
- No client-side Supabase credentials; keep BFF architecture intact.
- Author for git commits must strictly be `huynh0801 <huynh0801@users.noreply.github.com>`.
- Responsive design: Mobile-first support for screens from 360px up to 4K displays.
- All copy in Vietnamese with proper diacritics and no mojibake.

---

### Task 1: Asset Pipeline & Landing Types

**Files:**
- Create: `public/images/landing/` (copy normalized assets from `icon/`)
- Create: `components/landing/types.ts`
- Create: `tests/landing-page.test.mjs`

**Interfaces:**
- Produces: `LandingNewsItem` interface, paths to standardized landing assets.

- [ ] **Step 1: Write the failing test for landing assets and types**

```javascript
// tests/landing-page.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("landing assets are present in public/images/landing", () => {
  const requiredImages = [
    "hero-banner.png",
    "nav-genealogy.png",
    "nav-members.png",
    "nav-documents.png",
    "nav-news.png",
    "nav-contact.png",
    "about-temple.png",
    "cloud-ornament.png",
    "footer-clouds.png",
  ];

  for (const img of requiredImages) {
    const fullPath = path.join(process.cwd(), "public", "images", "landing", img);
    assert.ok(fs.existsSync(fullPath), `Missing required landing asset: ${img}`);
  }
});
```

- [ ] **Step 2: Run test to make sure it fails**

Run: `node --test tests/landing-page.test.mjs` (Expected: FAIL because directory and files do not exist yet)

- [ ] **Step 3: Copy and standardize image assets from `icon/` to `public/images/landing/`**

Create `public/images/landing/` and copy:
- `icon/herosection.png` ➔ `public/images/landing/hero-banner.png`
- `icon/icon (1).png` ➔ `public/images/landing/nav-genealogy.png`
- `icon/icon (2).png` ➔ `public/images/landing/nav-members.png`
- `icon/icon (3).png` ➔ `public/images/landing/nav-documents.png`
- `icon/icon (4).png` ➔ `public/images/landing/nav-news.png`
- `icon/icon (5).png` ➔ `public/images/landing/nav-contact.png`
- `icon/img-detail.png` ➔ `public/images/landing/about-temple.png`
- `icon/img-detail2.png` ➔ `public/images/landing/cloud-ornament.png`
- `icon/icon-footer.png` ➔ `public/images/landing/footer-clouds.png`

Create `components/landing/types.ts`:
```typescript
export interface LandingNewsItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  imageUrl?: string | null;
}
```

- [ ] **Step 4: Run test to confirm it passes**

Run: `node --test tests/landing-page.test.mjs` (Expected: PASS)

- [ ] **Step 5: Commit**

`git add public/images/landing components/landing/types.ts tests/landing-page.test.mjs && git commit -m "feat(landing): setup asset pipeline and landing types"`

---

### Task 2: Build `LandingHeader` & `LandingFooter`

**Files:**
- Create: `components/landing/LandingHeader.tsx`
- Create: `components/landing/LandingFooter.tsx`
- Modify: `tests/landing-page.test.mjs`

**Interfaces:**
- Produces: `<LandingHeader />`, `<LandingFooter />`

- [ ] **Step 1: Write tests for Header & Footer copy and links**

Add to `tests/landing-page.test.mjs`:
```javascript
test("LandingHeader and LandingFooter export valid React components and required copy", async () => {
  const headerContent = fs.readFileSync(path.join(process.cwd(), "components", "landing", "LandingHeader.tsx"), "utf8");
  assert.match(headerContent, /Gia Phả Dòng Họ/);
  assert.match(headerContent, /Tôn vinh cội nguồn/);
  assert.match(headerContent, /\/dashboard/);
  assert.match(headerContent, /\/news/);

  const footerContent = fs.readFileSync(path.join(process.cwd(), "components", "landing", "LandingFooter.tsx"), "utf8");
  assert.match(footerContent, /Dòng họ trường tồn - Con cháu hưng thịnh/);
});
```

- [ ] **Step 2: Run test to make sure it fails**

Run: `node --test tests/landing-page.test.mjs` (Expected: FAIL because components do not exist yet)

- [ ] **Step 3: Implement `LandingHeader.tsx` & `LandingFooter.tsx`**

Implement:
- `LandingHeader.tsx`:
  - Traditional square red seal `祖` with rounded corners.
  - Heading "Gia Phả Dòng Họ" and slogan "Tôn vinh cội nguồn - Gìn giữ truyền thống".
  - Nav links: Trang chủ (`/`), Gia phả (`/dashboard`), Thành viên (`/dashboard`), Tư liệu (`/about`), Tin tức (`/news`), Liên hệ (`/about`).
  - Search trigger icon + Mobile menu drawer for small screens.
- `LandingFooter.tsx`:
  - Background ribbon in dark green `#183b28`.
  - Ornamental cloud image `footer-clouds.png`.
  - Center slogan: "Dòng họ trường tồn - Con cháu hưng thịnh".

- [ ] **Step 4: Run test to confirm it passes**

Run: `node --test tests/landing-page.test.mjs` (Expected: PASS)

- [ ] **Step 5: Commit**

`git add components/landing/LandingHeader.tsx components/landing/LandingFooter.tsx tests/landing-page.test.mjs && git commit -m "feat(landing): implement LandingHeader and LandingFooter"`

---

### Task 3: Build `LandingHero` & `LandingQuickNav`

**Files:**
- Create: `components/landing/LandingHero.tsx`
- Create: `components/landing/LandingQuickNav.tsx`
- Modify: `tests/landing-page.test.mjs`

**Interfaces:**
- Produces: `<LandingHero />`, `<LandingQuickNav />`

- [ ] **Step 1: Write test for Hero and QuickNav copy and structure**

Add to `tests/landing-page.test.mjs`:
```javascript
test("LandingHero and LandingQuickNav contain mockup copy and navigation items", () => {
  const heroContent = fs.readFileSync(path.join(process.cwd(), "components", "landing", "LandingHero.tsx"), "utf8");
  assert.match(heroContent, /Dòng họ là gốc rễ của mỗi chúng ta/);
  assert.match(heroContent, /Khám phá gia phả/);

  const navContent = fs.readFileSync(path.join(process.cwd(), "components", "landing", "LandingQuickNav.tsx"), "utf8");
  assert.match(navContent, /Gia phả dòng họ/);
  assert.match(navContent, /Thành viên/);
  assert.match(navContent, /Tư liệu/);
  assert.match(navContent, /Tin tức - Sự kiện/);
  assert.match(navContent, /Liên hệ/);
});
```

- [ ] **Step 2: Run test to make sure it fails**

Run: `node --test tests/landing-page.test.mjs` (Expected: FAIL)

- [ ] **Step 3: Implement `LandingHero.tsx` & `LandingQuickNav.tsx`**

- `LandingHero.tsx`:
  - Background artwork `hero-banner.png` (using `next/image` with high priority).
  - Headline: "Dòng họ là gốc rễ của mỗi chúng ta".
  - Slogan 2 lines: "Gìn giữ gia phả - Kết nối con cháu" / "Duy trì truyền thống - Vững bước tương lai".
  - CTA button: `bg-[#96281b]` with "Khám phá gia phả →" linking to `/dashboard`.
- `LandingQuickNav.tsx`:
  - 5 cards with border dividers:
    1. `nav-genealogy.png` - "Gia phả dòng họ" - "Xem sơ đồ, lịch sử của dòng họ" -> `/dashboard`
    2. `nav-members.png` - "Thành viên" - "Danh sách con cháu trong dòng họ" -> `/dashboard`
    3. `nav-documents.png` - "Tư liệu" - "Lưu trữ hình ảnh, văn bản, hiện vật quý" -> `/about`
    4. `nav-news.png` - "Tin tức - Sự kiện" - "Các hoạt động của dòng họ" -> `/news`
    5. `nav-contact.png` - "Liên hệ" - "Góp ý, liên hệ với ban quản trị" -> `/about`

- [ ] **Step 4: Run test to confirm it passes**

Run: `node --test tests/landing-page.test.mjs` (Expected: PASS)

- [ ] **Step 5: Commit**

`git add components/landing/LandingHero.tsx components/landing/LandingQuickNav.tsx tests/landing-page.test.mjs && git commit -m "feat(landing): implement LandingHero and LandingQuickNav"`

---

### Task 4: Build `LandingAbout` & `LandingLatestNews`

**Files:**
- Create: `components/landing/LandingAbout.tsx`
- Create: `components/landing/LandingLatestNews.tsx`
- Modify: `tests/landing-page.test.mjs`

**Interfaces:**
- Consumes: `LandingNewsItem` from `components/landing/types.ts`
- Produces: `<LandingAbout />`, `<LandingLatestNews news={posts} />`

- [ ] **Step 1: Write test for About and LatestNews components**

Add to `tests/landing-page.test.mjs`:
```javascript
test("LandingAbout and LandingLatestNews contain expected copy and fallback support", () => {
  const aboutContent = fs.readFileSync(path.join(process.cwd(), "components", "landing", "LandingAbout.tsx"), "utf8");
  assert.match(aboutContent, /Về dòng họ chúng tôi/);
  assert.match(aboutContent, /Xem chi tiết/);

  const newsContent = fs.readFileSync(path.join(process.cwd(), "components", "landing", "LandingLatestNews.tsx"), "utf8");
  assert.match(newsContent, /Tin tức mới nhất/);
  assert.match(newsContent, /Xem tất cả/);
  assert.match(newsContent, /Lễ giỗ Tổ dòng họ/); // Fallback mock item
});
```

- [ ] **Step 2: Run test to make sure it fails**

Run: `node --test tests/landing-page.test.mjs` (Expected: FAIL)

- [ ] **Step 3: Implement `LandingAbout.tsx` & `LandingLatestNews.tsx`**

- `LandingAbout.tsx`:
  - Left: `about-temple.png`.
  - Right: "Về dòng họ chúng tôi", introductory paragraph, "Xem chi tiết →" button linking to `/about`.
  - Decorative cloud `cloud-ornament.png` positioned at the bottom right.
- `LandingLatestNews.tsx`:
  - Title: "Tin tức mới nhất" and "Xem tất cả →" linking to `/news`.
  - Maps `news` prop or defaults to fallback items:
    1. "Lễ giỗ Tổ dòng họ năm 2025" - "15/03/2025"
    2. "Cập nhật danh sách con cháu" - "10/02/2025"
    3. "Số hóa gia phả dòng họ" - "05/01/2025"
  - Thumbnail display, date formatting, line clamping for description.

- [ ] **Step 4: Run test to confirm it passes**

Run: `node --test tests/landing-page.test.mjs` (Expected: PASS)

- [ ] **Step 5: Commit**

`git add components/landing/LandingAbout.tsx components/landing/LandingLatestNews.tsx tests/landing-page.test.mjs && git commit -m "feat(landing): implement LandingAbout and LandingLatestNews"`

---

### Task 5: Integrate `app/page.tsx` & End-to-End Build Verification

**Files:**
- Modify: `app/page.tsx`
- Modify: `package.json` (add `tests/landing-page.test.mjs` to test runner)

- [ ] **Step 1: Write integration test for `app/page.tsx`**

Add to `tests/landing-page.test.mjs`:
```javascript
test("app/page.tsx imports and integrates all landing components", () => {
  const pageContent = fs.readFileSync(path.join(process.cwd(), "app", "page.tsx"), "utf8");
  assert.match(pageContent, /LandingHeader/);
  assert.match(pageContent, /LandingHero/);
  assert.match(pageContent, /LandingQuickNav/);
  assert.match(pageContent, /LandingAbout/);
  assert.match(pageContent, /LandingLatestNews/);
  assert.match(pageContent, /LandingFooter/);
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `node --test tests/landing-page.test.mjs` (Expected: FAIL before updating `app/page.tsx`)

- [ ] **Step 3: Update `app/page.tsx` and `package.json`**

Update `app/page.tsx`:
- Fetch 3 latest published system blog posts from Supabase SSR.
- Transform posts into `LandingNewsItem[]`.
- Render all landing components with warm parchment background `#fdfaf3` matching the mockup.
- Update `package.json` test script to include `tests/landing-page.test.mjs`.

- [ ] **Step 4: Run all automated tests**

Run: `npm test` (All tests must pass).

- [ ] **Step 5: Run production build**

Run: `npm run build` (Must build with exit code 0).

- [ ] **Step 6: Commit and Push**

`git add app/page.tsx package.json tests/landing-page.test.mjs && git commit -m "feat(landing): assemble traditional homepage with SSR news integration" && git push origin main`
