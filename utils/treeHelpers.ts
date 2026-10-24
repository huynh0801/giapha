import { Person, Relationship, RelationshipType } from "@/types";

export interface SpouseData {
  person: Person;
  note?: string | null;
}

export interface AdjacencyLists {
  spousesByPersonId: Map<string, SpouseData[]>;
  childrenByPersonId: Map<string, Person[]>;
}

export interface TreeFilterOptions {
  hideDaughtersInLaw: boolean;
  hideSonsInLaw: boolean;
  hideDaughters: boolean;
  hideSons: boolean;
  hideMales: boolean;
  hideFemales: boolean;
}

export const childRelationshipTypes: RelationshipType[] = [
  "biological_child",
  "adopted_child",
  "step_child",
  "foster_child",
];

export function isChildRelationshipType(type: RelationshipType) {
  return childRelationshipTypes.includes(type);
}

export function relationshipTypeLabel(type: RelationshipType) {
  if (type === "marriage") return "Hôn nhân";
  if (type === "biological_child") return "Con ruột";
  if (type === "adopted_child") return "Con nuôi";
  if (type === "step_child") return "Con riêng";
  if (type === "foster_child") return "Con được nuôi";
  return "Quan hệ";
}

function childLabel(person: Person) {
  if (person.gender === "male") return "Con trai";
  if (person.gender === "female") return "Con gái";
  return "Con";
}

function grandChildLabel(person: Person) {
  if (person.gender === "male") return "Cháu trai";
  if (person.gender === "female") return "Cháu gái";
  return "Cháu";
}

function parentLabel(person: Person) {
  if (person.gender === "male") return "Cha";
  if (person.gender === "female") return "Mẹ";
  return "Cha/mẹ";
}

function grandParentLabel(person: Person) {
  if (person.gender === "male") return "Ông";
  if (person.gender === "female") return "Bà";
  return "Ông/bà";
}

function spouseLabel(person: Person) {
  if (person.gender === "male") return "Chồng";
  if (person.gender === "female") return "Vợ";
  return "Bạn đời";
}

function inLawChildLabel(person: Person) {
  if (person.gender === "male") return "Con rể";
  if (person.gender === "female") return "Con dâu";
  return "Dâu/rể";
}

function siblingLabel(source: Person, sibling: Person) {
  const sourceOrder = source.birth_order ?? null;
  const siblingOrder = sibling.birth_order ?? null;
  const sourceYear = source.birth_year ?? null;
  const siblingYear = sibling.birth_year ?? null;
  const older =
    sourceOrder != null && siblingOrder != null
      ? siblingOrder < sourceOrder
      : sourceYear != null && siblingYear != null
        ? siblingYear < sourceYear
        : null;

  if (sibling.gender === "male") {
    if (older === null) return "Anh/em trai";
    return older ? "Anh trai" : "Em trai";
  }
  if (sibling.gender === "female") {
    if (older === null) return "Chị/em gái";
    return older ? "Chị gái" : "Em gái";
  }
  return "Anh/chị/em";
}

function addRelationLabel(
  labelsByPersonId: Map<string, string[]>,
  personId: string,
  label: string,
) {
  const current = labelsByPersonId.get(personId) ?? [];
  if (!current.includes(label)) {
    labelsByPersonId.set(personId, [...current, label]);
  }
}

export function buildRelativeRelationLabels(
  sourcePersonId: string,
  relationships: Relationship[],
  personsMap: Map<string, Person>,
) {
  const source = personsMap.get(sourcePersonId);
  const labelsByPersonId = new Map<string, string[]>();
  if (!source) return labelsByPersonId;

  const parentIdsByChildId = new Map<string, string[]>();
  const childIdsByParentId = new Map<string, string[]>();
  const spouseIdsByPersonId = new Map<string, string[]>();

  relationships.forEach((relationship) => {
    if (relationship.type === "marriage") {
      spouseIdsByPersonId.set(relationship.person_a, [
        ...(spouseIdsByPersonId.get(relationship.person_a) ?? []),
        relationship.person_b,
      ]);
      spouseIdsByPersonId.set(relationship.person_b, [
        ...(spouseIdsByPersonId.get(relationship.person_b) ?? []),
        relationship.person_a,
      ]);
      return;
    }

    if (isChildRelationshipType(relationship.type)) {
      childIdsByParentId.set(relationship.person_a, [
        ...(childIdsByParentId.get(relationship.person_a) ?? []),
        relationship.person_b,
      ]);
      parentIdsByChildId.set(relationship.person_b, [
        ...(parentIdsByChildId.get(relationship.person_b) ?? []),
        relationship.person_a,
      ]);
    }
  });

  const sourceParentIds = parentIdsByChildId.get(sourcePersonId) ?? [];
  const sourceChildIds = childIdsByParentId.get(sourcePersonId) ?? [];

  sourceParentIds.forEach((parentId) => {
    const parent = personsMap.get(parentId);
    if (parent) addRelationLabel(labelsByPersonId, parent.id, parentLabel(parent));

    const grandParentIds = parentIdsByChildId.get(parentId) ?? [];
    grandParentIds.forEach((grandParentId) => {
      const grandParent = personsMap.get(grandParentId);
      if (grandParent) {
        addRelationLabel(
          labelsByPersonId,
          grandParent.id,
          grandParentLabel(grandParent),
        );
      }
    });

    const siblingIds = childIdsByParentId.get(parentId) ?? [];
    siblingIds.forEach((siblingId) => {
      if (siblingId === sourcePersonId) return;
      const sibling = personsMap.get(siblingId);
      if (sibling) {
        addRelationLabel(labelsByPersonId, sibling.id, siblingLabel(source, sibling));
      }
    });
  });

  sourceChildIds.forEach((childId) => {
    const child = personsMap.get(childId);
    if (!child) return;

    addRelationLabel(labelsByPersonId, child.id, childLabel(child));

    const grandChildIds = childIdsByParentId.get(child.id) ?? [];
    grandChildIds.forEach((grandChildId) => {
      const grandChild = personsMap.get(grandChildId);
      if (grandChild) {
        addRelationLabel(
          labelsByPersonId,
          grandChild.id,
          grandChildLabel(grandChild),
        );
      }
    });

    const childSpouseIds = spouseIdsByPersonId.get(child.id) ?? [];
    childSpouseIds.forEach((spouseId) => {
      const spouse = personsMap.get(spouseId);
      if (spouse) {
        addRelationLabel(labelsByPersonId, spouse.id, inLawChildLabel(spouse));
      }
    });
  });

  const sourceSpouseIds = spouseIdsByPersonId.get(sourcePersonId) ?? [];
  sourceSpouseIds.forEach((spouseId) => {
    const spouse = personsMap.get(spouseId);
    if (spouse) addRelationLabel(labelsByPersonId, spouse.id, spouseLabel(spouse));
  });

  labelsByPersonId.delete(sourcePersonId);
  return labelsByPersonId;
}

/**
 * Xây dựng danh sách kề cho vợ/chồng và con cái từ dữ liệu thô.
 * Giúp tối ưu truy vấn từ O(N) xuống O(1).
 */
export function buildAdjacencyLists(
  relationships: Relationship[],
  personsMap: Map<string, Person>,
): AdjacencyLists {
  const spouses = new Map<string, SpouseData[]>();
  const children = new Map<string, Person[]>();

  relationships.forEach((relationship) => {
    if (relationship.type === "marriage") {
      if (!spouses.has(relationship.person_a)) spouses.set(relationship.person_a, []);
      if (!spouses.has(relationship.person_b)) spouses.set(relationship.person_b, []);

      const personB = personsMap.get(relationship.person_b);
      if (personB) {
        spouses.get(relationship.person_a)!.push({
          person: personB,
          note: relationship.note,
        });
      }

      const personA = personsMap.get(relationship.person_a);
      if (personA) {
        spouses.get(relationship.person_b)!.push({
          person: personA,
          note: relationship.note,
        });
      }
    } else if (isChildRelationshipType(relationship.type)) {
      if (!children.has(relationship.person_a)) children.set(relationship.person_a, []);
      const child = personsMap.get(relationship.person_b);
      if (child) children.get(relationship.person_a)!.push(child);
    }
  });

  children.forEach((childArray) => {
    childArray.sort((a, b) => {
      const aOrder = a.birth_order ?? Infinity;
      const bOrder = b.birth_order ?? Infinity;
      if (aOrder !== bOrder) return aOrder - bOrder;
      const aYear = a.birth_year ?? Infinity;
      const bYear = b.birth_year ?? Infinity;
      return aYear - bYear;
    });
  });

  return { spousesByPersonId: spouses, childrenByPersonId: children };
}

/**
 * Lấy dữ liệu của một node trong cây đã qua bộ lọc.
 */
export function getFilteredTreeData(
  personId: string,
  personsMap: Map<string, Person>,
  adj: AdjacencyLists,
  filters: TreeFilterOptions,
) {
  const {
    hideDaughtersInLaw,
    hideSonsInLaw,
    hideDaughters,
    hideSons,
    hideMales,
    hideFemales,
  } = filters;

  let spousesList = adj.spousesByPersonId.get(personId) || [];
  spousesList = spousesList.filter((spouse) => {
    if (hideDaughtersInLaw && spouse.person.gender === "female") return false;
    if (hideSonsInLaw && spouse.person.gender === "male") return false;
    if (hideMales && spouse.person.gender === "male") return false;
    if (hideFemales && spouse.person.gender === "female") return false;
    return true;
  });

  let childrenList = adj.childrenByPersonId.get(personId) || [];
  childrenList = childrenList.filter((child) => {
    if (hideDaughters && child.gender === "female") return false;
    if (hideSons && child.gender === "male") return false;
    if (hideMales && child.gender === "male") return false;
    if (hideFemales && child.gender === "female") return false;
    return true;
  });

  return {
    person: personsMap.get(personId)!,
    spouses: spousesList,
    children: childrenList,
  };
}


/**
 * Tìm tất cả các cành gốc (roots của các nhánh gia phả).
 * Phân tích các thành phần liên thông trong đồ thị gia phả để tìm ra tổ phụ / người đứng đầu của từng nhánh.
 */
export function findForestRoots(
  personsMap: Map<string, Person>,
  relationships: Relationship[],
): Person[] {
  const childIds = new Set(
    relationships
      .filter((r) => isChildRelationshipType(r.type))
      .map((r) => r.person_b),
  );

  const parentIdsByChildId = new Map<string, string[]>();
  const spouseIdsByPersonId = new Map<string, string[]>();
  const graph = new Map<string, Set<string>>();

  const ensureNode = (id: string) => {
    if (!graph.has(id)) graph.set(id, new Set());
  };

  relationships.forEach((rel) => {
    if (!personsMap.has(rel.person_a) || !personsMap.has(rel.person_b)) return;
    ensureNode(rel.person_a);
    ensureNode(rel.person_b);
    graph.get(rel.person_a)!.add(rel.person_b);
    graph.get(rel.person_b)!.add(rel.person_a);

    if (isChildRelationshipType(rel.type)) {
      if (!parentIdsByChildId.has(rel.person_b)) {
        parentIdsByChildId.set(rel.person_b, []);
      }
      parentIdsByChildId.get(rel.person_b)!.push(rel.person_a);
    } else if (rel.type === "marriage") {
      if (!spouseIdsByPersonId.has(rel.person_a)) spouseIdsByPersonId.set(rel.person_a, []);
      if (!spouseIdsByPersonId.has(rel.person_b)) spouseIdsByPersonId.set(rel.person_b, []);
      spouseIdsByPersonId.get(rel.person_a)!.push(rel.person_b);
      spouseIdsByPersonId.get(rel.person_b)!.push(rel.person_a);
    }
  });

  const sortPeopleForTree = (a: Person, b: Person) => {
    const genDiff = (a.generation ?? 999) - (b.generation ?? 999);
    if (genDiff !== 0) return genDiff;
    const yearDiff = (a.birth_year ?? 9999) - (b.birth_year ?? 9999);
    if (yearDiff !== 0) return yearDiff;
    return a.full_name.localeCompare(b.full_name, "vi");
  };

  const bestRoot = (ids: string[]) =>
    [...ids].sort((a, b) => {
      const pA = personsMap.get(a);
      const pB = personsMap.get(b);
      if (!pA || !pB) return a.localeCompare(b);
      return sortPeopleForTree(pA, pB);
    })[0];

  const visited = new Set<string>();
  const roots: Person[] = [];

  for (const personId of graph.keys()) {
    if (visited.has(personId)) continue;
    const stack = [personId];
    const component: string[] = [];
    visited.add(personId);

    while (stack.length > 0) {
      const current = stack.pop()!;
      component.push(current);
      graph.get(current)?.forEach((next) => {
        if (!visited.has(next)) {
          visited.add(next);
          stack.push(next);
        }
      });
    }

    const componentSet = new Set(component);
    const topCandidates = component.filter((id) =>
      (parentIdsByChildId.get(id) ?? []).every((pid) => !componentSet.has(pid)),
    );

    const parentsWithChildren = topCandidates.filter((id) =>
      relationships.some(
        (r) =>
          isChildRelationshipType(r.type) &&
          r.person_a === id &&
          componentSet.has(r.person_b),
      ),
    );

    const candidateIds =
      parentsWithChildren.length > 0
        ? parentsWithChildren
        : topCandidates.length > 0
          ? topCandidates
          : component;

    const candidateSet = new Set(candidateIds);
    const reducedCandidates = candidateIds.filter((id) => {
      const spouseIds = spouseIdsByPersonId.get(id) ?? [];
      return !spouseIds.some((sId) => {
        if (!candidateSet.has(sId)) return false;
        return bestRoot([id, sId]) === sId;
      });
    });

    const chosenId = bestRoot(
      reducedCandidates.length > 0 ? reducedCandidates : candidateIds,
    );
    if (chosenId && personsMap.has(chosenId)) {
      roots.push(personsMap.get(chosenId)!);
    }
  }

  roots.sort(sortPeopleForTree);

  if (roots.length === 0 && personsMap.size > 0) {
    const fallback = [...personsMap.values()]
      .filter((p) => !childIds.has(p.id))
      .sort(sortPeopleForTree);
    return fallback.length > 0 ? fallback : [...personsMap.values()].slice(0, 1);
  }

  return roots;
}
