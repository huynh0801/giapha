import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("life-events server action file exports required actions and security guards", () => {
  const actionsPath = path.join(root, "app/actions/life-events.ts");
  assert.ok(fs.existsSync(actionsPath), "life-events.ts must exist");
  const code = fs.readFileSync(actionsPath, "utf8");

  assert.match(code, /"use server"/);
  assert.match(code, /export async function getPersonLifeEventsAction/);
  assert.match(code, /export async function savePersonLifeEventAction/);
  assert.match(code, /export async function deletePersonLifeEventAction/);
  assert.match(code, /getUser\(\)/);
  assert.match(code, /revalidatePath/);
  assert.match(code, /person_life_events/);
});
