import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

test("login keeps user on home page without auto-entering admin area", () => {
  const middleware = read("utils/supabase/middleware.ts");
  const authAction = read("app/actions/auth.ts");
  const loginPage = read("app/login/page.tsx");

  // Middleware redirects logged-in users away from /login back to home page ("/")
  assert.match(middleware, /defaultTarget = isAdminLoginPage \? "\/admin" : "\/"/);

  // Auth server action defaults redirect to "/"
  assert.match(authAction, /let redirect = "\/"/);

  // Client login page falls back to "/"
  assert.match(loginPage, /window\.location\.href = result\.redirect \|\| "\/"/);
});

test("metadata uses the current logo and royal theme colors", () => {
  const layout = read("app/layout.tsx");

  // Logo in icons, og:image, and apple-touch-icon
  assert.match(layout, /\/images\/landing\/logo\.png/);
  assert.match(layout, /themeColor: "#8c1d1d"/);
  assert.match(layout, /manifest: "\/site\.webmanifest"/);
  assert.match(layout, /appleWebApp/);

  // Verify physical logo file exists
  assert.ok(fs.existsSync(path.join(root, "public", "images", "landing", "logo.png")));
});

test("PWA manifest, icons and service worker are properly configured", () => {
  const manifestRaw = read("public/site.webmanifest");
  const manifest = JSON.parse(manifestRaw);

  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.theme_color, "#8c1d1d");
  assert.equal(manifest.background_color, "#f5e7c7");
  assert.ok(manifest.icons.some((i) => i.src === "/android-chrome-192x192.png"));
  assert.ok(manifest.icons.some((i) => i.src === "/android-chrome-512x512.png"));
  assert.ok(manifest.icons.some((i) => i.src === "/apple-touch-icon.png"));

  // Check generated icon files exist and are non-empty
  for (const icon of [
    "public/android-chrome-192x192.png",
    "public/android-chrome-512x512.png",
    "public/apple-touch-icon.png",
    "public/favicon-32x32.png",
  ]) {
    assert.ok(fs.existsSync(path.join(root, icon)), `${icon} must exist`);
    assert.ok(fs.statSync(path.join(root, icon)).size > 0, `${icon} must not be empty`);
  }

  // Service worker and registration
  assert.ok(fs.existsSync(path.join(root, "public", "sw.js")));
  assert.ok(fs.existsSync(path.join(root, "components", "PwaRegister.tsx")));
  const swContent = read("public/sw.js");
  assert.match(swContent, /self\.addEventListener\("install"/);
  assert.match(swContent, /self\.addEventListener\("fetch"/);
});
