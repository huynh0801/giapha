import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf-8");
}

test("DeleteFamilyModal component is properly defined with safety confirmation", () => {
  const modalPath = "components/admin/DeleteFamilyModal.tsx";
  assert.ok(fs.existsSync(path.join(root, modalPath)), "DeleteFamilyModal.tsx should exist");
  const modalCode = read(modalPath);

  assert.match(modalCode, /DeleteFamilyModal/);
  assert.match(modalCode, /Xác nhận xóa dòng họ|Xóa dòng họ/);
  assert.match(modalCode, /Trash2|AlertTriangle/);
  assert.match(modalCode, /confirmation/i);
  assert.match(modalCode, /disabled=\{/);
  assert.match(modalCode, /Loader2/);
  assert.match(modalCode, /onClose/);
  assert.match(modalCode, /onConfirm/);
});

test("AdminFamilyDashboard integrates trash button in table and triggers DeleteFamilyModal", () => {
  const dashboardCode = read("components/AdminFamilyDashboard.tsx");

  assert.match(dashboardCode, /DeleteFamilyModal/);
  assert.match(dashboardCode, /familyToDelete/);
  assert.match(dashboardCode, /setFamilyToDelete/);
  assert.match(dashboardCode, /handleConfirmDelete/);
  assert.match(dashboardCode, /title=\{`Xóa dòng họ \$\{family\.name\}`\}/);
});
