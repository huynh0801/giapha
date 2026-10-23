"use server";

import { Relationship, RelationshipType } from "@/types";
import { getFamilyContextById, getSupabase } from "@/utils/supabase/queries";
import { revalidatePath } from "next/cache";

interface PersonExport {
  id: string;
  family_id?: string;
  tree_id?: string;
  external_ref?: string | null;
  full_name: string;
  gender: "male" | "female" | "other";
  birth_year: number | null;
  birth_month: number | null;
  birth_day: number | null;
  death_year: number | null;
  death_month: number | null;
  death_day: number | null;
  death_lunar_year: number | null;
  death_lunar_month: number | null;
  death_lunar_day: number | null;
  is_deceased: boolean;
  is_in_law: boolean;
  birth_order: number | null;
  generation: number | null;
  other_names: string | null;
  avatar_url: string | null;
  note: string | null;
  created_at?: string;
  updated_at?: string;
}

interface RelationshipExport {
  id?: string;
  family_id?: string;
  tree_id?: string;
  type: string;
  person_a: string;
  person_b: string;
  note?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface PersonDetailsPrivateExport {
  person_id: string;
  family_id?: string;
  tree_id?: string;
  phone_number: string | null;
  occupation: string | null;
  current_residence: string | null;
}

interface CustomEventExport {
  id: string;
  family_id?: string;
  tree_id?: string;
  name: string;
  content: string | null;
  event_date: string;
  location: string | null;
  created_by: string | null;
}

interface BackupPayload {
  version: number;
  timestamp: string;
  family_id: string;
  tree_id: string;
  persons: PersonExport[];
  relationships: RelationshipExport[];
  person_details_private?: PersonDetailsPrivateExport[];
  custom_events?: CustomEventExport[];
}

type ImportPayload =
  | BackupPayload
  | {
      persons: PersonExport[];
      relationships: Relationship[];
      person_details_private?: PersonDetailsPrivateExport[];
      custom_events?: CustomEventExport[];
    };

function sanitizePerson(p: PersonExport, familyId: string, treeId: string) {
  return {
    id: p.id,
    family_id: familyId,
    tree_id: treeId,
    external_ref: p.external_ref ?? null,
    full_name: p.full_name,
    gender: p.gender,
    birth_year: p.birth_year ?? null,
    birth_month: p.birth_month ?? null,
    birth_day: p.birth_day ?? null,
    death_year: p.death_year ?? null,
    death_month: p.death_month ?? null,
    death_day: p.death_day ?? null,
    death_lunar_year: p.death_lunar_year ?? null,
    death_lunar_month: p.death_lunar_month ?? null,
    death_lunar_day: p.death_lunar_day ?? null,
    is_deceased: p.is_deceased ?? false,
    is_in_law: p.is_in_law ?? false,
    birth_order: p.birth_order ?? null,
    generation: p.generation ?? null,
    other_names: p.other_names ?? null,
    avatar_url: p.avatar_url ?? null,
    note: p.note ?? null,
  };
}

function sanitizeRelationship(
  r: RelationshipExport | Relationship,
  familyId: string,
  treeId: string,
) {
  return {
    family_id: familyId,
    tree_id: treeId,
    type: r.type as RelationshipType,
    person_a: r.person_a,
    person_b: r.person_b,
    note: r.note ?? null,
  };
}

function sanitizeCustomEvent(
  event: CustomEventExport,
  familyId: string,
  treeId: string,
) {
  return {
    id: event.id,
    family_id: familyId,
    tree_id: treeId,
    name: event.name,
    content: event.content ?? null,
    event_date: event.event_date,
    location: event.location ?? null,
  };
}

async function ensureCanEdit(familyId: string, treeId: string) {
  const context = await getFamilyContextById(familyId);
  if (!context?.canEdit || context.tree.id !== treeId) {
    return { error: "Từ chối truy cập. Bạn không có quyền sao lưu dòng họ này." };
  }
  return { context };
}

export async function exportData(
  familyId: string,
  treeId: string,
  exportRootId?: string,
): Promise<BackupPayload | { error: string }> {
  const guard = await ensureCanEdit(familyId, treeId);
  if ("error" in guard && guard.error) {
    return { error: guard.error };
  }

  const supabase = await getSupabase();
  const [personsRes, relationshipsRes, privateRes, eventsRes] =
    await Promise.all([
      supabase
        .from("persons")
        .select(
          "*",
        )
        .eq("family_id", familyId)
        .eq("tree_id", treeId)
        .order("created_at", { ascending: true }),
      supabase
        .from("relationships")
        .select("id, family_id, tree_id, type, person_a, person_b, note, created_at, updated_at")
        .eq("family_id", familyId)
        .eq("tree_id", treeId)
        .order("created_at", { ascending: true }),
      supabase
        .from("person_details_private")
        .select("person_id, family_id, tree_id, phone_number, occupation, current_residence")
        .eq("family_id", familyId)
        .eq("tree_id", treeId),
      supabase
        .from("custom_events")
        .select("id, family_id, tree_id, name, content, event_date, location, created_by")
        .eq("family_id", familyId)
        .eq("tree_id", treeId)
        .order("event_date", { ascending: true }),
    ]);

  if (personsRes.error) {
    return { error: "Lỗi tải persons: " + personsRes.error.message };
  }
  if (relationshipsRes.error) {
    return {
      error: "Lỗi tải relationships: " + relationshipsRes.error.message,
    };
  }
  if (privateRes.error) {
    return {
      error: "Lỗi tải person_details_private: " + privateRes.error.message,
    };
  }
  if (eventsRes.error) {
    return { error: "Lỗi tải custom_events: " + eventsRes.error.message };
  }

  let exportPersons = (personsRes.data ?? []) as PersonExport[];
  let exportRels = (relationshipsRes.data ?? []) as RelationshipExport[];
  let exportPrivateDetails = (privateRes.data ??
    []) as PersonDetailsPrivateExport[];
  const exportCustomEvents = (eventsRes.data ?? []) as CustomEventExport[];

  if (exportRootId && exportPersons.some((person) => person.id === exportRootId)) {
    const includedPersonIds = new Set<string>([exportRootId]);

    const findDescendants = (parentId: string) => {
      exportRels
        .filter(
          (rel) =>
            (rel.type === "biological_child" || rel.type === "adopted_child") &&
            rel.person_a === parentId,
        )
        .forEach((rel) => {
          if (!includedPersonIds.has(rel.person_b)) {
            includedPersonIds.add(rel.person_b);
            findDescendants(rel.person_b);
          }
        });
    };
    findDescendants(exportRootId);

    Array.from(includedPersonIds).forEach((personId) => {
      exportRels
        .filter(
          (rel) =>
            rel.type === "marriage" &&
            (rel.person_a === personId || rel.person_b === personId),
        )
        .forEach((rel) => {
          includedPersonIds.add(
            rel.person_a === personId ? rel.person_b : rel.person_a,
          );
        });
    });

    exportPersons = exportPersons.filter((person) =>
      includedPersonIds.has(person.id),
    );
    exportRels = exportRels.filter(
      (rel) =>
        includedPersonIds.has(rel.person_a) &&
        includedPersonIds.has(rel.person_b),
    );
    exportPrivateDetails = exportPrivateDetails.filter((details) =>
      includedPersonIds.has(details.person_id),
    );
  }

  return {
    version: 4,
    timestamp: new Date().toISOString(),
    family_id: familyId,
    tree_id: treeId,
    persons: exportPersons,
    relationships: exportRels,
    person_details_private: exportPrivateDetails,
    custom_events: exportCustomEvents,
  };
}

export async function importData(
  importPayload: ImportPayload,
  familyId: string,
  treeId: string,
) {
  const guard = await ensureCanEdit(familyId, treeId);
  if ("error" in guard && guard.error) {
    return { error: guard.error };
  }
  const context = guard.context!;

  const supabase = await getSupabase();

  if (!importPayload?.persons || !importPayload?.relationships) {
    return { error: "Dữ liệu không hợp lệ. File thiếu persons hoặc relationships." };
  }

  if (importPayload.persons.length === 0) {
    return { error: "File backup trống, không có thành viên để phục hồi." };
  }

  const CHUNK = 200;

  const deleteEvents = await supabase
    .from("custom_events")
    .delete()
    .eq("family_id", familyId)
    .eq("tree_id", treeId);
  if (deleteEvents.error) {
    return { error: "Lỗi xóa custom_events cũ: " + deleteEvents.error.message };
  }

  const deleteRels = await supabase
    .from("relationships")
    .delete()
    .eq("family_id", familyId)
    .eq("tree_id", treeId);
  if (deleteRels.error) {
    return { error: "Lỗi xóa relationships cũ: " + deleteRels.error.message };
  }

  const deletePrivate = await supabase
    .from("person_details_private")
    .delete()
    .eq("family_id", familyId)
    .eq("tree_id", treeId);
  if (deletePrivate.error) {
    return {
      error: "Lỗi xóa person_details_private cũ: " + deletePrivate.error.message,
    };
  }

  const deletePersons = await supabase
    .from("persons")
    .delete()
    .eq("family_id", familyId)
    .eq("tree_id", treeId);
  if (deletePersons.error) {
    return { error: "Lỗi xóa persons cũ: " + deletePersons.error.message };
  }

  const persons = importPayload.persons.map((person) =>
    sanitizePerson(person, familyId, treeId),
  );
  for (let i = 0; i < persons.length; i += CHUNK) {
    const chunk = persons.slice(i, i + CHUNK);
    const { error } = await supabase.from("persons").insert(chunk);
    if (error) {
      return {
        error: `Lỗi import persons (chunk ${i / CHUNK + 1}): ${error.message}`,
      };
    }
  }

  const relationships = importPayload.relationships
    .filter((rel) => rel.person_a !== rel.person_b)
    .map((rel) => sanitizeRelationship(rel, familyId, treeId));
  for (let i = 0; i < relationships.length; i += CHUNK) {
    const chunk = relationships.slice(i, i + CHUNK);
    const { error } = await supabase.from("relationships").insert(chunk);
    if (error) {
      return {
        error: `Lỗi import relationships (chunk ${i / CHUNK + 1}): ${error.message}`,
      };
    }
  }

  let privateDetailsCount = 0;
  const privateDetails = (importPayload.person_details_private ?? []).map(
    (details) => ({
      person_id: details.person_id,
      family_id: familyId,
      tree_id: treeId,
      phone_number: details.phone_number ?? null,
      occupation: details.occupation ?? null,
      current_residence: details.current_residence ?? null,
    }),
  );
  for (let i = 0; i < privateDetails.length; i += CHUNK) {
    const chunk = privateDetails.slice(i, i + CHUNK);
    const { error } = await supabase
      .from("person_details_private")
      .insert(chunk);
    if (error) {
      return {
        error: `Lỗi import private details (chunk ${i / CHUNK + 1}): ${error.message}`,
      };
    }
  }
  privateDetailsCount = privateDetails.length;

  let customEventsCount = 0;
  const customEvents = (importPayload.custom_events ?? []).map((event) =>
    sanitizeCustomEvent(event, familyId, treeId),
  );
  for (let i = 0; i < customEvents.length; i += CHUNK) {
    const chunk = customEvents.slice(i, i + CHUNK);
    const { error } = await supabase.from("custom_events").insert(chunk);
    if (error) {
      return {
        error: `Lỗi import custom_events (chunk ${i / CHUNK + 1}): ${error.message}`,
      };
    }
  }
  customEventsCount = customEvents.length;

  revalidatePath(`/dashboard/${context.family.slug}`);
  revalidatePath(`/dashboard/${context.family.slug}/members`);
  revalidatePath(`/dashboard/${context.family.slug}/data`);

  return {
    success: true,
    imported: {
      persons: persons.length,
      relationships: relationships.length,
      person_details_private: privateDetailsCount,
      custom_events: customEventsCount,
    },
  };
}
