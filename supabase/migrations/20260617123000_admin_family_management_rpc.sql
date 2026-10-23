CREATE OR REPLACE FUNCTION public.get_admin_families()
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  description text,
  visibility public.visibility_enum,
  status public.family_status_enum,
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
  GROUP BY f.id, f.name, f.slug, f.description, f.visibility, f.status, f.created_at
  ORDER BY f.created_at DESC, f.id DESC;
END;
$$;
REVOKE ALL ON FUNCTION public.get_admin_families() FROM public;
GRANT EXECUTE ON FUNCTION public.get_admin_families() TO authenticated;

CREATE OR REPLACE FUNCTION public.replace_family_admin(
  target_family_id uuid,
  target_profile_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_system_admin() THEN
    RAISE EXCEPTION 'Only Super Admin can replace the family admin.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.families f
    WHERE f.id = target_family_id
  ) THEN
    RAISE EXCEPTION 'Family not found.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = target_profile_id
      AND p.is_active = true
      AND p.role = 'member'
  ) THEN
    RAISE EXCEPTION 'New family admin must be an active member account.';
  END IF;

  INSERT INTO public.family_memberships (
    family_id, profile_id, role, status, invited_by, joined_at
  )
  VALUES (
    target_family_id, target_profile_id, 'family_admin', 'active', auth.uid(), now()
  )
  ON CONFLICT (family_id, profile_id)
  DO UPDATE SET
    role = 'family_admin',
    status = 'active',
    joined_at = COALESCE(public.family_memberships.joined_at, now()),
    updated_at = now();

  UPDATE public.family_memberships
  SET role = 'member', status = 'active', updated_at = now()
  WHERE family_id = target_family_id
    AND profile_id <> target_profile_id
    AND role = 'family_admin'
    AND status = 'active';
END;
$$;
REVOKE ALL ON FUNCTION public.replace_family_admin(uuid, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.replace_family_admin(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.delete_family(target_family_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_system_admin() THEN
    RAISE EXCEPTION 'Only Super Admin can delete a family.';
  END IF;

  DELETE FROM public.families
  WHERE id = target_family_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Family not found.';
  END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.delete_family(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.delete_family(uuid) TO authenticated;
