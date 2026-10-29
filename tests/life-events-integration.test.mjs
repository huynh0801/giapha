import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("MemberDetailContent and member detail page integrate PersonLifeTimeline", () => {
  const contentCode = fs.readFileSync(path.join(root, "components/MemberDetailContent.tsx"), "utf8");
  assert.match(contentCode, /PersonLifeTimeline/);

  const pageCode = fs.readFileSync(path.join(root, "app/dashboard/[familySlug]/members/[id]/page.tsx"), "utf8");
  assert.match(pageCode, /getPersonLifeEventsAction|lifeEvents/);
});
