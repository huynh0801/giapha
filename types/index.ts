export type Gender = "male" | "female" | "other";

export type RelationshipType =
  | "marriage"
  | "biological_child"
  | "adopted_child"
  | "step_child"
  | "foster_child";

export type PlatformRole = "system_admin" | "member";
export type FamilyRole = "family_admin" | "member";
export type UserRole = PlatformRole;
export type MembershipStatus = "invited" | "pending" | "active" | "blocked";
export type FamilyStatus = "active" | "archived" | "suspended";
export type Visibility = "private" | "family_only" | "public";
export type PostScope = "system" | "family";
export type ContentStatus = "draft" | "published" | "archived";

export interface Profile {
  id: string;
  full_name: string | null;
  role: PlatformRole;
  is_active: boolean;
  must_change_password: boolean;
  password_changed_at: string | null;
  avatar_url?: string | null;
  phone_number?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUserData {
  id: string;
  full_name: string | null;
  email: string;
  phone_number?: string | null;
  role: PlatformRole;
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
}

export interface Family {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  origin_location: string | null;
  logo_url: string | null;
  visibility: Visibility;
  status: FamilyStatus;
  settings: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface FamilyMembership {
  id: string;
  family_id: string;
  profile_id: string;
  role: FamilyRole;
  status: MembershipStatus;
  is_primary_admin: boolean;
  invited_by: string | null;
  invited_at: string | null;
  joined_at: string | null;
  created_at: string;
  updated_at: string;
  families?: Family | null;
  profiles?: Profile | null;
}

export interface FamilyTree {
  id: string;
  family_id: string;
  name: string;
  slug: string;
  description: string | null;
  root_person_id: string | null;
  visibility: Visibility;
  is_primary: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface FamilyContext {
  family: Family;
  tree: FamilyTree;
  membership: FamilyMembership | null;
  canEdit: boolean;
  canManage: boolean;
  canManageAdmins: boolean;
  isPrimaryFamilyAdmin: boolean;
  isSystemAdmin: boolean;
}

export interface Person {
  id: string;
  family_id: string;
  tree_id: string;
  external_ref?: string | null;
  full_name: string;
  gender: Gender;
  birth_year: number | null;
  birth_month: number | null;
  birth_day: number | null;
  death_year: number | null;
  death_month: number | null;
  death_day: number | null;
  avatar_url: string | null;
  note: string | null;
  visibility?: Visibility;
  created_by?: string | null;
  created_at: string;
  updated_at: string;

  // Private fields, returned only to active family admins through RLS.
  phone_number?: string | null;
  occupation?: string | null;
  current_residence?: string | null;

  death_lunar_year: number | null;
  death_lunar_month: number | null;
  death_lunar_day: number | null;

  is_deceased: boolean;
  is_in_law: boolean;
  birth_order: number | null;
  generation: number | null;
  other_names: string | null;
}

export interface Relationship {
  id: string;
  family_id: string;
  tree_id: string;
  type: RelationshipType;
  person_a: string;
  person_b: string;
  note?: string | null;
  visibility?: Visibility;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  scope: PostScope;
  family_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  cover_image_url: string;
  cover_image_path: string | null;
  is_published: boolean;
  status: ContentStatus;
  visibility: Visibility;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}
