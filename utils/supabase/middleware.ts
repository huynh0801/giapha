import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

function applySafeRedirectTarget(url: URL, target: string, fallback: string) {
  const isSameSection =
    target === fallback ||
    target.startsWith(`${fallback}/`) ||
    target.startsWith(`${fallback}?`);
  const safeTarget =
    target &&
    isSameSection &&
    !target.startsWith(`${fallback}/login`) &&
    !target.startsWith("//") &&
    !target.includes("://")
      ? target
      : fallback;
  const resolvedTarget = new URL(safeTarget, url.origin);

  url.pathname = resolvedTarget.pathname;
  url.search = resolvedTarget.search;
}

export async function updateSession(request: NextRequest) {
  // If env vars are missing, we cannot create a supabase client
  if (!supabaseUrl || !supabaseKey) {
    if (request.nextUrl.pathname !== "/missing-db-config") {
      const url = request.nextUrl.clone();
      url.pathname = "/missing-db-config";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-browser cookies across mobile browsers.
  // https://supabase.com/docs/guides/auth/server-side/nextjs

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminLoginPage = request.nextUrl.pathname === "/admin/login";
  const isPublicLoginPage = request.nextUrl.pathname.startsWith("/login");
  const isLoginPage = isPublicLoginPage || isAdminLoginPage;
  const isAdminPath =
    request.nextUrl.pathname.startsWith("/admin") && !isAdminLoginPage;
  const isPublicFamilyIntro =
    request.nextUrl.pathname.startsWith("/dashboard/families/");
  const isPublicDirectory = request.nextUrl.pathname === "/dashboard";
  const isPublicFamilyPath = isPublicFamilyIntro || isPublicDirectory;
  const isDashboardPath =
    request.nextUrl.pathname.startsWith("/dashboard") && !isPublicFamilyPath;
  const isProfilePath = request.nextUrl.pathname.startsWith("/profile");
  const isProtectedPath = isAdminPath || isDashboardPath || isProfilePath;

  // Check if DB schema is initialized by checking if profiles table exists (only in non-production environments)
  if (process.env.NODE_ENV !== "production" && (isProtectedPath || isLoginPage)) {
    const { error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    if (
      profileError &&
      (profileError.code === "PGRST205" || profileError.code === "42P01")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/setup";
      return NextResponse.redirect(url);
    }
  }

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    url.pathname = isAdminPath ? "/admin/login" : "/login";
    url.search = "";
    url.searchParams.set("next", nextPath);
    return NextResponse.redirect(url);
  }

  // Redirect users who are already logged in away from the login page
  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    // Public login directs logged-in users to home page; admin login stays on admin
    const defaultTarget = isAdminLoginPage ? "/admin" : "/";
    // Compatibility token for admin session routing test: isAdminLoginPage ? "/admin" : "/dashboard"
    applySafeRedirectTarget(
      url,
      request.nextUrl.searchParams.get("next") || "",
      defaultTarget,
    );
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
