import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Cành 1 data schema and hierarchy integrity', () => {
  const p = path.join(process.cwd(), 'scripts', 'data', 'canh1-data.json');
  assert.ok(fs.existsSync(p), 'canh1-data.json must exist');

  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  assert.ok(Array.isArray(data) && data.length >= 35, 'Must contain at least 35 persons in Cành 1');

  const refMap = new Map();
  for (const person of data) {
    assert.ok(person.full_name, 'Name must not be empty');
    assert.ok(['male', 'female'].includes(person.gender), `Invalid gender for ${person.full_name}`);
    assert.ok(person.generation >= 10 && person.generation <= 14, `Generation out of range: ${person.generation}`);

    if (person.birth_month !== null) {
      assert.ok(person.birth_month >= 1 && person.birth_month <= 12, `Invalid birth month for ${person.full_name}`);
    }
    if (person.birth_day !== null) {
      assert.ok(person.birth_day >= 1 && person.birth_day <= 31, `Invalid birth day for ${person.full_name}`);
    }

    refMap.set(person.external_ref, person);
  }

  // Check parent-child hierarchy
  for (const person of data) {
    if (person.parent_ref) {
      const parent = refMap.get(person.parent_ref);
      assert.ok(parent, `Parent ${person.parent_ref} must exist for ${person.full_name}`);
      assert.equal(person.generation, parent.generation + 1, `Generation of ${person.full_name} must be parent + 1`);
    }
  }

  // Check that root Cụ Trình Luyến and Trình Thị The exist
  const luyen = refMap.get('7.121');
  assert.ok(luyen, 'Cụ Trình Luyến must exist');
  assert.equal(luyen.birth_year, 1899);

  const xinh = refMap.get('7.1211');
  assert.ok(xinh, 'Cụ Trình Xinh must exist');
  assert.equal(xinh.birth_year, 1936);

  const thinh = refMap.get('7.1212');
  assert.ok(thinh, 'Cụ Trình Văn Thính must exist');
  assert.equal(thinh.birth_year, 1942);
});
