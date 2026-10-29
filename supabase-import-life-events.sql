-- ============================================================
-- SQL IMPORT CHO SUPABASE: BẢNG NHẬT KÝ CUỘC ĐỜI & NIÊN BIỂU TỪNG NĂM
-- ============================================================

-- 1. Tạo bảng person_life_events
CREATE TABLE IF NOT EXISTS public.person_life_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    tree_id UUID NOT NULL REFERENCES public.family_trees(id) ON DELETE CASCADE,
    year INT NOT NULL,
    month INT CHECK (month IS NULL OR (month >= 1 AND month <= 12)),
    day INT CHECK (day IS NULL OR (day >= 1 AND day <= 31)),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    author_type TEXT NOT NULL DEFAULT 'self' CHECK (author_type IN ('self', 'descendant', 'admin')),
    author_name TEXT NOT NULL,
    author_relationship TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Tạo Index tăng tốc truy vấn
CREATE INDEX IF NOT EXISTS idx_person_life_events_person_year 
ON public.person_life_events(person_id, year ASC);

CREATE INDEX IF NOT EXISTS idx_person_life_events_family_id 
ON public.person_life_events(family_id);

-- 3. Kích hoạt Row Level Security (RLS)
ALTER TABLE public.person_life_events ENABLE ROW LEVEL SECURITY;

-- 4. Xóa và tạo lại các chính sách bảo mật (không dùng dấu ngoặc kép tránh lỗi copy)
DROP POLICY IF EXISTS person_life_events_select_policy ON public.person_life_events;
CREATE POLICY person_life_events_select_policy
ON public.person_life_events
FOR SELECT
USING (
    public.can_view_family(family_id)
    OR EXISTS (
        SELECT 1 FROM public.families
        WHERE id = family_id AND visibility = 'public'
    )
);

DROP POLICY IF EXISTS person_life_events_insert_policy ON public.person_life_events;
CREATE POLICY person_life_events_insert_policy
ON public.person_life_events
FOR INSERT
WITH CHECK (
    public.has_family_role(family_id, ARRAY['family_admin', 'member'])
    OR public.is_system_admin()
);

DROP POLICY IF EXISTS person_life_events_update_policy ON public.person_life_events;
CREATE POLICY person_life_events_update_policy
ON public.person_life_events
FOR UPDATE
USING (
    public.has_family_role(family_id, ARRAY['family_admin'])
    OR created_by = auth.uid()
    OR public.is_system_admin()
);

DROP POLICY IF EXISTS person_life_events_delete_policy ON public.person_life_events;
CREATE POLICY person_life_events_delete_policy
ON public.person_life_events
FOR DELETE
USING (
    public.has_family_role(family_id, ARRAY['family_admin'])
    OR created_by = auth.uid()
    OR public.is_system_admin()
);
