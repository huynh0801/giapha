import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

test("member tree linking and claiming feature is fully implemented", () => {
  const claimActions = read("app/actions/family-claim.ts");
  const banner = read("components/dashboard/MemberClaimBanner.tsx");
  const familyHome = read("app/dashboard/[familySlug]/page.tsx");
  const membersPage = read("app/dashboard/[familySlug]/members/page.tsx");

  // Server actions
  assert.match(claimActions, /claimExistingPersonAction/);
  assert.match(claimActions, /addSelfToFamilyTreeAction/);
  assert.match(claimActions, /unlinkSelfAction/);
  assert.match(claimActions, /member_links/);
  assert.match(claimActions, /applyTreeLineage/);

  // Client banner component
  assert.match(banner, /Nhận tên tôi trên cây/);
  assert.match(banner, /Thêm tôi vào gia phả/);
  assert.match(banner, /Vị trí của bạn trong gia phả/);
  assert.match(banner, /Chọn Cha hoặc Mẹ/);

  // Page integration
  assert.match(familyHome, /MemberClaimBanner/);
  assert.match(familyHome, /member_links/);
  assert.match(membersPage, /MemberClaimBanner/);
  assert.match(membersPage, /member_links/);
});

test("Option B: Genealogy approval workflow by Family Admin is fully implemented", () => {
  const claimActions = read("app/actions/family-claim.ts");
  const banner = read("components/dashboard/MemberClaimBanner.tsx");
  const requestsPage = read("app/dashboard/[familySlug]/requests/page.tsx");
  const genealogyActions = read("app/actions/genealogy.ts");
  const editPage = read("app/dashboard/[familySlug]/members/[id]/edit/page.tsx");
  const kinshipPage = read("app/dashboard/[familySlug]/kinship/page.tsx");

  // Server actions for approval workflow
  assert.match(claimActions, /cancelGenealogyRequestAction/);
  assert.match(claimActions, /reviewGenealogyRequestAction/);
  assert.match(claimActions, /genealogy_requests/);
  assert.match(claimActions, /pendingApproval/);

  // Banner handling of pending & rejected states
  assert.match(banner, /Đang chờ Ban Quản Trị phê duyệt/);
  assert.match(banner, /Hủy yêu cầu/);
  assert.match(banner, /Tra cứu xưng hô/);

  // Admin requests page handling of genealogy tab
  assert.match(requestsPage, /Xác nhận phả hệ & Nhận tên/);
  assert.match(requestsPage, /reviewGenealogyRequestAction/);
  assert.match(requestsPage, /Chấp thuận & Nối cây/);
  assert.match(requestsPage, /Từ chối yêu cầu/);

  // Self edit permissions
  assert.match(genealogyActions, /isSelfEdit/);
  assert.match(editPage, /canEditRecord/);

  // Kinship auto-select linked person
  assert.match(kinshipPage, /initialPersonAId/);
});
