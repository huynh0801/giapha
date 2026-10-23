import HomeBlogCarousel from "@/components/HomeBlogCarousel";
import { BlogPost } from "@/types";
import { getSupabase } from "@/utils/supabase/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

type LandingBlogPost = Pick<
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

export default async function GiaPhaHomePage() {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("blog_posts")
    .select(
      "id,title,slug,excerpt,category,cover_image_url,published_at,created_at",
    )
    .eq("scope", "system")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(24);

  const posts = (data || []) as LandingBlogPost[];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FDF8F1] text-[#3A1F13]">
      <Link
        href="/admin"
        className="fixed right-4 top-4 z-50 hidden rounded-full bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#7D0000] shadow-sm transition-colors hover:bg-white sm:inline-flex"
      >
        Quản trị
      </Link>

      <div className="relative -top-4 flex min-h-[65vh] flex-col items-center justify-center p-4 md:-top-12 md:h-[75vh] md:p-8">
        <div className="pointer-events-none absolute inset-x-4 inset-y-2 rounded-[24px] border-2 border-double border-[#E6D4BE] bg-[#FDF8F1]/20 shadow-sm md:inset-x-16 md:rounded-[40px]" />

        <div className="z-10 w-full max-w-[850px] space-y-3 px-4 text-center md:space-y-4">
          <div className="mb-2 inline-block rounded-full border border-[#CC7722] bg-[#FEFCE8] px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#CC7722] shadow-sm md:mb-4 md:px-6 md:py-2 md:text-sm">
            Nền Tảng Gia Phả Số Hiện Đại & Bảo mật
          </div>

          <h1 className="whitespace-nowrap text-[28px] font-black uppercase leading-none tracking-tighter text-[#7D0000] md:text-7xl">
            Gia Phả Dòng Họ
          </h1>

          <p className="mx-auto max-w-[300px] text-[13px] font-bold italic leading-relaxed text-[#4A4A4A] md:max-w-none md:text-2xl">
            “Gìn giữ những giá trị, cội nguồn - Kết nối các thế hệ”
          </p>

          <div className="mt-6 md:mt-10">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-[#CC7722] px-8 py-3.5 text-[11px] font-black uppercase text-white no-underline shadow-[0_4px_0_rgb(154,80,14)] transition-all active:translate-y-[2px] active:shadow-none md:gap-3 md:px-12 md:py-5 md:text-xl"
            >
              VÀO HỆ THỐNG GIA PHẢ →
            </Link>
          </div>
        </div>
      </div>

      <section className="relative -mt-8 pb-24 md:-mt-12">
        <div className="mx-2 md:mx-12">
          <div className="mb-2 flex justify-end px-1">
            <Link
              href="/news"
              className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400 transition-colors hover:text-[#7D0000] md:text-xs"
            >
              Xem tất cả →
            </Link>
          </div>
          <HomeBlogCarousel posts={posts} />
        </div>
      </section>
    </div>
  );
}
