import AdminFamilyCreateForm from "@/components/AdminFamilyCreateForm";
import AdminFamilyRequestsList from "@/components/admin/AdminFamilyRequestsList";
import AdminShell from "@/components/AdminShell";
import LogoutButton from "@/components/LogoutButton";
import { getAdminFamilyCreationRequests } from "@/app/actions/family-request";
import { AdminUserData } from "@/types";
import { getProfile, getSupabase, getUser } from "@/utils/supabase/queries";
import {
  AlertTriangle,
  ArrowUpRight,
  Clock3,
  ListChecks,
  PlusCircle,
  SearchCheck,
  ShieldAlert,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Tạo dòng họ mới",
};

interface PageProps {
  searchParams?: Promise<{
    tab?: string;
  }>;
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

export default async function AdminFamiliesPage({ searchParams }: PageProps) {
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
            Chỉ Super Admin đang hoạt động mới có thể quản lý dòng họ.
          </p>
          <div className="mt-6 flex justify-center">
            <LogoutButton redirectTo="/admin/login" />
          </div>
        </div>
      </main>
    );
  }

  const resolvedParams = searchParams ? await searchParams : undefined;
  const currentTab = resolvedParams?.tab || "requests";

  const supabase = await getSupabase();
  const [usersResult, creationRequests] = await Promise.all([
    supabase.rpc("get_admin_users"),
    getAdminFamilyCreationRequests(),
  ]);

  const { data: users, error: usersError } = usersResult;
  if (usersError) {
    console.error("Error fetching users:", usersError);
  }

  const userRows = ((users || []) as AdminUserData[]).filter(
    (item) => item.is_active,
  );
  const memberRows = userRows.filter((item) => item.role === "member");
  const pendingRequestsCount = creationRequests.filter(
    (r) => r.status === "pending",
  ).length;

  return (
    <AdminShell
      title="Tạo dòng họ mới"
      description="Xem xét phê duyệt các yêu cầu xin tạo dòng họ từ thành viên, hoặc chủ động khởi tạo workspace dòng họ thủ công."
      action={
        <Link
          href="/admin/families/dashboard"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#800000] px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-950/10 transition hover:bg-[#650000]"
        >
          Dashboard dòng họ
          <ArrowUpRight className="size-4" />
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 gap-2">
          <Link
            href="/admin/families?tab=requests"
            className={`flex items-center gap-2 px-5 py-3 text-sm font-black border-b-2 transition -mb-px ${
              currentTab === "requests"
                ? "border-[#800000] text-[#800000]"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Clock3 className="size-4" />
            <span>Yêu cầu tạo gia tộc</span>
            {pendingRequestsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                {pendingRequestsCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/families?tab=create"
            className={`flex items-center gap-2 px-5 py-3 text-sm font-black border-b-2 transition -mb-px ${
              currentTab === "create"
                ? "border-[#800000] text-[#800000]"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <PlusCircle className="size-4" />
            <span>Tạo dòng họ thủ công</span>
          </Link>
        </div>

        {/* Tab Content */}
        {currentTab === "requests" ? (
          <AdminFamilyRequestsList requests={creationRequests} />
        ) : (
          <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
            <AdminFamilyCreateForm memberRows={memberRows} />

            <aside className="grid content-start gap-4">
              {usersError && (
                <div className="rounded-[28px] border border-red-200 bg-red-50 p-5 text-red-900 shadow-sm">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 size-5 shrink-0" />
                    <div>
                      <h2 className="text-lg font-black">
                        Không tải được danh sách tài khoản
                      </h2>
                      <p className="mt-2 text-sm font-semibold leading-6 text-red-700">
                        RPC get_admin_users chưa sẵn sàng hoặc migration chưa được
                        apply. Không thể chọn Admin Dòng Họ đầu tiên cho tới khi dữ
                        liệu user tải được.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_18px_60px_rgba(60,42,25,0.07)]">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <SearchCheck className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-stone-950">
                      Tìm admin bằng tên hoặc email
                    </h2>
                    <p className="mt-2 text-sm font-semibold leading-6 text-stone-500">
                      Không dùng select dài nữa. Ô tìm kiếm chỉ lấy tài khoản member
                      active để đảm bảo đúng mô hình phân quyền.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_18px_60px_rgba(60,42,25,0.07)]">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <ListChecks className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-stone-950">
                      Quản trị hàng loạt ở dashboard
                    </h2>
                    <p className="mt-2 text-sm font-semibold leading-6 text-stone-500">
                      Danh sách dòng họ, đổi Admin Dòng Họ chính, gán quyền thành
                      viên và xóa dòng họ nằm ở dashboard riêng để không biến trang
                      tạo mới thành một danh sách dài khó kiểm soát.
                    </p>
                    <Link
                      href="/admin/families/dashboard"
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-black text-stone-700 shadow-sm transition hover:border-amber-300 hover:text-[#800000]"
                    >
                      Mở dashboard
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-stone-200 bg-stone-950 p-5 text-white shadow-[0_18px_60px_rgba(60,42,25,0.07)]">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-amber-300">
                    <UsersRound className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black">
                      {memberRows.length} member active khả dụng
                    </h2>
                    <p className="mt-2 text-sm font-semibold leading-6 text-white/65">
                      Đây là nhóm tài khoản có thể được chọn làm Admin Dòng Họ đầu
                      tiên hoặc admin thay thế.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
