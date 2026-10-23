-- Enforce the handoff model:
-- System Admin creates a family and assigns the first Family Admin, then stays
-- outside family data and membership operations.

BEGIN;

DROP FUNCTION IF EXISTS public.is_editor() CASCADE;

DROP POLICY IF EXISTS families_system_insert ON public.families;
DROP POLICY IF EXISTS families_system_delete ON public.families;

DO $$
DECLARE
  has_editor boolean;
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typnamespace = 'public'::regnamespace
      AND typname = 'family_role_enum'
  ) THEN
    SELECT EXISTS (
      SELECT 1
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typnamespace = 'public'::regnamespace
        AND t.typname = 'family_role_enum'
        AND e.enumlabel = 'editor'
    )
    INTO has_editor;

    IF has_editor THEN
      IF to_regclass('public.family_memberships') IS NOT NULL THEN
        UPDATE public.family_memberships
        SET role = 'member'::public.family_role_enum
        WHERE role::text = 'editor';

        ALTER TABLE public.family_memberships
          ALTER COLUMN role DROP DEFAULT;
      END IF;

      IF to_regclass('public.invitations') IS NOT NULL THEN
        UPDATE public.invitations
        SET role = 'member'::public.family_role_enum
        WHERE role::text = 'editor';

        ALTER TABLE public.invitations
          ALTER COLUMN role DROP DEFAULT;
      END IF;

      DROP TYPE IF EXISTS public.family_role_enum_new;
      CREATE TYPE public.family_role_enum_new AS ENUM ('family_admin', 'member');

      IF to_regclass('public.family_memberships') IS NOT NULL THEN
        ALTER TABLE public.family_memberships
          ALTER COLUMN role TYPE public.family_role_enum_new
          USING role::text::public.family_role_enum_new;
      END IF;

      IF to_regclass('public.invitations') IS NOT NULL THEN
        ALTER TABLE public.invitations
          ALTER COLUMN role TYPE public.family_role_enum_new
          USING role::text::public.family_role_enum_new;
      END IF;

      DROP TYPE public.family_role_enum;
      ALTER TYPE public.family_role_enum_new RENAME TO family_role_enum;

      IF to_regclass('public.family_memberships') IS NOT NULL THEN
        ALTER TABLE public.family_memberships
          ALTER COLUMN role SET DEFAULT 'member'::public.family_role_enum;
      END IF;

      IF to_regclass('public.invitations') IS NOT NULL THEN
        ALTER TABLE public.invitations
          ALTER COLUMN role SET DEFAULT 'member'::public.family_role_enum;
      END IF;
    END IF;
  ELSE
    CREATE TYPE public.family_role_enum AS ENUM ('family_admin', 'member');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.can_view_family(target_family_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
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
AS $$ SELECT public.has_family_role(target_family_id, ARRAY['family_admin']); $$;
REVOKE ALL ON FUNCTION public.can_edit_family(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.can_edit_family(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.can_manage_family(target_family_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$ SELECT public.has_family_role(target_family_id, ARRAY['family_admin']); $$;
REVOKE ALL ON FUNCTION public.can_manage_family(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.can_manage_family(uuid) TO anon, authenticated;

DROP POLICY IF EXISTS blog_posts_system_public_or_private_family_select ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_admin_insert ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_admin_update ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_admin_delete ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_manager_insert ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_manager_update ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_manager_delete ON public.blog_posts;

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
    OR (scope = 'family' AND family_id IS NOT NULL AND public.can_view_family(family_id))
  );

CREATE POLICY blog_posts_manager_insert ON public.blog_posts
  FOR INSERT TO authenticated
  WITH CHECK (
    (scope = 'system' AND family_id IS NULL AND public.is_system_admin())
    OR (scope = 'family' AND family_id IS NOT NULL AND public.can_edit_family(family_id))
  );

CREATE POLICY blog_posts_manager_update ON public.blog_posts
  FOR UPDATE TO authenticated
  USING (
    (scope = 'system' AND family_id IS NULL AND public.is_system_admin())
    OR (scope = 'family' AND family_id IS NOT NULL AND public.can_edit_family(family_id))
  )
  WITH CHECK (
    (scope = 'system' AND family_id IS NULL AND public.is_system_admin())
    OR (scope = 'family' AND family_id IS NOT NULL AND public.can_edit_family(family_id))
  );

CREATE POLICY blog_posts_manager_delete ON public.blog_posts
  FOR DELETE TO authenticated
  USING (
    (scope = 'system' AND family_id IS NULL AND public.is_system_admin())
    OR (scope = 'family' AND family_id IS NOT NULL AND public.can_edit_family(family_id))
  );

DROP POLICY IF EXISTS join_requests_self_insert ON public.join_requests;

CREATE POLICY join_requests_self_insert ON public.join_requests
  FOR INSERT TO authenticated
  WITH CHECK (
    profile_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'member'
        AND p.is_active = true
    )
  );

DROP POLICY IF EXISTS notifications_admin_insert ON public.notifications;
DROP POLICY IF EXISTS audit_select_admins ON public.audit_logs;
DROP POLICY IF EXISTS site_visits_select_admins ON public.site_visits;

CREATE POLICY notifications_admin_insert ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (
    (family_id IS NULL AND public.is_system_admin())
    OR (family_id IS NOT NULL AND public.can_manage_family(family_id))
  );

CREATE POLICY audit_select_admins ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    (family_id IS NULL AND public.is_system_admin())
    OR (family_id IS NOT NULL AND public.can_manage_family(family_id))
  );

CREATE POLICY site_visits_select_admins ON public.site_visits
  FOR SELECT TO authenticated
  USING (
    (family_id IS NULL AND public.is_system_admin())
    OR (family_id IS NOT NULL AND public.can_manage_family(family_id))
  );

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
      ) AS has_active_membership,
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
      AND NOT public.is_system_admin()
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
  VALUES (new_family_id, 'Cây gia phả chính', 'cay-chinh', 'Cây gia phả mặc định', true, auth.uid());

  INSERT INTO public.family_memberships (
    family_id, profile_id, role, status, invited_by, joined_at
  )
  VALUES (
    new_family_id, admin_profile_id, 'family_admin', 'active', auth.uid(), now()
  )
  ON CONFLICT (family_id, profile_id)
  DO UPDATE SET role = 'family_admin', status = 'active', updated_at = now();

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
BEGIN
  IF NOT public.can_manage_family(target_family_id) THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = target_profile_id
      AND p.role = 'member'
      AND p.is_active = true
  ) THEN
    RAISE EXCEPTION 'Family membership target must be an active member account.';
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

DROP POLICY IF EXISTS "System admins can upload blog images." ON storage.objects;
DROP POLICY IF EXISTS "System admins can update blog images." ON storage.objects;
DROP POLICY IF EXISTS "System admins can delete blog images." ON storage.objects;
DROP POLICY IF EXISTS "Family editors can upload blog images." ON storage.objects;
DROP POLICY IF EXISTS "Family editors can update blog images." ON storage.objects;
DROP POLICY IF EXISTS "Family editors can delete blog images." ON storage.objects;
DROP POLICY IF EXISTS "Family admins can upload blog images." ON storage.objects;
DROP POLICY IF EXISTS "Family admins can update blog images." ON storage.objects;
DROP POLICY IF EXISTS "Family admins can delete blog images." ON storage.objects;

CREATE POLICY "System admins can upload blog images." ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'blog-images'
  AND split_part(name, '/', 1) = 'system'
  AND public.is_system_admin()
);

CREATE POLICY "System admins can update blog images." ON storage.objects
FOR UPDATE TO authenticated USING (
  bucket_id = 'blog-images'
  AND split_part(name, '/', 1) = 'system'
  AND public.is_system_admin()
)
WITH CHECK (
  bucket_id = 'blog-images'
  AND split_part(name, '/', 1) = 'system'
  AND public.is_system_admin()
);

CREATE POLICY "System admins can delete blog images." ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'blog-images'
  AND split_part(name, '/', 1) = 'system'
  AND public.is_system_admin()
);

CREATE POLICY "Family admins can upload blog images." ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'blog-images'
  AND split_part(name, '/', 1) = 'families'
  AND split_part(name, '/', 2) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND public.can_edit_family(split_part(name, '/', 2)::uuid)
);

CREATE POLICY "Family admins can update blog images." ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'blog-images'
  AND split_part(name, '/', 1) = 'families'
  AND split_part(name, '/', 2) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND public.can_edit_family(split_part(name, '/', 2)::uuid)
)
WITH CHECK (
  bucket_id = 'blog-images'
  AND split_part(name, '/', 1) = 'families'
  AND split_part(name, '/', 2) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND public.can_edit_family(split_part(name, '/', 2)::uuid)
);

CREATE POLICY "Family admins can delete blog images." ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'blog-images'
  AND split_part(name, '/', 1) = 'families'
  AND split_part(name, '/', 2) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND public.can_edit_family(split_part(name, '/', 2)::uuid)
);

COMMIT;
