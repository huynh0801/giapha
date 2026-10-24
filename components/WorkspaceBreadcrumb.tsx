"use client";

import {
  ArrowLeft,
  BarChart2,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Database,
  FileText,
  FolderTree,
  GitMerge,
  Home,
  Network,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type WorkspaceBreadcrumbProps = {
  familySlug: string;
};

const sectionMeta: Record<
  string,
  {
    label: string;
    icon: typeof Network;
  }
> = {
  members: { label: "Cây gia phả", icon: Network },
  tree: { label: "Sơ đồ cây", icon: Network },
  kinship: { label: "Tra danh xưng", icon: GitMerge },
  stats: { label: "Thống kê", icon: BarChart2 },
  events: { label: "Sự kiện", icon: CalendarDays },
  about: { label: "Hồ sơ dòng họ", icon: FileText },
  blog: { label: "Bảng tin nội bộ", icon: BookOpen },
  admins: { label: "Người phụ trách", icon: UserCog },
  trees: { label: "Quản lý cây", icon: FolderTree },
  requests: { label: "Yêu cầu tham gia", icon: Home },
  lineage: { label: "Thứ tự gia phả", icon: Home },
  data: { label: "Dữ liệu & Import", icon: Database },
};

function getCurrentLabel(section: string | undefined, pathParts: string[]) {
  if (!section) return "";
  if (section === "members" && pathParts[3] === "new") return "Thêm thành viên";
  if (section === "members" && pathParts[4] === "edit") {
    return "Chỉnh sửa thành viên";
  }
  if (section === "members" && pathParts[3]) return "Hồ sơ thành viên";
  if (section === "blog" && pathParts[3]) return "Chi tiết bảng tin";
  return sectionMeta[section]?.label || "Chức năng";
}

export default function WorkspaceBreadcrumb({
  familySlug,
}: WorkspaceBreadcrumbProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const nav = useMemo(() => {
    const workspacePath = `/dashboard/${familySlug}`;
    const pathOnly = pathname || "";
    if (pathOnly === workspacePath || !pathOnly.startsWith(`${workspacePath}/`)) {
      return null;
    }

    const pathParts = pathOnly
      .replace(`${workspacePath}/`, "")
      .split("/")
      .filter(Boolean);
    const section = pathParts[0];
    const treeId = searchParams.get("treeId");
    const treeQuery = treeId ? `?treeId=${encodeURIComponent(treeId)}` : "";
    const currentLabel = getCurrentLabel(section, pathParts);
    const CurrentIcon = sectionMeta[section]?.icon || Home;

    return {
      section,
      currentLabel,
      CurrentIcon,
      workspaceHref: `${workspacePath}${treeQuery}`,
    };
  }, [familySlug, pathname, searchParams]);

  if (!nav) return null;

  return (
    <nav
      aria-label="Điều hướng trong không gian dòng họ"
      className="sticky top-20 z-20 border-b border-[#deb887]/60 bg-[#fffdf7]/95 shadow-[0_2px_12px_rgba(44,26,17,0.04)] backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Single-row streamlined breadcrumb: 0 duplicate text */}
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href={nav.workspaceHref}
            className="group inline-flex items-center gap-1.5 rounded-xl border border-[#deb887]/80 bg-white px-2.5 py-1 text-xs font-bold text-[#7a6455] shadow-2xs transition-all hover:border-[#8c1d1d] hover:bg-[#fffdf7] hover:text-[#8c1d1d]"
            aria-label="Quay lại bảng chức năng"
            title="Quay lại bảng chức năng"
          >
            <ArrowLeft className="size-3.5 text-[#8c1d1d] transition-transform group-hover:-translate-x-0.5" />
            <span>Bảng chức năng</span>
          </Link>

          <ChevronRight className="size-3.5 shrink-0 text-[#caa455]" />

          <div className="flex min-w-0 items-center gap-1.5 rounded-xl border border-[#deb887]/60 bg-[#fbf7ed] px-2.5 py-1 text-xs font-bold text-[#183b28] shadow-2xs">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-[#eaf3ed] text-[#183b28]">
              <nav.CurrentIcon className="size-3.5" />
            </span>
            <span className="truncate">{nav.currentLabel}</span>
          </div>
        </div>

        {/* Subtle right indicator */}
        <div className="hidden items-center gap-1.5 text-xs font-bold text-[#7a6455] sm:inline-flex">
          <span className="size-1.5 rounded-full bg-[#183b28]" />
          <span>Không gian dòng họ</span>
        </div>
      </div>
    </nav>
  );
}
