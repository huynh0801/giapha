import FamilyStats from "@/components/FamilyStats";
import HeritagePageHeader from "@/components/dashboard/HeritagePageHeader";
import { getFamilyContextBySlug, getSupabase } from "@/utils/supabase/queries";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string }>;
  searchParams?: Promise<{ treeId?: string }>;
}

export default async function FamilyStatsPage({
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
      .select("*")
      .eq("family_id", context.family.id)
      .eq("tree_id", context.tree.id),
    supabase
      .from("relationships")
      .select("*")
      .eq("family_id", context.family.id)
      .eq("tree_id", context.tree.id),
  ]);

  return (
    <div className="flex w-full flex-1 flex-col pb-16">
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <HeritagePageHeader
          familySlug={familySlug}
          familyName={context.family.name}
          treeName={context.tree.name}
          title="Bảng Vàng Thống Kê Gia Tộc"
          description={`Tổng hợp số liệu nhân đinh, các thế hệ, tỷ lệ nam nữ và phân bố gia tộc trong dòng họ ${context.family.name}.`}
        />
        <FamilyStats
          persons={personsRes.data ?? []}
          relationships={relsRes.data ?? []}
        />
      </main>
    </div>
  );
}
