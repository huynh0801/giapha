import FamilyStats from "@/components/FamilyStats";
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
    <div className="flex w-full flex-1 flex-col pb-12">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="title">Thống kê gia phả</h1>
        <p className="mt-1 text-sm text-stone-500">
          Dữ liệu thống kê trong dòng họ {context.family.name}
        </p>
      </div>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6 lg:px-8">
        <FamilyStats
          persons={personsRes.data ?? []}
          relationships={relsRes.data ?? []}
        />
      </main>
    </div>
  );
}
