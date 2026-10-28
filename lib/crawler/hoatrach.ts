import { createClient } from "@supabase/supabase-js";
import { generateUniqueSlug, slugify } from "@/utils/slug";
import { uploadStorageImage } from "@/utils/storage";

export interface ParsedArticle {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  dateStr?: string;
  publishedAt: string;
  sourceUrl: string;
}

export interface CrawlResult {
  success: boolean;
  totalCrawled: number;
  totalSkipped: number;
  insertedPosts: Array<{ id?: string; title: string; slug: string }>;
  errors: string[];
}

const PORTAL_BASE_URL = "https://hoatrach.quangtri.gov.vn";

const CRAWL_SOURCE_PAGES = [
  `${PORTAL_BASE_URL}/`,
  `${PORTAL_BASE_URL}/tin-tuc-su-kien`,
  `${PORTAL_BASE_URL}/tin-hoat-dong`,
  `${PORTAL_BASE_URL}/tin-nong`,
  `${PORTAL_BASE_URL}/thong-tin-chi-dao-dieu-hanh`,
];

/**
 * Extracts and sorts article detail URLs from page HTML.
 * The URLs are deduplicated by article ID and sorted by the epoch timestamp suffix descending (newest first).
 */
export function extractArticleListUrls(html: string): string[] {
  const regex = /href=["'](https:\/\/hoatrach\.quangtri\.gov\.vn\/chi-tiet-tin\/-\/view-article\/1\/[^"']+)["']/g;
  const urlsByArticleId = new Map<string, string>();
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const cleanUrl = match[1].replace(/&amp;/g, "&").trim();
    const articleId = cleanUrl.split("/").pop();
    if (articleId && !urlsByArticleId.has(articleId)) {
      urlsByArticleId.set(articleId, cleanUrl);
    }
  }

  // Also check relative links if any
  const relRegex = /href=["'](\/chi-tiet-tin\/-\/view-article\/1\/[^"']+)["']/g;
  while ((match = relRegex.exec(html)) !== null) {
    const cleanUrl = `${PORTAL_BASE_URL}${match[1].replace(/&amp;/g, "&").trim()}`;
    const articleId = cleanUrl.split("/").pop();
    if (articleId && !urlsByArticleId.has(articleId)) {
      urlsByArticleId.set(articleId, cleanUrl);
    }
  }

  // Sort descending by epoch timestamp suffix (the last path segment)
  return Array.from(urlsByArticleId.values()).sort((a, b) => {
    const idA = parseInt(a.split("/").pop() || "0", 10);
    const idB = parseInt(b.split("/").pop() || "0", 10);
    return idB - idA;
  });
}

/**
 * Extracts article items with thumbnails from page HTML, deduplicated by article ID.
 */
export function extractArticleItemsWithThumbnails(
  html: string
): Map<string, { url: string; thumbnailUrl?: string }> {
  const result = new Map<string, { url: string; thumbnailUrl?: string }>();

  // Extract from artItem containers
  const artItemRegex = /<div[^>]*class=['"][^'"]*artItem[^'"]*['"][^>]*>([\s\S]*?)<\/div>/gi;
  let artMatch: RegExpExecArray | null;

  while ((artMatch = artItemRegex.exec(html)) !== null) {
    const itemHtml = artMatch[1];
    const linkMatch = itemHtml.match(/href=['"]([^'"]*chi-tiet-tin\/-\/view-article\/1\/[^'"]*)['"]/i);
    if (!linkMatch) continue;

    let url = linkMatch[1].replace(/&amp;/g, "&").trim();
    if (!url.startsWith("http")) {
      url = `${PORTAL_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    }

    const articleId = url.split("/").pop();
    if (!articleId) continue;

    let thumbnailUrl: string | undefined;
    const imgMatch = itemHtml.match(/<img[^>]*class=['"][^'"]*img_comment[^'"]*['"][^>]*src=['"]([^'"]+)['"]/i);
    if (imgMatch && imgMatch[1]) {
      let rawSrc = imgMatch[1].trim();
      if (rawSrc.startsWith(".")) rawSrc = rawSrc.slice(1);
      if (!rawSrc.endsWith("imagename=") && !rawSrc.endsWith("imagename=\"") && !rawSrc.endsWith("imagename='")) {
        thumbnailUrl = rawSrc.startsWith("http")
          ? rawSrc
          : `${PORTAL_BASE_URL}${rawSrc.startsWith("/") ? "" : "/"}${rawSrc}`;
      }
    }

    if (!result.has(articleId) || (!result.get(articleId)?.thumbnailUrl && thumbnailUrl)) {
      result.set(articleId, { url, thumbnailUrl });
    }
  }

  // Also collect any standalone article links
  const allUrls = extractArticleListUrls(html);
  for (const u of allUrls) {
    const id = u.split("/").pop();
    if (id && !result.has(id)) {
      result.set(id, { url: u });
    }
  }

  return result;
}

/**
 * Helper to extract inner HTML of a div by class name while balancing nested div tags.
 */
function extractDivContentByClass(html: string, className: string): string {
  const openTagRegex = new RegExp(`<div[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`, "i");
  const match = html.match(openTagRegex);
  if (!match || match.index === undefined) return "";

  const startIndex = match.index + match[0].length;
  let depth = 1;
  let currentIndex = startIndex;

  while (depth > 0 && currentIndex < html.length) {
    const nextOpen = html.indexOf("<div", currentIndex);
    const nextClose = html.indexOf("</div>", currentIndex);

    if (nextClose === -1) break;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      currentIndex = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) {
        return html.slice(startIndex, nextClose);
      }
      currentIndex = nextClose + 6;
    }
  }
  return html.slice(startIndex);
}

/**
 * Extracts article details (title, summary, body content, dates, and cover image) from HTML.
 */
export function parseArticleDetail(html: string, articleUrl: string): ParsedArticle {
  // 1. Extract Title
  const titleMatch =
    html.match(/<h3 class="h1_title_news[^>]*>([\s\S]*?)<\/h3>/i) ||
    html.match(/<div class="article_title[^>]*>([\s\S]*?)<\/div>/i) ||
    html.match(/<title>([\s\S]*?)<\/title>/i);

  const rawTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "Tin tức Hòa Trạch";
  // Clean special entities
  const title = rawTitle
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  // 2. Extract Date
  const dateMatch = html.match(/Ngày đăng:\s*([0-9\/]+)/i);
  const dateStr = dateMatch ? dateMatch[1].trim() : "";
  let publishedAt = new Date().toISOString();

  if (dateStr) {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const d = new Date(year, month, day, 8, 0, 0);
      if (!isNaN(d.getTime())) {
        publishedAt = d.toISOString();
      }
    }
  } else {
    // Fallback: extract epoch timestamp from url
    const epoch = parseInt(articleUrl.split("/").pop() || "", 10);
    if (!isNaN(epoch) && epoch > 1000000000000) {
      publishedAt = new Date(epoch).toISOString();
    }
  }

  // 3. Extract Summary / Excerpt
  let excerpt = extractDivContentByClass(html, "article_summary_detail") ||
    extractDivContentByClass(html, "article_summary");

  excerpt = excerpt
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 4. Extract Main Content
  let content = extractDivContentByClass(html, "article_content") ||
    extractDivContentByClass(html, "detail_content_news");

  if (content) {
    // Remove unwanted script tags, audio players, print buttons, title
    content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    content = content.replace(/<div class="ho_tro"[^>]*>[\s\S]*?<\/div>/gi, "");
    content = content.replace(/<div class="time_fonsize"[^>]*>[\s\S]*?<\/div>/gi, "");
    content = content.replace(/<h3 class="h1_title_news[\s\S]*?<\/h3>/gi, "");
    content = content.trim();
  }

  if (!content) {
    content = `<p>${excerpt || title}</p>`;
  }

  // Append source citation
  const sourceCitation = `
<div class="mt-8 pt-4 border-t border-[#deb887]/60 text-xs text-[#7a6455] italic">
  Nguồn: Cổng thông tin điện tử UBND Xã Hòa Trạch (<a href="${articleUrl}" target="_blank" rel="noopener noreferrer" class="underline hover:text-[#8c1d1d]">${articleUrl}</a>)
</div>
  `.trim();
  content = `${content}\n\n${sourceCitation}`;

  // 5. Extract Cover Image URL
  let coverImageUrl: string | undefined;
  const imgMatches = [
    ...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi),
  ].map((m) => m[1]);

  // Find article content image or viewimage
  const relevantImg = imgMatches.find(
    (src) =>
      src.includes("ViewImage") ||
      src.includes("/o/3cmsnew-portlet") ||
      (src.includes("/documents/") && !src.includes("icon") && !src.includes("logo"))
  );

  if (relevantImg) {
    coverImageUrl = relevantImg.startsWith("http")
      ? relevantImg
      : `${PORTAL_BASE_URL}${relevantImg.startsWith("/") ? "" : "/"}${relevantImg}`;
  }

  return {
    title,
    excerpt: excerpt.slice(0, 300),
    content,
    coverImageUrl,
    dateStr,
    publishedAt,
    sourceUrl: articleUrl,
  };
}

/**
 * Downloads an image from external URL and uploads it to Cloudflare R2 / Storage.
 */
async function mirrorCoverImage(
  imageUrl: string,
  slug: string
): Promise<{ url: string; path?: string } | null> {
  try {
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) GiaphaNewsCrawler/1.0",
      },
    });

    if (!res.ok) return null;

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length < 100) return null;

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const extension = contentType.includes("png") ? "png" : "jpg";
    const fileName = `${slug}-${Date.now()}.${extension}`;

    const file = new File([buffer], fileName, { type: contentType });

    const uploadResult = await uploadStorageImage({
      file,
      folder: "system/covers",
      bucketFallback: "blog-images",
      maxDimension: 1200,
    });

    if (uploadResult.publicUrl) {
      return { url: uploadResult.publicUrl, path: uploadResult.filePath };
    }
  } catch (err) {
    console.warn("Failed to mirror cover image:", imageUrl, err);
  }
  return null;
}

/**
 * Main Crawler Function: Crawls up to `limit` latest articles from Hòa Trạch portal.
 */
export async function crawlHoatrachLatestNews(options?: {
  limit?: number;
  dryRun?: boolean;
}): Promise<CrawlResult> {
  const limit = options?.limit ?? 20;
  const dryRun = options?.dryRun ?? false;

  const result: CrawlResult = {
    success: false,
    totalCrawled: 0,
    totalSkipped: 0,
    insertedPosts: [],
    errors: [],
  };

  // 1. Collect all article links across source pages
  const collectedItems = new Map<string, { url: string; thumbnailUrl?: string }>();

  for (const pageUrl of CRAWL_SOURCE_PAGES) {
    try {
      const res = await fetch(pageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) GiaphaNewsCrawler/1.0",
        },
      });
      if (res.ok) {
        const html = await res.text();
        const items = extractArticleItemsWithThumbnails(html);
        for (const [id, item] of items) {
          if (!collectedItems.has(id) || (!collectedItems.get(id)?.thumbnailUrl && item.thumbnailUrl)) {
            collectedItems.set(id, item);
          }
        }
      }
    } catch (e: any) {
      result.errors.push(`Error fetching page ${pageUrl}: ${e.message}`);
    }
  }

  // Sort chronologically newest first by epoch timestamp
  const sortedItems = Array.from(collectedItems.values())
    .sort((a, b) => {
      const idA = parseInt(a.url.split("/").pop() || "0", 10);
      const idB = parseInt(b.url.split("/").pop() || "0", 10);
      return idB - idA;
    })
    .slice(0, limit);

  if (sortedItems.length === 0) {
    result.errors.push("No articles discovered on hoatrach.quangtri.gov.vn");
    return result;
  }

  // 2. Initialize Supabase client
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    result.errors.push("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return result;
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // Check existing posts to prevent duplicates
  const { data: existingPosts, error: queryErr } = await supabase
    .from("blog_posts")
    .select("id, title, slug, content");

  if (queryErr) {
    result.errors.push(`Failed to query existing posts: ${queryErr.message}`);
    return result;
  }

  const existingTitles = new Set(existingPosts?.map((p) => p.title.trim().toLowerCase()) || []);
  const existingSlugs = new Set(existingPosts?.map((p) => p.slug) || []);
  const existingContents = existingPosts || [];

  // Check if source_url column exists by querying 1 record with source_url
  let hasSourceUrlCol = true;
  const { error: colCheckErr } = await supabase
    .from("blog_posts")
    .select("source_url")
    .limit(1);

  if (colCheckErr && colCheckErr.code === "42703") {
    hasSourceUrlCol = false;
  }

  // Fallback cover image
  const DEFAULT_COVER = "/mo gio co va bao thap.jpg.jpg";

  // 3. Process each article
  for (const item of sortedItems) {
    const articleUrl = item.url;
    try {
      // Check duplicate by URL in content or title
      const isAlreadyCrawled =
        existingContents.some((p) => p.content?.includes(articleUrl)) ||
        existingContents.some((p) =>
          articleUrl.split("/").pop() &&
          p.content?.includes(articleUrl.split("/").pop()!)
        );

      if (isAlreadyCrawled) {
        result.totalSkipped++;
        continue;
      }

      // Fetch article HTML
      const detailRes = await fetch(articleUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) GiaphaNewsCrawler/1.0",
        },
      });

      if (!detailRes.ok) {
        result.errors.push(`Failed to fetch article detail HTTP ${detailRes.status}: ${articleUrl}`);
        continue;
      }

      const detailHtml = await detailRes.text();
      const article = parseArticleDetail(detailHtml, articleUrl);

      // Use thumbnail from listing if detail page has no cover
      if (!article.coverImageUrl && item.thumbnailUrl) {
        article.coverImageUrl = item.thumbnailUrl;
      }

      // Check title duplicate
      if (existingTitles.has(article.title.trim().toLowerCase())) {
        result.totalSkipped++;
        continue;
      }

      // Generate unique slug
      const baseSlug = slugify(article.title) || `tin-hoa-trach-${Date.now()}`;
      const uniqueSlug = await generateUniqueSlug(baseSlug, async (candidate) => {
        if (existingSlugs.has(candidate)) return true;
        const { data } = await supabase
          .from("blog_posts")
          .select("id")
          .eq("scope", "system")
          .eq("slug", candidate)
          .maybeSingle();
        return Boolean(data);
      });

      // Mirror cover image to R2 / Storage
      let coverImageUrl = DEFAULT_COVER;
      let coverImagePath: string | null = null;

      if (article.coverImageUrl) {
        const mirrored = await mirrorCoverImage(article.coverImageUrl, uniqueSlug);
        if (mirrored?.url) {
          coverImageUrl = mirrored.url;
          coverImagePath = mirrored.path || null;
        } else {
          coverImageUrl = article.coverImageUrl;
        }
      }

      if (dryRun) {
        result.totalCrawled++;
        result.insertedPosts.push({ title: article.title, slug: uniqueSlug });
        continue;
      }

      // Insert into blog_posts
      const insertPayload: Record<string, any> = {
        scope: "system",
        family_id: null,
        title: article.title,
        slug: uniqueSlug,
        excerpt: article.excerpt || article.title,
        content: article.content,
        category: "TIN ĐỊA PHƯƠNG",
        cover_image_url: coverImageUrl,
        cover_image_path: coverImagePath,
        is_published: true,
        status: "published",
        visibility: "public",
        published_at: article.publishedAt,
      };

      if (hasSourceUrlCol) {
        insertPayload.source_url = article.sourceUrl;
      }

      const { data: inserted, error: insertErr } = await supabase
        .from("blog_posts")
        .insert(insertPayload)
        .select("id, title, slug")
        .single();

      if (insertErr) {
        result.errors.push(`Insert failed for "${article.title}": ${insertErr.message}`);
      } else if (inserted) {
        result.totalCrawled++;
        result.insertedPosts.push(inserted);
        existingTitles.add(article.title.trim().toLowerCase());
        existingSlugs.add(uniqueSlug);
        existingContents.push({
          id: inserted.id,
          title: inserted.title,
          slug: inserted.slug,
          content: article.content,
        });
      }
    } catch (err: any) {
      result.errors.push(`Error processing ${articleUrl}: ${err.message}`);
    }
  }

  result.success = result.errors.length === 0 || result.totalCrawled > 0;
  return result;
}
