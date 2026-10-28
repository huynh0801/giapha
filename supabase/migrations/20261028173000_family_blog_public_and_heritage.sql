-- Migration: Cho phép bài viết dòng họ có chế độ công khai để con cháu / khách có liên kết có thể đọc được
-- Cập nhật RLS Policy của public.blog_posts

DROP POLICY IF EXISTS blog_posts_system_public_or_private_family_select ON public.blog_posts;

CREATE POLICY blog_posts_system_public_or_private_family_select ON public.blog_posts
  FOR SELECT TO anon, authenticated
  USING (
    (
      scope = 'system'
      AND (
        (is_published = true AND visibility = 'public')
        OR public.is_system_admin()
      )
    )
    OR (
      scope = 'family'
      AND family_id IS NOT NULL
      AND (
        (is_published = true AND visibility = 'public')
        OR public.can_view_family(family_id)
      )
    )
  );

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
