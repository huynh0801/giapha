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
