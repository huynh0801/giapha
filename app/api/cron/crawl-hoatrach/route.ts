import { NextRequest, NextResponse } from "next/server";
import { crawlHoatrachLatestNews } from "@/lib/crawler/hoatrach";
import { getCurrentUserAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Endpoint for scheduled cron execution (Vercel Cron) or manual admin triggers.
 * Vercel Cron sends a GET request with `Authorization: Bearer ${process.env.CRON_SECRET}`.
 */
export async function GET(request: NextRequest) {
  return handleCrawl(request);
}

export async function POST(request: NextRequest) {
  return handleCrawl(request);
}

async function handleCrawl(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    let isAuthorized = false;

    // 1. Verify Vercel Cron header if CRON_SECRET is configured
    if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
      isAuthorized = true;
    } else {
      // 2. Fallback: Verify if current session belongs to a Super Admin
      const user = await getCurrentUserAction();
      if (user?.role === "system_admin") {
        isAuthorized = true;
      } else if (!cronSecret && process.env.NODE_ENV !== "production") {
        // Allow in development mode if no CRON_SECRET configured
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Valid Bearer CRON_SECRET or Super Admin required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 20, 1), 50) : 20;

    const crawlResult = await crawlHoatrachLatestNews({ limit });

    return NextResponse.json({
      success: crawlResult.success,
      totalCrawled: crawlResult.totalCrawled,
      totalSkipped: crawlResult.totalSkipped,
      insertedCount: crawlResult.insertedPosts.length,
      errors: crawlResult.errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Cron crawl-hoatrach failed:", error);
    return NextResponse.json(
      { error: "Internal server error during crawl", details: error.message },
      { status: 500 }
    );
  }
}
