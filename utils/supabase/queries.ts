import { getProvinceCounts } from "@/utils/map/vnMapPaths";
import {
  Family,
  FamilyContext,
  FamilyMembership,
  FamilyRole,
  FamilyTree,
  Person,
  Profile,
  Relationship,
} from "@/types";
import { createClient, createPublicClient, createServiceRoleClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";
import { unstable_cache } from "next/cache";

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

export const getAdminSupabase = () => {
  return createServiceRoleClient();
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

/**
 * Server-side In-Memory Cached Fetcher for Family Tree Persons & Relationships.
 *
 * Employs Next.js unstable_cache to serve records directly from server RAM in ~5-10ms,
 * eliminating the slow Supabase query waterfall on repeat page views.
 * Automatically invalidated when mutations trigger revalidatePath/revalidateTag.
 */
export const getCachedFamilyTreeData = (familyId: string, treeId: string) => {
  return unstable_cache(
    async () => {
      const client = getAdminSupabase() || getPublicSupabase();
      if (!client) {
        return { persons: [] as Person[], relationships: [] as Relationship[] };
      }

      const [personsRes, relsRes] = await Promise.all([
        client
          .from("persons")
          .select("*")
          .eq("family_id", familyId)
          .eq("tree_id", treeId)
          .order("birth_year", { ascending: true, nullsFirst: false }),
        client
          .from("relationships")
          .select("*")
          .eq("family_id", familyId)
          .eq("tree_id", treeId),
      ]);

      return {
        persons: (personsRes.data || []) as Person[],
        relationships: (relsRes.data || []) as Relationship[],
      };
    },
    [`family-tree-data-${familyId}-${treeId}`],
    {
      revalidate: 300,
      tags: [`family-tree-${treeId}`, `family-${familyId}`],
    }
  )();
};


export interface ClanMapStats {
  counts: Record<string, number>;
  totalMapped: number;
}

/**
 * Returns cached geographic distribution stats for clan members, aggregated by province code.
 * Scoped strictly by family_id and tree_id to maintain tenant isolation.
 * Uses unstable_cache for sub-millisecond retrieval.
 */
export const getCachedClanMapStats = (familyId: string, treeId?: string): Promise<ClanMapStats> => {
  const cacheKey = treeId ? `clan-map-stats-${familyId}-${treeId}` : `clan-map-stats-${familyId}`;
  const tags = treeId ? [`family-tree-${treeId}`, `family-${familyId}`] : [`family-${familyId}`];

  return unstable_cache(
    async () => {
      const client = getAdminSupabase() || getPublicSupabase();
      if (!client) {
        return { counts: {}, totalMapped: 0 };
      }

      let query = client
        .from("person_details_private")
        .select("current_residence")
        .eq("family_id", familyId);

      if (treeId) {
        query = query.eq("tree_id", treeId);
      }

      const res = await query;

      const residences = (res.data || [])
        .map((r: { current_residence?: string | null }) => r.current_residence)
        .filter((r): r is string => Boolean(r && r.trim()));

      const counts = getProvinceCounts(residences);
      const totalMapped = Object.values(counts).reduce((a, b) => a + b, 0);

      return { counts, totalMapped };
    },
    [cacheKey],
    {
      revalidate: 300,
      tags,
    }
  )();
};
