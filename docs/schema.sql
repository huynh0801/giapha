-- ============================================================
-- GIA PHA DONG HO - PRIVATE MULTI-TENANT SCHEMA
-- ============================================================
-- Run this file on a Supabase project when resetting the app foundation.
-- Genealogy data is private by default. Anonymous users can only read
-- published system blog posts.

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ============================================================
-- RESET
-- ============================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_confirm ON auth.users;

DROP VIEW IF EXISTS public.person_private_details CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.change_requests CASCADE;
DROP TABLE IF EXISTS public.join_requests CASCADE;
DROP TABLE IF EXISTS public.invitations CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.custom_events CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.relationships CASCADE;
DROP TABLE IF EXISTS public.person_details_private CASCADE;
DROP TABLE IF EXISTS public.person_private_details CASCADE;
DROP TABLE IF EXISTS public.persons CASCADE;
DROP TABLE IF EXISTS public.family_trees CASCADE;
DROP TABLE IF EXISTS public.family_memberships CASCADE;
DROP TABLE IF EXISTS public.families CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.site_visits CASCADE;

DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.slugify(text) CASCADE;
DROP FUNCTION IF EXISTS public.is_system_admin() CASCADE;
DROP FUNCTION IF EXISTS public.has_family_role(uuid, text[]) CASCADE;
DROP FUNCTION IF EXISTS public.can_view_family(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.can_edit_family(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.can_manage_family(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.can_manage_family_admins(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_first_user_confirmation() CASCADE;
DROP FUNCTION IF EXISTS public.audit_row_change() CASCADE;
DROP FUNCTION IF EXISTS public.get_admin_users() CASCADE;
DROP FUNCTION IF EXISTS public.set_user_role(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.delete_user(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.admin_create_user(text, text, text, text, boolean) CASCADE;
DROP FUNCTION IF EXISTS public.set_user_active_status(uuid, boolean) CASCADE;
DROP FUNCTION IF EXISTS public.mark_password_changed() CASCADE;
DROP FUNCTION IF EXISTS public.upsert_default_admin(text, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.upsert_default_admin() CASCADE;
DROP FUNCTION IF EXISTS public.upsert_default_system_admin(text, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.upsert_default_system_admin() CASCADE;
DROP FUNCTION IF EXISTS public.create_family_with_admin(text, text, text, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_family_directory(text, int, int) CASCADE;
DROP FUNCTION IF EXISTS public.get_family_directory(text, text, int, int) CASCADE;
DROP FUNCTION IF EXISTS public.set_family_membership(uuid, uuid, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.get_admin_families() CASCADE;
DROP FUNCTION IF EXISTS public.get_family_admin_contacts(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_family_membership_roster(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.replace_family_admin(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.delete_family(uuid) CASCADE;

DROP TYPE IF EXISTS public.admin_user_data CASCADE;
DROP TYPE IF EXISTS public.family_directory_row CASCADE;
DROP TYPE IF EXISTS public.user_role_enum CASCADE;
DROP TYPE IF EXISTS public.gender_enum CASCADE;
DROP TYPE IF EXISTS public.relationship_type_enum CASCADE;
DROP TYPE IF EXISTS public.platform_role_enum CASCADE;
DROP TYPE IF EXISTS public.family_role_enum CASCADE;
DROP TYPE IF EXISTS public.membership_status_enum CASCADE;
DROP TYPE IF EXISTS public.family_status_enum CASCADE;
DROP TYPE IF EXISTS public.visibility_enum CASCADE;
DROP TYPE IF EXISTS public.post_scope_enum CASCADE;
DROP TYPE IF EXISTS public.content_status_enum CASCADE;
DROP TYPE IF EXISTS public.request_status_enum CASCADE;
DROP TYPE IF EXISTS public.notification_status_enum CASCADE;

DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars." ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update avatars." ON storage.objects;
DROP POLICY IF EXISTS "Blog images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "System admins can upload blog images." ON storage.objects;
DROP POLICY IF EXISTS "System admins can update blog images." ON storage.objects;
DROP POLICY IF EXISTS "System admins can delete blog images." ON storage.objects;
DROP POLICY IF EXISTS "Family assets are private to members." ON storage.objects;
DROP POLICY IF EXISTS "Family editors can upload blog images." ON storage.objects;
DROP POLICY IF EXISTS "Family editors can update blog images." ON storage.objects;
DROP POLICY IF EXISTS "Family editors can delete blog images." ON storage.objects;
DROP POLICY IF EXISTS "Family admins can upload blog images." ON storage.objects;
DROP POLICY IF EXISTS "Family admins can update blog images." ON storage.objects;
DROP POLICY IF EXISTS "Family admins can delete blog images." ON storage.objects;
DROP POLICY IF EXISTS "Family admins can manage assets." ON storage.objects;

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE public.gender_enum AS ENUM ('male', 'female', 'other');

CREATE TYPE public.relationship_type_enum AS ENUM (
  'marriage',
  'biological_child',
  'adopted_child',
  'step_child',
  'foster_child'
);

CREATE TYPE public.platform_role_enum AS ENUM ('system_admin', 'member');
CREATE TYPE public.family_role_enum AS ENUM ('family_admin', 'member');
CREATE TYPE public.membership_status_enum AS ENUM ('invited', 'pending', 'active', 'blocked');
CREATE TYPE public.family_status_enum AS ENUM ('active', 'archived', 'suspended');
CREATE TYPE public.visibility_enum AS ENUM ('private', 'family_only', 'public');
CREATE TYPE public.post_scope_enum AS ENUM ('system', 'family');
CREATE TYPE public.content_status_enum AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.request_status_enum AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE public.notification_status_enum AS ENUM ('unread', 'read', 'archived');

-- ============================================================
-- UTILITY FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.slugify(input text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT trim(both '-' from regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', '-', 'g'));
$$;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  role public.platform_role_enum NOT NULL DEFAULT 'member',
  is_active boolean NOT NULL DEFAULT true,
  must_change_password boolean NOT NULL DEFAULT false,
  password_changed_at timestamptz,
  avatar_url text,
  phone_number text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.families (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  origin_location text,
  logo_url text,
  visibility public.visibility_enum NOT NULL DEFAULT 'private',
  status public.family_status_enum NOT NULL DEFAULT 'active',
  settings jsonb NOT NULL DEFAULT '{"blog_max_images_per_post": 1}'::jsonb,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT families_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE TABLE public.family_memberships (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.family_role_enum NOT NULL DEFAULT 'member',
  status public.membership_status_enum NOT NULL DEFAULT 'active',
  is_primary_admin boolean NOT NULL DEFAULT false,
  invited_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (family_id, profile_id)
);

CREATE TABLE public.family_trees (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  root_person_id uuid,
  visibility public.visibility_enum NOT NULL DEFAULT 'private',
  is_primary boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (family_id, slug),
  CONSTRAINT family_trees_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE TABLE public.persons (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  tree_id uuid NOT NULL REFERENCES public.family_trees(id) ON DELETE CASCADE,
  external_ref text,
  full_name text NOT NULL,
  gender public.gender_enum NOT NULL,
  birth_year int,
  birth_month int,
  birth_day int,
  death_year int,
  death_month int,
  death_day int,
  death_lunar_year int,
  death_lunar_month int,
  death_lunar_day int,
  is_deceased boolean NOT NULL DEFAULT false,
  is_in_law boolean NOT NULL DEFAULT false,
  birth_order int,
  generation int,
  other_names text,
  avatar_url text,
  note text,
  visibility public.visibility_enum NOT NULL DEFAULT 'private',
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT persons_family_tree_match CHECK (family_id IS NOT NULL AND tree_id IS NOT NULL),
  CONSTRAINT persons_birth_date CHECK (
    (birth_month IS NULL OR birth_month BETWEEN 1 AND 12)
    AND (birth_day IS NULL OR birth_day BETWEEN 1 AND 31)
  ),
  CONSTRAINT persons_death_date CHECK (
    (death_month IS NULL OR death_month BETWEEN 1 AND 12)
    AND (death_day IS NULL OR death_day BETWEEN 1 AND 31)
    AND (death_lunar_month IS NULL OR death_lunar_month BETWEEN 1 AND 12)
    AND (death_lunar_day IS NULL OR death_lunar_day BETWEEN 1 AND 31)
  )
);

ALTER TABLE public.family_trees
  ADD CONSTRAINT family_trees_root_person_fk
  FOREIGN KEY (root_person_id) REFERENCES public.persons(id) ON DELETE SET NULL;

CREATE TABLE public.person_details_private (
  person_id uuid PRIMARY KEY REFERENCES public.persons(id) ON DELETE CASCADE,
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  tree_id uuid NOT NULL REFERENCES public.family_trees(id) ON DELETE CASCADE,
  phone_number text,
  occupation text,
  current_residence text,
  sensitive_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE VIEW public.person_private_details
WITH (security_invoker = true) AS
SELECT * FROM public.person_details_private;

CREATE TABLE public.relationships (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  tree_id uuid NOT NULL REFERENCES public.family_trees(id) ON DELETE CASCADE,
  type public.relationship_type_enum NOT NULL,
  person_a uuid NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
  person_b uuid NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
  note text,
  visibility public.visibility_enum NOT NULL DEFAULT 'private',
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT no_self_relationship CHECK (person_a <> person_b),
  UNIQUE (tree_id, person_a, person_b, type)
);

CREATE TABLE public.custom_events (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  tree_id uuid REFERENCES public.family_trees(id) ON DELETE SET NULL,
  name text NOT NULL,
  content text,
  event_date date NOT NULL,
  lunar_day int,
  lunar_month int,
  lunar_year int,
  is_lunar boolean NOT NULL DEFAULT false,
  recurrence text NOT NULL DEFAULT 'none',
  location text,
  visibility public.visibility_enum NOT NULL DEFAULT 'private',
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE VIEW public.events
WITH (security_invoker = true) AS
SELECT * FROM public.custom_events;

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  scope public.post_scope_enum NOT NULL DEFAULT 'system',
  family_id uuid REFERENCES public.families(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  excerpt text,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'VĂN HÓA DÒNG HỌ',
  cover_image_url text NOT NULL,
  cover_image_path text,
  is_published boolean NOT NULL DEFAULT false,
  status public.content_status_enum NOT NULL DEFAULT 'draft',
  visibility public.visibility_enum NOT NULL DEFAULT 'private',
  published_at timestamptz,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT blog_posts_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT blog_posts_scope_check CHECK (
    (scope = 'system' AND family_id IS NULL)
    OR (scope = 'family' AND family_id IS NOT NULL)
  ),
  UNIQUE (scope, family_id, slug)
);

CREATE VIEW public.posts
WITH (security_invoker = true) AS
SELECT * FROM public.blog_posts;

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  tree_id uuid REFERENCES public.family_trees(id) ON DELETE SET NULL,
  person_id uuid REFERENCES public.persons(id) ON DELETE SET NULL,
  post_id uuid REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_path text NOT NULL,
  mime_type text,
  size_bytes bigint,
  visibility public.visibility_enum NOT NULL DEFAULT 'private',
  uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.invitations (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  email text NOT NULL,
  role public.family_role_enum NOT NULL DEFAULT 'member',
  token text NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(24), 'hex'),
  status public.membership_status_enum NOT NULL DEFAULT 'invited',
  invited_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL DEFAULT auth.uid(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.join_requests (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text,
  status public.request_status_enum NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (family_id, profile_id)
);

CREATE TABLE public.change_requests (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  tree_id uuid REFERENCES public.family_trees(id) ON DELETE SET NULL,
  person_id uuid REFERENCES public.persons(id) ON DELETE SET NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  requested_change jsonb NOT NULL,
  note text,
  status public.request_status_enum NOT NULL DEFAULT 'pending',
  requested_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL DEFAULT auth.uid(),
  reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  family_id uuid REFERENCES public.families(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  link text,
  status public.notification_status_enum NOT NULL DEFAULT 'unread',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  family_id uuid REFERENCES public.families(id) ON DELETE SET NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  action text NOT NULL,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.site_visits (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  family_id uuid REFERENCES public.families(id) ON DELETE SET NULL,
  visitor_id text NOT NULL,
  path text NOT NULL,
  referrer text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_active ON public.profiles(is_active);
CREATE INDEX idx_families_slug ON public.families(slug);
CREATE INDEX idx_family_memberships_profile ON public.family_memberships(profile_id, status);
CREATE INDEX idx_family_memberships_family ON public.family_memberships(family_id, status, role);
CREATE INDEX idx_family_memberships_primary_admin ON public.family_memberships(family_id, is_primary_admin)
  WHERE role = 'family_admin' AND status = 'active';
CREATE INDEX idx_family_trees_family ON public.family_trees(family_id, is_primary);
CREATE INDEX idx_persons_family_tree ON public.persons(family_id, tree_id);
CREATE INDEX idx_persons_name ON public.persons(family_id, tree_id, full_name);
CREATE INDEX idx_persons_generation ON public.persons(family_id, tree_id, generation);
CREATE UNIQUE INDEX idx_persons_tree_external_ref ON public.persons(tree_id, lower(external_ref))
  WHERE external_ref IS NOT NULL AND external_ref <> '';
CREATE INDEX idx_relationships_family_tree ON public.relationships(family_id, tree_id);
CREATE INDEX idx_relationships_person_a ON public.relationships(person_a);
CREATE INDEX idx_relationships_person_b ON public.relationships(person_b);
CREATE UNIQUE INDEX idx_relationships_tree_marriage_pair ON public.relationships(
  tree_id,
  LEAST(person_a, person_b),
  GREATEST(person_a, person_b),
  type
) WHERE type = 'marriage';
CREATE INDEX idx_custom_events_family_date ON public.custom_events(family_id, event_date);
CREATE INDEX idx_blog_posts_scope_slug ON public.blog_posts(scope, family_id, slug);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(scope, family_id, is_published, published_at DESC);
CREATE INDEX idx_documents_family ON public.documents(family_id, person_id);
CREATE INDEX idx_audit_family_created ON public.audit_logs(family_id, created_at DESC);
CREATE INDEX idx_site_visits_created ON public.site_visits(created_at DESC);

-- ============================================================
-- RLS HELPERS
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_system_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'system_admin'
      AND is_active = true
      AND must_change_password = false
  );
END;
$$;
REVOKE ALL ON FUNCTION public.is_system_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_system_admin() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.has_family_role(target_family_id uuid, allowed_roles text[])
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.family_memberships fm
    JOIN public.profiles p ON p.id = fm.profile_id
    WHERE fm.family_id = target_family_id
      AND fm.profile_id = auth.uid()
      AND fm.status = 'active'
      AND p.is_active = true
      AND fm.role::text = ANY(allowed_roles)
  );
END;
$$;
REVOKE ALL ON FUNCTION public.has_family_role(uuid, text[]) FROM public;
GRANT EXECUTE ON FUNCTION public.has_family_role(uuid, text[]) TO anon, authenticated;

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

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$ SELECT public.is_system_admin(); $$;
REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_details_private ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_self_select ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_system_admin());

CREATE POLICY profiles_join_request_review_select ON public.profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.join_requests jr
      WHERE jr.profile_id = profiles.id
        AND public.can_manage_family(jr.family_id)
    )
  );

CREATE POLICY profiles_self_update ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_system_admin())
  WITH CHECK (id = auth.uid() OR public.is_system_admin());

CREATE POLICY families_private_select ON public.families
  FOR SELECT TO authenticated
  USING (public.can_view_family(id));

CREATE POLICY families_manage_update ON public.families
  FOR UPDATE TO authenticated
  USING (public.can_manage_family(id))
  WITH CHECK (public.can_manage_family(id));

CREATE POLICY memberships_select_visible ON public.family_memberships
  FOR SELECT TO authenticated
  USING (public.can_view_family(family_id) OR profile_id = auth.uid());

CREATE POLICY memberships_manage_insert ON public.family_memberships
  FOR INSERT TO authenticated
  WITH CHECK (public.can_manage_family(family_id));

CREATE POLICY memberships_manage_update ON public.family_memberships
  FOR UPDATE TO authenticated
  USING (public.can_manage_family(family_id))
  WITH CHECK (public.can_manage_family(family_id));

CREATE POLICY memberships_manage_delete ON public.family_memberships
  FOR DELETE TO authenticated
  USING (public.can_manage_family(family_id));

CREATE POLICY family_trees_select_private ON public.family_trees
  FOR SELECT TO authenticated
  USING (public.can_view_family(family_id));

CREATE POLICY family_trees_edit_insert ON public.family_trees
  FOR INSERT TO authenticated
  WITH CHECK (public.can_edit_family(family_id));

CREATE POLICY family_trees_edit_update ON public.family_trees
  FOR UPDATE TO authenticated
  USING (public.can_edit_family(family_id))
  WITH CHECK (public.can_edit_family(family_id));

CREATE POLICY family_trees_manage_delete ON public.family_trees
  FOR DELETE TO authenticated
  USING (public.can_manage_family(family_id));

CREATE POLICY persons_select_private ON public.persons
  FOR SELECT TO authenticated
  USING (public.can_view_family(family_id));

CREATE POLICY persons_edit_insert ON public.persons
  FOR INSERT TO authenticated
  WITH CHECK (
    public.can_edit_family(family_id)
    AND EXISTS (
      SELECT 1
      FROM public.family_trees ft
      WHERE ft.id = tree_id
        AND ft.family_id = persons.family_id
    )
  );

CREATE POLICY persons_edit_update ON public.persons
  FOR UPDATE TO authenticated
  USING (public.can_edit_family(family_id))
  WITH CHECK (public.can_edit_family(family_id));

CREATE POLICY persons_edit_delete ON public.persons
  FOR DELETE TO authenticated
  USING (public.can_edit_family(family_id));

CREATE POLICY private_details_family_admin_select ON public.person_details_private
  FOR SELECT TO authenticated
  USING (public.can_edit_family(family_id));

CREATE POLICY private_details_family_admin_all ON public.person_details_private
  FOR ALL TO authenticated
  USING (public.can_edit_family(family_id))
  WITH CHECK (public.can_edit_family(family_id));

CREATE POLICY relationships_select_private ON public.relationships
  FOR SELECT TO authenticated
  USING (public.can_view_family(family_id));

CREATE POLICY relationships_edit_insert ON public.relationships
  FOR INSERT TO authenticated
  WITH CHECK (
    public.can_edit_family(family_id)
    AND EXISTS (SELECT 1 FROM public.persons p WHERE p.id = person_a AND p.family_id = relationships.family_id AND p.tree_id = relationships.tree_id)
    AND EXISTS (SELECT 1 FROM public.persons p WHERE p.id = person_b AND p.family_id = relationships.family_id AND p.tree_id = relationships.tree_id)
  );

CREATE POLICY relationships_edit_update ON public.relationships
  FOR UPDATE TO authenticated
  USING (public.can_edit_family(family_id))
  WITH CHECK (public.can_edit_family(family_id));

CREATE POLICY relationships_edit_delete ON public.relationships
  FOR DELETE TO authenticated
  USING (public.can_edit_family(family_id));

CREATE POLICY custom_events_select_private ON public.custom_events
  FOR SELECT TO authenticated
  USING (public.can_view_family(family_id));

CREATE POLICY custom_events_edit_insert ON public.custom_events
  FOR INSERT TO authenticated
  WITH CHECK (public.can_edit_family(family_id));

CREATE POLICY custom_events_edit_update ON public.custom_events
  FOR UPDATE TO authenticated
  USING (public.can_edit_family(family_id))
  WITH CHECK (public.can_edit_family(family_id));

CREATE POLICY custom_events_edit_delete ON public.custom_events
  FOR DELETE TO authenticated
  USING (public.can_edit_family(family_id));

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

CREATE POLICY documents_select_private ON public.documents
  FOR SELECT TO authenticated
  USING (public.can_view_family(family_id));

CREATE POLICY documents_edit_all ON public.documents
  FOR ALL TO authenticated
  USING (public.can_edit_family(family_id))
  WITH CHECK (public.can_edit_family(family_id));

CREATE POLICY invitations_manage_select ON public.invitations
  FOR SELECT TO authenticated
  USING (public.can_manage_family(family_id));

CREATE POLICY invitations_manage_all ON public.invitations
  FOR ALL TO authenticated
  USING (public.can_manage_family(family_id))
  WITH CHECK (public.can_manage_family(family_id));

CREATE POLICY join_requests_self_or_manage_select ON public.join_requests
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid() OR public.can_manage_family(family_id));

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

CREATE POLICY join_requests_self_update ON public.join_requests
  FOR UPDATE TO authenticated
  USING (
    profile_id = auth.uid()
    AND status IN ('pending', 'rejected', 'cancelled')
  )
  WITH CHECK (
    profile_id = auth.uid()
    AND status = 'pending'
  );

CREATE POLICY join_requests_manage_update ON public.join_requests
  FOR UPDATE TO authenticated
  USING (public.can_manage_family(family_id))
  WITH CHECK (public.can_manage_family(family_id));

CREATE POLICY change_requests_family_select ON public.change_requests
  FOR SELECT TO authenticated
  USING (public.can_view_family(family_id));

CREATE POLICY change_requests_member_insert ON public.change_requests
  FOR INSERT TO authenticated
  WITH CHECK (public.can_view_family(family_id) AND requested_by = auth.uid());

CREATE POLICY change_requests_manage_update ON public.change_requests
  FOR UPDATE TO authenticated
  USING (public.can_edit_family(family_id))
  WITH CHECK (public.can_edit_family(family_id));

CREATE POLICY notifications_self_select ON public.notifications
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY notifications_self_update ON public.notifications
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

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

CREATE POLICY audit_insert_authenticated ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid() OR public.is_system_admin());

CREATE POLICY site_visits_insert_public ON public.site_visits
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY site_visits_select_admins ON public.site_visits
  FOR SELECT TO authenticated
  USING (
    (family_id IS NULL AND public.is_system_admin())
    OR (family_id IS NOT NULL AND public.can_manage_family(family_id))
  );

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER tr_families_updated_at BEFORE UPDATE ON public.families
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER tr_family_memberships_updated_at BEFORE UPDATE ON public.family_memberships
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER tr_family_trees_updated_at BEFORE UPDATE ON public.family_trees
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER tr_persons_updated_at BEFORE UPDATE ON public.persons
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER tr_person_details_private_updated_at BEFORE UPDATE ON public.person_details_private
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER tr_relationships_updated_at BEFORE UPDATE ON public.relationships
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER tr_custom_events_updated_at BEFORE UPDATE ON public.custom_events
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER tr_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER tr_documents_updated_at BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER tr_invitations_updated_at BEFORE UPDATE ON public.invitations
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER tr_join_requests_updated_at BEFORE UPDATE ON public.join_requests
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER tr_change_requests_updated_at BEFORE UPDATE ON public.change_requests
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.audit_row_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row_data jsonb;
  old_row jsonb;
  family uuid;
  entity uuid;
BEGIN
  row_data := to_jsonb(COALESCE(NEW, OLD));
  old_row := CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END;
  family := NULLIF(row_data->>'family_id', '')::uuid;
  entity := NULLIF(row_data->>'id', '')::uuid;

  INSERT INTO public.audit_logs (
    actor_id, family_id, entity_type, entity_id, action, old_data, new_data
  )
  VALUES (
    auth.uid(),
    family,
    TG_TABLE_NAME,
    entity,
    lower(TG_OP),
    old_row,
    CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER audit_families AFTER INSERT OR UPDATE OR DELETE ON public.families
FOR EACH ROW EXECUTE PROCEDURE public.audit_row_change();

CREATE TRIGGER audit_family_memberships AFTER INSERT OR UPDATE OR DELETE ON public.family_memberships
FOR EACH ROW EXECUTE PROCEDURE public.audit_row_change();

CREATE TRIGGER audit_family_trees AFTER INSERT OR UPDATE OR DELETE ON public.family_trees
FOR EACH ROW EXECUTE PROCEDURE public.audit_row_change();

CREATE TRIGGER audit_persons AFTER INSERT OR UPDATE OR DELETE ON public.persons
FOR EACH ROW EXECUTE PROCEDURE public.audit_row_change();

CREATE TRIGGER audit_person_details_private AFTER INSERT OR UPDATE OR DELETE ON public.person_details_private
FOR EACH ROW EXECUTE PROCEDURE public.audit_row_change();

CREATE TRIGGER audit_relationships AFTER INSERT OR UPDATE OR DELETE ON public.relationships
FOR EACH ROW EXECUTE PROCEDURE public.audit_row_change();

CREATE TRIGGER audit_custom_events AFTER INSERT OR UPDATE OR DELETE ON public.custom_events
FOR EACH ROW EXECUTE PROCEDURE public.audit_row_change();

CREATE TRIGGER audit_blog_posts AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts
FOR EACH ROW EXECUTE PROCEDURE public.audit_row_change();

CREATE TRIGGER audit_documents AFTER INSERT OR UPDATE OR DELETE ON public.documents
FOR EACH ROW EXECUTE PROCEDURE public.audit_row_change();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, is_active, must_change_password)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    'member',
    true,
    false
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_first_user_confirmation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
BEGIN
  NEW.email_confirmed_at := COALESCE(NEW.email_confirmed_at, now());
  NEW.last_sign_in_at := COALESCE(NEW.last_sign_in_at, now());
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE TRIGGER on_auth_user_created_confirm
BEFORE INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_first_user_confirmation();

-- ============================================================
-- RPC FUNCTIONS
-- ============================================================

CREATE TYPE public.admin_user_data AS (
  id uuid,
  full_name text,
  email text,
  role public.platform_role_enum,
  created_at timestamptz,
  is_active boolean,
  must_change_password boolean,
  phone_number text
);

CREATE TYPE public.family_directory_row AS (
  id uuid,
  name text,
  slug text,
  visibility public.visibility_enum,
  status public.family_status_enum,
  public_description text,
  public_origin_location text,
  logo_url text,
  admin_names text,
  admin_contacts text,
  member_count int,
  has_active_membership boolean,
  request_status public.request_status_enum,
  total_count int
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
    FROM public.persons person_row
    WHERE person_row.family_id = p.id
  ) members ON true
  WHERE p.row_index > ((p.page_number - 1) * p.page_size)
    AND p.row_index <= (p.page_number * p.page_size)
  ORDER BY p.created_at DESC, p.id DESC;
$$;
REVOKE ALL ON FUNCTION public.get_family_directory(text, text, int, int) FROM public;
GRANT EXECUTE ON FUNCTION public.get_family_directory(text, text, int, int) TO authenticated;

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

CREATE OR REPLACE FUNCTION public.set_user_role(target_user_id uuid, new_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_system_admin() THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;

  INSERT INTO public.profiles (
    id, full_name, role, is_active, must_change_password, created_at, updated_at
  )
  SELECT
    au.id,
    COALESCE(
      au.raw_user_meta_data->>'full_name',
      au.raw_user_meta_data->>'name'
    ),
    new_role::public.platform_role_enum,
    true,
    false,
    now(),
    now()
  FROM auth.users au
  WHERE au.id = target_user_id
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    must_change_password = CASE
      WHEN EXCLUDED.role = 'system_admin'::public.platform_role_enum THEN true
      ELSE COALESCE(public.profiles.must_change_password, false)
    END,
    updated_at = now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found.';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.is_system_admin() THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;

  IF auth.uid() = target_user_id THEN
    RAISE EXCEPTION 'Cannot delete yourself.';
  END IF;

  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_create_user(
  new_full_name text,
  new_email text,
  new_password text,
  new_role text,
  new_active boolean
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  new_id uuid;
  normalized_email text;
  normalized_role public.platform_role_enum;
  must_change boolean;
BEGIN
  IF NOT public.is_system_admin() THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;

  normalized_email := lower(trim(new_email));
  normalized_role := new_role::public.platform_role_enum;
  must_change := normalized_role = 'system_admin';
  new_id := extensions.gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at,
    confirmation_token, recovery_token, email_change_token_new,
    email_change_token_current, reauthentication_token, email_change,
    phone_change, phone_change_token,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  )
  VALUES (
    new_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    normalized_email,
    extensions.crypt(new_password, extensions.gen_salt('bf')),
    now(),
    '', '', '', '', '', '', '', '',
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', new_full_name),
    now(),
    now()
  );

  INSERT INTO public.profiles (
    id, full_name, role, is_active, must_change_password, created_at, updated_at
  )
  VALUES (
    new_id,
    nullif(trim(new_full_name), ''),
    normalized_role,
    new_active,
    must_change,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    must_change_password = EXCLUDED.must_change_password,
    updated_at = now();

  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_user_active_status(target_user_id uuid, new_status boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_system_admin() THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;

  INSERT INTO public.profiles (
    id, full_name, role, is_active, must_change_password, created_at, updated_at
  )
  SELECT
    au.id,
    COALESCE(
      au.raw_user_meta_data->>'full_name',
      au.raw_user_meta_data->>'name'
    ),
    'member'::public.platform_role_enum,
    new_status,
    false,
    now(),
    now()
  FROM auth.users au
  WHERE au.id = target_user_id
  ON CONFLICT (id) DO UPDATE SET
    is_active = EXCLUDED.is_active,
    updated_at = now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found.';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_password_changed()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated.';
  END IF;

  UPDATE public.profiles
  SET must_change_password = false,
      password_changed_at = now(),
      updated_at = now()
  WHERE id = auth.uid();
END;
$$;
REVOKE ALL ON FUNCTION public.mark_password_changed() FROM public;
GRANT EXECUTE ON FUNCTION public.mark_password_changed() TO authenticated;

-- NOTICE: Default admin creation must be performed via Supabase Auth Dashboard or secure CLI seeds.
-- public.upsert_default_system_admin and public.upsert_default_admin were removed for security.

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
          'profile_email', au.email,
          'profile_phone_number', pr.phone_number
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
  GROUP BY f.id, f.name, f.slug, f.description, f.visibility, f.status, f.settings, f.created_at, persons.person_count
  ORDER BY f.created_at DESC, f.id DESC;
END;
$$;
REVOKE ALL ON FUNCTION public.get_admin_families() FROM public;
GRANT EXECUTE ON FUNCTION public.get_admin_families() TO authenticated;

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

  IF NOT EXISTS (
    SELECT 1
    FROM public.families f
    WHERE f.id = target_family_id
  ) THEN
    RAISE EXCEPTION 'Family not found.';
  END IF;

  -- Delete dependent rows while the parent family still exists so audit triggers
  -- can write valid family_id values. The family row is removed last.
  DELETE FROM public.notifications WHERE family_id = target_family_id;
  DELETE FROM public.change_requests WHERE family_id = target_family_id;
  DELETE FROM public.join_requests WHERE family_id = target_family_id;
  DELETE FROM public.invitations WHERE family_id = target_family_id;
  DELETE FROM public.documents WHERE family_id = target_family_id;
  DELETE FROM public.custom_events WHERE family_id = target_family_id;
  DELETE FROM public.relationships WHERE family_id = target_family_id;
  DELETE FROM public.person_details_private WHERE family_id = target_family_id;
  DELETE FROM public.persons WHERE family_id = target_family_id;
  DELETE FROM public.blog_posts WHERE family_id = target_family_id;
  DELETE FROM public.family_trees WHERE family_id = target_family_id;
  DELETE FROM public.family_memberships WHERE family_id = target_family_id;

  UPDATE public.audit_logs
  SET family_id = NULL
  WHERE family_id = target_family_id;

  UPDATE public.site_visits
  SET family_id = NULL
  WHERE family_id = target_family_id;

  DELETE FROM public.families
  WHERE id = target_family_id;
END;
$$;
REVOKE ALL ON FUNCTION public.delete_family(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.delete_family(uuid) TO authenticated;

-- ============================================================
-- STORAGE
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', true),
  ('blog-images', 'blog-images', true),
  ('family-assets', 'family-assets', false)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars." ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can update avatars." ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'avatars') WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Blog images are publicly accessible." ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

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

CREATE POLICY "Family assets are private to members." ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'family-assets'
  AND split_part(name, '/', 1) = 'families'
  AND split_part(name, '/', 2) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND public.can_view_family(split_part(name, '/', 2)::uuid)
);

CREATE POLICY "Family admins can manage assets." ON storage.objects
FOR ALL TO authenticated
USING (
  bucket_id = 'family-assets'
  AND split_part(name, '/', 1) = 'families'
  AND split_part(name, '/', 2) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND public.can_edit_family(split_part(name, '/', 2)::uuid)
)
WITH CHECK (
  bucket_id = 'family-assets'
  AND split_part(name, '/', 1) = 'families'
  AND split_part(name, '/', 2) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND public.can_edit_family(split_part(name, '/', 2)::uuid)
);

-- ============================================================
-- FAMILY PRIMARY / ASSISTANT ADMIN ROLES
-- ============================================================

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
  FOR INSERT TO authenticated
  WITH CHECK (
    public.can_manage_family_admins(family_id)
    OR (
      public.can_manage_family(family_id)
      AND role = 'member'
      AND is_primary_admin = false
    )
  );

CREATE POLICY memberships_manage_update ON public.family_memberships
  FOR UPDATE TO authenticated
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
  FOR DELETE TO authenticated
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
