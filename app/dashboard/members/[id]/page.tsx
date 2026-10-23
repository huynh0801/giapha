import { getDefaultFamilySlug } from "@/utils/supabase/queries";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LegacyMemberDetailPage({ params }: PageProps) {
  const [{ id }, slug] = await Promise.all([params, getDefaultFamilySlug()]);
  redirect(slug ? `/dashboard/${slug}/members/${id}` : "/dashboard");
}

