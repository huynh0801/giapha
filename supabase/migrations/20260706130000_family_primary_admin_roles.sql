BEGIN;

ALTER TABLE public.family_memberships
  ADD COLUMN IF NOT EXISTS is_primary_admin boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_family_memberships_primary_admin
  ON public.family_memberships(family_id, is_primary_admin)
  WHERE role = 'family_admin' AND status = 'active';

UPDATE public.family_memberships fm
SET is_primary_admin = true,
    updated_at = now()
WHERE fm.id IN (
  SELECT picked.id
  FROM (
    SELECT DISTINCT ON (family_id) id, family_id
    FROM public.family_memberships
    WHERE role = 'family_admin'
      AND status = 'active'
    ORDER BY family_id, joined_at NULLS LAST, created_at, id
  ) picked
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.family_memberships existing
    WHERE existing.family_id = picked.family_id
      AND existing.role = 'family_admin'
      AND existing.status = 'active'
      AND existing.is_primary_admin = true
  )
);

UPDATE public.family_memberships
SET is_primary_admin = false,
    updated_at = now()
WHERE is_primary_admin = true
  AND (role <> 'family_admin' OR status <> 'active');

CREATE OR REPLACE FUNCTION public.can_manage_family_admins(target_family_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_system_admin()
    OR EXISTS (
      SELECT 1
      FROM public.family_memberships fm
      JOIN public.profiles p ON p.id = fm.profile_id
      WHERE fm.family_id = target_family_id
        AND fm.profile_id = auth.uid()
        AND fm.status = 'active'
        AND fm.role = 'family_admin'
        AND fm.is_primary_admin = true
        AND p.is_active = true
    );
$$;

REVOKE ALL ON FUNCTION public.can_manage_family_admins(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.can_manage_family_admins(uuid) TO anon, authenticated;

DROP POLICY IF EXISTS memberships_manage_insert ON public.family_memberships;
DROP POLICY IF EXISTS memberships_manage_update ON public.family_memberships;
DROP POLICY IF EXISTS memberships_manage_delete ON public.family_memberships;

CREATE POLICY memberships_manage_insert ON public.family_memberships
  FOR INSERT
  WITH CHECK (
    public.can_manage_family_admins(family_id)
    OR (
      public.can_manage_family(family_id)
      AND role = 'member'
      AND is_primary_admin = false
    )
  );

CREATE POLICY memberships_manage_update ON public.family_memberships
  FOR UPDATE
  USING (
    public.can_manage_family_admins(family_id)
    OR (
      public.can_manage_family(family_id)
      AND role = 'member'
    )
  )
  WITH CHECK (
    public.can_manage_family_admins(family_id)
    OR (
      public.can_manage_family(family_id)
      AND role = 'member'
      AND is_primary_admin = false
    )
  );

CREATE POLICY memberships_manage_delete ON public.family_memberships
  FOR DELETE
  USING (
    public.can_manage_family_admins(family_id)
    OR (
      public.can_manage_family(family_id)
      AND role = 'member'
    )
  );

CREATE OR REPLACE FUNCTION public.create_family_with_admin(
  family_name text,
  family_slug text,
  family_description text,
  admin_profile_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_family_id uuid;
  clean_slug text;
BEGIN
  IF NOT public.is_system_admin() THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;

  IF admin_profile_id IS NULL THEN
    RAISE EXCEPTION 'Family admin is required.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = admin_profile_id
      AND p.role = 'member'
      AND p.is_active = true
  ) THEN
    RAISE EXCEPTION 'Family admin must be an active member account.';
  END IF;

  clean_slug := lower(trim(coalesce(family_slug, '')));
  IF clean_slug = '' THEN
    clean_slug := public.slugify(family_name);
  END IF;

  INSERT INTO public.families (name, slug, description, created_by)
  VALUES (family_name, clean_slug, nullif(family_description, ''), auth.uid())
  RETURNING id INTO new_family_id;

  INSERT INTO public.family_trees (family_id, name, slug, description, is_primary, created_by)
  VALUES (new_family_id, 'Cay gia pha chinh', 'cay-chinh', 'Cay gia pha mac dinh', true, auth.uid());

  INSERT INTO public.family_memberships (
    family_id,
    profile_id,
    role,
    status,
    is_primary_admin,
    invited_by,
    joined_at
  )
  VALUES (
    new_family_id,
    admin_profile_id,
    'family_admin',
    'active',
    true,
    auth.uid(),
    now()
  )
  ON CONFLICT (family_id, profile_id)
  DO UPDATE SET
    role = 'family_admin',
    status = 'active',
    is_primary_admin = true,
    updated_at = now();

  RETURN new_family_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_family_with_admin(text, text, text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.create_family_with_admin(text, text, text, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.set_family_membership(
  target_family_id uuid,
  target_profile_id uuid,
  new_role text,
  new_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor_can_manage_family boolean;
  actor_can_manage_admins boolean;
  actor_is_system_admin boolean;
  target_platform_role public.platform_role_enum;
  current_role public.family_role_enum;
  current_status public.membership_status_enum;
  current_is_primary_admin boolean := false;
  next_role public.family_role_enum;
  next_status public.membership_status_enum;
  next_is_primary_admin boolean := false;
  active_sub_admin_count int := 0;
BEGIN
  IF target_family_id IS NULL OR target_profile_id IS NULL THEN
    RAISE EXCEPTION 'Missing family membership target.';
  END IF;

  actor_is_system_admin := public.is_system_admin();
  actor_can_manage_family := public.can_manage_family(target_family_id);
  actor_can_manage_admins := public.can_manage_family_admins(target_family_id);

  IF NOT actor_can_manage_family THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;

  IF new_role IS NULL OR new_role NOT IN ('family_admin', 'member') THEN
    RAISE EXCEPTION 'Invalid family role.';
  END IF;

  IF new_status IS NULL OR new_status NOT IN ('invited', 'pending', 'active', 'blocked') THEN
    RAISE EXCEPTION 'Invalid membership status.';
  END IF;

  next_role := new_role::public.family_role_enum;
  next_status := new_status::public.membership_status_enum;

  SELECT p.role
  INTO target_platform_role
  FROM public.profiles p
  WHERE p.id = target_profile_id
    AND p.is_active = true;

  IF target_platform_role IS NULL THEN
    RAISE EXCEPTION 'Family membership target must be an active account.';
  END IF;

  IF target_platform_role = 'system_admin' AND NOT actor_is_system_admin THEN
    RAISE EXCEPTION 'Only Super Admin can manage Super Admin family access.';
  END IF;

  SELECT fm.role, fm.status, coalesce(fm.is_primary_admin, false)
  INTO current_role, current_status, current_is_primary_admin
  FROM public.family_memberships fm
  WHERE fm.family_id = target_family_id
    AND fm.profile_id = target_profile_id;

  current_is_primary_admin := coalesce(current_is_primary_admin, false);

  IF (
    next_role = 'family_admin'
    OR current_role = 'family_admin'
    OR current_is_primary_admin = true
  )
  AND NOT actor_can_manage_admins THEN
    RAISE EXCEPTION 'Only Super Admin or the primary family admin can manage family admins.';
  END IF;

  IF current_is_primary_admin = true
    AND (next_role <> 'family_admin' OR next_status <> 'active')
    AND NOT EXISTS (
      SELECT 1
      FROM public.family_memberships fm
      WHERE fm.family_id = target_family_id
        AND fm.profile_id <> target_profile_id
        AND fm.role = 'family_admin'
        AND fm.status = 'active'
        AND fm.is_primary_admin = true
    )
  THEN
    RAISE EXCEPTION 'Cannot remove the last primary family admin.';
  END IF;

  IF next_role = 'family_admin'
    AND next_status = 'active'
    AND NOT (
      current_role = 'family_admin'
      AND current_status = 'active'
    )
  THEN
    SELECT count(*)::int
    INTO active_sub_admin_count
    FROM public.family_memberships fm
    WHERE fm.family_id = target_family_id
      AND fm.role = 'family_admin'
      AND fm.status = 'active'
      AND fm.is_primary_admin = false;

    IF active_sub_admin_count >= 10 THEN
      RAISE EXCEPTION 'A family can have at most 10 assistant admins.';
    END IF;
  END IF;

  next_is_primary_admin :=
    current_is_primary_admin = true
    AND next_role = 'family_admin'
    AND next_status = 'active';

  INSERT INTO public.family_memberships (
    family_id,
    profile_id,
    role,
    status,
    is_primary_admin,
    invited_by,
    joined_at
  )
  VALUES (
    target_family_id,
    target_profile_id,
    next_role,
    next_status,
    next_is_primary_admin,
    auth.uid(),
    CASE WHEN next_status = 'active' THEN now() ELSE NULL END
  )
  ON CONFLICT (family_id, profile_id)
  DO UPDATE SET
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    is_primary_admin = EXCLUDED.is_primary_admin,
    joined_at = CASE
      WHEN EXCLUDED.status = 'active'
      THEN COALESCE(public.family_memberships.joined_at, now())
      ELSE public.family_memberships.joined_at
    END,
    updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.set_family_membership(uuid, uuid, text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.set_family_membership(uuid, uuid, text, text) TO authenticated;

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
          'profile_email', au.email
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

DROP FUNCTION IF EXISTS public.get_family_admin_contacts(uuid);

CREATE OR REPLACE FUNCTION public.get_family_admin_contacts(target_family_id uuid)
RETURNS TABLE (
  profile_id uuid,
  full_name text,
  email text,
  phone_number text,
  is_primary_admin boolean
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
    OR public.has_family_role(
      target_family_id,
      ARRAY['family_admin', 'member']
    )
  ) THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;

  RETURN QUERY
  SELECT
    pr.id AS profile_id,
    coalesce(pr.full_name, 'Quan tri vien dong ho') AS full_name,
    au.email::text AS email,
    pr.phone_number,
    fm.is_primary_admin
  FROM public.family_memberships fm
  JOIN public.profiles pr ON pr.id = fm.profile_id
  LEFT JOIN auth.users au ON au.id = fm.profile_id
  WHERE fm.family_id = target_family_id
    AND fm.status = 'active'
    AND fm.role = 'family_admin'
  ORDER BY fm.is_primary_admin DESC, pr.full_name NULLS LAST, au.email;
END;
$$;

REVOKE ALL ON FUNCTION public.get_family_admin_contacts(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_family_admin_contacts(uuid) TO authenticated;

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

  UPDATE public.family_memberships
  SET is_primary_admin = false,
      role = 'family_admin',
      status = 'active',
      updated_at = now()
  WHERE family_id = target_family_id
    AND role = 'family_admin'
    AND status = 'active'
    AND is_primary_admin = true
    AND profile_id <> target_profile_id;

  INSERT INTO public.family_memberships (
    family_id,
    profile_id,
    role,
    status,
    is_primary_admin,
    invited_by,
    joined_at
  )
  VALUES (
    target_family_id,
    target_profile_id,
    'family_admin',
    'active',
    true,
    auth.uid(),
    now()
  )
  ON CONFLICT (family_id, profile_id)
  DO UPDATE SET
    role = 'family_admin',
    status = 'active',
    is_primary_admin = true,
    joined_at = COALESCE(public.family_memberships.joined_at, now()),
    updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.replace_family_admin(uuid, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.replace_family_admin(uuid, uuid) TO authenticated;

COMMIT;
