import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("next.config.ts includes OWASP security headers", () => {
  const configContent = fs.readFileSync("next.config.ts", "utf8");
  assert.match(configContent, /X-Frame-Options/);
  assert.match(configContent, /DENY/);
  assert.match(configContent, /X-Content-Type-Options/);
  assert.match(configContent, /nosniff/);
  assert.match(configContent, /Strict-Transport-Security/);
  assert.match(configContent, /Permissions-Policy/);
});

test("app/actions/storage.ts deleteAvatarAction enforces authentication", () => {
  const storageContent = fs.readFileSync("app/actions/storage.ts", "utf8");
  assert.match(storageContent, /export async function deleteAvatarAction/);
  assert.match(storageContent, /const user = await getUser\(\)/);
  assert.match(storageContent, /if \(!user\) \{/);
});

test("app/api/news/search/route.ts sanitizes query against injection characters", () => {
  const searchRouteContent = fs.readFileSync("app/api/news/search/route.ts", "utf8");
  assert.match(searchRouteContent, /replace\(\/\[,\(\)"'\\\\%\]\/g/);
});

test("app/actions/blog.ts sanitizeBlogContent strips dangerous tags and javascript protocols", () => {
  const blogContent = fs.readFileSync("app/actions/blog.ts", "utf8");
  assert.match(blogContent, /<iframe\\b/);
  assert.match(blogContent, /<object\\b/);
  assert.match(blogContent, /<embed\\b/);
  assert.match(blogContent, /<svg\\b/);
  assert.match(blogContent, /href\\s\*=\\s\*\(\['"\]\)\\s\*javascript:/);
});
