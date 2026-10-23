-- ============================================================
-- Seed data for the private multi-tenant genealogy app
-- ============================================================
-- Test accounts created by this seed:
--   System Admin: admin.seed@example.com / test-seed-admin-1234
--   Family Admin: admin.dongho@example.com / admin-dongho-1234

TRUNCATE TABLE
  public.documents,
  public.blog_posts,
  public.relationships,
  public.person_details_private,
  public.persons,
  public.custom_events,
  public.family_trees,
  public.family_memberships,
  public.families,
  public.invitations,
  public.join_requests,
  public.change_requests,
  public.notifications,
  public.audit_logs,
  public.site_visits
RESTART IDENTITY CASCADE;

DO $$
DECLARE
  admin_id uuid := '88888888-0000-0000-0000-000000000001';
  admin_email text := 'admin.seed@example.com';
  family_admin_id uuid := '99999999-0000-0000-0000-000000000001';
  family_admin_email text := 'admin.dongho@example.com';
  family_id uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
  tree_id uuid := 'bbbbbbbb-0000-0000-0000-000000000001';
BEGIN
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at,
    confirmation_token, recovery_token, email_change_token_new,
    email_change_token_current, reauthentication_token, email_change,
    phone_change, phone_change_token,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  )
  VALUES (
    admin_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    admin_email,
    extensions.crypt('test-seed-admin-1234', extensions.gen_salt('bf')),
    now(),
    '', '', '', '', '', '', '', '',
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', 'Quản trị hệ thống mẫu'),
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = now();

  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at,
    confirmation_token, recovery_token, email_change_token_new,
    email_change_token_current, reauthentication_token, email_change,
    phone_change, phone_change_token,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  )
  VALUES (
    family_admin_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    family_admin_email,
    extensions.crypt('admin-dongho-1234', extensions.gen_salt('bf')),
    now(),
    '', '', '', '', '', '', '', '',
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', 'Admin Dòng họ mẫu'),
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = now();

  INSERT INTO public.profiles (
    id, full_name, role, is_active, must_change_password, created_at, updated_at
  )
  SELECT
    au.id,
    COALESCE(
      au.raw_user_meta_data->>'full_name',
      au.raw_user_meta_data->>'name'
    ),
    CASE
      WHEN au.id = admin_id THEN 'system_admin'::public.platform_role_enum
      ELSE 'member'::public.platform_role_enum
    END,
    true,
    false,
    now(),
    now()
  FROM auth.users au
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
    role = CASE
      WHEN public.profiles.id = admin_id THEN 'system_admin'::public.platform_role_enum
      ELSE public.profiles.role
    END,
    is_active = COALESCE(public.profiles.is_active, true),
    must_change_password = COALESCE(public.profiles.must_change_password, false),
    updated_at = now();

  INSERT INTO public.families (
    id, name, slug, description, origin_location, visibility, status, settings, created_by
  )
  VALUES (
    family_id,
    'Dòng họ Văn mẫu',
    'dong-ho-van-mau',
    'Dòng họ mẫu dùng để kiểm thử chế độ riêng tư multi-tenant.',
    'Hà Nội',
    'private',
    'active',
    jsonb_build_object('blog_max_images_per_post', 1),
    admin_id
  );

  INSERT INTO public.family_memberships (
    family_id, profile_id, role, status, invited_by, joined_at
  )
  VALUES (
    family_id,
    family_admin_id,
    'family_admin',
    'active',
    admin_id,
    now()
  );

  INSERT INTO public.family_trees (
    id, family_id, name, slug, description, is_primary, created_by
  )
  VALUES (
    tree_id,
    family_id,
    'Cây gia phả chính',
    'cay-chinh',
    'Cây gia phả mặc định của dòng họ mẫu.',
    true,
    admin_id
  );

  INSERT INTO public.blog_posts (
    id,
    scope,
    family_id,
    title,
    slug,
    excerpt,
    content,
    category,
    cover_image_url,
    cover_image_path,
    is_published,
    status,
    visibility,
    published_at,
    author_id
  )
  VALUES
  (
    '50000000-0000-0000-0000-000000000001',
    'system',
    NULL,
    'Số hóa gia phả trong không gian riêng tư',
    'so-hoa-gia-pha-trong-khong-gian-rieng-tu',
    'Gia phả số nên ưu tiên quyền riêng tư, chỉ thành viên được duyệt mới xem dữ liệu nội bộ.',
    'Nền tảng giúp các dòng họ lưu giữ cây gia phả, tư liệu và ký ức theo từng không gian riêng. Dữ liệu mặc định là private, còn blog hệ thống có thể public khi không chứa thông tin nội bộ.',
    'VĂN HÓA DÒNG HỌ',
    '/family.jpg.png',
    NULL,
    true,
    'published',
    'public',
    now() - interval '2 days',
    admin_id
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    'system',
    NULL,
    'Mỗi dòng họ một không gian quản trị riêng',
    'moi-dong-ho-mot-khong-gian-quan-tri-rieng',
    'Super Admin tạo dòng họ, gán Admin Dòng Họ và vẫn có quyền cứu hộ dữ liệu toàn hệ thống khi cần hỗ trợ kỹ thuật.',
    'Mô hình multi-tenant giúp mỗi dòng họ có cây gia phả, thành viên, sự kiện và tài liệu riêng. Thành viên chỉ xem được khi membership active trong đúng dòng họ.',
    'SẢN PHẨM',
    '/mo gio co va bao thap.jpg.jpg',
    NULL,
    true,
    'published',
    'public',
    now() - interval '1 day',
    admin_id
  ),
  (
    '50000000-0000-0000-0000-000000000003',
    'family',
    family_id,
    'Thông báo họp họ đầu năm',
    'thong-bao-hop-ho-dau-nam',
    'Bài viết nội bộ chỉ thành viên active của dòng họ mới xem được.',
    'Nội dung này thuộc blog riêng của dòng họ mẫu. Admin dòng họ có thể đăng thông báo, ghi chép lịch sử, hình ảnh tư liệu và kế hoạch sinh hoạt họ tộc tại đây.',
    'TIN NỘI BỘ DÒNG HỌ',
    '/family.jpg.png',
    NULL,
    true,
    'published',
    'private',
    now() - interval '12 hours',
    family_admin_id
  );

  INSERT INTO public.persons (
    id, family_id, tree_id, full_name, gender, birth_year, death_year,
    is_deceased, is_in_law, generation, birth_order, note, created_by
  )
  VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    family_id,
    tree_id,
    'Văn Công Gốc',
    'male',
    1902,
    1975,
    true,
    false,
    1,
    NULL,
    'Ông tổ mẫu của dòng họ Văn.',
    admin_id
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    family_id,
    tree_id,
    'Bình Thị Mộc',
    'female',
    1908,
    1980,
    true,
    true,
    1,
    NULL,
    'Tổ mẫu, người giữ nếp nhà qua nhiều thế hệ.',
    admin_id
  ),
  (
    '20000000-0000-0000-0000-000000000001',
    family_id,
    tree_id,
    'Văn Công Thuận',
    'male',
    1930,
    2008,
    true,
    false,
    2,
    1,
    'Con trưởng, người ghi chép cuốn gia phả viết tay.',
    admin_id
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    family_id,
    tree_id,
    'Cẩm Thị Dịu',
    'female',
    1934,
    2012,
    true,
    true,
    2,
    NULL,
    'Vợ của ông Thuận.',
    admin_id
  ),
  (
    '30000000-0000-0000-0000-000000000001',
    family_id,
    tree_id,
    'Văn Công Trí',
    'male',
    1958,
    NULL,
    false,
    false,
    3,
    1,
    'Người tiếp tục bảo quản tư liệu dòng họ.',
    admin_id
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    family_id,
    tree_id,
    'Ngô Thị Hiền',
    'female',
    1961,
    NULL,
    false,
    true,
    3,
    NULL,
    'Vợ của ông Trí.',
    admin_id
  ),
  (
    '40000000-0000-0000-0000-000000000001',
    family_id,
    tree_id,
    'Văn Trí Minh',
    'male',
    1989,
    NULL,
    false,
    false,
    4,
    1,
    'Thế hệ trẻ tham gia số hóa gia phả.',
    admin_id
  );

  UPDATE public.family_trees
  SET root_person_id = '10000000-0000-0000-0000-000000000001'
  WHERE id = tree_id;

  INSERT INTO public.person_details_private (
    person_id, family_id, tree_id, phone_number, occupation, current_residence
  )
  VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    family_id,
    tree_id,
    '09xx xxx 001',
    'Kỹ sư xây dựng',
    'Hà Nội'
  ),
  (
    '40000000-0000-0000-0000-000000000001',
    family_id,
    tree_id,
    '09xx xxx 101',
    'Lập trình viên',
    'Hà Nội'
  );

  INSERT INTO public.relationships (
    family_id, tree_id, type, person_a, person_b, created_by
  )
  VALUES
  (family_id, tree_id, 'marriage', '10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', admin_id),
  (family_id, tree_id, 'biological_child', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', admin_id),
  (family_id, tree_id, 'biological_child', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', admin_id),
  (family_id, tree_id, 'marriage', '20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', admin_id),
  (family_id, tree_id, 'marriage', '30000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', admin_id);

  INSERT INTO public.persons (
    id, family_id, tree_id, full_name, gender, birth_year, death_year,
    is_deceased, is_in_law, generation, birth_order, note, created_by
  )
  VALUES
  ('20000000-0000-0000-0000-000000000003', family_id, tree_id, 'Van Cong Phuc', 'male', 1936, 2015, true, false, 2, 2, 'Nhanh phu the he thu hai.', admin_id),
  ('20000000-0000-0000-0000-000000000004', family_id, tree_id, 'Van Thi Lan', 'female', 1939, NULL, false, false, 2, 3, 'Nguoi giu nhieu anh tu lieu gia dinh.', admin_id),
  ('20000000-0000-0000-0000-000000000005', family_id, tree_id, 'Van Cong Hieu', 'male', 1942, NULL, false, false, 2, 4, 'Song tai que nha.', admin_id),
  ('20000000-0000-0000-0000-000000000006', family_id, tree_id, 'Van Thi Tam', 'female', 1945, NULL, false, false, 2, 5, 'Thanh vien the he thu hai.', admin_id),
  ('20000000-0000-0000-0000-000000000007', family_id, tree_id, 'Le Thi Hoa', 'female', 1940, NULL, false, true, 2, NULL, 'Vo cua ong Phuc.', admin_id),
  ('20000000-0000-0000-0000-000000000008', family_id, tree_id, 'Tran Van Binh', 'male', 1937, 2010, true, true, 2, NULL, 'Chong cua ba Lan.', admin_id),
  ('30000000-0000-0000-0000-000000000003', family_id, tree_id, 'Van Thi Mai', 'female', 1963, NULL, false, false, 3, 2, 'Chi nhanh con ong Thuan.', admin_id),
  ('30000000-0000-0000-0000-000000000004', family_id, tree_id, 'Van Cong Son', 'male', 1966, NULL, false, false, 3, 3, 'Chi nhanh con ong Thuan.', admin_id),
  ('30000000-0000-0000-0000-000000000005', family_id, tree_id, 'Van Thi Thu', 'female', 1969, NULL, false, false, 3, 4, 'Chi nhanh con ong Thuan.', admin_id),
  ('30000000-0000-0000-0000-000000000006', family_id, tree_id, 'Van Cong Khoa', 'male', 1965, NULL, false, false, 3, 1, 'Con ong Phuc.', admin_id),
  ('30000000-0000-0000-0000-000000000007', family_id, tree_id, 'Van Thi Nga', 'female', 1968, NULL, false, false, 3, 2, 'Con ong Phuc.', admin_id),
  ('30000000-0000-0000-0000-000000000008', family_id, tree_id, 'Van Cong Dat', 'male', 1971, NULL, false, false, 3, 3, 'Con ong Phuc.', admin_id),
  ('30000000-0000-0000-0000-000000000009', family_id, tree_id, 'Tran Thi An', 'female', 1964, NULL, false, false, 3, 1, 'Con ba Lan.', admin_id),
  ('30000000-0000-0000-0000-000000000010', family_id, tree_id, 'Tran Van Bao', 'male', 1967, NULL, false, false, 3, 2, 'Con ba Lan.', admin_id),
  ('30000000-0000-0000-0000-000000000011', family_id, tree_id, 'Tran Thi Dao', 'female', 1970, NULL, false, false, 3, 3, 'Con ba Lan.', admin_id),
  ('30000000-0000-0000-0000-000000000012', family_id, tree_id, 'Pham Van Nam', 'male', 1961, NULL, false, true, 3, NULL, 'Chong cua ba Mai.', admin_id),
  ('30000000-0000-0000-0000-000000000013', family_id, tree_id, 'Hoang Thi Lien', 'female', 1968, NULL, false, true, 3, NULL, 'Vo cua ong Son.', admin_id),
  ('30000000-0000-0000-0000-000000000014', family_id, tree_id, 'Do Van Hai', 'male', 1966, NULL, false, true, 3, NULL, 'Chong cua ba Thu.', admin_id),
  ('30000000-0000-0000-0000-000000000015', family_id, tree_id, 'Nguyen Thi Hanh', 'female', 1967, NULL, false, true, 3, NULL, 'Vo cua ong Khoa.', admin_id),
  ('30000000-0000-0000-0000-000000000016', family_id, tree_id, 'Bui Van Duc', 'male', 1964, NULL, false, true, 3, NULL, 'Chong cua ba Nga.', admin_id),
  ('30000000-0000-0000-0000-000000000017', family_id, tree_id, 'Pham Thi Que', 'female', 1972, NULL, false, true, 3, NULL, 'Vo cua ong Dat.', admin_id),
  ('30000000-0000-0000-0000-000000000018', family_id, tree_id, 'Le Van Tuan', 'male', 1962, NULL, false, true, 3, NULL, 'Chong cua ba An.', admin_id),
  ('30000000-0000-0000-0000-000000000019', family_id, tree_id, 'Vu Thi Yen', 'female', 1969, NULL, false, true, 3, NULL, 'Vo cua ong Bao.', admin_id),
  ('30000000-0000-0000-0000-000000000020', family_id, tree_id, 'Dang Van Minh', 'male', 1968, NULL, false, true, 3, NULL, 'Chong cua ba Dao.', admin_id),
  ('40000000-0000-0000-0000-000000000002', family_id, tree_id, 'Van Minh Anh', 'female', 1991, NULL, false, false, 4, 2, 'The he tre dang song tai Ha Noi.', admin_id),
  ('40000000-0000-0000-0000-000000000003', family_id, tree_id, 'Van Minh Quan', 'male', 1994, NULL, false, false, 4, 3, 'The he tre dang song tai Da Nang.', admin_id),
  ('40000000-0000-0000-0000-000000000004', family_id, tree_id, 'Pham Ngoc Lam', 'male', 1988, NULL, false, false, 4, 1, 'Chau ngoai nhanh ba Mai.', admin_id),
  ('40000000-0000-0000-0000-000000000005', family_id, tree_id, 'Pham Ngoc Linh', 'female', 1992, NULL, false, false, 4, 2, 'Chau ngoai nhanh ba Mai.', admin_id),
  ('40000000-0000-0000-0000-000000000006', family_id, tree_id, 'Van Son Ha', 'female', 1990, NULL, false, false, 4, 1, 'Chau nhanh ong Son.', admin_id),
  ('40000000-0000-0000-0000-000000000007', family_id, tree_id, 'Van Son Nam', 'male', 1995, NULL, false, false, 4, 2, 'Chau nhanh ong Son.', admin_id),
  ('40000000-0000-0000-0000-000000000008', family_id, tree_id, 'Do Thu Trang', 'female', 1993, NULL, false, false, 4, 1, 'Chau nhanh ba Thu.', admin_id),
  ('40000000-0000-0000-0000-000000000009', family_id, tree_id, 'Van Khoa Phong', 'male', 1991, NULL, false, false, 4, 1, 'Chau nhanh ong Khoa.', admin_id),
  ('40000000-0000-0000-0000-000000000010', family_id, tree_id, 'Van Khoa My', 'female', 1996, NULL, false, false, 4, 2, 'Chau nhanh ong Khoa.', admin_id),
  ('40000000-0000-0000-0000-000000000011', family_id, tree_id, 'Bui Gia Hung', 'male', 1992, NULL, false, false, 4, 1, 'Chau nhanh ba Nga.', admin_id),
  ('40000000-0000-0000-0000-000000000012', family_id, tree_id, 'Bui Gia Linh', 'female', 1997, NULL, false, false, 4, 2, 'Chau nhanh ba Nga.', admin_id),
  ('40000000-0000-0000-0000-000000000013', family_id, tree_id, 'Van Dat Nhi', 'female', 1998, NULL, false, false, 4, 1, 'Chau nhanh ong Dat.', admin_id),
  ('40000000-0000-0000-0000-000000000014', family_id, tree_id, 'Le An Khanh', 'male', 1990, NULL, false, false, 4, 1, 'Chau nhanh ba An.', admin_id),
  ('40000000-0000-0000-0000-000000000015', family_id, tree_id, 'Tran Bao Chi', 'female', 1995, NULL, false, false, 4, 1, 'Chau nhanh ong Bao.', admin_id),
  ('40000000-0000-0000-0000-000000000016', family_id, tree_id, 'Dang Dao Long', 'male', 1996, NULL, false, false, 4, 1, 'Chau nhanh ba Dao.', admin_id);

  INSERT INTO public.relationships (
    family_id, tree_id, type, person_a, person_b, created_by
  )
  VALUES
  (family_id, tree_id, 'biological_child', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', admin_id),
  (family_id, tree_id, 'biological_child', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', admin_id),
  (family_id, tree_id, 'biological_child', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', admin_id),
  (family_id, tree_id, 'biological_child', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', admin_id),
  (family_id, tree_id, 'biological_child', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', admin_id),
  (family_id, tree_id, 'biological_child', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', admin_id),
  (family_id, tree_id, 'biological_child', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', admin_id),
  (family_id, tree_id, 'biological_child', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', admin_id),
  (family_id, tree_id, 'marriage', '20000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000007', admin_id),
  (family_id, tree_id, 'marriage', '20000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000008', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000004', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000004', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000005', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000005', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000006', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000006', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000007', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000007', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000008', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000008', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000009', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000009', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000010', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000010', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000011', admin_id),
  (family_id, tree_id, 'biological_child', '20000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000011', admin_id),
  (family_id, tree_id, 'marriage', '30000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000012', admin_id),
  (family_id, tree_id, 'marriage', '30000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000013', admin_id),
  (family_id, tree_id, 'marriage', '30000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000014', admin_id),
  (family_id, tree_id, 'marriage', '30000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000015', admin_id),
  (family_id, tree_id, 'marriage', '30000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000016', admin_id),
  (family_id, tree_id, 'marriage', '30000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000017', admin_id),
  (family_id, tree_id, 'marriage', '30000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000018', admin_id),
  (family_id, tree_id, 'marriage', '30000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000019', admin_id),
  (family_id, tree_id, 'marriage', '30000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000020', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000004', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000004', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000005', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000005', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000006', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000006', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000007', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000007', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000008', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000008', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000009', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000009', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000010', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000010', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000011', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000011', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000012', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000012', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000013', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000013', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000014', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000014', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000010', '40000000-0000-0000-0000-000000000015', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000019', '40000000-0000-0000-0000-000000000015', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000016', admin_id),
  (family_id, tree_id, 'biological_child', '30000000-0000-0000-0000-000000000020', '40000000-0000-0000-0000-000000000016', admin_id);

  INSERT INTO public.custom_events (
    family_id, tree_id, name, content, event_date, location, visibility, created_by
  )
  VALUES (
    family_id,
    tree_id,
    'Họp họ đầu năm',
    'Sự kiện nội bộ chỉ thành viên dòng họ có quyền mới xem được.',
    (current_date + interval '15 days')::date,
    'Nhà thờ họ',
    'private',
    admin_id
  );
END $$;
