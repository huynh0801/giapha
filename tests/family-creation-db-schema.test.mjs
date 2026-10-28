import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("migration creates family_creation_requests table with RLS and atomic approval RPC", () => {
  const migration = read("supabase/migrations/20261028140000_family_creation_requests.sql");

  // Table definition
  assert.match(migration, /CREATE TABLE IF NOT EXISTS public\.family_creation_requests/);
  assert.match(migration, /user_id UUID NOT NULL REFERENCES public\.profiles\(id\)/);
  assert.match(migration, /family_name TEXT NOT NULL/);
  assert.match(migration, /phone_contact TEXT NOT NULL/);
  assert.match(migration, /status TEXT NOT NULL DEFAULT 'pending'/);
  assert.match(migration, /approved_family_id UUID REFERENCES public\.families\(id\)/);

  // RLS enablement and policies
  assert.match(migration, /ALTER TABLE public\.family_creation_requests ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /CREATE POLICY[\s\S]*ON public\.family_creation_requests/);

  // Atomic approval RPC
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.approve_family_creation_request/);
  assert.match(migration, /SECURITY DEFINER/);
  assert.match(migration, /INSERT INTO public\.families/);
  assert.match(migration, /INSERT INTO public\.family_members/);
  assert.match(migration, /is_primary_admin/);

  // Rejection RPC
  assert.match(migration, /CREATE OR REPLACE FUNCTION public\.reject_family_creation_request/);
});
