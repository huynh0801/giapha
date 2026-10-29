import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("PersonLifeTimeline component contains timeline elements and empty state", () => {
  const compPath = path.join(root, "components/dashboard/PersonLifeTimeline.tsx");
  assert.ok(fs.existsSync(compPath), "PersonLifeTimeline.tsx must exist");
  const code = fs.readFileSync(compPath, "utf8");

  assert.match(code, /"use client"/);
  assert.match(code, /PersonLifeTimeline/);
  assert.match(code, /PersonLifeEventModal/);
  assert.match(code, /Niên biểu|Nhật ký/);
  assert.match(code, /Thêm mốc năm|Ghi chép/);
});

test("PersonLifeEventModal component contains inputs for year, title, content and image", () => {
  const modalPath = path.join(root, "components/dashboard/PersonLifeEventModal.tsx");
  assert.ok(fs.existsSync(modalPath), "PersonLifeEventModal.tsx must exist");
  const code = fs.readFileSync(modalPath, "utf8");

  assert.match(code, /"use client"/);
  assert.match(code, /PersonLifeEventModal/);
  assert.match(code, /savePersonLifeEventAction/);
  assert.match(code, /year/);
  assert.match(code, /title/);
  assert.match(code, /content/);
});
