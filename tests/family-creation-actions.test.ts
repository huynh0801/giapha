import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath: string) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("family-request server actions export required methods with validation and multi-tenant security", () => {
  const actions = read("app/actions/family-request.ts");

  // Exported server actions
  assert.match(actions, /export\s+async\s+function\s+requestFamilyCreationAction/);
  assert.match(actions, /export\s+async\s+function\s+cancelFamilyCreationAction/);
  assert.match(actions, /export\s+async\s+function\s+approveFamilyCreationAction/);
  assert.match(actions, /export\s+async\s+function\s+rejectFamilyCreationAction/);
  assert.match(actions, /export\s+async\s+function\s+getUserActiveFamilyCreationRequest/);
  assert.match(actions, /export\s+async\s+function\s+getAdminFamilyCreationRequests/);

  // Security and auth guards
  assert.match(actions, /getProfile/);
  assert.match(actions, /is_active/);
  assert.match(actions, /system_admin/);
  assert.doesNotMatch(actions, /@supabase\/supabase-js/);

  // Validation
  assert.match(actions, /Tên dòng họ/);
  assert.match(actions, /phoneContact|Số điện thoại/);
  assert.match(actions, /revalidatePath\("\/dashboard"\)/);
  assert.match(actions, /revalidatePath\("\/admin\/families"\)/);
});
