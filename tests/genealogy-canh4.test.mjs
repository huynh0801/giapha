import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Cành 4 data schema and hierarchy integrity', () => {
  const p = path.join(process.cwd(), 'scripts', 'data', 'canh4-data.json');
  assert.ok(fs.existsSync(p), 'canh4-data.json must exist');

  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  assert.ok(Array.isArray(data) && data.length >= 20, 'Must contain at least 20 persons in Cành 4');

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
  const bau = refMap.get('7.127');
  assert.ok(bau, 'Trình Báu must exist');
  assert.equal(bau.birth_year, 1910);
  assert.equal(bau.death_year, 1981);
  assert.equal(bau.death_day, 28);
  assert.equal(bau.death_month, 12);
  assert.equal(bau.existing_id, '9e9579fe-bcba-4dcf-9537-114ce6501825');

  const phan = refMap.get('7.1271');
  assert.ok(phan, 'Trịnh Ngọc Phán must exist');
  assert.equal(phan.birth_year, 1938);
  assert.equal(phan.death_year, 1969);
  assert.equal(phan.death_month, 4);
  assert.equal(phan.death_day, 30);

  const phuc = refMap.get('7.12711');
  assert.ok(phuc, 'Trịnh Văn Phúc must exist');
  assert.equal(phuc.birth_year, 1965);
  assert.equal(phuc.death_year, 2002);

  const tuc = refMap.get('7.127112');
  assert.ok(tuc, 'Trịnh Văn Túc must exist');
  assert.equal(tuc.birth_year, 1989);

  // Check Gen 14 members
  const tu = refMap.get('7.1271121');
  assert.ok(tu, 'Trịnh Anh Tú must exist in Gen 14');
  assert.equal(tu.generation, 14);

  const toan = refMap.get('7.1271122');
  assert.ok(toan, 'Trịnh Đức Toàn must exist in Gen 14');
  assert.equal(toan.generation, 14);
});
