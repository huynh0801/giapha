import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SearchX,
} from "lucide-react";
import { BlogPost } from "@/types";
import { getSupabase } from "@/utils/supabase/queries";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import BackgroundDecor from "@/components/landing/BackgroundDecor";
import NewsSearchBar from "@/components/news/NewsSearchBar";
import { getCurrentUserAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tin tức & Hoạt động dòng họ",
  description: "Các hoạt động, sự kiện và câu chuyện lịch sử của dòng họ",
};

const ITEMS_PER_PAGE = 6;

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

interface NewsPageProps {
  searchParams?: Promise<{ page?: string; q?: string; category?: string }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const resolvedSearchParams = (await searchParams) || {};
  const query = (resolvedSearchParams.q || "").trim();
  const selectedCategory = (resolvedSearchParams.category || "").trim();
  const rawPage = parseInt(resolvedSearchParams.page || "1", 10);
  const requestedPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const [supabase, currentUser] = await Promise.all([
    getSupabase(),
    getCurrentUserAction(),
  ]);

  // 1. Fetch available categories from all published system blog posts
  const { data: categoryData } = await supabase
    .from("blog_posts")
    .select("category")
    .eq("scope", "system")
    .eq("is_published", true);

  const categories = Array.from(
    new Set((categoryData || []).map((row) => row.category).filter(Boolean))
  ) as string[];

  // 2. Count matching posts
  let countQuery = supabase
    .from("blog_posts")
    .select("id", { count: "exact", head: true })
    .eq("scope", "system")
    .eq("is_published", true);

  if (query) {
    countQuery = countQuery.or(
      `title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`
    );
  }
  if (selectedCategory && selectedCategory !== "all") {
    countQuery = countQuery.eq("category", selectedCategory);
  }

  const { count } = await countQuery;
  const totalCount = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);

  // 3. Fetch paginated range of posts
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let postsQuery = supabase
    .from("blog_posts")
    .select(
      "id,title,slug,excerpt,category,cover_image_url,published_at,created_at",
    )
    .eq("scope", "system")
    .eq("is_published", true);

  if (query) {
    postsQuery = postsQuery.or(
      `title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`
    );
  }
  if (selectedCategory && selectedCategory !== "all") {
    postsQuery = postsQuery.eq("category", selectedCategory);
  }

  const { data } = await postsQuery
    .order("published_at", { ascending: false })
    .range(from, to);

  const posts = (data || []) as NewsPost[];

  // Helper to preserve search filters in pagination links
  const getPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (pageNum > 1) {
      params.set("page", pageNum.toString());
    }
    if (query) {
      params.set("q", query);
    }
    if (selectedCategory) {
      params.set("category", selectedCategory);
    }
    const qs = params.toString();
    return qs ? `/news?${qs}` : "/news";
  };

  const isFiltering = Boolean(query || selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5e7c7] text-[#2c1a11]">
      <LandingHeader currentUser={currentUser} />

      <main className="relative flex-1 w-full py-8 sm:py-12 lg:py-14 overflow-hidden">
        {/* Họa tiết trang trí nền decorate2 & decorate1 */}
        <BackgroundDecor />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          {/* Page Header: Thoáng đãng, trang nghiêm truyền thống */}
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

          {/* Thanh Tìm Kiếm & Lọc Chủ Đề (Royal Heritage Search Bar) */}
          <NewsSearchBar
            initialQuery={query}
            initialCategory={selectedCategory}
            categories={categories}
            totalResults={totalCount}
          />

          {/* Grid of Articles: Từng mục tin tức có khung riêng biệt */}
          {posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {posts.map((post) => (
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
          )}

          {/* Phân Trang (Pagination Controls) */}
          {totalCount > 0 && (
            <div className="pt-6 sm:pt-8 border-t border-[#deb887]/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
              <div className="text-xs text-[#5c4a3e]">
                Hiển thị trang <strong className="text-[#183b28]">{currentPage}</strong> /{" "}
                <strong className="text-[#183b28]">{totalPages}</strong> (Tổng số{" "}
                <strong className="text-[#8c1d1d]">{totalCount}</strong> bản tin)
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  {/* Nút Trang Trước */}
                  {currentPage > 1 ? (
                    <Link
                      href={getPageUrl(currentPage - 1)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#deb887] bg-[#fffdf7] text-xs font-bold text-[#183b28] hover:border-[#8c1d1d] hover:text-[#8c1d1d] transition-colors shadow-2xs"
                    >
                      <ChevronLeft className="size-3.5" />
                      <span>Trước</span>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#deb887]/40 bg-[#fbf7ee] text-xs font-bold text-[#a89687] cursor-not-allowed">
                      <ChevronLeft className="size-3.5" />
                      <span>Trước</span>
                    </span>
                  )}

                  {/* Danh Sách Các Số Trang */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === currentPage;
                    return isActive ? (
                      <span
                        key={pageNum}
                        className="size-8 flex items-center justify-center border-2 border-[#caa455] bg-[#8c1d1d] text-white text-xs font-bold shadow-xs"
                      >
                        {pageNum}
                      </span>
                    ) : (
                      <Link
                        key={pageNum}
                        href={getPageUrl(pageNum)}
                        className="size-8 flex items-center justify-center border border-[#deb887] bg-[#fffdf7] text-xs font-bold text-[#183b28] hover:border-[#8c1d1d] hover:text-[#8c1d1d] transition-colors shadow-2xs"
                      >
                        {pageNum}
                      </Link>
                    );
                  })}

                  {/* Nút Trang Sau */}
                  {currentPage < totalPages ? (
                    <Link
                      href={getPageUrl(currentPage + 1)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#deb887] bg-[#fffdf7] text-xs font-bold text-[#183b28] hover:border-[#8c1d1d] hover:text-[#8c1d1d] transition-colors shadow-2xs"
                    >
                      <span>Sau</span>
                      <ChevronRight className="size-3.5" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#deb887]/40 bg-[#fbf7ee] text-xs font-bold text-[#a89687] cursor-not-allowed">
                      <span>Sau</span>
                      <ChevronRight className="size-3.5" />
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Empty State: Khi không có kết quả */}
          {posts.length === 0 && (
            <div className="relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 max-w-xl mx-auto my-12">
              <div className="relative border border-[#deb887] bg-[#fffdf7] p-8 sm:p-10 text-center space-y-4">
                <span className="pointer-events-none absolute top-1.5 left-1.5 size-3.5 border-t-2 border-l-2 border-[#8c1d1d]" />
                <span className="pointer-events-none absolute top-1.5 right-1.5 size-3.5 border-t-2 border-r-2 border-[#8c1d1d]" />
                <span className="pointer-events-none absolute bottom-1.5 left-1.5 size-3.5 border-b-2 border-l-2 border-[#8c1d1d]" />
                <span className="pointer-events-none absolute bottom-1.5 right-1.5 size-3.5 border-b-2 border-r-2 border-[#8c1d1d]" />

                <div className="inline-flex items-center justify-center size-14 border border-[#caa455] bg-[#fcf5e5] text-[#8c1d1d] shadow-2xs">
                  {isFiltering ? (
                    <SearchX className="size-7" />
                  ) : (
                    <BookOpen className="size-7" />
                  )}
                </div>

                <h3
                  className="text-lg sm:text-xl font-bold text-[#183b28]"
                  style={{
                    fontFamily:
                      '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                  }}
                >
                  {isFiltering
                    ? "Không Tìm Thấy Bản Tin Phù Hợp"
                    : "Chưa Có Bản Tin Nào"}
                </h3>

                <p className="text-xs sm:text-sm text-[#5c4a3e] max-w-md mx-auto leading-relaxed font-sans">
                  {isFiltering ? (
                    query ? (
                      <>
                        Không tìm thấy bài viết nào khớp với từ khóa &ldquo;
                        <strong className="text-[#8c1d1d]">{query}</strong>&rdquo;
                        {selectedCategory ? ` trong chuyên mục "${selectedCategory}"` : ""}.
                        Vui lòng thử từ khóa khác hoặc xóa bộ lọc.
                      </>
                    ) : (
                      <>
                        Không có bài viết nào trong chuyên mục &ldquo;
                        <strong className="text-[#8c1d1d]">{selectedCategory}</strong>&rdquo;.
                      </>
                    )
                  ) : (
                    "Nội dung sự kiện, lễ giỗ tổ và các hoạt động dòng tộc sẽ sớm được ban biên tập cập nhật và đăng tải tại đây."
                  )}
                </p>

                {isFiltering && (
                  <div className="pt-2 font-sans">
                    <Link
                      href="/news"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8c1d1d] hover:bg-[#a62424] text-white text-xs sm:text-sm font-bold border border-[#caa455] transition-colors shadow-xs"
                    >
                      <RotateCcw className="size-3.5" />
                      <span>Xem tất cả bản tin</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
