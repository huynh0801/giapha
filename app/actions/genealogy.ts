"use server";

import type {
  FamilyContext,
  Gender,
  Person,
  Relationship,
  RelationshipType,
} from "@/types";
import {
  computeGenealogyState,
  type GenealogyComputationResult,
} from "@/utils/genealogyEngine";
import { getFamilyContextById, getSupabase, getUser } from "@/utils/supabase/queries";
import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const relationshipTypes: RelationshipType[] = [
  "marriage",
  "biological_child",
  "adopted_child",
  "step_child",
  "foster_child",
];

function readString(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? "";
}

function readNullableString(formData: FormData, key: string) {
  return readString(formData, key) || null;
}

function readNullableNumber(formData: FormData, key: string) {
  const value = readString(formData, key);
  if (!value) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function readBoolean(formData: FormData, key: string) {
  return ["true", "1", "on", "yes"].includes(readString(formData, key).toLowerCase());
}

function revalidateGenealogyPaths(context: FamilyContext) {
  const base = `/dashboard/${context.family.slug}`;
  revalidatePath(base);
  revalidatePath(`${base}/members`);
  revalidatePath(`${base}/lineage`);
  revalidatePath(`${base}/stats`);
  revalidatePath(`${base}/kinship`);
  revalidatePath(`${base}/data`);
}

async function loadGenealogyData(
  supabase: SupabaseClient,
  context: FamilyContext,
) {
  const [personsResult, relationshipsResult] = await Promise.all([
    supabase
      .from("persons")
      .select("*")
      .eq("family_id", context.family.id)
      .eq("tree_id", context.tree.id),
    supabase
      .from("relationships")
      .select("*")
      .eq("family_id", context.family.id)
      .eq("tree_id", context.tree.id),
  ]);

  if (personsResult.error) throw personsResult.error;
  if (relationshipsResult.error) throw relationshipsResult.error;

  return {
    persons: (personsResult.data ?? []) as Person[],
    relationships: (relationshipsResult.data ?? []) as Relationship[],
  };
}

export async function computeTreeLineage(
  supabase: SupabaseClient,
  context: FamilyContext,
): Promise<GenealogyComputationResult> {
  const data = await loadGenealogyData(supabase, context);
  return computeGenealogyState({
    ...data,
    rootPersonId: context.tree.root_person_id,
  });
}

export async function applyTreeLineage(
  supabase: SupabaseClient,
  context: FamilyContext,
): Promise<GenealogyComputationResult> {
  const result = await computeTreeLineage(supabase, context);
  if (result.issues.some((issue) => issue.severity === "error")) return result;

  const changed = result.updates.filter((update) => update.changed);
  const chunkSize = 50;
  for (let index = 0; index < changed.length; index += chunkSize) {
    const chunk = changed.slice(index, index + chunkSize);
    const responses = await Promise.all(
      chunk.map((update) =>
        supabase
          .from("persons")
          .update({
            generation: update.new_generation,
            is_in_law: update.new_is_in_law,
            birth_order: update.new_birth_order,
          })
          .eq("id", update.id)
          .eq("family_id", context.family.id)
          .eq("tree_id", context.tree.id),
      ),
    );
    const failed = responses.find((response) => response.error);
    if (failed?.error) throw failed.error;
  }

  return result;
}

async function getEditableContext(formData: FormData, targetMemberId?: string) {
  const familyId = readString(formData, "family_id");
  const treeId = readString(formData, "tree_id");
  if (!familyId || !treeId) {
    return { error: "Thiếu thông tin dòng họ hoặc cây gia phả." } as const;
  }
  const context = await getFamilyContextById(familyId, treeId);
  if (!context || context.tree.id !== treeId) {
    return { error: "Bạn không có quyền chỉnh sửa cây gia phả này." } as const;
  }
  if (context.canEdit) {
    return { context } as const;
  }
  // Allow members to update their own linked person record
  const user = await getUser();
  if (targetMemberId && user && context.membership?.status === "active") {
    const familySettings = (context.family.settings as Record<string, unknown>) || {};
    const memberLinks = familySettings.member_links as Record<string, string> | undefined;
    if (memberLinks?.[user.id] === targetMemberId) {
      return { context, isSelfEdit: true } as const;
    }
  }
  return { error: "Bạn không có quyền chỉnh sửa cây gia phả này." } as const;
}

export async function previewLineageSyncAction(formData: FormData) {
  const access = await getEditableContext(formData);
  if ("error" in access) return { error: access.error };
  try {
    const supabase = await getSupabase();
    return { success: true, ...(await computeTreeLineage(supabase, access.context)) };
  } catch (error) {
    console.error("Unable to preview genealogy sync:", error);
    return { error: "Không thể tính lại đời thứ cho cây gia phả." };
  }
}

export async function applyLineageSyncAction(formData: FormData) {
  const access = await getEditableContext(formData);
  if ("error" in access) return { error: access.error };
  try {
    const supabase = await getSupabase();
    const result = await applyTreeLineage(supabase, access.context);
    if (result.issues.some((issue) => issue.severity === "error")) {
      return {
        error: "Cây đang có quan hệ mâu thuẫn. Hãy xử lý lỗi trước khi áp dụng.",
        ...result,
      };
    }
    revalidateGenealogyPaths(access.context);
    return { success: true, ...result };
  } catch (error) {
    console.error("Unable to apply genealogy sync:", error);
    return { error: "Không thể cập nhật đời thứ cho cây gia phả." };
  }
}

function normalizeRelationshipPair(
  type: RelationshipType,
  personA: string,
  personB: string,
) {
  if (type !== "marriage" || personA.localeCompare(personB) <= 0) {
    return { personA, personB };
  }
  return { personA: personB, personB: personA };
}

export async function createOrUpdateRelationshipAction(formData: FormData) {
  const access = await getEditableContext(formData);
  if ("error" in access) return { error: access.error };

  const relationshipId = readString(formData, "relationship_id");
  const rawType = readString(formData, "type") as RelationshipType;
  const rawPersonA = readString(formData, "person_a");
  const rawPersonB = readString(formData, "person_b");
  const note = readNullableString(formData, "note");
  if (!relationshipTypes.includes(rawType) || !rawPersonA || !rawPersonB) {
    return { error: "Thông tin quan hệ không hợp lệ." };
  }
  const { personA, personB } = normalizeRelationshipPair(
    rawType,
    rawPersonA,
    rawPersonB,
  );

  try {
    const supabase = await getSupabase();
    const current = await loadGenealogyData(supabase, access.context);
    if (
      !current.persons.some((person) => person.id === personA) ||
      !current.persons.some((person) => person.id === personB)
    ) {
      return { error: "Không tìm thấy thành viên trong cây gia phả hiện tại." };
    }

    const proposed: Relationship = {
      id: relationshipId || `preview-${crypto.randomUUID()}`,
      family_id: access.context.family.id,
      tree_id: access.context.tree.id,
      type: rawType,
      person_a: personA,
      person_b: personB,
      note,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const relationships = [
      ...current.relationships.filter((relationship) => relationship.id !== relationshipId),
      proposed,
    ];
    const preview = computeGenealogyState({
      persons: current.persons,
      relationships,
      rootPersonId: access.context.tree.root_person_id,
    });
    const blockingIssues = preview.issues.filter((issue) => issue.severity === "error");
    if (blockingIssues.length > 0) {
      return { error: blockingIssues[0].message, issues: preview.issues };
    }

    const payload = {
      family_id: access.context.family.id,
      tree_id: access.context.tree.id,
      type: rawType,
      person_a: personA,
      person_b: personB,
      note,
    };
    const response = relationshipId
      ? await supabase
          .from("relationships")
          .update(payload)
          .eq("id", relationshipId)
          .eq("family_id", access.context.family.id)
          .eq("tree_id", access.context.tree.id)
      : await supabase.from("relationships").insert(payload);
    if (response.error) throw response.error;

    const synced = await applyTreeLineage(supabase, access.context);
    revalidateGenealogyPaths(access.context);
    return { success: true, issues: synced.issues };
  } catch (error) {
    console.error("Unable to save relationship:", error);
    return { error: "Không thể lưu quan hệ. Quan hệ có thể đã tồn tại." };
  }
}

export async function deleteRelationshipAction(formData: FormData) {
  const access = await getEditableContext(formData);
  if ("error" in access) return { error: access.error };
  const relationshipId = readString(formData, "relationship_id");
  if (!relationshipId) return { error: "Thiếu quan hệ cần xóa." };

  try {
    const supabase = await getSupabase();
    const response = await supabase
      .from("relationships")
      .delete()
      .eq("id", relationshipId)
      .eq("family_id", access.context.family.id)
      .eq("tree_id", access.context.tree.id);
    if (response.error) throw response.error;
    const synced = await applyTreeLineage(supabase, access.context);
    revalidateGenealogyPaths(access.context);
    return { success: true, issues: synced.issues };
  } catch (error) {
    console.error("Unable to delete relationship:", error);
    return { error: "Không thể xóa quan hệ." };
  }
}

export async function saveMemberProfileAction(formData: FormData) {
  const memberId = readString(formData, "member_id");
  const access = await getEditableContext(formData, memberId);
  if ("error" in access) return { error: access.error };
  const fullName = readString(formData, "full_name");
  const gender = readString(formData, "gender") as Gender;
  if (!fullName || !["male", "female", "other"].includes(gender)) {
    return { error: "Họ tên hoặc giới tính không hợp lệ." };
  }

  const birthYear = readNullableNumber(formData, "birth_year");
  const birthMonth = readNullableNumber(formData, "birth_month");
  const birthDay = readNullableNumber(formData, "birth_day");
  const deathYear = readNullableNumber(formData, "death_year");
  const deathMonth = readNullableNumber(formData, "death_month");
  const deathDay = readNullableNumber(formData, "death_day");
  const birthOrder = readNullableNumber(formData, "birth_order");
  if (
    (birthMonth != null && (birthMonth < 1 || birthMonth > 12)) ||
    (deathMonth != null && (deathMonth < 1 || deathMonth > 12)) ||
    (birthDay != null && (birthDay < 1 || birthDay > 31)) ||
    (deathDay != null && (deathDay < 1 || deathDay > 31))
  ) {
    return { error: "Ngày hoặc tháng sinh/mất không hợp lệ." };
  }
  if (birthYear != null && deathYear != null && deathYear < birthYear) {
    return { error: "Năm mất không thể trước năm sinh." };
  }
  if (birthOrder != null && (!Number.isInteger(birthOrder) || birthOrder < 1)) {
    return { error: "Thứ tự sinh phải là số nguyên lớn hơn 0." };
  }

  const personPayload = {
    family_id: access.context.family.id,
    tree_id: access.context.tree.id,
    full_name: fullName,
    gender,
    birth_year: birthYear,
    birth_month: birthMonth,
    birth_day: birthDay,
    death_year: deathYear,
    death_month: deathMonth,
    death_day: deathDay,
    death_lunar_year: readNullableNumber(formData, "death_lunar_year"),
    death_lunar_month: readNullableNumber(formData, "death_lunar_month"),
    death_lunar_day: readNullableNumber(formData, "death_lunar_day"),
    is_deceased: readBoolean(formData, "is_deceased"),
    birth_order: birthOrder,
    other_names: readNullableString(formData, "other_names"),
    avatar_url: readNullableString(formData, "avatar_url"),
    note: readNullableString(formData, "note"),
  };

  try {
    const supabase = await getSupabase();
    let savedId = memberId;
    if (memberId) {
      const result = await supabase
        .from("persons")
        .update(personPayload)
        .eq("id", memberId)
        .eq("family_id", access.context.family.id)
        .eq("tree_id", access.context.tree.id)
        .select("id")
        .single();
      if (result.error) throw result.error;
      savedId = result.data.id;
    } else {
      const result = await supabase
        .from("persons")
        .insert(personPayload)
        .select("id")
        .single();
      if (result.error) throw result.error;
      savedId = result.data.id;
    }

    if (readBoolean(formData, "manage_private")) {
      const privatePayload = {
        person_id: savedId,
        family_id: access.context.family.id,
        tree_id: access.context.tree.id,
        phone_number: readNullableString(formData, "phone_number"),
        occupation: readNullableString(formData, "occupation"),
        current_residence: readNullableString(formData, "current_residence"),
      };
      const hasPrivateData =
        privatePayload.phone_number ||
        privatePayload.occupation ||
        privatePayload.current_residence;
      const privateResponse = hasPrivateData
        ? await supabase.from("person_details_private").upsert(privatePayload)
        : await supabase
            .from("person_details_private")
            .delete()
            .eq("person_id", savedId)
            .eq("family_id", access.context.family.id)
            .eq("tree_id", access.context.tree.id);
      if (privateResponse.error) throw privateResponse.error;
    }

    const synced = await applyTreeLineage(supabase, access.context);
    revalidateGenealogyPaths(access.context);
    return { success: true, personId: savedId, issues: synced.issues };
  } catch (error) {
    console.error("Unable to save member profile:", error);
    return { error: "Không thể lưu thành viên." };
  }
}


export async function getCanvasDataAction(familyId: string, treeId: string) {
  try {
    const supabase = await getSupabase();
    const [personsResult, relationshipsResult] = await Promise.all([
      supabase
        .from("persons")
        .select("*")
        .eq("family_id", familyId)
        .eq("tree_id", treeId)
        .order("birth_year", { ascending: true, nullsFirst: false }),
      supabase
        .from("relationships")
        .select("*")
        .eq("family_id", familyId)
        .eq("tree_id", treeId),
    ]);
    if (personsResult.error) throw personsResult.error;
    if (relationshipsResult.error) throw relationshipsResult.error;
    return {
      success: true,
      persons: (personsResult.data ?? []) as Person[],
      relationships: (relationshipsResult.data ?? []) as Relationship[],
    };
  } catch (error) {
    console.error("Unable to load relationship canvas:", error);
    return {
      success: false,
      error: "Không thể tải bản đồ quan hệ.",
      persons: [] as Person[],
      relationships: [] as Relationship[],
    };
  }
}

export async function getExportPersonsAction(familyId: string, treeId: string) {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("persons")
      .select("id, full_name, birth_year, gender, avatar_url, generation")
      .eq("family_id", familyId)
      .eq("tree_id", treeId)
      .order("birth_year", { ascending: true, nullsFirst: false });
    if (error) throw error;
    return { success: true, persons: (data ?? []) as Person[] };
  } catch (error) {
    console.error("Error fetching persons for export:", error);
    return { success: false, persons: [] as Person[] };
  }
}

export async function fetchRelationshipsDataAction(
  familyId: string,
  treeId: string,
  personId: string,
) {
  try {
    const supabase = await getSupabase();
    const [resA, resB] = await Promise.all([
      supabase
        .from("relationships")
        .select("*, target:persons!person_b(*)")
        .eq("family_id", familyId)
        .eq("tree_id", treeId)
        .eq("person_a", personId),
      supabase
        .from("relationships")
        .select("*, target:persons!person_a(*)")
        .eq("family_id", familyId)
        .eq("tree_id", treeId)
        .eq("person_b", personId),
    ]);

    if (resA.error) throw resA.error;
    if (resB.error) throw resB.error;

    return {
      success: true,
      relsA: resA.data || [],
      relsB: resB.data || [],
    };
  } catch (error) {
    console.error("Error in fetchRelationshipsDataAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi tải quan hệ.",
      relsA: [],
      relsB: [],
    };
  }
}

export async function fetchChildrenMarriagesAndGrandchildrenAction(
  familyId: string,
  treeId: string,
  childrenIds: string[],
) {
  try {
    if (!childrenIds || childrenIds.length === 0) {
      return { success: true, childrenMarriages: [], grandchildrenData: [] };
    }

    const supabase = await getSupabase();
    const [marriagesRes, grandRes] = await Promise.all([
      supabase
        .from("relationships")
        .select("*, person_a_data:persons!person_a(*), person_b_data:persons!person_b(*)")
        .eq("family_id", familyId)
        .eq("tree_id", treeId)
        .eq("type", "marriage")
        .or(
          `person_a.in.(${childrenIds.join(",")}),person_b.in.(${childrenIds.join(",")})`,
        ),
      supabase
        .from("relationships")
        .select("id, person_a")
        .eq("family_id", familyId)
        .eq("tree_id", treeId)
        .in("type", ["biological_child", "adopted_child"])
        .in("person_a", childrenIds),
    ]);

    return {
      success: true,
      childrenMarriages: marriagesRes.data || [],
      grandchildrenData: grandRes.data || [],
    };
  } catch (error) {
    console.error("Error in fetchChildrenMarriagesAndGrandchildrenAction:", error);
    return {
      success: false,
      childrenMarriages: [],
      grandchildrenData: [],
    };
  }
}

export async function searchPersonsAction(
  familyId: string,
  treeId: string,
  searchTerm: string,
  excludePersonId?: string,
) {
  try {
    const supabase = await getSupabase();
    let query = supabase
      .from("persons")
      .select("*")
      .eq("family_id", familyId)
      .eq("tree_id", treeId)
      .ilike("full_name", `%${searchTerm}%`)
      .limit(5);

    if (excludePersonId) {
      query = query.neq("id", excludePersonId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, persons: (data ?? []) as Person[] };
  } catch (error) {
    console.error("searchPersonsAction error:", error);
    return { success: false, persons: [] as Person[] };
  }
}

export async function getRecentPersonsAction(
  familyId: string,
  treeId: string,
  excludePersonId?: string,
) {
  try {
    const supabase = await getSupabase();
    let query = supabase
      .from("persons")
      .select("*")
      .eq("family_id", familyId)
      .eq("tree_id", treeId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (excludePersonId) {
      query = query.neq("id", excludePersonId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, persons: (data ?? []) as Person[] };
  } catch (error) {
    console.error("getRecentPersonsAction error:", error);
    return { success: false, persons: [] as Person[] };
  }
}
