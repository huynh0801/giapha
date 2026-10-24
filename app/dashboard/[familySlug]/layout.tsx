import WorkspaceBreadcrumb from "@/components/WorkspaceBreadcrumb";
import type { ReactNode } from "react";

interface FamilyWorkspaceLayoutProps {
  children: ReactNode;
  params: Promise<{ familySlug: string }>;
}

export default async function FamilyWorkspaceLayout({
  children,
  params,
}: FamilyWorkspaceLayoutProps) {
  const { familySlug } = await params;

  return (
    <>
      <WorkspaceBreadcrumb familySlug={familySlug} />
      {children}
    </>
  );
}
