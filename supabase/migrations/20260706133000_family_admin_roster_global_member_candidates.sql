BEGIN;

CREATE OR REPLACE FUNCTION public.get_family_membership_roster(target_family_id uuid)
RETURNS TABLE (
  membership_id uuid,
  profile_id uuid,
  full_name text,
  email text,
  phone_number text,
  role public.family_role_enum,
  status public.membership_status_enum,
  is_primary_admin boolean,
  platform_role public.platform_role_enum,
  is_active boolean,
  joined_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF target_family_id IS NULL THEN
    RAISE EXCEPTION 'Missing family id.';
  END IF;

  IF NOT (
    public.is_system_admin()
    OR public.can_manage_family(target_family_id)
  ) THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;

  RETURN QUERY
  WITH roster AS (
    SELECT
      fm.id AS membership_id,
      pr.id AS profile_id,
      pr.full_name,
      au.email::text AS email,
      pr.phone_number,
      fm.role,
      fm.status,
      fm.is_primary_admin,
      pr.role AS platform_role,
      pr.is_active,
      fm.joined_at
    FROM public.family_memberships fm
    JOIN public.profiles pr ON pr.id = fm.profile_id
    LEFT JOIN auth.users au ON au.id = fm.profile_id
    WHERE fm.family_id = target_family_id

    UNION ALL

    SELECT
      NULL::uuid AS membership_id,
      pr.id AS profile_id,
      pr.full_name,
      au.email::text AS email,
      pr.phone_number,
      'member'::public.family_role_enum AS role,
      'active'::public.membership_status_enum AS status,
      false AS is_primary_admin,
      pr.role AS platform_role,
      pr.is_active,
      NULL::timestamptz AS joined_at
    FROM public.profiles pr
    LEFT JOIN auth.users au ON au.id = pr.id
    WHERE pr.role = 'member'
      AND pr.is_active = true
      AND NOT EXISTS (
        SELECT 1
        FROM public.family_memberships fm
        WHERE fm.family_id = target_family_id
          AND fm.profile_id = pr.id
      )
  )
  SELECT
    roster.membership_id,
    roster.profile_id,
    roster.full_name,
    roster.email,
    roster.phone_number,
    roster.role,
    roster.status,
    roster.is_primary_admin,
    roster.platform_role,
    roster.is_active,
    roster.joined_at
  FROM roster
  ORDER BY
    roster.is_primary_admin DESC,
    CASE WHEN roster.role = 'family_admin' THEN 0 ELSE 1 END,
    CASE WHEN roster.membership_id IS NULL THEN 1 ELSE 0 END,
    CASE WHEN roster.status = 'active' THEN 0 ELSE 1 END,
    roster.full_name NULLS LAST,
    roster.email;
END;
$$;

REVOKE ALL ON FUNCTION public.get_family_membership_roster(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_family_membership_roster(uuid) TO authenticated;

COMMIT;
