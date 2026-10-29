import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("MemorialLetterCard component contains heritage styling and state handling", () => {
  const cardPath = path.join(root, "components/dashboard/MemorialLetterCard.tsx");
  assert.ok(fs.existsSync(cardPath), "MemorialLetterCard.tsx must exist");
  const code = fs.readFileSync(cardPath, "utf8");

  assert.match(code, /"use client"/);
  assert.match(code, /MemorialLetterCard/);
  assert.match(code, /MemorialLetterModal/);
  assert.match(code, /Tâm thư|Lời dặn dò/);
  assert.match(code, /Người chấp bút|Tác giả/);
});

test("MemorialLetterModal component contains form inputs for title, author and content", () => {
  const modalPath = path.join(root, "components/dashboard/MemorialLetterModal.tsx");
  assert.ok(fs.existsSync(modalPath), "MemorialLetterModal.tsx must exist");
  const code = fs.readFileSync(modalPath, "utf8");

  assert.match(code, /"use client"/);
  assert.match(code, /MemorialLetterModal/);
  assert.match(code, /saveMemorialLetterAction/);
  assert.match(code, /author_type|authorType/);
  assert.match(code, /author_name|authorName/);
  assert.match(code, /author_relationship|authorRelationship/);
});
