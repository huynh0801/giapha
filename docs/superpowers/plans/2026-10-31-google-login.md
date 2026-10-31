# Triển Khai Chức Năng Đăng Nhập Bằng Google (Google Login)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai tính năng đăng nhập và đăng ký bằng Google (Google OAuth) cho người dùng tại trang `/login`, tự động đồng bộ hồ sơ (`profiles`), tôn trọng trạng thái khóa tài khoản và đảm bảo an toàn chuyển hướng.

**Architecture:** Sử dụng kiến trúc tiêu chuẩn Supabase SSR PKCE flow trên Next.js 16 App Router:
- Nút "Tiếp tục với Google" trên `/login` kích hoạt `supabase.auth.signInWithOAuth`.
- Route Handler `app/auth/callback/route.ts` xử lý mã callback PKCE, kiểm tra quyền truy cập (`is_active`), đồng bộ avatar & họ tên từ Google vào `profiles`, và chuyển hướng người dùng an toàn.
- Cập nhật dummy fallback trong `utils/supabase/client.ts` để phòng ngừa lỗi môi trường.

**Tech Stack:** Next.js 16 (App Router), React 19, `@supabase/ssr`, Tailwind CSS 4, Node.js Test Runner.

## Global Constraints

- Không import trực tiếp `@supabase/supabase-js` trong `app/login/page.tsx` (dùng wrapper `@/utils/supabase/client`).
- Đảm bảo 100% test hiện có trong bộ test (`tests/login-redesign.test.mjs`, `tests/pwa-and-auth-redirect.test.mjs`, ...) tiếp tục pass.
- Chống lỗ hổng Open Redirect: Luôn xác thực tham số `next` chỉ là relative path nội bộ an toàn.
- Tài khoản có `is_active === false` phải bị thu hồi phiên và chuyển hướng về `/login?error=account_locked`.

---

### Task 1: Cập Nhật Fallback Client & Xây Dựng Route Handler `/auth/callback`

**Files:**
- Modify: `utils/supabase/client.ts`
- Create: `app/auth/callback/route.ts`
- Test: `tests/google-auth.test.mjs`

**Interfaces:**
- Consumes: `@/utils/supabase/server` (`createClient`), `@/utils/supabase/client` (`createClient`).
- Produces: `GET(request: Request): Promise<NextResponse>` tại `app/auth/callback/route.ts`.

- [ ] **Step 1: Viết test cho Route Handler và Client Fallback trong `tests/google-auth.test.mjs`**

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf-8");
}

test("utils/supabase/client provides signInWithOAuth in fallback client", () => {
  const clientCode = read("utils/supabase/client.ts");
  assert.match(clientCode, /signInWithOAuth/);
});

test("auth callback route exchanges code for session and handles security", () => {
  const callbackCode = read("app/auth/callback/route.ts");
  assert.match(callbackCode, /export async function GET/);
  assert.match(callbackCode, /exchangeCodeForSession/);
  assert.match(callbackCode, /is_active/);
  assert.match(callbackCode, /account_locked/);
  assert.match(callbackCode, /avatar_url/);
});
```

- [ ] **Step 2: Chạy test để xác nhận test thất bại**

Run: `node --test tests/google-auth.test.mjs`
Expected: FAIL (tệp hoặc code chưa tồn tại).

- [ ] **Step 3: Cập nhật `utils/supabase/client.ts` bổ sung `signInWithOAuth` vào fallback client**

Trong `utils/supabase/client.ts`:
```typescript
        signInWithOAuth: async () => ({
          data: null,
          error: new Error("Missing Supabase configuration"),
        }),
```

- [ ] **Step 4: Tạo Route Handler `app/auth/callback/route.ts`**

Tạo tệp `app/auth/callback/route.ts` với đầy đủ logic:
- Đổi code lấy session qua `exchangeCodeForSession(code)`.
- Hàm `getSafeRedirectTarget(target: string | null): string` kiểm tra URL bắt đầu bằng `/`, không chứa `//`, `://`, không trỏ về `/login`.
- Lấy profile từ Supabase, nếu `profile?.is_active === false` thì gọi `signOut()` và redirect về `${origin}/login?error=account_locked`.
- Nếu `profile` thiếu `avatar_url` hoặc `full_name`, cập nhật từ `user.user_metadata`.
- Redirect về `${origin}${safeNext}`.

- [ ] **Step 5: Chạy test để kiểm tra vượt qua**

Run: `node --test tests/google-auth.test.mjs`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add utils/supabase/client.ts app/auth/callback/route.ts tests/google-auth.test.mjs
git commit -m "feat(auth): add auth callback route handler and client oauth fallback"
```

---

### Task 2: Tích Hợp Nút "Tiếp Tục Với Google" Vào Trang `/login`

**Files:**
- Modify: `app/login/page.tsx`
- Modify: `tests/google-auth.test.mjs`

**Interfaces:**
- Consumes: `createClient` từ `@/utils/supabase/client`.
- Produces: Giao diện đăng nhập Google tại `app/login/page.tsx`.

- [ ] **Step 1: Bổ sung assertion kiểm tra UI vào `tests/google-auth.test.mjs`**

```javascript
test("public login page contains Google OAuth button, icon, and safe error handling", () => {
  const loginPage = read("app/login/page.tsx");
  assert.match(loginPage, /Tiếp tục với Google/);
  assert.match(loginPage, /signInWithOAuth/);
  assert.match(loginPage, /oauth_error/);
  assert.match(loginPage, /account_locked/);
  assert.doesNotMatch(loginPage, /@supabase\/supabase-js/);
});
```

- [ ] **Step 2: Chạy test để xác nhận test thất bại**

Run: `node --test tests/google-auth.test.mjs`
Expected: FAIL (chưa có nút Google).

- [ ] **Step 3: Cập nhật `app/login/page.tsx`**

1. Import `createClient` từ `@/utils/supabase/client`.
2. Tạo component hoặc SVG cho biểu tượng Google đa sắc chuẩn.
3. Bổ sung state `oauthLoading` (boolean).
4. Thêm hàm `handleGoogleLogin`:
   - Xác định `next` URL từ `new URLSearchParams(window.location.search).get("next")`.
   - Tạo URL chuyển tiếp: `${window.location.origin}/auth/callback${nextParam ? `?next=${encodeURIComponent(nextParam)}` : ""}`.
   - Gọi `const supabase = createClient(); await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } })`.
5. Bổ sung phân cách *"Hoặc"* và nút bấm "Tiếp tục với Google" bên dưới biểu mẫu.
6. Đọc query param `error` khi load trang để hiển thị thông báo lỗi tiếng Việt tương ứng (`account_locked`, `oauth_error`).

- [ ] **Step 4: Chạy test để kiểm tra vượt qua**

Run: `node --test tests/google-auth.test.mjs`
Expected: PASS.

- [ ] **Step 5: Chạy kiểm thử hồi quy `tests/login-redesign.test.mjs`**

Run: `node --test tests/login-redesign.test.mjs`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/login/page.tsx tests/google-auth.test.mjs
git commit -m "feat(auth): integrate Google sign in button on login page"
```

---

### Task 3: Tích Hợp Vào Kịch Bản Kiểm Thử Toàn Cục & Kiểm Tra Hoàn Tất

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Cập nhật `package.json` thêm `tests/google-auth.test.mjs` vào lệnh `npm test`**
- [ ] **Step 2: Chạy toàn bộ test suite dự án**

Run: `npm test`
Expected: Tất cả bài test (bao gồm 127 bài cũ + bài mới) đều PASS 100%.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "test: add google-auth test to test script"
```
