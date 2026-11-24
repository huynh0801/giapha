import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("migration creates system_settings table with RLS and create_family_direct RPC", () => {
  const migration = read("supabase/migrations/20261124120000_system_settings_and_direct_family_creation.sql");

  // Table system_settings
  assert.match(migration, /CREATE TABLE IF NOT EXISTS public\.system_settings/);
  assert.match(migration, /key TEXT PRIMARY KEY/);
  assert.match(migration, /value JSONB NOT NULL DEFAULT/);
  assert.match(migration, /family_approval_required/);

  // RLS
  assert.match(migration, /ALTER TABLE public\.system_settings ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /CREATE POLICY "Allow authenticated read system_settings"/);
  assert.match(migration, /CREATE POLICY "Only system admin can update system_settings"/);

  // Atomic direct creation RPC
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.create_family_direct/);
  assert.match(migration, /SECURITY DEFINER/);
  assert.match(migration, /INSERT INTO public\.families/);
  assert.match(migration, /INSERT INTO public\.family_trees/);
  assert.match(migration, /INSERT INTO public\.family_memberships/);
  assert.match(migration, /INSERT INTO public\.family_creation_requests/);
  assert.match(migration, /is_primary_admin/);
});
