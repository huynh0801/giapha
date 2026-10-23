BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_attribute
    WHERE attrelid = 'public.admin_user_data'::regtype
      AND attname = 'phone_number'
      AND NOT attisdropped
  ) THEN
    ALTER TYPE public.admin_user_data ADD ATTRIBUTE phone_number text;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS SETOF public.admin_user_data
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
    au.id,
    COALESCE(
      p.full_name,
      au.raw_user_meta_data->>'full_name',
      au.raw_user_meta_data->>'name'
    ) AS full_name,
    au.email::text,
    COALESCE(p.role, 'member'::public.platform_role_enum) AS role,
    au.created_at,
    COALESCE(p.is_active, true),
    COALESCE(p.must_change_password, false),
    p.phone_number
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  ORDER BY au.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_users() FROM public;
GRANT EXECUTE ON FUNCTION public.get_admin_users() TO authenticated;

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
  person_count int,
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
    COALESCE(persons.person_count, 0)::int AS person_count,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', fm.id,
          'profile_id', fm.profile_id,
          'role', fm.role,
          'status', fm.status,
          'is_primary_admin', fm.is_primary_admin,
          'joined_at', fm.joined_at,
          'profile_name', pr.full_name,
          'profile_role', pr.role,
          'profile_email', au.email,
          'profile_phone_number', pr.phone_number
        )
        ORDER BY fm.is_primary_admin DESC, fm.role, fm.status, pr.full_name
      ) FILTER (WHERE fm.id IS NOT NULL),
      '[]'::jsonb
    ) AS memberships
  FROM public.families f
  LEFT JOIN LATERAL (
    SELECT count(*)::int AS person_count
    FROM public.persons p
    WHERE p.family_id = f.id
  ) persons ON true
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
    f.created_at,
    persons.person_count
  ORDER BY f.created_at DESC, f.id DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_families() FROM public;
GRANT EXECUTE ON FUNCTION public.get_admin_families() TO authenticated;

COMMIT;
