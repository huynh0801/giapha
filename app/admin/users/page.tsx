import AdminShell from "@/components/AdminShell";
import AdminUserList from "@/components/AdminUserList";
import LogoutButton from "@/components/LogoutButton";
import { AdminUserData } from "@/types";
import { getProfile, getSupabase, getUser } from "@/utils/supabase/queries";
import { ShieldAlert, UserPlus } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Người dùng quản trị",
};

export default async function AdminUsersPage() {
  const user = await getUser();
  if (!user) redirect("/admin/login");

  const profile = await getProfile(user.id);
  if (
    profile?.is_active &&
    profile.role === "system_admin" &&
    profile.must_change_password
  ) {
    redirect("/admin/change-password");
  }

  if (!profile?.is_active || profile.role !== "system_admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-[0_18px_50px_rgba(41,37,36,0.08)]">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldAlert className="size-8" />
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            Không có quyền truy cập
          </h1>
          <p className="mt-3 text-sm text-stone-500">
            Chỉ tài khoản Super Admin đang hoạt động mới có thể quản lý tài
            khoản.
          </p>
          <div className="mt-6 flex justify-center">
            <LogoutButton redirectTo="/admin/login" />
          </div>
        </div>
      </main>
    );
  }

  const supabase = await getSupabase();
  const { data: users, error: usersError } = await supabase.rpc(
    "get_admin_users",
  );

  if (usersError) {
    console.error("Error fetching users:", usersError);
  }

  return (
    <AdminShell
      title="Người dùng"
      description="Tạo tài khoản, khóa/mở khóa và cấp role hệ thống. Quyền trong từng dòng họ do Admin dòng họ quản lý sau khi được bàn giao."
      action={
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#800000] shadow-sm">
          <UserPlus className="size-4" />
          Admin mới sẽ phải đổi mật khẩu
        </div>
      }
    >
      <AdminUserList
        initialUsers={(users as AdminUserData[]) || []}
        currentUserId={profile.id}
      />
    </AdminShell>
  );
}
