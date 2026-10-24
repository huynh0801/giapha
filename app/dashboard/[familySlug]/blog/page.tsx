import BlogAdminPanel from "@/components/BlogAdminPanel";
import HeritagePageHeader from "@/components/dashboard/HeritagePageHeader";
import { HeritageBadge, HeritageFrame } from "@/components/dashboard/HeritageUI";
import { BlogPost } from "@/types";
import { getFamilyContextBySlug, getSupabase } from "@/utils/supabase/queries";
import { Newspaper } from "lucide-react";
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
    <div className="flex w-full flex-1 flex-col pb-16">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <HeritagePageHeader
          familySlug={familySlug}
          familyName={context.family.name}
          title="Bảng Tin & Chiếu Thư Dòng Tộc"
          description="Ghi chép các thông tri, cáo thị và thông báo quan trọng chỉ lưu hành nội bộ trong dòng họ."
          badge={<HeritageBadge variant="amber">Tin nội bộ</HeritageBadge>}
          actions={
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#deb887] bg-[#fffdf7] px-4 py-2 text-xs sm:text-sm font-bold text-[#183b28] hover:bg-[#f5e7c7] transition-all shadow-xs"
            >
              Xem tin tức công khai
            </Link>
          }
        />

        {!context.canEdit && posts.length === 0 && (
          <HeritageFrame cornerColor="#deb887" className="mb-6">
            <div className="py-8 text-center">
              <Newspaper className="mx-auto mb-3 size-10 text-[#deb887]" />
              <h2
                className="text-xl font-bold text-[#183b28]"
                style={{
                  fontFamily:
                    '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                }}
              >
                Chưa có thông báo nội bộ
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-[#5c4a3e]">
                Khi Người phụ trách / Tộc trưởng dòng họ xuất bản thông tri, nội dung sẽ xuất hiện tại đây.
              </p>
            </div>
          </HeritageFrame>
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
      </main>
    </div>
  );
}
