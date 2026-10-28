-- Migration: Bảng yêu cầu tạo dòng họ & Stored Procedures phê duyệt nguyên tử
CREATE TABLE IF NOT EXISTS public.family_creation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    family_name TEXT NOT NULL,
    origin_location TEXT,
    phone_contact TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    rejection_reason TEXT,
    approved_family_id UUID REFERENCES public.families(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_family_creation_requests_user_id ON public.family_creation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_family_creation_requests_status ON public.family_creation_requests(status);

ALTER TABLE public.family_creation_requests ENABLE ROW LEVEL SECURITY;

-- 1. Requester RLS Policies
DROP POLICY IF EXISTS "Users can view their own creation requests" ON public.family_creation_requests;
CREATE POLICY "Users can view their own creation requests"
ON public.family_creation_requests
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own creation requests" ON public.family_creation_requests;
CREATE POLICY "Users can create their own creation requests"
ON public.family_creation_requests
FOR INSERT
WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
        SELECT 1 FROM public.family_creation_requests
        WHERE user_id = auth.uid() AND status = 'pending'
    )
);

DROP POLICY IF EXISTS "Users can cancel their pending creation requests" ON public.family_creation_requests;
CREATE POLICY "Users can cancel their pending creation requests"
ON public.family_creation_requests
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id AND status = 'cancelled');

-- 2. System Admin RLS Policies
DROP POLICY IF EXISTS "System admins can view all creation requests" ON public.family_creation_requests;
CREATE POLICY "System admins can view all creation requests"
ON public.family_creation_requests
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'system_admin' AND is_active = true
    )
);

DROP POLICY IF EXISTS "System admins can update creation requests" ON public.family_creation_requests;
CREATE POLICY "System admins can update creation requests"
ON public.family_creation_requests
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'system_admin' AND is_active = true
    )
);

-- 3. Stored Procedure: Phê duyệt yêu cầu nguyên tử (Atomic Transaction)
CREATE OR REPLACE FUNCTION public.approve_family_creation_request(
    p_request_id UUID,
    p_family_slug TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_req RECORD;
    v_family_id UUID;
    v_slug TEXT;
BEGIN
    -- Kiểm tra quyền Super Admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'system_admin' AND is_active = true
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Chỉ Quản trị viên hệ thống mới có quyền phê duyệt.');
    END IF;

    -- Lấy và khóa bản ghi yêu cầu
    SELECT * INTO v_req FROM public.family_creation_requests
    WHERE id = p_request_id AND status = 'pending'
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Yêu cầu không tồn tại hoặc đã được xử lý.');
    END IF;

    -- Chuẩn hóa slug
    v_slug := COALESCE(NULLIF(trim(p_family_slug), ''), slugify(v_req.family_name));
    IF v_slug IS NULL OR length(v_slug) = 0 THEN
        v_slug := 'dong-ho-' || substr(v_req.id::text, 1, 8);
    END IF;

    -- Tránh trùng slug
    WHILE EXISTS (SELECT 1 FROM public.families WHERE slug = v_slug) LOOP
        v_slug := v_slug || '-' || floor(random() * 900 + 100)::int::text;
    END LOOP;

    -- Tạo dòng họ mới
    INSERT INTO public.families (
        name,
        slug,
        description,
        public_origin_location,
        logo_url,
        visibility,
        status,
        created_at,
        updated_at
    ) VALUES (
        v_req.family_name,
        v_slug,
        v_req.description,
        v_req.origin_location,
        v_req.logo_url,
        'private',
        'active',
        now(),
        now()
    ) RETURNING id INTO v_family_id;

    -- Gán người gửi làm Quản trị viên chính của dòng họ
    INSERT INTO public.family_members (
        family_id,
        profile_id,
        role,
        is_primary_admin,
        status,
        created_at,
        updated_at
    ) VALUES (
        v_family_id,
        v_req.user_id,
        'family_admin',
        true,
        'active',
        now(),
        now()
    );

    -- Cập nhật trạng thái yêu cầu
    UPDATE public.family_creation_requests
    SET status = 'approved',
        approved_family_id = v_family_id,
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        updated_at = now()
    WHERE id = p_request_id;

    RETURN jsonb_build_object(
        'success', true,
        'family_id', v_family_id,
        'slug', v_slug
    );
END;
$$;

-- 4. Stored Procedure: Từ chối yêu cầu
CREATE OR REPLACE FUNCTION public.reject_family_creation_request(
    p_request_id UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'system_admin' AND is_active = true
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Chỉ Quản trị viên hệ thống mới có quyền từ chối.');
    END IF;

    UPDATE public.family_creation_requests
    SET status = 'rejected',
        rejection_reason = p_reason,
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        updated_at = now()
    WHERE id = p_request_id AND status = 'pending';

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Yêu cầu không tồn tại hoặc đã được xử lý.');
    END IF;

    RETURN jsonb_build_object('success', true);
END;
$$;
