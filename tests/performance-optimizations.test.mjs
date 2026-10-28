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

test("middleware only runs schema check outside of production", () => {
  const middleware = read("utils/supabase/middleware.ts");
  assert.match(
    middleware,
    /if\s*\(\s*process\.env\.NODE_ENV\s*!==\s*["']production["']\s*&&\s*\(isProtectedPath\s*\|\|\s*isLoginPage\)\s*\)/,
    "Schema check in middleware must only run when NODE_ENV !== production"
  );
});

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
    /Promise\.all\(\[\s*categoryQuery,\s*countQueryBuilder,\s*postsQueryBuilder,?\s*\]\)/,
    "News page must run category, count and post list queries concurrently"
  );
});
