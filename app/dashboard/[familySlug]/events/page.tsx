import { DashboardProvider } from "@/components/DashboardContext";
import EventsList from "@/components/EventsList";
import MemberDetailModal from "@/components/MemberDetailModal";
import { getFamilyContextBySlug, getSupabase } from "@/utils/supabase/queries";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string }>;
  searchParams?: Promise<{ treeId?: string }>;
}

export default async function FamilyEventsPage({
  params,
  searchParams,
}: PageProps) {
  const [{ familySlug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const context = await getFamilyContextBySlug(
    familySlug,
    resolvedSearchParams?.treeId,
  );
  if (!context) notFound();

  const supabase = await getSupabase();
  const [personsRes, customEventsRes] = await Promise.all([
    supabase
      .from("persons")
      .select(
        "id, family_id, tree_id, full_name, gender, birth_year, birth_month, birth_day, death_year, death_month, death_day, death_lunar_year, death_lunar_month, death_lunar_day, is_deceased, is_in_law, birth_order, generation, other_names, note, avatar_url, created_at, updated_at",
      )
      .eq("family_id", context.family.id)
      .eq("tree_id", context.tree.id),
    supabase
      .from("custom_events")
      .select("id, family_id, tree_id, name, content, event_date, location, created_by")
      .eq("family_id", context.family.id)
      .eq("tree_id", context.tree.id),
  ]);

  return (
    <DashboardProvider
      familyId={context.family.id}
      familySlug={familySlug}
      treeId={context.tree.id}
      canEdit={context.canEdit}
      canManage={context.canManage}
    >
      <div className="flex w-full flex-1 flex-col pb-12">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="title">Sự kiện gia phả</h1>
          <p className="mt-1 text-sm text-stone-500">
            Sinh nhật, ngày giỗ và sự kiện nội bộ của {context.family.name}
          </p>
        </div>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 sm:px-6 lg:px-8">
          <EventsList
            persons={personsRes.data ?? []}
            customEvents={customEventsRes.data ?? []}
          />
        </main>
      </div>
      <MemberDetailModal />
    </DashboardProvider>
  );
}
