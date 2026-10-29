import WorkspaceBreadcrumb from "@/components/WorkspaceBreadcrumb";
import type { ReactNode } from "react";
import { Suspense } from "react";

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
      <Suspense fallback={null}>
        <WorkspaceBreadcrumb familySlug={familySlug} />
      </Suspense>
      {children}
    </>
  );
}
