import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("HeritageUI components are properly exported and contain expected styles", () => {
  const filePath = path.resolve("components/dashboard/HeritageUI.tsx");
  assert.ok(fs.existsSync(filePath), "components/dashboard/HeritageUI.tsx must exist");
  const content = fs.readFileSync(filePath, "utf8");

  assert.match(content, /export function HeritageFrame/, "HeritageFrame must be exported");
  assert.match(content, /export function HeritageBadge/, "HeritageBadge must be exported");
  assert.match(content, /export function HeritageStatCard/, "HeritageStatCard must be exported");
  assert.match(content, /#caa455/, "Must contain antique gold border color");
  assert.match(content, /#8c1d1d/, "Must contain imperial crimson color");
  assert.match(content, /#183b28/, "Must contain heritage jade color");
});
