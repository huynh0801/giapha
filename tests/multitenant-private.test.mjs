import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("admin session routing keeps logged-in admins out of the login loop", () => {
  const home = read("app/page.tsx");
  const middleware = read("utils/supabase/middleware.ts");

  assert.match(home, /href="\/admin"/);
  assert.doesNotMatch(home, /href="\/admin\/login"/);
  assert.match(middleware, /isAdminLoginPage/);
  assert.match(middleware, /isAdminPath \? "\/admin\/login" : "\/login"/);
  assert.match(middleware, /isAdminLoginPage \? "\/admin" : "\/dashboard"/);
});

test("schema keeps genealogy data private by default", () => {
  const schema = read("docs/schema.sql");
  const privateTables = [
    "families",
    "family_memberships",
    "family_trees",
    "persons",
    "person_details_private",
    "relationships",
    "custom_events",
    "documents",
  ];

  for (const table of privateTables) {
    assert.match(
      schema,
      new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY;`),
      `${table} must enable RLS`,
    );
  }

  for (const helper of [
    "is_system_admin",
    "has_family_role",
    "can_view_family",
    "can_edit_family",
    "can_manage_family",
  ]) {
    assert.match(schema, new RegExp(`CREATE OR REPLACE FUNCTION public\\.${helper}`));
  }

  assert.match(schema, /visibility public\.visibility_enum NOT NULL DEFAULT 'private'/);
  assert.match(schema, /documents_select_private/);
  assert.match(schema, /persons_select_private/);
  assert.match(schema, /relationships_select_private/);
});

test("new family workspace routes scope genealogy queries by family and tree", () => {
  const scopedFiles = [
    "app/dashboard/[familySlug]/members/page.tsx",
    "app/dashboard/[familySlug]/members/[id]/page.tsx",
    "app/dashboard/[familySlug]/members/[id]/edit/page.tsx",
    "app/dashboard/[familySlug]/stats/page.tsx",
    "app/dashboard/[familySlug]/events/page.tsx",
    "app/dashboard/[familySlug]/kinship/page.tsx",
    "app/dashboard/[familySlug]/lineage/page.tsx",
  ];

  for (const file of scopedFiles) {
    const source = read(file);
    assert.match(source, /\.eq\("family_id", context\.family\.id\)/, `${file} must filter family_id`);
    assert.match(source, /\.eq\("tree_id", context\.tree\.id\)/, `${file} must filter tree_id`);
  }
});

test("system admin and family admin content scopes stay separated", () => {
  const blogActions = read("app/actions/blog.ts");
  const adminBlogPage = read("app/admin/blog/page.tsx");
  const familyBlogPage = read("app/dashboard/[familySlug]/blog/page.tsx");
  const familyBlogDetail = read("app/dashboard/[familySlug]/blog/[slug]/page.tsx");
  const schema = read("docs/schema.sql");

  assert.match(blogActions, /saveScopedBlogPost\("system"/);
  assert.match(blogActions, /saveScopedBlogPost\("family"/);
  assert.match(blogActions, /profile\.role !== "system_admin"/);
  assert.match(blogActions, /context\?\.canEdit/);
  assert.match(adminBlogPage, /profile\.role !== "system_admin"/);
  assert.match(adminBlogPage, /Bài viết hệ thống/);
  assert.match(familyBlogPage, /\.eq\("scope", "family"\)/);
  assert.match(familyBlogPage, /\.eq\("family_id", context\.family\.id\)/);
  assert.match(familyBlogDetail, /\.eq\("scope", "family"\)/);
  assert.match(familyBlogDetail, /\.eq\("family_id", context\.family\.id\)/);
  assert.match(schema, /split_part\(name, '\/', 1\) = 'system'/);
  assert.match(schema, /Family admins can upload blog images/);
});

test("family workspace exposes family profile and tree management without system routes", () => {
  const familyHome = read("app/dashboard/[familySlug]/page.tsx");
  const aboutPage = read("app/dashboard/[familySlug]/about/page.tsx");
  const treesPage = read("app/dashboard/[familySlug]/trees/page.tsx");
  const familyActions = read("app/actions/family.ts");

  assert.match(familyHome, /\/about/);
  assert.match(familyHome, /\/blog/);
  assert.match(familyHome, /\/trees/);
  assert.match(aboutPage, /updateFamilyAction/);
  assert.match(aboutPage, /context\.canManage/);
  assert.match(treesPage, /createFamilyTreeAction/);
  assert.match(treesPage, /setPrimaryFamilyTreeAction/);
  assert.match(treesPage, /\.eq\("family_id", context\.family\.id\)/);
  assert.match(familyActions, /ensureFamilyManager/);
  assert.match(familyActions, /context\?\.canManage/);
});

test("family genealogy edits allow Super Admin globally and family admins locally", () => {
  const queries = read("utils/supabase/queries.ts");
  const schema = read("docs/schema.sql");
  const primaryAdminMigration = read(
    "supabase/migrations/20260706130000_family_primary_admin_roles.sql",
  );
  const memberAction = read("app/actions/member.ts");
  const familyAction = read("app/actions/family.ts");

  assert.match(queries, /const isFamilyAdmin =/);
  assert.match(queries, /canEdit: isFamilyAdmin/);
  assert.match(queries, /canManage: isFamilyAdmin/);
  assert.match(queries, /canManageAdmins: isPrimaryFamilyAdmin/);
  assert.match(queries, /getSystemAdminFlags/);
  assert.match(queries, /\.from\("families"\)\s+\.select\("\*"\)\s+\.eq\("status", "active"\)/);
  assert.match(queries, /canEdit: adminFlags\.canEdit \|\| flags\.canEdit/);
  assert.match(
    schema,
    /AS \$\$ SELECT public\.is_system_admin\(\) OR public\.has_family_role\(target_family_id, ARRAY\['family_admin'\]\); \$\$/,
  );
  assert.match(
    schema,
    /IF NOT public\.can_manage_family\(target_family_id\) THEN/,
  );
  assert.match(schema, /Family membership target must be an active account/);
  assert.match(schema, /Only Super Admin can manage Super Admin family access/);
  assert.match(primaryAdminMigration, /is_primary_admin/);
  assert.match(primaryAdminMigration, /can_manage_family_admins/);
  assert.match(primaryAdminMigration, /Cannot remove the last primary family admin/);
  assert.match(primaryAdminMigration, /Only Super Admin or the primary family admin can manage family admins/);
  assert.match(memberAction, /Super Admin hoặc Admin Dòng Họ/);
  assert.match(familyAction, /Admin d/);
});

test("admin users separate platform accounts from family membership control", () => {
  const schema = read("docs/schema.sql");
  const seed = read("docs/seed.sql");
  const adminUsersPage = read("app/admin/users/page.tsx");
  const adminUserList = read("components/AdminUserList.tsx");
  const userActions = read("app/actions/user.ts");

  assert.match(
    schema,
    /CREATE TYPE public\.platform_role_enum AS ENUM \('system_admin', 'member'\);/,
  );
  assert.match(
    schema,
    /CREATE TYPE public\.family_role_enum AS ENUM \('family_admin', 'member'\);/,
  );
  assert.match(schema, /COALESCE\(p\.role, 'member'::public\.platform_role_enum\) AS role/);
  assert.match(schema, /COALESCE\(p\.is_active, true\)/);
  assert.match(schema, /FROM auth\.users au\s+WHERE au\.id = target_user_id/);
  assert.match(seed, /FROM auth\.users au/);
  assert.match(seed, /family_admin_id/);
  assert.match(seed, /ON CONFLICT \(id\) DO UPDATE SET/);

  assert.doesNotMatch(adminUsersPage, /\.from\("families"\)/);
  assert.doesNotMatch(adminUsersPage, /\.from\("family_memberships"\)/);
  assert.match(adminUserList, /Platform role/);
  assert.doesNotMatch(adminUserList, /setUserFamilyMembership/);
  assert.doesNotMatch(adminUserList, /familyRoleLabels/);
  assert.match(userActions, /setUserFamilyMembership/);
  assert.match(userActions, /set_family_membership/);
});

test("super admin family deletion removes dependent tenant data first", () => {
  const migration = read("supabase/migrations/20260618170000_harden_delete_family_rpc.sql");
  const schema = read("docs/schema.sql");

  for (const source of [migration, schema]) {
    assert.match(source, /CREATE OR REPLACE FUNCTION public\.delete_family/);
    assert.match(source, /IF NOT public\.is_system_admin\(\) THEN/);
    assert.match(source, /DELETE FROM public\.relationships WHERE family_id = target_family_id;/);
    assert.match(source, /DELETE FROM public\.person_details_private WHERE family_id = target_family_id;/);
    assert.match(source, /DELETE FROM public\.persons WHERE family_id = target_family_id;/);
    assert.match(source, /DELETE FROM public\.family_trees WHERE family_id = target_family_id;/);
    assert.match(source, /DELETE FROM public\.family_memberships WHERE family_id = target_family_id;/);
    assert.match(source, /UPDATE public\.audit_logs\s+SET family_id = NULL\s+WHERE family_id = target_family_id;/);
    assert.match(source, /DELETE FROM public\.families\s+WHERE id = target_family_id;/);
  }
});

test("tree selection opens the correct genealogy workspace", () => {
  const membersPage = read("app/dashboard/[familySlug]/members/page.tsx");
  const newMemberPage = read("app/dashboard/[familySlug]/members/new/page.tsx");
  const detailPage = read("app/dashboard/[familySlug]/members/[id]/page.tsx");
  const editPage = read("app/dashboard/[familySlug]/members/[id]/edit/page.tsx");
  const treesPage = read("app/dashboard/[familySlug]/trees/page.tsx");
  const treeAlias = read("app/dashboard/[familySlug]/tree/page.tsx");
  const memberAction = read("app/actions/member.ts");

  assert.match(membersPage, /treeId\?: string/);
  assert.match(membersPage, /getFamilyContextBySlug\(familySlug, treeId\)/);
  assert.match(membersPage, /Đang mở: \{context\.tree\.name\}/);
  assert.match(newMemberPage, /resolvedSearchParams\?\.treeId/);
  assert.match(detailPage, /resolvedSearchParams\?\.treeId/);
  assert.match(editPage, /resolvedSearchParams\?\.treeId/);
  assert.match(treesPage, /\/members\?treeId=\$\{tree\.id\}/);
  assert.match(treeAlias, /redirect\(`\/dashboard\/\$\{familySlug\}\/trees`\)/);
  assert.match(memberAction, /getFamilyContextById\(familyId, treeId\)/);
});

test("family directory supports join requests and family-admin review", () => {
  const schema = read("docs/schema.sql");
  const dashboardPage = read("app/dashboard/page.tsx");
  const detailPage = read("app/dashboard/families/[familySlug]/page.tsx");
  const requestActions = read("app/actions/join-request.ts");
  const requestsPage = read("app/dashboard/[familySlug]/requests/page.tsx");
  const familyHome = read("app/dashboard/[familySlug]/page.tsx");

  assert.match(schema, /CREATE TYPE public\.family_directory_row/);
  assert.match(schema, /CREATE OR REPLACE FUNCTION public\.get_family_directory/);
  assert.doesNotMatch(schema, /AND NOT public\.is_system_admin\(\)/);
  assert.match(schema, /\) OR public\.is_system_admin\(\) AS has_active_membership/);
  assert.match(schema, /row_number\(\) OVER/);
  assert.doesNotMatch(schema, /OFFSET\s*\(/);
  assert.match(schema, /profiles_join_request_review_select/);
  assert.match(schema, /join_requests_self_update/);
  assert.match(schema, /p\.role = 'member'/);
  assert.match(dashboardPage, /requestJoinFamilyAction/);
  assert.match(dashboardPage, /visibility_filter/);
  assert.match(dashboardPage, /Gửi yêu cầu/);
  assert.match(detailPage, /Gửi yêu cầu tham gia/);
  assert.match(requestActions, /export async function requestJoinFamilyAction/);
  assert.match(requestActions, /profile\.role !== "member"/);
  assert.match(requestActions, /\.from\("join_requests"\)\.upsert/);
  assert.match(requestActions, /export async function reviewJoinRequestAction/);
  assert.match(requestActions, /set_family_membership/);
  assert.match(requestsPage, /reviewJoinRequestAction/);
  assert.match(requestsPage, /\.from\("join_requests"\)/);
  assert.match(requestsPage, /profiles!join_requests_profile_id_fkey/);
  assert.match(familyHome, /\/requests/);
});

test("all genealogy views receive direct-relationship hover highlighting", () => {
  const dashboardViews = read("components/DashboardViews.tsx");
  const memberList = read("components/DashboardMemberList.tsx");
  const personCard = read("components/PersonCard.tsx");
  const familyTree = read("components/FamilyTree.tsx");
  const familyNodeCard = read("components/FamilyNodeCard.tsx");
  const mindmapTree = read("components/MindmapTree.tsx");
  const mindmapNode = read("components/MindmapNode.tsx");
  const bubbleMap = read("components/BubbleMapTree.tsx");

  assert.match(dashboardViews, /hoveredPersonId/);
  assert.match(dashboardViews, /highlightedPersonIds/);
  assert.match(dashboardViews, /relationship\.type === "marriage"/);
  assert.match(memberList, /highlightedPersonIds/);
  assert.match(personCard, /onMouseEnter=\{\(\) => onHoverPerson\?\.\(person\.id\)\}/);
  assert.match(familyTree, /treeHighlightedPersonIds/);
  assert.match(familyNodeCard, /ring-2 ring-amber-300/);
  assert.match(mindmapTree, /onHoverPerson/);
  assert.match(mindmapNode, /ctx\.highlightedPersonIds/);
  assert.match(bubbleMap, /isNodeHighlighted/);
  assert.match(bubbleMap, /onHoverPerson\?\.\(d\.id\)/);
});

test("tree view supports contextual quick add, delete, and relationship comparison", () => {
  const familyTree = read("components/FamilyTree.tsx");
  const quickAddDialog = read("components/TreeQuickAddDialog.tsx");
  const treeHelpers = read("utils/treeHelpers.ts");
  const membersPage = read("app/dashboard/[familySlug]/members/page.tsx");
  const dashboardViews = read("components/DashboardViews.tsx");

  assert.match(familyTree, /TreeQuickAddDialog/);
  assert.match(familyTree, /openPersonQuickAdd/);
  assert.match(familyTree, /deletePersonFromTree/);
  assert.match(familyTree, /Trash2/);
  assert.match(familyTree, /buildRelativeRelationLabels/);
  assert.match(familyTree, /relationLabels/);
  assert.match(familyTree, /deleteMemberRecordAction/);
  assert.match(familyTree, /deleteConfirmPerson/);
  assert.doesNotMatch(familyTree, /openCoupleQuickAdd/);
  assert.doesNotMatch(familyTree, /tree-edge-label/);
  assert.doesNotMatch(familyTree, /Thêm con cho/);
  assert.match(quickAddDialog, /selectedSpouseId/);
  assert.match(quickAddDialog, /createTreeQuickMemberAction/);
  assert.match(quickAddDialog, /formData\.set\("child_type", childType\)/);
  assert.match(quickAddDialog, /formData\.set\("selected_spouse_id", selectedSpouseId\)/);
  assert.match(treeHelpers, /"step_child"/);
  assert.match(treeHelpers, /"foster_child"/);
  assert.match(treeHelpers, /buildRelativeRelationLabels/);
  assert.match(treeHelpers, /Con dâu/);
  assert.match(treeHelpers, /Con rể/);
  assert.match(treeHelpers, /Cháu trai/);
  assert.match(membersPage, /isChildRelationshipType/);
  assert.match(dashboardViews, /isChildRelationshipType/);
  assert.match(dashboardViews, /relationSourcePersonId=\{hoveredPersonId\}/);
});

test("main UI surfaces use Vietnamese with accents and no mojibake", () => {
  const uiFiles = [
    "app/page.tsx",
    "app/admin/page.tsx",
    "app/admin/login/page.tsx",
    "app/admin/families/page.tsx",
    "app/admin/users/page.tsx",
    "app/actions/user.ts",
    "app/dashboard/page.tsx",
    "app/dashboard/[familySlug]/page.tsx",
    "app/dashboard/[familySlug]/about/page.tsx",
    "app/dashboard/[familySlug]/trees/page.tsx",
    "app/dashboard/[familySlug]/blog/page.tsx",
    "components/AdminShell.tsx",
    "components/AdminUserList.tsx",
    "components/BlogAdminPanel.tsx",
    "components/FamilyTree.tsx",
    "components/TreeQuickAddDialog.tsx",
  ];
  const mojibake = /Ä‚|Ă„|Ă†|Ă¡Âº|Ă¡Â»|Ă¢â‚¬|Ä‘Å¸/;

  for (const file of uiFiles) {
    assert.doesNotMatch(read(file), mojibake, `${file} must not contain mojibake`);
  }

  assert.match(read("app/admin/families/page.tsx"), /Tạo dòng họ mới/);
  assert.match(read("app/dashboard/page.tsx"), /Chọn dòng họ/);
  assert.match(read("app/dashboard/[familySlug]/page.tsx"), /Không gian riêng tư/);
  assert.match(read("app/admin/login/page.tsx"), /Đăng nhập admin/);
  assert.match(read("docs/seed.sql"), /Dòng họ Văn mẫu/);
});

test("genealogy mutation surfaces use validated server actions", () => {
  const relationshipManager = read("components/RelationshipManager.tsx");
  const memberForm = read("components/MemberForm.tsx");
  const lineageManager = read("components/LineageManager.tsx");
  const excelImport = read("app/actions/excel-import.ts");

  assert.match(relationshipManager, /createOrUpdateRelationshipAction/);
  assert.match(relationshipManager, /deleteRelationshipAction/);
  assert.doesNotMatch(relationshipManager, /from\("relationships"\)\.insert/);
  assert.match(memberForm, /saveMemberProfileAction/);
  assert.doesNotMatch(memberForm, /from\("persons"\)/);
  assert.match(lineageManager, /previewLineageSyncAction/);
  assert.match(lineageManager, /applyLineageSyncAction/);
  assert.doesNotMatch(lineageManager, /createClient/);
  assert.doesNotMatch(excelImport, /from\("persons"\)\s*\.delete/);
});
