import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("public login page contains heritage elements and password visibility toggle", () => {
  const loginPage = read("app/login/page.tsx");

  // Heritage brand assets and decorative background patterns
  assert.match(loginPage, /\/images\/landing\/logo\.png/);
  assert.match(loginPage, /Cây có cội mới trổ cành xanh ngọn/);
  assert.match(loginPage, /Nước có nguồn mới tỏa nhánh muôn phương/);
  assert.match(loginPage, /\/images\/landing\/decorate1\.png/);
  assert.match(loginPage, /\/images\/landing\/decorate2\.png/);

  // No heavy split-screen left showcase banner
  assert.doesNotMatch(loginPage, /Bảo Mật Tôn Nghiêm/);

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
