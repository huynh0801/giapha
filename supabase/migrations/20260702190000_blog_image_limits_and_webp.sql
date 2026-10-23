BEGIN;

UPDATE public.families
SET settings =
  COALESCE(settings, '{}'::jsonb) ||
  jsonb_build_object('blog_max_images_per_post', 1)
WHERE NOT COALESCE(settings, '{}'::jsonb) ? 'blog_max_images_per_post';

ALTER TABLE public.families
  ALTER COLUMN settings SET DEFAULT '{"blog_max_images_per_post": 1}'::jsonb;

DROP FUNCTION IF EXISTS public.get_admin_families();

CREATE OR REPLACE FUNCTION public.get_admin_families()
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  description text,
  visibility public.visibility_enum,
  status public.family_status_enum,
  settings jsonb,
  created_at timestamptz,
  memberships jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.is_system_admin() THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;

  RETURN QUERY
  SELECT
    f.id,
    f.name,
    f.slug,
    f.description,
    f.visibility,
    f.status,
    f.settings,
    f.created_at,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', fm.id,
          'profile_id', fm.profile_id,
          'role', fm.role,
          'status', fm.status,
          'joined_at', fm.joined_at,
          'profile_name', pr.full_name,
          'profile_role', pr.role,
          'profile_email', au.email
        )
        ORDER BY fm.role, fm.status, pr.full_name
      ) FILTER (WHERE fm.id IS NOT NULL),
      '[]'::jsonb
    ) AS memberships
  FROM public.families f
  LEFT JOIN public.family_memberships fm ON fm.family_id = f.id
  LEFT JOIN public.profiles pr ON pr.id = fm.profile_id
  LEFT JOIN auth.users au ON au.id = fm.profile_id
  GROUP BY
    f.id,
    f.name,
    f.slug,
    f.description,
    f.visibility,
    f.status,
    f.settings,
    f.created_at
  ORDER BY f.created_at DESC, f.id DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_families() FROM public;
GRANT EXECUTE ON FUNCTION public.get_admin_families() TO authenticated;

COMMIT;
