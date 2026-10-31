import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export function getSafeRedirectTarget(target: string | null | undefined): string {
  if (!target || typeof target !== "string") {
    return "/";
  }

  if (!target.startsWith("/")) {
    return "/";
  }

  if (target.startsWith("//") || target.includes("//")) {
    return "/";
  }

  if (target.includes("://")) {
    return "/";
  }

  if (target.includes("\\")) {
    return "/";
  }

  if (target.startsWith("/login")) {
    return "/";
  }

  return target;
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const safeNext = getSafeRedirectTarget(next);

  if (code) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      console.error("Auth callback exchangeCodeForSession error:", exchangeError);
      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Auth callback getUser error:", userError);
      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, is_active, full_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.is_active === false) {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/login?error=account_locked`);
    }

    const metadata = user.user_metadata || {};
    const metaFullName = (metadata.full_name || metadata.name || "").trim();
    const metaAvatarUrl = metadata.avatar_url || metadata.picture || "";

    const updates: { full_name?: string; avatar_url?: string; updated_at?: string } = {};

    if (!profile?.full_name && metaFullName) {
      updates.full_name = metaFullName;
    }
    if (!profile?.avatar_url && metaAvatarUrl) {
      updates.avatar_url = metaAvatarUrl;
    }

    if (Object.keys(updates).length > 0) {
      updates.updated_at = new Date().toISOString();
      await supabase.from("profiles").update(updates).eq("id", user.id);
    }
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
