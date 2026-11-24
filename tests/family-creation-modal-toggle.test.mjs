import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), "utf-8");
}

test("CreateFamilyRequestModal supports approvalRequired prop and handles redirectUrl", () => {
  const modal = read("components/dashboard/CreateFamilyRequestModal.tsx");

  assert.match(modal, /approvalRequired/);
  assert.match(modal, /result\.redirectUrl/);
  assert.match(modal, /router\.push/);
});

test("Dashboard page fetches approval setting and passes to CreateFamilyRequestModal", () => {
  const page = read("app/dashboard/page.tsx");

  assert.match(page, /isFamilyApprovalRequired/);
  assert.match(page, /approvalRequired=/);
});
