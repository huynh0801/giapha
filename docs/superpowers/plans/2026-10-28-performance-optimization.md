# Kế Hoạch Triển Khai: Tối Ưu Hóa Tốc Độ Tải Dữ Liệu & Hiệu Năng Hệ Thống

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triệt tiêu độ trễ mạng và các truy vấn cơ sở dữ liệu dư thừa, kích hoạt tối ưu biên dịch Next.js và song song hóa truy vấn dữ liệu nhằm tăng tốc độ tải trang trên Vercel.

**Architecture:** Tạo cấu hình `vercel.json` cố định vùng Singapore (`sin1`); bật `optimizePackageImports` trong `next.config.ts`; đưa điều kiện kiểm tra môi trường production lên đầu trong middleware để tránh gọi DB thừa; cấu trúc lại các server components ở `app/dashboard/page.tsx` và `app/news/page.tsx` để thực hiện truy vấn đồng thời qua `Promise.all`.

**Tech Stack:** Next.js 16 (Turbopack, Server Actions, Server Components), Supabase SSR, Node.js Test Runner.

## Global Constraints
- Bảo toàn đầy đủ 78 bài test hiện có (`npm test`).
- Không phá vỡ quy trình xác thực quyền Admin / Member và các luồng bảo mật.
- Mã nguồn viết bằng TypeScript / JavaScript sạch, tuân thủ ESLint.

---

### Task 1: Thiết lập cấu hình Vercel Region và Tối ưu Bundle Next.js

**Files:**
- Create: `vercel.json`
- Modify: `next.config.ts`
- Test: `tests/performance-optimizations.test.mjs`

- [ ] **Step 1: Viết test kiểm tra file cấu hình hạ tầng**

Tạo file `tests/performance-optimizations.test.mjs`:
```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("vercel.json exists and configures Singapore sin1 region", () => {
  assert.ok(fs.existsSync("vercel.json"), "vercel.json must exist in root");
  const vercelConfig = JSON.parse(read("vercel.json"));
  assert.deepEqual(vercelConfig.regions, ["sin1"], "Vercel region must be sin1");
});

test("next.config.ts specifies optimizePackageImports for heavy libraries", () => {
  const nextConfig = read("next.config.ts");
  assert.match(nextConfig, /optimizePackageImports/, "next.config.ts must configure optimizePackageImports");
  assert.match(nextConfig, /lucide-react/, "optimizePackageImports must include lucide-react");
  assert.match(nextConfig, /@xyflow\/react/, "optimizePackageImports must include @xyflow/react");
});
```

- [ ] **Step 2: Chạy test để xác nhận test thất bại (Red)**

Run: `node --test tests/performance-optimizations.test.mjs`
Expected: FAIL do chưa có `vercel.json` và `next.config.ts` chưa có `optimizePackageImports`.

- [ ] **Step 3: Triển khai file `vercel.json` và cập nhật `next.config.ts`**

Tạo `vercel.json`:
```json
{
  "regions": ["sin1"]
}
```

Cập nhật `next.config.ts`:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
    optimizePackageImports: [
      "lucide-react",
      "d3",
      "@xyflow/react",
      "lunar-javascript",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/dashboard/about",
        destination: "/about",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 4: Chạy test xác nhận vượt qua (Green)**

Run: `node --test tests/performance-optimizations.test.mjs`
Expected: PASS cả 2 bài test.

- [ ] **Step 5: Commit**

```bash
git add vercel.json next.config.ts tests/performance-optimizations.test.mjs
git commit -m "perf: configure vercel singapore region and bundle package import optimization"
```

---

### Task 2: Tối ưu Middleware bỏ truy vấn DB thừa trên Production

**Files:**
- Modify: `utils/supabase/middleware.ts`
- Test: `tests/performance-optimizations.test.mjs`
- Test: `tests/security-hardening.test.mjs`

- [ ] **Step 1: Viết test kiểm tra middleware không query DB trên production**

Bổ sung vào `tests/performance-optimizations.test.mjs`:
```javascript
test("middleware only runs schema check outside of production", () => {
  const middleware = read("utils/supabase/middleware.ts");
  assert.match(
    middleware,
    /if\s*\(\s*process\.env\.NODE_ENV\s*!==\s*["']production["']\s*&&\s*\(isProtectedPath\s*\|\|\s*isLoginPage\)\s*\)/,
    "Schema check in middleware must only run when NODE_ENV !== production"
  );
});
```

- [ ] **Step 2: Chạy test để xác nhận test thất bại (Red)**

Run: `node --test tests/performance-optimizations.test.mjs`
Expected: FAIL vì regex chưa khớp với code hiện tại.

- [ ] **Step 3: Cập nhật `utils/supabase/middleware.ts`**

Chỉnh sửa dòng 83-99:
```typescript
  // Check if DB schema is initialized by checking if profiles table exists (only in development/preview setup)
  if (process.env.NODE_ENV !== "production" && (isProtectedPath || isLoginPage)) {
    const { error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    if (
      profileError &&
      (profileError.code === "PGRST205" || profileError.code === "42P01")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/setup";
      return NextResponse.redirect(url);
    }
  }
```

- [ ] **Step 4: Chạy test xác nhận vượt qua cả test mới và security-hardening (Green)**

Run: `node --test tests/performance-optimizations.test.mjs tests/security-hardening.test.mjs`
Expected: PASS toàn bộ.

- [ ] **Step 5: Commit**

```bash
git add utils/supabase/middleware.ts tests/performance-optimizations.test.mjs
git commit -m "perf: eliminate redundant profile schema queries in production middleware"
```

---

### Task 3: Song song hóa truy vấn dữ liệu (Parallel Data Fetching) trên Dashboard và News

**Files:**
- Modify: `app/dashboard/page.tsx`
- Modify: `app/news/page.tsx`
- Test: `tests/performance-optimizations.test.mjs`

- [ ] **Step 1: Viết test kiểm tra cấu trúc song song hóa**

Bổ sung vào `tests/performance-optimizations.test.mjs`:
```javascript
test("dashboard page executes profile, accessible families and directory in parallel", () => {
  const dashboardCode = read("app/dashboard/page.tsx");
  assert.match(
    dashboardCode,
    /Promise\.all\(\[\s*getProfile\(\),\s*getAccessibleFamilies\(\),\s*getFamilyDirectory\(/,
    "Dashboard page must fetch profile, families, and directory concurrently"
  );
});

test("news page executes categories, count and posts queries in parallel", () => {
  const newsCode = read("app/news/page.tsx");
  assert.match(
    newsCode,
    /Promise\.all\(\[\s*categoryQuery,\s*countQuery,\s*postsQuery\s*\]\)/,
    "News page must run category, count and post list queries concurrently"
  );
});
```

- [ ] **Step 2: Chạy test để xác nhận test thất bại (Red)**

Run: `node --test tests/performance-optimizations.test.mjs`
Expected: FAIL do các trang hiện tại đang gọi tuần tự.

- [ ] **Step 3: Tối ưu `app/dashboard/page.tsx`**

Cập nhật `DashboardFamilySwitcherPage`:
```typescript
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams?.q?.trim() || "";
  const visibility = ["all", "private", "family_only", "public"].includes(
    resolvedSearchParams?.visibility || "",
  )
    ? resolvedSearchParams?.visibility || "all"
    : "all";
  const currentPage = Math.max(
    1,
    Number.parseInt(resolvedSearchParams?.page || "1", 10) || 1,
  );

  const [profile, families, directory] = await Promise.all([
    getProfile(),
    getAccessibleFamilies(),
    getFamilyDirectory(q, visibility, currentPage),
  ]);

  const isSystemAdmin = profile?.is_active && profile.role === "system_admin";

  if (families.length === 1 && !resolvedSearchParams?.q) {
    redirect(`/dashboard/${families[0].family.slug}`);
  }
```

- [ ] **Step 4: Tối ưu `app/news/page.tsx`**

Cập nhật `NewsPage` để khai báo các query trước rồi gọi chung bằng `Promise.all`:
```typescript
  const [supabase, currentUser] = await Promise.all([
    getSupabase(),
    getCurrentUserAction(),
  ]);

  // 1. Category query
  const categoryQuery = supabase
    .from("blog_posts")
    .select("category")
    .eq("scope", "system")
    .eq("is_published", true);

  // 2. Count query
  let countQueryBuilder = supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("scope", "system")
    .eq("is_published", true);

  if (query) {
    countQueryBuilder = countQueryBuilder.or(
      `title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`
    );
  }
  if (selectedCategory) {
    countQueryBuilder = countQueryBuilder.eq("category", selectedCategory);
  }

  // 3. Paginated posts query
  let postsQueryBuilder = supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, category, cover_image_url, published_at, created_at"
    )
    .eq("scope", "system")
    .eq("is_published", true);

  if (query) {
    postsQueryBuilder = postsQueryBuilder.or(
      `title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`
    );
  }
  if (selectedCategory) {
    postsQueryBuilder = postsQueryBuilder.eq("category", selectedCategory);
  }

  const offset = (requestedPage - 1) * ITEMS_PER_PAGE;
  postsQueryBuilder = postsQueryBuilder
    .order("published_at", { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1);

  // Execute in parallel
  const [categoryRes, countRes, postsRes] = await Promise.all([
    categoryQuery,
    countQueryBuilder,
    postsQueryBuilder,
  ]);
```

- [ ] **Step 5: Chạy test xác nhận vượt qua (Green)**

Run: `node --test tests/performance-optimizations.test.mjs`
Expected: PASS tất cả các bài test.

- [ ] **Step 6: Commit**

```bash
git add app/dashboard/page.tsx app/news/page.tsx tests/performance-optimizations.test.mjs
git commit -m "perf: parallelize database queries across dashboard and news pages"
```

---

### Task 4: Tích hợp vào npm test script và kiểm thử toàn diện hệ thống

**Files:**
- Modify: `package.json`
- Test: Full test suite

- [ ] **Step 1: Cập nhật package.json để đưa `tests/performance-optimizations.test.mjs` vào script `test`**

- [ ] **Step 2: Chạy toàn bộ test suite**

Run: `npm test`
Expected: 100% PASS, 0 fail.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "test: add performance optimizations test suite to npm test"
```
