import type { Person, Relationship } from "@/types";
import { computeGenealogyState, type GenealogyIssue } from "@/utils/genealogyEngine";
import { normalizeText } from "@/utils/excelImport/detectColumns";
import type {
  ImportPersonPlan,
  ImportPlan,
  ImportPreviewRow,
  ImportRelationshipPlan,
  NormalizedImportRow,
} from "@/utils/excelImport/types";

function indexMany<T>(items: T[], keyOf: (item: T) => string | null) {
  const map = new Map<string, T[]>();
  items.forEach((item) => {
    const key = keyOf(item);
    if (!key) return;
    map.set(key, [...(map.get(key) ?? []), item]);
  });
  return map;
}

function relationKey(type: Relationship["type"], personA: string, personB: string) {
  if (type === "marriage") {
    return `${type}:${[personA, personB].sort().join(":")}`;
  }
  return `${type}:${personA}:${personB}`;
}

function addIssue(issues: GenealogyIssue[], issue: GenealogyIssue) {
  const duplicate = issues.some(
    (current) =>
      current.code === issue.code &&
      JSON.stringify(current.rowNumbers ?? []) === JSON.stringify(issue.rowNumbers ?? []) &&
      JSON.stringify(current.personIds ?? []) === JSON.stringify(issue.personIds ?? []),
  );
  if (!duplicate) issues.push(issue);
}

function previewPerson(
  plan: ImportPersonPlan,
  existing: Person | undefined,
  familyId: string,
  treeId: string,
): Person {
  const now = new Date().toISOString();
  return {
    id: plan.previewId,
    family_id: familyId,
    tree_id: treeId,
    external_ref: plan.payload.external_ref,
    full_name: plan.payload.full_name,
    gender: plan.payload.gender,
    birth_year: plan.payload.birth_year,
    birth_month: plan.payload.birth_month,
    birth_day: plan.payload.birth_day,
    death_year: plan.payload.death_year,
    death_month: plan.payload.death_month,
    death_day: plan.payload.death_day,
    death_lunar_year: plan.payload.death_lunar_year,
    death_lunar_month: plan.payload.death_lunar_month,
    death_lunar_day: plan.payload.death_lunar_day,
    is_deceased: plan.payload.is_deceased,
    is_in_law: existing?.is_in_law ?? false,
    birth_order: plan.payload.birth_order,
    generation: existing?.generation ?? null,
    other_names: plan.payload.other_names,
    avatar_url: existing?.avatar_url ?? null,
    note: plan.payload.note,
    created_at: existing?.created_at ?? now,
    updated_at: now,
  };
}

export function buildImportPlan({
  existingPersons,
  existingRelationships,
  rows,
  familyId,
  treeId,
  rootPersonId,
}: {
  existingPersons: Person[];
  existingRelationships: Relationship[];
  rows: NormalizedImportRow[];
  familyId: string;
  treeId: string;
  rootPersonId?: string | null;
}): ImportPlan {
  const issues: GenealogyIssue[] = [];
  const personPlans: ImportPersonPlan[] = [];
  const previewRows: ImportPreviewRow[] = [];
  const existingByExternalRef = indexMany(existingPersons, (person) =>
    person.external_ref ? normalizeText(person.external_ref) : null,
  );
  const existingByNameYear = indexMany(
    existingPersons,
    (person) => `${normalizeText(person.full_name)}:${person.birth_year ?? ""}`,
  );
  const existingByName = indexMany(existingPersons, (person) =>
    normalizeText(person.full_name),
  );
  const seenRowKeys = new Map<string, number>();
  const rowByInternalKey = new Map<string, NormalizedImportRow>();
  const hasRelationshipHints = rows.some(
    (row) =>
      row.parent_keys.length > 0 ||
      Boolean(row.father_key) ||
      Boolean(row.mother_key) ||
      row.spouse_keys.length > 0,
  );

  rows.forEach((row) => {
    if (!row.full_name.trim()) {
      addIssue(issues, {
        severity: "warning",
        code: "missing_full_name",
        message: `Dòng ${row.rowNumber} không có họ tên và sẽ bị bỏ qua.`,
        rowNumbers: [row.rowNumber],
      });
      return;
    }

    const invalidIntegerFields = [
      ["năm sinh", row.birth_year],
      ["tháng sinh", row.birth_month],
      ["ngày sinh", row.birth_day],
      ["năm mất", row.death_year],
      ["tháng mất", row.death_month],
      ["ngày mất", row.death_day],
      ["năm giỗ âm lịch", row.death_lunar_year],
      ["tháng giỗ âm lịch", row.death_lunar_month],
      ["ngày giỗ âm lịch", row.death_lunar_day],
      ["thứ tự sinh", row.birth_order],
      ["đời thứ", row.generation],
    ] as const;
    invalidIntegerFields.forEach(([label, value]) => {
      if (value != null && !Number.isInteger(value)) {
        addIssue(issues, {
          severity: "error",
          code: "invalid_number",
          message: `Dòng ${row.rowNumber}: ${label} phải là số nguyên.`,
          rowNumbers: [row.rowNumber],
        });
      }
    });
    if (row.birth_month != null && (row.birth_month < 1 || row.birth_month > 12)) {
      addIssue(issues, {
        severity: "error",
        code: "invalid_birth_month",
        message: `Dòng ${row.rowNumber}: tháng sinh phải từ 1 đến 12.`,
        rowNumbers: [row.rowNumber],
      });
    }
    if (row.death_month != null && (row.death_month < 1 || row.death_month > 12)) {
      addIssue(issues, {
        severity: "error",
        code: "invalid_death_month",
        message: `Dòng ${row.rowNumber}: tháng mất phải từ 1 đến 12.`,
        rowNumbers: [row.rowNumber],
      });
    }
    if (
      row.death_lunar_month != null &&
      (row.death_lunar_month < 1 || row.death_lunar_month > 12)
    ) {
      addIssue(issues, {
        severity: "error",
        code: "invalid_death_lunar_month",
        message: `Dòng ${row.rowNumber}: tháng giỗ âm lịch phải từ 1 đến 12.`,
        rowNumbers: [row.rowNumber],
      });
    }
    if (row.birth_day != null && (row.birth_day < 1 || row.birth_day > 31)) {
      addIssue(issues, {
        severity: "error",
        code: "invalid_birth_day",
        message: `Dòng ${row.rowNumber}: ngày sinh phải từ 1 đến 31.`,
        rowNumbers: [row.rowNumber],
      });
    }
    if (
      row.death_lunar_day != null &&
      (row.death_lunar_day < 1 || row.death_lunar_day > 31)
    ) {
      addIssue(issues, {
        severity: "error",
        code: "invalid_death_lunar_day",
        message: `Dòng ${row.rowNumber}: ngày giỗ âm lịch phải từ 1 đến 31.`,
        rowNumbers: [row.rowNumber],
      });
    }
    if (row.death_day != null && (row.death_day < 1 || row.death_day > 31)) {
      addIssue(issues, {
        severity: "error",
        code: "invalid_death_day",
        message: `Dòng ${row.rowNumber}: ngày mất phải từ 1 đến 31.`,
        rowNumbers: [row.rowNumber],
      });
    }
    if (row.birth_order != null && row.birth_order < 1) {
      addIssue(issues, {
        severity: "error",
        code: "invalid_birth_order",
        message: `Dòng ${row.rowNumber}: thứ tự sinh phải lớn hơn 0.`,
        rowNumbers: [row.rowNumber],
      });
    }
    if (
      [row.birth_year, row.death_year, row.death_lunar_year, row.generation].some(
        (value) => value != null && value < 1,
      )
    ) {
      addIssue(issues, {
        severity: "error",
        code: "invalid_positive_number",
        message: `Dòng ${row.rowNumber}: năm và đời thứ phải lớn hơn 0.`,
        rowNumbers: [row.rowNumber],
      });
    }
    if (
      row.birth_year != null &&
      row.death_year != null &&
      row.death_year < row.birth_year
    ) {
      addIssue(issues, {
        severity: "error",
        code: "death_before_birth",
        message: `Dòng ${row.rowNumber}: năm mất không thể trước năm sinh.`,
        rowNumbers: [row.rowNumber],
      });
    }
    if (!row.gender) {
      addIssue(issues, {
        severity: "warning",
        code: "unknown_gender",
        message: `Dòng ${row.rowNumber}: không nhận diện được giới tính, hệ thống sẽ dùng "Khác".`,
        rowNumbers: [row.rowNumber],
      });
    }

    const normalizedPersonKey = row.person_key ? normalizeText(row.person_key) : null;
    const internalKey = normalizedPersonKey || `row:${row.rowNumber}`;
    if (normalizedPersonKey && seenRowKeys.has(normalizedPersonKey)) {
      addIssue(issues, {
        severity: "error",
        code: "duplicate_person_key",
        message: `Mã thành viên "${row.person_key}" xuất hiện nhiều lần trong file.`,
        rowNumbers: [seenRowKeys.get(normalizedPersonKey)!, row.rowNumber],
      });
      return;
    }
    if (normalizedPersonKey) seenRowKeys.set(normalizedPersonKey, row.rowNumber);
    rowByInternalKey.set(internalKey, row);

    const externalMatches = normalizedPersonKey
      ? existingByExternalRef.get(normalizedPersonKey) ?? []
      : [];
    const nameYearMatches =
      existingByNameYear.get(
        `${normalizeText(row.full_name)}:${row.birth_year ?? ""}`,
      ) ?? [];
    const nameMatches = existingByName.get(normalizeText(row.full_name)) ?? [];
    let existing: Person | undefined;
    let matchReason = "Tạo mới";

    if (externalMatches.length === 1) {
      existing = externalMatches[0];
      matchReason = "Trùng mã thành viên";
    } else if (nameYearMatches.length > 0 || nameMatches.length > 0) {
      addIssue(issues, {
        severity: "warning",
        code: "possible_duplicate",
        message: `Dòng ${row.rowNumber}: ${row.full_name} có thể trùng với người đã có, nhưng hệ thống vẫn tạo hồ sơ mới vì file không có mã thành viên.`,
        personIds: [...new Set([...nameYearMatches, ...nameMatches].map((person) => person.id))],
        rowNumbers: [row.rowNumber],
      });
      matchReason = "Tạo mới vì không có mã";
    }

    const previewId = existing?.id ?? `import-row-${row.rowNumber}`;
    const plan: ImportPersonPlan = {
      internalKey,
      rowNumber: row.rowNumber,
      existingId: existing?.id ?? null,
      previewId,
      action: existing ? "update" : "create",
      payload: {
        external_ref: row.person_key ?? existing?.external_ref ?? null,
        full_name: row.full_name.trim(),
        gender: row.gender ?? existing?.gender ?? "other",
        birth_year: row.birth_year ?? existing?.birth_year ?? null,
        birth_month: row.birth_month ?? existing?.birth_month ?? null,
        birth_day: row.birth_day ?? existing?.birth_day ?? null,
        death_year: row.death_year ?? existing?.death_year ?? null,
        death_month: row.death_month ?? existing?.death_month ?? null,
        death_day: row.death_day ?? existing?.death_day ?? null,
        death_lunar_year:
          row.death_lunar_year ?? existing?.death_lunar_year ?? null,
        death_lunar_month:
          row.death_lunar_month ?? existing?.death_lunar_month ?? null,
        death_lunar_day: row.death_lunar_day ?? existing?.death_lunar_day ?? null,
        is_deceased:
          row.death_year != null ||
          row.death_month != null ||
          row.death_day != null ||
          row.death_lunar_year != null ||
          row.death_lunar_month != null ||
          row.death_lunar_day != null ||
          existing?.is_deceased === true,
        birth_order: row.birth_order ?? existing?.birth_order ?? null,
        other_names: row.other_names ?? existing?.other_names ?? null,
        note: row.note ?? existing?.note ?? null,
      },
      privatePayload: {
        phone_number: row.phone_number,
        occupation: row.occupation,
        current_residence: row.current_residence,
      },
    };
    personPlans.push(plan);
    previewRows.push({
      rowNumber: row.rowNumber,
      internalKey,
      personId: previewId,
      fullName: row.full_name.trim(),
      action: plan.action,
      matchReason,
      warnings: [],
    });
  });

  const planByInternalKey = new Map(personPlans.map((plan) => [plan.internalKey, plan]));
  const plansByExistingId = indexMany(personPlans, (plan) => plan.existingId);
  plansByExistingId.forEach((plans, existingId) => {
    if (plans.length <= 1) return;
    addIssue(issues, {
      severity: "error",
      code: "duplicate_person_match",
      message: "Nhiều dòng Excel đang cùng khớp với một thành viên hiện có.",
      personIds: [existingId],
      rowNumbers: plans.map((plan) => plan.rowNumber),
    });
  });
  const importReferenceIndex = new Map<string, Set<string>>();
  const existingReferenceIndex = new Map<string, Set<string>>();
  const addReference = (
    index: Map<string, Set<string>>,
    reference: string | null | undefined,
    internalKey: string,
  ) => {
    const normalized = normalizeText(reference);
    if (!normalized) return;
    const matches = index.get(normalized) ?? new Set<string>();
    matches.add(internalKey);
    index.set(normalized, matches);
  };

  personPlans.forEach((plan) => {
    const row = rowByInternalKey.get(plan.internalKey)!;
    addReference(importReferenceIndex, row.person_key, plan.internalKey);
    addReference(importReferenceIndex, row.full_name, plan.internalKey);
  });
  existingPersons.forEach((person) => {
    const internalKey = `existing:${person.id}`;
    addReference(existingReferenceIndex, person.external_ref, internalKey);
    addReference(existingReferenceIndex, person.full_name, internalKey);
  });

  const previewIdForKey = (internalKey: string) => {
    if (internalKey.startsWith("existing:")) return internalKey.slice("existing:".length);
    return planByInternalKey.get(internalKey)?.previewId ?? null;
  };
  const resolveReference = (reference: string, rowNumber: number) => {
    const normalized = normalizeText(reference);
    const importMatches = [...(importReferenceIndex.get(normalized) ?? [])];
    const matches =
      importMatches.length > 0
        ? importMatches
        : [...(existingReferenceIndex.get(normalized) ?? [])];
    const uniquePreviewIds = new Set(matches.map(previewIdForKey).filter(Boolean));
    const uniqueMatches = matches.filter(
      (match, index) => matches.findIndex((other) => previewIdForKey(other) === previewIdForKey(match)) === index,
    );
    if (uniquePreviewIds.size === 1) return uniqueMatches[0];
    addIssue(issues, {
      severity: "error",
      code: uniquePreviewIds.size === 0 ? "missing_related_person" : "ambiguous_reference",
      message:
        uniquePreviewIds.size === 0
          ? `Dòng ${rowNumber}: không tìm thấy người được tham chiếu "${reference}".`
          : `Dòng ${rowNumber}: tham chiếu "${reference}" khớp với nhiều người.`,
      rowNumbers: [rowNumber],
    });
    return null;
  };

  const relationshipPlans: ImportRelationshipPlan[] = [];
  const existingRelationKeys = new Set(
    existingRelationships.map((relationship) =>
      relationKey(relationship.type, relationship.person_a, relationship.person_b),
    ),
  );
  const plannedRelationKeys = new Set<string>();
  let relationshipsSkipped = 0;
  const addRelationship = (
    sourceInternalKey: string,
    targetInternalKey: string,
    type: Relationship["type"],
    rowNumber: number,
  ) => {
    const sourceId = previewIdForKey(sourceInternalKey);
    const targetId = previewIdForKey(targetInternalKey);
    if (!sourceId || !targetId || sourceId === targetId) {
      addIssue(issues, {
        severity: "error",
        code: "self_relationship",
        message: `Dòng ${rowNumber}: quan hệ đang trỏ về chính người đó.`,
        rowNumbers: [rowNumber],
      });
      return;
    }
    const key = relationKey(type, sourceId, targetId);
    if (existingRelationKeys.has(key) || plannedRelationKeys.has(key)) {
      relationshipsSkipped += 1;
      return;
    }
    plannedRelationKeys.add(key);
    relationshipPlans.push({ sourceInternalKey, targetInternalKey, type, rowNumber });
  };

  personPlans.forEach((plan) => {
    const row = rowByInternalKey.get(plan.internalKey)!;
    row.parent_keys.forEach((parentReference) => {
      const parentKey = resolveReference(parentReference, row.rowNumber);
      if (parentKey) addRelationship(parentKey, plan.internalKey, "biological_child", row.rowNumber);
    });
    if (row.father_key) {
      const parentKey = resolveReference(row.father_key, row.rowNumber);
      if (parentKey) addRelationship(parentKey, plan.internalKey, "biological_child", row.rowNumber);
    }
    if (row.mother_key) {
      const parentKey = resolveReference(row.mother_key, row.rowNumber);
      if (parentKey) addRelationship(parentKey, plan.internalKey, "biological_child", row.rowNumber);
    }
    row.spouse_keys.forEach((spouseReference) => {
      const spouseKey = resolveReference(spouseReference, row.rowNumber);
      if (spouseKey) addRelationship(plan.internalKey, spouseKey, "marriage", row.rowNumber);
    });
    if (
      hasRelationshipHints &&
      row.parent_keys.length === 0 &&
      !row.father_key &&
      !row.mother_key &&
      row.spouse_keys.length === 0
    ) {
      addIssue(issues, {
        severity: "warning",
        code: "isolated_person",
        message: `Dòng ${row.rowNumber}: ${row.full_name} chưa có quan hệ trong file.`,
        rowNumbers: [row.rowNumber],
        personIds: [plan.previewId],
      });
    }
  });

  const rootPlans = personPlans.filter(
    (plan) => rowByInternalKey.get(plan.internalKey)?.is_root,
  );
  if (rootPlans.length > 1) {
    addIssue(issues, {
      severity: "error",
      code: "multiple_roots",
      message: "File đang đánh dấu nhiều hơn một người gốc.",
      rowNumbers: rootPlans.map((plan) => plan.rowNumber),
    });
  }
  const rootInternalKey = rootPlans[0]?.internalKey ?? null;

  const previewPersonMap = new Map(existingPersons.map((person) => [person.id, person]));
  personPlans.forEach((plan) => {
    previewPersonMap.set(
      plan.previewId,
      previewPerson(plan, plan.existingId ? previewPersonMap.get(plan.existingId) : undefined, familyId, treeId),
    );
  });
  const previewRelationships = [
    ...existingRelationships,
    ...relationshipPlans.map((relationship, index): Relationship => ({
      id: `import-relationship-${index}`,
      family_id: familyId,
      tree_id: treeId,
      type: relationship.type,
      person_a: previewIdForKey(relationship.sourceInternalKey)!,
      person_b: previewIdForKey(relationship.targetInternalKey)!,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })),
  ];
  const computed = computeGenealogyState({
    persons: [...previewPersonMap.values()],
    relationships: previewRelationships,
    rootPersonId: rootInternalKey ? previewIdForKey(rootInternalKey) : rootPersonId,
  });
  computed.issues.forEach((issue) => addIssue(issues, issue));

  personPlans.forEach((plan) => {
    const row = rowByInternalKey.get(plan.internalKey)!;
    if (row.generation == null) return;
    const computedUpdate = computed.updates.find((update) => update.id === plan.previewId);
    if (computedUpdate?.new_generation !== row.generation) {
      addIssue(issues, {
        severity: "warning",
        code: "file_generation_mismatch",
        message: `Dòng ${row.rowNumber}: đời thứ trong file là ${row.generation}, hệ thống tính được ${computedUpdate?.new_generation ?? "chưa xác định"}.`,
        rowNumbers: [row.rowNumber],
        personIds: [plan.previewId],
      });
    }
  });

  return {
    persons: personPlans,
    relationships: relationshipPlans,
    rows: previewRows,
    issues,
    lineageUpdates: computed.updates,
    rootInternalKey,
    counts: {
      personsToCreate: personPlans.filter((plan) => plan.action === "create").length,
      personsToUpdate: personPlans.filter((plan) => plan.action === "update").length,
      relationshipsToCreate: relationshipPlans.length,
      relationshipsSkipped,
    },
  };
}
