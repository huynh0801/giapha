import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("admin families page integrates request list tab and approval actions", () => {
  const adminPage = read("app/admin/families/page.tsx");
  const requestsList = read("components/admin/AdminFamilyRequestsList.tsx");

  // Admin page integration
  assert.match(adminPage, /AdminFamilyRequestsList/);
  assert.match(adminPage, /getAdminFamilyCreationRequests/);
  assert.match(adminPage, /Yêu cầu tạo gia tộc|Yêu cầu tạo dòng họ/);

  // List component
  assert.match(requestsList, /approveFamilyCreationAction/);
  assert.match(requestsList, /rejectFamilyCreationAction/);
  assert.match(requestsList, /Phê duyệt/);
  assert.match(requestsList, /Từ chối/);
});
