import { DashboardProvider } from "@/components/DashboardContext";
import DashboardViews from "@/components/DashboardViews";
import MemberDetailModal from "@/components/MemberDetailModal";
import ViewToggle, { ViewMode } from "@/components/ViewToggle";
import HeritagePageHeader from "@/components/dashboard/HeritagePageHeader";
import { HeritageBadge } from "@/components/dashboard/HeritageUI";
import MemberClaimBanner from "@/components/dashboard/MemberClaimBanner";
import { getFamilyContextBySlug, getSupabase, getUser } from "@/utils/supabase/queries";
import { isChildRelationshipType } from "@/utils/treeHelpers";
import { FolderTree } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string }>;
  searchParams: Promise<{
    view?: string;
    rootId?: string;
    avatar?: string;
    treeId?: string;
  }>;
}

export default async function FamilyMembersPage({
  params,
  searchParams,
}: PageProps) {
  const [{ familySlug }, { view, rootId, avatar, treeId }] = await Promise.all([
    params,
    searchParams,
  ]);
  const context = await getFamilyContextBySlug(familySlug, treeId);
  if (!context) notFound();

  const initialView = view as ViewMode | undefined;
  const initialShowAvatar = avatar !== "hide";
  const supabase = await getSupabase();

  const [user, personsRes, relsRes] = await Promise.all([
    getUser(),
    supabase
      .from("persons")
      .select("*")
      .eq("family_id", context.family.id)
      .eq("tree_id", context.tree.id)
      .order("birth_year", { ascending: true, nullsFirst: false }),
    supabase
      .from("relationships")
      .select("*")
      .eq("family_id", context.family.id)
      .eq("tree_id", context.tree.id),
  ]);

  const persons = personsRes.data || [];
  const relationships = relsRes.data || [];
  const personsMap = new Map(persons.map((person) => [person.id, person]));

  const familySettings = (context.family.settings as Record<string, unknown>) || {};
  const memberLinks = familySettings.member_links as Record<string, string> | undefined;
  const genealogyRequests = (Array.isArray(familySettings.genealogy_requests)
    ? familySettings.genealogy_requests
    : []) as import("@/app/actions/family-claim").GenealogyRequest[];

  const userPendingRequest = user
    ? genealogyRequests.find((r) => r.user_id === user.id && r.status === "pending") || null
    : null;
  const userRejectedRequest = user
    ? genealogyRequests.find((r) => r.user_id === user.id && r.status === "rejected") || null
    : null;

  const linkedPersonId = user ? memberLinks?.[user.id] : undefined;
  const linkedPerson = linkedPersonId
    ? persons.find((p) => p.id === linkedPersonId) || null
    : null;
  const childIds = new Set(
    relationships
      .filter((rel) => isChildRelationshipType(rel.type))
      .map((rel) => rel.person_b),
  );

  let finalRootId = rootId;
  if (!finalRootId || !personsMap.has(finalRootId)) {
    const roots = persons.filter((person) => !childIds.has(person.id));
    finalRootId = roots[0]?.id || persons[0]?.id || null;
  }

  return (
    <DashboardProvider
      familyId={context.family.id}
      familySlug={familySlug}
      treeId={context.tree.id}
      currentPersonId={linkedPersonId}
      canEdit={context.canEdit}
      canManage={context.canManage}
      initialView={initialView}
      initialRootId={finalRootId}
      initialShowAvatar={initialShowAvatar}
    >
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <HeritagePageHeader
          familySlug={familySlug}
          familyName={context.family.name}
          title="Cây Phả Hệ & Sơ Đồ Gia Tộc"
          description={`Tra cứu danh sách thành viên, phả đồ cội nguồn, sơ đồ tư duy (mindmap) và biểu đồ bong bóng trong cây ${context.tree.name}.`}
          badge={
            <HeritageBadge variant="amber" className="inline-flex items-center gap-1">
              <FolderTree className="size-3 shrink-0" />
              <span>Đang mở: {context.tree.name}</span>
            </HeritageBadge>
          }
          actions={
            <Link
              href={`/dashboard/${familySlug}/trees`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#deb887] bg-[#fffdf7] px-4 py-2 text-xs sm:text-sm font-bold text-[#8c1d1d] hover:bg-[#f5e7c7] transition-all shadow-xs"
            >
              <FolderTree className="size-4" />
              <span>Đổi cây gia phả</span>
            </Link>
          }
        />

        {/* Banner Nhận diện / Thêm tên vào Cây Gia Phả */}
        {user && (
          <div className="mt-4">
            <MemberClaimBanner
              familyId={context.family.id}
              familySlug={familySlug}
              treeId={context.tree.id}
              currentUserId={user.id}
              currentUserName={user.user_metadata?.full_name || ""}
              linkedPerson={linkedPerson}
              persons={persons}
              pendingRequest={userPendingRequest}
              rejectedRequest={userRejectedRequest}
              canManage={context.canManage}
            />
          </div>
        )}
      </div>

      <ViewToggle />

      <DashboardViews
        persons={persons}
        relationships={relationships}
        canEdit={context.canEdit}
        familyAdminEditExperience={
          context.isSystemAdmin ||
          (context.membership?.status === "active" &&
            context.membership.role === "family_admin"
          )
        }
      />
      <MemberDetailModal />
    </DashboardProvider>
  );
}
