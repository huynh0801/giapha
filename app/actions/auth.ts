"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

function explainAuthError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Không thể kết nối dịch vụ xác thực.";

  if (
    message.includes("fetch") ||
    message.includes("NetworkError") ||
    message.includes("Failed to fetch")
  ) {
    return "Không kết nối được dịch vụ xác thực. Vui lòng kiểm tra cấu hình cơ sở dữ liệu.";
  }

  if (message.includes("Invalid login credentials")) {
    return "Email hoặc mật khẩu không chính xác.";
  }

  return message;
}

function getSafeAdminRedirect(nextPath?: string | null) {
  if (
    !nextPath ||
    !nextPath.startsWith("/admin") ||
    nextPath.startsWith("/admin/login") ||
    nextPath.startsWith("//") ||
    nextPath.includes("://")
  ) {
    return "/admin";
  }
  return nextPath;
}

export interface AuthActionResult {
  success: boolean;
  redirect?: string;
  message?: string;
  error?: string;
}

export async function loginAction(data: {
  email: string;
  password: string;
}): Promise<AuthActionResult> {
  try {
    const email = data.email?.trim().toLowerCase();
    const password = data.password;

    if (!email || !password) {
      return { success: false, error: "Vui lòng nhập đầy đủ email và mật khẩu." };
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: explainAuthError(error) };
    }

    return { success: true, redirect: "/dashboard" };
  } catch (error) {
    return { success: false, error: explainAuthError(error) };
  }
}

export async function adminLoginAction(data: {
  email: string;
  password: string;
  nextPath?: string;
}): Promise<AuthActionResult> {
  try {
    const email = data.email?.trim().toLowerCase();
    const password = data.password;

    if (!email || !password) {
      return { success: false, error: "Vui lòng nhập đầy đủ email và mật khẩu." };
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: authData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError || !authData.user) {
      return {
        success: false,
        error: explainAuthError(loginError || "Không thể đăng nhập."),
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role,is_active,must_change_password")
      .eq("id", authData.user.id)
      .single();

    if (
      profileError ||
      !profile?.is_active ||
      profile.role !== "system_admin"
    ) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: "Tài khoản này chưa có quyền truy cập khu quản trị hệ thống.",
      };
    }

    const redirect = profile.must_change_password
      ? "/admin/change-password"
      : getSafeAdminRedirect(data.nextPath);

    return { success: true, redirect };
  } catch (error) {
    return { success: false, error: explainAuthError(error) };
  }
}

export async function signUpAction(data: {
  email: string;
  password: string;
  confirmPassword?: string;
}): Promise<AuthActionResult> {
  try {
    const email = data.email?.trim().toLowerCase();
    const password = data.password;
    const confirmPassword = data.confirmPassword;

    if (!email || !password) {
      return { success: false, error: "Vui lòng nhập đầy đủ email và mật khẩu." };
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return { success: false, error: "Mật khẩu xác nhận không khớp." };
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return { success: false, error: explainAuthError(signUpError) };
    }

    if (signUpData.user?.identities && signUpData.user.identities.length === 0) {
      return {
        success: false,
        error: "Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.",
      };
    }

    if (signUpData.session) {
      return { success: true, redirect: "/dashboard" };
    }

    // Attempt instant sign-in for auto-confirmed configurations
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (!signInError && signInData.session) {
      return { success: true, redirect: "/dashboard" };
    }

    return {
      success: true,
      message: "Đăng ký thành công! Bạn có thể đăng nhập để xem gia phả.",
    };
  } catch (error) {
    return { success: false, error: explainAuthError(error) };
  }
}

export async function signOutAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể đăng xuất.",
    };
  }
}
