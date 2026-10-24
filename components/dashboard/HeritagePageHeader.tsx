import React from "react";
import Link from "next/link";
import { ArrowLeft, FolderTree } from "lucide-react";
import { HeritageBadge } from "./HeritageUI";

export interface HeritagePageHeaderProps {
  familySlug: string;
  familyName: string;
  treeName?: string | null;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export default function HeritagePageHeader({
  familySlug,
  familyName,
  treeName,
  title,
  description,
  badge,
  actions,
  className = "",
}: HeritagePageHeaderProps) {
  return (
    <div
      className={`relative mb-6 rounded-2xl border-2 border-[#deb887]/80 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] p-5 shadow-sm sm:p-6 ${className}`}
    >
      {/* Decorative Traditional Corner Accents */}
      <span className="pointer-events-none absolute top-2 left-2 size-2.5 border-t-2 border-l-2 border-[#8c1d1d] opacity-70" />
      <span className="pointer-events-none absolute top-2 right-2 size-2.5 border-t-2 border-r-2 border-[#8c1d1d] opacity-70" />
      <span className="pointer-events-none absolute bottom-2 left-2 size-2.5 border-b-2 border-l-2 border-[#8c1d1d] opacity-70" />
      <span className="pointer-events-none absolute bottom-2 right-2 size-2.5 border-b-2 border-r-2 border-[#8c1d1d] opacity-70" />

      {/* Top Navigation Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#deb887]/40 pb-3">
        <Link
          href={`/dashboard/${familySlug}`}
          className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7a6455] transition-colors hover:text-[#8c1d1d]"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Về tổng quan dòng họ</span>
        </Link>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <HeritageBadge variant="crimson">{familyName}</HeritageBadge>
          {treeName && (
            <HeritageBadge variant="amber" className="inline-flex items-center gap-1">
              <FolderTree className="size-3 shrink-0" />
              <span>{treeName}</span>
            </HeritageBadge>
          )}
          {badge}
        </div>
      </div>

      {/* Title & Actions Row */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-[#183b28] sm:text-3xl"
            style={{
              fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
            }}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#5c4a3e]">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
