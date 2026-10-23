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

  if (!res.ok) {
    throw new Error(`Login failed with status ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return { token: data.access_token, myId: data.user.id };
}

async function runRestore() {
  console.log('========================================================');
  console.log('🚀 BẮT ĐẦU QUY TRÌNH KHÔI PHỤC DỮ LIỆU TỰ ĐỘNG (RESTORE) 🚀');
  console.log('========================================================\n');

  const { token, myId } = await loginAdmin();
  console.log(`Đã xác thực Super Admin (${ADMIN_EMAIL}) thành công.\n`);

  const userIdMap = {};        // oldUserId -> newUserId
  const familyIdMap = {};      // oldFamilyId -> newFamilyId
  const treeIdMap = {};        // oldTreeId -> newTreeId
  const personIdMap = {};      // oldPersonId -> newPersonId

  userIdMap['308dc3e4-1e6e-401e-962a-25925ca912c7'] = myId;
  userIdMap['4f629e80-9fb2-40fd-af3d-7f99f876d916'] = myId;

  // --------------------------------------------------------------------------
  // 1. KHÔI PHỤC TÀI KHOẢN NGƯỜI DÙNG (USERS)
  // --------------------------------------------------------------------------
  console.log('--- 1. KHÔI PHỤC TÀI KHOẢN NGƯỜI DÙNG ---');
  const users = readJson('users.json');
  console.log(`Đang nạp lại ${users.length} tài khoản...`);

  // Lấy danh sách user hiện có trên server
  const existRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_admin_users`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  const existingUsers = (await existRes.json()) || [];
  const emailToId = {};
  for (const eu of existingUsers) {
    emailToId[eu.email.toLowerCase()] = eu.id;
  }

  let createdUsers = 0;
  for (const u of users) {
    if (!u.email || u.email === ADMIN_EMAIL) {
      userIdMap[u.id] = myId;
      continue;
    }

    const normEmail = u.email.toLowerCase();
    if (emailToId[normEmail]) {
      userIdMap[u.id] = emailToId[normEmail];
      continue;
    }

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/admin_create_user`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_full_name: u.full_name || 'Thành viên',
          new_email: u.email,
          new_password: 'Password@123',
          new_role: u.role || 'member',
          new_active: u.is_active !== false,
        }),
      });

      if (res.ok) {
        const newUid = await res.json();
        userIdMap[u.id] = newUid;
        emailToId[normEmail] = newUid;
        createdUsers++;
      } else {
        console.warn(`[WARN] Lỗi tạo user ${u.email}: ${await res.text()}`);
      }
    } catch (e) {
      console.warn(`[WARN] Lỗi khi tạo user ${u.email}: ${e.message}`);
    }
  }
  console.log(`✓ Đã nạp thành công ${createdUsers} tài khoản người dùng.\n`);

  // --------------------------------------------------------------------------
  // 2. KHÔI PHỤC DÒNG HỌ & CÂY GIA PHẢ MẶC ĐỊNH
  // --------------------------------------------------------------------------
  console.log('--- 2. KHÔI PHỤC CÁC DÒNG HỌ (FAMILIES) ---');
  const families = readJson('families.json');
  const memberships = readJson('family_memberships.json');
  const trees = readJson('family_trees.json');

  for (const f of families) {
    console.log(`Đang khôi phục dòng họ: "${f.name}"...`);

    // Tìm primary admin
    const primaryMember = memberships.find((m) => m.family_id === f.id && (m.is_primary_admin || m.role === 'family_admin'));
    let adminProfileId = primaryMember ? userIdMap[primaryMember.profile_id] : null;

    if (!adminProfileId) {
      // Fallback: dùng user đầu tiên hoặc tạo tạm
      const firstMapped = Object.values(userIdMap).find((id) => id !== myId);
      adminProfileId = firstMapped || myId;
    }

    const famRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/create_family_with_admin`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        family_name: f.name,
        family_slug: f.slug,
        family_description: f.description || '',
        admin_profile_id: adminProfileId,
      }),
    });

    if (!famRes.ok) {
      console.warn(`[WARN] Lỗi tạo dòng họ ${f.name}: ${await famRes.text()}`);
      continue;
    }

    const newFamId = await famRes.json();
    familyIdMap[f.id] = newFamId;

    // Cập nhật các trường bổ sung của family (visibility, origin_location, settings)
    await fetch(`${SUPABASE_URL}/rest/v1/families?id=eq.${newFamId}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin_location: f.origin_location,
        visibility: f.visibility || 'private',
        settings: f.settings || {},
      }),
    });

    // Lấy tree ID được tự sinh
    const treeRes = await fetch(`${SUPABASE_URL}/rest/v1/family_trees?family_id=eq.${newFamId}&select=id,is_primary`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    const createdTrees = await treeRes.json();
    const primaryCreatedTree = createdTrees.find((t) => t.is_primary) || createdTrees[0];

    // Map old primary tree
    const oldPrimaryTree = trees.find((t) => t.family_id === f.id && t.is_primary) || trees.find((t) => t.family_id === f.id);
    if (oldPrimaryTree && primaryCreatedTree) {
      treeIdMap[oldPrimaryTree.id] = primaryCreatedTree.id;
    }

    // Nạp các membership khác nếu có
    const otherMembers = memberships.filter((m) => m.family_id === f.id && userIdMap[m.profile_id] && userIdMap[m.profile_id] !== adminProfileId);
    for (const om of otherMembers) {
      await fetch(`${SUPABASE_URL}/rest/v1/rpc/set_family_membership`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_family_id: newFamId,
          target_profile_id: userIdMap[om.profile_id],
          new_role: om.role || 'member',
          new_status: om.status || 'active',
        }),
      });
    }

    console.log(`✓ Đã khôi phục dòng họ "${f.name}" -> ID mới: ${newFamId}`);
  }
  console.log(`✓ Đã khôi phục toàn bộ ${families.length} dòng họ.\n`);

  // --------------------------------------------------------------------------
  // 3. KHÔI PHỤC THÀNH VIÊN GIA TỘC (PERSONS)
  // --------------------------------------------------------------------------
  console.log('--- 3. KHÔI PHỤC THÀNH VIÊN CÂY GIA PHẢ (PERSONS) ---');
  const persons = readJson('persons.json');
  console.log(`Đang nạp lại ${persons.length} thành viên...`);

  let restoredPersons = 0;
  for (const p of persons) {
    const newFamId = familyIdMap[p.family_id];
    const newTreeId = treeIdMap[p.tree_id];

    if (!newFamId || !newTreeId) {
      continue;
    }

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
        restoredPersons++;
      }
    } else {
      console.warn(`[WARN] Lỗi nạp person ${p.full_name}: ${await pRes.text()}`);
    }
  }
  console.log(`✓ Đã nạp thành công ${restoredPersons}/${persons.length} thành viên gia phả.\n`);

  // --------------------------------------------------------------------------
  // 4. KHÔI PHỤC MỐI QUAN HỆ GIA TỘC (RELATIONSHIPS)
  // --------------------------------------------------------------------------
  console.log('--- 4. KHÔI PHỤC MỐI QUAN HỆ GIA ĐÌNH (RELATIONSHIPS) ---');
  const relationships = readJson('relationships.json');
  console.log(`Đang nạp lại ${relationships.length} mối quan hệ...`);

  let restoredRels = 0;
  for (const r of relationships) {
    const newFamId = familyIdMap[r.family_id];
    const newTreeId = treeIdMap[r.tree_id];
    const newPersonA = personIdMap[r.person_a];
    const newPersonB = personIdMap[r.person_b];

    if (!newFamId || !newTreeId || !newPersonA || !newPersonB) {
      continue;
    }

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

    if (rRes.ok) {
      restoredRels++;
    } else {
      console.warn(`[WARN] Lỗi nạp relationship ${r.type}: ${await rRes.text()}`);
    }
  }
  console.log(`✓ Đã nạp thành công ${restoredRels}/${relationships.length} mối quan hệ gia tộc.\n`);

  // --------------------------------------------------------------------------
  // 5. KHÔI PHỤC HỒ SƠ RIÊNG TƯ (PERSON DETAILS PRIVATE)
  // --------------------------------------------------------------------------
  console.log('--- 5. KHÔI PHỤC HỒ SƠ RIÊNG TƯ (PERSON DETAILS PRIVATE) ---');
  const privateDetails = readJson('person_details_private.json');
  let restoredDetails = 0;

  for (const d of privateDetails) {
    const newPersonId = personIdMap[d.person_id];
    const newFamId = familyIdMap[d.family_id];
    const newTreeId = treeIdMap[d.tree_id];

    if (!newPersonId || !newFamId || !newTreeId) continue;

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

    if (dRes.ok) {
      restoredDetails++;
    }
  }
  console.log(`✓ Đã nạp thành công ${restoredDetails}/${privateDetails.length} hồ sơ riêng tư.\n`);

  // --------------------------------------------------------------------------
  // 6. KHÔI PHỤC BÀI VIẾT BLOG
  // --------------------------------------------------------------------------
  console.log('--- 6. KHÔI PHỤC BÀI VIẾT BLOG ---');
  const blogPosts = readJson('blog_posts.json');
  let restoredBlogs = 0;

  for (const bp of blogPosts) {
    const newFamId = bp.family_id ? familyIdMap[bp.family_id] : null;

    const payload = {
      scope: bp.scope,
      family_id: newFamId,
      title: bp.title,
      slug: bp.slug,
      excerpt: bp.excerpt,
      content: bp.content,
      category: bp.category,
      cover_image: bp.cover_image,
      images: bp.images,
      is_published: bp.is_published,
      status: bp.status,
      visibility: bp.visibility,
      published_at: bp.published_at,
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
      restoredBlogs++;
    }
  }
  console.log(`✓ Đã nạp thành công ${restoredBlogs}/${blogPosts.length} bài viết blog.\n`);

  // --------------------------------------------------------------------------
  // 7. CẬP NHẬT CỤ TỔ (ROOT_PERSON_ID) CHO CÁC CÂY GIA PHẢ
  // --------------------------------------------------------------------------
  console.log('--- 7. CẬP NHẬT CỤ TỔ (ROOT_PERSON_ID) CHO CÂY GIA PHẢ ---');
  for (const t of trees) {
    if (t.root_person_id && personIdMap[t.root_person_id] && treeIdMap[t.id]) {
      await fetch(`${SUPABASE_URL}/rest/v1/family_trees?id=eq.${treeIdMap[t.id]}`, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          root_person_id: personIdMap[t.root_person_id],
        }),
      });
    }
  }
  console.log('✓ Đã cập nhật xong cụ tổ cho các cây gia phả.\n');

  console.log('========================================================');
  console.log('🎉 QUY TRÌNH KHÔI PHỤC DỮ LIỆU ĐÃ HOÀN TẤT THÀNH CÔNG! 🎉');
  console.log('========================================================');
  console.log(`- Dòng họ đã phục hồi   : ${Object.keys(familyIdMap).length}`);
  console.log(`- Thành viên gia phả    : ${restoredPersons}`);
  console.log(`- Mối quan hệ gia tộc   : ${restoredRels}`);
  console.log(`- Hồ sơ riêng tư        : ${restoredDetails}`);
  console.log(`- Bài viết blog         : ${restoredBlogs}`);
  console.log(`- Tài khoản người dùng  : ${Object.keys(userIdMap).length}`);
}

runRestore().catch((err) => {
  console.error('Lỗi quy trình khôi phục:', err);
  process.exit(1);
});
