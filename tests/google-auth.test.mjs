import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf-8");
}

test("utils/supabase/client provides signInWithOAuth in fallback client", () => {
  const clientCode = read("utils/supabase/client.ts");
  assert.match(clientCode, /signInWithOAuth/);
  assert.match(clientCode, /Missing Supabase configuration/);
});

test("auth callback route exchanges code for session and handles security", () => {
  const callbackCode = read("app/auth/callback/route.ts");
  assert.match(callbackCode, /export async function GET/);
  assert.match(callbackCode, /exchangeCodeForSession/);
  assert.match(callbackCode, /getUser/);
  assert.match(callbackCode, /from\("profiles"\)/);
  assert.match(callbackCode, /is_active/);
  assert.match(callbackCode, /signOut/);
  assert.match(callbackCode, /account_locked/);
  assert.match(callbackCode, /avatar_url/);
  assert.match(callbackCode, /full_name/);
  assert.match(callbackCode, /user_metadata/);
});

test("auth callback route validates redirect target safely", () => {
  const callbackCode = read("app/auth/callback/route.ts");
  assert.match(callbackCode, /getSafeRedirectTarget/);
  assert.match(callbackCode, /startsWith\("\/"\)/);
  assert.match(callbackCode, /startsWith\("\/\/"\)/);
  assert.match(callbackCode, /includes\(":\/\/"\)/);
  assert.match(callbackCode, /startsWith\("\/login"\)/);
});
