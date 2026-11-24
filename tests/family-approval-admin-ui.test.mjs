import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("FamilyApprovalToggle component exists and connects to server action", () => {
  const comp = read("components/admin/FamilyApprovalToggle.tsx");

  assert.match(comp, /toggleFamilyApprovalAction/);
  assert.match(comp, /isFamilyApprovalRequired|initialEnabled/);
  assert.match(comp, /Bắt buộc duyệt|Tự do|Phê duyệt/i);
});

test("AdminFamiliesPage loads approval setting and renders FamilyApprovalToggle", () => {
  const page = read("app/admin/families/page.tsx");

  assert.match(page, /isFamilyApprovalRequired/);
  assert.match(page, /FamilyApprovalToggle/);
});
