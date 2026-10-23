import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string }>;
}

export default async function FamilyTreeAliasPage({ params }: PageProps) {
  const { familySlug } = await params;
  redirect(`/dashboard/${familySlug}/trees`);
}
