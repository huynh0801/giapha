import { BlogPost } from "@/types";
import { getSupabase } from "@/utils/supabase/queries";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock3,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Prevent Next.js from caching this page — always fetch fresh data.
// Fixes: soft reload (F5) serving stale RSC payload that causes CSS/image mismatches.
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function renderContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function hasHtmlContent(content: string) {
  return /<[a-z][\s\S]*>/i.test(content);
}

function stripHtml(content: string) {
  return content.replace(/<[^>]+>/g, " ");
}

/** Inject inline styles into <img> tags so they render correctly before CSS loads */
function injectImgInlineStyles(html: string) {
  const fallbackStyle =
    "width:100%;height:clamp(240px,42vw,460px);border-radius:24px;object-fit:cover;object-position:center;display:block";
  return html
    .replace(
      /<figcaption(?:\s+[^>]*)?>\s*(?:Chú thích ảnh|Chú thích dưới ảnh|&nbsp;|<br\s*\/?>|\s)*\s*<\/figcaption>/gi,
      "",
    )
    .replace(/\sdata-placeholder="[^"]*"/gi, "")
    .replace(/<img\b([^>]*?)(\s*\/?>)/gi, (match, attrs, close) => {
      // Skip if image already has an inline style attribute
      if (/\bstyle\s*=/i.test(attrs)) return match;
      return `<img${attrs} style="${fallbackStyle}"${close}`;
    });
}

function getReadingMinutes(content: string) {
  const words = stripHtml(content).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await getSupabase();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title,excerpt,cover_image_url")
    .eq("slug", slug)
    .eq("scope", "system")
    .eq("is_published", true)
    .maybeSingle();

  if (!post) {
    return {
      title: "Bài viết không tồn tại",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: [post.cover_image_url],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("scope", "system")
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const post = data as BlogPost;
  const isHtmlContent = hasHtmlContent(post.content);
  const paragraphs = isHtmlContent ? [] : renderContent(post.content);
  const [leadParagraph, ...bodyParagraphs] = paragraphs;
  const publishedDate = post.published_at || post.created_at;
  const readingMinutes = getReadingMinutes(post.content);

  const { data: related } = await supabase
    .from("blog_posts")
    .select("id,title,slug,cover_image_url,category,published_at,created_at")
    .eq("scope", "system")
    .eq("is_published", true)
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-[#2f2118]">
      <header className="bg-[#fffdf8] shadow-[0_1px_0_rgba(58,31,19,0.08)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-tight text-[#800000] transition-colors hover:text-[#b56a10]"
          >
            <Newspaper className="size-5 text-stone-950" />
            GIA PHẢ DÒNG HỌ
          </Link>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-full bg-[#f7efe3] px-4 py-2 text-sm font-bold text-stone-700 transition-colors hover:bg-[#efe0cb]"
          >
            <ArrowLeft className="size-4" />
            Tin tức
          </Link>
        </div>
      </header>

      <article>
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 md:pt-14 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-stone-500">
            <Link href="/" className="hover:text-[#800000]">
              Trang chủ
            </Link>
            <ChevronRight className="size-3.5 text-stone-300" />
            <Link href="/news" className="hover:text-[#800000]">
              Bài viết
            </Link>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-2xl font-black leading-[1.15] tracking-tight text-[#2b1810] sm:text-3xl lg:text-[2rem]">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-stone-600 sm:text-base">
                  {post.excerpt}
                </p>
              )}
            </div>

            <aside className="rounded-[24px] bg-white p-5 shadow-[0_18px_45px_rgba(58,31,19,0.08)]">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <CalendarDays className="size-5 text-[#b56a10]" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                    Ngày đăng
                  </p>
                  <p className="mt-1 text-sm font-bold text-stone-800">
                    {formatDate(publishedDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <Clock3 className="size-5 text-[#b56a10]" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                    Thời gian đọc
                  </p>
                  <p className="mt-1 text-sm font-bold text-stone-800">
                    {readingMinutes} phút
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <figure className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(58,31,19,0.12)]">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="aspect-[16/9] w-full object-cover"
              style={{ aspectRatio: "16/9", width: "100%", objectFit: "cover", display: "block" }}
            />
          </figure>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 md:py-12 lg:grid-cols-[220px_minmax(0,760px)] lg:px-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5 text-sm">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 font-bold text-stone-600 transition-colors hover:text-[#800000]"
              >
                <ArrowLeft className="size-4" />
                Xem bài khác
              </Link>
            </div>
          </aside>

          <div className="max-w-none">
            {isHtmlContent ? (
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: injectImgInlineStyles(post.content) }}
              />
            ) : (
              <>
                {leadParagraph && (
                  <p className="text-base font-semibold leading-8 text-[#3a271b] first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-5xl first-letter:font-black first-letter:leading-[0.85] first-letter:text-[#800000]">
                    {leadParagraph}
                  </p>
                )}

                <div className="mt-6 space-y-5">
                  {bodyParagraphs.map((paragraph, index) => (
                    <p key={index} className="text-base leading-8 text-stone-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </>
            )}

            <div className="mt-12 border-t border-stone-200 pt-6">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 rounded-full bg-[#800000] px-5 py-3 text-sm font-black text-white transition-colors hover:bg-[#650000]"
              >
                <ArrowLeft className="size-4" />
                Quay lại danh sách bài viết
              </Link>
            </div>
          </div>
        </section>
      </article>

      {related && related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-600">
                Đọc thêm
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#7D0000] md:text-3xl">
                Bài viết liên quan
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <Link
                href={`/blog/${item.slug}`}
                key={item.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-[0_14px_34px_rgba(58,31,19,0.08)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.cover_image_url}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-600">
                    {item.category}
                  </p>
                  <h3 className="mt-2 line-clamp-2 text-sm font-black leading-snug text-stone-900 group-hover:text-[#7D0000]">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
