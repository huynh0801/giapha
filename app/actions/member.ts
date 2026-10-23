"use server";

import { applyTreeLineage } from "@/app/actions/genealogy";
import { getFamilyContextById, getSupabase } from "@/utils/supabase/queries";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const childRelationshipTypes = [
  "biological_child",
  "adopted_child",
  "step_child",
  "foster_child",
] as const;

function readString(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() || "";
}

function readNullableNumber(formData: FormData, key: string) {
  const value = readString(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function readNullableString(formData: FormData, key: string) {
  const value = readString(formData, key);
  return value || null;
}

async function deleteMemberRecord(
  memberId: string,
  familyId?: string,
  treeId?: string,
) {
  if (!familyId) {
    return { error: "Thiếu thông tin dòng họ." };
  }

  const context = await getFamilyContextById(familyId, treeId);
  if (!context?.canEdit) {
    return {
      error:
        "Từ chối truy cập. Chỉ Super Admin hoặc Admin Dòng Họ active của đúng dòng họ mới có quyền xóa hồ sơ.",
    };
  }

  const supabase = await getSupabase();
  const { error: relationshipError } = await supabase
    .from("relationships")
    .delete()
    .eq("family_id", context.family.id)
    .eq("tree_id", context.tree.id)
    .or(`person_a.eq.${memberId},person_b.eq.${memberId}`);

  if (relationshipError) {
    console.error("Error deleting relationships:", relationshipError);
    return {
      error: "Không thể xóa quan hệ trực tiếp của thành viên này.",
    };
  }

  const { error: privateError } = await supabase
    .from("person_details_private")
    .delete()
    .eq("family_id", context.family.id)
    .eq("tree_id", context.tree.id)
    .eq("person_id", memberId);

  if (privateError) {
    console.error("Error deleting private person details:", privateError);
    return {
      error: "Không thể xóa dữ liệu riêng của thành viên này.",
    };
  }

  const { error: deleteError } = await supabase
    .from("persons")
    .delete()
    .eq("family_id", context.family.id)
    .eq("tree_id", context.tree.id)
    .eq("id", memberId);

  if (deleteError) {
    console.error("Error deleting person:", deleteError);
    return { error: "Đã xảy ra lỗi khi xóa hồ sơ." };
  }

  await applyTreeLineage(supabase, context);

  revalidatePath(`/dashboard/${context.family.slug}`);
  revalidatePath(`/dashboard/${context.family.slug}/members`);
  revalidatePath(`/dashboard/${context.family.slug}/events`);
  revalidatePath(`/dashboard/${context.family.slug}/stats`);
  return { success: true, context };
}

export async function deleteMemberRecordAction(formData: FormData) {
  const memberId = formData.get("member_id")?.toString();
  const familyId = formData.get("family_id")?.toString();
  const treeId = formData.get("tree_id")?.toString();

  if (!memberId) {
    return { error: "Thiếu thông tin thành viên cần xóa." };
  }

  const result = await deleteMemberRecord(memberId, familyId, treeId);
  if (result.error) return { error: result.error };
  return { success: true };
}

export async function createTreeQuickMemberAction(formData: FormData) {
  const familyId = readString(formData, "family_id");
  const treeId = readString(formData, "tree_id");
  const anchorPersonId = readString(formData, "anchor_person_id");
  const selectedSpouseId = readString(formData, "selected_spouse_id");
  const relation = readString(formData, "relation");
  const childType = readString(formData, "child_type");
  const fullName = readString(formData, "full_name");
  const gender = readString(formData, "gender") || "male";
  const relationNote =
    readNullableString(formData, "relation_note") ??
    readNullableString(formData, "note");
  const personNote = readNullableString(formData, "person_note");

  if (!familyId || !treeId || (relation !== "standalone" && !anchorPersonId)) {
    return {
      error:
        "Thiếu ngữ cảnh dòng họ, cây gia phả hoặc người đang chọn.",
    };
  }

  const context = await getFamilyContextById(familyId, treeId);
  if (!context?.canEdit) {
    return {
      error:
        "Từ chối truy cập. Chỉ Super Admin hoặc Admin Dòng Họ mới có quyền thêm thành viên trên cây.",
    };
  }

  if (!fullName) return { error: "Vui lòng nhập họ và tên." };
  if (
    relation !== "child" &&
    relation !== "spouse" &&
    relation !== "standalone"
  ) {
    return { error: "Kiểu quan hệ không hợp lệ." };
  }
  if (
    relation === "child" &&
    !childRelationshipTypes.includes(
      childType as (typeof childRelationshipTypes)[number],
    )
  ) {
    return { error: "Loại quan hệ con không hợp lệ." };
  }

  const supabase = await getSupabase();
  const { data: createdPerson, error: personError } = await supabase
    .from("persons")
    .insert({
      family_id: context.family.id,
      tree_id: context.tree.id,
      full_name: fullName,
      gender,
      birth_year: readNullableNumber(formData, "birth_year"),
      birth_month: readNullableNumber(formData, "birth_month"),
      birth_day: readNullableNumber(formData, "birth_day"),
      is_deceased: false,
      is_in_law: false,
      birth_order: readNullableNumber(formData, "birth_order"),
      generation: null,
      other_names: readNullableString(formData, "other_names"),
      note: personNote,
      visibility: "private",
    })
    .select("id")
    .single();

  if (personError || !createdPerson?.id) {
    console.error("Error creating quick-add person:", personError);
    return {
      error: personError?.message || "Không thể tạo thành viên mới.",
    };
  }

  const newPersonId = createdPerson.id as string;
  const relationshipRows =
    relation === "standalone"
      ? []
      : relation === "spouse"
        ? [
            {
              family_id: context.family.id,
              tree_id: context.tree.id,
              type: "marriage",
              person_a: anchorPersonId,
              person_b: newPersonId,
              note: relationNote,
            },
          ]
        : [
            {
              family_id: context.family.id,
              tree_id: context.tree.id,
              type: childType,
              person_a: anchorPersonId,
              person_b: newPersonId,
              note: relationNote,
            },
            ...(selectedSpouseId
              ? [
                  {
                    family_id: context.family.id,
                    tree_id: context.tree.id,
                    type: childType,
                    person_a: selectedSpouseId,
                    person_b: newPersonId,
                    note: relationNote,
                  },
                ]
              : []),
          ];

  const relationshipError =
    relationshipRows.length > 0
      ? (await supabase.from("relationships").insert(relationshipRows)).error
      : null;

  if (relationshipError) {
    console.error("Error creating quick-add relationship:", relationshipError);
    return {
      error:
        "Đã tạo hồ sơ nhưng chưa nối được quan hệ. Vui lòng mở hồ sơ để kiểm tra lại.",
    };
  }

  const privatePayload = {
    person_id: newPersonId,
    family_id: context.family.id,
    tree_id: context.tree.id,
    phone_number: readNullableString(formData, "phone_number"),
    occupation: readNullableString(formData, "occupation"),
    current_residence: readNullableString(formData, "current_residence"),
  };
  const hasPrivateData =
    privatePayload.phone_number ||
    privatePayload.occupation ||
    privatePayload.current_residence;
  if (hasPrivateData) {
    const { error: privateError } = await supabase
      .from("person_details_private")
      .upsert(privatePayload);
    if (privateError) {
      console.error("Error creating quick-add private details:", privateError);
      return {
        error:
          "Đã tạo thành viên nhưng chưa lưu được thông tin riêng. Vui lòng mở hồ sơ để kiểm tra lại.",
      };
    }
  }

  await applyTreeLineage(supabase, context);

  revalidatePath(`/dashboard/${context.family.slug}`);
  revalidatePath(`/dashboard/${context.family.slug}/members`);
  return { success: true, personId: newPersonId };
}

export async function deleteMemberProfile(
  memberId: string,
  familyId?: string,
  familySlug?: string,
  treeId?: string,
) {
  const result = await deleteMemberRecord(memberId, familyId, treeId);
  if (result.error) return { error: result.error };
  if (!result.context) {
    return {
      error: "Không lấy được ngữ cảnh dòng họ sau khi xóa.",
    };
  }

  const targetSlug = familySlug || result.context.family.slug;
  const targetPath = `/dashboard/${targetSlug}/members?treeId=${result.context.tree.id}`;
  redirect(targetPath);
}

export async function getMemberDetailAction(
  familyId: string,
  treeId: string,
  memberId: string,
  canEditPrivate: boolean = false,
) {
  try {
    const supabase = await getSupabase();
    const { data: personData, error: personError } = await supabase
      .from("persons")
      .select("*")
      .eq("family_id", familyId)
      .eq("tree_id", treeId)
      .eq("id", memberId)
      .single();

    if (personError || !personData) {
      return { success: false, error: "Không thể tải thông tin thành viên." };
    }

    let privateData: Record<string, unknown> | null = null;
    if (canEditPrivate) {
      const { data: privData } = await supabase
        .from("person_details_private")
        .select("*")
        .eq("family_id", familyId)
        .eq("tree_id", treeId)
        .eq("person_id", memberId)
        .single();
      privateData = privData || {};
    }

    return {
      success: true,
      person: personData,
      privateData,
    };
  } catch (error) {
    console.error("Error in getMemberDetailAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Đã xảy ra lỗi hệ thống.",
    };
  }
}
