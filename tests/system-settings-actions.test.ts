import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath: string): string {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("system-settings server actions exist and follow security rules", () => {
  const actions = read("app/actions/system-settings.ts");

  assert.match(actions, /export\s+async\s+function\s+isFamilyApprovalRequired/);
  assert.match(actions, /export\s+async\s+function\s+toggleFamilyApprovalAction/);
  assert.match(actions, /system_admin/);
  assert.match(actions, /revalidatePath\("\/admin\/families"\)/);
  assert.match(actions, /revalidatePath\("\/dashboard"\)/);
});

test("family-request action handles both approval-required and direct-creation flows", () => {
  const actions = read("app/actions/family-request.ts");

  assert.match(actions, /isFamilyApprovalRequired/);
  assert.match(actions, /create_family_direct/);
  assert.match(actions, /redirectUrl/);
});
