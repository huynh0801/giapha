import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Cành 3 data schema and hierarchy integrity', () => {
  const p = path.join(process.cwd(), 'scripts', 'data', 'canh3-data.json');
  assert.ok(fs.existsSync(p), 'canh3-data.json must exist');

  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  assert.ok(Array.isArray(data) && data.length >= 40, 'Must contain at least 40 persons in Cành 3');

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
  const khau = refMap.get('7.124');
  assert.ok(khau, 'Trình Kháu must exist');
  assert.equal(khau.birth_year, 1905);
  assert.equal(khau.death_lunar_day, 6);
  assert.equal(khau.death_lunar_month, 1);
  assert.equal(khau.existing_id, 'a4eba12d-3c14-4e28-842f-f1b1cf151b20');

  const phao = refMap.get('7.1242');
  assert.ok(phao, 'Trịnh Pháo must exist');
  assert.equal(phao.birth_year, 1933);
  assert.equal(phao.death_year, 2007);
  assert.equal(phao.death_day, 21);
  assert.equal(phao.death_month, 1);

  const cho = refMap.get('7.1244');
  assert.ok(cho, 'Trịnh Văn Chò must exist');
  assert.equal(cho.birth_year, 1941);
  assert.equal(cho.death_year, 2020);
  assert.equal(cho.death_lunar_day, 5);
  assert.equal(cho.death_lunar_month, 12);

  const hao = refMap.get('7.12421');
  assert.ok(hao, 'Trịnh Minh Hảo must exist');
  assert.equal(hao.birth_year, 1956);
  assert.equal(hao.birth_month, 2);
  assert.equal(hao.birth_day, 10);

  const hop = refMap.get('7.124211');
  assert.ok(hop, 'Trịnh Minh Hợp must exist');
  assert.equal(hop.birth_year, 1978);
  assert.equal(hop.birth_month, 9);
  assert.equal(hop.birth_day, 10);

  const hung = refMap.get('7.124214');
  assert.ok(hung, 'Trịnh Minh Hùng must exist');
  assert.equal(hung.birth_year, 1984);
  assert.equal(hung.birth_month, 10);
  assert.equal(hung.birth_day, 27);

  // Check Gen 14 members
  const ngan = refMap.get('7.1242141');
  assert.ok(ngan, 'Trịnh Ngọc Minh Ngân must exist in Gen 14');
  assert.equal(ngan.generation, 14);

  const quan = refMap.get('7.1242143');
  assert.ok(quan, 'Trịnh Minh Tuấn Quang must exist in Gen 14');
  assert.equal(quan.generation, 14);

  const tuan = refMap.get('7.1242113');
  assert.ok(tuan, 'Trịnh Tuấn must exist in Gen 14');
  assert.equal(tuan.generation, 14);
});
