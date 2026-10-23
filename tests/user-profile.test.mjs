import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.join(process.cwd(), relPath), "utf8");
}

test("middleware protects /profile route", () => {
  const middleware = read("utils/supabase/middleware.ts");
  assert.match(middleware, /isProfilePath/);
  assert.match(middleware, /pathname\.startsWith\("\/profile"\)/);
  assert.match(middleware, /isProtectedPath/);
});

test("user actions export updateUserProfileFull and changeAnyUserPassword", () => {
  const actions = read("app/actions/user.ts");
  assert.match(actions, /export async function updateUserProfileFull/);
  assert.match(actions, /export async function changeAnyUserPassword/);
  assert.match(actions, /full_name/);
  assert.match(actions, /phone_number/);
  assert.match(actions, /avatar_url/);
  assert.match(actions, /current_password/);
  assert.match(actions, /new_password/);
});

test("ProfileForm component contains required fields and integration", () => {
  const form = read("components/ProfileForm.tsx");
  assert.match(form, /updateUserProfileFull/);
  assert.match(form, /changeAnyUserPassword/);
  assert.match(form, /uploadAvatarAction/);
  assert.match(form, /Thông tin cá nhân/);
  assert.match(form, /Bảo mật & Đổi mật khẩu/);
  assert.match(form, /Họ và tên/);
  assert.match(form, /Số điện thoại/);
});

test("profile page integrates header, form, families list, and footer", () => {
  const page = read("app/profile/page.tsx");
  assert.match(page, /LandingHeader/);
  assert.match(page, /ProfileForm/);
  assert.match(page, /LandingFooter/);
  assert.match(page, /getAccessibleFamilies/);
  assert.match(page, /redirect\("\/login\?next=\/profile"\)/);
  assert.match(page, /Dòng họ của bạn/);
});

test("header includes link to /profile with Hồ sơ cá nhân", () => {
  const header = read("components/landing/LandingHeader.tsx");
  assert.match(header, /href="\/profile"/);
  assert.match(header, /Hồ sơ cá nhân/);
});
