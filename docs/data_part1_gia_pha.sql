-- =====================================================================
-- GIA PHẢ DÒNG HỌ - SCRIPT KHÔI PHỤC TOÀN BỘ CƠ SỞ DỮ LIỆU
-- Backup gốc tạo lúc: 2026-10-22T05:42:15Z
-- =====================================================================
-- Hướng dẫn: Mở Supabase SQL Editor > Dán toàn bộ file này > Bấm RUN
-- =====================================================================

BEGIN;

-- Tắt kiểm tra trigger tạm thời để restore nhanh và không bị trùng lặp audit
SET session_replication_role = 'replica';

-- 1. AUTH USERS (Khôi phục 95 tài khoản xác thực)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '308dc3e4-1e6e-401e-962a-25925ca912c7',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Quản trị hệ thống'),
  '2026-10-22T12:37:31.0236+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'feefe97b-1845-4edf-9810-d91f20e0479e',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'huynhcuboy0123@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-10-22T11:30:55.787386+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'a341ee5c-6760-4ef5-b0c1-4f24e1d6cbf7',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'huynh080104@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-10-22T10:46:13.099179+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '0957df7a-4a4e-44a2-beda-892e9842a969',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'letrunghmtu@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-10-21T16:31:49.245829+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'd768cd98-2a04-4a96-9592-865d32837721',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'luyenht2711@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-10-18T20:45:00.606044+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '6e87d6d0-c9c4-4a4e-8e71-4a627f50ad92',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'lekhangchien96@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-10-15T08:35:12.082341+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '1f3a6d97-2a35-471b-8543-439f0f1b06a3',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'phamvankhanhvmm@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-10-09T10:08:44.847413+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'e097d706-2aa1-4742-a968-19e2d926df4f',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'tuantudo001@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-10-08T10:44:20.523715+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '9973631f-4e23-45d9-bbeb-941fc9e428c0',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'vulehoang2205@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-10-04T13:50:58.315928+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '2b2125f2-316c-4d0b-9cd0-f013314e79f8',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'hanovo.bom@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-10-03T00:10:53.661667+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'f8c2625d-b0a6-4fce-b43e-a5bd30072083',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'dinhthienhoang90@gamil.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-10-02T15:08:00.087434+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'fe44abad-d365-4edf-98ee-4fb85ad46a18',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'viendisanvanhoacdh@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-09-29T23:35:16.596836+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'e7a57e83-ab20-4c5b-9c87-caf4aebdb0b1',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'namduoctot@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-09-29T23:32:00.575197+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'be5fce2d-d628-4eb7-b705-23a8eb41198e',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'buikimxuyen68@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-09-29T23:29:42.826502+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'd6571124-58de-49a0-874f-5e609af880a6',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'dung63982@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-09-28T22:34:52.599179+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '40116adb-8598-4621-ad75-41df3317b862',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'ledinhduy1342006@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-09-28T15:51:31.954266+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'a079f725-8720-48c2-9158-ff07aed7f112',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'nt976176@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-09-26T12:33:15.85728+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '01f8512f-2b61-402a-a3b7-3b771cb74caf',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'trantienloi412@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-09-17T10:05:52.479029+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '7668dd9c-a916-4fa5-ab05-4819913e2fb7',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'drhoangloc94@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-09-16T17:18:47.361852+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'b8ec1fb6-a925-4105-8596-779247b5ecd9',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'congtymova@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-09-15T20:49:56.187429+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '14170fef-e130-423a-81da-60a1eae6d6b6',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'hueminh109@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-09-09T11:50:03.732559+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'f350ad6f-64b6-46a4-8f3e-25e410637663',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'toilabun12345@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-09-08T13:17:33.730263+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '04549423-4e6d-4538-a39b-841ee4605aad',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'trinhthachjp2@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-09-07T12:28:53.563299+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '56854900-ffb6-419f-9cbb-1afc21bc2e82',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'hoangbinhgt8@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-08-28T12:33:07.065399+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '1265843f-5934-419c-99e4-83f8622c8372',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'dqlinh76@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-08-24T16:00:21.292283+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'acb0f717-16d8-44b5-aed8-1a83efd313ef',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'diepvmduc@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-08-24T15:58:49.323371+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '7c68cf79-c8b4-4e44-b010-b2aba8063ba1',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'tuandevz@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-08-22T10:01:14.09823+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'b08aff3d-29de-4bc5-868d-e641d0122bde',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'bachdangtrung@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-08-21T23:05:18.60023+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '91f2d3d4-d4ea-4901-8ef5-74add5fb7977',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'nguyendinhhuy.thpt@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-08-21T21:54:51.242243+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'c8efd3d1-39f7-4e09-9e31-7f6921346919',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'vngreenteam@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-08-21T09:20:55.263586+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '61519138-9dd2-43fd-ad5f-47ed448d97be',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'mrdiepbang09071988@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Diệp phúc bằng'),
  '2026-08-20T17:47:49.558712+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '7418c440-7a21-4291-8fe5-963514449f9a',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'kid1485@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-08-19T21:13:34.781427+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '5d24f5c9-e029-4763-912b-b5a5de1e2cc4',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'vietaq@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-08-19T18:15:03.32549+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '45db8d6e-b6a9-461b-8050-fde8a3724dbf',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'nguyenlangthienhao@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-08-18T16:38:25.062371+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'fea5c878-d922-4617-bd2f-21afc7df8dba',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'hatrantucuong70@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-08-15T09:11:35.414353+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '89470c76-861c-489a-a12c-330c5d47d458',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'hminh6440@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-08-10T14:48:00.655029+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'c8d2089e-29fd-4a4b-affd-45d6bb44b1a3',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'kaecutienttg@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-07-30T09:47:21.325891+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'b82efe52-4b8a-4fa5-82bb-0395932844a4',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'hienxu88.hp@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-07-22T16:14:01.980422+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'ddd2d524-ccaa-4770-84ff-1a1c4a8fd72c',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'hhah22244@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-07-21T15:47:54.929478+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '014bd88d-ce43-407f-90b6-66bd473e4bd4',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'welivitu@icloud.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-07-18T16:50:47.661331+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '1ed211f9-0d9f-4f68-adea-25ab2ca36e5f',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'dovandungbn59@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-07-16T18:17:11.731893+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'cc7c7df9-b928-4003-a58a-be6665636fb2',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'trantiendat.doha@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-07-16T16:54:23.386466+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'b8cf7734-e8ac-4e08-8ca0-fd2470c3f3a8',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'nbviet305210@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-07-16T12:11:05.73404+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'f2ef9176-9856-4cd3-9e54-b0e2a286e65b',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'dohuonggiang14042010@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-07-16T11:47:21.011729+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '553f3484-df5b-4e50-8261-ec8c0c8fac27',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'ngocjemail@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-07-16T10:30:15.380953+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '0d11435d-db7d-422f-9b43-c6c12167faf3',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'truongidol02@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-07-16T00:12:43.042328+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '88ddc9d0-6a77-488e-8eaa-010c59eafa70',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'lamvv18@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-07-15T21:41:09.069951+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'a2846902-56e3-4c80-a45a-85b89262b42c',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'thanhngochoang2k6@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-07-14T19:21:59.140594+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'e166397e-8bd4-4cd4-b79b-10a346fd19a7',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'bdhanh@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Bùi Đức Hạnh'),
  '2026-07-13T21:47:18.022863+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'c8906c2f-dd0b-4c58-8435-94e4f1dd2b16',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.50@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Phu Phuc'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'cc5128da-a35c-4c86-b9d9-8bdd26cad6ae',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.49@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn My Linh'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '0c5c20c7-d72c-4e40-8214-7770a17548e8',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.48@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Lam Hao'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '7198f00d-48f2-4597-b4b0-8fda5826cb27',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.47@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Hong Bao'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '6f6663c4-c782-4236-a5bd-7dad9b788b9d',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.46@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Giang Thu'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '92b387ee-aa39-484c-be25-c4220e1157a5',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.45@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Chau Nhu'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '0241b26d-cab1-4773-a390-41d326a860de',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.44@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Vu Kien'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '39e40dfd-feef-4f25-bf48-7c5e20e3368a',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.43@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Tien Giang'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '558c778a-6681-4051-86b1-c222c04642dc',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.42@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Sang Xuan'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '613d56db-6af0-4cdf-ab5d-39ab7d4efc34',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.41@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Phong Tam'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '3fa8d071-7041-48ce-b2d7-e7a4c1e5d6aa',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.40@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Minh Nga'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '28920a8b-b8cf-490e-8057-e9cdb1f506ff',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.39@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Kien Huy'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'e5521c18-6dac-4a8e-86b0-c02b5f315f69',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.38@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Hoang Dieu'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'f6b3c7ff-65b0-4526-9371-40605824eddb',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.37@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Duy Tuan'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'daa74973-b881-4919-915c-013dd2714d5d',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.36@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Cam Quyen'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'aee9c267-797e-4257-83f6-fe8f07368d5a',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.35@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Van Minh'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'e41f78b1-27e2-4cc1-9585-b01c4a43c8a8',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.34@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Thuy Hong'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '22e9585b-265e-4887-9731-28d6c238cd6f',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.33@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Quyen Cuong'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'b846b130-d9df-4d7d-b8de-04c311982c3d',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.32@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Nhu Trang'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '021fd254-d5dd-4398-b119-13bdea9e41e3',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.31@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Mai Phuong'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '14eb7b66-2d98-412b-9fcc-d8beeb7d3e99',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.30@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Khoa Loc'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '2667a6b0-96e9-4f3b-a58d-cdcec881a310',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.29@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Hoa Hien'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '9e66378c-fb42-4612-a288-f0bc6257a08a',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.28@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Dung Bich'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '7af32575-9ed5-40ad-858b-f889b112d0ba',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.27@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Bich Thuy'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'f95bd22a-3bb0-4bfa-97ba-367d6a153455',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.26@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Tuan Phong'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '8554cf8e-23ff-40dd-b1c7-995cf68070dc',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.25@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Thu Lam'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '223d977b-5ebf-4c30-85a2-91026aa52a65',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.24@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Quang Ha'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'fb6cc90f-54e8-49c0-a9fb-de3fe1553821',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.23@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Nhi Yen'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'c807cab1-5e89-429e-ba5b-271587dcb960',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.22@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Long Thanh'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '53531a1a-af0b-4a3e-9e1d-f54cfd1046ea',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.21@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Khanh Ngoc'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'be6c92c2-b21a-49a8-ae87-f97326e39f87',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.20@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Hien Khanh'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '691b7e8c-ee1c-4543-9705-f50b6db79830',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.19@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Dieu Dung'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '625c021b-c873-4f1f-9fd8-90005a18ae9b',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.18@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Bao Van'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'bc2f752a-88cc-4887-9f04-38f85e407611',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.17@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Trung Sang'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '44725ab7-0fcb-42da-bd73-23bedca4cd5c',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.16@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Thao My'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'd7d5df2a-2788-43ab-8edf-bd55b428239a',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.14@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Ngoc Dan'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '0580b1ea-962e-46cd-b64e-457d03cbc83c',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.13@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Loc Tri'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'f248c127-0c9c-40c9-9110-02484468a0e4',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.12@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Huy Quan'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '243d2b6a-23ab-4878-9311-b961ac2cf95e',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.11@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Hao Long'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'e3f5c8c3-f1fc-4956-8c28-cf8c49445700',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.10@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Dat Hoa'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '45f33c56-f061-4e8b-af21-37eaaf67ab0a',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'member.15@vanmau.test',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Văn Quan Hue'),
  '2026-07-07T21:34:20.505869+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'ff9018a0-b1b2-4fa8-8b09-6c84440ea97a',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'lightup.vn@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-07-06T14:00:38.958053+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '359ba919-c8d4-44c5-8a94-47d90acb3e28',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'congtran1605@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-07-02T16:20:11.410825+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '460fba5c-da1d-4950-a5a9-a6d3a8a7625f',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'ashi@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-06-08T23:39:56.418266+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  'e37abeb8-842a-4129-b569-9da5c9c2a701',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'bnixon@familysearch.org',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-05-06T10:14:33.561211+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES (
  '062d58c6-bc12-4eff-8d7e-d38eb9bd47e6',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'tunguyenanh.amc.mb@gmail.com',
  extensions.crypt('12345678', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object('full_name', 'Người dùng'),
  '2026-05-03T10:07:33.476596+07:00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

-- 2. HỒ SƠ NGƯỜI DÙNG
-- Table: public.profiles (95 rows)
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('e37abeb8-842a-4129-b569-9da5c9c2a701', NULL, 'member', true, false, NULL, NULL, NULL, '2026-06-17T19:55:33.34745+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('ff9018a0-b1b2-4fa8-8b09-6c84440ea97a', NULL, 'member', true, false, NULL, NULL, NULL, '2026-07-06T14:00:38.956397+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('460fba5c-da1d-4950-a5a9-a6d3a8a7625f', NULL, 'member', true, false, NULL, NULL, NULL, '2026-06-17T19:55:33.34745+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('062d58c6-bc12-4eff-8d7e-d38eb9bd47e6', NULL, 'member', true, false, NULL, NULL, NULL, '2026-06-17T19:55:33.34745+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('359ba919-c8d4-44c5-8a94-47d90acb3e28', NULL, 'member', true, false, NULL, NULL, NULL, '2026-07-02T16:20:11.409315+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('e3f5c8c3-f1fc-4956-8c28-cf8c49445700', 'Văn Dat Hoa', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('243d2b6a-23ab-4878-9311-b961ac2cf95e', 'Văn Hao Long', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('f248c127-0c9c-40c9-9110-02484468a0e4', 'Văn Huy Quan', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('0580b1ea-962e-46cd-b64e-457d03cbc83c', 'Văn Loc Tri', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('d7d5df2a-2788-43ab-8edf-bd55b428239a', 'Văn Ngoc Dan', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('45f33c56-f061-4e8b-af21-37eaaf67ab0a', 'Văn Quan Hue', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('44725ab7-0fcb-42da-bd73-23bedca4cd5c', 'Văn Thao My', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('bc2f752a-88cc-4887-9f04-38f85e407611', 'Văn Trung Sang', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('625c021b-c873-4f1f-9fd8-90005a18ae9b', 'Văn Bao Van', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('691b7e8c-ee1c-4543-9705-f50b6db79830', 'Văn Dieu Dung', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('be6c92c2-b21a-49a8-ae87-f97326e39f87', 'Văn Hien Khanh', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('53531a1a-af0b-4a3e-9e1d-f54cfd1046ea', 'Văn Khanh Ngoc', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('c807cab1-5e89-429e-ba5b-271587dcb960', 'Văn Long Thanh', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('fb6cc90f-54e8-49c0-a9fb-de3fe1553821', 'Văn Nhi Yen', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('223d977b-5ebf-4c30-85a2-91026aa52a65', 'Văn Quang Ha', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('8554cf8e-23ff-40dd-b1c7-995cf68070dc', 'Văn Thu Lam', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('f95bd22a-3bb0-4bfa-97ba-367d6a153455', 'Văn Tuan Phong', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('7af32575-9ed5-40ad-858b-f889b112d0ba', 'Văn Bich Thuy', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('9e66378c-fb42-4612-a288-f0bc6257a08a', 'Văn Dung Bich', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('2667a6b0-96e9-4f3b-a58d-cdcec881a310', 'Văn Hoa Hien', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('14eb7b66-2d98-412b-9fcc-d8beeb7d3e99', 'Văn Khoa Loc', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('021fd254-d5dd-4398-b119-13bdea9e41e3', 'Văn Mai Phuong', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('b846b130-d9df-4d7d-b8de-04c311982c3d', 'Văn Nhu Trang', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('22e9585b-265e-4887-9731-28d6c238cd6f', 'Văn Quyen Cuong', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('e41f78b1-27e2-4cc1-9585-b01c4a43c8a8', 'Văn Thuy Hong', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('aee9c267-797e-4257-83f6-fe8f07368d5a', 'Văn Van Minh', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('daa74973-b881-4919-915c-013dd2714d5d', 'Văn Cam Quyen', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('f6b3c7ff-65b0-4526-9371-40605824eddb', 'Văn Duy Tuan', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('e5521c18-6dac-4a8e-86b0-c02b5f315f69', 'Văn Hoang Dieu', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('28920a8b-b8cf-490e-8057-e9cdb1f506ff', 'Văn Kien Huy', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('3fa8d071-7041-48ce-b2d7-e7a4c1e5d6aa', 'Văn Minh Nga', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('613d56db-6af0-4cdf-ab5d-39ab7d4efc34', 'Văn Phong Tam', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('558c778a-6681-4051-86b1-c222c04642dc', 'Văn Sang Xuan', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('39e40dfd-feef-4f25-bf48-7c5e20e3368a', 'Văn Tien Giang', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('0241b26d-cab1-4773-a390-41d326a860de', 'Văn Vu Kien', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('92b387ee-aa39-484c-be25-c4220e1157a5', 'Văn Chau Nhu', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('6f6663c4-c782-4236-a5bd-7dad9b788b9d', 'Văn Giang Thu', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('7198f00d-48f2-4597-b4b0-8fda5826cb27', 'Văn Hong Bao', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('0c5c20c7-d72c-4e40-8214-7770a17548e8', 'Văn Lam Hao', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('cc5128da-a35c-4c86-b9d9-8bdd26cad6ae', 'Văn My Linh', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('c8906c2f-dd0b-4c58-8435-94e4f1dd2b16', 'Văn Phu Phuc', 'member', true, false, NULL, NULL, NULL, '2026-07-07T21:34:20.505869+07:00', '2026-07-07T21:44:22.524187+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('e166397e-8bd4-4cd4-b79b-10a346fd19a7', 'Bùi Đức Hạnh', 'member', true, false, NULL, NULL, '0913190865', '2026-07-13T21:47:18.016151+07:00', '2026-07-13T22:16:28.047804+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('a2846902-56e3-4c80-a45a-85b89262b42c', NULL, 'member', true, false, NULL, NULL, NULL, '2026-07-14T19:21:59.137351+07:00', '2026-07-14T19:21:59.137351+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('88ddc9d0-6a77-488e-8eaa-010c59eafa70', NULL, 'member', true, false, NULL, NULL, NULL, '2026-07-15T21:41:09.068026+07:00', '2026-07-15T21:41:09.068026+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('0d11435d-db7d-422f-9b43-c6c12167faf3', NULL, 'member', true, false, NULL, NULL, NULL, '2026-07-16T00:12:43.040808+07:00', '2026-07-16T00:12:43.040808+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('553f3484-df5b-4e50-8261-ec8c0c8fac27', NULL, 'member', true, false, NULL, NULL, NULL, '2026-07-16T10:30:15.376304+07:00', '2026-07-16T10:30:15.376304+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('f2ef9176-9856-4cd3-9e54-b0e2a286e65b', NULL, 'member', true, false, NULL, NULL, NULL, '2026-07-16T11:47:21.00846+07:00', '2026-07-16T11:47:21.00846+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('b8cf7734-e8ac-4e08-8ca0-fd2470c3f3a8', NULL, 'member', true, false, NULL, NULL, NULL, '2026-07-16T12:11:05.732155+07:00', '2026-07-16T12:11:05.732155+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('cc7c7df9-b928-4003-a58a-be6665636fb2', NULL, 'member', true, false, NULL, NULL, NULL, '2026-07-16T16:54:23.38452+07:00', '2026-07-16T16:54:23.38452+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('1ed211f9-0d9f-4f68-adea-25ab2ca36e5f', NULL, 'member', true, false, NULL, NULL, NULL, '2026-07-16T18:17:11.728169+07:00', '2026-07-16T18:17:11.728169+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('014bd88d-ce43-407f-90b6-66bd473e4bd4', NULL, 'member', true, false, NULL, NULL, NULL, '2026-07-18T16:50:47.659335+07:00', '2026-07-18T16:50:47.659335+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('ddd2d524-ccaa-4770-84ff-1a1c4a8fd72c', NULL, 'member', true, false, NULL, NULL, NULL, '2026-07-21T15:47:54.927183+07:00', '2026-07-21T15:47:54.927183+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('b82efe52-4b8a-4fa5-82bb-0395932844a4', NULL, 'member', true, false, NULL, NULL, NULL, '2026-07-22T16:14:01.975928+07:00', '2026-07-22T16:14:01.975928+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('c8d2089e-29fd-4a4b-affd-45d6bb44b1a3', NULL, 'member', true, false, NULL, NULL, NULL, '2026-07-30T09:47:21.321227+07:00', '2026-07-30T09:47:21.321227+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('89470c76-861c-489a-a12c-330c5d47d458', NULL, 'member', true, false, NULL, NULL, NULL, '2026-08-10T14:48:00.645457+07:00', '2026-08-10T14:48:00.645457+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('fea5c878-d922-4617-bd2f-21afc7df8dba', NULL, 'member', true, false, NULL, NULL, NULL, '2026-08-15T09:11:35.400747+07:00', '2026-08-15T09:11:35.400747+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('45db8d6e-b6a9-461b-8050-fde8a3724dbf', NULL, 'member', true, false, NULL, NULL, NULL, '2026-08-18T16:38:25.059128+07:00', '2026-08-18T16:38:25.059128+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('5d24f5c9-e029-4763-912b-b5a5de1e2cc4', NULL, 'member', true, false, NULL, NULL, NULL, '2026-08-19T18:15:03.317543+07:00', '2026-08-19T18:15:03.317543+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('7418c440-7a21-4291-8fe5-963514449f9a', NULL, 'member', true, false, NULL, NULL, NULL, '2026-08-19T21:13:34.780016+07:00', '2026-08-19T21:13:34.780016+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('c8efd3d1-39f7-4e09-9e31-7f6921346919', NULL, 'member', true, false, NULL, NULL, NULL, '2026-08-21T09:20:55.255878+07:00', '2026-08-21T09:20:55.255878+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('91f2d3d4-d4ea-4901-8ef5-74add5fb7977', NULL, 'member', true, false, NULL, NULL, NULL, '2026-08-21T21:54:51.237423+07:00', '2026-08-21T21:54:51.237423+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('b08aff3d-29de-4bc5-868d-e641d0122bde', NULL, 'member', true, false, NULL, NULL, NULL, '2026-08-21T23:05:18.593766+07:00', '2026-08-21T23:05:18.593766+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('7c68cf79-c8b4-4e44-b010-b2aba8063ba1', NULL, 'member', true, false, NULL, NULL, NULL, '2026-08-22T10:01:14.097281+07:00', '2026-08-22T10:01:14.097281+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('61519138-9dd2-43fd-ad5f-47ed448d97be', 'Diệp phúc bằng', 'member', true, false, NULL, NULL, '0703170123', '2026-08-20T17:47:49.557851+07:00', '2026-08-24T11:22:24.949816+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('acb0f717-16d8-44b5-aed8-1a83efd313ef', NULL, 'member', true, false, NULL, NULL, NULL, '2026-08-24T15:58:49.320428+07:00', '2026-08-24T15:58:49.320428+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('1265843f-5934-419c-99e4-83f8622c8372', NULL, 'member', true, false, NULL, NULL, NULL, '2026-08-24T16:00:21.256723+07:00', '2026-08-24T16:00:21.256723+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('56854900-ffb6-419f-9cbb-1afc21bc2e82', NULL, 'member', true, false, NULL, NULL, NULL, '2026-08-28T12:33:07.057845+07:00', '2026-08-28T12:33:07.057845+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('04549423-4e6d-4538-a39b-841ee4605aad', NULL, 'member', true, false, NULL, NULL, NULL, '2026-09-07T12:28:53.562956+07:00', '2026-09-07T12:28:53.562956+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('f350ad6f-64b6-46a4-8f3e-25e410637663', NULL, 'member', true, false, NULL, NULL, NULL, '2026-09-08T13:17:33.729366+07:00', '2026-09-08T13:17:33.729366+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('14170fef-e130-423a-81da-60a1eae6d6b6', NULL, 'member', true, false, NULL, NULL, NULL, '2026-09-09T11:50:03.727911+07:00', '2026-09-09T11:50:03.727911+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('b8ec1fb6-a925-4105-8596-779247b5ecd9', NULL, 'system_admin', true, false, NULL, NULL, NULL, '2026-09-15T20:49:56.183054+07:00', '2026-09-15T21:24:32.37268+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('7668dd9c-a916-4fa5-ab05-4819913e2fb7', NULL, 'member', true, false, NULL, NULL, NULL, '2026-09-16T17:18:47.357155+07:00', '2026-09-16T17:18:47.357155+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('01f8512f-2b61-402a-a3b7-3b771cb74caf', NULL, 'member', true, false, NULL, NULL, NULL, '2026-09-17T10:05:52.467562+07:00', '2026-09-17T10:05:52.467562+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('a079f725-8720-48c2-9158-ff07aed7f112', NULL, 'member', true, false, NULL, NULL, NULL, '2026-09-26T12:33:15.849756+07:00', '2026-09-26T12:33:15.849756+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('40116adb-8598-4621-ad75-41df3317b862', NULL, 'member', true, false, NULL, NULL, NULL, '2026-09-28T15:51:31.953902+07:00', '2026-09-28T15:51:31.953902+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('d6571124-58de-49a0-874f-5e609af880a6', NULL, 'member', true, false, NULL, NULL, NULL, '2026-09-28T22:34:52.589916+07:00', '2026-09-28T22:34:52.589916+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('be5fce2d-d628-4eb7-b705-23a8eb41198e', NULL, 'member', true, false, NULL, NULL, NULL, '2026-09-29T23:29:42.82212+07:00', '2026-09-29T23:29:42.82212+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('e7a57e83-ab20-4c5b-9c87-caf4aebdb0b1', NULL, 'member', true, false, NULL, NULL, NULL, '2026-09-29T23:32:00.572588+07:00', '2026-09-29T23:32:00.572588+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('fe44abad-d365-4edf-98ee-4fb85ad46a18', NULL, 'member', true, false, NULL, NULL, NULL, '2026-09-29T23:35:16.591548+07:00', '2026-09-29T23:35:16.591548+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('f8c2625d-b0a6-4fce-b43e-a5bd30072083', NULL, 'member', true, false, NULL, NULL, NULL, '2026-10-02T15:08:00.086404+07:00', '2026-10-02T15:08:00.086404+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('2b2125f2-316c-4d0b-9cd0-f013314e79f8', NULL, 'member', true, false, NULL, NULL, NULL, '2026-10-03T00:10:53.661317+07:00', '2026-10-03T00:10:53.661317+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('9973631f-4e23-45d9-bbeb-941fc9e428c0', NULL, 'member', true, false, NULL, NULL, NULL, '2026-10-04T13:50:58.315563+07:00', '2026-10-04T13:50:58.315563+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('e097d706-2aa1-4742-a968-19e2d926df4f', NULL, 'member', true, false, NULL, NULL, NULL, '2026-10-08T10:44:20.510111+07:00', '2026-10-08T10:44:20.510111+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('1f3a6d97-2a35-471b-8543-439f0f1b06a3', NULL, 'member', true, false, NULL, NULL, NULL, '2026-10-09T10:08:44.844575+07:00', '2026-10-09T10:08:44.844575+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('6e87d6d0-c9c4-4a4e-8e71-4a627f50ad92', NULL, 'member', true, false, NULL, NULL, NULL, '2026-10-15T08:35:12.074954+07:00', '2026-10-15T08:35:12.074954+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('d768cd98-2a04-4a96-9592-865d32837721', NULL, 'member', true, false, NULL, NULL, NULL, '2026-10-18T20:45:00.604964+07:00', '2026-10-18T20:45:00.604964+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('0957df7a-4a4e-44a2-beda-892e9842a969', NULL, 'member', true, false, NULL, NULL, NULL, '2026-10-21T16:31:49.241226+07:00', '2026-10-21T16:31:49.241226+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('a341ee5c-6760-4ef5-b0c1-4f24e1d6cbf7', NULL, 'member', true, false, NULL, NULL, NULL, '2026-10-22T10:46:13.087267+07:00', '2026-10-22T10:46:13.087267+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('feefe97b-1845-4edf-9810-d91f20e0479e', NULL, 'member', true, false, NULL, NULL, NULL, '2026-10-22T11:30:55.778474+07:00', '2026-10-22T11:30:55.778474+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;
INSERT INTO public.profiles ("id", "full_name", "role", "is_active", "must_change_password", "password_changed_at", "avatar_url", "phone_number", "created_at", "updated_at") VALUES ('308dc3e4-1e6e-401e-962a-25925ca912c7', 'Quản trị hệ thống', 'system_admin', true, false, '2026-10-22T12:37:31.0236+07:00', NULL, NULL, '2026-10-22T12:37:31.0236+07:00', '2026-10-22T12:37:31.0236+07:00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = EXCLUDED.is_active;

-- 3. DÒNG HỌ
-- Table: public.families (5 rows)
INSERT INTO public.families ("id", "name", "slug", "description", "origin_location", "logo_url", "visibility", "status", "settings", "created_by", "created_at", "updated_at") VALUES ('20e6af55-87ce-45f1-ad34-20ea5bac2fee', 'Dòng họ Trần Như Vĩnh Trụ- Ninh Bình', 'dong-ho-tran-nhu-vinh-tru-ninh-binh', NULL, NULL, NULL, 'private', 'active', '{"blog_max_images_per_post":1}'::jsonb, NULL, '2026-07-13T15:14:23.996578+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;
INSERT INTO public.families ("id", "name", "slug", "description", "origin_location", "logo_url", "visibility", "status", "settings", "created_by", "created_at", "updated_at") VALUES ('c8179eb0-c98c-48fe-b785-3ae5bb604fdd', 'Họ Bùi xã Tiên sơn, Tiên phước, Đà Nẵng', 'ho-bui-xa-tien-son-tien-phuoc-da-nang', NULL, NULL, NULL, 'private', 'active', '{"blog_max_images_per_post":1}'::jsonb, NULL, '2026-07-13T21:58:54.76767+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;
INSERT INTO public.families ("id", "name", "slug", "description", "origin_location", "logo_url", "visibility", "status", "settings", "created_by", "created_at", "updated_at") VALUES ('08c7740a-6749-418a-8049-626e2929cc94', 'Dòng Họ Bùi Huy làng Bách Cốc- Ninh Bình', 'dong-ho-bui-huy-lang-bach-coc-ninh-binh', NULL, NULL, NULL, 'private', 'active', '{"blog_max_images_per_post":1}'::jsonb, NULL, '2026-07-15T00:12:45.140713+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;
INSERT INTO public.families ("id", "name", "slug", "description", "origin_location", "logo_url", "visibility", "status", "settings", "created_by", "created_at", "updated_at") VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'Dòng họ Văn Hà Nội', 'dong-ho-van', 'Dòng họ mẫu dùng để kiểm thử chế độ riêng tư multi-tenant.', 'Hà Nội', NULL, 'private', 'active', '{"blog_max_images_per_post":1}'::jsonb, NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;
INSERT INTO public.families ("id", "name", "slug", "description", "origin_location", "logo_url", "visibility", "status", "settings", "created_by", "created_at", "updated_at") VALUES ('579443a8-3e80-42c8-9f05-1d55c9f9069e', 'Dòng họ Diệp Dụng', 'dong-ho-diep-dung', 'Dòng họ Diệp Dụng phân bố nhiều tại Thừa Thiên- Huế và các tỉnh  thành lân cận.', NULL, NULL, 'private', 'active', '{"blog_max_images_per_post":1}'::jsonb, NULL, '2026-08-20T17:58:00.113849+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;

-- 4. CÂY GIA PHẢ
-- Table: public.family_trees (10 rows)
INSERT INTO public.family_trees ("id", "family_id", "name", "slug", "description", "root_person_id", "visibility", "is_primary", "created_by", "created_at", "updated_at") VALUES ('fe671fe9-30c5-4b2f-a954-a413b7a1b931', 'c8179eb0-c98c-48fe-b785-3ae5bb604fdd', 'TỘC BÙI TIÊN SƠN', 'cay-gia-pha-chinh', 'Tộc Bùi tại thôn 4, xã Tiên Sơn có 5 chi.', NULL, 'family_only', true, 'e166397e-8bd4-4cd4-b79b-10a346fd19a7', '2026-07-13T22:26:15.692619+07:00', '2026-07-13T22:26:15.692619+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_trees ("id", "family_id", "name", "slug", "description", "root_person_id", "visibility", "is_primary", "created_by", "created_at", "updated_at") VALUES ('b2e8ed31-47ef-404a-abd6-a6831e00a95f', '579443a8-3e80-42c8-9f05-1d55c9f9069e', 'Họ diệp Việt Nam!', 'ho-diep-viet-nam', NULL, NULL, 'private', false, '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-20T18:44:10.314205+07:00', '2026-09-16T13:04:28.648114+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_trees ("id", "family_id", "name", "slug", "description", "root_person_id", "visibility", "is_primary", "created_by", "created_at", "updated_at") VALUES ('08613007-4c30-4f49-b5c3-6e4d5794e85a', '579443a8-3e80-42c8-9f05-1d55c9f9069e', 'Dòng họ Diệp Dụng Tộc', 'dong-ho-diep-dung-toc', 'Họ diệp dụng tp huế', NULL, 'family_only', false, '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-09-15T18:43:55.477741+07:00', '2026-09-16T13:04:28.648114+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_trees ("id", "family_id", "name", "slug", "description", "root_person_id", "visibility", "is_primary", "created_by", "created_at", "updated_at") VALUES ('cc200c3a-6ed9-4349-81f7-54803ee18fbd', '579443a8-3e80-42c8-9f05-1d55c9f9069e', 'Họ diệp Việt Nam!', 'diep-dung-toc', NULL, NULL, 'private', false, '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-20T18:44:32.498519+07:00', '2026-09-16T13:04:28.648114+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_trees ("id", "family_id", "name", "slug", "description", "root_person_id", "visibility", "is_primary", "created_by", "created_at", "updated_at") VALUES ('4007f2e0-35a0-4c9b-a484-dde23f450335', '579443a8-3e80-42c8-9f05-1d55c9f9069e', 'Dòng họ Diệp Dụng', 'dong-ho-diep-dung', NULL, NULL, 'private', false, '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-09-16T13:04:09.368372+07:00', '2026-09-16T13:04:28.648114+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_trees ("id", "family_id", "name", "slug", "description", "root_person_id", "visibility", "is_primary", "created_by", "created_at", "updated_at") VALUES ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Cây gia phả chính', 'cay-chinh', 'Cây gia phả mặc định của dòng họ mẫu.', '10000000-0000-0000-0000-000000000001', 'private', true, NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_trees ("id", "family_id", "name", "slug", "description", "root_person_id", "visibility", "is_primary", "created_by", "created_at", "updated_at") VALUES ('65caa978-1d42-4db8-bf41-8e7529d27b85', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', 'Cay gia pha chinh', 'cay-chinh', 'Cay gia pha mac dinh', NULL, 'private', true, NULL, '2026-07-13T15:14:23.996578+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_trees ("id", "family_id", "name", "slug", "description", "root_person_id", "visibility", "is_primary", "created_by", "created_at", "updated_at") VALUES ('e98c6921-5e59-492b-b936-0c8ce542fdbd', 'c8179eb0-c98c-48fe-b785-3ae5bb604fdd', 'Cay gia pha chinh', 'cay-chinh', 'Cay gia pha mac dinh', NULL, 'private', false, NULL, '2026-07-13T21:58:54.76767+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_trees ("id", "family_id", "name", "slug", "description", "root_person_id", "visibility", "is_primary", "created_by", "created_at", "updated_at") VALUES ('f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', '08c7740a-6749-418a-8049-626e2929cc94', 'Cay gia pha chinh', 'cay-chinh', 'Cay gia pha mac dinh', NULL, 'private', true, NULL, '2026-07-15T00:12:45.140713+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_trees ("id", "family_id", "name", "slug", "description", "root_person_id", "visibility", "is_primary", "created_by", "created_at", "updated_at") VALUES ('9a6c4727-e453-4aea-8650-df28d8434c40', '579443a8-3e80-42c8-9f05-1d55c9f9069e', 'Cay gia pha chinh', 'cay-chinh', 'Cay gia pha mac dinh', NULL, 'private', false, NULL, '2026-08-20T17:58:00.113849+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;

-- 5. QUYỀN QUẢN LÝ DÒNG HỌ
-- Table: public.family_memberships (10 rows)
INSERT INTO public.family_memberships ("id", "family_id", "profile_id", "role", "status", "invited_by", "invited_at", "joined_at", "created_at", "updated_at", "is_primary_admin") VALUES ('92aea2cf-67c0-4a63-a986-b0cf62ed5742', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '1265843f-5934-419c-99e4-83f8622c8372', 'member', 'active', '61519138-9dd2-43fd-ad5f-47ed448d97be', NULL, '2026-08-24T16:03:39.19058+07:00', '2026-08-24T16:03:39.19058+07:00', '2026-08-24T16:03:39.19058+07:00', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_memberships ("id", "family_id", "profile_id", "role", "status", "invited_by", "invited_at", "joined_at", "created_at", "updated_at", "is_primary_admin") VALUES ('65bd6a17-302a-4c15-a826-191e865ba5ca', '579443a8-3e80-42c8-9f05-1d55c9f9069e', 'acb0f717-16d8-44b5-aed8-1a83efd313ef', 'member', 'active', '61519138-9dd2-43fd-ad5f-47ed448d97be', NULL, '2026-08-24T16:03:57.436661+07:00', '2026-08-24T16:03:57.436661+07:00', '2026-08-24T16:03:57.436661+07:00', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_memberships ("id", "family_id", "profile_id", "role", "status", "invited_by", "invited_at", "joined_at", "created_at", "updated_at", "is_primary_admin") VALUES ('9d45318b-378c-4dfe-8d4b-f4302db746fd', 'aaaaaaaa-0000-0000-0000-000000000001', '28920a8b-b8cf-490e-8057-e9cdb1f506ff', 'member', 'active', NULL, NULL, '2026-07-07T23:04:44.056942+07:00', '2026-07-07T23:04:44.056942+07:00', '2026-09-29T23:21:06.762569+07:00', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_memberships ("id", "family_id", "profile_id", "role", "status", "invited_by", "invited_at", "joined_at", "created_at", "updated_at", "is_primary_admin") VALUES ('117b86e3-5fc5-4a8a-8f02-0e5061c908ad', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '359ba919-c8d4-44c5-8a94-47d90acb3e28', 'family_admin', 'active', NULL, NULL, '2026-07-13T15:14:23.996578+07:00', '2026-07-13T15:14:23.996578+07:00', '2026-09-29T23:21:06.762569+07:00', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_memberships ("id", "family_id", "profile_id", "role", "status", "invited_by", "invited_at", "joined_at", "created_at", "updated_at", "is_primary_admin") VALUES ('0688b63e-2e3b-40d9-ad4e-20c9e03f7785', 'c8179eb0-c98c-48fe-b785-3ae5bb604fdd', 'e166397e-8bd4-4cd4-b79b-10a346fd19a7', 'family_admin', 'active', NULL, NULL, '2026-07-13T21:58:54.76767+07:00', '2026-07-13T21:58:54.76767+07:00', '2026-09-29T23:21:06.762569+07:00', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_memberships ("id", "family_id", "profile_id", "role", "status", "invited_by", "invited_at", "joined_at", "created_at", "updated_at", "is_primary_admin") VALUES ('7f6ecfdf-12d8-436e-9482-23be01d939a8', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '61519138-9dd2-43fd-ad5f-47ed448d97be', 'family_admin', 'active', NULL, NULL, '2026-08-20T17:58:00.113849+07:00', '2026-08-20T17:58:00.113849+07:00', '2026-09-29T23:21:06.762569+07:00', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_memberships ("id", "family_id", "profile_id", "role", "status", "invited_by", "invited_at", "joined_at", "created_at", "updated_at", "is_primary_admin") VALUES ('8ea24120-db40-4972-ad79-765b5c4d373c', 'aaaaaaaa-0000-0000-0000-000000000001', 'ddd2d524-ccaa-4770-84ff-1a1c4a8fd72c', 'member', 'active', NULL, NULL, '2026-07-23T21:52:26.009053+07:00', '2026-07-23T21:52:26.009053+07:00', '2026-09-29T23:22:04.443632+07:00', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_memberships ("id", "family_id", "profile_id", "role", "status", "invited_by", "invited_at", "joined_at", "created_at", "updated_at", "is_primary_admin") VALUES ('eb48a91a-728e-466d-8695-dded9bad08b9', 'aaaaaaaa-0000-0000-0000-000000000001', 'fe44abad-d365-4edf-98ee-4fb85ad46a18', 'family_admin', 'active', 'b8ec1fb6-a925-4105-8596-779247b5ecd9', NULL, '2026-09-29T23:37:33.760139+07:00', '2026-09-29T23:37:33.760139+07:00', '2026-09-29T23:37:33.760139+07:00', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_memberships ("id", "family_id", "profile_id", "role", "status", "invited_by", "invited_at", "joined_at", "created_at", "updated_at", "is_primary_admin") VALUES ('737eda52-0155-4c83-bbb6-a98aaa89741a', '08c7740a-6749-418a-8049-626e2929cc94', 'e7a57e83-ab20-4c5b-9c87-caf4aebdb0b1', 'member', 'active', 'b8ec1fb6-a925-4105-8596-779247b5ecd9', NULL, '2026-09-29T23:40:00.311067+07:00', '2026-09-29T23:40:00.311067+07:00', '2026-09-29T23:40:00.311067+07:00', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.family_memberships ("id", "family_id", "profile_id", "role", "status", "invited_by", "invited_at", "joined_at", "created_at", "updated_at", "is_primary_admin") VALUES ('ddc66668-bb5b-4e35-9753-875f1769ed6f', '08c7740a-6749-418a-8049-626e2929cc94', 'be5fce2d-d628-4eb7-b705-23a8eb41198e', 'family_admin', 'active', 'b8ec1fb6-a925-4105-8596-779247b5ecd9', NULL, '2026-10-21T20:31:22.738978+07:00', '2026-10-21T20:31:22.738978+07:00', '2026-10-21T20:31:22.738978+07:00', true) ON CONFLICT (id) DO NOTHING;

-- 6. THÀNH VIÊN GIA PHẢ
-- Table: public.persons (197 rows)
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('6b2c434f-74c6-4762-b5cc-cea36e723f13', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Thị Ráy', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 1, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:28:48.662845+07:00', '2026-07-14T16:20:24.835397+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('84639a11-141e-4fbb-9913-a88579756a0d', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp Hoà', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, 4, true, false, 2, 1, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:26:13.707244+07:00', '2026-08-24T11:26:15.424931+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('c22a62b1-9d89-48e6-a14a-f93fce55dcf8', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc lành', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 2, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:30:01.928533+07:00', '2026-08-24T11:30:02.801793+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('9fb5163b-a825-4261-acba-4a7d4b84cee7', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc cường', 'male', 1966, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 4, 2, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:30:06.414011+07:00', '2026-08-24T11:30:07.280911+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000015', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Tran Bao Chi', 'female', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, NULL, 'Chau nhanh ong Bao.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('b2edf70b-0e1e-4e80-874c-0a76a062956f', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Văn Thự', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:32:02.186052+07:00', '2026-07-14T16:29:03.359861+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('361c455d-968a-459c-b34e-d81c2ad3fa4c', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Miên', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 3, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:42:21.019716+07:00', '2026-07-14T16:29:48.12951+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('42d15035-d927-4d56-85f8-be2d4be8fe8e', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Văn Chiên', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 1, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T16:39:05.930206+07:00', '2026-07-14T19:06:34.237849+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('1b00a72b-6dc5-4672-8690-b71bd03e8d6a', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Đỗ Hữu Cường', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:53:19.066554+07:00', '2026-07-16T12:53:21.261301+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('f6da4ce0-d3e0-495a-b021-55481984b678', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Văn Vãng', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T15:01:24.758415+07:00', '2026-07-14T19:03:43.234663+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('9bbe39bb-f998-4ea5-b66e-69a767344f45', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Văn Chuẩn', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 2, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T16:13:58.550178+07:00', '2026-07-14T19:04:48.061735+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000016', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Dang Dao Long', 'male', 1996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, NULL, 'Chau nhanh ba Dao.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('10000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Bình Thị Mộc', 'female', 1908, NULL, NULL, 1980, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 1, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/10000000-0000-0000-0000-000000000002_binh-thi-moc.png', 'Tổ mẫu, người giữ nếp nhà qua nhiều thế hệ.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('10aeffc4-971c-4fa8-b2f2-6e98aee781e4', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Lứu', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-15T10:35:18.72162+07:00', '2026-07-15T10:35:20.036476+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('b6c57361-45e1-4d8c-b4a2-2d861d017b6c', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Như Phiên', 'male', NULL, NULL, NULL, 1950, 12, 27, 1950, 11, 19, true, false, 3, 2, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:05:21.554369+07:00', '2026-07-14T14:10:19.465765+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('c0d345df-ce22-41cd-b914-10a781880810', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Lệ Thanh', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:42:21.513858+07:00', '2026-07-16T10:42:23.022467+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('56170356-3096-484f-add0-1aab9f7876ed', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Xâm', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:42:33.431832+07:00', '2026-07-16T10:42:34.29696+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('ae07dce8-9213-4944-b74f-e1a5475380ae', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Chuyện', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 5, 2, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:14:43.301752+07:00', '2026-07-14T16:09:20.893646+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('555eefd0-be21-40ac-aa8e-90db6cea441f', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Như Thức', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 2, 2, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:14:28.598973+07:00', '2026-07-14T16:20:57.014301+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('03bd44a6-b66b-451b-ac81-fb52678e5719', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Bông', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 2, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:39:27.416398+07:00', '2026-07-14T16:21:30.486264+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('e2beb12a-ecb9-45db-a50c-18c56c4ff218', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Đinh Thị Láng', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 15, true, true, NULL, 2, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:07:19.485927+07:00', '2026-07-14T16:22:27.039867+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('221352e3-f736-40d5-8c6e-d605b46ea2fd', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Duyên', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 4, 2, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:14:38.018335+07:00', '2026-07-14T16:23:44.370007+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('0f5ddc21-b098-4359-9c7c-516eb7cdb781', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Côi', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 6, 2, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:14:48.270411+07:00', '2026-07-14T16:25:48.852649+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('5d23ce9f-e184-47d7-866a-25c725fd84eb', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Văn Liên', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:34:19.360498+07:00', '2026-07-14T16:26:35.886059+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('ed97f29f-8801-4b7f-8d06-eb0e10e12444', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Thị Hay', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-15T10:31:27.978955+07:00', '2026-07-16T11:05:11.122836+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('08f379ba-945c-4859-824a-dcdd09bfd354', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Như Phức', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 1, 2, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:14:22.138258+07:00', '2026-07-14T13:27:42.877151+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('1fbacf8c-1539-4ff7-ac81-5ccf476848ed', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Như Mỹ', 'male', NULL, NULL, NULL, NULL, 7, 27, NULL, NULL, NULL, true, false, 1, 1, 'Cụ tổ', NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T12:31:20.950586+07:00', '2026-07-14T13:27:43.27213+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('be39076c-4110-4832-be63-4fc533f40ef1', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Văn Tuyến', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 4, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:42:26.263736+07:00', '2026-07-14T16:31:39.147402+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('37889aac-9e63-4cf4-b52b-e25f2538a25c', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Văn Nhuận', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 1, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:27:19.435264+07:00', '2026-07-14T16:32:51.872996+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('55ef6f28-ea7f-49c1-acf6-17133bc54776', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Thị Mài', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 1, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:33:16.546069+07:00', '2026-07-14T16:34:10.901383+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('1a79cba9-490b-4b11-9bfb-5cdb65e0f493', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Văn Kiên', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 1, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:36:01.836824+07:00', '2026-07-14T16:34:58.791769+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('792fb676-bd8d-4beb-8712-f168f640fdb1', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyen Thi Thanh', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 1, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T15:02:36.703275+07:00', '2026-07-14T16:36:25.507121+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('9ca8cc47-7739-4b5f-8d75-d9db2320837e', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Đỗ Thị Thu Hồng', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:53:26.352209+07:00', '2026-07-16T12:53:27.718992+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('ef7cd8f0-e14f-4610-b226-6678520e4059', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Phạm Văn Thức', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 2, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:21:07.217852+07:00', '2026-07-14T16:18:03.082306+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('1801c1c9-e254-4cd8-a106-d782bdaff804', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Thị Sáu', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 2, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:39:53.127827+07:00', '2026-07-14T16:19:55.558166+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('d93a05f6-f232-48c2-81d1-6ce45a9a2fa8', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Hoàng thị vện', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 1, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:27:30.636645+07:00', '2026-08-24T11:27:31.840624+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('139cbc9f-8afd-4d1c-bd32-783c55205973', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Bùi Kim Tuyến', 'female', 1965, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 2, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:20:30.998023+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('905e1d6f-9641-4499-9886-d669b86f9487', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Văn Sinh', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 5, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:49:14.593496+07:00', '2026-07-16T10:49:15.476129+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('da9219b7-75f8-4586-a5ab-4c750e78ff98', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Văn Diến', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-15T10:40:28.344124+07:00', '2026-07-15T10:40:30.35928+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('6f9a2fdc-b201-4dc4-9250-32d855876b0f', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Văn Thắng', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-15T10:40:37.11489+07:00', '2026-07-15T10:40:38.562999+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('1bde3165-d350-411f-af35-9c158a54ad79', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Loan', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-15T10:40:42.334971+07:00', '2026-07-15T10:40:43.684479+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('77bc5f76-7324-4ef1-afc0-826a116b4f21', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Văn Khiên', 'male', NULL, NULL, NULL, 1985, 11, 9, 1985, 9, 27, true, false, 2, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T16:39:10.982948+07:00', '2026-07-16T10:24:03.331667+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('aa4a0ff5-f200-4e53-84b0-86b3b642ef7b', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Văn Luyến', 'male', 1940, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 4, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:42:38.829653+07:00', '2026-07-16T10:42:39.724571+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('ffdc2e0f-2987-4504-b712-85658f40e191', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Thị Lịch', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:48:51.8643+07:00', '2026-07-16T10:48:54.43013+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('79e4671a-272d-4a6e-8779-649f1f0987a7', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Tiến Lực', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:49:05.871683+07:00', '2026-07-16T10:49:06.73455+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('eeed4b66-6801-4823-836b-7e4867be4fa4', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Ngọc Thái', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 2, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:42:27.864706+07:00', '2026-07-16T10:51:35.550241+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('98cc6ca9-dd53-469c-8241-9b7595d9730d', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Thị Nhật', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:52:33.632383+07:00', '2026-07-16T10:52:35.232122+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('636bf983-33ed-4d13-83e8-fddafb617aed', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Phùng Đức Sơn', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:55:57.16404+07:00', '2026-07-16T10:55:59.692619+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('d486ee6e-d5f9-4532-9fb4-4e8ad3167008', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Phùng Thị Xuân', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:56:09.59183+07:00', '2026-07-16T10:56:10.414647+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('ef733d8e-31e5-4366-aa81-ed89dcbd1731', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Phùng Thị Dung', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 4, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:56:13.962372+07:00', '2026-07-16T10:56:15.30183+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('9a9871dd-3e4f-4299-967f-1fc64c993095', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Ngọc Tuấn', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:59:25.147622+07:00', '2026-07-16T10:59:26.147486+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('ece1c503-f33c-4cde-9dd4-49a776553dbe', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Minh Tân', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 4, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:59:33.433482+07:00', '2026-07-16T10:59:34.266737+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('2fda717b-ff86-4c27-ab16-2b3672eee61a', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Nam Trung', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 5, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:59:37.551821+07:00', '2026-07-16T10:59:38.496911+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('b4cfb439-24ab-4b40-a22a-85a3ed674e96', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Mạnh Hà', 'male', 1971, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T11:04:06.514153+07:00', '2026-07-16T11:04:09.367072+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('7b59cb64-40a2-4353-9d78-9f28c2e3b90f', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Kim Hoa', 'female', 1982, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T11:04:46.957129+07:00', '2026-07-16T11:04:54.720574+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('a5081ca7-644b-4463-a45f-935fd9d07a37', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Phạm Thị Chuột', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-15T10:32:46.29823+07:00', '2026-07-16T11:06:20.269393+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('65ea7c78-a947-46d8-8164-486234ea4c59', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'NGuyễn Thị Quyệt', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:14:12.916715+07:00', '2026-07-16T12:14:14.494218+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('225ee14c-a0f5-4a3b-8dd1-c02b8663ceef', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Nhàn', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:15:35.434417+07:00', '2026-07-16T12:15:38.064826+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('259a981b-9535-4212-b026-6fe54c5286d1', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Bùi Thị Thể', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:30:05.193701+07:00', '2026-07-16T12:30:06.351609+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('26574357-aa88-4640-aa6f-25868b26b37b', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Bùi Thị Dự', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:30:15.931204+07:00', '2026-07-16T12:30:16.802435+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('ba130642-4d63-426e-b491-a72449529558', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Bùi Huy Tặng', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 5, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:30:26.373833+07:00', '2026-07-16T12:30:27.738638+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('26e5d65b-0f14-4dd4-a30b-0dc8d51d1bfa', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Thừa', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 1, 4, 'Chết trẻ', NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:34:23.178301+07:00', '2026-07-16T12:36:24.982886+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('3b457aa0-56f9-44ac-b4ad-d0bc00e357c3', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Đỗ Hữu Mạo', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:42:15.406879+07:00', '2026-07-16T12:42:16.987765+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('533c0e06-a2ac-4ebe-9d53-d3cc247af203', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Xuân Yên', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:50:19.887583+07:00', '2026-07-16T12:50:21.912293+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('1cedd656-de58-4a27-a3f3-3f83bc8acc19', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Thị Mậu', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:50:32.237467+07:00', '2026-07-16T12:50:34.069468+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('22d83233-0637-458a-9b27-fbcfa24b1660', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Khuê Dinh', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 4, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:50:38.56355+07:00', '2026-07-16T12:50:39.661266+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('b5147c5a-352b-442a-841a-c6f637ed73b5', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Phương Đông', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 5, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:50:42.921447+07:00', '2026-07-16T12:50:43.787614+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('9e7f38e5-4ff8-49a3-97b0-a8addc41b48d', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Thị Nguyệt', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 6, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:50:47.178304+07:00', '2026-07-16T12:50:48.041674+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('5a063f83-f471-4a87-930c-cbd373062e21', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Bùi Văn Tâm', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:30:10.89118+07:00', '2026-07-16T12:30:11.796545+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('d2da9a2b-9cd3-4995-9c37-429d0e575d06', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Đỗ Thị Thu Hương', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:53:31.628332+07:00', '2026-07-16T12:53:32.492744+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('05ad9a94-4f8e-459e-8771-d22f2a8a10a7', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Thị Thanh', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 2, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:33:21.937997+07:00', '2026-07-14T16:35:54.203628+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('76f7ed80-8ab9-45bc-b0de-252fcd8c86bb', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyen Thi Suu', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 2, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T15:02:44.720213+07:00', '2026-07-14T16:36:54.463742+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('d1c6ca36-52fd-4413-bb8a-c07c77bcc939', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Thị Chua', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:36:10.929558+07:00', '2026-07-14T14:36:11.76705+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('90906295-d908-4475-a943-e69c70780b2f', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc yên', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 2, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:29:50.849659+07:00', '2026-08-24T11:29:52.049942+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('168bef6f-99b3-4a0e-b5a6-bdfbd492fc95', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Văn Hàm', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 2, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:25:17.235838+07:00', '2026-07-14T16:17:04.171921+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('a3b3554a-3985-4b0f-bcc7-4a33719ce0f4', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Thị Hẹ', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 2, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:25:28.543341+07:00', '2026-07-14T16:19:00.210751+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('68d2b865-f241-4a58-8757-317231a3f90c', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Văn Chinh', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 2, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:23:45.097801+07:00', '2026-07-14T16:24:16.611737+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('994fcc54-da88-42b6-9ef5-ade3d837250f', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Phùng Thị Mai', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:56:03.840753+07:00', '2026-07-16T10:56:05.219029+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('0e803523-4e04-4d9d-93ab-c873b809b24b', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp thị bê', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 2, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:29:56.472386+07:00', '2026-08-24T11:29:57.381935+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('e25aa323-e74e-48d3-922c-638c0f805c69', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Văn Nhiên', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-15T10:35:10.907351+07:00', '2026-07-15T10:35:12.98481+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('c528726e-e46d-4a68-ba2c-adf0bff6f441', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Nghiên', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 2, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:42:15.780052+07:00', '2026-07-15T10:44:42.726145+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('e15d5d24-5a8d-476e-a46c-01205f571d47', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Văn Dua', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 2, 4, NULL, NULL, 'Liệt Sĩ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:36:06.375393+07:00', '2026-07-16T10:18:21.214246+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('c2d262a9-532c-478e-8bac-95c487c4ecf5', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Phạm Thị Mòng', 'female', NULL, NULL, NULL, 1961, 7, 22, 1961, 6, 10, true, true, NULL, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:32:46.761995+07:00', '2026-07-16T10:34:26.784906+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('c378eba0-fd41-4557-be03-c3e0270257ea', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Hiên', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, 9, true, false, 1, 3, NULL, NULL, 'Chết trẻ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:42:10.678333+07:00', '2026-07-16T10:35:57.82361+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('ee7a02f6-a2da-4fac-9191-4483235e75b0', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Văn Bằng', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 1, 3, 'Chết trẻ', NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:26:03.571862+07:00', '2026-07-16T10:38:44.20492+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('0d4771e3-79fb-4054-97eb-8284fe8a3467', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Bùi Huy Cận', 'male', 1942, NULL, NULL, 2011, 8, 1, 2011, 7, 2, true, false, NULL, 1, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:15:45.354015+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('f9b21f9e-6f10-42e0-bf37-f2c37a35be75', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'NGuyễn Văn Thứ', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:44:23.35523+07:00', '2026-07-16T10:44:24.887755+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('18ad4003-5929-44d6-b306-9dd76757c082', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Văn Tự', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:48:59.866967+07:00', '2026-07-16T10:49:01.693243+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('c0190d18-c64c-4761-afbf-56e416758ed7', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Thị Cúc', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 4, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:49:10.387158+07:00', '2026-07-16T10:49:11.213276+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('10cebb25-4f5d-49b2-8355-90968340e0eb', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Thị Sản', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 6, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:49:18.648613+07:00', '2026-07-16T10:49:19.484064+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('beee715b-683c-4774-8f75-35d393a1b3c2', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Phùng Đức Lĩnh', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:54:29.503129+07:00', '2026-07-16T10:54:31.510673+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('d0b49f00-5a27-4d24-9d55-6605c61e87e3', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Thanh', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:59:19.36153+07:00', '2026-07-16T10:59:20.475694+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('06bc38f2-7216-4bbb-9d52-249fa7c91cb2', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Bích Thủy', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:59:29.500632+07:00', '2026-07-16T10:59:30.355253+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('a88d44ea-537f-4182-9ce5-de63344da36c', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Thị Cất', 'female', 1946, NULL, NULL, 2020, 12, 10, 2020, 10, 26, true, true, NULL, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T11:01:22.12344+07:00', '2026-07-16T11:02:29.821226+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('d4bdb4a4-1cf6-4737-86d0-51b962b82df2', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Hiền', 'female', 1979, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T11:04:21.132951+07:00', '2026-07-16T11:04:26.055704+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('d5cede48-4e63-4f11-98ce-9080ae14ca9f', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Nam', 'male', 1984, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 4, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T11:05:09.096258+07:00', '2026-07-16T11:05:11.940139+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('17e77cb4-90a2-43fd-8461-1b4e0534d07f', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Văn Điền', 'male', NULL, NULL, NULL, NULL, 7, 27, NULL, NULL, NULL, true, false, 1, 4, NULL, NULL, 'Liệt Sĩ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:15:28.734834+07:00', '2026-07-16T12:17:14.44276+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('601280b3-9155-4144-9caa-3a4d910bdb14', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Xuân Lâm', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 5, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:50:26.800754+07:00', '2026-07-16T12:50:28.146509+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('934c7aea-fd4c-4200-bc67-b598df733307', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Thị Sen', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 1, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:28:03.397248+07:00', '2026-07-16T12:22:53.629358+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('ae3cef55-cf99-4a26-be55-10257813968a', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Bùi Văn Nhân', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:27:40.956665+07:00', '2026-07-16T12:27:43.066212+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('cd412ff5-b955-4e0d-976b-211cc9c7a2ea', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Bùi Thị Khánh', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 4, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:30:21.879416+07:00', '2026-07-16T12:30:22.728845+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('e8e6e897-fb35-46ff-9189-d9301174dd6c', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'NGuyễn THị Tỵ', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:33:16.197046+07:00', '2026-07-16T12:33:17.856064+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('4be3b08c-c7de-443f-8076-e4d276a7d893', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Văn Quý', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 2, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:34:30.418404+07:00', '2026-07-16T12:35:09.503274+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('0f8337d0-cd19-41eb-9363-080bafa3aeba', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Trần Thị Bé', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 5, 3, 'Chết trẻ', NULL, 'Chết trẻ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:42:30.698832+07:00', '2026-07-16T12:37:25.530169+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('d74816a0-0e06-43e0-b71c-1dcf982f1d44', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'Nguyễn Xuân Ưng', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 4, NULL, NULL, NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:46:39.076291+07:00', '2026-07-16T12:46:41.085407+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000008', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Van Cong Dat', 'male', 1971, 8, 14, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 3, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000008_van-cong-dat.jpg', 'Con ong Phuc.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000010', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Tran Van Bao', 'male', 1967, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 3, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000010_tran-van-bao.jpg', 'Con ba Lan.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000011', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Tran Thi Dao', 'female', 1970, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 3, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000011_tran-thi-dao.jpg', 'Con ba Lan.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Ngô Thị Hiền', 'female', 1961, 5, 8, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, 'Bà Trí', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000002_ngo-thi-hien.jpg', 'Vợ của ông Trí.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('10000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Văn Công Gốc', 'male', 1902, 8, 26, 1975, 10, 12, 1975, 9, 8, true, false, NULL, 1, 'Cụ Tổ', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/10000000-0000-0000-0000-000000000001_van-cong-goc.png', 'Ông Tổ của dòng họ Văn.
Là người khai hoang lập làng tại Hà Nội.
Tham gia 2 cuộc kháng chiến chống Pháp, chống Mỹ trong quân đội. Được nhà nước tăng nhiều huân huy chương, kỷ niệm chương. Mang quân hàm Thiếu tá trước khi nghỉ hưu.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000009', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Van Khoa Phong', 'male', 1991, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/40000000-0000-0000-0000-000000000009_van-khoa-phong.png', 'Là kỹ sư xây dựng, tâm huyết nhiệt tình hỗ trợ công việc dòng họ.
Có đóng góp trong việc xây dựng từ đường họ Văn', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('880898a7-e704-4e09-86a8-5f227294be68', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc trình', 'male', 1969, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 5, 2, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:30:10.923494+07:00', '2026-08-24T11:30:12.32865+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('c532fe6c-dba9-40ad-a699-4f89e2bce664', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc trọng', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 6, 2, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:30:16.225063+07:00', '2026-08-24T11:30:17.655487+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('5e16750d-acfb-4416-9e56-ab6373040d9b', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp thị tuyết', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 8, 2, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:30:26.926711+07:00', '2026-08-24T11:30:27.842367+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('92278cce-cfea-4098-8602-02663e2544d0', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc trinh', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 7, 2, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:30:22.122295+07:00', '2026-08-24T11:30:23.082218+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('a0412461-d235-4ef9-99d2-15c54a79a63e', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phuc bằng', 'male', 1988, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:40:59.155045+07:00', '2026-08-24T11:41:00.416602+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('06502971-3c04-41f0-90b4-d4f4b5c480cf', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc an', 'male', 1990, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:41:06.54046+07:00', '2026-08-24T11:41:08.504918+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('244c44f4-2fd1-48fb-9400-b0f76f9c0f12', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp thị diệu', 'female', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:41:12.599026+07:00', '2026-08-24T11:41:14.023233+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('09ca99b9-13fe-40d1-8c0f-70f2c1eb54de', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phi long', 'male', 2020, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:43:44.246879+07:00', '2026-08-24T11:46:45.062977+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('4cb07dcd-2ce9-4ae1-bc95-b52ecaed15da', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp thiên Di', 'female', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 4, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:49:23.791484+07:00', '2026-08-24T11:49:24.934289+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('3dccb922-3dac-4da4-980f-ce3bec1d91fa', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp thị đào', 'female', 1988, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:02:58.154699+07:00', '2026-08-24T12:03:00.611407+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('4ce356fe-1a1e-4699-968c-f499eb7b4769', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc Đức', 'male', 1990, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:03:06.430652+07:00', '2026-08-24T12:03:07.382382+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('ce4362b1-351c-4db4-9b14-ce5e096d020c', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc phước', 'male', 1999, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:03:12.248126+07:00', '2026-08-24T12:03:17.770036+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('ddfd0c47-408a-4022-95fb-d4afb8bd8538', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp thị phước', 'female', 1990, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:06:17.912678+07:00', '2026-08-24T12:06:21.562808+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('5431ecfa-6111-46b8-9117-6148b32d6581', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc lộc', 'male', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:06:28.99523+07:00', '2026-08-24T12:06:30.02046+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('a4ad4336-7942-4e42-8299-2e9b7712a502', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp thị quý', 'female', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:06:34.592246+07:00', '2026-08-24T12:06:35.469801+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('8ee041dd-df3c-453c-a6bf-9d2d62da16ef', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc phú', 'male', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 4, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:06:40.412853+07:00', '2026-08-24T12:06:41.338907+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('2216024a-5a76-455b-9f33-078a649cf5c8', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc thọ', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 5, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:06:45.23742+07:00', '2026-08-24T12:06:46.158188+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('18ebe907-b8ca-4f0f-bc37-736868a4365b', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc dương', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:08:42.653771+07:00', '2026-08-24T12:08:44.869415+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('0ae05519-5421-4a44-9c12-fb9e2deb16a3', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc nguyên', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:10:53.360243+07:00', '2026-08-24T12:10:54.731826+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('47e0e359-5658-4fd1-a4bf-7b75b21e8ccc', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc đạt', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:11:04.50627+07:00', '2026-08-24T12:11:05.418457+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('7a849bd2-8fdd-4a2a-bca3-199a2e2c9fab', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp quốc huy', 'male', 1988, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:12:54.67264+07:00', '2026-08-24T12:12:55.629806+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('53244082-157a-4b37-af3b-16958af4fafc', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp thiên di', 'female', 2023, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 4, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:43:51.581057+07:00', '2026-08-24T12:46:56.282005+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40be3fd0-92c6-4c4d-87f1-993a1f7220af', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Nguyễn văn lương', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, 1, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:42:28.331271+07:00', '2026-08-24T12:50:09.710734+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('49d8a517-9082-45b7-8440-bf34035302e8', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp phúc dinh', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:08:53.627143+07:00', '2026-08-24T12:56:31.402709+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('6656c3cd-79f6-46bd-b680-047f2de1a473', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp thị quỳnh', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:08:48.807262+07:00', '2026-08-24T12:57:06.769845+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('5ddc72ed-680a-462a-aa0e-72628fc17873', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp lưu bảo ngọc', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 2, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:11:00.016166+07:00', '2026-08-24T12:57:55.66147+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('ac5b4fa1-4c0b-46eb-b682-af3ff10da61f', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Nguyễn diệp bích trâm', 'female', 2018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T16:09:42.595245+07:00', '2026-08-24T16:09:44.396239+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('28a04072-1ff9-41cb-9aac-3064102a982e', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Nguyễn diệp bích phuong', 'female', 2024, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 4, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T16:09:48.115314+07:00', '2026-08-24T16:09:49.551515+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('3ee550cd-912b-4c4e-8798-2f220f894e99', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Nguyễn quý', 'male', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T16:10:19.688441+07:00', '2026-08-24T16:10:22.121136+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('ae02730a-d49f-4bea-9b91-ec257ed2a464', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Đinh van đạt', 'male', 1984, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T16:11:52.006008+07:00', '2026-08-24T16:11:53.002452+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('2ae12933-9f5c-41b2-a831-d85d3ebbe519', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Trương thị ve', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-25T13:52:37.768296+07:00', '2026-08-25T13:52:39.321416+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('5586dce3-cc18-4abf-883c-9274b58b7e18', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Diệp thị kim hoàng', 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 3, NULL, NULL, NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:12:49.155857+07:00', '2026-09-03T06:25:21.808927+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000010', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Văn Khoa Mỹ', 'female', 1996, 1, 9, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 4, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/40000000-0000-0000-0000-000000000010_van-khoa-my.jpg', 'Luật sư, tham gia tranh tụng nhiều phiên tòa thành công', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000016', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Bui Van Duc', 'male', 1964, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000016_bui-van-duc.jpg', 'Chong cua ba Nga.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000018', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Le Van Tuan', 'male', 1962, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000018_le-van-tuan.jpg', 'Chong cua ba An.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000017', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Pham Thi Que', 'female', 1972, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000017_pham-thi-que.jpg', 'Vo cua ong Dat.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000019', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Vu Thi Yen', 'female', 1969, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000019_vu-thi-yen.jpg', 'Vo cua ong Bao.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('a02a9228-534b-4044-b1db-594b8587e993', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Bùi Văn Viết', 'male', 1915, 8, 13, 2000, 9, 24, 2000, 8, 27, true, false, 1, 2, NULL, NULL, NULL, 'private', NULL, '2026-08-25T06:48:42.539939+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('1d427b18-e443-4918-b87b-960e938a75a8', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Nguyễn Thị Dịu', 'female', 1920, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 2, NULL, NULL, NULL, 'private', NULL, '2026-08-25T06:49:55.194411+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Van Minh Quan', 'male', 1994, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 4, NULL, NULL, 'The he tre dang song tai Da Nang.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Pham Ngoc Linh', 'female', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 4, NULL, NULL, 'Chau ngoai nhanh ba Mai.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000006', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Van Son Ha', 'female', 1990, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, NULL, 'Chau nhanh ong Son.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000007', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Van Son Nam', 'male', 1995, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 4, NULL, NULL, 'Chau nhanh ong Son.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000008', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Do Thu Trang', 'female', 1993, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, NULL, 'Chau nhanh ba Thu.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000011', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Bui Gia Hung', 'male', 1992, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, NULL, 'Chau nhanh ba Nga.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000012', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Bui Gia Linh', 'female', 1997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 4, NULL, NULL, 'Chau nhanh ba Nga.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000013', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Van Dat Nhi', 'female', 1998, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, NULL, 'Chau nhanh ong Dat.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000014', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Le An Khanh', 'male', 1990, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, NULL, 'Chau nhanh ba An.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000020', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Dang Van Minh', 'male', 1968, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000020_dang-van-minh.jpg', 'Chong cua ba Dao.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('20000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Văn Công Thuận', 'male', 1930, NULL, NULL, 2008, NULL, NULL, NULL, NULL, NULL, true, false, 1, 2, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/20000000-0000-0000-0000-000000000001_van-cong-thuan.png', 'Con trưởng, người ghi chép cuốn gia phả viết tay.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('20000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Cẩm Thị Dịu', 'female', 1934, NULL, NULL, 2012, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 2, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/20000000-0000-0000-0000-000000000002_cam-thi-diu.png', 'Vợ của ông Thuận.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('20000000-0000-0000-0000-000000000007', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Le Thi Hoa', 'female', 1940, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 2, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/20000000-0000-0000-0000-000000000007_le-thi-hoa.png', 'Vo cua ong Phuc.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('20000000-0000-0000-0000-000000000008', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Tran Van Binh', 'male', 1937, NULL, NULL, 2010, NULL, NULL, NULL, NULL, NULL, true, true, NULL, 2, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/20000000-0000-0000-0000-000000000008_tran-van-binh.jpg', 'Chong cua ba Lan.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('20000000-0000-0000-0000-000000000006', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Van Thi Tam', 'female', 1945, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 5, 2, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/20000000-0000-0000-0000-000000000006_van-thi-tam.png', 'Thanh vien the he thu hai.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Văn Trí Minh', 'male', 1989, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/40000000-0000-0000-0000-000000000001_van-tri-minh.png', 'Thế hệ trẻ tham gia số hóa gia phả.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000012', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Pham Van Nam', 'male', 1961, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000012_pham-van-nam.jpg', 'Chong cua ba Mai.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000013', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Hoang Thi Lien', 'female', 1968, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000013_hoang-thi-lien.jpg', 'Vo cua ong Son.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000014', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Do Van Hai', 'male', 1966, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000014_do-van-hai.jpg', 'Chong cua ba Thu.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Van Minh Anh', 'female', 1991, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 4, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/40000000-0000-0000-0000-000000000002_van-minh-anh.png', 'The he tre dang song tai Ha Noi.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('20000000-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Van Cong Phuc', 'male', 1936, NULL, NULL, 2015, NULL, NULL, NULL, NULL, NULL, true, false, 2, 2, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/20000000-0000-0000-0000-000000000003_van-cong-phuc.jpg', 'Nhanh phu the he thu hai.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('20000000-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Van Thi Lan', 'female', 1939, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 2, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/20000000-0000-0000-0000-000000000004_van-thi-lan.png', 'Nguoi giu nhieu anh tu lieu gia dinh.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('20000000-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Van Cong Hieu', 'male', 1942, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 4, 2, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/20000000-0000-0000-0000-000000000005_van-cong-hieu.png', 'Song tai que nha.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Van Cong Son', 'male', 1966, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 3, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000004_van-cong-son.jpg', 'Chi nhanh con ong Thuan.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Van Thi Thu', 'female', 1969, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 4, 3, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000005_van-thi-thu.jpg', 'Chi nhanh con ong Thuan.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('40000000-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Pham Ngoc Lam', 'male', 1988, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/40000000-0000-0000-0000-000000000004_pham-ngoc-lam.jpg', 'Chau ngoai nhanh ba Mai.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('406fa088-acad-465f-b5fd-5a72cdfd9678', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Nguyễn Thị Lộc', 'female', 1945, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 1, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:17:48.048205+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Văn Công Trí', 'male', 1958, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 3, 'Ông Trí', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000001_van-cong-tri.jpg', 'Người tiếp tục bảo quản tư liệu dòng họ.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('3e986358-5b2e-4b2f-8b7a-83937f2b4b87', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Nguyễn Thị Hương', 'female', 1983, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 3, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:23:43.783983+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('96c6b2cc-8b71-4fe5-9fcb-304f2a65c333', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Hoàng Thị Nhung', 'female', 1986, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 2, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:31:46.163055+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('f4afcb81-d77d-47fb-a05c-b3ee34dfbb1a', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Vi Sơn Lâm', 'male', 1991, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 3, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:36:04.959509+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('0f4406df-b29a-413c-b810-4214c86e17b3', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Bùi thị Thu Hồng', 'female', 1972, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 4, 2, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:20:50.809757+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('6d8d7ba9-34c8-41b5-84c2-8cfc70733267', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Bùi Huy Hạnh', 'male', 1976, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 5, 2, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:20:55.861383+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('80e8255c-dfdc-4ecc-8a70-00dffafe7fc6', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Nguyễn Thị Hằng', 'female', 1985, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 3, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:23:55.187238+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('017c6581-7ca8-4e55-8ca5-7ae45f5dab10', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Bùi Thị Thanh', 'female', 2011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 3, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:34:01.62458+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('45ff5412-317f-4826-95d1-9b769b7d6e86', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Bùi Huy Tứ', 'male', 2014, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 3, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:34:07.150011+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('0a73c9e1-2b01-4057-adf5-e28eeb96695b', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Lê Văn Viên', 'male', 2010, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 4, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:38:26.442707+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('5013702e-9d82-4642-a06d-1aa0d300a78d', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Bùi Kim Xuyến', 'female', 1969, 1, 9, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 2, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/08c7740a-6749-418a-8049-626e2929cc94/5013702e-9d82-4642-a06d-1aa0d300a78d_bui-kim-xuyen.jpg', NULL, 'private', NULL, '2026-07-15T00:20:39.151585+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Văn Thi Mai', 'female', 1963, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 3, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000003_van-thi-mai.jpg', 'Chi nhanh con ong Thuan.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('ec7aaefc-b66e-432c-bbc4-77d47c1e1c1f', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Bùi Huy Luyến', 'male', 1971, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 3, 2, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:20:45.562049+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000007', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Van Thi Nga', 'female', 1968, 7, 8, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 3, 'Hằng', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000007_van-thi-nga.jpg', 'Con ong Phuc.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('3656c254-e315-4ec4-8796-97ba3a7b7f99', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Nguyễn Hữu Đức', 'male', 1957, NULL, NULL, 1995, 8, 15, 1995, 7, 20, true, true, NULL, 2, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:25:02.473865+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000009', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Tran Thi An', 'female', 1964, 7, 25, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 3, NULL, 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000009_tran-thi-an.jpg', 'Con bà Lan.', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('7f692a94-95e5-4284-96c5-ccaccd8dc77b', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Vi Văn Thắng', 'male', 1966, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 2, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:35:13.528533+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('437fcac0-f25d-4766-bed9-d33163de2bf5', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'Lê Thị Huyền', 'female', 2015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 2, 4, NULL, NULL, NULL, 'private', NULL, '2026-07-15T00:38:33.236038+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000006', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Văn Công Khoa', 'male', 1965, 4, 23, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 1, 3, 'Ông Tèo', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000006_van-cong-khoa.jpg', 'Là kiến trúc sư giỏi, tham gia thiết kế nhiều công trình kiến trúc lớn.
Là người có đóng góp cho dòng họ, thiết kế từ đường Dòng họ Văn Hà Nội, và góp công góp tài chính xây dựng từ đường', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.persons ("id", "family_id", "tree_id", "full_name", "gender", "birth_year", "birth_month", "birth_day", "death_year", "death_month", "death_day", "death_lunar_year", "death_lunar_month", "death_lunar_day", "is_deceased", "is_in_law", "birth_order", "generation", "other_names", "avatar_url", "note", "visibility", "created_by", "created_at", "updated_at", "external_ref") VALUES ('30000000-0000-0000-0000-000000000015', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Nguyen Thi Hanh', 'female', 1967, 6, 17, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, 3, 'Bà', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/avatars/families/aaaaaaaa-0000-0000-0000-000000000001/30000000-0000-0000-0000-000000000015_nguyen-thi-hanh.jpg', 'Là người phụ nữ mẫu mực, đảm đang quán xuyến thu vén việc nhà, lo việc dòng họ, để chồng yên tâm công việc và đạt thành công', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00', NULL) ON CONFLICT (id) DO NOTHING;

-- 7. HỒ SƠ RIÊNG TƯ
-- Table: public.person_details_private (30 rows)
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('40000000-0000-0000-0000-000000000009', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '0567891231', 'Kỹ sư xây dựng', 'Hà Nội', NULL, '2026-07-24T10:28:33.480503+07:00', '2026-07-24T10:28:33.480503+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('30000000-0000-0000-0000-000000000006', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '0123456789', 'Kiến trúc sư', 'Hà Nội', NULL, '2026-07-22T16:24:04.642037+07:00', '2026-07-24T10:32:04.055141+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('1fbacf8c-1539-4ff7-ac81-5ccf476848ed', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, NULL, 'Thôn Thượng Vỹ - Xã Vĩnh Trụ - Tình Ninh Bình', NULL, '2026-07-14T12:31:21.918331+07:00', '2026-07-14T12:31:21.918331+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('b6c57361-45e1-4d8c-b4a2-2d861d017b6c', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Làm ruộng', 'Thôn Thượng Vỹ - xã Vĩnh Trụ - Tỉnh Ninh Bình', NULL, '2026-07-14T13:05:22.390409+07:00', '2026-07-14T13:05:22.390409+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('08f379ba-945c-4859-824a-dcdd09bfd354', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Làm ruộng', 'Thôn Thượng Vỹ - xã Vĩnh Trụ - Tỉnh Ninh Bình', NULL, '2026-07-14T13:22:54.635007+07:00', '2026-07-14T13:22:54.635007+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('f6da4ce0-d3e0-495a-b021-55481984b678', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Làm nông', 'Thôn Thượng Vỹ - Xã Vĩnh Trụ - Tỉnh Ninh Bình', NULL, '2026-07-14T19:03:44.161656+07:00', '2026-07-14T19:03:44.161656+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('9bbe39bb-f998-4ea5-b66e-69a767344f45', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Làm ruộng', 'Thôn Thượng Vỹ - Xã Vĩnh Trụ - Tỉnh Ninh Bình', NULL, '2026-07-14T19:04:48.930621+07:00', '2026-07-14T19:04:48.930621+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('42d15035-d927-4d56-85f8-be2d4be8fe8e', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Làm ruộng', 'Thôn Thượng Vỹ - Xã Vĩnh Trụ - Tỉnh Ninh Bình', NULL, '2026-07-14T19:06:35.188082+07:00', '2026-07-14T19:06:35.188082+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('c528726e-e46d-4a68-ba2c-adf0bff6f441', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Làm ruộng', 'Thôn Thượng Vỹ - xã Vĩnh Trụ - Tình Ninh Bình', NULL, '2026-07-14T13:44:53.316215+07:00', '2026-07-15T10:44:43.647399+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('e15d5d24-5a8d-476e-a46c-01205f571d47', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Liệt sĩ', 'Thôn Thượng Vỹ - xã Vĩnh Trụ - Tỉnh Ninh Bình', NULL, '2026-07-16T10:18:22.123214+07:00', '2026-07-16T10:18:22.123214+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('77bc5f76-7324-4ef1-afc0-826a116b4f21', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Làm ruộng', 'Thôn Thượng Vỹ - xã Vĩnh Trụ - Tỉnh Ninh Bình', NULL, '2026-07-16T10:24:03.797726+07:00', '2026-07-16T10:24:03.797726+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('c2d262a9-532c-478e-8bac-95c487c4ecf5', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Làm ruộng', 'Thôn Thượng Vỹ - xã Vĩnh Trụ - Tỉnh Ninh Bình', NULL, '2026-07-16T10:34:27.214695+07:00', '2026-07-16T10:34:27.214695+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('c378eba0-fd41-4557-be03-c3e0270257ea', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Chết trẻ', 'Thôn Thượng Vỹ - xã Vĩnh Trụ - Tỉnh Ninh Bình', NULL, '2026-07-16T10:35:58.656278+07:00', '2026-07-16T10:35:58.656278+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('ee7a02f6-a2da-4fac-9191-4483235e75b0', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Chết trẻ', 'NT Sóc Cả Sứ -Thôn Thượng Vỹ - xã Vĩnh Trụ - Tỉnh Ninh Bình', NULL, '2026-07-16T10:38:44.604997+07:00', '2026-07-16T10:38:44.604997+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('eeed4b66-6801-4823-836b-7e4867be4fa4', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Lâm Nghiệp', 'NT Mai Sưu - Bắc Ninh', NULL, '2026-07-16T10:51:38.475463+07:00', '2026-07-16T10:51:38.475463+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('a88d44ea-537f-4182-9ce5-de63344da36c', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Giáo viên', 'NT Sóc Cả Sứ -Thôn Thượng Vỹ - xã Vĩnh Trụ - Tỉnh Ninh Bình', NULL, '2026-07-16T11:02:30.233661+07:00', '2026-07-16T11:02:30.233661+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('a5081ca7-644b-4463-a45f-935fd9d07a37', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Làm ruộng', 'NT Sóc Cả Sứ -Thôn Thượng Vỹ - xã Vĩnh Trụ - Tỉnh Ninh Bình', NULL, '2026-07-16T11:06:20.629433+07:00', '2026-07-16T11:06:20.629433+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('17e77cb4-90a2-43fd-8461-1b4e0534d07f', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Liệt Sĩ', 'Cự đông, Cự Tây, Cự Nam, Cự Bắc', NULL, '2026-07-16T12:17:14.83534+07:00', '2026-07-16T12:17:14.83534+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('26e5d65b-0f14-4dd4-a30b-0dc8d51d1bfa', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Chết trẻ', NULL, NULL, '2026-07-16T12:36:25.857014+07:00', '2026-07-16T12:36:25.857014+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('0f8337d0-cd19-41eb-9363-080bafa3aeba', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', NULL, 'Chết trẻ', NULL, NULL, '2026-07-16T12:18:46.756799+07:00', '2026-07-16T12:37:25.88974+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('30000000-0000-0000-0000-000000000015', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '0125798654', 'Nội trợ', 'Hà Nội', NULL, '2026-07-22T17:08:23.812358+07:00', '2026-07-24T10:34:23.21587+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('40000000-0000-0000-0000-000000000010', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '0765849312', 'Luật sư', 'Hà Nội', NULL, '2026-07-24T10:36:49.569658+07:00', '2026-07-24T10:36:49.569658+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('84639a11-141e-4fbb-9913-a88579756a0d', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', NULL, NULL, 'Phong thu phong mỹ phong điền thua thiên huê', NULL, '2026-08-24T11:26:14.654955+07:00', '2026-08-24T11:26:14.654955+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('30000000-0000-0000-0000-000000000007', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', NULL, NULL, 'Xóm A Bình Luc, Ninh Bình (Hà Nam cũ)', NULL, '2026-07-22T17:20:11.069124+07:00', '2026-07-22T17:20:17.867421+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('30000000-0000-0000-0000-000000000016', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '0567823657', 'Thợ điện lạnh', 'Xóm A Bình Luc, Ninh Bình (Hà Nam cũ)', NULL, '2026-07-22T17:22:29.859015+07:00', '2026-07-22T17:22:35.272397+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('30000000-0000-0000-0000-000000000008', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '0135795370', 'Thấy phong thủy', 'Bình Lục Ninh Bình (Hà Nam cũ)', NULL, '2026-07-23T08:52:07.257094+07:00', '2026-07-23T08:52:16.222595+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('30000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '0975xxx001', 'Kỹ sư xây dựng', 'Hà Nội', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-07-23T09:14:10.63031+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('30000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', NULL, NULL, 'Hà Nội', NULL, '2026-07-23T09:15:19.615578+07:00', '2026-07-23T09:15:19.615578+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('40000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '09xx xxx 101', 'Lập trình viên', 'Hà Nội', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-07-23T09:18:10.231867+07:00') ON CONFLICT (person_id) DO NOTHING;
INSERT INTO public.person_details_private ("person_id", "family_id", "tree_id", "phone_number", "occupation", "current_residence", "sensitive_note", "created_at", "updated_at") VALUES ('10000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', NULL, NULL, 'Hoa Xá, Hà Nội', NULL, '2026-07-24T10:05:37.193381+07:00', '2026-07-24T10:05:37.193381+07:00') ON CONFLICT (person_id) DO NOTHING;

-- 8. MỐI QUAN HỆ GIA TỘC
-- Table: public.relationships (246 rows)
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('8b3dbdbd-9ed2-4e15-a6dd-18f32edc7945', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', 'b6c57361-45e1-4d8c-b4a2-2d861d017b6c', 'e2beb12a-ecb9-45db-a50c-18c56c4ff218', 'Vợ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:07:19.874844+07:00', '2026-07-14T13:07:19.874844+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('e1e947fc-4038-4d78-9049-8a86e7079558', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '1fbacf8c-1539-4ff7-ac81-5ccf476848ed', '08f379ba-945c-4859-824a-dcdd09bfd354', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:14:22.988941+07:00', '2026-07-14T13:14:22.988941+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('b985212d-b8ad-4e75-baa9-0d1b38a20107', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '1fbacf8c-1539-4ff7-ac81-5ccf476848ed', '555eefd0-be21-40ac-aa8e-90db6cea441f', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:14:28.898163+07:00', '2026-07-14T13:14:28.898163+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('07cffcfb-0188-4161-92da-e288bbdddebe', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '1fbacf8c-1539-4ff7-ac81-5ccf476848ed', '221352e3-f736-40d5-8c6e-d605b46ea2fd', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:14:38.391771+07:00', '2026-07-14T13:14:38.391771+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('0af8ff33-9920-428a-abfb-9db6e2feccdf', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '1fbacf8c-1539-4ff7-ac81-5ccf476848ed', 'ae07dce8-9213-4944-b74f-e1a5475380ae', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:14:43.603834+07:00', '2026-07-14T13:14:43.603834+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('61688087-d1bf-4d03-ab2e-4ff5a08ce726', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '1fbacf8c-1539-4ff7-ac81-5ccf476848ed', '0f5ddc21-b098-4359-9c7c-516eb7cdb781', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:14:48.566502+07:00', '2026-07-14T13:14:48.566502+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('078ce0cb-bcfa-4781-814e-42296d0922da', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '08f379ba-945c-4859-824a-dcdd09bfd354', 'a3b3554a-3985-4b0f-bcc7-4a33719ce0f4', 'Vợ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:25:28.918031+07:00', '2026-07-14T13:25:28.918031+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('2305229b-9d99-45ca-9879-bb61f09f411b', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '08f379ba-945c-4859-824a-dcdd09bfd354', 'ee7a02f6-a2da-4fac-9191-4483235e75b0', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:26:03.913898+07:00', '2026-07-14T13:26:03.913898+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('02ae8bba-bb96-4383-95ff-24a5ff6b1547', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '1fbacf8c-1539-4ff7-ac81-5ccf476848ed', '6b2c434f-74c6-4762-b5cc-cea36e723f13', 'Vợ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:28:49.044127+07:00', '2026-07-14T13:28:49.044127+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('29311185-8153-48b7-96a6-d09376b63242', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '6b2c434f-74c6-4762-b5cc-cea36e723f13', '555eefd0-be21-40ac-aa8e-90db6cea441f', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:30:36.336657+07:00', '2026-07-14T13:30:36.336657+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('e35601e8-13bd-4fce-9dba-8b2eba4126e3', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '555eefd0-be21-40ac-aa8e-90db6cea441f', '03bd44a6-b66b-451b-ac81-fb52678e5719', 'Vợ cả', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:39:27.881778+07:00', '2026-07-14T13:39:27.881778+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('b0c299df-dcab-4630-9e4e-43fa8e87d931', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '555eefd0-be21-40ac-aa8e-90db6cea441f', '1801c1c9-e254-4cd8-a106-d782bdaff804', 'Vợ thứ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:39:53.606893+07:00', '2026-07-14T13:39:53.606893+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('715f2201-d51c-4d19-9183-edf7f0a8847d', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '555eefd0-be21-40ac-aa8e-90db6cea441f', 'c378eba0-fd41-4557-be03-c3e0270257ea', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:42:11.114252+07:00', '2026-07-14T13:42:11.114252+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('98e4c56a-2759-4419-abd4-59cf1d119ef1', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '555eefd0-be21-40ac-aa8e-90db6cea441f', 'c528726e-e46d-4a68-ba2c-adf0bff6f441', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:42:16.08295+07:00', '2026-07-14T13:42:16.08295+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('3de55f6c-dd91-4837-b294-ad6e2e611894', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '555eefd0-be21-40ac-aa8e-90db6cea441f', '361c455d-968a-459c-b34e-d81c2ad3fa4c', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:42:21.309951+07:00', '2026-07-14T13:42:21.309951+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('cbca85f3-edf2-4273-9545-bc5037445d22', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '555eefd0-be21-40ac-aa8e-90db6cea441f', 'be39076c-4110-4832-be63-4fc533f40ef1', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:42:26.564272+07:00', '2026-07-14T13:42:26.564272+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('a398c395-e3a0-4d65-9605-44f69ec2bad5', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '555eefd0-be21-40ac-aa8e-90db6cea441f', '0f8337d0-cd19-41eb-9363-080bafa3aeba', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:42:30.976642+07:00', '2026-07-14T13:42:30.976642+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('683b390e-9a37-4bb0-be92-291af1aa93c1', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '1801c1c9-e254-4cd8-a106-d782bdaff804', 'c528726e-e46d-4a68-ba2c-adf0bff6f441', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T13:46:53.198539+07:00', '2026-07-14T13:46:53.198539+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('a7a47364-f4ad-4f4d-9176-c0a972d1b2b8', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000005', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('770d49fa-8b80-490a-9755-c196d9b7623a', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000005', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('e6915dea-aa9a-418d-a537-9662b9c38b6a', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000006', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('a3318046-0ad4-456d-9f5b-cd1488856903', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000006', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('6a6fa0b8-8263-49e6-ae68-f015174fcb36', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000007', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('fb54588a-c7a0-4798-89e8-64af59f44127', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000007', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('89f660f7-acf0-4213-8743-32a594ac5ef6', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000008', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('a1eb106c-6006-422c-becf-39070f159ae1', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '6b2c434f-74c6-4762-b5cc-cea36e723f13', '08f379ba-945c-4859-824a-dcdd09bfd354', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:09:31.96611+07:00', '2026-07-14T14:09:31.96611+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('858d6f10-d9c0-4df8-8b14-6a57a6d13c7a', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '1fbacf8c-1539-4ff7-ac81-5ccf476848ed', 'b6c57361-45e1-4d8c-b4a2-2d861d017b6c', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:10:18.141927+07:00', '2026-07-14T14:10:18.141927+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('31c2d735-07eb-4cd4-9206-1c27cda7541f', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '6b2c434f-74c6-4762-b5cc-cea36e723f13', 'b6c57361-45e1-4d8c-b4a2-2d861d017b6c', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:10:48.253596+07:00', '2026-07-14T14:10:48.253596+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('7ad5a3ee-31f7-4e94-81b3-fd8485d8edf8', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '6b2c434f-74c6-4762-b5cc-cea36e723f13', '221352e3-f736-40d5-8c6e-d605b46ea2fd', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:20:13.026063+07:00', '2026-07-14T14:20:13.026063+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('d954115b-53be-40f6-87d2-fb012599fa2a', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '221352e3-f736-40d5-8c6e-d605b46ea2fd', 'ef7cd8f0-e14f-4610-b226-6678520e4059', 'Chồng', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:21:07.637844+07:00', '2026-07-14T14:21:07.637844+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('7658fdce-4408-49b0-b44e-a4c93fb43845', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '6b2c434f-74c6-4762-b5cc-cea36e723f13', 'ae07dce8-9213-4944-b74f-e1a5475380ae', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:23:11.882908+07:00', '2026-07-14T14:23:11.882908+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('07648a9d-c8d6-4f68-b3b6-487c29d4a8be', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', 'ae07dce8-9213-4944-b74f-e1a5475380ae', '68d2b865-f241-4a58-8757-317231a3f90c', 'Chồng', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:23:45.691355+07:00', '2026-07-14T14:23:45.691355+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('2cef2bc1-f1db-4d0b-b16b-c552c6888c02', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '6b2c434f-74c6-4762-b5cc-cea36e723f13', '0f5ddc21-b098-4359-9c7c-516eb7cdb781', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:24:27.428831+07:00', '2026-07-14T14:24:27.428831+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('96b4f866-5f65-4bb7-8eaf-6382b4cd6d4a', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '0f5ddc21-b098-4359-9c7c-516eb7cdb781', '168bef6f-99b3-4a0e-b5a6-bdfbd492fc95', 'Chồng cả', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:25:17.57903+07:00', '2026-07-14T14:25:17.57903+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('af2a4f66-2763-4366-9d0b-28c8ca25111d', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '0f5ddc21-b098-4359-9c7c-516eb7cdb781', '37889aac-9e63-4cf4-b52b-e25f2538a25c', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:27:19.782388+07:00', '2026-07-14T14:27:19.782388+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('dbf6ce1b-cf34-471f-ac69-2a02dfed3b8b', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '0f5ddc21-b098-4359-9c7c-516eb7cdb781', '934c7aea-fd4c-4200-bc67-b598df733307', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:28:04.2822+07:00', '2026-07-14T14:28:04.2822+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('f7ccefaf-25c8-4d5b-86ed-3287ac217541', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '1801c1c9-e254-4cd8-a106-d782bdaff804', 'c378eba0-fd41-4557-be03-c3e0270257ea', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:30:40.145873+07:00', '2026-07-14T14:30:40.145873+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('0268d5a5-b47e-4a3f-8a5e-85f21918b568', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', 'c528726e-e46d-4a68-ba2c-adf0bff6f441', 'b2edf70b-0e1e-4e80-874c-0a76a062956f', 'Chồng cả', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:32:02.572061+07:00', '2026-07-14T14:32:02.572061+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('b29d8790-cd13-4b31-8842-09e54042f8c5', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'c528726e-e46d-4a68-ba2c-adf0bff6f441', '55ef6f28-ea7f-49c1-acf6-17133bc54776', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:33:17.386696+07:00', '2026-07-14T14:33:17.386696+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('295a3144-4d92-4288-91de-278c278eb119', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'c528726e-e46d-4a68-ba2c-adf0bff6f441', '05ad9a94-4f8e-459e-8771-d22f2a8a10a7', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:33:22.205145+07:00', '2026-07-14T14:33:22.205145+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('e2e0948d-6eea-40cb-aa6d-7f1e27faf680', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', 'c528726e-e46d-4a68-ba2c-adf0bff6f441', '5d23ce9f-e184-47d7-866a-25c725fd84eb', 'Chồng thứ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:34:19.709736+07:00', '2026-07-14T14:34:19.709736+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('ceb081f9-cb6d-46a3-94bc-bb48d0bd9ed8', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'c528726e-e46d-4a68-ba2c-adf0bff6f441', '1a79cba9-490b-4b11-9bfb-5cdb65e0f493', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:36:02.237127+07:00', '2026-07-14T14:36:02.237127+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('75ebf34e-08b6-491c-980e-8c5a8ae94ecf', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'c528726e-e46d-4a68-ba2c-adf0bff6f441', 'e15d5d24-5a8d-476e-a46c-01205f571d47', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:36:06.70036+07:00', '2026-07-14T14:36:06.70036+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('7ea0dca4-d424-4f2d-831f-82c20ccf0bcf', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'c528726e-e46d-4a68-ba2c-adf0bff6f441', 'd1c6ca36-52fd-4413-bb8a-c07c77bcc939', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:36:11.193892+07:00', '2026-07-14T14:36:11.193892+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('639ea7fe-aa1a-430c-bda0-abc05430168a', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '1801c1c9-e254-4cd8-a106-d782bdaff804', '361c455d-968a-459c-b34e-d81c2ad3fa4c', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T14:58:00.506808+07:00', '2026-07-14T14:58:00.506808+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('da6bf9a1-6bff-4391-b035-9a76d282c61b', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '361c455d-968a-459c-b34e-d81c2ad3fa4c', 'f6da4ce0-d3e0-495a-b021-55481984b678', 'Chồng', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T15:01:25.681945+07:00', '2026-07-14T15:01:25.681945+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('38ef7d29-ce11-4caa-ae29-a18a1bc05f9d', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '361c455d-968a-459c-b34e-d81c2ad3fa4c', '792fb676-bd8d-4beb-8712-f168f640fdb1', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T15:02:37.116384+07:00', '2026-07-14T15:02:37.116384+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('4496e379-0e2d-42a1-8e50-ad0cbc430671', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '361c455d-968a-459c-b34e-d81c2ad3fa4c', '76f7ed80-8ab9-45bc-b0de-252fcd8c86bb', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T15:02:45.071194+07:00', '2026-07-14T15:02:45.071194+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('f9841397-b01d-4646-a3e8-6acb7885b154', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '0f5ddc21-b098-4359-9c7c-516eb7cdb781', '9bbe39bb-f998-4ea5-b66e-69a767344f45', 'Chồng thứ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T16:13:59.399515+07:00', '2026-07-14T16:13:59.399515+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('21d8460b-b887-4bc9-ba3a-99c4c5145f3b', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'b6c57361-45e1-4d8c-b4a2-2d861d017b6c', '42d15035-d927-4d56-85f8-be2d4be8fe8e', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T16:39:06.292837+07:00', '2026-07-14T16:39:06.292837+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('6db4bd16-7955-44a2-a8c5-df5a809e7cbe', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'b6c57361-45e1-4d8c-b4a2-2d861d017b6c', '77bc5f76-7324-4ef1-afc0-826a116b4f21', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-14T16:39:11.262455+07:00', '2026-07-14T16:39:11.262455+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('0fc76552-ecc8-45de-9510-3faf02527ec0', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'e2beb12a-ecb9-45db-a50c-18c56c4ff218', '42d15035-d927-4d56-85f8-be2d4be8fe8e', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-15T10:25:22.56093+07:00', '2026-07-15T10:25:22.56093+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('78a5d227-a2b5-4838-82c0-199eba64ad6d', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '42d15035-d927-4d56-85f8-be2d4be8fe8e', 'ed97f29f-8801-4b7f-8d06-eb0e10e12444', 'Vợ cả', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-15T10:31:28.362327+07:00', '2026-07-15T10:31:28.362327+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('376fbd43-0bf6-47c4-95b2-385ef80b7b6f', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '42d15035-d927-4d56-85f8-be2d4be8fe8e', 'a5081ca7-644b-4463-a45f-935fd9d07a37', 'Vợ thứ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-15T10:32:47.183761+07:00', '2026-07-15T10:32:47.183761+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('9b8963fe-481c-4c55-917f-fdd2d5469326', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '42d15035-d927-4d56-85f8-be2d4be8fe8e', 'e25aa323-e74e-48d3-922c-638c0f805c69', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-15T10:35:11.307273+07:00', '2026-07-15T10:35:11.307273+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('75aefd56-1ef3-48e0-9270-826cdcbd594f', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '42d15035-d927-4d56-85f8-be2d4be8fe8e', '10aeffc4-971c-4fa8-b2f2-6e98aee781e4', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-15T10:35:19.00916+07:00', '2026-07-15T10:35:19.00916+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('4755e395-1c93-4a7c-a78e-7f0b69dcc21b', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'ed97f29f-8801-4b7f-8d06-eb0e10e12444', 'da9219b7-75f8-4586-a5ab-4c750e78ff98', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-15T10:40:28.705436+07:00', '2026-07-15T10:40:28.705436+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('fe9de653-c4ec-4e7a-b081-3bf995410049', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'ed97f29f-8801-4b7f-8d06-eb0e10e12444', '6f9a2fdc-b201-4dc4-9250-32d855876b0f', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-15T10:40:37.449511+07:00', '2026-07-15T10:40:37.449511+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('38164211-ed23-476b-9a32-87b07eece339', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'ed97f29f-8801-4b7f-8d06-eb0e10e12444', '1bde3165-d350-411f-af35-9c158a54ad79', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-15T10:40:42.622309+07:00', '2026-07-15T10:40:42.622309+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('34040b1c-8a02-4379-bbbf-3f37a732dda9', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '5d23ce9f-e184-47d7-866a-25c725fd84eb', 'e15d5d24-5a8d-476e-a46c-01205f571d47', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:20:02.25197+07:00', '2026-07-16T10:20:02.25197+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('e61b8ff7-681b-423d-b6a1-603b416bc39b', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'marriage', '0d4771e3-79fb-4054-97eb-8284fe8a3467', '406fa088-acad-465f-b5fd-5a72cdfd9678', NULL, 'private', NULL, '2026-07-15T00:17:48.881824+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('0b32de8d-32ce-4f95-9333-86f08d1633b8', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'e2beb12a-ecb9-45db-a50c-18c56c4ff218', '77bc5f76-7324-4ef1-afc0-826a116b4f21', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:31:32.957162+07:00', '2026-07-16T10:31:32.957162+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('4dddaee7-5a3c-4228-ac11-db66cfb06165', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '77bc5f76-7324-4ef1-afc0-826a116b4f21', 'c2d262a9-532c-478e-8bac-95c487c4ecf5', 'Vợ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:32:47.214501+07:00', '2026-07-16T10:32:47.214501+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('376fdaaa-4587-496d-9802-3718530c43d3', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'a3b3554a-3985-4b0f-bcc7-4a33719ce0f4', 'ee7a02f6-a2da-4fac-9191-4483235e75b0', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:37:20.450181+07:00', '2026-07-16T10:37:20.450181+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('99877fd3-c886-482b-b655-6f1cfafa14ca', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '77bc5f76-7324-4ef1-afc0-826a116b4f21', 'c0d345df-ce22-41cd-b914-10a781880810', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:42:21.879308+07:00', '2026-07-16T10:42:21.879308+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('5b1ae118-5029-4802-9a42-805c1f1cbb19', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '77bc5f76-7324-4ef1-afc0-826a116b4f21', 'eeed4b66-6801-4823-836b-7e4867be4fa4', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:42:28.154439+07:00', '2026-07-16T10:42:28.154439+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('62c13a0b-7ec6-435c-bd94-ef0de7d96c1a', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '77bc5f76-7324-4ef1-afc0-826a116b4f21', '56170356-3096-484f-add0-1aab9f7876ed', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:42:33.709429+07:00', '2026-07-16T10:42:33.709429+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('4c573c36-b4b4-4d2f-a91d-069aa11a8d7c', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '77bc5f76-7324-4ef1-afc0-826a116b4f21', 'aa4a0ff5-f200-4e53-84b0-86b3b642ef7b', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:42:39.125771+07:00', '2026-07-16T10:42:39.125771+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('42995ebc-1256-4d65-83b0-b2321bc2f244', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', 'c0d345df-ce22-41cd-b914-10a781880810', 'f9b21f9e-6f10-42e0-bf37-f2c37a35be75', 'Chồng', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:44:23.725735+07:00', '2026-07-16T10:44:23.725735+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('61a5313e-d0a3-4655-8915-409b8e581ba4', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'c2d262a9-532c-478e-8bac-95c487c4ecf5', 'c0d345df-ce22-41cd-b914-10a781880810', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:45:20.227928+07:00', '2026-07-16T10:45:20.227928+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('00ced375-8db5-4594-bf7d-74b3d4f5b6d2', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'c0d345df-ce22-41cd-b914-10a781880810', 'ffdc2e0f-2987-4504-b712-85658f40e191', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:48:52.719681+07:00', '2026-07-16T10:48:52.719681+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('7d2ff2d0-fca5-413d-aeea-e5c3b25c3e22', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'c0d345df-ce22-41cd-b914-10a781880810', '18ad4003-5929-44d6-b306-9dd76757c082', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:49:00.67042+07:00', '2026-07-16T10:49:00.67042+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('72ad10c6-def1-4399-a8af-d93bd5d04ee1', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'c0d345df-ce22-41cd-b914-10a781880810', '79e4671a-272d-4a6e-8779-649f1f0987a7', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:49:06.15483+07:00', '2026-07-16T10:49:06.15483+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('45479874-d3c4-4bf4-99c6-e3e0e92047b1', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'c0d345df-ce22-41cd-b914-10a781880810', 'c0190d18-c64c-4761-afbf-56e416758ed7', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:49:10.665057+07:00', '2026-07-16T10:49:10.665057+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('f4a2bd69-df91-43ea-9928-7f6c41c3c1be', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'c0d345df-ce22-41cd-b914-10a781880810', '905e1d6f-9641-4499-9886-d669b86f9487', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:49:14.88422+07:00', '2026-07-16T10:49:14.88422+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('f1297af1-d9ac-44d4-b8cd-3bfdb7b24e27', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'c0d345df-ce22-41cd-b914-10a781880810', '10cebb25-4f5d-49b2-8355-90968340e0eb', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:49:18.923088+07:00', '2026-07-16T10:49:18.923088+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('32cb7cee-a051-42f4-bdec-b9c6685761be', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'c2d262a9-532c-478e-8bac-95c487c4ecf5', 'eeed4b66-6801-4823-836b-7e4867be4fa4', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:50:18.497605+07:00', '2026-07-16T10:50:18.497605+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('df602edc-edab-41bb-864a-f209d357433f', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', 'eeed4b66-6801-4823-836b-7e4867be4fa4', '98cc6ca9-dd53-469c-8241-9b7595d9730d', 'Vợ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:52:34.035524+07:00', '2026-07-16T10:52:34.035524+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('7ce1bc34-40ce-4638-9033-6d7d0aa84757', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'c2d262a9-532c-478e-8bac-95c487c4ecf5', '56170356-3096-484f-add0-1aab9f7876ed', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:53:34.325143+07:00', '2026-07-16T10:53:34.325143+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('412984de-1302-4afd-89e9-a88912efe732', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '56170356-3096-484f-add0-1aab9f7876ed', 'beee715b-683c-4774-8f75-35d393a1b3c2', 'Chồng', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:54:29.878142+07:00', '2026-07-16T10:54:29.878142+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('febcf186-f944-4ead-a83f-b78c0171e35a', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '56170356-3096-484f-add0-1aab9f7876ed', '636bf983-33ed-4d13-83e8-fddafb617aed', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:55:58.031153+07:00', '2026-07-16T10:55:58.031153+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('795f80b5-f07c-4cd5-8a0a-6db08c3bf46e', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '56170356-3096-484f-add0-1aab9f7876ed', '994fcc54-da88-42b6-9ef5-ade3d837250f', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:56:04.618658+07:00', '2026-07-16T10:56:04.618658+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('0172e5a0-6eb2-4850-a77a-7c4b924f65b7', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '56170356-3096-484f-add0-1aab9f7876ed', 'd486ee6e-d5f9-4532-9fb4-4e8ad3167008', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:56:09.851436+07:00', '2026-07-16T10:56:09.851436+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('ab96720f-8cb6-4321-8bb9-0371eac1f208', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '56170356-3096-484f-add0-1aab9f7876ed', 'ef733d8e-31e5-4366-aa81-ed89dcbd1731', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:56:14.737353+07:00', '2026-07-16T10:56:14.737353+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('cadb0ead-8ade-44be-bb07-5db8fbb7fd8b', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'eeed4b66-6801-4823-836b-7e4867be4fa4', 'd0b49f00-5a27-4d24-9d55-6605c61e87e3', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:59:19.711227+07:00', '2026-07-16T10:59:19.711227+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('aba9a9cf-f845-4534-ae91-6c657912329e', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'eeed4b66-6801-4823-836b-7e4867be4fa4', '9a9871dd-3e4f-4299-967f-1fc64c993095', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:59:25.422854+07:00', '2026-07-16T10:59:25.422854+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('f9e0e980-05a7-49dd-a5bd-8b3795e81eb9', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'eeed4b66-6801-4823-836b-7e4867be4fa4', '06bc38f2-7216-4bbb-9d52-249fa7c91cb2', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:59:29.793532+07:00', '2026-07-16T10:59:29.793532+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('e8b8ab3f-b776-401f-bb75-1f865e3f2af3', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'eeed4b66-6801-4823-836b-7e4867be4fa4', 'ece1c503-f33c-4cde-9dd4-49a776553dbe', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:59:33.709456+07:00', '2026-07-16T10:59:33.709456+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('94e7d814-551b-41f8-a2fd-f515a2ced5f3', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'eeed4b66-6801-4823-836b-7e4867be4fa4', '2fda717b-ff86-4c27-ab16-2b3672eee61a', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T10:59:37.869376+07:00', '2026-07-16T10:59:37.869376+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('b25860fa-6d08-46a2-96d1-6061a6716857', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'c2d262a9-532c-478e-8bac-95c487c4ecf5', 'aa4a0ff5-f200-4e53-84b0-86b3b642ef7b', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T11:00:22.216308+07:00', '2026-07-16T11:00:22.216308+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('3713cc5e-7945-494d-b0dc-cd1389fd2925', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', 'aa4a0ff5-f200-4e53-84b0-86b3b642ef7b', 'a88d44ea-537f-4182-9ce5-de63344da36c', 'Vợ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T11:01:23.018725+07:00', '2026-07-16T11:01:23.018725+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('498aa898-ae18-40e0-96c3-842f8e800508', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'a88d44ea-537f-4182-9ce5-de63344da36c', 'b4cfb439-24ab-4b40-a22a-85a3ed674e96', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T11:04:07.989207+07:00', '2026-07-16T11:04:07.989207+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('9b4f32b5-5226-4929-a96d-7a9f3d5d7d75', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'a88d44ea-537f-4182-9ce5-de63344da36c', 'd4bdb4a4-1cf6-4737-86d0-51b962b82df2', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T11:04:24.043306+07:00', '2026-07-16T11:04:24.043306+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('5c81df02-da68-464b-9f56-3f39f0487bd6', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'a88d44ea-537f-4182-9ce5-de63344da36c', '7b59cb64-40a2-4353-9d78-9f28c2e3b90f', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T11:04:50.68202+07:00', '2026-07-16T11:04:50.68202+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('459325f5-23d6-4373-8978-3e2238967d00', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'a88d44ea-537f-4182-9ce5-de63344da36c', 'd5cede48-4e63-4f11-98ce-9080ae14ca9f', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T11:05:10.041134+07:00', '2026-07-16T11:05:10.041134+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('6137865b-6db5-4f27-b925-00c61ef06085', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '1801c1c9-e254-4cd8-a106-d782bdaff804', 'be39076c-4110-4832-be63-4fc533f40ef1', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:13:24.590392+07:00', '2026-07-16T12:13:24.590392+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('ca8b72a9-3c97-40cc-ba64-878e99d7a4cb', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', 'be39076c-4110-4832-be63-4fc533f40ef1', '65ea7c78-a947-46d8-8164-486234ea4c59', 'Vợ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:14:13.793685+07:00', '2026-07-16T12:14:13.793685+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('287ccc1d-4244-4771-98b2-d2f49a7b0e71', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'be39076c-4110-4832-be63-4fc533f40ef1', '17e77cb4-90a2-43fd-8461-1b4e0534d07f', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:15:29.607775+07:00', '2026-07-16T12:15:29.607775+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('7a0f4d6b-a715-4ad0-a4de-e99c322b1653', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'be39076c-4110-4832-be63-4fc533f40ef1', '225ee14c-a0f5-4a3b-8dd1-c02b8663ceef', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:15:35.89907+07:00', '2026-07-16T12:15:35.89907+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('a8d6fe9e-1b8a-4c61-ba9f-b0eaa5e931ce', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '168bef6f-99b3-4a0e-b5a6-bdfbd492fc95', '934c7aea-fd4c-4200-bc67-b598df733307', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:26:51.534131+07:00', '2026-07-16T12:26:51.534131+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('a05778d3-4d3d-4d7e-b546-1b49936af9a0', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '934c7aea-fd4c-4200-bc67-b598df733307', 'ae3cef55-cf99-4a26-be55-10257813968a', 'Chồng', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:27:42.036479+07:00', '2026-07-16T12:27:42.036479+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('0e0a583a-3e95-4504-9060-7392117b4d65', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '934c7aea-fd4c-4200-bc67-b598df733307', '259a981b-9535-4212-b026-6fe54c5286d1', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:30:05.585091+07:00', '2026-07-16T12:30:05.585091+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('c10935ed-9390-453f-8b51-ee17aa320a7b', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '934c7aea-fd4c-4200-bc67-b598df733307', '5a063f83-f471-4a87-930c-cbd373062e21', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:30:11.184246+07:00', '2026-07-16T12:30:11.184246+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('a54d9336-30b6-4eb4-88e0-f5f9b1584ade', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '934c7aea-fd4c-4200-bc67-b598df733307', '26574357-aa88-4640-aa6f-25868b26b37b', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:30:16.209335+07:00', '2026-07-16T12:30:16.209335+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('ed0e0d29-fca7-4fc3-a679-a4b0d4696e5d', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '934c7aea-fd4c-4200-bc67-b598df733307', 'cd412ff5-b955-4e0d-976b-211cc9c7a2ea', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:30:22.150656+07:00', '2026-07-16T12:30:22.150656+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('f0b3c974-124b-45a9-b582-a1f463913d7a', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '934c7aea-fd4c-4200-bc67-b598df733307', 'ba130642-4d63-426e-b491-a72449529558', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:30:27.178407+07:00', '2026-07-16T12:30:27.178407+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('c2986a7f-cc51-4d6e-b481-c8f4edf1c62e', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '9bbe39bb-f998-4ea5-b66e-69a767344f45', '37889aac-9e63-4cf4-b52b-e25f2538a25c', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:32:24.219499+07:00', '2026-07-16T12:32:24.219499+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('049b5c48-98e2-4583-bb28-9c1d7bb337d8', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '37889aac-9e63-4cf4-b52b-e25f2538a25c', 'e8e6e897-fb35-46ff-9189-d9301174dd6c', 'Vợ', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:33:16.588992+07:00', '2026-07-16T12:33:16.588992+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('b5f9ba05-1e17-452f-a756-f1ff0c8aa2b5', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '37889aac-9e63-4cf4-b52b-e25f2538a25c', '26e5d65b-0f14-4dd4-a30b-0dc8d51d1bfa', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:34:23.549657+07:00', '2026-07-16T12:34:23.549657+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('ed017146-9306-4d27-a70c-b7752375cd30', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '37889aac-9e63-4cf4-b52b-e25f2538a25c', '4be3b08c-c7de-443f-8076-e4d276a7d893', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:34:30.689633+07:00', '2026-07-16T12:34:30.689633+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('21b06a38-8b72-45e5-9aa7-3eb3cc2bb7c5', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'b2edf70b-0e1e-4e80-874c-0a76a062956f', '55ef6f28-ea7f-49c1-acf6-17133bc54776', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:41:18.662725+07:00', '2026-07-16T12:41:18.662725+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('538a145a-5014-484b-ad07-d7d3a469af6d', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '55ef6f28-ea7f-49c1-acf6-17133bc54776', '3b457aa0-56f9-44ac-b4ad-d0bc00e357c3', 'Chồng', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:42:15.791485+07:00', '2026-07-16T12:42:15.791485+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('ea7445b7-1c01-4a08-9075-0aca0c97e67c', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', 'b2edf70b-0e1e-4e80-874c-0a76a062956f', '05ad9a94-4f8e-459e-8771-d22f2a8a10a7', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:45:53.459268+07:00', '2026-07-16T12:45:53.459268+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('8ffc83b3-4db7-41e5-bc29-0e418621f16a', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'marriage', '05ad9a94-4f8e-459e-8771-d22f2a8a10a7', 'd74816a0-0e06-43e0-b71c-1dcf982f1d44', 'Chồng', 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:46:39.533663+07:00', '2026-07-16T12:46:39.533663+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('36624e5b-60b4-41b5-8685-631e802b1cdb', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '05ad9a94-4f8e-459e-8771-d22f2a8a10a7', '533c0e06-a2ac-4ebe-9d53-d3cc247af203', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:50:20.935533+07:00', '2026-07-16T12:50:20.935533+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('27148eb8-c00c-4ece-b8d7-35a6d08c7205', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '05ad9a94-4f8e-459e-8771-d22f2a8a10a7', '601280b3-9155-4144-9caa-3a4d910bdb14', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:50:27.096654+07:00', '2026-07-16T12:50:27.096654+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('99085471-6151-45aa-9c3e-1b57ef76e5af', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '05ad9a94-4f8e-459e-8771-d22f2a8a10a7', '1cedd656-de58-4a27-a3f3-3f83bc8acc19', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:50:32.503665+07:00', '2026-07-16T12:50:32.503665+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('77ef2a1f-6a52-4cee-986e-acbe822f1cd5', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '05ad9a94-4f8e-459e-8771-d22f2a8a10a7', '22d83233-0637-458a-9b27-fbcfa24b1660', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:50:38.94876+07:00', '2026-07-16T12:50:38.94876+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('7279005a-a903-46a6-ae8d-c6138e7e2258', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '05ad9a94-4f8e-459e-8771-d22f2a8a10a7', 'b5147c5a-352b-442a-841a-c6f637ed73b5', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:50:43.19302+07:00', '2026-07-16T12:50:43.19302+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('a57ef48f-cf51-4145-8717-9d0d82f93c4d', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '05ad9a94-4f8e-459e-8771-d22f2a8a10a7', '9e7f38e5-4ff8-49a3-97b0-a8addc41b48d', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:50:47.444754+07:00', '2026-07-16T12:50:47.444754+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('5015789b-482d-484c-ac94-5cd92109f2cd', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '55ef6f28-ea7f-49c1-acf6-17133bc54776', '1b00a72b-6dc5-4672-8690-b71bd03e8d6a', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:53:19.951628+07:00', '2026-07-16T12:53:19.951628+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('3862bbf7-78f3-45a5-9b97-00391b029805', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '55ef6f28-ea7f-49c1-acf6-17133bc54776', '9ca8cc47-7739-4b5f-8d75-d9db2320837e', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:53:27.132107+07:00', '2026-07-16T12:53:27.132107+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('e7e28853-329a-42a5-b113-8ab0e08abccf', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', '65caa978-1d42-4db8-bf41-8e7529d27b85', 'biological_child', '55ef6f28-ea7f-49c1-acf6-17133bc54776', 'd2da9a2b-9cd3-4995-9c37-429d0e575d06', NULL, 'private', '359ba919-c8d4-44c5-8a94-47d90acb3e28', '2026-07-16T12:53:31.927619+07:00', '2026-07-16T12:53:31.927619+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('f06aa4f8-da96-4da5-a70c-e613026c8b6e', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'marriage', '84639a11-141e-4fbb-9913-a88579756a0d', 'd93a05f6-f232-48c2-81d1-6ce45a9a2fa8', 'Vo', 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:27:31.079415+07:00', '2026-08-24T11:27:31.079415+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('2193accc-a4a0-49b4-861a-30d9e02f698b', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '84639a11-141e-4fbb-9913-a88579756a0d', '90906295-d908-4475-a943-e69c70780b2f', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:29:51.273864+07:00', '2026-08-24T11:29:51.273864+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('e95c08a2-dca0-497b-a849-85fc38b7cf40', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '84639a11-141e-4fbb-9913-a88579756a0d', '0e803523-4e04-4d9d-93ab-c873b809b24b', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:29:56.757705+07:00', '2026-08-24T11:29:56.757705+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('932646a0-1640-4dae-84c9-9c7b360e9b96', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '84639a11-141e-4fbb-9913-a88579756a0d', 'c22a62b1-9d89-48e6-a14a-f93fce55dcf8', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:30:02.208538+07:00', '2026-08-24T11:30:02.208538+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('52349865-e034-438d-92af-c6b3d16ab050', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '84639a11-141e-4fbb-9913-a88579756a0d', '9fb5163b-a825-4261-acba-4a7d4b84cee7', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:30:06.709775+07:00', '2026-08-24T11:30:06.709775+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('4cab3c8b-d37e-4c46-957f-1b23f3f788c4', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '84639a11-141e-4fbb-9913-a88579756a0d', '880898a7-e704-4e09-86a8-5f227294be68', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:30:11.220831+07:00', '2026-08-24T11:30:11.220831+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('bbeaf471-e7b1-40a9-b6b0-be23032f9f54', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '84639a11-141e-4fbb-9913-a88579756a0d', 'c532fe6c-dba9-40ad-a699-4f89e2bce664', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:30:16.506213+07:00', '2026-08-24T11:30:16.506213+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('c0d88c6f-23aa-4396-bb83-87ba1b68123d', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '84639a11-141e-4fbb-9913-a88579756a0d', '92278cce-cfea-4098-8602-02663e2544d0', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:30:22.459822+07:00', '2026-08-24T11:30:22.459822+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('0e8cb535-ff55-4aac-a63d-be6df7db4854', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '84639a11-141e-4fbb-9913-a88579756a0d', '5e16750d-acfb-4416-9e56-ab6373040d9b', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:30:27.2174+07:00', '2026-08-24T11:30:27.2174+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('6551797c-0049-4dde-8ac6-7d7a8620069f', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '9fb5163b-a825-4261-acba-4a7d4b84cee7', 'a0412461-d235-4ef9-99d2-15c54a79a63e', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:40:59.618709+07:00', '2026-08-24T11:40:59.618709+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('e9c3b71d-c154-4b4a-9f88-0d2c8e23a388', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '9fb5163b-a825-4261-acba-4a7d4b84cee7', '06502971-3c04-41f0-90b4-d4f4b5c480cf', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:41:06.83664+07:00', '2026-08-24T11:41:06.83664+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('2a73cb82-c174-4a6d-a04c-72a032b5f890', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '9fb5163b-a825-4261-acba-4a7d4b84cee7', '244c44f4-2fd1-48fb-9400-b0f76f9c0f12', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:41:12.893397+07:00', '2026-08-24T11:41:12.893397+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('a220e5b9-0fe0-4db5-9167-9f9b47c6062c', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', 'a0412461-d235-4ef9-99d2-15c54a79a63e', '09ca99b9-13fe-40d1-8c0f-70f2c1eb54de', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:46:44.315831+07:00', '2026-08-24T11:46:44.315831+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('d7be2ac4-41b3-49a0-b52c-eba4c7dfcd3f', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', 'a0412461-d235-4ef9-99d2-15c54a79a63e', '4cb07dcd-2ce9-4ae1-bc95-b52ecaed15da', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T11:49:24.142088+07:00', '2026-08-24T11:49:24.142088+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('b53a5989-b77e-438a-b297-15892928ec2c', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', 'c22a62b1-9d89-48e6-a14a-f93fce55dcf8', '3dccb922-3dac-4da4-980f-ce3bec1d91fa', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:02:59.295651+07:00', '2026-08-24T12:02:59.295651+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('5708d333-4976-4d2d-bacc-ac6b45c73eda', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', 'c22a62b1-9d89-48e6-a14a-f93fce55dcf8', '4ce356fe-1a1e-4699-968c-f499eb7b4769', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:03:06.749735+07:00', '2026-08-24T12:03:06.749735+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('71e3c9b3-e49a-47bc-b1dc-c09d21cc8d0a', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', 'c22a62b1-9d89-48e6-a14a-f93fce55dcf8', 'ce4362b1-351c-4db4-9b14-ce5e096d020c', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:03:12.822711+07:00', '2026-08-24T12:03:12.822711+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('b79aacbc-b227-4cd7-8d91-e5958ccb2006', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '880898a7-e704-4e09-86a8-5f227294be68', 'ddfd0c47-408a-4022-95fb-d4afb8bd8538', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:06:19.366935+07:00', '2026-08-24T12:06:19.366935+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('0237379c-81b8-408b-ac46-bc354f9c0a2e', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '880898a7-e704-4e09-86a8-5f227294be68', '5431ecfa-6111-46b8-9117-6148b32d6581', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:06:29.369319+07:00', '2026-08-24T12:06:29.369319+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('ca6ed79d-a213-43ce-9997-33f2f5ae5a68', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '880898a7-e704-4e09-86a8-5f227294be68', 'a4ad4336-7942-4e42-8299-2e9b7712a502', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:06:34.900639+07:00', '2026-08-24T12:06:34.900639+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('55f1eb3d-5313-4dcf-a6b0-fc57c5b5046d', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '880898a7-e704-4e09-86a8-5f227294be68', '8ee041dd-df3c-453c-a6bf-9d2d62da16ef', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:06:40.757605+07:00', '2026-08-24T12:06:40.757605+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('3a740d7e-0109-444e-838f-30f3524a30e2', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '880898a7-e704-4e09-86a8-5f227294be68', '2216024a-5a76-455b-9f33-078a649cf5c8', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:06:45.539073+07:00', '2026-08-24T12:06:45.539073+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('bee314a1-f416-4737-a4b1-34fc923f16ed', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', 'c532fe6c-dba9-40ad-a699-4f89e2bce664', '18ebe907-b8ca-4f0f-bc37-736868a4365b', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:08:43.645893+07:00', '2026-08-24T12:08:43.645893+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('731d497b-5923-49f0-919c-df61a8beccc9', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', 'c532fe6c-dba9-40ad-a699-4f89e2bce664', '6656c3cd-79f6-46bd-b680-047f2de1a473', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:08:49.07365+07:00', '2026-08-24T12:08:49.07365+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('5e0d23b0-8527-491c-a965-ce62f1421f9c', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', 'c532fe6c-dba9-40ad-a699-4f89e2bce664', '49d8a517-9082-45b7-8440-bf34035302e8', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:08:53.918112+07:00', '2026-08-24T12:08:53.918112+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('05c233c7-8ff1-416d-9598-c66036b72455', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '92278cce-cfea-4098-8602-02663e2544d0', '0ae05519-5421-4a44-9c12-fb9e2deb16a3', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:10:53.795759+07:00', '2026-08-24T12:10:53.795759+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('596ec634-3810-449a-8954-f51441474277', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '92278cce-cfea-4098-8602-02663e2544d0', '5ddc72ed-680a-462a-aa0e-72628fc17873', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:11:00.315617+07:00', '2026-08-24T12:11:00.315617+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('97bf435c-f91e-46b3-b0be-017eb4abc663', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '92278cce-cfea-4098-8602-02663e2544d0', '47e0e359-5658-4fd1-a4bf-7b75b21e8ccc', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:11:04.805755+07:00', '2026-08-24T12:11:04.805755+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('d2a05593-295d-42fa-8e06-ab555d9c87e3', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '90906295-d908-4475-a943-e69c70780b2f', '5586dce3-cc18-4abf-883c-9274b58b7e18', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:12:49.601105+07:00', '2026-08-24T12:12:49.601105+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('cddab521-5807-4a86-a03f-00505dd9853d', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', '90906295-d908-4475-a943-e69c70780b2f', '7a849bd2-8fdd-4a2a-bca3-199a2e2c9fab', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:12:55.009022+07:00', '2026-08-24T12:12:55.009022+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('d47d1903-1f5b-4d8c-b2c5-cbac07258ba1', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', 'a0412461-d235-4ef9-99d2-15c54a79a63e', '53244082-157a-4b37-af3b-16958af4fafc', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:46:54.995676+07:00', '2026-08-24T12:46:54.995676+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('c74f8aea-cc81-4c3a-87c1-7cb0037ca314', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'marriage', '244c44f4-2fd1-48fb-9400-b0f76f9c0f12', '40be3fd0-92c6-4c4d-87f1-993a1f7220af', 'Chông', 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:50:09.101259+07:00', '2026-08-24T12:50:09.101259+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('94278c68-8542-4b20-8a66-c0aecec4dd0e', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', 'a4ad4336-7942-4e42-8299-2e9b7712a502', 'ac5b4fa1-4c0b-46eb-b682-af3ff10da61f', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T16:09:43.056461+07:00', '2026-08-24T16:09:43.056461+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('a94a0cee-bef1-4d62-bade-1bb712e5ee96', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'biological_child', 'a4ad4336-7942-4e42-8299-2e9b7712a502', '28a04072-1ff9-41cb-9aac-3064102a982e', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T16:09:48.443292+07:00', '2026-08-24T16:09:48.443292+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('3f7194f5-bb55-4c86-805a-e4d722e20c58', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'marriage', 'a4ad4336-7942-4e42-8299-2e9b7712a502', '3ee550cd-912b-4c4e-8798-2f220f894e99', 'Chồng', 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T16:10:20.892084+07:00', '2026-08-24T16:10:20.892084+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('68eeddd5-484e-48d9-86d9-a41eaa9ffa8f', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'marriage', 'ddfd0c47-408a-4022-95fb-d4afb8bd8538', 'ae02730a-d49f-4bea-9b91-ec257ed2a464', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T16:11:52.346383+07:00', '2026-08-24T16:11:52.346383+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('abadd850-4710-4f1b-9b1e-2364e400d56f', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'marriage', '5431ecfa-6111-46b8-9117-6148b32d6581', '2ae12933-9f5c-41b2-a831-d85d3ebbe519', NULL, 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-25T13:52:38.386606+07:00', '2026-08-25T13:52:38.386606+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('b73c5d2d-d2f1-4a01-8e26-4e4096a6d834', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'marriage', '10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('99c8308f-8337-40a5-8e33-3c7decf4eb08', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('d9d9277c-e9a1-487f-ba5e-d9491ade382d', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('94007f9c-0f98-42a1-9c7d-af531317946e', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'marriage', '20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('e9b1fade-cc21-4eb1-bb8c-e8fb2af38d49', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('e6efd22c-d1c5-4529-a83a-ce43ffbb6acf', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('391cba32-b8eb-464d-84b7-11e9d618b361', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'marriage', '30000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('579bb769-77b7-44a0-8671-de7061c1f10d', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('3be303f3-021c-4dbd-b6cb-9e90f5e6aa31', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('f246caee-8ccd-4d0d-9bea-9f8d4ab92625', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('1f4efb7e-2a85-4a41-b4be-72aff5e55a1b', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('688c58ca-ce72-4b7e-ae98-9bdc5d36599b', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('0f9221c2-2b39-4156-9078-54144a4653a0', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('881f00c1-8ef9-4616-8876-ccfa1ff21d6b', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('888ceb00-7fe7-48d4-80f9-f84641e32644', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('2bf86ec9-b2fd-42a8-b1c1-8b9a31748332', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('f12cf37c-fb6f-4e28-baa7-a37a4d6de8a1', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('e6a7d8f8-a460-434c-802f-02b7594271c1', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'marriage', '20000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000007', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('7806b778-5aa8-4bf3-9f66-37c32d204a3a', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'marriage', '20000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000008', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('c1ae9c2d-1bab-42cd-8931-0546ce48319f', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('8be67fde-cdd3-410b-b81a-4dfff9f1e5ac', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('9488f654-3e49-4250-a179-ba3c9dd9ee64', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000004', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('d7fd3c85-047f-4fbe-9558-ea814425755e', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000004', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('2379f96d-89d6-4560-b998-0981c1dc636b', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000005', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('a6e297d7-a1ad-4b94-96a0-c52f69abe8ff', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000005', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('22f2417a-1b67-4fda-8fc3-ec88176c7134', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000006', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('a821d549-02e2-44b0-aab6-c0c6545ea75a', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000006', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('c96ecd2e-e37d-4858-887a-01a5b5f522ba', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000007', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('7cbe76d2-57f6-4b22-b732-b08f2b03651e', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000007', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('2f8ff185-d25f-4faa-bc7b-80940b82b7e9', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000008', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('474ccab4-5136-49c2-b52b-0bd405a369b8', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000008', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('bc138bd5-83c9-488e-940e-bd5fc21d4090', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000009', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('194c7722-b649-4410-8338-c9fb4f48ccec', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000009', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('fc93bae2-2d30-4c23-ba57-8c4d83bdf844', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000010', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('6f1a5fd2-1233-4d01-92af-84218672965a', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000010', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('087d9021-9bb3-4ff3-a5b2-1373ece9eec6', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000011', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('782534f0-8f5e-45cd-b7d8-12166455c74c', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '20000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000011', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('34430689-9479-4d92-941a-dc81f5c5ab2a', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'marriage', '30000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000012', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('274d9963-e812-435b-a741-0878256ef022', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'marriage', '30000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000013', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('8b2ef2f6-c200-45c4-8b10-1883052d5442', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'marriage', '30000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000014', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('11afa3e8-77c9-442e-b5d5-2aeb8accb889', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'marriage', '30000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000015', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('c4f10cfc-9993-4e2a-9f9c-f60a99f66cb2', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'marriage', '30000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000016', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('51fd2010-b9b2-4943-88ad-455ea520624e', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'marriage', '30000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000017', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('b73ca02f-3f9d-437f-8650-8b873cc77bee', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'marriage', '30000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000018', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('ab231fba-05b3-42f7-8aeb-2e768a2f0793', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'marriage', '30000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000019', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('6e815edd-f66a-48a8-90e2-cc5e8d3d9ff8', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'marriage', '30000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000020', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('2f88f4e2-5ebe-4134-a5b2-d893f220c8fc', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('455e3f52-227b-47cb-b11e-52b27c095aaf', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('ee5bf02a-670e-44d9-b049-d3ed12805ea9', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('2f77540c-a605-4177-a96f-13120ba04151', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('d9033ab8-d648-4388-a552-45c18a6b2e6c', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000004', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('95e7c449-6248-4c3d-8191-be435491c948', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000004', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('dc1f8692-5d47-4696-8e37-f50a507ecb4a', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000014', '40000000-0000-0000-0000-000000000008', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('6dfe7be2-0316-459c-8cc6-397ceefeec56', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000009', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('0ff55a8f-10ee-4ea3-a7e0-446e9cf3f31c', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000009', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('f3345fac-8bff-4d70-b2c4-13f099ba5cac', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000010', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('bc746305-7e45-4479-8c33-9feb6f48b8f7', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000015', '40000000-0000-0000-0000-000000000010', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('a83a5b4c-5e58-4a52-9112-68bef8a25931', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000011', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('cf74b2db-76c2-40b7-8c24-f1a09b37010b', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000011', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('d00c19f7-15a8-473e-a545-16183c9642aa', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000012', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('d14e0cd2-1bde-442a-a4bc-338dbbe660fc', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000016', '40000000-0000-0000-0000-000000000012', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('5cab33e5-8a82-4bfb-b696-b5945e2202e4', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000013', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('f6ffbc00-626f-407d-9812-c48b56bcd23f', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000017', '40000000-0000-0000-0000-000000000013', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('89fbb87a-7e02-4d67-bde8-cf206080873c', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000014', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('5891ecd3-4828-43ea-9b8f-d13538bf19d8', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000018', '40000000-0000-0000-0000-000000000014', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('e9a0ce2f-5ddc-4890-954d-a151378cfa79', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000010', '40000000-0000-0000-0000-000000000015', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('8a222e96-68c0-4132-b7ed-bea279bb25be', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000019', '40000000-0000-0000-0000-000000000015', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('3021754c-02d5-4872-accf-0eb8f6d411a6', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000016', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('119a8c19-d599-4b7f-b680-f4f83731dd92', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'biological_child', '30000000-0000-0000-0000-000000000020', '40000000-0000-0000-0000-000000000016', NULL, 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('b31a8f4a-e554-4232-aed9-79580b4a9f9b', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'biological_child', '0d4771e3-79fb-4054-97eb-8284fe8a3467', '139cbc9f-8afd-4d1c-bd32-783c55205973', NULL, 'private', NULL, '2026-07-15T00:20:31.845983+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('bc9f16d8-c61c-4e92-a72b-b8c31294ff29', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'biological_child', '0d4771e3-79fb-4054-97eb-8284fe8a3467', '5013702e-9d82-4642-a06d-1aa0d300a78d', NULL, 'private', NULL, '2026-07-15T00:20:39.977064+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('99b65a0a-1fec-44ce-a9b0-a52a6218a79e', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'biological_child', '0d4771e3-79fb-4054-97eb-8284fe8a3467', 'ec7aaefc-b66e-432c-bbc4-77d47c1e1c1f', NULL, 'private', NULL, '2026-07-15T00:20:46.365906+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('b46c0104-40d4-41fc-ad44-88608975a1a2', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'biological_child', '0d4771e3-79fb-4054-97eb-8284fe8a3467', '0f4406df-b29a-413c-b810-4214c86e17b3', NULL, 'private', NULL, '2026-07-15T00:20:51.656337+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('cdc74a6f-815b-46df-9ba3-18c1c226da17', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'biological_child', '0d4771e3-79fb-4054-97eb-8284fe8a3467', '6d8d7ba9-34c8-41b5-84c2-8cfc70733267', NULL, 'private', NULL, '2026-07-15T00:20:56.644805+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('9b49a3e9-5e58-4fe6-9c4f-1939b62c2da4', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'biological_child', '139cbc9f-8afd-4d1c-bd32-783c55205973', '3e986358-5b2e-4b2f-8b7a-83937f2b4b87', NULL, 'private', NULL, '2026-07-15T00:23:46.15299+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('df5faa3f-743a-425e-9016-9a7c6ad0de83', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'biological_child', '139cbc9f-8afd-4d1c-bd32-783c55205973', '80e8255c-dfdc-4ecc-8a70-00dffafe7fc6', NULL, 'private', NULL, '2026-07-15T00:23:55.928596+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('e3784027-4e9e-4262-bfef-899abab2c99d', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'marriage', '139cbc9f-8afd-4d1c-bd32-783c55205973', '3656c254-e315-4ec4-8796-97ba3a7b7f99', NULL, 'private', NULL, '2026-07-15T00:25:03.347885+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('91355062-e90b-4060-b44f-46c130ed50e1', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'marriage', '6d8d7ba9-34c8-41b5-84c2-8cfc70733267', '96c6b2cc-8b71-4fe5-9fcb-304f2a65c333', NULL, 'private', NULL, '2026-07-15T00:31:46.585424+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('254e4d21-dcdc-48c5-a135-ad66051f04ab', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'biological_child', '6d8d7ba9-34c8-41b5-84c2-8cfc70733267', '017c6581-7ca8-4e55-8ca5-7ae45f5dab10', NULL, 'private', NULL, '2026-07-15T00:34:02.056002+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('72560aba-a385-4fc3-a12c-1132f61bfe78', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'biological_child', '6d8d7ba9-34c8-41b5-84c2-8cfc70733267', '45ff5412-317f-4826-95d1-9b769b7d6e86', NULL, 'private', NULL, '2026-07-15T00:34:07.425345+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('c3c29dfb-9f24-4e36-b449-d7f8f87eecba', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'marriage', '0f4406df-b29a-413c-b810-4214c86e17b3', '7f692a94-95e5-4284-96c5-ccaccd8dc77b', NULL, 'private', NULL, '2026-07-15T00:35:13.96648+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('ab5c66c5-c8ad-4bf6-8c69-aa1308b78b42', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'biological_child', '0f4406df-b29a-413c-b810-4214c86e17b3', 'f4afcb81-d77d-47fb-a05c-b3ee34dfbb1a', NULL, 'private', NULL, '2026-07-15T00:36:05.348142+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('3755bbad-3d3b-4d00-9f4e-e66cbc3bb5cd', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'biological_child', '3e986358-5b2e-4b2f-8b7a-83937f2b4b87', '0a73c9e1-2b01-4057-adf5-e28eeb96695b', NULL, 'private', NULL, '2026-07-15T00:38:26.891226+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('672423b3-b8c8-4b98-82d5-e012d4963c7f', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'biological_child', '3e986358-5b2e-4b2f-8b7a-83937f2b4b87', '437fcac0-f25d-4766-bed9-d33163de2bf5', NULL, 'private', NULL, '2026-07-15T00:38:33.540145+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('e5c51b8a-dd59-47e4-93a2-f71b6f7248e6', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'marriage', 'a02a9228-534b-4044-b1db-594b8587e993', '1d427b18-e443-4918-b87b-960e938a75a8', NULL, 'private', NULL, '2026-08-25T06:49:55.613907+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.relationships ("id", "family_id", "tree_id", "type", "person_a", "person_b", "note", "visibility", "created_by", "created_at", "updated_at") VALUES ('c2501f6e-d49a-4aa1-8b5c-cbe1be29cf06', '08c7740a-6749-418a-8049-626e2929cc94', 'f0ca6713-4e54-4cc0-8ed9-84e583e13d4e', 'biological_child', '0d4771e3-79fb-4054-97eb-8284fe8a3467', 'a02a9228-534b-4044-b1db-594b8587e993', 'Bố', 'private', NULL, '2026-08-25T06:53:04.666732+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;

-- 9. SỰ KIỆN DÒNG HỌ
-- Table: public.custom_events (2 rows)
INSERT INTO public.custom_events ("id", "family_id", "tree_id", "name", "content", "event_date", "lunar_day", "lunar_month", "lunar_year", "is_lunar", "recurrence", "location", "visibility", "created_by", "created_at", "updated_at") VALUES ('1209f702-99b1-47c0-8fd0-27b5abc17c2b', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '9a6c4727-e453-4aea-8650-df28d8434c40', 'Ngày tổ chuc họ diệp dụng', '12,13 âm lịch tổ chúc su kiện nhà họ diệp dụng', '2026-08-24', NULL, NULL, NULL, false, 'none', 'Nhà tho họ diệp dụng', 'private', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T12:18:07.39226+07:00', '2026-08-24T12:18:07.39226+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.custom_events ("id", "family_id", "tree_id", "name", "content", "event_date", "lunar_day", "lunar_month", "lunar_year", "is_lunar", "recurrence", "location", "visibility", "created_by", "created_at", "updated_at") VALUES ('814aadcb-9f67-40d5-b97e-58c6dbbf6e10', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Họp họ đầu năm', 'Sự kiện nội bộ chỉ thành viên dòng họ có quyền mới xem được.', '2026-07-22', NULL, NULL, NULL, false, 'none', 'Nhà thờ họ', 'private', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;

-- 11. YÊU CẦU GIA NHẬP
-- Table: public.join_requests (13 rows)
INSERT INTO public.join_requests ("id", "family_id", "profile_id", "message", "status", "reviewed_by", "reviewed_at", "created_at", "updated_at") VALUES ('fda020f7-ad0b-4cec-9ba2-f4ef2c2db40e', '08c7740a-6749-418a-8049-626e2929cc94', '553f3484-df5b-4e50-8261-ec8c0c8fac27', NULL, 'pending', NULL, NULL, '2026-07-16T10:32:12.001711+07:00', '2026-07-16T10:32:12.001711+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.join_requests ("id", "family_id", "profile_id", "message", "status", "reviewed_by", "reviewed_at", "created_at", "updated_at") VALUES ('00b8c11e-3a07-46c3-a446-77b774c1d91b', 'c8179eb0-c98c-48fe-b785-3ae5bb604fdd', '553f3484-df5b-4e50-8261-ec8c0c8fac27', NULL, 'pending', NULL, NULL, '2026-07-16T10:32:20.488202+07:00', '2026-07-16T10:32:20.488202+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.join_requests ("id", "family_id", "profile_id", "message", "status", "reviewed_by", "reviewed_at", "created_at", "updated_at") VALUES ('9bab6dc3-aaee-4c9d-ad24-0c1779cf8932', '20e6af55-87ce-45f1-ad34-20ea5bac2fee', 'cc7c7df9-b928-4003-a58a-be6665636fb2', NULL, 'pending', NULL, NULL, '2026-07-16T16:58:07.800581+07:00', '2026-07-16T16:58:13.219363+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.join_requests ("id", "family_id", "profile_id", "message", "status", "reviewed_by", "reviewed_at", "created_at", "updated_at") VALUES ('0aab4e62-75a6-4861-a85b-cfa6301daba5', '08c7740a-6749-418a-8049-626e2929cc94', '1265843f-5934-419c-99e4-83f8622c8372', NULL, 'pending', NULL, NULL, '2026-08-24T16:01:06.38294+07:00', '2026-08-24T16:01:06.38294+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.join_requests ("id", "family_id", "profile_id", "message", "status", "reviewed_by", "reviewed_at", "created_at", "updated_at") VALUES ('a1c8c949-4587-4b35-b3cd-01fc8d747a63', '579443a8-3e80-42c8-9f05-1d55c9f9069e', '1265843f-5934-419c-99e4-83f8622c8372', NULL, 'approved', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T16:03:39.614+07:00', '2026-08-24T16:00:48.20784+07:00', '2026-08-24T16:03:39.813236+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.join_requests ("id", "family_id", "profile_id", "message", "status", "reviewed_by", "reviewed_at", "created_at", "updated_at") VALUES ('ac12adf8-81a3-4857-aaf4-6c6d8e95d92b', '579443a8-3e80-42c8-9f05-1d55c9f9069e', 'acb0f717-16d8-44b5-aed8-1a83efd313ef', NULL, 'approved', '61519138-9dd2-43fd-ad5f-47ed448d97be', '2026-08-24T16:03:57.545+07:00', '2026-08-24T15:59:10.682606+07:00', '2026-08-24T16:03:57.748057+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.join_requests ("id", "family_id", "profile_id", "message", "status", "reviewed_by", "reviewed_at", "created_at", "updated_at") VALUES ('6c720423-cc00-4ed1-8157-62ab8140b977', 'aaaaaaaa-0000-0000-0000-000000000001', 'ddd2d524-ccaa-4770-84ff-1a1c4a8fd72c', NULL, 'approved', NULL, '2026-07-23T21:52:26.163+07:00', '2026-07-21T15:49:24.759986+07:00', '2026-09-29T23:22:04.443632+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.join_requests ("id", "family_id", "profile_id", "message", "status", "reviewed_by", "reviewed_at", "created_at", "updated_at") VALUES ('18f56d7c-fdcc-49e0-b6ee-1a5bbc94b96a', '08c7740a-6749-418a-8049-626e2929cc94', 'be5fce2d-d628-4eb7-b705-23a8eb41198e', NULL, 'pending', NULL, NULL, '2026-09-29T23:30:12.31783+07:00', '2026-09-29T23:30:35.781931+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.join_requests ("id", "family_id", "profile_id", "message", "status", "reviewed_by", "reviewed_at", "created_at", "updated_at") VALUES ('f0661767-9b9c-4f2e-ab86-a793f905b60a', 'aaaaaaaa-0000-0000-0000-000000000001', 'e7a57e83-ab20-4c5b-9c87-caf4aebdb0b1', NULL, 'pending', NULL, NULL, '2026-09-29T23:32:23.927458+07:00', '2026-09-29T23:32:38.882198+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.join_requests ("id", "family_id", "profile_id", "message", "status", "reviewed_by", "reviewed_at", "created_at", "updated_at") VALUES ('505d0be6-762d-46b9-9081-e1ca923f0c0f', 'aaaaaaaa-0000-0000-0000-000000000001', 'fe44abad-d365-4edf-98ee-4fb85ad46a18', NULL, 'pending', NULL, NULL, '2026-09-29T23:35:40.028261+07:00', '2026-09-29T23:35:40.028261+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.join_requests ("id", "family_id", "profile_id", "message", "status", "reviewed_by", "reviewed_at", "created_at", "updated_at") VALUES ('f975b7f6-07e4-4c5a-938e-d7abd8c66b56', '08c7740a-6749-418a-8049-626e2929cc94', 'fe44abad-d365-4edf-98ee-4fb85ad46a18', NULL, 'pending', NULL, NULL, '2026-09-29T23:35:46.251772+07:00', '2026-09-29T23:35:51.228692+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.join_requests ("id", "family_id", "profile_id", "message", "status", "reviewed_by", "reviewed_at", "created_at", "updated_at") VALUES ('f11a4c2e-139f-4d33-a25d-7a775dd3ab42', 'aaaaaaaa-0000-0000-0000-000000000001', 'be5fce2d-d628-4eb7-b705-23a8eb41198e', NULL, 'pending', NULL, NULL, '2026-09-29T23:45:02.789568+07:00', '2026-09-29T23:45:02.789568+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.join_requests ("id", "family_id", "profile_id", "message", "status", "reviewed_by", "reviewed_at", "created_at", "updated_at") VALUES ('0dde5027-ceff-4162-9d54-6de9ffdb8131', 'aaaaaaaa-0000-0000-0000-000000000001', '9973631f-4e23-45d9-bbeb-941fc9e428c0', NULL, 'pending', NULL, NULL, '2026-10-08T15:00:14.120314+07:00', '2026-10-08T15:00:14.120314+07:00') ON CONFLICT (id) DO NOTHING;


-- Bật lại trigger kiểm tra toàn vẹn
SET session_replication_role = 'origin';

COMMIT;

-- HOÀN TẤT KHÔI PHỤC TOÀN BỘ DỮ LIỆU!
