import { BlogPost } from "@/types";
import { getSupabase } from "@/utils/supabase/queries";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import BackgroundDecor from "@/components/landing/BackgroundDecor";
import { getCurrentUserAction } from "@/app/actions/auth";

// Prevent Next.js from caching this page — always fetch fresh data.
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(value: string | null) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function formatShortDate(value: string | null) {
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

/** Inject traditional heritage styles into <img> tags inside HTML body */
function injectImgInlineStyles(html: string) {
  const traditionalImgStyle =
    "width:100%;height:auto;max-height:520px;border-radius:0px;border:1px solid #deb887;background-color:#f5e7c7;padding:4px;object-fit:cover;object-position:center;display:block;margin:1.5rem auto";
  return html
    .replace(
      /<figcaption(?:\s+[^>]*)?>\s*(?:Chú thích ảnh|Chú thích dưới ảnh|&nbsp;|<br\s*\/?>|\s)*\s*<\/figcaption>/gi,
      "",
    )
    .replace(/\sdata-placeholder="[^"]*"/gi, "")
    .replace(/<img\b([^>]*?)(\s*\/?>)/gi, (match, attrs, close) => {
      const cleanAttrs = attrs.replace(/\bstyle\s*=\s*(['"]).*?\1/gi, "");
      return `<img${cleanAttrs} style="${traditionalImgStyle}"${close}`;
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
    title: `${post.title} | Gia Phả Dòng Họ`,
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
  const [supabase, currentUser] = await Promise.all([
    getSupabase(),
    getCurrentUserAction(),
  ]);

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
    <div className="min-h-screen flex flex-col bg-[#f5e7c7] text-[#2c1a11]">
      <LandingHeader currentUser={currentUser} />

      <main className="relative flex-1 w-full py-8 sm:py-12 lg:py-14 overflow-hidden">
        {/* Background Decor: decorate2 (left) and decorate1 (right) */}
        <BackgroundDecor withMid />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14">
          {/* MASTER SCROLL FRAME: Đóng toàn bộ nội dung bài viết vào 1 khung chỉ kép lớn */}
          <article className="relative p-1.5 sm:p-2.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 shadow-[0_4px_30px_rgba(44,26,17,0.08)]">
            <div className="relative border border-[#deb887] bg-[#fffdf7] p-5 sm:p-8 md:p-12 space-y-8 sm:space-y-10">
              {/* 4 Traditional Corner Brackets */}
              <span className="pointer-events-none absolute top-2 left-2 size-5 border-t-2 border-l-2 border-[#8c1d1d]" />
              <span className="pointer-events-none absolute top-2 right-2 size-5 border-t-2 border-r-2 border-[#8c1d1d]" />
              <span className="pointer-events-none absolute bottom-2 left-2 size-5 border-b-2 border-l-2 border-[#8c1d1d]" />
              <span className="pointer-events-none absolute bottom-2 right-2 size-5 border-b-2 border-r-2 border-[#8c1d1d]" />

              {/* Breadcrumb Navigation Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#deb887]/60 pb-4">
                <nav className="flex items-center gap-2 text-xs font-sans text-[#7a6455]">
                  <Link
                    href="/"
                    className="hover:text-[#8c1d1d] transition-colors"
                  >
                    Trang chủ
                  </Link>
                  <ChevronRight className="size-3 text-[#caa455]" />
                  <Link
                    href="/news"
                    className="hover:text-[#8c1d1d] transition-colors"
                  >
                    Bản tin dòng tộc
                  </Link>
                  <ChevronRight className="size-3 text-[#caa455]" />
                  <span className="text-[#8c1d1d] font-bold truncate max-w-[200px] sm:max-w-xs">
                    {post.category || "Tin tức"}
                  </span>
                </nav>

                <Link
                  href="/news"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8c1d1d] hover:text-[#6e1616] transition-colors font-sans"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Về danh sách tin</span>
                </Link>
              </div>

              {/* Article Header & Title */}
              <div className="text-center space-y-4">
                {/* Category Badge */}
                <div>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#8c1d1d] border border-[#deb887] bg-[#fcf5e5] px-3.5 py-1 font-sans shadow-2xs">
                    {post.category || "Văn hóa dòng họ"}
                  </span>
                </div>

                {/* Main Title */}
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-[#183b28] tracking-normal uppercase leading-tight sm:leading-snug max-w-4xl mx-auto"
                  style={{
                    fontFamily:
                      '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                  }}
                >
                  {post.title}
                </h1>

                {/* Metadata Bar */}
                <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 text-xs text-[#6e5849] font-sans pt-1">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5 text-[#caa455]" />
                    <span>{formatDate(publishedDate)}</span>
                  </div>
                  <span className="size-1 rounded-full bg-[#caa455]" />
                  <div className="flex items-center gap-1.5">
                    <Clock3 className="size-3.5 text-[#caa455]" />
                    <span>Thời gian đọc: {readingMinutes} phút</span>
                  </div>
                </div>

                {/* Traditional Ornament separator */}
                <div className="pt-2 flex items-center justify-center gap-3">
                  <span className="h-[1px] w-20 sm:w-32 bg-gradient-to-r from-transparent to-[#caa455]" />
                  <span className="size-2 rotate-45 bg-[#8c1d1d]" />
                  <span className="h-[1px] w-20 sm:w-32 bg-gradient-to-l from-transparent to-[#caa455]" />
                </div>

                {/* Excerpt Callout */}
                {post.excerpt && (
                  <div className="mt-4 border-l-4 border-[#8c1d1d] bg-[#fdfaf3] p-4 sm:p-5 text-left border border-y-[#deb887]/40 border-r-[#deb887]/40">
                    <p className="text-xs sm:text-sm text-[#4a3b2f] leading-relaxed font-sans font-medium italic text-justify">
                      &ldquo;{post.excerpt}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* Cover Image with Double Gold Borders */}
              {post.cover_image_url && (
                <div className="relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]">
                  <div className="relative border border-[#deb887] overflow-hidden aspect-[16/9] w-full">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="size-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Article Body Content */}
              <div className="max-w-none font-sans text-sm sm:text-base leading-relaxed sm:leading-8 text-[#2c1a11] space-y-5">
                {isHtmlContent ? (
                  <div
                    className="article-content leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{
                      __html: injectImgInlineStyles(post.content),
                    }}
                  />
                ) : (
                  <>
                    {leadParagraph && (
                      <p className="text-base sm:text-lg font-semibold leading-relaxed sm:leading-8 text-[#183b28] first-letter:float-left first-letter:mr-2.5 first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:text-[#8c1d1d] first-letter:font-serif">
                        {leadParagraph}
                      </p>
                    )}

                    <div className="space-y-4 sm:space-y-5 text-[#3d2c20]">
                      {bodyParagraphs.map((paragraph, index) => (
                        <p
                          key={index}
                          className="leading-relaxed sm:leading-8 text-justify"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Return Button inside Frame Footer */}
              <div className="pt-8 border-t border-[#deb887]/70 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#caa455] bg-[#8c1d1d] text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-[#6e1616] transition-colors"
                >
                  <ArrowLeft className="size-4" />
                  <span>Quay lại danh sách bản tin</span>
                </Link>

                <div className="text-xs text-[#7a6455] italic">
                  Gia phả số dòng họ – Giữ gìn cội nguồn truyền thống
                </div>
              </div>
            </div>
          </article>

          {/* RELATED ARTICLES: Lưới thẻ cổ truyền đồng bộ trang /news */}
          {related && related.length > 0 && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-center gap-3 w-full">
                <span className="h-[1px] flex-1 max-w-xs bg-gradient-to-r from-transparent via-[#caa455] to-[#caa455]" />
                <h2
                  className="text-lg sm:text-2xl font-bold tracking-tight text-[#183b28] uppercase shrink-0 px-3"
                  style={{
                    fontFamily:
                      '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                  }}
                >
                  Các Bản Tin Khác
                </h2>
                <span className="h-[1px] flex-1 max-w-xs bg-gradient-to-l from-transparent via-[#caa455] to-[#caa455]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/blog/${item.slug}`}
                    className="group block relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 hover:border-[#8c1d1d] transition-all shadow-[0_2px_12px_rgba(44,26,17,0.05)]"
                  >
                    <div className="relative border border-[#deb887] bg-[#fffdf7] group-hover:bg-[#fffefb] p-4 flex flex-col justify-between h-full transition-colors">
                      {/* 4 Traditional Corner Brackets */}
                      <span className="pointer-events-none absolute top-1 left-1 size-3 border-t-2 border-l-2 border-[#8c1d1d]" />
                      <span className="pointer-events-none absolute top-1 right-1 size-3 border-t-2 border-r-2 border-[#8c1d1d]" />
                      <span className="pointer-events-none absolute bottom-1 left-1 size-3 border-b-2 border-l-2 border-[#8c1d1d]" />
                      <span className="pointer-events-none absolute bottom-1 right-1 size-3 border-b-2 border-r-2 border-[#8c1d1d]" />

                      <div>
                        {/* Image with gold framing */}
                        <div className="relative aspect-[16/10] w-full border border-[#deb887] bg-[#f5e7c7] overflow-hidden mb-3">
                          <img
                            src={item.cover_image_url}
                            alt={item.title}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Meta: Category & Date */}
                        <div className="flex items-center justify-between gap-2 border-b border-[#deb887]/50 pb-1.5 mb-2 font-sans">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c1d1d]">
                            {item.category || "Tin tức"}
                          </span>
                          <span className="text-[11px] text-[#7a6455]">
                            {formatShortDate(
                              item.published_at || item.created_at,
                            )}
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
                          {item.title}
                        </h3>
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
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
