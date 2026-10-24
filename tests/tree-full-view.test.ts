import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import type { Person, Relationship } from "../types/index";
import { findForestRoots } from "../utils/treeHelpers";

function read(filePath: string) {
  return fs.readFileSync(path.resolve(process.cwd(), filePath), "utf8");
}

test("findForestRoots correctly finds root ancestors of single and multi-branch trees", () => {
  const p1: Person = {
    id: "p1",
    family_id: "f1",
    tree_id: "t1",
    full_name: "Cụ Tổ Nhánh 1",
    generation: 1,
    birth_year: 1900,
    birth_month: null,
    birth_day: null,
    death_year: null,
    death_month: null,
    death_day: null,
    death_lunar_year: null,
    death_lunar_month: null,
    death_lunar_day: null,
    is_deceased: true,
    is_in_law: false,
    birth_order: null,
    other_names: null,
    avatar_url: null,
    note: null,
    created_at: "",
    updated_at: "",
    gender: "male",
  };
  const p2: Person = {
    ...p1,
    id: "p2",
    full_name: "Con Nhánh 1",
    generation: 2,
    birth_year: 1925,
  };
  const p3: Person = {
    ...p1,
    id: "p3",
    full_name: "Cụ Tổ Nhánh 2",
    generation: 1,
    birth_year: 1905,
  };
  const p4: Person = {
    ...p1,
    id: "p4",
    full_name: "Con Nhánh 2",
    generation: 2,
    birth_year: 1930,
    gender: "female",
  };

  const map = new Map<string, Person>([
    ["p1", p1],
    ["p2", p2],
    ["p3", p3],
    ["p4", p4],
  ]);

  const rels: Relationship[] = [
    {
      id: "r1",
      family_id: "f1",
      tree_id: "t1",
      type: "biological_child",
      person_a: "p1",
      person_b: "p2",
      created_at: "",
      updated_at: "",
    },
    {
      id: "r2",
      family_id: "f1",
      tree_id: "t1",
      type: "biological_child",
      person_a: "p3",
      person_b: "p4",
      created_at: "",
      updated_at: "",
    },
  ];

  const roots = findForestRoots(map, rels);
  assert.equal(roots.length, 2, "Should return 2 roots for 2 distinct branches");
  assert.equal(roots[0].id, "p1", "Earlier birth year branch 1 should be first root");
  assert.equal(roots[1].id, "p3", "Branch 2 should be second root");
});

test("FamilyTree and MindmapTree expand all branches by default (DEFAULT_AUTO_COLLAPSE_LEVEL = 0)", () => {
  const familyTree = read("components/FamilyTree.tsx");
  const mindmapTree = read("components/MindmapTree.tsx");

  assert.match(
    familyTree,
    /const DEFAULT_AUTO_COLLAPSE_LEVEL = 0;/,
    "FamilyTree must default to auto collapse level 0 so the entire tree is visible",
  );
  assert.match(
    mindmapTree,
    /const DEFAULT_AUTO_COLLAPSE_LEVEL = 0;/,
    "MindmapTree must default to auto collapse level 0 so the entire tree is visible",
  );
});

test("TreeToolbar provides Expand All and Collapse All buttons", () => {
  const treeToolbar = read("components/TreeToolbar.tsx");
  const familyTree = read("components/FamilyTree.tsx");

  assert.match(
    treeToolbar,
    /handleExpandAll/,
    "TreeToolbar must accept handleExpandAll prop",
  );
  assert.match(
    treeToolbar,
    /handleCollapseAll/,
    "TreeToolbar must accept handleCollapseAll prop",
  );
  assert.match(
    treeToolbar,
    /Mở rộng tất cả/,
    "TreeToolbar must show button text Mở rộng tất cả",
  );
  assert.match(
    treeToolbar,
    /Thu gọn/,
    "TreeToolbar must show button text Thu gọn",
  );

  assert.match(
    familyTree,
    /onExpandAll=\{handleExpandAll\}/,
    "FamilyTree must pass handleExpandAll to TreeCanvasTools",
  );
  assert.match(
    familyTree,
    /onCollapseAll=\{handleCollapseAll\}/,
    "FamilyTree must pass handleCollapseAll to TreeCanvasTools",
  );
});

test("RootSelector allows viewing all branches (Toàn bộ cành nhánh)", () => {
  const rootSelector = read("components/RootSelector.tsx");
  const dashboardViews = read("components/DashboardViews.tsx");

  assert.match(
    rootSelector,
    /showAllOption=\{true\}/,
    "RootSelector must enable showAllOption",
  );
  assert.match(
    rootSelector,
    /allOptionLabel="Toàn bộ cành nhánh"/,
    "RootSelector label must be Toàn bộ cành nhánh",
  );

  assert.match(
    dashboardViews,
    /findForestRoots\(pMap, relationships\)/,
    "DashboardViews must use findForestRoots when no rootId is selected",
  );
});

test("FamilyTree supports free canvas zoom and clean unobstructed view", () => {
  const familyTree = read("components/FamilyTree.tsx");

  assert.match(
    familyTree,
    /const handleWheel = \(event: WheelEvent\) =>/,
    "FamilyTree must implement handleWheel for canvas zoom",
  );
  assert.match(
    familyTree,
    /TreeToolbar/,
    "FamilyTree must render TreeToolbar for controls",
  );
  assert.match(
    familyTree,
    /ViewTreePlane/,
    "FamilyTree must render ViewTreePlane for spacious canvas viewing",
  );
  assert.match(
    familyTree,
    /TreeCanvasTools/,
    "FamilyTree must render TreeCanvasTools",
  );
});

