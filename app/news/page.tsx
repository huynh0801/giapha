import { BlogPost } from "@/types";
import { getSupabase } from "@/utils/supabase/queries";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { getCurrentUserAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

type NewsPost = Pick<
  BlogPost,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "category"
  | "cover_image_url"
  | "published_at"
  | "created_at"
>;

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export const metadata = {
  title: "Tin tức dòng họ",
};

export default async function NewsPage() {
  const [supabase, currentUser] = await Promise.all([
    getSupabase(),
    getCurrentUserAction(),
  ]);
  const { data } = await supabase
    .from("blog_posts")
    .select(
      "id,title,slug,excerpt,category,cover_image_url,published_at,created_at",
    )
    .eq("scope", "system")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const posts = (data || []) as NewsPost[];
  const [featuredPost, ...otherPosts] = posts;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5e7c7] text-[#2c1a11]">
      <LandingHeader currentUser={currentUser} />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 md:pt-14 lg:px-8">
        <div className="mb-9">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b56a10]">
            Tin tức & Di sản
          </p>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#800000] md:text-5xl">
            Bài viết dòng họ
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Những ghi chép, hình ảnh và câu chuyện được quản trị viên đăng tải
            từ kho tư liệu dòng họ.
          </p>
        </div>

        {featuredPost ? (
          <>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group grid overflow-hidden rounded-[30px] bg-white shadow-[0_24px_80px_rgba(58,31,19,0.12)] lg:grid-cols-[1.15fr_0.85fr]"
            >
              <div className="aspect-[16/10] overflow-hidden lg:aspect-auto">
                <img
                  src={featuredPost.cover_image_url}
                  alt={featuredPost.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b56a10]">
                  {featuredPost.category}
                </p>
                <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-stone-950 group-hover:text-[#800000] md:text-4xl">
                  {featuredPost.title}
                </h2>
                {featuredPost.excerpt && (
                  <p className="mt-5 text-base leading-8 text-stone-600">
                    {featuredPost.excerpt}
                  </p>
                )}
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-stone-400">
                  <CalendarDays className="size-4" />
                  {formatDate(
                    featuredPost.published_at || featuredPost.created_at,
                  )}
                </div>
              </div>
            </Link>

            {otherPosts.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {otherPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-[24px] bg-white shadow-[0_14px_42px_rgba(58,31,19,0.08)] transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b56a10]">
                          {post.category}
                        </span>
                        <span className="text-xs font-semibold text-stone-400">
                          {formatDate(post.published_at || post.created_at)}
                        </span>
                      </div>
                      <h2 className="mt-3 text-lg font-black leading-tight text-stone-900 group-hover:text-[#800000]">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-500">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[28px] bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-black text-stone-900">
              Chưa có bài viết nào
            </h2>
            <p className="mt-2 text-stone-500">
              Nội dung sẽ xuất hiện sau khi admin xuất bản bài viết.
            </p>
          </div>
        )}
      </section>
      </main>

      <LandingFooter />
    </div>
  );
}
