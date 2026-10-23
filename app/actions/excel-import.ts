"use server";

import { applyTreeLineage } from "@/app/actions/genealogy";
import type { Person, Relationship } from "@/types";
import { buildImportPlan } from "@/utils/excelImport/buildImportPlan";
import { normalizeText } from "@/utils/excelImport/detectColumns";
import type { NormalizedImportRow } from "@/utils/excelImport/types";
import { getFamilyContextById, getSupabase } from "@/utils/supabase/queries";
import { revalidatePath } from "next/cache";

const MAX_IMPORT_ROWS = 5_000;

function importErrorMessage(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String(error.message)
        : "";
  if (message.includes("external_ref")) {
    return "Cơ sở dữ liệu chưa áp dụng migration 20260622120000_add_genealogy_import_keys.sql.";
  }
  return message || "Không thể xử lý dữ liệu Excel.";
}

function readString(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? "";
}

async function getImportContext(formData: FormData) {
  const familyId = readString(formData, "family_id");
  const treeId = readString(formData, "tree_id");
  if (!familyId || !treeId) {
    return { error: "Thiếu thông tin dòng họ hoặc cây gia phả." } as const;
  }
  const context = await getFamilyContextById(familyId, treeId);
  if (!context?.canEdit || context.tree.id !== treeId) {
    return { error: "Bạn không có quyền import vào cây gia phả này." } as const;
  }
  return { context } as const;
}

function parseRows(formData: FormData) {
  const rowsJson = readString(formData, "rows_json");
  if (!rowsJson) throw new Error("Không có dữ liệu Excel để xử lý.");
  const rows = JSON.parse(rowsJson) as NormalizedImportRow[];
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("File không có dòng dữ liệu hợp lệ.");
  }
  if (rows.length > MAX_IMPORT_ROWS) {
    throw new Error(`Mỗi lần import tối đa ${MAX_IMPORT_ROWS.toLocaleString("vi-VN")} dòng.`);
  }
  return rows;
}

function getFallbackImportRefs(
  settings: Record<string, unknown>,
  treeId: string,
) {
  const allRefs = settings.genealogy_import_refs;
  if (!allRefs || typeof allRefs !== "object" || Array.isArray(allRefs)) {
    return {} as Record<string, string>;
  }
  const treeRefs = (allRefs as Record<string, unknown>)[treeId];
  if (!treeRefs || typeof treeRefs !== "object" || Array.isArray(treeRefs)) {
    return {} as Record<string, string>;
  }
  return Object.fromEntries(
    Object.entries(treeRefs).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

async function loadCurrentTree(
  familyId: string,
  treeId: string,
  settings: Record<string, unknown>,
) {
  const supabase = await getSupabase();
  const [personsResult, relationshipsResult, externalRefCheck] = await Promise.all([
    supabase
      .from("persons")
      .select("*")
      .eq("family_id", familyId)
      .eq("tree_id", treeId),
    supabase
      .from("relationships")
      .select("*")
      .eq("family_id", familyId)
      .eq("tree_id", treeId),
    supabase.from("persons").select("external_ref").limit(0),
  ]);
  if (personsResult.error) throw personsResult.error;
  if (relationshipsResult.error) throw relationshipsResult.error;
  const externalRefSupported = !externalRefCheck.error;
  if (
    externalRefCheck.error &&
    !externalRefCheck.error.message.includes("external_ref")
  ) {
    throw externalRefCheck.error;
  }
  const fallbackRefs = getFallbackImportRefs(settings, treeId);
  const fallbackRefByPersonId = new Map(
    Object.entries(fallbackRefs).map(([externalRef, personId]) => [personId, externalRef]),
  );
  const persons = ((personsResult.data ?? []) as Person[]).map((person) => ({
    ...person,
    external_ref:
      person.external_ref ?? fallbackRefByPersonId.get(person.id) ?? null,
  }));
  return {
    supabase,
    persons,
    relationships: (relationshipsResult.data ?? []) as Relationship[],
    externalRefSupported,
    fallbackRefs,
  };
}

export async function previewExcelImportAction(formData: FormData) {
  const access = await getImportContext(formData);
  if ("error" in access) return { error: access.error };
  try {
    const rows = parseRows(formData);
    const current = await loadCurrentTree(
      access.context.family.id,
      access.context.tree.id,
      access.context.family.settings,
    );
    const plan = buildImportPlan({
      existingPersons: current.persons,
      existingRelationships: current.relationships,
      rows,
      familyId: access.context.family.id,
      treeId: access.context.tree.id,
      rootPersonId: access.context.tree.root_person_id,
    });
    return {
      success: true,
      counts: plan.counts,
      rows: plan.rows,
      issues: plan.issues,
      lineageUpdates: plan.lineageUpdates,
    };
  } catch (error) {
    console.error("Unable to preview Excel import:", error);
    return {
      error: importErrorMessage(error),
    };
  }
}

export async function applyExcelImportAction(formData: FormData) {
  const access = await getImportContext(formData);
  if ("error" in access) return { error: access.error };
  try {
    const rows = parseRows(formData);
    const current = await loadCurrentTree(
      access.context.family.id,
      access.context.tree.id,
      access.context.family.settings,
    );
    const plan = buildImportPlan({
      existingPersons: current.persons,
      existingRelationships: current.relationships,
      rows,
      familyId: access.context.family.id,
      treeId: access.context.tree.id,
      rootPersonId: access.context.tree.root_person_id,
    });
    const blockingIssues = plan.issues.filter((issue) => issue.severity === "error");
    if (blockingIssues.length > 0) {
      return {
        error: "Dữ liệu còn lỗi. Hãy xử lý các dòng được đánh dấu trước khi import.",
        counts: plan.counts,
        rows: plan.rows,
        issues: plan.issues,
      };
    }

    const idByInternalKey = new Map<string, string>();
    plan.persons.forEach((person) => {
      if (person.existingId) idByInternalKey.set(person.internalKey, person.existingId);
    });

    for (const person of plan.persons) {
      const { external_ref: externalRef, ...personFields } = person.payload;
      const payload = {
        family_id: access.context.family.id,
        tree_id: access.context.tree.id,
        ...personFields,
        ...(current.externalRefSupported ? { external_ref: externalRef } : {}),
      };
      const response = person.existingId
        ? await current.supabase
            .from("persons")
            .update(payload)
            .eq("id", person.existingId)
            .eq("family_id", access.context.family.id)
            .eq("tree_id", access.context.tree.id)
            .select("id")
            .single()
        : await current.supabase
            .from("persons")
            .insert({ ...payload, visibility: "private" })
            .select("id")
            .single();
      if (response.error) throw response.error;
      idByInternalKey.set(person.internalKey, response.data.id as string);
    }

    if (!current.externalRefSupported) {
      const nextTreeRefs = { ...current.fallbackRefs };
      plan.persons.forEach((person) => {
        const personId = idByInternalKey.get(person.internalKey);
        const externalRef = person.payload.external_ref;
        if (personId && externalRef) {
          nextTreeRefs[normalizeText(externalRef)] = personId;
        }
      });
      const currentSettings = access.context.family.settings ?? {};
      const currentAllRefs =
        currentSettings.genealogy_import_refs &&
        typeof currentSettings.genealogy_import_refs === "object" &&
        !Array.isArray(currentSettings.genealogy_import_refs)
          ? (currentSettings.genealogy_import_refs as Record<string, unknown>)
          : {};
      const settingsResult = await current.supabase
        .from("families")
        .update({
          settings: {
            ...currentSettings,
            genealogy_import_refs: {
              ...currentAllRefs,
              [access.context.tree.id]: nextTreeRefs,
            },
          },
        })
        .eq("id", access.context.family.id);
      if (settingsResult.error) throw settingsResult.error;
    }

    const resolveId = (internalKey: string) => {
      if (internalKey.startsWith("existing:")) {
        return internalKey.slice("existing:".length);
      }
      return idByInternalKey.get(internalKey) ?? null;
    };
    const relationshipPayloads = plan.relationships.map((relationship) => {
      let personA = resolveId(relationship.sourceInternalKey);
      let personB = resolveId(relationship.targetInternalKey);
      if (!personA || !personB) throw new Error("Không thể nối ID cho quan hệ import.");
      if (relationship.type === "marriage" && personA.localeCompare(personB) > 0) {
        [personA, personB] = [personB, personA];
      }
      return {
        family_id: access.context.family.id,
        tree_id: access.context.tree.id,
        type: relationship.type,
        person_a: personA,
        person_b: personB,
        visibility: "private",
      };
    });
    if (relationshipPayloads.length > 0) {
      const relationshipResult = await current.supabase
        .from("relationships")
        .insert(relationshipPayloads);
      if (relationshipResult.error) throw relationshipResult.error;
    }

    const savedIds = [...idByInternalKey.values()];
    const privateResult = savedIds.length
      ? await current.supabase
          .from("person_details_private")
          .select("person_id, phone_number, occupation, current_residence")
          .eq("family_id", access.context.family.id)
          .eq("tree_id", access.context.tree.id)
          .in("person_id", savedIds)
      : { data: [], error: null };
    if (privateResult.error) throw privateResult.error;
    const privateByPersonId = new Map(
      (privateResult.data ?? []).map((details) => [details.person_id as string, details]),
    );
    const privatePayloads = plan.persons.flatMap((person) => {
      const personId = resolveId(person.internalKey);
      if (!personId) return [];
      const existing = privateByPersonId.get(personId);
      const payload = {
        person_id: personId,
        family_id: access.context.family.id,
        tree_id: access.context.tree.id,
        phone_number: person.privatePayload.phone_number ?? existing?.phone_number ?? null,
        occupation: person.privatePayload.occupation ?? existing?.occupation ?? null,
        current_residence:
          person.privatePayload.current_residence ?? existing?.current_residence ?? null,
      };
      return payload.phone_number || payload.occupation || payload.current_residence
        ? [payload]
        : [];
    });
    if (privatePayloads.length > 0) {
      const privateUpsert = await current.supabase
        .from("person_details_private")
        .upsert(privatePayloads);
      if (privateUpsert.error) throw privateUpsert.error;
    }

    if (plan.rootInternalKey) {
      const rootPersonId = resolveId(plan.rootInternalKey);
      if (rootPersonId) {
        const rootResult = await current.supabase
          .from("family_trees")
          .update({ root_person_id: rootPersonId })
          .eq("id", access.context.tree.id)
          .eq("family_id", access.context.family.id);
        if (rootResult.error) throw rootResult.error;
        access.context.tree.root_person_id = rootPersonId;
      }
    }

    const lineage = await applyTreeLineage(current.supabase, access.context);
    const basePath = `/dashboard/${access.context.family.slug}`;
    revalidatePath(basePath);
    revalidatePath(`${basePath}/members`);
    revalidatePath(`${basePath}/lineage`);
    revalidatePath(`${basePath}/kinship`);
    revalidatePath(`${basePath}/stats`);
    revalidatePath(`${basePath}/data`);

    return {
      success: true,
      imported: {
        personsCreated: plan.counts.personsToCreate,
        personsUpdated: plan.counts.personsToUpdate,
        relationshipsCreated: plan.counts.relationshipsToCreate,
      },
      issues: [...plan.issues, ...lineage.issues].filter(
        (issue, index, all) =>
          all.findIndex(
            (candidate) =>
              candidate.code === issue.code &&
              JSON.stringify(candidate.personIds ?? []) === JSON.stringify(issue.personIds ?? []),
          ) === index,
      ),
    };
  } catch (error) {
    console.error("Unable to apply Excel import:", error);
    return {
      error: importErrorMessage(error),
    };
  }
}
