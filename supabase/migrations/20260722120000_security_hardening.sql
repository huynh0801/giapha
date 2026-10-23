BEGIN;

-- 1. Drop dangerous backdoor admin creation/reset functions completely
DROP FUNCTION IF EXISTS public.upsert_default_system_admin(text, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.upsert_default_system_admin() CASCADE;
DROP FUNCTION IF EXISTS public.upsert_default_admin(text, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.upsert_default_admin() CASCADE;

-- 2. Harden get_family_directory so anonymous users cannot scrape admin personal contacts (email/phone)
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
    CASE
      WHEN auth.uid() IS NOT NULL THEN coalesce(admins.admin_contacts, 'Chưa có thông tin liên hệ')
      ELSE 'Đăng nhập để xem thông tin liên hệ'
    END AS admin_contacts,
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
    FROM public.family_memberships fm
    WHERE fm.family_id = p.id
      AND fm.status = 'active'
  ) members ON true
  WHERE ranked.row_index > (ranked.page_number - 1) * ranked.page_size
    AND ranked.row_index <= ranked.page_number * ranked.page_size
  ORDER BY ranked.row_index;
$$;

REVOKE ALL ON FUNCTION public.get_family_directory(text, text, int, int) FROM public;
GRANT EXECUTE ON FUNCTION public.get_family_directory(text, text, int, int) TO anon, authenticated;

COMMIT;
