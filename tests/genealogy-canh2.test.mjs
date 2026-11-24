import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Cành 2 data schema and hierarchy integrity', () => {
  const p = path.join(process.cwd(), 'scripts', 'data', 'canh2-data.json');
  assert.ok(fs.existsSync(p), 'canh2-data.json must exist');

  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  assert.ok(Array.isArray(data) && data.length >= 40, 'Must contain at least 40 persons in Cành 2');

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

  // Check key individuals
  const quyen = refMap.get('7.122');
  assert.ok(quyen, 'Trình Quyến must exist');
  assert.equal(quyen.birth_year, 1901);
  assert.equal(quyen.death_year, 1937);

  const buoi = refMap.get('7.1221');
  assert.ok(buoi, 'Trình Buồi must exist');
  assert.equal(buoi.birth_year, 1927);
  assert.equal(buoi.death_year, 2013);

  const ninh = refMap.get('7.1222');
  assert.ok(ninh, 'Trình Ninh must exist');
  assert.equal(ninh.birth_year, 1933);

  const van = refMap.get('7.12212');
  assert.ok(van, 'Trịnh Ngọc Văn must exist');
  assert.equal(van.birth_year, 1956);
  assert.equal(van.birth_month, 7);
  assert.equal(van.birth_day, 10);

  // Check Gen 14 members
  const kim = refMap.get('7.1221211');
  assert.ok(kim, 'Trịnh Hoàng Kim must exist in Gen 14');
  assert.equal(kim.generation, 14);

  const trung = refMap.get('7.1221212');
  assert.ok(trung, 'Trịnh Hoàng Trung must exist in Gen 14');
  assert.equal(trung.generation, 14);

  const vu = refMap.get('7.1221411');
  assert.ok(vu, 'Trịnh Đỗ Huy Vũ must exist in Gen 14');
  assert.equal(vu.generation, 14);
  assert.equal(vu.birth_year, 2020);
});
