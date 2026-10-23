import AdminFamilyDashboard, {
  AdminFamilyMembershipData,
  AdminFamilyRow,
} from "@/components/AdminFamilyDashboard";
import AdminShell from "@/components/AdminShell";
import LogoutButton from "@/components/LogoutButton";
import { AdminUserData } from "@/types";
import { getProfile, getSupabase, getUser } from "@/utils/supabase/queries";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard dòng họ",
};

function normalizeFamilies(raw: unknown): AdminFamilyRow[] {
  if (!Array.isArray(raw)) return [];

  return raw.map((item) => {
    const row = item as Omit<AdminFamilyRow, "memberships"> & {
      memberships?: unknown;
    };

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      visibility: row.visibility,
      status: row.status,
      settings:
        row.settings && typeof row.settings === "object"
          ? (row.settings as Record<string, unknown>)
          : {},
      created_at: row.created_at,
      person_count: Number(row.person_count || 0),
      memberships: Array.isArray(row.memberships)
        ? (row.memberships as AdminFamilyMembershipData[]).map((membership) => ({
            ...membership,
            is_primary_admin: membership.is_primary_admin === true,
            profile_phone_number: membership.profile_phone_number || null,
          }))
        : [],
    };
  });
}

async function assertSuperAdmin() {
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
    return false;
  }

  return true;
}

export default async function AdminFamiliesDashboardPage() {
  const allowed = await assertSuperAdmin();

  if (!allowed) {
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
            Chỉ Super Admin đang hoạt động mới có thể mở dashboard dòng họ.
          </p>
          <div className="mt-6 flex justify-center">
            <LogoutButton redirectTo="/admin/login" />
          </div>
        </div>
      </main>
    );
  }

  const supabase = await getSupabase();
  const [
    { data: users, error: usersError },
    { data: families, error: familiesError },
  ] = await Promise.all([
    supabase.rpc("get_admin_users"),
    supabase.rpc("get_admin_families"),
  ]);

  if (usersError) console.error("Error fetching users:", usersError);
  if (familiesError) console.error("Error fetching admin families:", familiesError);

  const userRows = ((users || []) as AdminUserData[]).filter(
    (item) => item.is_active,
  );
  const familyRows = normalizeFamilies(families);
  const dataError =
    familiesError?.message || usersError?.message || (!families ? null : null);

  return (
    <AdminShell
      title="Dashboard dòng họ"
      description="Bảng vận hành cho Super Admin: tìm nhanh workspace, mở dữ liệu, đổi Admin Dòng Họ chính, gán quyền thành viên và xóa dòng họ khi cần."
      action={
        <Link
          href="/admin/families"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-stone-800 shadow-sm ring-1 ring-stone-200 transition hover:text-[#800000] hover:ring-amber-300"
        >
          Tạo dòng họ
          <ArrowUpRight className="size-4" />
        </Link>
      }
    >
      <AdminFamilyDashboard
        families={familyRows}
        users={userRows}
        dataError={dataError}
      />
    </AdminShell>
  );
}
