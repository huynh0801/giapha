import { DashboardProvider } from "@/components/DashboardContext";
import MemberForm from "@/components/MemberForm";
import { getFamilyContextBySlug, getSupabase, getUser } from "@/utils/supabase/queries";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string; id: string }>;
  searchParams?: Promise<{ treeId?: string }>;
}

export default async function FamilyEditMemberPage({
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
  const detailHref = `/dashboard/${familySlug}/members/${id}?treeId=${context.tree.id}`;

  const user = await getUser();
  const familySettings = (context.family.settings as Record<string, unknown>) || {};
  const memberLinks = familySettings.member_links as Record<string, string> | undefined;
  const isSelf = user && memberLinks?.[user.id] === id;
  const canEditRecord = context.canEdit || isSelf;

  if (!canEditRecord) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800">
            Truy cập bị từ chối
          </h1>
          <p className="mt-2 text-stone-600">
            Bạn không có quyền chỉnh sửa thành viên này trong dòng họ.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await getSupabase();
  const { data: person, error } = await supabase
    .from("persons")
    .select("*")
    .eq("family_id", context.family.id)
    .eq("tree_id", context.tree.id)
    .eq("id", id)
    .maybeSingle();

  if (error || !person) notFound();

  const { data: privateData } = await supabase
    .from("person_details_private")
    .select("*")
    .eq("family_id", context.family.id)
    .eq("tree_id", context.tree.id)
    .eq("person_id", id)
    .maybeSingle();

  return (
    <DashboardProvider
      familyId={context.family.id}
      familySlug={familySlug}
      treeId={context.tree.id}
      canEdit={context.canEdit}
      canManage={context.canManage}
    >
      <div className="flex w-full flex-1 flex-col pb-8">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href={detailHref}
              className="-ml-2 rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
              title="Quay lại chi tiết"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="title">Chỉnh sửa thành viên</h1>
          </div>
        </div>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <MemberForm
            initialData={{ ...person, ...privateData }}
            isEditing
            isAdmin={context.canEdit}
          />
        </main>
      </div>
    </DashboardProvider>
  );
}
