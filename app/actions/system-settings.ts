"use server";

import { getProfile, getSupabase } from "@/utils/supabase/queries";
import { revalidatePath } from "next/cache";

export async function isFamilyApprovalRequired(): Promise<boolean> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "family_approval_required")
      .maybeSingle();

    if (error || !data || !data.value) {
      return true; // Mặc định là cần duyệt nếu chưa có setting
    }

    const value = data.value as { enabled?: boolean };
    return typeof value.enabled === "boolean" ? value.enabled : true;
  } catch {
    return true;
  }
}

export async function toggleFamilyApprovalAction(
  enabled: boolean,
): Promise<{ success: boolean; error?: string; enabled?: boolean }> {
  const profile = await getProfile();
  if (!profile || !profile.is_active || profile.role !== "system_admin") {
    return { success: false, error: "Chỉ Quản trị viên hệ thống mới có quyền đổi thiết lập." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("system_settings")
    .upsert({
      key: "family_approval_required",
      value: { enabled },
      description: "Bắt buộc phê duyệt khi người dùng tạo dòng họ mới",
      updated_at: new Date().toISOString(),
      updated_by: profile.id,
    }, { onConflict: "key" });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/families");
  revalidatePath("/dashboard");

  return { success: true, enabled };
}
