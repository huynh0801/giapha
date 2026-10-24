import { NextRequest, NextResponse } from "next/server";
import { getPublicSupabase } from "@/utils/supabase/queries";

const ITEMS_PER_PAGE = 6;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = (searchParams.get("q") || "").trim();
    const category = (searchParams.get("category") || "").trim();
    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const requestedPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    const supabase = getPublicSupabase();
    if (!supabase) {
      return NextResponse.json({
        posts: [],
        totalCount: 0,
        totalPages: 1,
        currentPage: 1,
      });
    }

    // 1. Count query
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
    if (category && category !== "all") {
      countQuery = countQuery.eq("category", category);
    }

    const { count, error: countError } = await countQuery;
    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const totalCount = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
    const currentPage = Math.min(requestedPage, totalPages);

    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    // 2. Posts query
    let postsQuery = supabase
      .from("blog_posts")
      .select(
        "id,title,slug,excerpt,category,cover_image_url,published_at,created_at"
      )
      .eq("scope", "system")
      .eq("is_published", true);

    if (query) {
      postsQuery = postsQuery.or(
        `title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`
      );
    }
    if (category && category !== "all") {
      postsQuery = postsQuery.eq("category", category);
    }

    const { data: posts, error: postsError } = await postsQuery
      .order("published_at", { ascending: false })
      .range(from, to);

    if (postsError) {
      return NextResponse.json({ error: postsError.message }, { status: 500 });
    }

    return NextResponse.json({
      posts: posts || [],
      totalCount,
      totalPages,
      currentPage,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
