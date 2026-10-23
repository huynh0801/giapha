import assert from "node:assert/strict";
import test from "node:test";
import type { Person, Relationship, RelationshipType } from "../types/index";
import {
  computeGenealogyState,
  validateRelationshipGraph,
} from "../utils/genealogyEngine";

const now = "2026-06-22T00:00:00.000Z";

function person(
  id: string,
  fullName: string,
  options: Partial<Person> = {},
): Person {
  return {
    id,
    family_id: "family-1",
    tree_id: "tree-1",
    full_name: fullName,
    gender: "male",
    birth_year: null,
    birth_month: null,
    birth_day: null,
    death_year: null,
    death_month: null,
    death_day: null,
    death_lunar_year: null,
    death_lunar_month: null,
    death_lunar_day: null,
    is_deceased: false,
    is_in_law: false,
    birth_order: null,
    generation: null,
    other_names: null,
    avatar_url: null,
    note: null,
    created_at: now,
    updated_at: now,
    ...options,
  };
}

function relationship(
  id: string,
  type: RelationshipType,
  personA: string,
  personB: string,
): Relationship {
  return {
    id,
    family_id: "family-1",
    tree_id: "tree-1",
    type,
    person_a: personA,
    person_b: personB,
    created_at: now,
    updated_at: now,
  };
}

test("computes generations and in-law role across three generations", () => {
  const persons = [
    person("root", "Ông Gốc"),
    person("root-spouse", "Bà Gốc", { gender: "female" }),
    person("child", "Người Con", { birth_year: 1950 }),
    person("grandchild", "Người Cháu", { birth_year: 1980 }),
  ];
  const relationships = [
    relationship("r1", "marriage", "root", "root-spouse"),
    relationship("r2", "biological_child", "root", "child"),
    relationship("r3", "biological_child", "root-spouse", "child"),
    relationship("r4", "biological_child", "child", "grandchild"),
  ];

  const result = computeGenealogyState({
    persons,
    relationships,
    rootPersonId: "root",
  });
  const updates = new Map(result.updates.map((update) => [update.id, update]));

  assert.equal(updates.get("root")?.new_generation, 1);
  assert.equal(updates.get("root-spouse")?.new_generation, 1);
  assert.equal(updates.get("child")?.new_generation, 2);
  assert.equal(updates.get("grandchild")?.new_generation, 3);
  assert.equal(updates.get("root")?.new_is_in_law, false);
  assert.equal(updates.get("root-spouse")?.new_is_in_law, true);
  assert.equal(updates.get("child")?.new_is_in_law, false);
  assert.equal(result.issues.some((issue) => issue.severity === "error"), false);
});

test("rejects parent-child cycles", () => {
  const persons = [person("a", "A"), person("b", "B")];
  const relationships = [
    relationship("r1", "biological_child", "a", "b"),
    relationship("r2", "biological_child", "b", "a"),
  ];
  const issues = validateRelationshipGraph({ persons, relationships });
  assert.ok(issues.some((issue) => issue.code === "parent_child_cycle"));
});

test("rejects reversed duplicate marriages", () => {
  const persons = [person("a", "A"), person("b", "B")];
  const relationships = [
    relationship("r1", "marriage", "a", "b"),
    relationship("r2", "marriage", "b", "a"),
  ];
  const issues = validateRelationshipGraph({ persons, relationships });
  assert.ok(issues.some((issue) => issue.code === "duplicate_relationship"));
});

test("preserves explicit birth orders and fills the missing sibling order", () => {
  const persons = [
    person("parent", "Cha"),
    person("first", "Con Một", { birth_year: 1980, birth_order: 1 }),
    person("second", "Con Hai", { birth_year: 1985 }),
  ];
  const relationships = [
    relationship("r1", "biological_child", "parent", "first"),
    relationship("r2", "biological_child", "parent", "second"),
  ];
  const result = computeGenealogyState({ persons, relationships });
  const updates = new Map(result.updates.map((update) => [update.id, update]));
  assert.equal(updates.get("first")?.new_birth_order, 1);
  assert.equal(updates.get("second")?.new_birth_order, 2);
});

test("spouse without parents inherits the bloodline spouse generation", () => {
  const persons = [
    person("root", "Ông Gốc"),
    person("child", "Người Con"),
    person("child-spouse", "Con Dâu", { gender: "female" }),
  ];
  const relationships = [
    relationship("r1", "biological_child", "root", "child"),
    relationship("r2", "marriage", "child", "child-spouse"),
  ];
  const result = computeGenealogyState({
    persons,
    relationships,
    rootPersonId: "root",
  });
  const updates = new Map(result.updates.map((update) => [update.id, update]));

  assert.equal(updates.get("child")?.new_generation, 2);
  assert.equal(updates.get("child-spouse")?.new_generation, 2);
  assert.equal(updates.get("child-spouse")?.new_is_in_law, true);
  assert.equal(
    result.issues.some((issue) => issue.code === "generation_conflict"),
    false,
  );
});

test("unlinked imported members keep generation unknown until connected", () => {
  const persons = [
    person("root", "Root"),
    person("child", "Child"),
    person("unlinked", "Imported Without Relationship"),
  ];
  const relationships = [
    relationship("r1", "biological_child", "root", "child"),
  ];
  const result = computeGenealogyState({
    persons,
    relationships,
    rootPersonId: "root",
  });
  const updates = new Map(result.updates.map((update) => [update.id, update]));

  assert.equal(updates.get("root")?.new_generation, 1);
  assert.equal(updates.get("child")?.new_generation, 2);
  assert.equal(updates.get("unlinked")?.new_generation, null);
});
