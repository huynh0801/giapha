-- Migration: Tạo bảng person_memorial_letters lưu tâm thư và di ngôn thành viên gia phả
CREATE TABLE IF NOT EXISTS public.person_memorial_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    tree_id UUID NOT NULL REFERENCES public.family_trees(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Tâm thư gửi đời sau',
    content TEXT NOT NULL,
    author_type TEXT NOT NULL DEFAULT 'self' CHECK (author_type IN ('self', 'descendant', 'admin')),
    author_name TEXT NOT NULL,
    author_relationship TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_person_memorial_letter UNIQUE (person_id)
);

CREATE INDEX IF NOT EXISTS idx_person_memorial_letters_person_id ON public.person_memorial_letters(person_id);
CREATE INDEX IF NOT EXISTS idx_person_memorial_letters_family_id ON public.person_memorial_letters(family_id);

ALTER TABLE public.person_memorial_letters ENABLE ROW LEVEL SECURITY;

-- 1. SELECT Policy: Cho phép người có quyền xem dòng họ hoặc dòng họ công khai
DROP POLICY IF EXISTS "Allow users with family access to read memorial letters" ON public.person_memorial_letters;
CREATE POLICY "Allow users with family access to read memorial letters"
ON public.person_memorial_letters
FOR SELECT
USING (
    public.can_view_family(family_id)
    OR EXISTS (
        SELECT 1 FROM public.families
        WHERE id = family_id AND visibility = 'public'
    )
);

-- 2. INSERT / UPDATE Policy: Cho phép thành viên tích cực của dòng họ hoặc System Admin
DROP POLICY IF EXISTS "Allow family members to insert memorial letters" ON public.person_memorial_letters;
CREATE POLICY "Allow family members to insert memorial letters"
ON public.person_memorial_letters
FOR INSERT
WITH CHECK (
    public.has_family_role(family_id, ARRAY['family_admin', 'member'])
    OR public.is_system_admin()
);

DROP POLICY IF EXISTS "Allow family members or author to update memorial letters" ON public.person_memorial_letters;
CREATE POLICY "Allow family members or author to update memorial letters"
ON public.person_memorial_letters
FOR UPDATE
USING (
    public.has_family_role(family_id, ARRAY['family_admin', 'member'])
    OR created_by = auth.uid()
    OR public.is_system_admin()
);

-- 3. DELETE Policy: Cho phép Admin hoặc người tạo xóa
DROP POLICY IF EXISTS "Allow family admin or creator to delete memorial letters" ON public.person_memorial_letters;
CREATE POLICY "Allow family admin or creator to delete memorial letters"
ON public.person_memorial_letters
FOR DELETE
USING (
    public.has_family_role(family_id, ARRAY['family_admin'])
    OR created_by = auth.uid()
    OR public.is_system_admin()
);
