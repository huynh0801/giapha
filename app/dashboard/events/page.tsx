import { getDefaultFamilySlug } from "@/utils/supabase/queries";
import { redirect } from "next/navigation";

export default async function LegacyEventsPage() {
  const slug = await getDefaultFamilySlug();
  redirect(slug ? `/dashboard/${slug}/events` : "/dashboard");
}

