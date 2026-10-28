import fs from 'node:fs';
import path from 'node:path';

// 1. Tự động load file .env.local hoặc .env nếu biến môi trường chưa có
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
if (!SUPABASE_URL) {
  console.error("❌ Thiếu biến môi trường SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_URL");
  process.exit(1);
}

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234';

// Tạo tên thư mục backup theo thời gian thực (định dạng YYYY-MM-DD_HH-mm-ss)
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
const outputDir = path.join(process.cwd(), 'backups', `backup-${timestamp}`);

fs.mkdirSync(outputDir, { recursive: true });

async function getAuthCredentials() {
  if (SERVICE_ROLE_KEY) {
    console.log('🔑 Sử dụng SUPABASE_SERVICE_ROLE_KEY (quyền Admin cao nhất, bỏ qua RLS).');
    return { token: SERVICE_ROLE_KEY, apikey: SERVICE_ROLE_KEY, isServiceRole: true };
  }

  if (!ANON_KEY) {
    throw new Error('Không tìm thấy SUPABASE_SERVICE_ROLE_KEY hay SUPABASE_ANON_KEY trong file môi trường.');
  }

  console.log(`🔐 Đăng nhập tài khoản Admin (${ADMIN_EMAIL}) bằng anon key...`);
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  if (!res.ok) {
    throw new Error(`Đăng nhập admin thất bại (status ${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  return { token: data.access_token, apikey: ANON_KEY, isServiceRole: false };
}

async function fetchAllRows(tableName, token, apikey) {
  const rows = [];
  const pageSize = 1000;
  let offset = 0;

  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${tableName}?select=*`,
      {
        headers: {
          apikey,
          Authorization: `Bearer ${token}`,
          Range: `${offset}-${offset + pageSize - 1}`,
          'Range-Unit': 'items',
          Prefer: 'count=exact',
        },
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`⚠️ [WARN] Bảng ${tableName} không đọc được (status ${res.status}): ${errText}`);
      break;
    }

    const chunk = await res.json();
    if (!Array.isArray(chunk) || chunk.length === 0) {
      break;
    }

    rows.push(...chunk);
    if (chunk.length < pageSize) {
      break;
    }
    offset += pageSize;
  }

  return rows;
}

async function fetchAuthUsers(token, apikey, isServiceRole) {
  if (isServiceRole) {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?per_page=1000`, {
        headers: {
          apikey,
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.users && Array.isArray(data.users)) {
          return data.users.map(u => ({
            id: u.id,
            email: u.email,
            full_name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User',
            created_at: u.created_at,
            raw_user_meta_data: u.user_metadata,
            raw_app_meta_data: u.app_metadata,
          }));
        }
      }
    } catch (err) {
      console.warn('⚠️ Lỗi khi gọi /auth/v1/admin/users:', err.message);
    }
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_admin_users`, {
      method: 'POST',
      headers: {
        apikey,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('⚠️ Không thể lấy danh sách qua get_admin_users:', err.message);
  }

  return [];
}

async function backupStorageFiles(outputDir, token, apikey) {
  console.log('\n📦 Đang kiểm tra và sao lưu Supabase Storage (avatars, blog images, family assets)...');
  const storageDir = path.join(outputDir, 'storage');
  let downloadedFiles = 0;

  try {
    const bRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      headers: { apikey, Authorization: `Bearer ${token}` },
    });
    if (!bRes.ok) {
      console.warn(`⚠️ Không thể truy cập Storage API (status ${bRes.status})`);
      return 0;
    }
    const buckets = await bRes.json();
    if (!Array.isArray(buckets) || buckets.length === 0) {
      console.log('  ℹ️ Không tìm thấy bucket nào.');
      return 0;
    }

    for (const b of buckets) {
      const bucketName = b.name || b.id;
      const bucketDir = path.join(storageDir, bucketName);

      async function traverseFolder(prefix = '') {
        const listRes = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${bucketName}`, {
          method: 'POST',
          headers: {
            apikey,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prefix, limit: 1000 }),
        });
        if (!listRes.ok) return;
        const items = await listRes.json();
        if (!Array.isArray(items)) return;

        for (const item of items) {
          const itemPath = prefix ? `${prefix}/${item.name}` : item.name;
          if (item.id === null) {
            // Thư mục con
            await traverseFolder(itemPath);
          } else {
            // Tệp tin cần tải
            const fileRes = await fetch(`${SUPABASE_URL}/storage/v1/object/authenticated/${bucketName}/${itemPath}`, {
              headers: { apikey, Authorization: `Bearer ${token}` },
            });
            if (fileRes.ok) {
              const buffer = Buffer.from(await fileRes.arrayBuffer());
              const localPath = path.join(bucketDir, itemPath);
              fs.mkdirSync(path.dirname(localPath), { recursive: true });
              fs.writeFileSync(localPath, buffer);
              downloadedFiles++;
              console.log(`   ⬇️ [${bucketName}] ${itemPath} (${buffer.length} bytes)`);
            }
          }
        }
      }

      await traverseFolder();
    }
  } catch (err) {
    console.warn(`⚠️ Lỗi khi sao lưu storage: ${err.message}`);
  }

  return downloadedFiles;
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

function generateTableSql(tableName, rows, conflictClause = 'ON CONFLICT DO NOTHING') {
  if (!rows || rows.length === 0) return `-- No rows for public.${tableName}\n\n`;

  const allColumns = Array.from(new Set(rows.flatMap(r => Object.keys(r))));
  const lines = [];

  for (const row of rows) {
    const values = allColumns.map(c => escapeSqlValue(row[c]));
    lines.push(`INSERT INTO public.${tableName} (${allColumns.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')}) ${conflictClause};`);
  }

  return `-- Table: public.${tableName} (${rows.length} rows)\n` + lines.join('\n') + '\n\n';
}

function generateCompleteRestoreSql(users, tableDataMap, timestampStr, sourceUrl) {
  let sql = `-- =====================================================================
-- GIA PHẢ DÒNG HỌ - SCRIPT KHÔI PHỤC TOÀN BỘ CƠ SỞ DỮ LIỆU
-- Thời điểm sao lưu: ${timestampStr}
-- Nguồn dữ liệu: ${sourceUrl}
-- =====================================================================
-- Hướng dẫn:
-- 1. Vào Supabase Dashboard > Project mới > SQL Editor
-- 2. Dán toàn bộ nội dung file này vào và bấm 'RUN'
-- =====================================================================

BEGIN;

-- Tắt tạm thời kiểm tra foreign key và triggers để restore trơn tru không xung đột
SET session_replication_role = 'replica';

`;

  // 1. Tạo Auth Users (khôi phục tài khoản để đảm bảo các khóa ngoại profile và quyền đăng nhập)
  if (users && users.length > 0) {
    sql += `-- --------------------------------------------------------------------\n`;
    sql += `-- 1. AUTH USERS (${users.length} tài khoản xác thực)\n`;
    sql += `-- Lưu ý: Mật khẩu mặc định được đặt là '12345678' (hoặc admin1234 với admin)\n`;
    sql += `-- --------------------------------------------------------------------\n`;

    for (const u of users) {
      const id = escapeSqlValue(u.id);
      const email = escapeSqlValue(u.email);
      const fullName = escapeSqlValue(u.full_name || 'Người dùng');
      const createdAt = escapeSqlValue(u.created_at || new Date().toISOString());
      const rawUserMeta = u.raw_user_meta_data ? escapeSqlValue(u.raw_user_meta_data) : `jsonb_build_object('full_name', ${fullName})`;

      sql += `INSERT INTO auth.users (
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
  ${rawUserMeta},
  ${createdAt},
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  updated_at = now();\n\n`;
    }
  }

  // 2. Chèn dữ liệu các bảng theo đúng thứ tự phụ thuộc
  const order = [
    { name: 'profiles', conflict: 'ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active' },
    { name: 'families', conflict: 'ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug' },
    { name: 'family_trees', conflict: 'ON CONFLICT (id) DO NOTHING' },
    { name: 'family_memberships', conflict: 'ON CONFLICT (id) DO NOTHING' },
    { name: 'persons', conflict: 'ON CONFLICT (id) DO NOTHING' },
    { name: 'person_details_private', conflict: 'ON CONFLICT (person_id) DO NOTHING' },
    { name: 'relationships', conflict: 'ON CONFLICT (id) DO NOTHING' },
    { name: 'custom_events', conflict: 'ON CONFLICT (id) DO NOTHING' },
    { name: 'documents', conflict: 'ON CONFLICT (id) DO NOTHING' },
    { name: 'blog_posts', conflict: 'ON CONFLICT (id) DO NOTHING' },
    { name: 'invitations', conflict: 'ON CONFLICT (id) DO NOTHING' },
    { name: 'join_requests', conflict: 'ON CONFLICT (id) DO NOTHING' },
    { name: 'change_requests', conflict: 'ON CONFLICT (id) DO NOTHING' },
    { name: 'notifications', conflict: 'ON CONFLICT (id) DO NOTHING' },
    { name: 'audit_logs', conflict: 'ON CONFLICT (id) DO NOTHING' },
    { name: 'site_visits', conflict: 'ON CONFLICT (id) DO NOTHING' },
    { name: 'family_creation_requests', conflict: 'ON CONFLICT (id) DO NOTHING' },
  ];

  for (const item of order) {
    const rows = tableDataMap[item.name];
    if (rows && rows.length > 0) {
      sql += `-- --------------------------------------------------------------------\n`;
      sql += `-- Dữ liệu bảng: public.${item.name}\n`;
      sql += `-- --------------------------------------------------------------------\n`;
      sql += generateTableSql(item.name, rows, item.conflict);
    }
  }

  sql += `
-- Khôi phục lại chế độ kiểm tra trigger và ràng buộc toàn vẹn
SET session_replication_role = 'origin';

COMMIT;

-- =====================================================================
-- KHÔI PHỤC TOÀN BỘ CƠ SỞ DỮ LIỆU THÀNH CÔNG!
-- =====================================================================
`;

  return sql;
}

async function runBackup() {
  console.log('========================================================');
  console.log(`🚀 BẮT ĐẦU SAO LƯU TOÀN DIỆN HỆ THỐNG GIA PHẢ DÒNG HỌ 🚀`);
  console.log(`⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}`);
  console.log(`🌐 Máy chủ: ${SUPABASE_URL}`);
  console.log(`📁 Thư mục lưu: backups/backup-${timestamp}`);
  console.log('========================================================\n');

  const { token, apikey, isServiceRole } = await getAuthCredentials();

  const tables = [
    'profiles',
    'families',
    'family_trees',
    'family_memberships',
    'persons',
    'person_details_private',
    'relationships',
    'custom_events',
    'documents',
    'blog_posts',
    'invitations',
    'join_requests',
    'change_requests',
    'notifications',
    'audit_logs',
    'site_visits',
    'family_creation_requests',
  ];

  const tableDataMap = {};
  const summary = {
    backup_timestamp: new Date().toISOString(),
    supabase_url: SUPABASE_URL,
    total_tables: tables.length,
    counts: {},
    total_records: 0,
    storage_files_downloaded: 0,
  };

  console.log('\n📊 ĐANG TRUY XUẤT VÀ LƯU TRỮ CÁC BẢNG DỮ LIỆU:');
  console.log('--------------------------------------------------------');

  for (const t of tables) {
    const rows = await fetchAllRows(t, token, apikey);
    tableDataMap[t] = rows;
    summary.counts[t] = rows.length;
    summary.total_records += rows.length;

    // Lưu từng bảng dưới dạng JSON chuẩn
    const jsonPath = path.join(outputDir, `${t}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(rows, null, 2), 'utf8');

    console.log(` ✓ ${t.padEnd(28)} : ${String(rows.length).padStart(4)} dòng -> ${t}.json`);
  }

  // Sao lưu tài khoản Auth Users
  console.log('--------------------------------------------------------');
  const users = await fetchAuthUsers(token, apikey, isServiceRole);
  summary.counts['auth_users'] = users.length;
  fs.writeFileSync(path.join(outputDir, 'users.json'), JSON.stringify(users, null, 2), 'utf8');
  console.log(` ✓ ${'auth.users (tài khoản)'.padEnd(28)} : ${String(users.length).padStart(4)} tài khoản -> users.json`);

  // Sao lưu Media / Supabase Storage
  const storageCount = await backupStorageFiles(outputDir, token, apikey);
  summary.storage_files_downloaded = storageCount;

  // Tạo file SQL hoàn chỉnh (restore_complete.sql)
  const completeSql = generateCompleteRestoreSql(users, tableDataMap, summary.backup_timestamp, SUPABASE_URL);
  const sqlPath = path.join(outputDir, 'restore_complete.sql');
  fs.writeFileSync(sqlPath, completeSql, 'utf8');
  console.log(`\n✓ Đã tạo file SQL khôi phục 1-click -> restore_complete.sql (${(fs.statSync(sqlPath).size / 1024).toFixed(1)} KB)`);

  // Lưu file summary.json
  const summaryPath = path.join(outputDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`✓ Đã tạo file tóm tắt thống kê     -> summary.json`);

  console.log(`\n======================================================`);
  console.log(`🎉 SAO LƯU DỮ LIỆU THÀNH CÔNG VÀ HOÀN TẤT TRỌN VẸN!`);
  console.log(`📊 Tổng số dòng dữ liệu : ${summary.total_records} bản ghi`);
  console.log(`👥 Tổng số tài khoản     : ${users.length} tài khoản`);
  console.log(`🖼️ Tổng số file storage   : ${storageCount} tệp`);
  console.log(`📂 Đường dẫn bản backup  : ${outputDir}`);
  console.log(`======================================================\n`);

  return summary;
}

runBackup().catch((err) => {
  console.error('\n❌ Backup thất bại:', err);
  process.exit(1);
});
