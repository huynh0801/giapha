import fs from 'node:fs';
import path from 'node:path';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!SUPABASE_URL) {
  console.error("Missing SUPABASE_URL");
  process.exit(1);
}
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
if (!SUPABASE_KEY) {
  console.error("Missing SUPABASE_KEY");
  process.exit(1);
}
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234';

const backupDir = path.join(process.cwd(), 'backups', 'backup-2026-10-22T05-42-15');

function readJson(filename) {
  const p = path.join(backupDir, filename);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

async function loginAdmin() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  const data = await res.json();
  return data.access_token;
}

async function restoreDiepDungAndBlogs() {
  const token = await loginAdmin();
  console.log('Logged in as admin.');

  // Find Diệp Dụng on server
  const famRes = await fetch(`${SUPABASE_URL}/rest/v1/families?name=ilike.*Diệp Dụng*&select=id,name`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  });
  const fams = await famRes.json();
  const newFamId = fams[0].id;

  const treeRes = await fetch(`${SUPABASE_URL}/rest/v1/family_trees?family_id=eq.${newFamId}&select=id`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  });
  const trees = await treeRes.json();
  const newTreeId = trees[0].id;

  console.log(`Diệp Dụng Family ID: ${newFamId}, Tree ID: ${newTreeId}`);

  // 1. Persons of Diệp Dụng
  const allPersons = readJson('persons.json');
  const diepPersons = allPersons.filter((p) => p.family_id === '579443a8-3e80-42c8-9f05-1d55c9f9069e');
  console.log(`Found ${diepPersons.length} persons for Diệp Dụng.`);

  const personIdMap = {};
  let insertedPersons = 0;

  for (const p of diepPersons) {
    const payload = {
      family_id: newFamId,
      tree_id: newTreeId,
      full_name: p.full_name,
      gender: p.gender,
      birth_year: p.birth_year,
      birth_month: p.birth_month,
      birth_day: p.birth_day,
      death_year: p.death_year,
      death_month: p.death_month,
      death_day: p.death_day,
      death_lunar_year: p.death_lunar_year,
      death_lunar_month: p.death_lunar_month,
      death_lunar_day: p.death_lunar_day,
      is_deceased: p.is_deceased,
      is_in_law: p.is_in_law,
      birth_order: p.birth_order,
      generation: p.generation,
      other_names: p.other_names,
      avatar_url: p.avatar_url,
      note: p.note,
      visibility: p.visibility || 'private',
      external_ref: p.external_ref,
    };

    const pRes = await fetch(`${SUPABASE_URL}/rest/v1/persons`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    });

    if (pRes.ok) {
      const inserted = await pRes.json();
      if (inserted && inserted[0]) {
        personIdMap[p.id] = inserted[0].id;
        insertedPersons++;
      }
    } else {
      console.warn(`[WARN] Person insert error: ${await pRes.text()}`);
    }
  }
  console.log(`✓ Inserted ${insertedPersons} persons for Diệp Dụng.`);

  // 2. Relationships of Diệp Dụng
  const allRels = readJson('relationships.json');
  const diepRels = allRels.filter((r) => r.family_id === '579443a8-3e80-42c8-9f05-1d55c9f9069e');
  console.log(`Found ${diepRels.length} relationships for Diệp Dụng.`);

  let insertedRels = 0;
  for (const r of diepRels) {
    const newPersonA = personIdMap[r.person_a];
    const newPersonB = personIdMap[r.person_b];
    if (!newPersonA || !newPersonB) continue;

    const payload = {
      family_id: newFamId,
      tree_id: newTreeId,
      type: r.type,
      person_a: newPersonA,
      person_b: newPersonB,
      note: r.note,
      visibility: r.visibility || 'private',
    };

    const rRes = await fetch(`${SUPABASE_URL}/rest/v1/relationships`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (rRes.ok) insertedRels++;
  }
  console.log(`✓ Inserted ${insertedRels} relationships for Diệp Dụng.`);

  // 3. Person Details Private of Diệp Dụng
  const allDetails = readJson('person_details_private.json');
  const diepDetails = allDetails.filter((d) => d.family_id === '579443a8-3e80-42c8-9f05-1d55c9f9069e');
  let insertedDetails = 0;

  for (const d of diepDetails) {
    const newPersonId = personIdMap[d.person_id];
    if (!newPersonId) continue;

    const payload = {
      person_id: newPersonId,
      family_id: newFamId,
      tree_id: newTreeId,
      phone_number: d.phone_number,
      occupation: d.occupation,
      current_residence: d.current_residence,
      burial_place: d.burial_place,
      private_notes: d.private_notes,
    };

    const dRes = await fetch(`${SUPABASE_URL}/rest/v1/person_details_private`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (dRes.ok) insertedDetails++;
  }
  console.log(`✓ Inserted ${insertedDetails} private details for Diệp Dụng.`);

  // 4. Restore All 13 Blog Posts
  console.log('\n--- RESTORING ALL 13 BLOG POSTS ---');
  // First map all families
  const allFamsRes = await fetch(`${SUPABASE_URL}/rest/v1/families?select=id,slug`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  });
  const serverFams = await allFamsRes.json();
  const slugToId = {};
  for (const sf of serverFams) slugToId[sf.slug] = sf.id;

  const oldFams = readJson('families.json');
  const oldIdToSlug = {};
  for (const of_ of oldFams) oldIdToSlug[of_.id] = of_.slug;

  const blogPosts = readJson('blog_posts.json');
  let insertedBlogs = 0;

  for (const bp of blogPosts) {
    let targetFamId = null;
    if (bp.family_id) {
      const slug = oldIdToSlug[bp.family_id];
      if (slug) targetFamId = slugToId[slug];
    }

    const payload = {
      scope: bp.scope,
      family_id: targetFamId,
      title: bp.title,
      slug: bp.slug,
      excerpt: bp.excerpt,
      content: bp.content,
      category: bp.category,
      cover_image_url: bp.cover_image_url || '/family.jpg.png',
      cover_image_path: bp.cover_image_path,
      is_published: bp.is_published,
      status: bp.status || 'published',
      visibility: bp.visibility || 'public',
      published_at: bp.published_at || new Date().toISOString(),
    };

    const bRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (bRes.ok) {
      insertedBlogs++;
      console.log(`✓ Blog: ${bp.title}`);
    } else {
      console.warn(`[WARN] Blog insert error: ${await bRes.text()}`);
    }
  }
  console.log(`✓ Inserted ${insertedBlogs}/${blogPosts.length} blog posts.`);
}

restoreDiepDungAndBlogs().catch(console.error);
