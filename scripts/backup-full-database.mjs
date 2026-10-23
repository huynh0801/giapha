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

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outputDir = path.join(process.cwd(), 'backups', `backup-${timestamp}`);

fs.mkdirSync(outputDir, { recursive: true });

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
  return data.access_token;
}

async function fetchAllRows(tableName, token) {
  const rows = [];
  const pageSize = 1000;
  let offset = 0;

  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${tableName}?select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${token}`,
          Range: `${offset}-${offset + pageSize - 1}`,
          'Range-Unit': 'items',
          Prefer: 'count=exact',
        },
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[WARN] Table ${tableName} fetch error (status ${res.status}): ${errText}`);
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

async function fetchAdminUsers(token) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_admin_users`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[WARN] Failed to fetch admin users:', err.message);
  }
  return [];
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

function generateTableSql(tableName, rows) {
  if (!rows || rows.length === 0) return `-- No rows for ${tableName}\n\n`;

  const columns = Object.keys(rows[0]);
  const lines = [];

  for (const row of rows) {
    const values = columns.map(c => escapeSqlValue(row[c]));
    lines.push(`INSERT INTO public.${tableName} (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;`);
  }

  return `-- Table: public.${tableName} (${rows.length} rows)\n` + lines.join('\n') + '\n\n';
}

async function runBackup() {
  console.log(`Starting full database backup at ${new Date().toISOString()}...`);
  console.log(`Connecting to: ${SUPABASE_URL}`);

  const token = await loginAdmin();
  console.log('Successfully authenticated as Super Admin.\n');

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
  ];

  const summary = {
    backup_timestamp: new Date().toISOString(),
    supabase_url: SUPABASE_URL,
    total_tables: tables.length,
    counts: {},
  };

  let fullSql = `-- GIA PHA DONG HO - FULL DATABASE BACKUP\n-- Generated at: ${new Date().toISOString()}\n-- Source: ${SUPABASE_URL}\n\n`;

  for (const t of tables) {
    const rows = await fetchAllRows(t, token);
    summary.counts[t] = rows.length;

    // Save JSON
    const jsonPath = path.join(outputDir, `${t}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(rows, null, 2), 'utf8');

    // Append to SQL restore file
    fullSql += generateTableSql(t, rows);

    console.log(`✓ ${t.padEnd(25)} : ${String(rows.length).padStart(4)} records -> ${t}.json`);
  }

  // Also fetch user accounts
  const users = await fetchAdminUsers(token);
  summary.counts['auth_users'] = users.length;
  fs.writeFileSync(path.join(outputDir, 'users.json'), JSON.stringify(users, null, 2), 'utf8');
  console.log(`✓ ${'users (auth)'.padEnd(25)} : ${String(users.length).padStart(4)} accounts -> users.json`);

  // Write SQL restore file
  const sqlPath = path.join(outputDir, 'restore_data.sql');
  fs.writeFileSync(sqlPath, fullSql, 'utf8');
  console.log(`\n✓ Generated SQL restore script -> restore_data.sql`);

  // Write Summary
  const summaryPath = path.join(outputDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`✓ Saved backup summary -> summary.json`);

  console.log(`\n======================================================`);
  console.log(`🎉 BACKUP HOÀN TẤT THÀNH CÔNG!`);
  console.log(`Thư mục lưu trữ: ${outputDir}`);
  console.log(`======================================================`);
}

runBackup().catch((err) => {
  console.error('Backup failed:', err);
  process.exit(1);
});
