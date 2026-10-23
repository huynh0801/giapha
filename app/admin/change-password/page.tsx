import config from "@/app/config";
import { getProfile, getUser } from "@/utils/supabase/queries";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChangePasswordForm from "./ChangePasswordForm";

export const metadata = {
  title: "Đổi mật khẩu admin",
};

export default async function AdminChangePasswordPage() {
  const user = await getUser();
  if (!user) redirect("/admin/login");

  const profile = await getProfile(user.id);
  if (!profile?.is_active || profile.role !== "system_admin") {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-stone-950">
      <Link
        href={profile.must_change_password ? "/admin/login" : "/admin"}
        className="fixed left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-stone-600 shadow-sm transition-colors hover:text-[#800000]"
      >
        <ArrowLeft className="size-4" />
        {profile.must_change_password ? "Đăng nhập" : "Quản trị"}
      </Link>

      <section className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-20 sm:px-6">
        <div className="w-full rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(58,31,19,0.12)] sm:p-8">
          <div className="mb-8">
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-[#b56a10]">
              <ShieldCheck className="size-7" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-amber-600">
              {config.siteName}
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-stone-950">
              Đổi mật khẩu admin
            </h1>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              {profile.must_change_password
                ? "Đây là lần đăng nhập đầu tiên của tài khoản admin này. Vui lòng đổi mật khẩu trước khi vào khu quản trị."
                : "Bạn có thể đổi mật khẩu quản trị bất cứ lúc nào."}
            </p>
          </div>

          <ChangePasswordForm forced={profile.must_change_password} />
        </div>
      </section>
    </main>
  );
}
