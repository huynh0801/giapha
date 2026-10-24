import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("HeritagePageHeader component file exists and exports default function", () => {
  const filePath = "components/dashboard/HeritagePageHeader.tsx";
  assert.ok(fs.existsSync(filePath), "File components/dashboard/HeritagePageHeader.tsx should exist");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  assert.ok(fileContent.includes("export default function HeritagePageHeader"), "Should export HeritagePageHeader");
  assert.ok(fileContent.includes("familySlug"), "Should handle familySlug");
  assert.ok(fileContent.includes("title"), "Should handle title");
  assert.ok(fileContent.includes("SVN-Studio Brush"), "Should apply heritage font SVN-Studio Brush");
});
