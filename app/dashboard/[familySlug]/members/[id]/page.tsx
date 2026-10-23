import { DashboardProvider } from "@/components/DashboardContext";
import DeleteMemberButton from "@/components/DeleteMemberButton";
import MemberDetailContent from "@/components/MemberDetailContent";
import { getFamilyContextBySlug, getSupabase } from "@/utils/supabase/queries";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string; id: string }>;
  searchParams?: Promise<{ treeId?: string }>;
}

export default async function FamilyMemberDetailPage({
  params,
  searchParams,
}: PageProps) {
  const [{ familySlug, id }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const context = await getFamilyContextBySlug(
    familySlug,
    resolvedSearchParams?.treeId,
  );
  if (!context) notFound();
  const membersHref = `/dashboard/${familySlug}/members?treeId=${context.tree.id}`;

  const supabase = await getSupabase();
  const { data: person, error } = await supabase
    .from("persons")
    .select("*")
    .eq("family_id", context.family.id)
    .eq("tree_id", context.tree.id)
    .eq("id", id)
    .maybeSingle();

  if (error || !person) notFound();

  let privateData = null;
  if (context.canEdit) {
    const { data } = await supabase
      .from("person_details_private")
      .select("*")
      .eq("family_id", context.family.id)
      .eq("tree_id", context.tree.id)
      .eq("person_id", id)
      .maybeSingle();
    privateData = data;
  }

  return (
    <DashboardProvider
      familyId={context.family.id}
      familySlug={familySlug}
      treeId={context.tree.id}
      canEdit={context.canEdit}
      canManage={context.canManage}
    >
      <div className="flex w-full flex-1 flex-col pb-8">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href={membersHref}
              className="-ml-2 rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
              title="Quay lại danh sách"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="title">Chi tiết thành viên</h1>
          </div>
          {context.canEdit && (
            <div className="flex items-center gap-2.5">
              <Link
                href={`/dashboard/${familySlug}/members/${id}/edit?treeId=${context.tree.id}`}
                className="rounded-lg bg-stone-100/80 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition-all hover:bg-stone-200 hover:text-stone-900"
              >
                Chỉnh sửa
              </Link>
              <DeleteMemberButton
                memberId={id}
                familyId={context.family.id}
                familySlug={familySlug}
                treeId={context.tree.id}
              />
            </div>
          )}
        </div>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-stone-200/60 bg-white/60 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <MemberDetailContent
              person={person}
              privateData={privateData}
              isAdmin={context.canEdit}
              canEdit={context.canEdit}
            />
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}
