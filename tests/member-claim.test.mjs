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
