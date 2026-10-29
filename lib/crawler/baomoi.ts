import { createClient } from "@supabase/supabase-js";
import { generateUniqueSlug, slugify } from "@/utils/slug";

export interface BaomoiRawItem {
  id: number;
  contentId?: number;
  title: string;
  date: number; // Unix timestamp in seconds
  url: string;
  redirectUrl?: string;
  thumb?: string;
  publisher?: {
    name: string;
    logo?: string;
    icon?: string;
    url?: string;
  };
  description?: string;
  originalUrl?: string;
}

export interface BaomoiBodyItem {
  type: "text" | "image" | string;
  content?: string;
  description?: string;
  id?: number;
  index?: number;
}

export interface BaomoiParsedArticle {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  publishedAt: string;
  sourceUrl: string;
  originalUrl?: string;
  publisherName?: string;
}

export interface CrawlResult {
  success: boolean;
  totalCrawled: number;
  totalSkipped: number;
  totalPruned?: number;
  insertedPosts: Array<{ id?: string; title: string; slug: string }>;
  errors: string[];
}

export const BAOMOI_QUANG_BINH_TAG_URL = "https://baomoi.com/quang-binh-tag67.epi";

export const BAOMOI_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
  "Cache-Control": "no-cache",
};

/**
 * Parses Next.js SSR hydration data (__NEXT_DATA__) from HTML string.
 */
export function extractBaomoiNextData(html: string): any {
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/i);
  if (!match || !match[1]) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

/**
 * Extracts raw article items from the tag page's parsed __NEXT_DATA__.
 */
export function extractBaomoiTagArticles(nextData: any): BaomoiRawItem[] {
  if (!nextData) return [];
  const items =
    nextData.props?.pageProps?.resp?.data?.content?.items ||
    nextData.props?.pageProps?.resp?.data?.items ||
    nextData.props?.pageProps?.data?.items ||
    [];
  return Array.isArray(items) ? items : [];
}

/**
 * Upgrades standard thumbnail URL to high-resolution 700px 16:9 banner.
 */
export function formatHighResCoverUrl(thumbUrl?: string): string | undefined {
  if (!thumbUrl) return undefined;
  if (thumbUrl.includes("/w250_r3x2/")) {
    return thumbUrl.replace("/w250_r3x2/", "/w700_r16x9/");
  }
  return thumbUrl;
}

/**
 * Strips internal Báo Mới tag-link anchors while keeping their text intact.
 */
export function cleanTagLinks(text: string): string {
  return text.replace(/<a\b[^>]*class=["'][^"']*tag-link[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi, "$1");
}

/**
 * Formats structured article content into clean, semantic HTML with rich images and sources.
 */
export function buildArticleHtml(
  item: BaomoiRawItem,
  detailContent?: {
    bodys?: BaomoiBodyItem[];
    originalUrl?: string;
    publisher?: { name?: string };
    description?: string;
  }
): string {
  const parts: string[] = [];

  const leadText = detailContent?.description || item.description;
  if (leadText) {
    const cleanLead = cleanTagLinks(leadText.trim());
    parts.push(`<div class="article-lead font-semibold text-lg text-stone-800 mb-6 leading-relaxed">${cleanLead}</div>`);
  }

  const bodys = detailContent?.bodys;
  if (bodys && bodys.length > 0) {
    for (const b of bodys) {
      if (b.type === "text" && b.content?.trim()) {
        const cleanP = cleanTagLinks(b.content.trim());
        parts.push(`<p class="mb-5 leading-relaxed text-stone-800 text-justify">${cleanP}</p>`);
      } else if (b.type === "image" && b.content?.trim()) {
        const caption = b.description?.trim() || "";
        parts.push(
          `<figure class="my-6 text-center">` +
            `<img src="${b.content.trim()}" alt="${caption || item.title}" class="rounded-lg border border-amber-900/20 mx-auto max-h-[550px] object-cover" />` +
            (caption ? `<figcaption class="text-xs text-stone-500 italic mt-2 text-center">${cleanTagLinks(caption)}</figcaption>` : "") +
          `</figure>`
        );
      }
    }
  } else if (!leadText) {
    parts.push(`<p class="mb-5 leading-relaxed text-stone-800">${item.title}</p>`);
  }

  const publisherName = detailContent?.publisher?.name || item.publisher?.name || "Báo Mới";
  const sourceUrl = `https://baomoi.com${item.url.split("#")[0]}`;
  const originalUrl = detailContent?.originalUrl || item.originalUrl;

  parts.push(
    `<div class="mt-8 pt-4 border-t border-amber-900/10 text-xs text-stone-500 flex flex-wrap items-center justify-between gap-3">` +
      `<span>Nguồn tin: <strong>${publisherName}</strong> (tổng hợp qua Báo Mới)</span>` +
      `<div class="flex items-center gap-3">` +
        (originalUrl ? `<a href="${originalUrl}" target="_blank" rel="noopener noreferrer" class="text-amber-800 hover:underline">Báo gốc &rarr;</a>` : "") +
        `<a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" class="text-amber-800 hover:underline font-semibold">Xem trên Báo Mới &rarr;</a>` +
      `</div>` +
    `</div>`
  );

  return parts.join("\n");
}

/**
 * Main Crawler Function: Crawls up to `limit` latest articles from Báo Mới Quảng Bình tag.
 */
export async function crawlBaomoiQuangBinhNews(options?: {
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

  try {
    // 1. Fetch the Báo Mới tag page
    const tagRes = await fetch(BAOMOI_QUANG_BINH_TAG_URL, {
      headers: BAOMOI_HEADERS,
    });

    if (!tagRes.ok) {
      result.errors.push(`Failed to fetch tag page HTTP ${tagRes.status}: ${BAOMOI_QUANG_BINH_TAG_URL}`);
      return result;
    }

    const html = await tagRes.text();
    const nextData = extractBaomoiNextData(html);
    if (!nextData) {
      result.errors.push("Failed to extract __NEXT_DATA__ from Báo Mới page");
      return result;
    }

    const rawArticles = extractBaomoiTagArticles(nextData);
    if (rawArticles.length === 0) {
      result.errors.push("No articles found in Báo Mới Quảng Bình tag data");
      return result;
    }

    // Sort newest first by date and slice to requested limit
    const targetArticles = rawArticles
      .sort((a, b) => (b.date || 0) - (a.date || 0))
      .slice(0, limit);

    // 2. Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      result.errors.push("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return result;
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Check if source_url column exists in database
    let hasSourceUrlCol = true;
    const { error: colCheckErr } = await supabase
      .from("blog_posts")
      .select("source_url")
      .limit(1);

    if (colCheckErr && colCheckErr.code === "42703") {
      hasSourceUrlCol = false;
    }

    // Check existing posts to avoid duplicates
    const { data: existingPosts, error: fetchErr } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("scope", "system");

    if (fetchErr) {
      result.errors.push(`Database query failed: ${fetchErr.message}`);
      return result;
    }

    const postsList = (existingPosts || []) as Array<{
      id: string;
      title: string;
      slug: string;
      content?: string;
      source_url?: string;
    }>;

    const existingTitles = new Set(postsList.map((p) => p.title.trim().toLowerCase()));
    const existingSlugs = new Set(postsList.map((p) => p.slug));
    const existingSourceUrls = new Set(
      postsList.filter((p) => p.source_url).map((p) => p.source_url!.trim())
    );
    const existingContents = postsList;

    // 3. Process each article
    for (const item of targetArticles) {
      const sourceUrl = `https://baomoi.com${item.url.split("#")[0]}`;
      const articleId = String(item.id);

      // Check duplicate by source_url, title, or url in content
      const isAlreadyCrawled =
        existingSourceUrls.has(sourceUrl) ||
        existingTitles.has(item.title.trim().toLowerCase()) ||
        existingContents.some((p: any) => p.content?.includes(sourceUrl) || (articleId && p.content?.includes(articleId)));

      if (isAlreadyCrawled) {
        result.totalSkipped++;
        continue;
      }

      try {
        // Fetch article detail page for rich content paragraphs and high-res images
        let detailContent: any = null;
        try {
          const detailRes = await fetch(sourceUrl, { headers: BAOMOI_HEADERS });
          if (detailRes.ok) {
            const detailHtml = await detailRes.text();
            const detailNextData = extractBaomoiNextData(detailHtml);
            detailContent =
              detailNextData?.props?.pageProps?.resp?.data?.content ||
              detailNextData?.props?.pageProps?.data?.content ||
              null;
          }
        } catch (detailErr: any) {
          console.warn(`Detail fetch failed for ${sourceUrl}, using fallback:`, detailErr.message);
        }

        const htmlContent = buildArticleHtml(item, detailContent);

        // Determine cover image
        let coverImageUrl = formatHighResCoverUrl(item.thumb);
        if (detailContent?.images && detailContent.images.length > 0) {
          coverImageUrl = detailContent.images[0];
        }

        // Generate unique slug
        const baseSlug = slugify(item.title) || `tin-quang-binh-${item.id || Date.now()}`;
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

        const publishedAt = item.date
          ? new Date(item.date * 1000).toISOString()
          : new Date().toISOString();

        if (dryRun) {
          result.totalCrawled++;
          result.insertedPosts.push({ title: item.title, slug: uniqueSlug });
          continue;
        }

        const insertPayload: Record<string, any> = {
          scope: "system",
          family_id: null,
          title: item.title,
          slug: uniqueSlug,
          excerpt: item.description || item.title,
          content: htmlContent,
          category: "TIN TỨC QUẢNG BÌNH",
          cover_image_url: coverImageUrl || null,
          is_published: true,
          status: "published",
          visibility: "public",
          published_at: publishedAt,
        };

        if (hasSourceUrlCol) {
          insertPayload.source_url = sourceUrl;
        }

        const { data: inserted, error: insertErr } = await supabase
          .from("blog_posts")
          .insert(insertPayload)
          .select("id, title, slug")
          .single();

        if (insertErr) {
          result.errors.push(`Insert failed for "${item.title}": ${insertErr.message}`);
        } else if (inserted) {
          result.totalCrawled++;
          result.insertedPosts.push(inserted);
          existingTitles.add(item.title.trim().toLowerCase());
          existingSlugs.add(uniqueSlug);
          existingSourceUrls.add(sourceUrl);
        }
      } catch (err: any) {
        result.errors.push(`Error processing article "${item.title}": ${err.message}`);
      }
    }

    // 4. Rolling Window: Keep at most 100 latest crawled articles (auto-purge oldest)
    if (!dryRun) {
      try {
        const pruneRes = await pruneOldCrawledNews(supabase, 100);
        result.totalPruned = pruneRes.prunedCount;
      } catch (pruneErr: any) {
        console.warn("Failed to prune old articles:", pruneErr.message);
      }
    }

    result.success = result.errors.length === 0 || result.totalCrawled > 0;
    return result;
  } catch (err: any) {
    result.errors.push(`Crawler fatal error: ${err.message}`);
    return result;
  }
}

/**
 * Automatically purges older crawled news articles if total count exceeds `maxKeep` (default: 100).
 * Safely scopes to system crawled news (category 'TIN TỨC QUẢNG BÌNH'), preserving all family blogs and custom admin posts.
 */
export async function pruneOldCrawledNews(
  supabase: any,
  maxKeep: number = 100
): Promise<{ prunedCount: number; error?: string }> {
  try {
    const { count, error: countErr } = await supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("scope", "system")
      .eq("category", "TIN TỨC QUẢNG BÌNH");

    if (countErr || !count || count <= maxKeep) {
      return { prunedCount: 0, error: countErr?.message };
    }

    const excessCount = count - maxKeep;
    // Fetch the oldest excessCount articles (ordered by published_at ascending)
    const { data: oldPosts, error: fetchErr } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("scope", "system")
      .eq("category", "TIN TỨC QUẢNG BÌNH")
      .order("published_at", { ascending: true })
      .limit(excessCount);

    if (fetchErr || !oldPosts || oldPosts.length === 0) {
      return { prunedCount: 0, error: fetchErr?.message };
    }

    const idsToDelete = oldPosts.map((p: any) => p.id);
    const { error: delErr } = await supabase
      .from("blog_posts")
      .delete()
      .in("id", idsToDelete);

    if (delErr) {
      return { prunedCount: 0, error: delErr.message };
    }

    return { prunedCount: idsToDelete.length };
  } catch (err: any) {
    return { prunedCount: 0, error: err.message };
  }
}
