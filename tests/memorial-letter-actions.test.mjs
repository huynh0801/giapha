import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("memorial-letter server action file exports required actions and security guards", () => {
  const actionsPath = path.join(root, "app/actions/memorial-letter.ts");
  assert.ok(fs.existsSync(actionsPath), "memorial-letter.ts must exist");
  const code = fs.readFileSync(actionsPath, "utf8");

  assert.match(code, /"use server"/);
  assert.match(code, /export async function getMemorialLetterAction/);
  assert.match(code, /export async function saveMemorialLetterAction/);
  assert.match(code, /export async function deleteMemorialLetterAction/);
  assert.match(code, /getUser\(\)/);
  assert.match(code, /revalidatePath/);
  assert.match(code, /person_memorial_letters/);
});
