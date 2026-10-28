import Image from "next/image";
import { BlogPost } from "@/types";
import { getSupabase } from "@/utils/supabase/queries";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import BackgroundDecor from "@/components/landing/BackgroundDecor";
import NewsFeed from "@/components/news/NewsFeed";
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

  // 1. Prepare queries for parallel execution
  const categoryQuery = supabase
    .from("blog_posts")
    .select("category")
    .eq("scope", "system")
    .eq("is_published", true);

  // 2. Count matching posts
  let countQueryBuilder = supabase
    .from("blog_posts")
    .select("id", { count: "exact", head: true })
    .eq("scope", "system")
    .eq("is_published", true);

  if (query) {
    countQueryBuilder = countQueryBuilder.or(
      `title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`
    );
  }
  if (selectedCategory && selectedCategory !== "all") {
    countQueryBuilder = countQueryBuilder.eq("category", selectedCategory);
  }

  // 3. Paginated range of posts
  const from = (requestedPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let postsQueryBuilder = supabase
    .from("blog_posts")
    .select(
      "id,title,slug,excerpt,category,cover_image_url,published_at,created_at"
    )
    .eq("scope", "system")
    .eq("is_published", true);

  if (query) {
    postsQueryBuilder = postsQueryBuilder.or(
      `title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`
    );
  }
  if (selectedCategory && selectedCategory !== "all") {
    postsQueryBuilder = postsQueryBuilder.eq("category", selectedCategory);
  }

  postsQueryBuilder = postsQueryBuilder
    .order("published_at", { ascending: false })
    .range(from, to);

  // Execute all 3 queries concurrently
  const [categoryRes, countRes, postsRes] = await Promise.all([
    categoryQuery,
    countQueryBuilder,
    postsQueryBuilder,
  ]);

  const categories = Array.from(
    new Set((categoryRes.data || []).map((row) => row.category).filter(Boolean))
  ) as string[];

  const totalCount = countRes.count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const posts = (postsRes.data || []) as NewsPost[];

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

          {/* AJAX Live Smart Search Feed */}
          <NewsFeed
            initialPosts={posts}
            initialTotalCount={totalCount}
            initialTotalPages={totalPages}
            initialPage={currentPage}
            initialQuery={query}
            initialCategory={selectedCategory}
            categories={categories}
          />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
