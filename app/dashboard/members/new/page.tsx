import { getDefaultFamilySlug } from "@/utils/supabase/queries";
import { redirect } from "next/navigation";

export default async function LegacyNewMemberPage() {
  const slug = await getDefaultFamilySlug();
  redirect(slug ? `/dashboard/${slug}/members/new` : "/dashboard");
}

