import { UserProvider } from "@/components/UserProvider";
import { getProfile, getUser } from "@/utils/supabase/queries";
import { redirect } from "next/navigation";
import React from "react";
import LandingHeader from "@/components/landing/LandingHeader";
import type { HeaderAuthUser } from "@/app/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const profile = user ? await getProfile(user.id) : null;

  if (
    profile?.is_active &&
    profile.role === "system_admin" &&
    profile.must_change_password
  ) {
    redirect("/admin/change-password");
  }

  const currentUser: HeaderAuthUser | null = user && profile?.is_active
    ? {
        id: user.id,
        email: user.email || null,
        fullName: profile.full_name || null,
        role: profile.role || "member",
        avatarUrl: profile.avatar_url || null,
      }
    : null;

  if (user && profile && !profile.is_active) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f7f3ea] font-sans text-stone-900">
        <LandingHeader currentUser={currentUser} />
        <main className="flex flex-1 flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm sm:p-8">
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
      <div className="flex min-h-screen flex-col bg-[#f7f3ea] font-sans text-stone-900">
        <LandingHeader currentUser={currentUser} />
        {children}
      </div>
    </UserProvider>
  );
}
