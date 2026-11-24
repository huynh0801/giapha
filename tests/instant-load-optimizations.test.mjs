import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { isCacheFresh } from "../utils/cache/genealogy-idb.ts";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("app/page.tsx uses ISR revalidate instead of force-dynamic", () => {
  const pageCode = read("app/page.tsx");
  assert.ok(
    !pageCode.includes('dynamic = "force-dynamic"'),
    "app/page.tsx must not use force-dynamic"
  );
  assert.match(
    pageCode,
    /export\s+const\s+revalidate\s*=\s*\d+;/,
    "app/page.tsx must export const revalidate = <seconds> for Edge CDN caching"
  );
  assert.ok(
    !pageCode.includes("getCurrentUserAction()"),
    "app/page.tsx should not block server rendering on getCurrentUserAction"
  );
});

test("Heritage streaming loading skeleton exists for family dashboard", () => {
  const loadingPath = "app/dashboard/[familySlug]/loading.tsx";
  assert.ok(fs.existsSync(loadingPath), "app/dashboard/[familySlug]/loading.tsx must exist");
  const loadingCode = read(loadingPath);
  assert.match(loadingCode, /HeritageFrame/, "loading.tsx must use HeritageFrame");
  assert.match(loadingCode, /BackgroundDecor/, "loading.tsx must render BackgroundDecor");
  assert.match(loadingCode, /animate-pulse/, "loading.tsx must contain skeleton animation classes");
});

test("utils/cache/genealogy-idb.ts exports required IndexedDB cache utilities", () => {
  const idbPath = "utils/cache/genealogy-idb.ts";
  assert.ok(fs.existsSync(idbPath), "utils/cache/genealogy-idb.ts must exist");
  const idbCode = read(idbPath);
  assert.match(idbCode, /export\s+async\s+function\s+saveFamilyTreeCache/);
  assert.match(idbCode, /export\s+async\s+function\s+getFamilyTreeCache/);
  assert.match(idbCode, /export\s+async\s+function\s+clearFamilyTreeCache/);
  assert.match(idbCode, /export\s+function\s+isCacheFresh/);
});

test("isCacheFresh correctly validates timestamp age", () => {
  const now = Date.now();
  const freshTime = now - 1000 * 60 * 30; // 30 minutes ago
  const staleTime = now - 1000 * 60 * 60 * 5; // 5 hours ago

  assert.equal(isCacheFresh(freshTime), true, "30-minute old cache should be fresh");
  assert.equal(isCacheFresh(staleTime), false, "5-hour old cache should be stale");
  assert.equal(isCacheFresh(0), false, "0 timestamp should be invalid");
});

test("DashboardViews persists tree and member data to IndexedDB cache", () => {
  const viewsCode = read("components/DashboardViews.tsx");
  assert.match(
    viewsCode,
    /saveFamilyTreeCache/,
    "DashboardViews must import and invoke saveFamilyTreeCache"
  );
  assert.match(
    viewsCode,
    /familyId,\s*treeId,\s*persons,\s*relationships/,
    "DashboardViews must pass familyId, treeId, persons, relationships"
  );
});

test("Critical navigation links configure prefetch={true} for instant transitions", () => {
  const headerCode = read("components/dashboard/HeritagePageHeader.tsx");
  assert.match(
    headerCode,
    /prefetch=\{true\}/,
    "HeritagePageHeader back link must have prefetch={true}"
  );

  const dashboardCode = read("app/dashboard/[familySlug]/page.tsx");
  assert.match(
    dashboardCode,
    /prefetch=\{true\}/,
    "FeatureCard link must have prefetch={true}"
  );
});

test("Server-side in-memory cache getCachedFamilyTreeData is integrated into members and dashboard pages", () => {
  const queriesCode = read("utils/supabase/queries.ts");
  assert.match(
    queriesCode,
    /export\s+const\s+getCachedFamilyTreeData\s*=/,
    "queries.ts must export getCachedFamilyTreeData"
  );
  assert.match(
    queriesCode,
    /unstable_cache/,
    "getCachedFamilyTreeData must use unstable_cache"
  );

  const membersCode = read("app/dashboard/[familySlug]/members/page.tsx");
  assert.match(
    membersCode,
    /getCachedFamilyTreeData\(context\.family\.id,\s*context\.tree\.id\)/,
    "members page must use getCachedFamilyTreeData"
  );

  const dashboardCode = read("app/dashboard/[familySlug]/page.tsx");
  assert.match(
    dashboardCode,
    /getCachedFamilyTreeData\(context\.family\.id,\s*context\.tree\.id\)/,
    "dashboard page must use getCachedFamilyTreeData"
  );
});
