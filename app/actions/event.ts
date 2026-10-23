"use server";

import { getFamilyContextById, getSupabase } from "@/utils/supabase/queries";
import { revalidatePath } from "next/cache";

function readString(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() || "";
}

function readNullableString(formData: FormData, key: string) {
  const value = readString(formData, key);
  return value || null;
}

function readNullableNumber(formData: FormData, key: string) {
  const value = readString(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function revalidateEventSurfaces(familySlug: string, treeId: string) {
  revalidatePath(`/dashboard/${familySlug}`);
  revalidatePath(`/dashboard/${familySlug}/events`);
  revalidatePath(`/dashboard/${familySlug}/members?treeId=${treeId}`);
  revalidatePath(`/dashboard/${familySlug}/members`);
}

export async function saveCustomEventAction(formData: FormData) {
  const eventId = readString(formData, "event_id");
  const familyId = readString(formData, "family_id");
  const treeId = readString(formData, "tree_id");
  const name = readString(formData, "name");
  const eventDate = readString(formData, "event_date");
  const dateMode = readString(formData, "date_mode");

  if (!familyId || !treeId) {
    return { error: "Thiếu thông tin dòng họ hoặc cây gia phả." };
  }

  const context = await getFamilyContextById(familyId, treeId);
  if (!context?.canEdit) {
    return { error: "Chỉ Super Admin hoặc Admin Dòng Họ mới có quyền lưu sự kiện." };
  }

  if (!name) return { error: "Vui lòng nhập tên sự kiện." };
  if (!eventDate) return { error: "Vui lòng chọn ngày diễn ra sự kiện." };

  const isLunar = dateMode === "lunar";
  const payload = {
    family_id: context.family.id,
    tree_id: context.tree.id,
    name,
    event_date: eventDate,
    location: readNullableString(formData, "location"),
    content: readNullableString(formData, "content"),
    is_lunar: isLunar,
    lunar_day: isLunar ? readNullableNumber(formData, "lunar_day") : null,
    lunar_month: isLunar ? readNullableNumber(formData, "lunar_month") : null,
    lunar_year: isLunar ? readNullableNumber(formData, "lunar_year") : null,
  };

  const supabase = await getSupabase();
  const { error } = eventId
    ? await supabase
        .from("custom_events")
        .update(payload)
        .eq("family_id", context.family.id)
        .eq("tree_id", context.tree.id)
        .eq("id", eventId)
    : await supabase.from("custom_events").insert(payload);

  if (error) {
    console.error("Error saving custom event:", error);
    return { error: error.message || "Không thể lưu sự kiện." };
  }

  revalidateEventSurfaces(context.family.slug, context.tree.id);
  return { success: true };
}

export async function deleteCustomEventAction(formData: FormData) {
  const eventId = readString(formData, "event_id");
  const familyId = readString(formData, "family_id");
  const treeId = readString(formData, "tree_id");

  if (!eventId || !familyId || !treeId) {
    return { error: "Thiếu thông tin sự kiện cần xóa." };
  }

  const context = await getFamilyContextById(familyId, treeId);
  if (!context?.canEdit) {
    return { error: "Chỉ Super Admin hoặc Admin Dòng Họ mới có quyền xóa sự kiện." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("custom_events")
    .delete()
    .eq("family_id", context.family.id)
    .eq("tree_id", context.tree.id)
    .eq("id", eventId);

  if (error) {
    console.error("Error deleting custom event:", error);
    return { error: error.message || "Không thể xóa sự kiện." };
  }

  revalidateEventSurfaces(context.family.slug, context.tree.id);
  return { success: true };
}
