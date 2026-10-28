"use server";

import { getProfile, getSupabase } from "@/utils/supabase/queries";
import { uploadStorageImage } from "@/utils/storage";
import { revalidatePath } from "next/cache";

export interface FamilyCreationRequest {
  id: string;
  user_id: string;
  family_name: string;
  origin_location: string | null;
  phone_contact: string;
  description: string | null;
  logo_url: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled";
  rejection_reason: string | null;
  approved_family_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface FamilyCreationRequestAdminRow extends FamilyCreationRequest {
  requester_name: string | null;
  requester_email: string | null;
  requester_avatar: string | null;
}

function getText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function requestFamilyCreationAction(
  _prevState: { success: boolean; error?: string; message?: string },
  formData: FormData,
): Promise<{ success: boolean; error?: string; message?: string }> {
  const profile = await getProfile();
  if (!profile || !profile.is_active) {
    return { success: false, error: "Vui lòng đăng nhập để gửi yêu cầu." };
  }

  const familyName = getText(formData, "family_name");
  const phoneContact = getText(formData, "phone_contact");
  const originLocation = getText(formData, "origin_location");
  const description = getText(formData, "description");

  if (!familyName || familyName.length < 3) {
    return { success: false, error: "Tên dòng họ phải có ít nhất 3 ký tự." };
  }

  if (!phoneContact) {
    return { success: false, error: "Số điện thoại liên hệ là bắt buộc." };
  }

  const supabase = await getSupabase();

  // Kiểm tra chống spam: Không gửi nhiều yêu cầu pending cùng lúc
  const { data: existingPending } = await supabase
    .from("family_creation_requests")
    .select("id")
    .eq("user_id", profile.id)
    .eq("status", "pending")
    .maybeSingle();

  if (existingPending) {
    return {
      success: false,
      error: "Bạn đang có một yêu cầu tạo dòng họ đang chờ xét duyệt. Vui lòng chờ phản hồi.",
    };
  }

  // Xử lý logo nếu có upload
  let logoUrl: string | null = null;
  const logoFile = formData.get("logo_file");
  const isNewFile =
    logoFile !== null &&
    typeof logoFile === "object" &&
    "size" in logoFile &&
    Number((logoFile as { size?: unknown }).size) > 0;

  if (isNewFile) {
    const uploadResult = await uploadStorageImage({
      file: logoFile as File,
      folder: "families/logos",
      maxDimension: 600,
      bucketFallback: "avatars",
    });

    if (uploadResult.success && uploadResult.publicUrl) {
      logoUrl = uploadResult.publicUrl;
    }
  }

  const { error } = await supabase.from("family_creation_requests").insert({
    user_id: profile.id,
    family_name: familyName,
    origin_location: originLocation || null,
    phone_contact: phoneContact,
    description: description || null,
    logo_url: logoUrl,
    status: "pending",
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin/families");

  return {
    success: true,
    message: "Gửi yêu cầu tạo dòng họ thành công! Ban Quản Trị sẽ sớm xét duyệt hồ sơ của bạn.",
  };
}

export async function cancelFamilyCreationAction(
  requestId: string,
): Promise<{ success: boolean; error?: string; message?: string }> {
  const profile = await getProfile();
  if (!profile || !profile.is_active) {
    return { success: false, error: "Vui lòng đăng nhập." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("family_creation_requests")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", requestId)
    .eq("user_id", profile.id)
    .eq("status", "pending");

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin/families");

  return { success: true, message: "Đã hủy yêu cầu tạo dòng họ." };
}

export async function approveFamilyCreationAction(
  requestId: string,
  customSlug?: string,
): Promise<{ success: boolean; error?: string; slug?: string }> {
  const profile = await getProfile();
  if (!profile || !profile.is_active || profile.role !== "system_admin") {
    return { success: false, error: "Chỉ Quản trị viên hệ thống mới có quyền phê duyệt." };
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase.rpc("approve_family_creation_request", {
    p_request_id: requestId,
    p_family_slug: customSlug || null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data && typeof data === "object" && "success" in data && !data.success) {
    return { success: false, error: String(data.error || "Không thể phê duyệt.") };
  }

  revalidatePath("/admin/families");
  revalidatePath("/dashboard");

  const slug = data && typeof data === "object" && "slug" in data ? String(data.slug) : undefined;
  return { success: true, slug };
}

export async function rejectFamilyCreationAction(
  requestId: string,
  reason?: string,
): Promise<{ success: boolean; error?: string }> {
  const profile = await getProfile();
  if (!profile || !profile.is_active || profile.role !== "system_admin") {
    return { success: false, error: "Chỉ Quản trị viên hệ thống mới có quyền từ chối." };
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase.rpc("reject_family_creation_request", {
    p_request_id: requestId,
    p_reason: reason || null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data && typeof data === "object" && "success" in data && !data.success) {
    return { success: false, error: String(data.error || "Không thể từ chối.") };
  }

  revalidatePath("/admin/families");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function getUserActiveFamilyCreationRequest(): Promise<FamilyCreationRequest | null> {
  const profile = await getProfile();
  if (!profile) return null;

  const supabase = await getSupabase();
  const { data } = await supabase
    .from("family_creation_requests")
    .select("*")
    .eq("user_id", profile.id)
    .in("status", ["pending", "rejected"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data as FamilyCreationRequest) || null;
}

export async function getAdminFamilyCreationRequests(
  statusFilter?: string,
): Promise<FamilyCreationRequestAdminRow[]> {
  const profile = await getProfile();
  if (!profile || profile.role !== "system_admin") return [];

  const supabase = await getSupabase();
  let query = supabase
    .from("family_creation_requests")
    .select(`
      *,
      requester:profiles!family_creation_requests_user_id_fkey(
        full_name,
        email,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data } = await query;
  if (!data) return [];

  return data.map((item: any) => ({
    id: item.id,
    user_id: item.user_id,
    family_name: item.family_name,
    origin_location: item.origin_location,
    phone_contact: item.phone_contact,
    description: item.description,
    logo_url: item.logo_url,
    status: item.status,
    rejection_reason: item.rejection_reason,
    approved_family_id: item.approved_family_id,
    created_at: item.created_at,
    updated_at: item.updated_at,
    requester_name: item.requester?.full_name || null,
    requester_email: item.requester?.email || null,
    requester_avatar: item.requester?.avatar_url || null,
  }));
}
