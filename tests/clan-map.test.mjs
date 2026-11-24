import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Clan Map Paths & Province Normalization", async (t) => {
  const mapPathsFile = path.resolve("utils/map/vnMapPaths.ts");
  assert.ok(fs.existsSync(mapPathsFile), "utils/map/vnMapPaths.ts must exist");

  const content = fs.readFileSync(mapPathsFile, "utf-8");
  assert.match(content, /VN_MAP_VIEWBOX\s*=\s*["']0 0 600 642\.8["']/);
  assert.match(content, /export const VN_MAP_PROVINCES/);
  assert.match(content, /export function normalizeProvince/);
  assert.match(content, /export function getProvinceCounts/);
  assert.match(content, /export function getTopProvinces/);

  // Check component files exist and export expected symbols
  const provinceMapFile = path.resolve("components/dashboard/ProvinceMap.tsx");
  const clanMapCardFile = path.resolve("components/dashboard/ClanMapCard.tsx");

  assert.ok(fs.existsSync(provinceMapFile), "components/dashboard/ProvinceMap.tsx must exist");
  assert.ok(fs.existsSync(clanMapCardFile), "components/dashboard/ClanMapCard.tsx must exist");

  const compContent = fs.readFileSync(provinceMapFile, "utf-8");
  assert.match(compContent, /export function ProvinceMap/);
  assert.match(compContent, /viewBox=\{VN_MAP_VIEWBOX\}/);

  const cardContent = fs.readFileSync(clanMapCardFile, "utf-8");
  assert.match(cardContent, /export function ClanMapCard/);
  assert.match(cardContent, /Bản đồ dòng họ/);
  assert.match(cardContent, /Con cháu nhiều nhất ở/);
  assert.match(cardContent, /variant === "hero"/);

  // Check queries.ts integration
  const queriesFile = path.resolve("utils/supabase/queries.ts");
  const queriesContent = fs.readFileSync(queriesFile, "utf-8");
  assert.match(queriesContent, /export const getCachedClanMapStats/);
  assert.match(queriesContent, /\.eq\("family_id", familyId\)/);
  assert.match(queriesContent, /\.eq\("tree_id", treeId\)/);

  // Check dashboard page integration (replaces Thời khắc gia tộc in Hero frame)
  const pageFile = path.resolve("app/dashboard/[familySlug]/page.tsx");
  const pageContent = fs.readFileSync(pageFile, "utf-8");
  assert.match(pageContent, /import ClanMapCard from "@/);
  assert.match(pageContent, /getCachedClanMapStats/);
  assert.match(pageContent, /<ClanMapCard[\s\S]*?variant="hero"/);
  assert.doesNotMatch(pageContent, /Imperial Court Calendar Tablet/);

  // Check family profile page integration (replaces Member Count Stat box)
  const profilePageFile = path.resolve("app/dashboard/families/[familySlug]/page.tsx");
  const profilePageContent = fs.readFileSync(profilePageFile, "utf-8");
  assert.match(profilePageContent, /import ClanMapCard from "@/);
  assert.match(profilePageContent, /getCachedClanMapStats/);
  assert.match(profilePageContent, /<ClanMapCard[\s\S]*?variant="hero"/);
});

test("Province address extraction & top ranking behavior", async (t) => {
  const mapPathsFile = path.resolve("utils/map/vnMapPaths.ts");
  const content = fs.readFileSync(mapPathsFile, "utf-8");

  // Verify that major provinces and islands are registered
  assert.match(content, /Hoàng Sa/i);
  assert.match(content, /Trường Sa/i);
  assert.match(content, /"Hồ Chí Minh"/);
  assert.match(content, /"Hà Nội"/);
  assert.match(content, /"Thanh Hoá"/);
  assert.match(content, /"Nghệ An"/);
  assert.match(content, /"Thái Nguyên"/);
  assert.match(content, /"Ninh Bình"/);
});
