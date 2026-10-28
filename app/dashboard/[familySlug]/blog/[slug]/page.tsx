import { BlogPost, Family } from "@/types";
import { getFamilyContextBySlug, getSupabase } from "@/utils/supabase/queries";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit,
  Eye,
  Lock,
  Newspaper,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BackgroundDecor from "@/components/landing/BackgroundDecor";
import {
  HeritageBadge,
  HeritageFrame,
} from "@/components/dashboard/HeritageUI";
import ShareArticleButton from "@/components/ShareArticleButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ familySlug: string; slug: string }>;
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

function stripHtml(content: string) {
  return content.replace(/<[^>]+>/g, " ");
}

function hasHtmlContent(content: string) {
  return /<[a-z][\s\S]*>/i.test(content);
}

function renderContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function injectImgInlineStyles(html: string) {
  const traditionalImgStyle =
    "width:100%;height:auto;max-height:520px;border:1px solid #deb887;background-color:#f5e7c7;padding:4px;object-fit:cover;object-position:center;display:block;margin:1.5rem auto";
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
  const { familySlug, slug } = await params;
  const supabase = await getSupabase();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title,excerpt,cover_image_url")
    .eq("slug", slug)
    .eq("scope", "family")
    .maybeSingle();

  if (!post) {
    return { title: "Bản tin không tồn tại" };
  }

  return {
    title: `${post.title} | Bảng tin Dòng tộc`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

export default async function FamilyBlogDetailPage({ params }: PageProps) {
  const { familySlug, slug } = await params;
  const supabase = await getSupabase();

  // Retrieve family context for logged-in managers, or fallback to public family record
  const context = await getFamilyContextBySlug(familySlug);
  let family = context?.family || null;

  if (!family) {
    const { data: fetchedFamily } = await supabase
      .from("families")
      .select("id, name, slug, logo_url")
      .eq("slug", familySlug)
      .maybeSingle();
    family = fetchedFamily as Family | null;
  }

  if (!family) notFound();

  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("scope", "family");

  if (context?.family?.id) {
    query = query.eq("family_id", context.family.id);
  } else {
    query = query.eq("family_id", family.id);
  }

  query = query.eq("slug", slug);

  if (!context?.canEdit) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data) notFound();

  const post = data as BlogPost;
  const isHtmlContent = hasHtmlContent(post.content);
  const paragraphs = isHtmlContent ? [] : renderContent(post.content);
  const [leadParagraph, ...bodyParagraphs] = paragraphs;
  const publishedDate = post.published_at || post.created_at;
  const readingMinutes = getReadingMinutes(post.content);

  const { data: related } = await supabase
    .from("blog_posts")
    .select("id,title,slug,cover_image_url,category,published_at,created_at")
    .eq("scope", "family")
    .eq("family_id", family.id)
    .eq("is_published", true)
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5e7c7] text-[#2c1a11]">
      <main className="relative flex-1 w-full py-6 sm:py-10 lg:py-12 overflow-hidden">
        {/* Background Decor */}
        <BackgroundDecor withMid />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Top Navigation & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/dashboard/${familySlug}/blog`}
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#caa455] bg-[#8c1d1d] text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-[#6e1616] transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span>Bảng tin {family.name}</span>
            </Link>

            <div className="flex items-center gap-2">
              <ShareArticleButton title={post.title} />

              {context?.canEdit && (
                <Link
                  href={`/dashboard/${familySlug}/blog?edit=${post.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#deb887] bg-[#fffdf7] text-xs font-bold text-[#8c1d1d] shadow-xs hover:bg-[#f5e7c7] transition-all"
                >
                  <Edit className="size-3.5" />
                  <span>Sửa bài</span>
                </Link>
              )}
            </div>
          </div>

          {/* MASTER HERITAGE SCROLL FRAME */}
          <article className="relative p-1.5 sm:p-2.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 shadow-[0_4px_30px_rgba(44,26,17,0.08)]">
            <HeritageFrame cornerColor="#8c1d1d" className="p-5 sm:p-8 md:p-12 space-y-8 sm:space-y-10 bg-[#fffdf7]">
              {/* Breadcrumb Navigation Bar */}
              <div className="border-b border-[#deb887]/60 pb-3 sm:pb-4 flex flex-wrap items-center justify-between gap-2">
                <nav className="flex items-center gap-2 text-xs font-sans text-[#7a6455]">
                  <Link href={`/dashboard/${familySlug}`} className="hover:text-[#8c1d1d] transition-colors">
                    {family.name}
                  </Link>
                  <span className="text-[#caa455]">/</span>
                  <Link href={`/dashboard/${familySlug}/blog`} className="hover:text-[#8c1d1d] transition-colors">
                    Bảng tin
                  </Link>
                  <span className="text-[#caa455]">/</span>
                  <span className="text-[#8c1d1d] font-bold truncate max-w-[200px] sm:max-w-xs">
                    {post.category || "Thông báo"}
                  </span>
                </nav>

                <div className="flex items-center gap-2">
                  {post.visibility === "public" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <Eye className="size-3" />
                      Công khai
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      <Lock className="size-3" />
                      Nội bộ dòng họ
                    </span>
                  )}

                  {!post.is_published && (
                    <span className="text-[11px] font-bold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">
                      Bản nháp
                    </span>
                  )}
                </div>
              </div>

              {/* Article Header & Title */}
              <div className="text-center space-y-4">
                <div>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#8c1d1d] border border-[#deb887] bg-[#fcf5e5] px-3.5 py-1 font-sans shadow-2xs">
                    🏛️ Chiếu Thư & Bản Tin Dòng Họ
                  </span>
                </div>

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
                  <span className="size-1 rounded-full bg-[#caa455]" />
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-[#caa455]" />
                    <span>{family.name}</span>
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

              {/* Cover Image Feature (if uploaded) */}
              {post.cover_image_url && (
                <div className="relative mx-auto my-4 max-w-4xl border-2 border-[#deb887] p-1.5 bg-[#f5e7c7] shadow-sm">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-auto max-h-[500px] object-cover"
                  />
                  <div className="mt-2 text-center text-xs italic text-[#7a6455]">
                    Hình ảnh tư liệu bản tin dòng tộc
                  </div>
                </div>
              )}

              {/* Article Content Body */}
              <div className="pt-2">
                {isHtmlContent ? (
                  <div
                    className="article-content font-sans text-sm sm:text-base leading-relaxed text-[#2c1a11]"
                    dangerouslySetInnerHTML={{
                      __html: injectImgInlineStyles(post.content),
                    }}
                  />
                ) : (
                  <div className="space-y-6 font-sans text-sm sm:text-base leading-relaxed text-[#2c1a11]">
                    {leadParagraph && (
                      <p className="font-serif text-base sm:text-lg text-[#1f2d24] font-medium leading-relaxed italic first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-bold first-letter:text-[#8c1d1d] first-letter:font-serif">
                        {leadParagraph}
                      </p>
                    )}

                    {bodyParagraphs.map((paragraph, index) => (
                      <p key={index} className="text-justify leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Closing Stamp & Return */}
              <div className="border-t border-[#deb887]/60 pt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="size-9 flex items-center justify-center rounded-full bg-[#f5e7c7] text-[#8c1d1d] font-bold text-xs border border-[#deb887]">
                    🏛️
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#8c1d1d]">
                      Ban Quản Trị {family.name}
                    </p>
                    <p className="text-[11px] text-[#7a6455]">
                      Lưu trữ tại Không gian Di sản Dòng họ
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ShareArticleButton title={post.title} />
                  <Link
                    href={`/dashboard/${familySlug}/blog`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-[#caa455] bg-[#8c1d1d] text-white text-xs font-bold shadow-xs hover:bg-[#6e1616] transition-colors"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Về bảng tin</span>
                  </Link>
                </div>
              </div>
            </HeritageFrame>
          </article>

          {/* Related Articles in Family */}
          {related && related.length > 0 && (
            <section className="pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-6 bg-[#8c1d1d]" />
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#183b28] font-sans">
                  Các thông báo khác của {family.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <Link
                    href={`/dashboard/${familySlug}/blog/${item.slug}`}
                    key={item.id}
                    className="group border border-[#deb887] bg-[#fffdf7] p-4 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8c1d1d] hover:shadow-md"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c1d1d]">
                      {item.category || "Thông báo"}
                    </p>
                    <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-[#183b28] group-hover:text-[#8c1d1d] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[11px] text-[#7a6455]">
                      {formatDate(item.published_at || item.created_at)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
