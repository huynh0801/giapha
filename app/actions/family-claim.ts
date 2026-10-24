"use server";

import { revalidatePath } from "next/cache";
import { applyTreeLineage } from "@/app/actions/genealogy";
import {
  getFamilyContextById,
  getSupabase,
  getUser,
} from "@/utils/supabase/queries";
import { Family } from "@/types";

export interface ClaimActionResult {
  success: boolean;
  error?: string;
  personId?: string;
}

export async function claimExistingPersonAction(data: {
  familyId: string;
  personId: string;
}): Promise<ClaimActionResult> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Bạn chưa đăng nhập." };
    }

    const context = await getFamilyContextById(data.familyId);
    if (!context || !context.membership || context.membership.status !== "active") {
      return {
        success: false,
        error: "Bạn không có quyền trong không gian dòng họ này.",
      };
    }

    const supabase = await getSupabase();

    // Verify person belongs to family
    const { data: person, error: personError } = await supabase
      .from("persons")
      .select("id, full_name")
      .eq("family_id", data.familyId)
      .eq("id", data.personId)
      .maybeSingle();

    if (personError || !person) {
      return { success: false, error: "Không tìm thấy thành viên được chọn." };
    }

    // Update family.settings.member_links
    const currentSettings =
      context.family.settings && typeof context.family.settings === "object"
        ? (context.family.settings as Record<string, unknown>)
        : {};

    const currentMemberLinks =
      currentSettings.member_links && typeof currentSettings.member_links === "object"
        ? (currentSettings.member_links as Record<string, string>)
        : {};

    const nextSettings = {
      ...currentSettings,
      member_links: {
        ...currentMemberLinks,
        [user.id]: data.personId,
      },
    };

    const { error: updateError } = await supabase
      .from("families")
      .update({ settings: nextSettings })
      .eq("id", data.familyId);

    if (updateError) {
      return { success: false, error: "Không thể lưu liên kết: " + updateError.message };
    }

    revalidatePath(`/dashboard/${context.family.slug}`);
    revalidatePath(`/dashboard/${context.family.slug}/members`);

    return { success: true, personId: data.personId };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Lỗi khi liên kết thành viên.",
    };
  }
}

export async function unlinkSelfAction(data: {
  familyId: string;
}): Promise<ClaimActionResult> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Bạn chưa đăng nhập." };
    }

    const context = await getFamilyContextById(data.familyId);
    if (!context || !context.membership || context.membership.status !== "active") {
      return { success: false, error: "Từ chối truy cập." };
    }

    const supabase = await getSupabase();

    const currentSettings =
      context.family.settings && typeof context.family.settings === "object"
        ? (context.family.settings as Record<string, unknown>)
        : {};

    const currentMemberLinks =
      currentSettings.member_links && typeof currentSettings.member_links === "object"
        ? (currentSettings.member_links as Record<string, string>)
        : {};

    const nextLinks = { ...currentMemberLinks };
    delete nextLinks[user.id];

    const nextSettings = {
      ...currentSettings,
      member_links: nextLinks,
    };

    await supabase
      .from("families")
      .update({ settings: nextSettings })
      .eq("id", data.familyId);

    revalidatePath(`/dashboard/${context.family.slug}`);
    revalidatePath(`/dashboard/${context.family.slug}/members`);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Lỗi khi hủy liên kết.",
    };
  }
}

export async function addSelfToFamilyTreeAction(formData: FormData): Promise<ClaimActionResult> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Bạn chưa đăng nhập." };
    }

    const familyId = formData.get("family_id")?.toString();
    const treeId = formData.get("tree_id")?.toString();
    const fullName = formData.get("full_name")?.toString().trim();
    const gender = formData.get("gender")?.toString();
    const birthYearStr = formData.get("birth_year")?.toString().trim();
    const parentId = formData.get("parent_id")?.toString().trim() || null;
    const birthOrderStr = formData.get("birth_order")?.toString().trim();

    if (!familyId || !treeId) {
      return { success: false, error: "Thiếu mã định danh dòng họ hoặc cây gia phả." };
    }

    if (!fullName) {
      return { success: false, error: "Vui lòng nhập họ và tên của bạn." };
    }

    if (gender !== "male" && gender !== "female") {
      return { success: false, error: "Vui lòng chọn giới tính hợp lệ." };
    }

    const context = await getFamilyContextById(familyId, treeId);
    if (!context || !context.membership || context.membership.status !== "active") {
      return {
        success: false,
        error: "Bạn chưa là thành viên chính thức của dòng họ này.",
      };
    }

    const supabase = await getSupabase();

    const birthYear = birthYearStr ? parseInt(birthYearStr, 10) : null;
    const birthOrder = birthOrderStr ? parseInt(birthOrderStr, 10) : null;

    // 1. Create the new person in persons table
    const { data: createdPerson, error: personError } = await supabase
      .from("persons")
      .insert({
        family_id: context.family.id,
        tree_id: context.tree.id,
        full_name: fullName,
        gender,
        birth_year: isNaN(birthYear as number) ? null : birthYear,
        is_deceased: false,
        is_in_law: false,
        birth_order: isNaN(birthOrder as number) ? null : birthOrder,
        generation: null,
        visibility: "private",
        created_by: user.id,
      })
      .select("id")
      .single();

    if (personError || !createdPerson?.id) {
      return {
        success: false,
        error: personError?.message || "Không thể tạo hồ sơ người trong gia phả.",
      };
    }

    const newPersonId = createdPerson.id as string;

    // 2. If parent was selected, add biological_child relationship
    if (parentId) {
      const { error: relError } = await supabase.from("relationships").insert({
        family_id: context.family.id,
        tree_id: context.tree.id,
        type: "biological_child",
        person_a: parentId, // Parent
        person_b: newPersonId, // Child
      });

      if (relError) {
        console.error("Error creating child relationship:", relError);
      }
    }

    // 3. Recalculate lineage & generations
    await applyTreeLineage(supabase, context);

    // 4. Link profile to this new person in family.settings.member_links
    const currentSettings =
      context.family.settings && typeof context.family.settings === "object"
        ? (context.family.settings as Record<string, unknown>)
        : {};

    const currentMemberLinks =
      currentSettings.member_links && typeof currentSettings.member_links === "object"
        ? (currentSettings.member_links as Record<string, string>)
        : {};

    const nextSettings = {
      ...currentSettings,
      member_links: {
        ...currentMemberLinks,
        [user.id]: newPersonId,
      },
    };

    await supabase
      .from("families")
      .update({ settings: nextSettings })
      .eq("id", context.family.id);

    revalidatePath(`/dashboard/${context.family.slug}`);
    revalidatePath(`/dashboard/${context.family.slug}/members`);

    return { success: true, personId: newPersonId };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Đã xảy ra lỗi khi thêm vào cây gia phả.",
    };
  }
}
