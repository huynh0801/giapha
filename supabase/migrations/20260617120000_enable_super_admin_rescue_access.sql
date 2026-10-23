CREATE OR REPLACE FUNCTION public.can_view_family(target_family_id uuid)
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
        AND p.is_active = true
    );
$$;
REVOKE ALL ON FUNCTION public.can_view_family(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.can_view_family(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.can_edit_family(target_family_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$ SELECT public.is_system_admin() OR public.has_family_role(target_family_id, ARRAY['family_admin']); $$;
REVOKE ALL ON FUNCTION public.can_edit_family(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.can_edit_family(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.can_manage_family(target_family_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$ SELECT public.is_system_admin() OR public.has_family_role(target_family_id, ARRAY['family_admin']); $$;
REVOKE ALL ON FUNCTION public.can_manage_family(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.can_manage_family(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_family_directory(
  search_term text DEFAULT '',
  visibility_filter text DEFAULT 'all',
  page_number int DEFAULT 1,
  page_size int DEFAULT 12
)
RETURNS SETOF public.family_directory_row
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
  WITH normalized AS (
    SELECT
      lower(trim(coalesce(search_term, ''))) AS q,
      lower(trim(coalesce(visibility_filter, 'all'))) AS visibility_filter,
      greatest(coalesce(page_number, 1), 1) AS page_number,
      least(greatest(coalesce(page_size, 12), 1), 50) AS page_size
  ),
  filtered AS (
    SELECT
      f.*,
      EXISTS (
        SELECT 1
        FROM public.family_memberships fm
        WHERE fm.family_id = f.id
          AND fm.profile_id = auth.uid()
          AND fm.status = 'active'
      ) OR public.is_system_admin() AS has_active_membership,
      (
        SELECT jr.status
        FROM public.join_requests jr
        WHERE jr.family_id = f.id
          AND jr.profile_id = auth.uid()
        ORDER BY jr.created_at DESC
        LIMIT 1
      ) AS request_status
    FROM public.families f
    CROSS JOIN normalized n
    WHERE f.status = 'active'
      AND (
        n.q = ''
        OR lower(f.name) LIKE ('%' || n.q || '%')
        OR lower(f.slug) LIKE ('%' || n.q || '%')
      )
      AND (
        n.visibility_filter = 'all'
        OR f.visibility::text = n.visibility_filter
      )
  ),
  ranked AS (
    SELECT
      filtered.*,
      count(*) OVER ()::int AS total_count,
      row_number() OVER (ORDER BY filtered.created_at DESC, filtered.id DESC)::int AS row_index,
      n.page_number,
      n.page_size
    FROM filtered
    CROSS JOIN normalized n
  )
  SELECT
    p.id,
    p.name,
    p.slug,
    p.visibility,
    p.status,
    CASE
      WHEN p.visibility = 'public' OR public.can_view_family(p.id)
      THEN p.description
      ELSE NULL
    END AS public_description,
    CASE
      WHEN p.visibility = 'public' OR public.can_view_family(p.id)
      THEN p.origin_location
      ELSE NULL
    END AS public_origin_location,
    CASE
      WHEN p.visibility = 'public' OR public.can_view_family(p.id)
      THEN p.logo_url
      ELSE NULL
    END AS logo_url,
    coalesce(admins.admin_names, 'Chua gan Admin dong ho') AS admin_names,
    coalesce(admins.admin_contacts, 'Chua co thong tin lien he') AS admin_contacts,
    coalesce(members.member_count, 0)::int AS member_count,
    p.has_active_membership,
    p.request_status,
    p.total_count
  FROM ranked p
  LEFT JOIN LATERAL (
    SELECT
      string_agg(coalesce(pr.full_name, 'Admin dong ho'), ', ' ORDER BY pr.full_name) AS admin_names,
      string_agg(
        trim(both ' -' FROM concat_ws(' - ', coalesce(pr.full_name, 'Admin dong ho'), au.email, pr.phone_number)),
        E'\n'
        ORDER BY pr.full_name
      ) AS admin_contacts
    FROM public.family_memberships fm
    JOIN public.profiles pr ON pr.id = fm.profile_id
    LEFT JOIN auth.users au ON au.id = pr.id
    WHERE fm.family_id = p.id
      AND fm.status = 'active'
      AND fm.role = 'family_admin'
  ) admins ON true
  LEFT JOIN LATERAL (
    SELECT count(*)::int AS member_count
    FROM public.family_memberships fm
    WHERE fm.family_id = p.id
      AND fm.status = 'active'
  ) members ON true
  WHERE p.row_index > ((p.page_number - 1) * p.page_size)
    AND p.row_index <= (p.page_number * p.page_size)
  ORDER BY p.created_at DESC, p.id DESC;
$$;
REVOKE ALL ON FUNCTION public.get_family_directory(text, text, int, int) FROM public;
GRANT EXECUTE ON FUNCTION public.get_family_directory(text, text, int, int) TO authenticated;

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
  actor_is_system_admin boolean;
  target_platform_role public.platform_role_enum;
BEGIN
  actor_is_system_admin := public.is_system_admin();

  IF NOT public.can_manage_family(target_family_id) THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;

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

  IF EXISTS (
    SELECT 1
    FROM public.family_memberships fm
    WHERE fm.family_id = target_family_id
      AND fm.profile_id = target_profile_id
      AND fm.role = 'family_admin'
      AND fm.status = 'active'
  )
  AND (new_role <> 'family_admin' OR new_status <> 'active')
  AND NOT actor_is_system_admin
  AND NOT EXISTS (
    SELECT 1
    FROM public.family_memberships fm
    WHERE fm.family_id = target_family_id
      AND fm.profile_id <> target_profile_id
      AND fm.role = 'family_admin'
      AND fm.status = 'active'
  ) THEN
    RAISE EXCEPTION 'Cannot remove the last active family admin.';
  END IF;

  INSERT INTO public.family_memberships (
    family_id, profile_id, role, status, invited_by, joined_at
  )
  VALUES (
    target_family_id,
    target_profile_id,
    new_role::public.family_role_enum,
    new_status::public.membership_status_enum,
    auth.uid(),
    CASE WHEN new_status = 'active' THEN now() ELSE NULL END
  )
  ON CONFLICT (family_id, profile_id)
  DO UPDATE SET
    role = EXCLUDED.role,
    status = EXCLUDED.status,
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
