import config from "@/app/config";
import LogoutButton from "@/components/LogoutButton";
import { UserProvider } from "@/components/UserProvider";
import { getProfile, getUser } from "@/utils/supabase/queries";
import { Home, Info, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const headerLinkClass =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-[#d9a04d] bg-white px-2 text-xs font-black text-[#9a4f00] shadow-[0_8px_22px_rgba(154,79,0,0.08)] transition hover:border-[#b56a10] hover:bg-[#fff7e6] hover:text-[#800000] active:scale-[0.98] sm:gap-2 sm:px-4 sm:text-sm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile(user.id);

  if (
    profile?.is_active &&
    profile.role === "system_admin" &&
    profile.must_change_password
  ) {
    redirect("/admin/change-password");
  }

  if (!profile?.is_active) {
    return (
      <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900">
        <header className="sticky top-0 z-30 border-b border-[#e8dccb] bg-[#fffdf8]/95 shadow-[0_8px_30px_rgba(58,31,19,0.05)] backdrop-blur-md transition-all duration-200">
          <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="group flex min-w-0 items-center gap-3">
              <Image
                src="/logo-gia-pha.svg"
                alt="Logo"
                width={36}
                height={36}
                className="size-9 shrink-0 object-contain"
              />
              <h1 className="truncate text-lg font-black uppercase tracking-tight text-[#800000] transition-colors group-hover:text-[#b56a10] sm:text-xl">
                {config.siteName}
              </h1>
            </Link>
            <LogoutButton className="border border-transparent bg-white/70 shadow-sm" />
          </div>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-6 text-center shadow-sm sm:rounded-2xl sm:p-8">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <svg
                className="size-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-stone-800">
              Tài khoản đang bị khóa
            </h2>
            <p className="text-stone-600">
              Tài khoản của bạn hiện không thể truy cập hệ thống. Vui lòng liên
              hệ quản trị viên nếu đây là nhầm lẫn.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <UserProvider user={user} profile={profile}>
      <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900">
        <header className="sticky top-0 z-30 border-b border-[#e8dccb] bg-[#fffdf8]/95 shadow-[0_8px_30px_rgba(58,31,19,0.05)] backdrop-blur-md transition-all duration-200">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:min-h-[76px] lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-0">
            <Link
              href="/dashboard"
              className="group flex min-w-0 items-center gap-3 py-1"
            >
              <Image
                src="/logo-gia-pha.svg"
                alt="Logo"
                width={36}
                height={36}
                className="size-9 shrink-0 object-contain"
              />
              <h1 className="truncate text-lg font-black uppercase tracking-tight text-[#800000] transition-colors group-hover:text-[#b56a10] sm:text-xl">
                {config.siteName}
              </h1>
            </Link>

            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:w-auto lg:justify-end">
              <nav className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
                <Link href="/" className={headerLinkClass}>
                  <Home className="size-4" />
                  Trang chủ
                </Link>
                <Link href="/dashboard/about" className={headerLinkClass}>
                  <Info className="size-4" />
                  Giới thiệu
                </Link>
                <Link href="/news" className={headerLinkClass}>
                  <Newspaper className="size-4" />
                  Tin tức
                </Link>
              </nav>

              <div className="flex items-center justify-end gap-2">
                <LogoutButton className="h-10 border border-stone-200 bg-white px-4 shadow-sm hover:border-rose-200" />
              </div>
            </div>
          </div>
        </header>
        {children}
      </div>
    </UserProvider>
  );
}
