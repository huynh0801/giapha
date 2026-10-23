import { DashboardProvider } from "@/components/DashboardContext";
import DashboardViews from "@/components/DashboardViews";
import MemberDetailModal from "@/components/MemberDetailModal";
import ViewToggle, { ViewMode } from "@/components/ViewToggle";
import { getFamilyContextBySlug, getSupabase } from "@/utils/supabase/queries";
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

  const [personsRes, relsRes] = await Promise.all([
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
      canEdit={context.canEdit}
      canManage={context.canManage}
      initialView={initialView}
      initialRootId={finalRootId}
      initialShowAvatar={initialShowAvatar}
    >
      <ViewToggle />
      <div className="mx-auto mt-2 flex w-full max-w-7xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="inline-flex min-w-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-stone-700 shadow-sm ring-1 ring-stone-200">
          <FolderTree className="size-4 shrink-0 text-amber-700" />
          <span className="truncate">Đang mở: {context.tree.name}</span>
        </div>
        <Link
          href={`/dashboard/${familySlug}/trees`}
          className="inline-flex items-center justify-center rounded-full bg-stone-100 px-4 py-2 text-sm font-black text-stone-700 transition hover:bg-stone-200"
        >
          Đổi cây gia phả
        </Link>
      </div>
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
