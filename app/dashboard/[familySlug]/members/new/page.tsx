import { DashboardProvider } from "@/components/DashboardContext";
import MemberForm from "@/components/MemberForm";
import { getFamilyContextBySlug } from "@/utils/supabase/queries";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string }>;
  searchParams?: Promise<{ treeId?: string }>;
}

export default async function FamilyNewMemberPage({
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
  const membersHref = `/dashboard/${familySlug}/members?treeId=${context.tree.id}`;

  if (!context.canEdit) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800">
            Truy cập bị từ chối
          </h1>
          <p className="mt-2 text-stone-600">
            Bạn không có quyền thêm thành viên trong dòng họ này.
          </p>
        </div>
      </div>
    );
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
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href={membersHref}
              className="-ml-2 rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
              title="Quay lại danh sách"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="title">Thêm thành viên mới</h1>
          </div>
          <Link
            href={membersHref}
            className="rounded-lg bg-stone-100/80 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition-all hover:bg-stone-200 hover:text-stone-900"
          >
            Hủy
          </Link>
        </div>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <MemberForm isAdmin={context.canEdit} />
        </main>
      </div>
    </DashboardProvider>
  );
}
