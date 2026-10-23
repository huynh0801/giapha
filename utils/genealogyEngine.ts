import type { Person, Relationship, RelationshipType } from "@/types";

export type GenealogyIssueSeverity = "error" | "warning";

export interface GenealogyIssue {
  severity: GenealogyIssueSeverity;
  code: string;
  message: string;
  personIds?: string[];
  relationshipIds?: string[];
  rowNumbers?: number[];
}

export interface ComputedPersonLineage {
  id: string;
  old_generation: number | null;
  new_generation: number | null;
  old_is_in_law: boolean;
  new_is_in_law: boolean;
  old_birth_order: number | null;
  new_birth_order: number | null;
  changed: boolean;
}

export interface GenealogyComputationResult {
  updates: ComputedPersonLineage[];
  issues: GenealogyIssue[];
}

export const CHILD_RELATIONSHIP_TYPES: RelationshipType[] = [
  "biological_child",
  "adopted_child",
  "step_child",
  "foster_child",
];

const childTypeSet = new Set<RelationshipType>(CHILD_RELATIONSHIP_TYPES);

function isChildRelationship(type: RelationshipType) {
  return childTypeSet.has(type);
}

function uniquePush<K, T>(map: Map<K, T[]>, key: K, value: T) {
  const values = map.get(key) ?? [];
  if (!values.includes(value)) values.push(value);
  map.set(key, values);
}

function addIssue(
  issues: GenealogyIssue[],
  seen: Set<string>,
  issue: GenealogyIssue,
) {
  const key = [
    issue.code,
    ...(issue.personIds ?? []).slice().sort(),
    ...(issue.relationshipIds ?? []).slice().sort(),
  ].join(":");
  if (seen.has(key)) return;
  seen.add(key);
  issues.push(issue);
}

function marriagePairKey(personA: string, personB: string) {
  return [personA, personB].sort().join(":");
}

export function validateRelationshipGraph({
  persons,
  relationships,
}: {
  persons: Person[];
  relationships: Relationship[];
}): GenealogyIssue[] {
  const issues: GenealogyIssue[] = [];
  const seenIssues = new Set<string>();
  const personById = new Map(persons.map((person) => [person.id, person]));
  const relationKeys = new Map<string, string>();
  const childrenByParentId = new Map<string, string[]>();
  const biologicalParentsByChildId = new Map<string, Set<string>>();

  for (const relationship of relationships) {
    const ids = [relationship.person_a, relationship.person_b];
    if (relationship.person_a === relationship.person_b) {
      addIssue(issues, seenIssues, {
        severity: "error",
        code: "self_relationship",
        message: "Một người không thể có quan hệ với chính mình.",
        personIds: ids,
        relationshipIds: [relationship.id],
      });
      continue;
    }

    const missingIds = ids.filter((id) => !personById.has(id));
    if (missingIds.length > 0) {
      addIssue(issues, seenIssues, {
        severity: "error",
        code: "missing_person",
        message: "Quan hệ đang tham chiếu đến thành viên không tồn tại.",
        personIds: missingIds,
        relationshipIds: [relationship.id],
      });
      continue;
    }

    const relationKey =
      relationship.type === "marriage"
        ? `marriage:${marriagePairKey(relationship.person_a, relationship.person_b)}`
        : `${relationship.type}:${relationship.person_a}:${relationship.person_b}`;
    const duplicateId = relationKeys.get(relationKey);
    if (duplicateId) {
      addIssue(issues, seenIssues, {
        severity: "error",
        code: "duplicate_relationship",
        message: "Quan hệ bị trùng trong cùng cây gia phả.",
        personIds: ids,
        relationshipIds: [duplicateId, relationship.id],
      });
      continue;
    }
    relationKeys.set(relationKey, relationship.id);

    if (!isChildRelationship(relationship.type)) continue;
    uniquePush(childrenByParentId, relationship.person_a, relationship.person_b);

    if (
      relationship.type === "biological_child" ||
      relationship.type === "adopted_child"
    ) {
      const parents = biologicalParentsByChildId.get(relationship.person_b) ?? new Set();
      parents.add(relationship.person_a);
      biologicalParentsByChildId.set(relationship.person_b, parents);
    }

    const parent = personById.get(relationship.person_a)!;
    const child = personById.get(relationship.person_b)!;
    if (
      parent.birth_year != null &&
      child.birth_year != null &&
      child.birth_year - parent.birth_year < 12
    ) {
      addIssue(issues, seenIssues, {
        severity: "warning",
        code: "impossible_birth_year",
        message: `${parent.full_name} và ${child.full_name} có năm sinh không hợp lý cho quan hệ cha/mẹ - con.`,
        personIds: [parent.id, child.id],
        relationshipIds: [relationship.id],
      });
    }
  }

  biologicalParentsByChildId.forEach((parentIds, childId) => {
    if (parentIds.size <= 2) return;
    addIssue(issues, seenIssues, {
      severity: "warning",
      code: "too_many_parents",
      message: "Một thành viên có hơn hai cha/mẹ ruột hoặc cha/mẹ nuôi.",
      personIds: [childId, ...parentIds],
    });
  });

  const visitState = new Map<string, 0 | 1 | 2>();
  const stack: string[] = [];

  const visit = (personId: string) => {
    visitState.set(personId, 1);
    stack.push(personId);
    for (const childId of childrenByParentId.get(personId) ?? []) {
      const state = visitState.get(childId) ?? 0;
      if (state === 0) {
        visit(childId);
      } else if (state === 1) {
        const cycleStart = stack.indexOf(childId);
        const cycleIds = [...stack.slice(Math.max(cycleStart, 0)), childId];
        addIssue(issues, seenIssues, {
          severity: "error",
          code: "parent_child_cycle",
          message: "Quan hệ cha/mẹ - con tạo thành vòng lặp.",
          personIds: cycleIds,
        });
      }
    }
    stack.pop();
    visitState.set(personId, 2);
  };

  persons.forEach((person) => {
    if ((visitState.get(person.id) ?? 0) === 0) visit(person.id);
  });

  relationships.forEach((relationship) => {
    if (relationship.type !== "marriage") return;
    const personA = personById.get(relationship.person_a);
    const personB = personById.get(relationship.person_b);
    if (
      personA?.generation != null &&
      personB?.generation != null &&
      personA.generation !== personB.generation
    ) {
      addIssue(issues, seenIssues, {
        severity: "warning",
        code: "spouse_generation_mismatch",
        message: `${personA.full_name} và ${personB.full_name} đang có đời thứ khác nhau.`,
        personIds: [personA.id, personB.id],
        relationshipIds: [relationship.id],
      });
    }
  });

  return issues;
}

function buildGraph(persons: Person[], relationships: Relationship[]) {
  const personById = new Map(persons.map((person) => [person.id, person]));
  const parentsByChildId = new Map<string, string[]>();
  const childrenByParentId = new Map<string, string[]>();
  const spousesByPersonId = new Map<string, string[]>();
  const undirectedByPersonId = new Map<string, string[]>();

  persons.forEach((person) => undirectedByPersonId.set(person.id, []));

  relationships.forEach((relationship) => {
    if (
      !personById.has(relationship.person_a) ||
      !personById.has(relationship.person_b) ||
      relationship.person_a === relationship.person_b
    ) {
      return;
    }

    uniquePush(undirectedByPersonId, relationship.person_a, relationship.person_b);
    uniquePush(undirectedByPersonId, relationship.person_b, relationship.person_a);

    if (relationship.type === "marriage") {
      uniquePush(spousesByPersonId, relationship.person_a, relationship.person_b);
      uniquePush(spousesByPersonId, relationship.person_b, relationship.person_a);
      return;
    }

    if (isChildRelationship(relationship.type)) {
      uniquePush(parentsByChildId, relationship.person_b, relationship.person_a);
      uniquePush(childrenByParentId, relationship.person_a, relationship.person_b);
    }
  });

  return {
    personById,
    parentsByChildId,
    childrenByParentId,
    spousesByPersonId,
    undirectedByPersonId,
  };
}

function computeGenerations(
  persons: Person[],
  graph: ReturnType<typeof buildGraph>,
  rootPersonId: string | null | undefined,
  issues: GenealogyIssue[],
  seenIssues: Set<string>,
) {
  const generations = new Map<string, number>();
  const queue: Array<{ id: string; generation: number }> = [];
  const noParentIds = new Set(
    persons
      .filter((person) => !(graph.parentsByChildId.get(person.id)?.length))
      .map((person) => person.id),
  );
  const hasAnyRelationship = [...graph.undirectedByPersonId.values()].some(
    (neighborIds) => neighborIds.length > 0,
  );
  const rootIds = new Set<string>();
  if (rootPersonId && graph.personById.has(rootPersonId)) rootIds.add(rootPersonId);

  const processedNoParentIds = new Set<string>();
  persons.forEach((person) => {
    if (!noParentIds.has(person.id) || processedNoParentIds.has(person.id)) return;
    const spouses = graph.spousesByPersonId.get(person.id) ?? [];
    if (spouses.some((spouseId) => !noParentIds.has(spouseId))) {
      processedNoParentIds.add(person.id);
      return;
    }
    const noParentSpouses = spouses.filter((spouseId) => noParentIds.has(spouseId));
    if (noParentSpouses.length === 0) {
      processedNoParentIds.add(person.id);
      const isIsolated =
        (graph.undirectedByPersonId.get(person.id)?.length ?? 0) === 0;
      const isOnlyUnlinkedPerson =
        persons.length === 1 && !hasAnyRelationship && !rootPersonId;
      if (!isIsolated || person.id === rootPersonId || isOnlyUnlinkedPerson) {
        rootIds.add(person.id);
      }
      return;
    }

    const component: string[] = [];
    const componentQueue = [person.id];
    processedNoParentIds.add(person.id);
    while (componentQueue.length > 0) {
      const currentId = componentQueue.shift()!;
      component.push(currentId);
      for (const spouseId of graph.spousesByPersonId.get(currentId) ?? []) {
        if (!noParentIds.has(spouseId) || processedNoParentIds.has(spouseId)) continue;
        processedNoParentIds.add(spouseId);
        componentQueue.push(spouseId);
      }
    }
    const explicitRoot = rootPersonId && component.includes(rootPersonId)
      ? rootPersonId
      : null;
    const bloodlineCandidates = component.filter(
      (id) => graph.personById.get(id)?.is_in_law === false,
    );
    const maleCandidates = component.filter(
      (id) => graph.personById.get(id)?.gender === "male",
    );
    rootIds.add(
      explicitRoot ??
        (bloodlineCandidates.length === 1 ? bloodlineCandidates[0] : null) ??
        (maleCandidates.length === 1 ? maleCandidates[0] : null) ??
        component.slice().sort()[0],
    );
  });

  [...rootIds]
    .sort((idA, idB) => {
      if (idA === rootPersonId) return -1;
      if (idB === rootPersonId) return 1;
      const personA = graph.personById.get(idA);
      const personB = graph.personById.get(idB);
      return (personA?.birth_year ?? Number.MAX_SAFE_INTEGER) -
        (personB?.birth_year ?? Number.MAX_SAFE_INTEGER);
    })
    .forEach((id) => queue.push({ id, generation: 1 }));

  while (queue.length > 0) {
    const current = queue.shift()!;
    const existing = generations.get(current.id);
    if (existing != null) {
      if (existing !== current.generation) {
        addIssue(issues, seenIssues, {
          severity: "error",
          code: "generation_conflict",
          message: "Cây quan hệ tạo ra hai giá trị đời thứ khác nhau cho cùng một người.",
          personIds: [current.id],
        });
      }
      continue;
    }

    generations.set(current.id, current.generation);
    for (const spouseId of graph.spousesByPersonId.get(current.id) ?? []) {
      queue.push({ id: spouseId, generation: current.generation });
    }
    for (const childId of graph.childrenByParentId.get(current.id) ?? []) {
      queue.push({ id: childId, generation: current.generation + 1 });
    }
  }

  return generations;
}

function computeDisconnectedIssues(
  persons: Person[],
  graph: ReturnType<typeof buildGraph>,
  rootPersonId: string | null | undefined,
  issues: GenealogyIssue[],
  seenIssues: Set<string>,
) {
  const components: string[][] = [];
  const visited = new Set<string>();

  persons.forEach((person) => {
    if (visited.has(person.id)) return;
    const component: string[] = [];
    const queue = [person.id];
    visited.add(person.id);
    while (queue.length > 0) {
      const id = queue.shift()!;
      component.push(id);
      for (const neighbor of graph.undirectedByPersonId.get(id) ?? []) {
        if (visited.has(neighbor)) continue;
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
    components.push(component);
  });

  if (components.length <= 1) return;
  const primary =
    components.find((component) => rootPersonId && component.includes(rootPersonId)) ??
    components.slice().sort((a, b) => b.length - a.length)[0];

  components.forEach((component) => {
    if (component === primary || component.length === 1) return;
    addIssue(issues, seenIssues, {
      severity: "warning",
      code: "disconnected_component",
      message: "Có một nhánh gia phả chưa được nối với cây chính.",
      personIds: component,
    });
  });
}

function computeInLaws(
  persons: Person[],
  graph: ReturnType<typeof buildGraph>,
  rootPersonId: string | null | undefined,
  issues: GenealogyIssue[],
  seenIssues: Set<string>,
) {
  const result = new Map<string, boolean>();
  const noParentIds = new Set(
    persons
      .filter((person) => !(graph.parentsByChildId.get(person.id)?.length))
      .map((person) => person.id),
  );

  persons.forEach((person) => {
    if (!noParentIds.has(person.id)) result.set(person.id, false);
  });

  const processed = new Set<string>();
  persons.forEach((person) => {
    if (!noParentIds.has(person.id) || processed.has(person.id)) return;
    const noParentSpouses = (graph.spousesByPersonId.get(person.id) ?? []).filter(
      (id) => noParentIds.has(id),
    );
    if (noParentSpouses.length === 0) {
      const hasParentedSpouse = (graph.spousesByPersonId.get(person.id) ?? []).some(
        (id) => !noParentIds.has(id),
      );
      result.set(person.id, person.id === rootPersonId ? false : hasParentedSpouse);
      processed.add(person.id);
      return;
    }

    const component: string[] = [];
    const queue = [person.id];
    processed.add(person.id);
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      component.push(currentId);
      for (const spouseId of graph.spousesByPersonId.get(currentId) ?? []) {
        if (!noParentIds.has(spouseId) || processed.has(spouseId)) continue;
        processed.add(spouseId);
        queue.push(spouseId);
      }
    }

    const explicitRoot = rootPersonId && component.includes(rootPersonId)
      ? rootPersonId
      : null;
    const currentBloodline = component.filter(
      (id) => graph.personById.get(id)?.is_in_law === false,
    );
    const maleCandidates = component.filter(
      (id) => graph.personById.get(id)?.gender === "male",
    );
    const bloodlineId =
      explicitRoot ??
      (currentBloodline.length === 1 ? currentBloodline[0] : null) ??
      (maleCandidates.length === 1 ? maleCandidates[0] : null) ??
      component.slice().sort()[0];

    component.forEach((id) => result.set(id, id !== bloodlineId));
    if (!explicitRoot && currentBloodline.length !== 1) {
      addIssue(issues, seenIssues, {
        severity: "warning",
        code: "ambiguous_root_couple",
        message: "Cặp gốc không có thông tin cha/mẹ; hệ thống đã chọn một người làm dòng chính.",
        personIds: component,
      });
    }
  });

  return result;
}

function birthDateSortValue(person: Person) {
  if (person.birth_year == null) return Number.MAX_SAFE_INTEGER;
  return (
    person.birth_year * 10_000 +
    (person.birth_month ?? 12) * 100 +
    (person.birth_day ?? 31)
  );
}

function computeBirthOrders(
  persons: Person[],
  graph: ReturnType<typeof buildGraph>,
  issues: GenealogyIssue[],
  seenIssues: Set<string>,
) {
  const result = new Map<string, number | null>();
  const groups = new Map<string, string[]>();

  persons.forEach((person) => {
    const parentIds = (graph.parentsByChildId.get(person.id) ?? []).slice().sort();
    if (parentIds.length === 0) return;
    const key = parentIds.join(":");
    uniquePush(groups, key, person.id);
  });

  groups.forEach((childIds) => {
    const children = childIds
      .map((id) => graph.personById.get(id))
      .filter((person): person is Person => Boolean(person));
    const usedOrders = new Map<number, string[]>();
    children.forEach((child) => {
      if (child.birth_order == null) return;
      uniquePush(usedOrders, child.birth_order, child.id);
    });

    let hasConflict = false;
    usedOrders.forEach((ids, order) => {
      if (ids.length <= 1) return;
      hasConflict = true;
      addIssue(issues, seenIssues, {
        severity: "warning",
        code: "birth_order_conflict",
        message: `Nhiều anh/chị/em đang cùng có thứ tự sinh ${order}.`,
        personIds: ids,
      });
    });

    children.forEach((child) => result.set(child.id, child.birth_order));
    if (children.length === 1 && children[0].birth_order == null) {
      result.set(children[0].id, 1);
      return;
    }

    const hasOrderingSignal = children.some(
      (child) => child.birth_year != null || child.birth_order != null,
    );
    if (!hasOrderingSignal || hasConflict) {
      children.forEach((child) => {
        if (child.birth_order != null) return;
        addIssue(issues, seenIssues, {
          severity: "warning",
          code: "birth_order_unknown",
          message: `Chưa đủ dữ liệu để xác định thứ tự sinh của ${child.full_name}.`,
          personIds: [child.id],
        });
      });
      return;
    }

    const sorted = children.slice().sort((a, b) => {
      const dateDifference = birthDateSortValue(a) - birthDateSortValue(b);
      if (dateDifference !== 0) return dateDifference;
      const orderDifference =
        (a.birth_order ?? Number.MAX_SAFE_INTEGER) -
        (b.birth_order ?? Number.MAX_SAFE_INTEGER);
      if (orderDifference !== 0) return orderDifference;
      return a.full_name.localeCompare(b.full_name, "vi");
    });
    const reserved = new Set(
      children
        .map((child) => child.birth_order)
        .filter((value): value is number => value != null),
    );
    let nextOrder = 1;
    sorted.forEach((child) => {
      if (child.birth_order != null) return;
      while (reserved.has(nextOrder)) nextOrder += 1;
      result.set(child.id, nextOrder);
      reserved.add(nextOrder);
      nextOrder += 1;
    });
  });

  return result;
}

export function computeGenealogyState({
  persons,
  relationships,
  rootPersonId,
}: {
  persons: Person[];
  relationships: Relationship[];
  rootPersonId?: string | null;
}): GenealogyComputationResult {
  const issues = validateRelationshipGraph({ persons, relationships });
  const seenIssues = new Set(
    issues.map((issue) =>
      [
        issue.code,
        ...(issue.personIds ?? []).slice().sort(),
        ...(issue.relationshipIds ?? []).slice().sort(),
      ].join(":"),
    ),
  );
  const graph = buildGraph(persons, relationships);
  const generations = computeGenerations(
    persons,
    graph,
    rootPersonId,
    issues,
    seenIssues,
  );
  computeDisconnectedIssues(
    persons,
    graph,
    rootPersonId,
    issues,
    seenIssues,
  );
  const inLaws = computeInLaws(
    persons,
    graph,
    rootPersonId,
    issues,
    seenIssues,
  );
  const birthOrders = computeBirthOrders(persons, graph, issues, seenIssues);

  const updates = persons.map((person) => {
    const newGeneration = generations.get(person.id) ?? null;
    const newIsInLaw = inLaws.get(person.id) ?? false;
    const newBirthOrder = birthOrders.has(person.id)
      ? (birthOrders.get(person.id) ?? null)
      : person.birth_order;
    return {
      id: person.id,
      old_generation: person.generation,
      new_generation: newGeneration,
      old_is_in_law: person.is_in_law,
      new_is_in_law: newIsInLaw,
      old_birth_order: person.birth_order,
      new_birth_order: newBirthOrder,
      changed:
        person.generation !== newGeneration ||
        person.is_in_law !== newIsInLaw ||
        person.birth_order !== newBirthOrder,
    } satisfies ComputedPersonLineage;
  });

  return { updates, issues };
}
