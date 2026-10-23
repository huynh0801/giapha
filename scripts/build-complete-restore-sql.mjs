import fs from 'node:fs';
import path from 'node:path';

const backupDir = path.join(process.cwd(), 'backups', 'backup-2026-10-22T05-42-15');

function readJson(filename) {
  const p = path.join(backupDir, filename);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function escapeSqlValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

function buildTableInserts(schema, tableName, rows, conflictClause = 'ON CONFLICT DO NOTHING') {
  if (!rows || rows.length === 0) return `-- No rows for ${schema}.${tableName}\n\n`;

  const columns = Object.keys(rows[0]);
  const lines = [];

  for (const row of rows) {
    const values = columns.map(c => escapeSqlValue(row[c]));
    lines.push(`INSERT INTO ${schema}.${tableName} (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')}) ${conflictClause};`);
  }

  return `-- Table: ${schema}.${tableName} (${rows.length} rows)\n` + lines.join('\n') + '\n\n';
}

function buildAuthUsersInserts(users) {
  if (!users || users.length === 0) return '';

  const lines = [];
  for (const u of users) {
    const id = escapeSqlValue(u.id);
    const email = escapeSqlValue(u.email);
    const fullName = escapeSqlValue(u.full_name || 'Người dùng');
    const createdAt = escapeSqlValue(u.created_at || new Date().toISOString());

    lines.push(`
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  ${id},
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  ${email},
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', ${fullName}),
  ${createdAt},
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();`.trim());
  }

  return `-- 1. AUTH USERS (Khôi phục ${users.length} tài khoản xác thực)\n` + lines.join('\n\n') + '\n\n';
}

function generateCompleteRestore() {
  console.log('Generating complete restore SQL script...');

  const users = readJson('users.json');
  const profiles = readJson('profiles.json');
  const families = readJson('families.json');
  const familyTrees = readJson('family_trees.json');
  const familyMemberships = readJson('family_memberships.json');
  const persons = readJson('persons.json');
  const personDetailsPrivate = readJson('person_details_private.json');
  const relationships = readJson('relationships.json');
  const customEvents = readJson('custom_events.json');
  const blogPosts = readJson('blog_posts.json');
  const joinRequests = readJson('join_requests.json');

  let sql = `-- =====================================================================
-- GIA PHẢ DÒNG HỌ - SCRIPT KHÔI PHỤC TOÀN BỘ CƠ SỞ DỮ LIỆU
-- Backup gốc tạo lúc: 2026-10-22T05:42:15Z
-- =====================================================================
-- Hướng dẫn: Mở Supabase SQL Editor > Dán toàn bộ file này > Bấm RUN
-- =====================================================================

BEGIN;

-- Tắt kiểm tra trigger tạm thời để restore nhanh và không bị trùng lặp audit
SET session_replication_role = 'replica';

`;

  // 1. Auth Users
  sql += buildAuthUsersInserts(users);

  // 2. Profiles
  sql += `-- 2. HỒ SƠ NGƯỜI DÙNG\n` + buildTableInserts('public', 'profiles', profiles, 'ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active');

  // 3. Families
  sql += `-- 3. DÒNG HỌ\n` + buildTableInserts('public', 'families', families, 'ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug');

  // 4. Trees
  sql += `-- 4. CÂY GIA PHẢ\n` + buildTableInserts('public', 'family_trees', familyTrees, 'ON CONFLICT (id) DO NOTHING');

  // 5. Family Memberships
  sql += `-- 5. QUYỀN QUẢN LÝ DÒNG HỌ\n` + buildTableInserts('public', 'family_memberships', familyMemberships, 'ON CONFLICT (id) DO NOTHING');

  // 6. Persons
  sql += `-- 6. THÀNH VIÊN GIA PHẢ\n` + buildTableInserts('public', 'persons', persons, 'ON CONFLICT (id) DO NOTHING');

  // 7. Person Details Private
  sql += `-- 7. HỒ SƠ RIÊNG TƯ\n` + buildTableInserts('public', 'person_details_private', personDetailsPrivate, 'ON CONFLICT (person_id) DO NOTHING');

  // 8. Relationships
  sql += `-- 8. MỐI QUAN HỆ GIA TỘC\n` + buildTableInserts('public', 'relationships', relationships, 'ON CONFLICT (id) DO NOTHING');

  // 9. Custom Events
  sql += `-- 9. SỰ KIỆN DÒNG HỌ\n` + buildTableInserts('public', 'custom_events', customEvents, 'ON CONFLICT (id) DO NOTHING');

  // 10. Blog Posts
  sql += `-- 10. BÀI VIẾT BLOG\n` + buildTableInserts('public', 'blog_posts', blogPosts, 'ON CONFLICT (id) DO NOTHING');

  // 11. Join Requests
  sql += `-- 11. YÊU CẦU GIA NHẬP\n` + buildTableInserts('public', 'join_requests', joinRequests, 'ON CONFLICT (id) DO NOTHING');

  sql += `
-- Bật lại trigger kiểm tra toàn vẹn
SET session_replication_role = 'origin';

COMMIT;

-- HOÀN TẤT KHÔI PHỤC TOÀN BỘ DỮ LIỆU!
`;

  const outPath = path.join(backupDir, 'restore_complete.sql');
  fs.writeFileSync(outPath, sql, 'utf8');

  console.log(`✓ File restore hoàn chỉnh đã được tạo: ${outPath}`);
  console.log(`Dung lượng: ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);
}

generateCompleteRestore();
