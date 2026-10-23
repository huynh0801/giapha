"use client";

import config from "@/app/config";
import LogoutButton from "@/components/LogoutButton";
import {
  Edit3,
  Eye,
  FileText,
  FolderTree,
  Home,
  KeyRound,
  LayoutDashboard,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const navItems = [
  {
    href: "/admin",
    label: "Tổng quan",
    description: "Bảng điều khiển",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/blog",
    label: "Blog hệ thống",
    description: "Trang chính",
    icon: Edit3,
  },
  {
    href: "/admin/blog#posts",
    label: "Bài hệ thống",
    description: "Danh sách",
    icon: FileText,
  },
  {
    href: "/admin/families",
    label: "Dòng họ",
    description: "Không gian riêng",
    icon: FolderTree,
  },
  {
    href: "/admin/users",
    label: "Người dùng",
    description: "Tài khoản",
    icon: Users,
  },
  {
    href: "/news",
    label: "Trang tin",
    description: "Xem công khai",
    icon: Eye,
  },
  {
    href: "/admin/change-password",
    label: "Mật khẩu",
    description: "Bảo mật",
    icon: KeyRound,
  },
];

interface AdminShellProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function AdminShell({
  title,
  description,
  children,
  action,
}: AdminShellProps) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-stone-950 antialiased">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-stone-200 bg-white/95 px-4 py-4 shadow-[0_1px_0_rgba(58,31,19,0.08)] lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="flex size-12 items-center justify-center overflow-hidden rounded-2xl bg-[#fff9f4] ring-1 ring-red-900/10">
                <Image
                  src="/logo-gia-pha.svg"
                  alt="Logo Gia Phả Dòng Họ"
                  width={48}
                  height={48}
                  className="size-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-black text-[#800000]">
                  {config.siteName}
                </p>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                  Admin
                </p>
              </div>
            </div>

            <nav className="mt-5 grid gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const [itemPath, itemHash = ""] = item.href.split("#");
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : item.href === "/admin/families"
                      ? pathname.startsWith("/admin/families")
                    : itemHash
                      ? pathname === itemPath && hash === `#${itemHash}`
                      : pathname === itemPath && !hash;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors ${
                      active
                        ? "bg-[#800000] text-white shadow-lg shadow-red-950/10"
                        : "text-stone-600 hover:bg-amber-50 hover:text-[#800000]"
                    }`}
                  >
                    <Icon className="size-5 shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-sm font-black">
                        {item.label}
                      </span>
                      <span
                        className={`block text-xs font-semibold ${
                          active ? "text-white/70" : "text-stone-400"
                        }`}
                      >
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-5 grid gap-2 border-t border-stone-100 pt-5 lg:mt-auto">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-stone-600 transition-colors hover:bg-stone-50 hover:text-[#800000]"
              >
                <FolderTree className="size-5" />
                Không gian gia phả
              </Link>
              <Link
                href="/"
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-stone-600 transition-colors hover:bg-stone-50 hover:text-[#800000]"
              >
                <Home className="size-5" />
                Về trang chủ
              </Link>
              <div className="overflow-hidden rounded-2xl bg-stone-50">
                <LogoutButton redirectTo="/admin/login" />
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <header className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b56a10]">
                Bảng điều khiển
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
                {title}
              </h1>
              {description && (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500 sm:text-base">
                  {description}
                </p>
              )}
            </div>
            {action}
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}
