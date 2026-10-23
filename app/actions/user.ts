"use server";

import { UserRole } from "@/types";
import {
  getFamilyContextById,
  getProfile,
  getSupabase,
  getUser,
} from "@/utils/supabase/queries";
import { revalidatePath } from "next/cache";

const familyRoles = ["family_admin", "member"] as const;
const membershipStatuses = ["invited", "pending", "active", "blocked"] as const;

function readTrimmed(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() || "";
}

export async function updateOwnProfileContact(formData: FormData) {
  const fullName = readTrimmed(formData, "full_name");
  const phoneNumber = readTrimmed(formData, "phone_number");
  const familySlug = readTrimmed(formData, "family_slug");

  const user = await getUser();
  if (!user) {
    return { error: "Bạn cần đăng nhập để cập nhật thông tin." };
  }

  if (!fullName) {
    return { error: "Vui lòng nhập họ tên." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone_number: phoneNumber || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/admin/families/dashboard");
  revalidatePath("/dashboard");
  if (familySlug) {
    revalidatePath(`/dashboard/${familySlug}`);
    revalidatePath(`/dashboard/${familySlug}/admins`);
  }

  return { success: true };
}

export async function changeUserRole(userId: string, newRole: UserRole) {
  const supabase = await getSupabase();
  const { error } = await supabase.rpc("set_user_role", {
    target_user_id: userId,
    new_role: newRole,
  });

  if (error) {
    console.error("Failed to change user role:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/users");
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const supabase = await getSupabase();
  const { error } = await supabase.rpc("delete_user", {
    target_user_id: userId,
  });

  if (error) {
    console.error("Failed to delete user:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/users");
  revalidatePath("/admin/users");
  return { success: true };
}

export async function adminCreateUser(formData: FormData) {
  const fullName = formData.get("full_name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString() || "";
  const role = formData.get("role")?.toString() || "member";

  if (role !== "system_admin" && role !== "member") {
    return { error: "Vai trò không hợp lệ." };
  }

  const isActiveStr = formData.get("is_active")?.toString();
  const isActive = isActiveStr === "false" ? false : true;

  if (!fullName || !email || !password) {
    return { error: "Tên, email và mật khẩu là bắt buộc." };
  }

  if (password.length < 8) {
    return { error: "Mật khẩu cần ít nhất 8 ký tự." };
  }

  const supabase = await getSupabase();

  const { error } = await supabase.rpc("admin_create_user", {
    new_full_name: fullName,
    new_email: email,
    new_password: password,
    new_role: role,
    new_active: isActive,
  });

  if (error) {
    console.error("Failed to create user:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/users");
  revalidatePath("/admin/users");
  return { success: true };
}

export async function changeOwnPassword(formData: FormData) {
  const currentPassword = formData.get("current_password")?.toString() || "";
  const newPassword = formData.get("new_password")?.toString() || "";
  const confirmPassword = formData.get("confirm_password")?.toString() || "";

  const user = await getUser();
  if (!user?.email) {
    return { error: "Bạn cần đăng nhập để đổi mật khẩu." };
  }

  const profile = await getProfile(user.id);
  if (!profile?.is_active || profile.role !== "system_admin") {
    return { error: "Chỉ tài khoản admin hệ thống đang hoạt động mới dùng được chức năng này." };
  }

  if (!newPassword || newPassword.length < 8) {
    return { error: "Mật khẩu mới cần ít nhất 8 ký tự." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Mật khẩu xác nhận không khớp." };
  }

  if (!profile.must_change_password && !currentPassword) {
    return { error: "Vui lòng nhập mật khẩu hiện tại." };
  }

  const supabase = await getSupabase();

  if (!profile.must_change_password) {
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (verifyError) {
      return { error: "Mật khẩu hiện tại không đúng." };
    }
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: updateError.message };
  }

  const { error: markError } = await supabase.rpc("mark_password_changed");
  if (markError) {
    return { error: markError.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/change-password");
  revalidatePath("/dashboard/users");
  revalidatePath("/admin/users");

  return { success: true };
}

export async function toggleUserStatus(userId: string, newStatus: boolean) {
  const supabase = await getSupabase();
  const { error } = await supabase.rpc("set_user_active_status", {
    target_user_id: userId,
    new_status: newStatus,
  });

  if (error) {
    console.error("Failed to change user status:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/users");
  revalidatePath("/admin/users");
  return { success: true };
}

export async function setUserFamilyMembership(formData: FormData) {
  const userId = formData.get("profile_id")?.toString();
  const familyId = formData.get("family_id")?.toString();
  const role = formData.get("role")?.toString();
  const status = formData.get("status")?.toString() || "active";

  if (!userId || !familyId) {
    return { error: "Vui lòng chọn người dùng và dòng họ." };
  }

  const context = await getFamilyContextById(familyId);
  if (!context?.canManageAdmins) {
    return {
      error:
        "Chỉ Super Admin hoặc Quản trị chính của dòng họ mới có quyền thêm/bỏ quản trị viên.",
    };
  }

  if (!familyRoles.includes(role as (typeof familyRoles)[number])) {
    return { error: "Vai trò dòng họ không hợp lệ." };
  }

  if (!membershipStatuses.includes(status as (typeof membershipStatuses)[number])) {
    return { error: "Trạng thái thành viên không hợp lệ." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase.rpc("set_family_membership", {
    target_family_id: familyId,
    target_profile_id: userId,
    new_role: role,
    new_status: status,
  });

  if (error) {
    console.error("Failed to update family membership:", error);
    return { error: error.message };
  }

  revalidatePath(`/dashboard/${context.family.slug}/requests`);
  revalidatePath(`/dashboard/${context.family.slug}/members`);
  revalidatePath(`/dashboard/${context.family.slug}/admins`);
  revalidatePath(`/dashboard/${context.family.slug}`);
  revalidatePath("/dashboard");
  revalidatePath("/admin/families");
  revalidatePath("/admin/families/dashboard");
  return { success: true };
}
