-- Migration: Tạo bảng person_life_events lưu nhật ký cuộc đời & niên biểu từng năm
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

CREATE INDEX IF NOT EXISTS idx_person_life_events_person_year ON public.person_life_events(person_id, year ASC);
CREATE INDEX IF NOT EXISTS idx_person_life_events_family_id ON public.person_life_events(family_id);

ALTER TABLE public.person_life_events ENABLE ROW LEVEL SECURITY;

-- 1. SELECT Policy
DROP POLICY IF EXISTS "Allow family members to read life events" ON public.person_life_events;
CREATE POLICY "Allow family members to read life events"
ON public.person_life_events
FOR SELECT
USING (
    public.can_view_family(family_id)
    OR EXISTS (
        SELECT 1 FROM public.families
        WHERE id = family_id AND visibility = 'public'
    )
);

-- 2. INSERT Policy
DROP POLICY IF EXISTS "Allow family members to insert life events" ON public.person_life_events;
CREATE POLICY "Allow family members to insert life events"
ON public.person_life_events
FOR INSERT
WITH CHECK (
    public.has_family_role(family_id, ARRAY['family_admin', 'member'])
    OR public.is_system_admin()
);

-- 3. UPDATE Policy
DROP POLICY IF EXISTS "Allow author or admin to update life events" ON public.person_life_events;
CREATE POLICY "Allow author or admin to update life events"
ON public.person_life_events
FOR UPDATE
USING (
    public.has_family_role(family_id, ARRAY['family_admin'])
    OR created_by = auth.uid()
    OR public.is_system_admin()
);

-- 4. DELETE Policy
DROP POLICY IF EXISTS "Allow author or admin to delete life events" ON public.person_life_events;
CREATE POLICY "Allow author or admin to delete life events"
ON public.person_life_events
FOR DELETE
USING (
    public.has_family_role(family_id, ARRAY['family_admin'])
    OR created_by = auth.uid()
    OR public.is_system_admin()
);
