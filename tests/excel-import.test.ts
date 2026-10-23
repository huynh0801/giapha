import assert from "node:assert/strict";
import test from "node:test";
import type { Person, Relationship } from "../types/index";
import { buildImportPlan } from "../utils/excelImport/buildImportPlan";
import {
  detectHeaderCandidates,
  rowsToNormalizedImportRows,
} from "../utils/excelImport/detectColumns";
import { parseExcelWorkbook } from "../utils/excelImport/parseWorkbook";

const now = "2026-06-22T00:00:00.000Z";

function existingPerson(id: string, ref: string, name: string): Person {
  return {
    id,
    family_id: "family-1",
    tree_id: "tree-1",
    external_ref: ref,
    full_name: name,
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
  };
}

test("detects flexible Vietnamese and English genealogy headers", () => {
  const vietnamese = detectHeaderCandidates([
    ["Danh sách gia phả"],
    ["Mã thành viên", "Họ và tên", "Giới tính", "Mã cha", "Mã mẹ", "Vợ/Chồng"],
  ]);
  assert.equal(vietnamese[0].rowIndex, 1);
  assert.equal(vietnamese[0].mappedColumns.full_name, 1);
  assert.equal(vietnamese[0].mappedColumns.father_key, 3);
  assert.ok(vietnamese[0].confidence >= 0.75);

  const english = detectHeaderCandidates([
    ["Person ID", "Full Name", "Gender", "Father", "Mother", "Spouse"],
  ]);
  assert.equal(english[0].mappedColumns.person_key, 0);
  assert.equal(english[0].mappedColumns.spouse_keys, 5);
});

test("parses an actual XLSX workbook and detects the header row", async () => {
  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["GIA PHẢ CHI HỌ"],
    [],
    ["Mã", "Họ và tên", "Năm sinh", "Cha", "Mẹ"],
    ["P1", "Nguyễn Văn Gốc", 1920, "", ""],
  ]);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sach");
  const bytes = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  const file = {
    name: "gia-pha-thuc-te.xlsx",
    arrayBuffer: async () => bytes,
  } as File;

  const parsed = await parseExcelWorkbook(file);
  assert.equal(parsed.sheets[0].name, "Danh sach");
  assert.equal(parsed.sheets[0].detectedHeaderRowIndex, 2);
  assert.equal(parsed.sheets[0].candidates[0].mappedColumns.full_name, 1);
});

test("builds people and relationships from a single sheet", () => {
  const table = [
    ["Mã", "Họ tên", "Giới tính", "Cha", "Mẹ", "Vợ chồng", "Người gốc"],
    ["P1", "Ông Gốc", "Nam", "", "", "P2", "Có"],
    ["P2", "Bà Gốc", "Nữ", "", "", "P1", ""],
    ["P3", "Người Con", "Nam", "P1", "P2", "", ""],
  ];
  const candidate = detectHeaderCandidates(table)[0];
  const rows = rowsToNormalizedImportRows(table, {
    sheetName: "Gia pha",
    headerRowIndex: candidate.rowIndex,
    columns: candidate.mappedColumns,
  });
  const plan = buildImportPlan({
    existingPersons: [],
    existingRelationships: [],
    rows,
    familyId: "family-1",
    treeId: "tree-1",
  });

  assert.equal(plan.counts.personsToCreate, 3);
  assert.equal(plan.counts.relationshipsToCreate, 3);
  assert.equal(plan.rootInternalKey, "p1");
  assert.equal(plan.issues.some((issue) => issue.severity === "error"), false);
});

test("builds parent relationships from one friendly parents column", () => {
  const table = [
    ["Ho ten", "Gioi tinh", "Cha me"],
    ["Truong Van Minh", "Nam", ""],
    ["Le Thi Lan", "Nu", ""],
    ["Truong Hoang Anh", "Nam", "Truong Van Minh; Le Thi Lan"],
  ];
  const candidate = detectHeaderCandidates(table)[0];
  const rows = rowsToNormalizedImportRows(table, {
    sheetName: "Danh sach",
    headerRowIndex: candidate.rowIndex,
    columns: candidate.mappedColumns,
  });
  const plan = buildImportPlan({
    existingPersons: [],
    existingRelationships: [],
    rows,
    familyId: "family-1",
    treeId: "tree-1",
  });

  assert.equal(rows[2].parent_keys.length, 2);
  assert.equal(plan.counts.relationshipsToCreate, 2);
  assert.equal(plan.issues.some((issue) => issue.severity === "error"), false);
});

test("person-only imports do not warn about missing relationships", () => {
  const table = [
    ["Ho ten", "Gioi tinh", "Nam sinh", "Ghi chu"],
    ["Truong Van Minh", "Nam", 1958, ""],
    ["Le Thi Lan", "Nu", 1960, ""],
  ];
  const candidate = detectHeaderCandidates(table)[0];
  const rows = rowsToNormalizedImportRows(table, {
    sheetName: "Danh sach",
    headerRowIndex: candidate.rowIndex,
    columns: candidate.mappedColumns,
  });
  const plan = buildImportPlan({
    existingPersons: [],
    existingRelationships: [],
    rows,
    familyId: "family-1",
    treeId: "tree-1",
  });

  assert.equal(plan.counts.personsToCreate, 2);
  assert.equal(plan.counts.relationshipsToCreate, 0);
  assert.equal(plan.issues.some((issue) => issue.code === "isolated_person"), false);
});

test("imports lunar death anniversary and marks person as deceased", () => {
  const table = [
    ["Ho ten", "Gioi tinh", "Nam sinh", "Ngay gio", "Doi thu"],
    ["Truong Van Khai", "Nam", 1930, "10/03/1998", 1],
    ["Nguyen Thi Hoa", "Nu", 1934, "", 1],
  ];
  const candidate = detectHeaderCandidates(table)[0];
  const rows = rowsToNormalizedImportRows(table, {
    sheetName: "Danh sach",
    headerRowIndex: candidate.rowIndex,
    columns: candidate.mappedColumns,
  });
  const plan = buildImportPlan({
    existingPersons: [],
    existingRelationships: [],
    rows,
    familyId: "family-1",
    treeId: "tree-1",
  });

  assert.equal(rows[0].death_lunar_day, 10);
  assert.equal(rows[0].death_lunar_month, 3);
  assert.equal(rows[0].death_lunar_year, 1998);
  assert.equal(plan.persons[0].payload.is_deceased, true);
  assert.equal(plan.persons[1].payload.is_deceased, false);
  assert.equal(rows[0].generation, 1);
});

test("re-import matches external_ref instead of creating duplicate people", () => {
  const rows = [
    {
      rowNumber: 2,
      person_key: "P1",
      full_name: "Ông Gốc cập nhật",
      gender: "male" as const,
      parent_keys: [],
      father_key: null,
      mother_key: null,
      spouse_keys: [],
      birth_order: null,
      generation: null,
      birth_year: null,
      birth_month: null,
      birth_day: null,
      death_year: null,
      death_month: null,
      death_day: null,
      death_lunar_year: null,
      death_lunar_month: null,
      death_lunar_day: null,
      other_names: null,
      note: null,
      phone_number: null,
      occupation: null,
      current_residence: null,
      is_root: false,
    },
  ];
  const persons = [existingPerson("existing-1", "P1", "Ông Gốc")];
  const relationships: Relationship[] = [];
  const plan = buildImportPlan({
    existingPersons: persons,
    existingRelationships: relationships,
    rows,
    familyId: "family-1",
    treeId: "tree-1",
  });

  assert.equal(plan.counts.personsToCreate, 0);
  assert.equal(plan.counts.personsToUpdate, 1);
  assert.equal(plan.persons[0].existingId, "existing-1");
});

test("name duplicates without member code create separate people", () => {
  const rows = [
    {
      rowNumber: 2,
      person_key: null,
      full_name: "Trương Văn Minh",
      gender: "male" as const,
      parent_keys: [],
      father_key: null,
      mother_key: null,
      spouse_keys: [],
      birth_order: null,
      generation: null,
      birth_year: 1958,
      birth_month: null,
      birth_day: null,
      death_year: null,
      death_month: null,
      death_day: null,
      death_lunar_year: null,
      death_lunar_month: null,
      death_lunar_day: null,
      other_names: null,
      note: null,
      phone_number: null,
      occupation: null,
      current_residence: null,
      is_root: false,
    },
  ];
  const existing = existingPerson("existing-minh", "", "Trương Văn Minh");
  existing.birth_year = 1958;

  const plan = buildImportPlan({
    existingPersons: [existing],
    existingRelationships: [],
    rows,
    familyId: "family-1",
    treeId: "tree-1",
  });

  assert.equal(plan.counts.personsToCreate, 1);
  assert.equal(plan.counts.personsToUpdate, 0);
  assert.equal(plan.persons[0].existingId, null);
  assert.ok(plan.issues.some((issue) => issue.code === "possible_duplicate"));
});

test("name relationships prefer imported rows over existing duplicate names", () => {
  const rows = [
    {
      rowNumber: 2,
      person_key: null,
      full_name: "Trương Văn Minh",
      gender: "male" as const,
      parent_keys: [],
      father_key: null,
      mother_key: null,
      spouse_keys: [],
      birth_order: null,
      generation: null,
      birth_year: 1958,
      birth_month: null,
      birth_day: null,
      death_year: null,
      death_month: null,
      death_day: null,
      death_lunar_year: null,
      death_lunar_month: null,
      death_lunar_day: null,
      other_names: null,
      note: null,
      phone_number: null,
      occupation: null,
      current_residence: null,
      is_root: false,
    },
    {
      rowNumber: 3,
      person_key: null,
      full_name: "Trương Hoàng Anh",
      gender: "male" as const,
      parent_keys: ["Trương Văn Minh"],
      father_key: null,
      mother_key: null,
      spouse_keys: [],
      birth_order: null,
      generation: null,
      birth_year: 1985,
      birth_month: null,
      birth_day: null,
      death_year: null,
      death_month: null,
      death_day: null,
      death_lunar_year: null,
      death_lunar_month: null,
      death_lunar_day: null,
      other_names: null,
      note: null,
      phone_number: null,
      occupation: null,
      current_residence: null,
      is_root: false,
    },
  ];
  const existing = existingPerson("existing-minh", "", "Trương Văn Minh");

  const plan = buildImportPlan({
    existingPersons: [existing],
    existingRelationships: [],
    rows,
    familyId: "family-1",
    treeId: "tree-1",
  });

  assert.equal(plan.counts.personsToCreate, 2);
  assert.equal(plan.counts.relationshipsToCreate, 1);
  assert.equal(plan.relationships[0].sourceInternalKey, "row:2");
  assert.equal(plan.relationships[0].targetInternalKey, "row:3");
});
