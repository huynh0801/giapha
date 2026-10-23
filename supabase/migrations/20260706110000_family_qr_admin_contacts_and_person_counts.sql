BEGIN;

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
    coalesce(admins.admin_names, 'Chưa gán Admin dòng họ') AS admin_names,
    coalesce(admins.admin_contacts, 'Chưa có thông tin liên hệ') AS admin_contacts,
    coalesce(members.member_count, 0)::int AS member_count,
    p.has_active_membership,
    p.request_status,
    p.total_count
  FROM ranked p
  LEFT JOIN LATERAL (
    SELECT
      string_agg(coalesce(pr.full_name, 'Admin dòng họ'), ', ' ORDER BY pr.full_name) AS admin_names,
      string_agg(
        trim(both ' -' FROM concat_ws(' - ', coalesce(pr.full_name, 'Admin dòng họ'), au.email, pr.phone_number)),
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
    FROM public.persons person_row
    WHERE person_row.family_id = p.id
  ) members ON true
  WHERE p.row_index > ((p.page_number - 1) * p.page_size)
    AND p.row_index <= (p.page_number * p.page_size)
  ORDER BY p.created_at DESC, p.id DESC;
$$;

REVOKE ALL ON FUNCTION public.get_family_directory(text, text, int, int) FROM public;
GRANT EXECUTE ON FUNCTION public.get_family_directory(text, text, int, int) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_family_admin_contacts(target_family_id uuid)
RETURNS TABLE (
  profile_id uuid,
  full_name text,
  email text,
  phone_number text
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
    coalesce(pr.full_name, 'Admin dòng họ') AS full_name,
    au.email::text AS email,
    pr.phone_number
  FROM public.family_memberships fm
  JOIN public.profiles pr ON pr.id = fm.profile_id
  LEFT JOIN auth.users au ON au.id = fm.profile_id
  WHERE fm.family_id = target_family_id
    AND fm.status = 'active'
    AND fm.role = 'family_admin'
  ORDER BY pr.full_name NULLS LAST, au.email;
END;
$$;

REVOKE ALL ON FUNCTION public.get_family_admin_contacts(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_family_admin_contacts(uuid) TO authenticated;

COMMIT;
