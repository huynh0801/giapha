import DataImportExport from "@/components/DataImportExport";
import { getFamilyContextBySlug } from "@/utils/supabase/queries";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string }>;
  searchParams?: Promise<{ treeId?: string }>;
}

export default async function FamilyDataManagementPage({
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

  return (
    <main className="flex w-full flex-1 flex-col bg-stone-50/50 pt-8">
      <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <div>
            <h1 className="title">Dữ liệu & Import</h1>
            <p className="mt-2 max-w-2xl text-sm text-stone-500 sm:text-base">
              Quét Excel, nhập bổ sung, sao lưu và phục hồi dữ liệu cho dòng họ{" "}
              {context.family.name}, cây {context.tree.name}.
            </p>
          </div>
        </div>

        <DataImportExport
          familyId={context.family.id}
          treeId={context.tree.id}
          familySlug={familySlug}
        />
      </div>
    </main>
  );
}
