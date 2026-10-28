# Kế Hoạch Triển Khai: Tái Thiết Kế Giao Diện Đăng Nhập & Đăng Ký (Heritage Split-Screen Login)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thiết kế lại toàn diện giao diện trang Đăng nhập thành viên (`/login`) và Cổng Quản Trị Hệ Thống (`/admin/login`) sang phong cách Di Sản Hoàng Gia Việt Nam với bố cục chia đôi màn hình (Split-Screen), bổ sung nút ẩn/hiện mật khẩu và tối ưu hiển thị responsive.

**Architecture:** Sử dụng Tailwind CSS, Lucide Icons, Next.js Image và Framer Motion để tạo bố cục Split-Screen: cột trái là bảng di sản tôn vinh cội nguồn gia tộc với logo và câu đối; cột phải là biểu mẫu tương tác `HeritageFrame` với tab chuyển đổi Đăng nhập / Đăng ký mượt mà; duy trì các Server Actions an toàn và các kiểm tra test bảo mật.

**Tech Stack:** Next.js 16 (App Router, Server Actions), Tailwind CSS, Framer Motion, Lucide React, Node.js Test Runner.

## Global Constraints
- Bảo toàn đầy đủ 88 bài test hiện có (`npm test`).
- Không import client Supabase trong các file client component (`app/login/page.tsx`, `app/admin/login/page.tsx`).
- Giữ nguyên `window.location.href = result.redirect || "/"` và `process.env.NODE_ENV !== "production"`.
- Giữ nguyên chuỗi nhận diện bắt buộc `Đăng nhập admin` trong `app/admin/login/page.tsx`.
- Không chứa ký tự lỗi font / mojibake.

---

### Task 1: Tạo bộ kiểm thử kỹ thuật `tests/login-redesign.test.mjs`

**Files:**
- Create: `tests/login-redesign.test.mjs`
- Test: `tests/login-redesign.test.mjs`

- [ ] **Step 1: Viết test cho thiết kế mới**

Tạo `tests/login-redesign.test.mjs`:
```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("public login page contains heritage elements and password visibility toggle", () => {
  const loginPage = read("app/login/page.tsx");

  // Heritage brand assets
  assert.match(loginPage, /\/images\/landing\/logo\.png/);
  assert.match(loginPage, /Cây có cội mới trổ cành xanh ngọn/);
  assert.match(loginPage, /Nước có nguồn mới tỏa nhánh muôn phương/);

  // Password toggle
  assert.match(loginPage, /showPassword/);
  assert.match(loginPage, /Eye/);
  assert.match(loginPage, /EyeOff/);

  // Security and routing constraints
  assert.doesNotMatch(loginPage, /@supabase\/supabase-js/);
  assert.match(loginPage, /window\.location\.href = result\.redirect \|\| "\/"/);
  assert.match(loginPage, /process\.env\.NODE_ENV\s*!==\s*["']production["']/);
});

test("admin login page contains imperial authority branding and maintains admin requirements", () => {
  const adminLoginPage = read("app/admin/login/page.tsx");

  // Admin requirements
  assert.match(adminLoginPage, /Đăng nhập admin/);
  assert.match(adminLoginPage, /Cổng Quản Trị/i);
  assert.match(adminLoginPage, /showPassword/);
  assert.doesNotMatch(adminLoginPage, /@supabase\/supabase-js/);
});
```

- [ ] **Step 2: Chạy test xác nhận thất bại (Red)**

Run: `node --test tests/login-redesign.test.mjs`
Expected: FAIL do chưa cập nhật giao diện mới.

- [ ] **Step 3: Commit file test**

```bash
git add tests/login-redesign.test.mjs
git commit -m "test: add test suite for heritage login redesign"
```

---

### Task 2: Thiết kế lại toàn diện giao diện `app/login/page.tsx`

**Files:**
- Modify: `app/login/page.tsx`
- Test: `tests/login-redesign.test.mjs`
- Test: `tests/pwa-and-auth-redirect.test.mjs`

- [ ] **Step 1: Viết mã nguồn giao diện mới cho `app/login/page.tsx`**

Bao gồm:
- Khung chia đôi Split-Screen: Cột trái (Hero Di Sản) ẩn trên mobile, hiện trên `lg:flex`.
- Cột phải: Khung di sản `HeritageFrame` hoặc viền hoàng gia `#deb887`.
- Nút bấm xem/ẩn mật khẩu `showPassword` / `showConfirmPassword` với icon `Eye` / `EyeOff`.
- Tab chuyển đổi Đăng Nhập / Đăng Ký mượt mà.
- Hiển thị thông báo lỗi/thành công bằng tiếng Việt chuẩn mực.

- [ ] **Step 2: Chạy test kiểm chứng (Green)**

Run: `node --test tests/login-redesign.test.mjs tests/pwa-and-auth-redirect.test.mjs tests/security-hardening.test.mjs`
Expected: PASS toàn bộ.

- [ ] **Step 3: Commit**

```bash
git add app/login/page.tsx
git commit -m "feat(ui): redesign member login and registration with heritage split-screen layout"
```

---

### Task 3: Thiết kế lại toàn diện giao diện `app/admin/login/page.tsx`

**Files:**
- Modify: `app/admin/login/page.tsx`
- Test: `tests/login-redesign.test.mjs`
- Test: `tests/multitenant-private.test.mjs`

- [ ] **Step 1: Viết mã nguồn giao diện mới cho `app/admin/login/page.tsx`**

Bao gồm:
- Cột trái: Giới thiệu hệ thống quản trị gia tộc, bảo mật đa khách hàng, ấn tín hoàng gia.
- Cột phải: Form đăng nhập quản trị viên tối nghiêm, nhãn `Đăng nhập admin`, nút ẩn/hiện mật khẩu.
- Bảo toàn redirect an toàn và không dùng client supabase.

- [ ] **Step 2: Chạy test kiểm chứng (Green)**

Run: `node --test tests/login-redesign.test.mjs tests/multitenant-private.test.mjs`
Expected: PASS toàn bộ.

- [ ] **Step 3: Commit**

```bash
git add app/admin/login/page.tsx
git commit -m "feat(ui): redesign admin login portal with royal imperial authority theme"
```

---

### Task 4: Tích hợp vào npm test script và kiểm thử toàn hệ thống

**Files:**
- Modify: `package.json`
- Test: Full test suite

- [ ] **Step 1: Cập nhật package.json để đưa `tests/login-redesign.test.mjs` vào script test**
- [ ] **Step 2: Chạy toàn bộ test suite (`npm test`)**
- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "test: add login redesign suite to npm test"
```
