import LineageManager from "@/components/LineageManager";
import { getFamilyContextBySlug, getSupabase } from "@/utils/supabase/queries";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string }>;
  searchParams?: Promise<{ treeId?: string }>;
}

export default async function FamilyLineagePage({
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
  if (!context.canEdit) redirect(`/dashboard/${familySlug}`);

  const supabase = await getSupabase();
  const personsRes = await supabase
    .from("persons")
    .select("*")
    .eq("family_id", context.family.id)
    .eq("tree_id", context.tree.id)
    .order("birth_year", { ascending: true, nullsFirst: false });

  return (
    <main className="flex w-full flex-1 flex-col bg-stone-50/50 pt-8">
      <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="title">Thứ tự gia phả</h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-500 sm:text-base">
            Cập nhật thế hệ, thứ tự sinh và dâu/rể trong cây{" "}
            {context.tree.name}.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200/60 bg-white/80 p-5 shadow-sm sm:p-8">
          <LineageManager
            persons={personsRes.data ?? []}
            familyId={context.family.id}
            treeId={context.tree.id}
          />
        </div>
      </div>
    </main>
  );
}
