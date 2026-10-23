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
  admins: { label: "Quản trị viên", icon: UserCog },
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
      aria-label="Điều hướng trong workspace dòng họ"
      className="sticky top-[76px] z-20 border-b border-amber-100/80 bg-[#fffdf8]/94 shadow-[0_8px_24px_rgba(58,31,19,0.05)] backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href={nav.workspaceHref}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-white text-[#800000] shadow-sm transition hover:-translate-x-0.5 hover:border-amber-300 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
              aria-label="Quay lại bảng chức năng dòng họ"
              title="Quay lại bảng chức năng"
            >
              <ArrowLeft className="size-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-stone-400">
                <Link
                  href={nav.workspaceHref}
                  className="truncate transition hover:text-[#800000]"
                >
                  Bảng chức năng
                </Link>
                <ChevronRight className="size-3.5 shrink-0" />
                <span className="truncate text-[#b56a10]">{nav.currentLabel}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-[#800000]">
                  <nav.CurrentIcon className="size-3.5" />
                </span>
                <p className="truncate text-sm font-black text-stone-950 sm:text-base">
                  {nav.currentLabel}
                </p>
              </div>
            </div>
          </div>

          <Link
            href={nav.workspaceHref}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#800000] px-3.5 py-2 text-xs font-black text-white shadow-md shadow-red-950/10 transition hover:bg-[#650000] focus:outline-none focus:ring-2 focus:ring-amber-300 sm:text-sm"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Quay lại bảng chức năng</span>
            <span className="sm:hidden">Quay lại</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
