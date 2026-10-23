import { getDefaultFamilySlug } from "@/utils/supabase/queries";
import { redirect } from "next/navigation";

export default async function LegacyLineagePage() {
  const slug = await getDefaultFamilySlug();
  redirect(slug ? `/dashboard/${slug}/lineage` : "/dashboard");
}

