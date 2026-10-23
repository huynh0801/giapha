import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Sparkles } from "lucide-react";
import { BlogPost } from "@/types";
import { getSupabase } from "@/utils/supabase/queries";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { getCurrentUserAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tin tức & Hoạt động dòng họ",
  description: "Các hoạt động, sự kiện và câu chuyện lịch sử của dòng họ",
};

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
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

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

      <main className="flex-1 w-full py-8 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          {/* Page Header: Thoáng đãng, không bị đóng khung chung */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-3 sm:gap-5 mb-2.5">
              <div className="relative w-9 h-5 sm:w-14 sm:h-7 opacity-85">
                <Image
                  src="/images/landing/footer-clouds.png"
                  alt="Họa tiết mây trái"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#8c1d1d] font-sans">
                Bản Tin Dòng Tộc – Sự Kiện &amp; Di Sản
              </span>
              <div className="relative w-9 h-5 sm:w-14 sm:h-7 opacity-85 scale-x-[-1]">
                <Image
                  src="/images/landing/footer-clouds.png"
                  alt="Họa tiết mây phải"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
            </div>

            <h1
              className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#183b28] uppercase leading-tight"
              style={{
                fontFamily:
                  '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
              }}
            >
              Tin Tức &amp; Hoạt Động Dòng Họ
            </h1>

            <p className="mt-3 max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-[#5c4a3e] font-sans font-medium italic">
              &ldquo;Ghi chép sự kiện, sẻ chia hoạt động và vinh danh những thành
              tựu của con cháu khắp mọi miền.&rdquo;
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="h-[1px] w-16 sm:w-28 bg-[#caa455]" />
              <span className="size-2 rotate-45 bg-[#8c1d1d]" />
              <span className="h-[1px] w-16 sm:w-28 bg-[#caa455]" />
            </div>
          </div>

          {/* Featured Article: Có khung chỉ kép và họa tiết góc riêng */}
          {featuredPost ? (
            <div>
              <div className="flex items-center gap-2 mb-3.5 border-b border-[#deb887]/60 pb-2">
                <Sparkles className="size-4 text-[#8c1d1d]" />
                <span
                  className="text-sm sm:text-base font-bold text-[#183b28] uppercase tracking-wide"
                  style={{
                    fontFamily:
                      '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                  }}
                >
                  Bản Tin Mới Nhất
                </span>
              </div>

              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block relative p-1.5 sm:p-2 border-2 border-[#caa455] bg-[#f5e7c7]/40 hover:border-[#8c1d1d] transition-all shadow-[0_4px_24px_rgba(44,26,17,0.06)]"
              >
                <div className="relative border border-[#deb887] bg-[#fffdf7] group-hover:bg-[#fffefb] p-4 sm:p-6 lg:p-8 transition-colors">
                  {/* 4 Traditional Corner Brackets */}
                  <span className="pointer-events-none absolute top-1.5 left-1.5 size-4 border-t-2 border-l-2 border-[#8c1d1d]" />
                  <span className="pointer-events-none absolute top-1.5 right-1.5 size-4 border-t-2 border-r-2 border-[#8c1d1d]" />
                  <span className="pointer-events-none absolute bottom-1.5 left-1.5 size-4 border-b-2 border-l-2 border-[#8c1d1d]" />
                  <span className="pointer-events-none absolute bottom-1.5 right-1.5 size-4 border-b-2 border-r-2 border-[#8c1d1d]" />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                    {/* Left: Featured Image with gold frame */}
                    <div className="lg:col-span-7">
                      <div className="relative aspect-[16/10] w-full border-2 border-[#caa455] p-1 bg-[#f5e7c7]">
                        <div className="relative size-full border border-[#deb887] overflow-hidden">
                          <img
                            src={featuredPost.cover_image_url}
                            alt={featuredPost.title}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right: Featured Content */}
                    <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-3.5">
                      <div>
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#8c1d1d] border-b border-[#8c1d1d]/40 pb-0.5 font-sans">
                          {featuredPost.category || "Tin dòng họ"}
                        </span>

                        <h2
                          className="mt-2 text-xl sm:text-2xl lg:text-3xl font-bold tracking-normal text-[#183b28] group-hover:text-[#8c1d1d] transition-colors leading-snug"
                          style={{
                            fontFamily:
                              '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                          }}
                        >
                          {featuredPost.title}
                        </h2>

                        {featuredPost.excerpt && (
                          <p className="mt-3 text-xs sm:text-sm text-[#4a3b2f] leading-relaxed font-sans line-clamp-3 text-justify">
                            {featuredPost.excerpt}
                          </p>
                        )}
                      </div>

                      <div className="pt-3.5 border-t border-[#deb887]/70 flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-1.5 text-[#7a6455]">
                          <CalendarDays className="size-3.5 text-[#caa455]" />
                          <span>
                            {formatDate(
                              featuredPost.published_at ||
                                featuredPost.created_at,
                            )}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 font-bold text-[#8c1d1d] group-hover:translate-x-1 transition-transform">
                          <span>Đọc tiếp</span>
                          <ArrowRight className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ) : null}

          {/* Grid of Other Articles: Từng mục tin tức có khung riêng biệt */}
          {otherPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-center gap-3 my-6 sm:my-8 w-full">
                <span className="h-[1px] flex-1 max-w-xs bg-gradient-to-r from-transparent via-[#caa455] to-[#caa455]" />
                <h2
                  className="text-lg sm:text-2xl font-bold tracking-tight text-[#183b28] uppercase shrink-0 px-3"
                  style={{
                    fontFamily:
                      '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                  }}
                >
                  Các Bản Tin &amp; Sự Kiện
                </h2>
                <span className="h-[1px] flex-1 max-w-xs bg-gradient-to-l from-transparent via-[#caa455] to-[#caa455]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 hover:border-[#8c1d1d] transition-all shadow-[0_2px_12px_rgba(44,26,17,0.05)]"
                  >
                    <div className="relative border border-[#deb887] bg-[#fffdf7] group-hover:bg-[#fffefb] p-4 flex flex-col justify-between h-full transition-colors">
                      {/* 4 Traditional Corner Brackets for each card */}
                      <span className="pointer-events-none absolute top-1 left-1 size-3 border-t-2 border-l-2 border-[#8c1d1d]" />
                      <span className="pointer-events-none absolute top-1 right-1 size-3 border-t-2 border-r-2 border-[#8c1d1d]" />
                      <span className="pointer-events-none absolute bottom-1 left-1 size-3 border-b-2 border-l-2 border-[#8c1d1d]" />
                      <span className="pointer-events-none absolute bottom-1 right-1 size-3 border-b-2 border-r-2 border-[#8c1d1d]" />

                      <div>
                        {/* Image with gold framing */}
                        <div className="relative aspect-[16/10] w-full border border-[#deb887] bg-[#f5e7c7] overflow-hidden mb-3">
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Meta: Category & Date */}
                        <div className="flex items-center justify-between gap-2 border-b border-[#deb887]/50 pb-1.5 mb-2 font-sans">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c1d1d]">
                            {post.category || "Tin tức"}
                          </span>
                          <span className="text-[11px] text-[#7a6455]">
                            {formatDate(post.published_at || post.created_at)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          className="text-sm sm:text-base font-bold text-[#183b28] group-hover:text-[#8c1d1d] transition-colors leading-snug line-clamp-2"
                          style={{
                            fontFamily:
                              '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                          }}
                        >
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="mt-2 text-xs text-[#5c4a3e] leading-relaxed line-clamp-2 font-sans">
                            {post.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Read more button */}
                      <div className="mt-4 pt-2.5 border-t border-[#deb887]/50 flex items-center justify-end text-xs font-bold text-[#8c1d1d] group-hover:translate-x-0.5 transition-transform gap-1 font-sans">
                        <span>Xem chi tiết</span>
                        <ArrowRight className="size-3.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {posts.length === 0 && (
            <div className="relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 max-w-xl mx-auto my-12">
              <div className="relative border border-[#deb887] bg-[#fffdf7] p-8 sm:p-10 text-center space-y-3">
                <span className="pointer-events-none absolute top-1.5 left-1.5 size-3.5 border-t-2 border-l-2 border-[#8c1d1d]" />
                <span className="pointer-events-none absolute top-1.5 right-1.5 size-3.5 border-t-2 border-r-2 border-[#8c1d1d]" />
                <span className="pointer-events-none absolute bottom-1.5 left-1.5 size-3.5 border-b-2 border-l-2 border-[#8c1d1d]" />
                <span className="pointer-events-none absolute bottom-1.5 right-1.5 size-3.5 border-b-2 border-r-2 border-[#8c1d1d]" />

                <div className="inline-flex items-center justify-center size-12 border border-[#caa455] bg-[#fcf5e5] text-[#8c1d1d]">
                  <BookOpen className="size-6" />
                </div>
                <h3
                  className="text-lg sm:text-xl font-bold text-[#183b28]"
                  style={{
                    fontFamily:
                      '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                  }}
                >
                  Chưa Có Bản Tin Nào
                </h3>
                <p className="text-xs sm:text-sm text-[#5c4a3e] max-w-md mx-auto leading-relaxed font-sans">
                  Nội dung sự kiện, lễ giỗ tổ và các hoạt động dòng tộc sẽ sớm
                  được ban biên tập cập nhật và đăng tải tại đây.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
