import fs from 'node:fs';
import path from 'node:path';

function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}
loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const FAMILY_ID = 'a5eeaa60-c4e7-40f5-a867-91c17fe6a3c1';
const TREE_ID = '8fad59c0-1ea6-4cbb-9f20-26d36f23bd33';

async function fetchFromSupabase(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer || 'return=representation',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API error on ${endpoint} (${res.status}): ${errText}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function applyCanh3Data(dryRun = false) {
  console.log(`\n======================================================`);
  console.log(`🌿 CẬP NHẬT VÀ LÀM GIÀU DỮ LIỆU PHÁI NHÌ - CÀNH 3 🌿`);
  console.log(`Chế độ: ${dryRun ? 'DRY-RUN (Thử nghiệm)' : 'LIVE (Ghi vào CSDL)'}`);
  console.log(`======================================================\n`);

  const canh3Path = path.join(process.cwd(), 'scripts', 'data', 'canh3-data.json');
  const canh3List = JSON.parse(fs.readFileSync(canh3Path, 'utf8'));

  // 1. Fetch current persons in this family tree
  const existingPersons = await fetchFromSupabase(`persons?family_id=eq.${FAMILY_ID}&tree_id=eq.${TREE_ID}&select=*`);
  console.log(`✓ Đã tải ${existingPersons.length} thành viên hiện có trên hệ thống.`);

  const idMap = new Map();
  const nameGenMap = new Map();
  for (const p of existingPersons) {
    idMap.set(p.id, p);
    const key = `${p.full_name.trim().toLowerCase()}_gen${p.generation}`;
    nameGenMap.set(key, p);
  }

  const refToIdMap = new Map();
  let updatedCount = 0;
  let insertedCount = 0;

  for (const item of canh3List) {
    let matched = null;
    if (item.existing_id && idMap.has(item.existing_id)) {
      matched = idMap.get(item.existing_id);
    } else {
      const key = `${item.full_name.trim().toLowerCase()}_gen${item.generation}`;
      matched = nameGenMap.get(key);
    }

    if (matched) {
      refToIdMap.set(item.external_ref, matched.id);
      console.log(` ✏️ Cập nhật: [${item.external_ref}] ${item.full_name} (Đời ${item.generation}) -> ID: ${matched.id}`);
      if (!dryRun) {
        // Update person
        await fetchFromSupabase(`persons?id=eq.${matched.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            full_name: item.full_name,
            external_ref: item.external_ref,
            birth_year: item.birth_year,
            birth_month: item.birth_month,
            birth_day: item.birth_day,
            death_year: item.death_year,
            death_lunar_year: item.death_lunar_year,
            death_lunar_month: item.death_lunar_month,
            death_lunar_day: item.death_lunar_day,
            is_deceased: item.is_deceased,
            other_names: item.other_names,
            note: item.note,
          }),
        });

        // Upsert person_details_private
        await fetchFromSupabase(`person_details_private`, {
          method: 'POST',
          prefer: 'resolution=merge-duplicates',
          body: JSON.stringify({
            person_id: matched.id,
            family_id: FAMILY_ID,
            tree_id: TREE_ID,
            occupation: item.occupation || null,
            current_residence: item.current_residence || null,
            sensitive_note: item.note || null,
          }),
        });
      }
      updatedCount++;
    } else {
      console.log(` ➕ Thêm mới: [${item.external_ref}] ${item.full_name} (Đời ${item.generation})`);
      if (!dryRun) {
        const [newPerson] = await fetchFromSupabase(`persons`, {
          method: 'POST',
          body: JSON.stringify({
            family_id: FAMILY_ID,
            tree_id: TREE_ID,
            full_name: item.full_name,
            gender: item.gender,
            generation: item.generation,
            birth_order: item.birth_order,
            is_in_law: item.is_in_law,
            external_ref: item.external_ref,
            birth_year: item.birth_year,
            birth_month: item.birth_month,
            birth_day: item.birth_day,
            death_year: item.death_year,
            death_lunar_year: item.death_lunar_year,
            death_lunar_month: item.death_lunar_month,
            death_lunar_day: item.death_lunar_day,
            is_deceased: item.is_deceased,
            other_names: item.other_names,
            note: item.note,
            visibility: 'private',
          }),
        });
        refToIdMap.set(item.external_ref, newPerson.id);

        await fetchFromSupabase(`person_details_private`, {
          method: 'POST',
          body: JSON.stringify({
            person_id: newPerson.id,
            family_id: FAMILY_ID,
            tree_id: TREE_ID,
            occupation: item.occupation || null,
            current_residence: item.current_residence || null,
            sensitive_note: item.note || null,
          }),
        });
      }
      insertedCount++;
    }
  }

  // 2. Connect parent-child and marriage relationships
  console.log(`\n🔗 Đang thiết lập và kiểm tra các mối quan hệ (Relationships)...`);
  let relCount = 0;

  if (!dryRun) {
    const existingRels = await fetchFromSupabase(`relationships?family_id=eq.${FAMILY_ID}&tree_id=eq.${TREE_ID}&select=*`);
    const relKeySet = new Set(existingRels.map(r => `${r.person_a}_${r.person_b}_${r.type}`));

    // Parent-child relationships (each parent has children_refs)
    for (const item of canh3List) {
      const parentId = refToIdMap.get(item.external_ref);
      if (!parentId) continue;

      if (item.children_refs && item.children_refs.length > 0) {
        for (const childRef of item.children_refs) {
          const childId = refToIdMap.get(childRef);
          if (childId) {
            const relKey = `${parentId}_${childId}_biological_child`;
            if (!relKeySet.has(relKey)) {
              await fetchFromSupabase(`relationships`, {
                method: 'POST',
                body: JSON.stringify({
                  family_id: FAMILY_ID,
                  tree_id: TREE_ID,
                  person_a: parentId,
                  person_b: childId,
                  type: 'biological_child',
                  visibility: 'private',
                }),
              });
              relKeySet.add(relKey);
              relCount++;
            }
          }
        }
      }

      // Marriages: person_a = husband, person_b = wife
      if (item.spouses && item.spouses.length > 0 && !item.is_in_law) {
        for (const spouseRef of item.spouses) {
          const spouseId = refToIdMap.get(spouseRef);
          if (spouseId) {
            const husbandId = item.gender === 'male' ? parentId : spouseId;
            const wifeId = item.gender === 'female' ? parentId : spouseId;
            const relKey1 = `${husbandId}_${wifeId}_marriage`;
            const relKey2 = `${wifeId}_${husbandId}_marriage`;
            if (!relKeySet.has(relKey1) && !relKeySet.has(relKey2)) {
              await fetchFromSupabase(`relationships`, {
                method: 'POST',
                body: JSON.stringify({
                  family_id: FAMILY_ID,
                  tree_id: TREE_ID,
                  person_a: husbandId,
                  person_b: wifeId,
                  type: 'marriage',
                  visibility: 'private',
                }),
              });
              relKeySet.add(relKey1);
              relCount++;
            }
          }
        }
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`🎉 KẾT QUẢ CẬP NHẬT CÀNH 3:`);
  console.log(` - Thành viên cập nhật: ${updatedCount}`);
  console.log(` - Thành viên thêm mới: ${insertedCount}`);
  console.log(` - Mối quan hệ bổ sung: ${relCount}`);
  console.log(`======================================================\n`);
  return { updatedCount, insertedCount, relCount };
}

if (process.argv[1] && process.argv[1].endsWith('enrich-canh3.mjs')) {
  const isDryRun = process.argv.includes('--dry-run');
  applyCanh3Data(isDryRun).catch(err => {
    console.error('Lỗi thực thi:', err);
    process.exit(1);
  });
}
