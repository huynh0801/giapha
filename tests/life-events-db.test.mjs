import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("person life events migration contains required schema, year index, and RLS", () => {
  const migrationPath = path.join(root, "supabase/migrations/20261029160000_person_life_events.sql");
  assert.ok(fs.existsSync(migrationPath), "Migration file must exist");
  const sql = fs.readFileSync(migrationPath, "utf8");

  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.person_life_events/);
  assert.match(sql, /person_id UUID NOT NULL REFERENCES public\.persons\(id\) ON DELETE CASCADE/);
  assert.match(sql, /family_id UUID NOT NULL REFERENCES public\.families\(id\) ON DELETE CASCADE/);
  assert.match(sql, /year INT NOT NULL/);
  assert.match(sql, /title TEXT NOT NULL/);
  assert.match(sql, /content TEXT NOT NULL/);
  assert.match(sql, /image_url TEXT/);
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/);
});

test("types/index.ts exports PersonLifeEvent interface", () => {
  const typesPath = path.join(root, "types/index.ts");
  const content = fs.readFileSync(typesPath, "utf8");

  assert.match(content, /export interface PersonLifeEvent/);
});
