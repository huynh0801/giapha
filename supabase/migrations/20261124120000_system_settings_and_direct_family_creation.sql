-- Migration: Bảng cấu hình hệ thống & Stored Procedure tạo dòng họ trực tiếp khi tắt duyệt
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 1. Cho phép người dùng đã xác thực đọc cấu hình
DROP POLICY IF EXISTS "Allow authenticated read system_settings" ON public.system_settings;
CREATE POLICY "Allow authenticated read system_settings"
ON public.system_settings
FOR SELECT
USING (auth.role() = 'authenticated');

-- 2. Chỉ Super Admin có quyền cập nhật cấu hình
DROP POLICY IF EXISTS "Only system admin can update system_settings" ON public.system_settings;
CREATE POLICY "Only system admin can update system_settings"
ON public.system_settings
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'system_admin' AND is_active = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'system_admin' AND is_active = true
    )
);

DROP POLICY IF EXISTS "Only system admin can insert system_settings" ON public.system_settings;
CREATE POLICY "Only system admin can insert system_settings"
ON public.system_settings
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'system_admin' AND is_active = true
    )
);

-- Khởi tạo giá trị mặc định cho cờ bắt buộc duyệt dòng họ
INSERT INTO public.system_settings (key, value, description)
VALUES ('family_approval_required', '{"enabled": true}'::jsonb, 'Bắt buộc phê duyệt khi người dùng tạo dòng họ mới')
ON CONFLICT (key) DO NOTHING;

-- 3. Stored Procedure: Tạo dòng họ trực tiếp không cần duyệt
CREATE OR REPLACE FUNCTION public.create_family_direct(
    p_family_name TEXT,
    p_family_slug TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_origin_location TEXT DEFAULT NULL,
    p_phone_contact TEXT DEFAULT '',
    p_logo_url TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_family_id UUID;
    v_slug TEXT;
    v_approval_setting JSONB;
    v_is_approval_enabled BOOLEAN := true;
BEGIN
    -- 1. Kiểm tra xác thực người dùng
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Vui lòng đăng nhập để tạo dòng họ.');
    END IF;

    -- Kiểm tra tài khoản có active không
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user_id AND is_active = true) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Tài khoản của bạn đã bị khóa hoặc không hợp lệ.');
    END IF;

    -- 2. Kiểm tra cờ cấu hình duyệt dòng họ
    SELECT value INTO v_approval_setting FROM public.system_settings WHERE key = 'family_approval_required';
    IF v_approval_setting IS NOT NULL AND (v_approval_setting->>'enabled')::boolean = true THEN
        RETURN jsonb_build_object('success', false, 'error', 'Chế độ duyệt dòng họ đang bật, vui lòng gửi đơn xin duyệt.');
    END IF;

    -- 3. Chuẩn hóa tên và slug
    IF p_family_name IS NULL OR length(trim(p_family_name)) < 3 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Tên dòng họ phải có ít nhất 3 ký tự.');
    END IF;

    v_slug := COALESCE(NULLIF(trim(p_family_slug), ''), slugify(p_family_name));
    IF v_slug IS NULL OR length(v_slug) = 0 THEN
        v_slug := 'dong-ho-' || substr(gen_random_uuid()::text, 1, 8);
    END IF;

    WHILE EXISTS (SELECT 1 FROM public.families WHERE slug = v_slug) LOOP
        v_slug := v_slug || '-' || floor(random() * 900 + 100)::int::text;
    END LOOP;

    -- 4. Tạo dòng họ mới
    INSERT INTO public.families (
        name,
        slug,
        description,
        origin_location,
        logo_url,
        visibility,
        status,
        created_at,
        updated_at
    ) VALUES (
        trim(p_family_name),
        v_slug,
        p_description,
        p_origin_location,
        p_logo_url,
        'private',
        'active',
        now(),
        now()
    ) RETURNING id INTO v_family_id;

    -- 5. Khởi tạo cây gia phả chính mặc định
    INSERT INTO public.family_trees (
        family_id,
        name,
        slug,
        description,
        is_primary,
        created_by
    ) VALUES (
        v_family_id,
        'Cây gia phả chính',
        'cay-chinh',
        'Cây gia phả mặc định',
        true,
        v_user_id
    );

    -- 6. Gán người tạo làm Quản trị viên chính (family_admin)
    INSERT INTO public.family_memberships (
        family_id,
        profile_id,
        role,
        is_primary_admin,
        status,
        created_at,
        updated_at
    ) VALUES (
        v_family_id,
        v_user_id,
        'family_admin',
        true,
        'active',
        now(),
        now()
    );

    -- 7. Lưu vết lịch sử yêu cầu tạo dòng họ đã được phê duyệt tự động
    INSERT INTO public.family_creation_requests (
        user_id,
        family_name,
        origin_location,
        phone_contact,
        description,
        logo_url,
        status,
        approved_family_id,
        reviewed_by,
        reviewed_at,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        trim(p_family_name),
        p_origin_location,
        COALESCE(p_phone_contact, ''),
        p_description,
        p_logo_url,
        'approved',
        v_family_id,
        v_user_id,
        now(),
        now(),
        now()
    );

    RETURN jsonb_build_object(
        'success', true,
        'family_id', v_family_id,
        'slug', v_slug
    );
END;
$$;
