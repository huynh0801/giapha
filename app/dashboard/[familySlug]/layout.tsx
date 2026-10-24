import type { ReactNode } from "react";

interface FamilyWorkspaceLayoutProps {
  children: ReactNode;
  params: Promise<{ familySlug: string }>;
}

export default async function FamilyWorkspaceLayout({
  children,
  params,
}: FamilyWorkspaceLayoutProps) {
  await params;

  return <>{children}</>;
}
