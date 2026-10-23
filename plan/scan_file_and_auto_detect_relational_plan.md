# Plan: Scan File And Auto Detect Relational Genealogy Import

## 1. Goal

Build a smart genealogy import and synchronization system for the current app.

The system must:

- Treat `relationships` as the source of truth.
- Automatically compute `persons.generation`, `persons.is_in_law`, and safe `birth_order` suggestions from relationships.
- Update directly related people when a person or relationship changes.
- Import messy Excel files through scan, auto-detect, manual mapping, preview, validation, and apply.
- Avoid requiring users to follow one strict Excel template, while still offering a recommended template.

Current repo facts:

- `persons` stores `generation`, `birth_order`, `is_in_law`.
- `relationships` stores `marriage`, `biological_child`, `adopted_child`, `step_child`, `foster_child`.
- `LineageManager` currently computes lineage in the client.
- `MemberForm` and `RelationshipManager` currently write directly from client Supabase in several places.
- `DataImportExport` currently restores JSON/GEDCOM/CSV ZIP and replaces all tree data.

## 2. Core Decisions

- `relationships` is canonical. `generation`, `is_in_law`, and most relationship labels are derived from the graph.
- Excel import default mode is merge/upsert with preview. Do not delete the existing tree.
- Keep restore/replace behavior only for backup restore files, not normal Excel import.
- Excel import uses a custom wizard, not a rigid one-shot parser.
- Use SheetJS CE (`xlsx`) for parsing workbook data because it can expose raw worksheet rows for irregular spreadsheets.
- Do not use `read-excel-file` as the main parser because schema-based parsing is too strict for messy genealogy files.
- Do not adopt `react-spreadsheet-import` directly because it brings unrelated UI dependencies; copy its workflow idea only: upload, map, validate, preview, apply.

References:

- SheetJS import examples: https://docs.sheetjs.com/docs/getting-started/examples/import/
- ExcelJS repo: https://github.com/exceljs/exceljs
- read-excel-file repo: https://github.com/catamphetamine/read-excel-file
- react-spreadsheet-import repo: https://github.com/UgnisSoftware/react-spreadsheet-import

## 3. Data Model Changes

Add a migration:

```sql
ALTER TABLE public.persons
ADD COLUMN IF NOT EXISTS external_ref text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_persons_tree_external_ref
ON public.persons(tree_id, external_ref)
WHERE external_ref IS NOT NULL AND external_ref <> '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_relationships_tree_marriage_pair
ON public.relationships (
  tree_id,
  LEAST(person_a, person_b),
  GREATEST(person_a, person_b),
  type
)
WHERE type = 'marriage';
```

Update types:

- Add `external_ref?: string | null` to `Person`.
- Include `external_ref` in export/import payloads.

Important:

- Keep existing `UNIQUE (tree_id, person_a, person_b, type)`.
- The new marriage index prevents duplicate marriage when user imports or adds the pair in reverse order.
- Child relationships remain directional: `person_a = parent`, `person_b = child`.

## 4. Genealogy Engine

Create `utils/genealogyEngine.ts`.

Export these types:

```ts
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
```

Export these functions:

```ts
export function computeGenealogyState(params: {
  persons: Person[];
  relationships: Relationship[];
  rootPersonId?: string | null;
}): GenealogyComputationResult;

export function validateRelationshipGraph(params: {
  persons: Person[];
  relationships: Relationship[];
}): GenealogyIssue[];
```

Relationship rules:

- Child relationship types are:
  - `biological_child`
  - `adopted_child`
  - `step_child`
  - `foster_child`
- For generation calculation:
  - Root generation is `1`.
  - Child = parent generation + 1.
  - Spouse = same generation.
  - If multiple parents imply different generations, report `generation_conflict` error.
  - If no explicit root exists, choose roots as people with no parent relationship in the current tree.
  - If the tree has `family_trees.root_person_id`, prefer it as the first root and still support disconnected components.
- For disconnected components:
  - Compute each component independently.
  - Roots in disconnected components also start at `1`.
  - Emit `disconnected_component` warning unless the component has only an isolated person.
- For `is_in_law`:
  - Any person with at least one parent relationship in this tree is bloodline, `false`.
  - A spouse of a bloodline person with no parent relationship in this tree is in-law, `true`.
  - Root couples with no parents are ambiguous. Prefer the person already marked `is_in_law=false`; if both equal, prefer male as bloodline and warn `ambiguous_root_couple`.
  - Never mark a person as in-law if they are an ancestor/descendant through child relationships.
- For `birth_order`:
  - Preserve existing explicit value if it does not conflict.
  - For children under the same parent pair, suggest order by `birth_year`, then full date if available, then existing `birth_order`, then name.
  - If a child appears under both father and mother, compute one sibling group from the parent set, not two independent orders.
  - If there is insufficient birth data and no existing order, leave null and warn `birth_order_unknown`.

Validation rules:

- Error on self relationship.
- Error on parent-child cycle.
- Error if relationship references missing person.
- Error on duplicate child relation with same parent/child/type.
- Error on duplicate marriage pair in either direction.
- Warning if a person has more than two biological/adopted parents.
- Warning if parent and child birth years are impossible when both exist.
- Warning if spouse generations cannot be reconciled.

Implementation notes:

- Use adjacency maps:
  - `personById`
  - `parentsByChildId`
  - `childrenByParentId`
  - `spousesByPersonId`
- Use BFS/queue for generation propagation.
- Use DFS color states for cycle detection.
- Return all issues, not only the first issue.
- The engine must be pure and must not call Supabase.

## 5. Server Actions

Create `app/actions/genealogy.ts`.

Actions:

```ts
export async function previewLineageSyncAction(formData: FormData)
export async function applyLineageSyncAction(formData: FormData)
export async function createOrUpdateRelationshipAction(formData: FormData)
export async function deleteRelationshipAction(formData: FormData)
export async function saveMemberProfileAction(formData: FormData)
```

Shared behavior:

- Require `family_id` and `tree_id`.
- Use `getFamilyContextById(familyId, treeId)`.
- Reject if `!context?.canEdit`.
- Always scope reads/writes by `context.family.id` and `context.tree.id`.
- After any relationship/person write, load all persons and relationships for the tree, run `computeGenealogyState`, and apply non-error updates.
- Revalidate:
  - `/dashboard/${familySlug}`
  - `/dashboard/${familySlug}/members`
  - `/dashboard/${familySlug}/lineage`
  - `/dashboard/${familySlug}/stats`
  - `/dashboard/${familySlug}/kinship`

`previewLineageSyncAction`:

- Read all persons and relationships for the tree.
- Run `computeGenealogyState`.
- Return updates and issues only. Do not write.

`applyLineageSyncAction`:

- Read all persons and relationships.
- Run `computeGenealogyState`.
- If any error issue exists, do not write.
- Update only changed persons.
- Chunk updates by 50 rows.

`createOrUpdateRelationshipAction`:

- Accept:
  - `relationship_id` optional
  - `type`
  - `person_a`
  - `person_b`
  - `note`
- Normalize marriage pair order before insert/update:
  - store smaller UUID in `person_a`, larger UUID in `person_b` for marriage only.
- For child relationships, preserve direction.
- Validate with existing relationships plus proposed relation before writing.
- If validation has error, return errors.
- Write relationship.
- Sync lineage.

`deleteRelationshipAction`:

- Delete relationship by id scoped by family/tree.
- Sync lineage after delete.

`saveMemberProfileAction`:

- Move current `MemberForm` direct Supabase write into this server action.
- Save normal person fields and private fields.
- Do not trust client-provided `generation` or `is_in_law` as final.
- After save, run lineage sync.
- Keep avatar upload on client for now unless implementation decides to move it later; if keeping client upload, action accepts final `avatar_url`.

Update existing code:

- `createTreeQuickMemberAction` should call the shared sync after inserting person/relationships.
- `RelationshipManager` should stop direct insert/update/delete to `persons` and `relationships`; call server actions.
- `LineageManager` should call `previewLineageSyncAction` and `applyLineageSyncAction`.

## 6. Excel Import Architecture

Create files:

- `utils/excelImport/types.ts`
- `utils/excelImport/parseWorkbook.ts`
- `utils/excelImport/detectColumns.ts`
- `utils/excelImport/buildImportPlan.ts`
- `app/actions/excel-import.ts`
- `components/ExcelImportWizard.tsx`

Install dependency:

```bash
npm install xlsx
```

Types:

```ts
export interface ParsedWorkbook {
  sheets: ParsedSheet[];
}

export interface ParsedSheet {
  name: string;
  rows: unknown[][];
  detectedHeaderRowIndex: number | null;
  candidates: HeaderCandidate[];
}

export interface HeaderCandidate {
  rowIndex: number;
  confidence: number;
  mappedColumns: Record<ImportField, number>;
}

export type ImportField =
  | "person_key"
  | "full_name"
  | "gender"
  | "father_key"
  | "mother_key"
  | "spouse_keys"
  | "birth_order"
  | "generation"
  | "birth_year"
  | "birth_month"
  | "birth_day"
  | "death_year"
  | "death_month"
  | "death_day"
  | "other_names"
  | "note"
  | "phone_number"
  | "occupation"
  | "current_residence"
  | "is_root";

export interface ImportMapping {
  sheetName: string;
  headerRowIndex: number;
  columns: Partial<Record<ImportField, number>>;
}

export interface ImportPreview {
  personsToCreate: number;
  personsToUpdate: number;
  relationshipsToCreate: number;
  relationshipsSkipped: number;
  lineageUpdates: ComputedPersonLineage[];
  rows: ImportPreviewRow[];
  issues: GenealogyIssue[];
}
```

Parsing:

- Client reads uploaded file as `ArrayBuffer`.
- Use `xlsx.read(arrayBuffer, { type: "array", cellDates: true })`.
- For each sheet, use `XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" })`.
- Remove fully empty trailing rows.
- Keep original row numbers for error reporting.

Auto-detect header:

- Scan first 30 rows of each sheet.
- Normalize each cell:
  - trim
  - lowercase
  - remove Vietnamese accents
  - replace punctuation with spaces
  - collapse spaces
- Score each row by matching known synonyms.
- Header row requires at least a likely name column.
- Prefer rows with name + parent/spouse/key columns.

Synonym map:

- `person_key`: `ma`, `ma nguoi`, `id`, `code`, `person id`, `person key`, `stt`
- `full_name`: `ho ten`, `ten`, `name`, `full name`, `thanh vien`, `nguoi`
- `gender`: `gioi tinh`, `sex`, `gender`, `nam nu`
- `father_key`: `cha`, `bo`, `father`, `father id`, `ma cha`
- `mother_key`: `me`, `mother`, `mother id`, `ma me`
- `spouse_keys`: `vo chong`, `chong vo`, `spouse`, `husband`, `wife`, `ma vo chong`
- `birth_order`: `thu tu sinh`, `con thu`, `birth order`, `order`
- `generation`: `doi`, `doi thu`, `the he`, `generation`
- `birth_year`: `nam sinh`, `birth year`, `year of birth`
- `birth_month`: `thang sinh`, `birth month`
- `birth_day`: `ngay sinh`, `birth day`
- `death_year`: `nam mat`, `nam mat`, `death year`
- `note`: `ghi chu`, `note`, `remark`

Manual mapping:

- If confidence is below 0.75, show mapping step.
- Admin can choose:
  - sheet
  - header row
  - field-to-column mapping
- Required minimum:
  - `full_name`
- Strongly recommended:
  - `person_key`
- If `person_key` is missing:
  - generate a temporary key from row number for this import only.
  - matching existing persons becomes fuzzy and must be previewed as uncertain.

## 7. Excel Import Matching And Relationship Detection

Create `buildImportPlan(params)`.

Inputs:

- existing persons in tree
- existing relationships in tree
- parsed rows
- mapping

Person matching priority:

1. `external_ref === person_key`
2. exact normalized full name + birth year
3. exact normalized full name only, if unique in existing tree
4. otherwise create new person and warn `possible_duplicate`

Person payload:

- `external_ref = person_key` when provided.
- `full_name` from mapped full_name.
- `gender` normalized:
  - `nam`, `male`, `m` => `male`
  - `nu`, `nữ`, `female`, `f` => `female`
  - otherwise `other`
- Date fields parse numbers safely.
- `generation` from Excel is not trusted as final. Use only as warning comparison after computed lineage.

Relationship detection from one sheet:

- `father_key` creates `biological_child` father -> child.
- `mother_key` creates `biological_child` mother -> child.
- `spouse_keys` can contain multiple values separated by comma, semicolon, slash, newline, `|`.
- Spouse relation creates `marriage`.
- Skip relationship if referenced key cannot be resolved; issue `missing_related_person`.
- Skip duplicate relationship already in DB or already planned.
- For marriage, normalize pair order before compare.

Handling file not in expected format:

- If no header is detected, allow admin to choose header row manually.
- If no `person_key`, still import persons by name, but relationship columns using parent/spouse names are not accepted unless unique.
- If parent/spouse cell contains a name instead of key:
  - resolve if exactly one row/person has the normalized name.
  - if multiple matches, warning/error `ambiguous_reference`.
- If merged cells or group headers appear, parser should ignore rows with no full_name.
- If a row has full_name but no relationship columns, import as standalone person and warn `isolated_person`.

Apply behavior:

- `previewExcelImportAction` returns a full import preview and does not write.
- `applyExcelImportAction` repeats validation server-side from the posted normalized import rows.
- If error issues exist, do not write.
- Upsert persons first.
- Insert relationships second.
- Run `computeGenealogyState`.
- Apply lineage updates.
- Return counts and warnings.

Important security:

- Do not trust client preview as final.
- Server action must recompute matching, relationships, validation, and lineage.

## 8. Excel Import Wizard UI

Replace or extend `DataImportExport` import area.

Wizard steps:

1. Upload file
   - Accept `.xlsx`, `.xls`, `.csv`.
   - Keep JSON/GEDCOM/ZIP restore separate.
2. Scan result
   - Show detected sheets.
   - Highlight selected sheet and detected header row.
   - Show confidence score.
3. Mapping
   - Show field list and dropdown of columns.
   - Auto-filled mapping can be edited.
   - Required `full_name` must be mapped before preview.
4. Preview
   - Counts: create/update/person skipped/relationships created/warnings/errors.
   - Table row-level status.
   - Show lineage updates from genealogy engine.
   - Disable apply if errors exist.
5. Apply
   - Run server action.
   - Show final counts.
   - Refresh dashboard data.

UX rules:

- Always provide a downloadable template.
- Never write to DB during scan/mapping/preview.
- Errors are blocking; warnings are visible but allow apply.
- Keep restore warning for JSON/GEDCOM/ZIP replacement behavior.
- Label Excel import as "Nhập Excel bổ sung/cập nhật", not "Phục hồi".

## 9. Existing Feature Changes

`MemberForm`:

- Remove editable final `generation` and `is_in_law`, or convert to read-only computed display.
- Keep `birth_order` editable because family order can be known better than birth year.
- Submit through `saveMemberProfileAction`.

`LineageManager`:

- Remove duplicated client computation functions.
- Call server preview/apply.
- Display issues from genealogy engine.

`RelationshipManager`:

- Replace direct Supabase writes for relationship create/delete with server actions.
- Remove local partial auto-update logic for target generation/is_in_law.
- After action success, refresh current relationships and router.

`TreeQuickAddDialog` / `createTreeQuickMemberAction`:

- Keep quick add UX.
- Server action inserts person and relationships, then runs lineage sync.
- If lineage sync returns warnings, do not block creation; surface warning if convenient.

`DataImportExport`:

- Keep backup export.
- Keep restore import for `.json`, `.ged`, `.zip`.
- Add Excel import wizard for `.xlsx`, `.xls`, `.csv` merge mode.

## 10. Implementation Order

1. Add migration and update `types/index.ts`.
2. Build `utils/genealogyEngine.ts` with unit tests.
3. Add `app/actions/genealogy.ts`.
4. Refactor `LineageManager` to server preview/apply.
5. Refactor `RelationshipManager` and `MemberForm` away from direct Supabase writes.
6. Add `xlsx` dependency.
7. Build Excel parser and auto-detect utilities.
8. Build server preview/apply actions for Excel import.
9. Build `ExcelImportWizard` and mount it in `DataImportExport`.
10. Add tests and run lint/build.

## 11. Test Plan

Add tests under `tests/` or a new test file.

Genealogy engine tests:

- root + spouse + child computes generations 1, 1, 2.
- grandchild computes generation 3.
- spouse of bloodline without parents becomes `is_in_law=true`.
- child of in-law and bloodline is not in-law.
- parent-child cycle returns blocking error.
- duplicate marriage reversed returns blocking error.
- conflicting parent generations returns blocking error.
- disconnected component computes separately and warns.

Excel detection tests:

- Detect Vietnamese headers: `Mã`, `Họ tên`, `Cha`, `Mẹ`, `Vợ/Chồng`.
- Detect English headers: `Person ID`, `Full Name`, `Father`, `Mother`, `Spouse`.
- Low-confidence sheet requires manual mapping.
- Rows without name are skipped with warning.
- Parent/spouse reference by name resolves only if unique.
- Import preview is idempotent when same file is imported twice.

Integration/static tests:

- `LineageManager` uses server actions, not client direct `.from("persons").update`.
- `RelationshipManager` does not directly insert/delete `relationships`.
- Excel import action does not delete all current `persons`.

Manual acceptance:

- Add spouse to a bloodline person and confirm spouse generation updates to same đời.
- Add child and confirm child generation is parent đời + 1.
- Edit/delete relationship and confirm affected people recompute.
- Import messy Excel with renamed columns after mapping and confirm preview before apply.
- Re-import the same file and confirm no duplicate persons or marriages.

## 12. Rollout And Safety

- Keep existing backup restore path unchanged.
- Excel import merge mode must be opt-in and preview-first.
- Do not delete existing tree data from Excel import.
- If lineage sync finds blocking errors after normal UI edits, keep the relationship write from happening.
- If lineage sync finds warnings only, allow the write and show warnings.
- If migration fails because duplicate reversed marriages already exist, write a cleanup query before creating the unique index.

Cleanup query for duplicate reversed marriages if needed:

```sql
WITH ranked AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY tree_id, LEAST(person_a, person_b), GREATEST(person_a, person_b), type
      ORDER BY created_at ASC, id ASC
    ) AS rn
  FROM public.relationships
  WHERE type = 'marriage'
)
DELETE FROM public.relationships r
USING ranked
WHERE r.id = ranked.id
  AND ranked.rn > 1;
```

## 13. Definition Of Done

- All person/relationship write paths sync lineage through server logic.
- `LineageManager` preview matches actual apply result.
- Excel import handles non-standard headers via auto-detect or manual mapping.
- Excel import never writes without preview.
- Excel import merge/upsert is idempotent.
- Blocking graph/import issues prevent writes.
- Warnings are visible and do not silently disappear.
- `npm run lint`, `npm run test`, and `npm run build` pass.
