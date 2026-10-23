import BlogAdminPanel from "@/components/BlogAdminPanel";
import { BlogPost } from "@/types";
import { getFamilyContextBySlug, getSupabase } from "@/utils/supabase/queries";
import { ArrowLeft, Newspaper } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string }>;
  searchParams?: Promise<{ edit?: string }>;
}

export default async function FamilyBlogPage({
  params,
  searchParams,
}: PageProps) {
  const [{ familySlug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const context = await getFamilyContextBySlug(familySlug);
  if (!context) notFound();

  const supabase = await getSupabase();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("scope", "family")
    .eq("family_id", context.family.id)
    .order("created_at", { ascending: false });

  if (!context.canEdit) {
    query = query.eq("is_published", true);
  }

  const { data } = await query;
  const posts = (data || []) as BlogPost[];

  return (
    <main className="flex w-full flex-1 flex-col bg-stone-50/50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href={`/dashboard/${familySlug}`}
              className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-stone-500 transition-colors hover:text-[#800000]"
            >
              <ArrowLeft className="size-4" />
              Quay về dashboard dòng họ
            </Link>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-600">
              Bảng tin nội bộ
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
              Thông báo của {context.family.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Mỗi dòng họ chỉ giữ một thông báo nội bộ đang hoạt động. Nội dung này
              chỉ dành cho thành viên và không xuất hiện ở trang tin tức công khai.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-stone-700 shadow-sm ring-1 ring-stone-200 transition hover:text-[#800000] hover:ring-amber-300"
            >
              Xem thêm
            </Link>
          </div>
        </div>

        {!context.canEdit && posts.length === 0 && (
          <section className="mb-6 rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <Newspaper className="mx-auto mb-4 size-9 text-stone-300" />
            <h2 className="text-xl font-black text-stone-900">
              Chưa có thông báo nội bộ
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Khi Admin dòng họ xuất bản thông báo, bạn sẽ đọc được tại đây.
            </p>
          </section>
        )}

        {(context.canEdit || posts.length > 0) && (
          <BlogAdminPanel
            key={resolvedSearchParams?.edit || "family-blog"}
            posts={posts}
            initialEditId={context.canEdit ? resolvedSearchParams?.edit : undefined}
            scope="family"
            familyId={context.family.id}
            familySlug={familySlug}
            familySettings={context.family.settings}
            canEdit={context.canEdit}
          />
        )}
      </div>
    </main>
  );
}
