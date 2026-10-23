import {
  Family,
  FamilyContext,
  FamilyMembership,
  FamilyRole,
  FamilyTree,
  Profile,
} from "@/types";
import { createClient, createPublicClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";

type AccessibleFamily = {
  family: Family;
  membership: FamilyMembership | null;
  canEdit: boolean;
  canManage: boolean;
  canManageAdmins: boolean;
  isPrimaryFamilyAdmin: boolean;
};

export const getSupabase = cache(async () => {
  const cookieStore = await cookies();
  return createClient(cookieStore);
});

export const getPublicSupabase = () => {
  return createPublicClient();
};

export const getUser = cache(async () => {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

export const getProfile = cache(async (userId?: string) => {
  let id = userId;
  if (!id) {
    const user = await getUser();
    if (!user) return null;
    id = user.id;
  }

  const supabase = await getSupabase();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return profile as Profile | null;
});

export const getIsSystemAdmin = cache(async () => {
  const profile = await getProfile();
  return (
    profile?.is_active === true &&
    profile.role === "system_admin" &&
    profile.must_change_password === false
  );
});

// Backward-compatible name used by older admin pages.
export const getIsAdmin = getIsSystemAdmin;

function getRoleFlags(membership: FamilyMembership | null) {
  const isFamilyAdmin =
    membership?.status === "active" && membership.role === "family_admin";
  const isPrimaryFamilyAdmin =
    isFamilyAdmin && membership.is_primary_admin === true;

  return {
    canEdit: isFamilyAdmin,
    canManage: isFamilyAdmin,
    canManageAdmins: isPrimaryFamilyAdmin,
    isPrimaryFamilyAdmin,
  };
}

function getSystemAdminFlags(profile: Profile | null) {
  const isSystemAdmin =
    profile?.is_active === true &&
    profile.role === "system_admin" &&
    profile.must_change_password === false;

  return {
    isSystemAdmin,
    canEdit: isSystemAdmin,
    canManage: isSystemAdmin,
    canManageAdmins: isSystemAdmin,
    isPrimaryFamilyAdmin: false,
  };
}

export const getAccessibleFamilies = cache(async () => {
  const [supabase, profile, user] = await Promise.all([
    getSupabase(),
    getProfile(),
    getUser(),
  ]);

  if (!profile?.is_active || !user) return [] as AccessibleFamily[];

  const adminFlags = getSystemAdminFlags(profile);
  if (adminFlags.isSystemAdmin) {
    const { data } = await supabase
      .from("families")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: true });

    return ((data || []) as Family[]).map((family) => ({
      family,
      membership: null,
      canEdit: true,
      canManage: true,
      canManageAdmins: true,
      isPrimaryFamilyAdmin: false,
    }));
  }

  const { data } = await supabase
    .from("family_memberships")
    .select("*, families(*)")
    .eq("profile_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  return ((data || []) as (FamilyMembership & { families: Family | null })[])
    .filter((row) => row.families)
    .map((row) => {
      const membership = { ...row, families: undefined } as FamilyMembership;
      const flags = getRoleFlags(membership);
      return {
        family: row.families as Family,
        membership,
        ...flags,
      };
    });
});

export const getDefaultFamilySlug = cache(async () => {
  const families = await getAccessibleFamilies();
  return families[0]?.family.slug ?? null;
});

export const getFamilyContextBySlug = cache(
  async (slug: string, treeSelector?: string | null) => {
    const [supabase, profile, user] = await Promise.all([
      getSupabase(),
      getProfile(),
      getUser(),
    ]);

    if (!profile?.is_active || !user) return null;

    const { data: family } = await supabase
      .from("families")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!family) return null;

    const { data: membership } = await supabase
      .from("family_memberships")
      .select("*")
      .eq("family_id", family.id)
      .eq("profile_id", user.id)
      .maybeSingle();

    const cleanedTreeSelector = treeSelector?.trim();
    const isUuid =
      !!cleanedTreeSelector &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        cleanedTreeSelector,
      );
    const { data: selectedTree } = cleanedTreeSelector
      ? await supabase
          .from("family_trees")
          .select("*")
          .eq("family_id", family.id)
          .eq(isUuid ? "id" : "slug", cleanedTreeSelector)
          .maybeSingle()
      : { data: null };

    const { data: primaryTree } = await supabase
      .from("family_trees")
      .select("*")
      .eq("family_id", family.id)
      .eq("is_primary", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const { data: fallbackTree } = primaryTree
      ? { data: null }
      : await supabase
          .from("family_trees")
          .select("*")
          .eq("family_id", family.id)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

    const tree = (selectedTree ||
      primaryTree ||
      fallbackTree) as FamilyTree | null;
    if (!tree) return null;

    const flags = getRoleFlags(membership as FamilyMembership | null);
    const adminFlags = getSystemAdminFlags(profile);

    return {
      family: family as Family,
      tree,
      membership: membership as FamilyMembership | null,
      canEdit: adminFlags.canEdit || flags.canEdit,
      canManage: adminFlags.canManage || flags.canManage,
      canManageAdmins: adminFlags.canManageAdmins || flags.canManageAdmins,
      isPrimaryFamilyAdmin: flags.isPrimaryFamilyAdmin,
      isSystemAdmin: adminFlags.isSystemAdmin,
    } satisfies FamilyContext;
  },
);

export const getFamilyMembershipRole = cache(
  async (familyId: string): Promise<FamilyRole | null> => {
    const context = await getFamilyContextById(familyId);
    return context?.membership?.role ?? null;
  },
);

export const getFamilyContextById = cache(
  async (familyId: string, treeSelector?: string | null) => {
    const [supabase, profile, user] = await Promise.all([
      getSupabase(),
      getProfile(),
      getUser(),
    ]);

    if (!profile?.is_active || !user) return null;

    const { data: family } = await supabase
      .from("families")
      .select("*")
      .eq("id", familyId)
      .maybeSingle();

    if (!family) return null;

    return getFamilyContextBySlug((family as Family).slug, treeSelector);
  },
);
