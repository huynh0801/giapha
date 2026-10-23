import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FolderTree, Home, Shield, Users } from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import ProfileForm from "@/components/ProfileForm";
import {
  getAccessibleFamilies,
  getProfile,
  getUser,
} from "@/utils/supabase/queries";
import { getCurrentUserAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hồ sơ cá nhân",
  description: "Quản lý thông tin tài khoản và bảo mật gia phả",
};

export default async function ProfilePage() {
  const [user, currentUser] = await Promise.all([
    getUser(),
    getCurrentUserAction(),
  ]);

  if (!user || !currentUser) {
    redirect("/login?next=/profile");
  }

  const [profile, accessibleFamilies] = await Promise.all([
    getProfile(user.id),
    getAccessibleFamilies(),
  ]);

  if (!profile || !profile.is_active) {
    redirect("/login?next=/profile");
  }

  const initialProfile = {
    id: user.id,
    fullName: profile.full_name || "",
    phoneNumber: profile.phone_number || "",
    email: user.email || "",
    role: profile.role,
    avatarUrl: profile.avatar_url || null,
    createdAt: profile.created_at,
  };

  const isSystemAdmin = profile.role === "system_admin";

  return (
    <div className="min-h-screen flex flex-col bg-[#f5e7c7] text-[#2c1a11]">
      <LandingHeader currentUser={currentUser} />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-[#7d6c5d]">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-[#800000] transition-colors"
            >
              <Home className="size-3.5" />
              <span>Trang chủ</span>
            </Link>
            <span>/</span>
            <span className="text-[#2c1a11] font-bold">Hồ sơ cá nhân</span>
          </nav>

          {/* Form & Actions */}
          <ProfileForm initialProfile={initialProfile} />

          {/* Joined Families / Accessible Spaces */}
          <div className="rounded-3xl border border-[#e2d0a8] bg-[#fcf5e5] p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e2d0a8]/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100/70 text-[#800000]">
                  <FolderTree className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#183b28]">
                    Dòng họ của bạn
                  </h2>
                  <p className="text-xs text-[#7d6c5d]">
                    Các không gian dòng họ bạn đang tham gia hoặc có quyền quản trị
                  </p>
                </div>
              </div>

              <span className="self-start sm:self-auto rounded-full bg-[#f5e7c7] border border-[#d8cbbb] px-3 py-1 text-xs font-bold text-[#800000]">
                {accessibleFamilies.length} dòng họ
              </span>
            </div>

            {accessibleFamilies.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-[#7d6c5d]">
                  Bạn chưa tham gia không gian dòng họ nào.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#800000] hover:underline"
                >
                  <span>Tìm dòng họ để tham gia</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accessibleFamilies.map(({ family, membership }) => {
                  let roleText = "Thành viên";
                  if (isSystemAdmin) {
                    roleText = "Quản trị hệ thống";
                  } else if (membership?.role === "family_admin") {
                    roleText = membership.is_primary_admin
                      ? "Quản trị chính"
                      : "Quản trị phụ";
                  }

                  return (
                    <Link
                      key={family.id}
                      href={`/dashboard/${family.slug}`}
                      className="group flex flex-col justify-between rounded-2xl border border-[#e2d0a8] bg-[#fffdf8] p-5 shadow-xs transition hover:border-[#800000]/40 hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-[#2c1a11] group-hover:text-[#800000] transition-colors">
                            {family.name}
                          </h3>
                          <p className="font-mono text-xs text-[#8a7b6f] mt-0.5">
                            /dashboard/{family.slug}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                          {roleText}
                        </span>
                      </div>

                      {family.description && (
                        <p className="mt-3 line-clamp-2 text-xs text-[#6a594d] leading-relaxed">
                          {family.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between border-t border-[#f0e6d6] pt-3 text-xs font-bold text-[#800000]">
                        <span>Vào không gian</span>
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
