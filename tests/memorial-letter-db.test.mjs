import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("memorial letter database migration contains required schema, constraints, and RLS", () => {
  const migrationPath = path.join(root, "supabase/migrations/20261029150000_person_memorial_letters.sql");
  assert.ok(fs.existsSync(migrationPath), "Migration file must exist");
  const sql = fs.readFileSync(migrationPath, "utf8");

  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.person_memorial_letters/);
  assert.match(sql, /person_id UUID NOT NULL REFERENCES public\.persons\(id\) ON DELETE CASCADE/);
  assert.match(sql, /family_id UUID NOT NULL REFERENCES public\.families\(id\) ON DELETE CASCADE/);
  assert.match(sql, /tree_id UUID NOT NULL REFERENCES public\.family_trees\(id\) ON DELETE CASCADE/);
  assert.match(sql, /title TEXT NOT NULL/);
  assert.match(sql, /content TEXT NOT NULL/);
  assert.match(sql, /author_type TEXT NOT NULL/);
  assert.match(sql, /author_name TEXT NOT NULL/);
  assert.match(sql, /author_relationship TEXT/);
  assert.match(sql, /CONSTRAINT uq_person_memorial_letter UNIQUE \(person_id\)/);
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/);
});

test("types/index.ts exports PersonMemorialLetter interface", () => {
  const typesPath = path.join(root, "types/index.ts");
  const content = fs.readFileSync(typesPath, "utf8");

  assert.match(content, /export type MemorialAuthorType/);
  assert.match(content, /export interface PersonMemorialLetter/);
});
