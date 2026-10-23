import fs from 'node:fs';

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

async function wipe() {
  console.log('========================================================');
  console.log('🚨 BẮT ĐẦU QUY TRÌNH XÓA DỮ LIỆU QUA API TERMINAL 🚨');
  console.log('========================================================\n');

  const { token, myId } = await loginAdmin();
  console.log(`Đã xác thực Super Admin (${ADMIN_EMAIL}) thành công.\n`);

  // 1. LẤY VÀ XÓA TẤT CẢ DÒNG HỌ (VÀ TOÀN BỘ CÂY GIA PHẢ CỦA TỪNG DÒNG HỌ)
  console.log('--- 1. XÓA CÁC DÒNG HỌ VÀ TOÀN BỘ CÂY GIA PHẢ ---');
  const famRes = await fetch(`${SUPABASE_URL}/rest/v1/families?select=id,name`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
    },
  });

  const families = await famRes.json();
  console.log(`Tìm thấy ${families.length} dòng họ trên hệ thống.`);

  for (const f of families) {
    console.log(`Đang xóa dòng họ "${f.name}" (ID: ${f.id})...`);
    const delRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/delete_family`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ target_family_id: f.id }),
    });

    if (delRes.ok || delRes.status === 204) {
      console.log(`✓ Đã xóa sạch dòng họ "${f.name}" và toàn bộ người/quan hệ.`);
    } else {
      console.warn(`✗ Lỗi xóa dòng họ ${f.name}: ${delRes.status} ${await delRes.text()}`);
    }
  }

  // 2. XÓA BÀI VIẾT BLOG HỆ THỐNG
  console.log('\n--- 2. XÓA BÀI VIẾT BLOG HỆ THỐNG ---');
  const delBlogRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?scope=eq.system`, {
    method: 'DELETE',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(`Kết quả xóa Blog hệ thống: status ${delBlogRes.status}`);

  // 3. XÓA CÁC TÀI KHOẢN NGƯỜI DÙNG (TRỪ TÀI KHOẢN SUPER ADMIN ĐANG ĐĂNG NHẬP)
  console.log('\n--- 3. XÓA TÀI KHOẢN NGƯỜI DÙNG KHÁC ---');
  const usersRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_admin_users`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  const users = await usersRes.json();
  const targetUsers = users.filter((u) => u.id !== myId);
  console.log(`Tìm thấy ${targetUsers.length} tài khoản người dùng khác cần xóa.`);

  let deletedCount = 0;
  for (const u of targetUsers) {
    const delURes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/delete_user`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ target_user_id: u.id }),
    });

    if (delURes.ok || delURes.status === 204) {
      deletedCount++;
    } else {
      console.warn(`✗ Lỗi xóa user ${u.email}: ${delURes.status}`);
    }
  }
  console.log(`✓ Đã xóa thành công ${deletedCount}/${targetUsers.length} tài khoản người dùng.`);

  // 4. KIỂM TRA LẠI DỮ LIỆU CÒN LẠI TRÊN HỆ THỐNG
  console.log('\n========================================================');
  console.log('📊 KẾT QUẢ KIỂM TRA LẠI DATABASE SAU KHI XÓA:');
  console.log('========================================================');

  const checkTables = ['families', 'family_trees', 'persons', 'relationships', 'blog_posts'];
  for (const t of checkTables) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${t}?select=count`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
        Prefer: 'count=exact',
      },
    });
    console.log(`- ${t.padEnd(20)}: còn lại ${res.headers.get('content-range') || '0'} bản ghi`);
  }

  const finalUsersRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_admin_users`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  const finalUsers = await finalUsersRes.json();
  console.log(`- users (tài khoản)   : còn lại ${finalUsers.length} tài khoản (${finalUsers.map((u) => u.email).join(', ')})`);
  console.log('\n🎉 HOÀN TẤT QUY TRÌNH XÓA DỮ LIỆU!');
}

wipe().catch((err) => {
  console.error('Lỗi quy trình xóa:', err);
  process.exit(1);
});
