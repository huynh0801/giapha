import KinshipFinder from "@/components/KinshipFinder";
import HeritagePageHeader from "@/components/dashboard/HeritagePageHeader";
import { getFamilyContextBySlug, getSupabase } from "@/utils/supabase/queries";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string }>;
  searchParams?: Promise<{ treeId?: string }>;
}

export default async function FamilyKinshipPage({
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
  const [personsRes, relsRes] = await Promise.all([
    supabase
      .from("persons")
      .select(
        "id, family_id, tree_id, full_name, gender, birth_year, birth_order, generation, is_in_law, avatar_url, birth_month, birth_day, death_year, death_month, death_day, death_lunar_year, death_lunar_month, death_lunar_day, is_deceased, other_names, note, created_at, updated_at",
      )
      .eq("family_id", context.family.id)
      .eq("tree_id", context.tree.id)
      .order("birth_year", { ascending: true, nullsFirst: false }),
    supabase
      .from("relationships")
      .select("*")
      .eq("family_id", context.family.id)
      .eq("tree_id", context.tree.id),
  ]);

  return (
    <div className="flex w-full flex-1 flex-col pb-16">
      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <HeritagePageHeader
          familySlug={familySlug}
          familyName={context.family.name}
          treeName={context.tree.name}
          title="Tra Cứu Danh Xưng & Quan Hệ"
          description={`Tính toán và giải thích cách xưng hô chuẩn mực giữa hai thành viên trong cây ${context.tree.name} theo gia lễ truyền thống.`}
        />
        <KinshipFinder
          persons={personsRes.data ?? []}
          relationships={relsRes.data ?? []}
        />
      </main>
    </div>
  );
}
