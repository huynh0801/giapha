import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("schema does not define backdoor admin creation functions", () => {
  const schema = read("docs/schema.sql");

  assert.doesNotMatch(
    schema,
    /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.upsert_default_system_admin/i,
    "upsert_default_system_admin definition must be completely removed from schema.sql",
  );

  assert.doesNotMatch(
    schema,
    /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.upsert_default_admin/i,
    "upsert_default_admin definition must be completely removed from schema.sql",
  );
});

test("security hardening migration drops all backdoor admin functions", () => {
  const migration = read("supabase/migrations/20260722120000_security_hardening.sql");

  assert.match(
    migration,
    /DROP\s+FUNCTION\s+IF\s+EXISTS\s+public\.upsert_default_system_admin/i,
    "Migration must drop upsert_default_system_admin",
  );

  assert.match(
    migration,
    /DROP\s+FUNCTION\s+IF\s+EXISTS\s+public\.upsert_default_admin/i,
    "Migration must drop upsert_default_admin",
  );
});

test("family directory masks admin contacts for unauthenticated requests", () => {
  const schema = read("docs/schema.sql");
  const migration = read("supabase/migrations/20260722120000_security_hardening.sql");

  for (const [name, content] of [["schema.sql", schema], ["migration", migration]]) {
    assert.match(
      content,
      /auth\.uid\(\)\s+IS\s+NOT\s+NULL/i,
      `${name} must check auth.uid() IS NOT NULL before revealing admin contacts`,
    );
    assert.match(
      content,
      /Đăng nhập để xem thông tin liên hệ/,
      `${name} must show placeholder text for unauthenticated users`,
    );
  }
});

test("setup route and middleware block schema leakage in production", () => {
  const setupPage = read("app/setup/page.tsx");
  const middleware = read("utils/supabase/middleware.ts");
  const loginPage = read("app/login/page.tsx");

  assert.match(
    setupPage,
    /process\.env\.NODE_ENV\s*===\s*["']production["']/,
    "Setup page must check NODE_ENV === production",
  );
  assert.match(setupPage, /notFound\(\)/, "Setup page must call notFound() in production");

  assert.match(
    middleware,
    /process\.env\.NODE_ENV\s*!==\s*["']production["']/,
    "Middleware must only redirect to /setup outside of production",
  );

  assert.match(
    loginPage,
    /process\.env\.NODE_ENV\s*!==\s*["']production["']/,
    "Login page must only redirect to /setup outside of production",
  );
});

test("seed and schema contain no default hardcoded passwords or real admin emails", () => {
  const schema = read("docs/schema.sql");
  const seed = read("docs/seed.sql");

  assert.doesNotMatch(schema, /admin1234/, "schema.sql must not contain default admin password admin1234");
  assert.doesNotMatch(seed, /admin1234/, "seed.sql must not contain default admin password admin1234");
  assert.doesNotMatch(seed, /buikimxuyen68@gmail\.com/, "seed.sql must not contain personal admin email");
});

test("scripts contain no hardcoded fallback project credentials", () => {
  const scriptFiles = [
    "scripts/backup-full-database.mjs",
    "scripts/restore-from-backup.mjs",
    "scripts/restore-diepdung-and-blogs.mjs",
    "scripts/wipe-accessible-data.mjs",
  ];

  for (const file of scriptFiles) {
    if (fs.existsSync(path.join(root, file))) {
      const content = read(file);
      assert.doesNotMatch(
        content,
        /sb_publishable_[a-zA-Z0-9_\-]+/,
        `${file} must not contain hardcoded publishable key fallback`,
      );
      assert.doesNotMatch(
        content,
        /srsckyplvrwuweqbcegk/,
        `${file} must not contain hardcoded supabase project domain fallback`,
      );
    }
  }
});

test("auth surfaces use server actions and do not import client supabase", async () => {
  const loginPage = read("app/login/page.tsx");
  const adminLoginPage = read("app/admin/login/page.tsx");
  const logoutButton = read("components/LogoutButton.tsx");

  assert.doesNotMatch(
    loginPage,
    /from\s+["']@\/utils\/supabase\/client["']/,
    "app/login/page.tsx must not import client supabase",
  );
  assert.doesNotMatch(
    adminLoginPage,
    /from\s+["']@\/utils\/supabase\/client["']/,
    "app/admin/login/page.tsx must not import client supabase",
  );
  assert.doesNotMatch(
    logoutButton,
    /from\s+["']@\/utils\/supabase\/client["']/,
    "components/LogoutButton.tsx must not import client supabase",
  );

  const authActionsPath = path.join(root, "app/actions/auth.ts");
  assert.ok(fs.existsSync(authActionsPath), "app/actions/auth.ts must exist");
  const authActions = read("app/actions/auth.ts");
  assert.match(authActions, /["']use server["']/, "app/actions/auth.ts must have 'use server' directive");
  assert.match(authActions, /export\s+async\s+function\s+loginAction/, "app/actions/auth.ts must export loginAction");
  assert.match(authActions, /export\s+async\s+function\s+adminLoginAction/, "app/actions/auth.ts must export adminLoginAction");
  assert.match(authActions, /export\s+async\s+function\s+signUpAction/, "app/actions/auth.ts must export signUpAction");
  assert.match(authActions, /export\s+async\s+function\s+signOutAction/, "app/actions/auth.ts must export signOutAction");
});

test("all UI components are decoupled from client supabase", () => {
  const componentsDir = path.join(root, "components");
  const componentFiles = fs.readdirSync(componentsDir).filter(f => f.endsWith(".tsx") || f.endsWith(".ts"));

  for (const file of componentFiles) {
    const content = fs.readFileSync(path.join(componentsDir, file), "utf8");
    assert.doesNotMatch(
      content,
      /@\/utils\/supabase\/client/,
      `components/${file} must not import @/utils/supabase/client`,
    );
  }
});
