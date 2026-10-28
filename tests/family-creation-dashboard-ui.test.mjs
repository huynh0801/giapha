import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("dashboard integrates create family request modal, status card, and button", () => {
  const dashboard = read("app/dashboard/page.tsx");
  const modal = read("components/dashboard/CreateFamilyRequestModal.tsx");
  const statusCard = read("components/dashboard/FamilyRequestStatusCard.tsx");

  // Dashboard page integration
  assert.match(dashboard, /CreateFamilyRequestModal/);
  assert.match(dashboard, /FamilyRequestStatusCard/);
  assert.match(dashboard, /getUserActiveFamilyCreationRequest/);

  // Modal component
  assert.match(modal, /Tên Dòng Họ|Tên dòng họ/);
  assert.match(modal, /Số Điện Thoại|Số điện thoại/);
  assert.match(modal, /Quê Quán|Quê quán/);
  assert.match(modal, /requestFamilyCreationAction/);

  // Status card component
  assert.match(statusCard, /Đang chờ xét duyệt|Đang chờ duyệt/);
  assert.match(statusCard, /cancelFamilyCreationAction/);
});
