import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import LandingQuickNav from "@/components/landing/LandingQuickNav";
import LandingAbout from "@/components/landing/LandingAbout";
import LandingLatestNews from "@/components/landing/LandingLatestNews";
import LandingFooter from "@/components/landing/LandingFooter";
import type { LandingNewsItem } from "@/components/landing/types";
import { BlogPost } from "@/types";
import { getSupabase } from "@/utils/supabase/queries";
import { unstable_cache } from "next/cache";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatNewsDate(value: string | null) {
  if (!value) return "";
  try {
    const d = new Date(value);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "";
  }
}

/**
 * Cached fetcher for latest news on homepage:
 * Serves immediately from memory cache (0ms network delay),
 * background revalidates every 60s or whenever an admin publishes/edits a post.
 */
const getLatestSystemNews = unstable_cache(
  async (): Promise<LandingNewsItem[]> => {
    try {
      const supabase = await getSupabase();
      const { data: posts, error } = await supabase
        .from("blog_posts")
        .select("id,title,slug,excerpt,cover_image_url,published_at,created_at")
        .eq("scope", "system")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3);

      if (!error && posts && posts.length > 0) {
        return (posts as BlogPost[]).map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          date: formatNewsDate(post.published_at || post.created_at),
          excerpt: post.excerpt || "",
          imageUrl: post.cover_image_url || null,
        }));
      }
    } catch (err) {
      console.error("Error fetching homepage news:", err);
    }
    return [];
  },
  ["homepage-latest-news"],
  {
    revalidate: 60,
    tags: ["homepage-news", "blog-posts"],
  }
);

export default async function GiaPhaHomePage() {
  const newsItems = await getLatestSystemNews();

  return (
    <div className="min-h-screen flex flex-col bg-[#f5e7c7] text-[#2c1a11] selection:bg-[#8c1d1d] selection:text-white">
      {/* 1. Header Navigation */}
      <LandingHeader />

      <main className="flex-1 flex flex-col">
        {/* 2. Hero Section */}
        <LandingHero />

        {/* 3. Quick Navigation Strip (5 Cards) */}
        <LandingQuickNav />

        {/* 4. Lower Content: About & Latest News Grid (70% / 30% split with matching heights) */}
        <section className="relative w-full py-10 sm:py-14 lg:py-16 bg-[#f5e7c7]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-8 items-stretch">
              {/* Left Column: Về dòng họ chúng tôi (70% width) */}
              <div className="lg:col-span-7 flex flex-col h-full">
                <LandingAbout />
              </div>

              {/* Right Column: Tin tức mới nhất (30% width) */}
              <div className="lg:col-span-3 flex flex-col h-full">
                <LandingLatestNews news={newsItems} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Footer Ornamental Ribbon */}
      <LandingFooter />

      {/* Screen-reader accessible admin link (visually hidden, removed from bottom-right corner) */}
      <Link href="/admin" className="sr-only">
        Quản trị
      </Link>
    </div>
  );
}
