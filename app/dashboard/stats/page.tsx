import { getDefaultFamilySlug } from "@/utils/supabase/queries";
import { redirect } from "next/navigation";

export default async function LegacyStatsPage() {
  const slug = await getDefaultFamilySlug();
  redirect(slug ? `/dashboard/${slug}/stats` : "/dashboard");
}

