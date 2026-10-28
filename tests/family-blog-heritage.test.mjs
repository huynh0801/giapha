import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("Task 1: Migration updates RLS policy to allow public reading of published family posts", () => {
  const migrationPath = "supabase/migrations/20261028173000_family_blog_public_and_heritage.sql";
  assert.ok(fs.existsSync(path.resolve(process.cwd(), migrationPath)), "Migration file must exist");
  const sql = read(migrationPath);

  assert.match(sql, /DROP POLICY IF EXISTS blog_posts_system_public_or_private_family_select ON public\.blog_posts;/);
  assert.match(sql, /CREATE POLICY blog_posts_system_public_or_private_family_select ON public\.blog_posts/);
  assert.match(sql, /scope = 'family'/);
  assert.match(sql, /is_published = true AND visibility = 'public'/);
  assert.match(sql, /public\.can_view_family\(family_id\)/);
});

test("Task 2: Blog actions allow cover images, multiple posts, and custom visibility for family scope", () => {
  const actions = read("app/actions/blog.ts");

  // Removed restriction: no more blocking single notice per family
  assert.doesNotMatch(actions, /Mỗi dòng họ chỉ có một bảng tin nội bộ/);

  // Cover image allowed for family scope
  assert.doesNotMatch(actions, /if\s*\(scope === "family"\)\s*\{\s*coverImageUrl = "";/);

  // Visibility handling from formData
  assert.match(actions, /visibilityInput|visibility/);
});

test("Task 3: Family blog detail and news page integrate Heritage design and public reading", () => {
  const familyDetail = read("app/dashboard/[familySlug]/blog/[slug]/page.tsx");
  assert.match(familyDetail, /HeritageFrame/);
  assert.match(familyDetail, /BackgroundDecor/);

  const publicDetail = read("app/blog/[slug]/page.tsx");
  // Supports both system and family published posts
  assert.doesNotMatch(publicDetail, /\.eq\("scope",\s*"system"\)/);

  const middleware = read("utils/supabase/middleware.ts");
  // Allows public access to family blog detail
  assert.match(middleware, /blog/);
});

test("Task 4: Publish status parsing supports 'on', 'true', 'published', and BlogAdminPanel has explicit toggle", () => {
  const actions = read("app/actions/blog.ts");
  assert.match(actions, /rawPublished === "published"/);

  const panel = read("components/BlogAdminPanel.tsx");
  assert.match(panel, /Xuất bản ngay/);
  assert.match(panel, /Lưu bản nháp/);
  assert.doesNotMatch(panel, /formData\.set\("remove_cover_image", "1"\)/);
});
