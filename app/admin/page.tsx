import AdminShell from "@/components/AdminShell";
import LogoutButton from "@/components/LogoutButton";
import {
  BlogPost,
  FamilyRole,
  FamilyStatus,
  MembershipStatus,
  PlatformRole,
  Visibility,
} from "@/types";
import { getProfile, getSupabase, getUser } from "@/utils/supabase/queries";
import {
  Activity,
  ArrowUpRight,
  Eye,
  FileText,
  LayoutDashboard,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export const metadata = {
  title: "Admin tổng quan",
};

type RecentPost = Pick<
  BlogPost,
  | "id"
  | "title"
  | "slug"
  | "category"
  | "is_published"
  | "published_at"
  | "created_at"
>;

type VisitRow = {
  visitor_id: string;
  path: string;
  created_at: string;
};

type AdminFamilySummary = {
  id: string;
  name: string;
  slug: string;
  visibility: Visibility;
  status: FamilyStatus;
  memberships: {
    id: string;
    profile_id: string;
    role: FamilyRole;
    status: MembershipStatus;
    is_primary_admin: boolean;
    profile_name: string | null;
    profile_email: string | null;
    profile_phone_number: string | null;
    profile_role: PlatformRole | null;
  }[];
};

function formatDate(value: string | null) {
  if (!value) return "Chưa xuất bản";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function statCard(label: string, value: number, helper: string, icon: ReactNode) {
  return (
    <div className="rounded-[26px] bg-white p-5 shadow-[0_18px_60px_rgba(58,31,19,0.08)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm font-bold text-stone-500">{label}</p>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-[#b56a10]">
          {icon}
        </div>
      </div>
      <p className="text-4xl font-black tracking-tight text-stone-950">
        {value.toLocaleString("vi-VN")}
      </p>
      <p className="mt-2 text-sm leading-6 text-stone-500">{helper}</p>
    </div>
  );
}

function normalizeAdminFamilies(raw: unknown): AdminFamilySummary[] {
  if (!Array.isArray(raw)) return [];

  return raw.map((item) => {
    const row = item as AdminFamilySummary & { memberships?: unknown };
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      visibility: row.visibility,
      status: row.status,
      memberships: Array.isArray(row.memberships)
        ? (row.memberships as AdminFamilySummary["memberships"]).filter(
            (membership) =>
              membership.role === "family_admin" &&
              membership.status === "active",
          )
        : [],
    };
  });
}

export default async function AdminIndexPage() {
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
            Chỉ tài khoản Super Admin đang hoạt động mới có thể xem bảng điều khiển.
          </p>
          <div className="mt-6 flex justify-center">
            <LogoutButton redirectTo="/admin/login" />
          </div>
        </div>
      </main>
    );
  }

  const supabase = await getSupabase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    postsResult,
    publishedResult,
    visitsResult,
    todayVisitsResult,
    recentResult,
    usersResult,
    familiesResult,
    visitRowsResult,
  ] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("scope", "system"),
    supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("scope", "system")
      .eq("is_published", true),
    supabase.from("site_visits").select("id", { count: "exact", head: true }),
    supabase
      .from("site_visits")
      .select("id", { count: "exact", head: true })
      .gte("created_at", today.toISOString()),
    supabase
      .from("blog_posts")
      .select("id,title,slug,category,is_published,published_at,created_at")
      .eq("scope", "system")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase.rpc("get_admin_users"),
    supabase.rpc("get_admin_families"),
    supabase
      .from("site_visits")
      .select("visitor_id,path,created_at")
      .order("created_at", { ascending: false })
      .limit(5000),
  ]);

  const totalPosts = postsResult.count || 0;
  const publishedPosts = publishedResult.count || 0;
  const draftPosts = Math.max(totalPosts - publishedPosts, 0);
  const totalVisits = visitsResult.count || 0;
  const todayVisits = todayVisitsResult.count || 0;
  const users = Array.isArray(usersResult.data) ? usersResult.data : [];
  const adminFamilies = normalizeAdminFamilies(familiesResult.data);
  const recentPosts = ((recentResult.data || []) as RecentPost[]).slice(0, 10);
  const visitRows = ((visitRowsResult.data || []) as VisitRow[]).filter(Boolean);
  const uniqueVisitors = new Set(visitRows.map((row) => row.visitor_id)).size;
  const topPaths = Object.entries(
    visitRows.reduce<Record<string, number>>((acc, row) => {
      acc[row.path] = (acc[row.path] || 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <AdminShell
      title="Tổng quan hệ thống"
      description="Theo dõi nội dung, lượt truy cập, tài khoản và dữ liệu gia phả trong một màn hình vận hành."
      action={
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 rounded-full bg-[#800000] px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-950/10 transition-colors hover:bg-[#650000]"
        >
          <FileText className="size-4" />
          Đăng bài hệ thống
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCard(
          "Bài viết",
          totalPosts,
          `${publishedPosts} đã xuất bản · ${draftPosts} bản nháp`,
          <FileText className="size-5" />,
        )}
        {statCard(
          "Tài khoản",
          users.length,
          "Quản lý tài khoản nền tảng, không can thiệp dữ liệu dòng họ",
          <UserRound className="size-5" />,
        )}
        {statCard(
          "Lượt truy cập",
          totalVisits,
          `${todayVisits} lượt trong hôm nay`,
          <Eye className="size-5" />,
        )}
        {statCard(
          "Khách truy cập",
          uniqueVisitors,
          "Khách truy cập duy nhất gần đây",
          <Activity className="size-5" />,
        )}
      </div>

      <section className="mt-6 rounded-[30px] bg-white p-5 shadow-[0_22px_70px_rgba(58,31,19,0.08)] sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b56a10]">
              Admin dòng họ
            </p>
            <h2 className="mt-1 text-2xl font-black text-stone-950">
              Thông tin quản trị chính và phụ
            </h2>
            <p className="mt-2 text-sm font-semibold text-stone-500">
              Xem nhanh người phụ trách từng dòng họ, gồm tên, email và số điện
              thoại liên hệ.
            </p>
          </div>
          <Link
            href="/admin/families/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-black text-stone-800 shadow-sm transition hover:border-amber-300 hover:text-[#800000]"
          >
            Mở dashboard dòng họ
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {adminFamilies.length === 0 ? (
            <div className="rounded-2xl bg-stone-50 p-5 text-sm font-semibold text-stone-500">
              Chưa có dòng họ nào có admin active.
            </div>
          ) : (
            adminFamilies.map((family) => (
              <article
                key={family.id}
                className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-black text-stone-950">
                      {family.name}
                    </h3>
                    <p className="mt-1 truncate text-xs font-semibold text-stone-500">
                      /{family.slug}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/${family.slug}/admins`}
                    className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#800000] shadow-sm transition hover:bg-amber-50"
                  >
                    Chi tiết
                  </Link>
                </div>
                <div className="grid gap-2">
                  {family.memberships.length === 0 ? (
                    <p className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-stone-500">
                      Chưa có admin active.
                    </p>
                  ) : (
                    family.memberships.map((admin) => (
                      <div
                        key={admin.id}
                        className="rounded-xl bg-white px-3 py-2 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="min-w-0 truncate text-sm font-black text-stone-900">
                            {admin.profile_name || "Chưa cập nhật tên"}
                          </p>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                              admin.is_primary_admin
                                ? "bg-[#800000] text-white"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {admin.is_primary_admin ? "Chính" : "Phụ"}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-xs font-semibold text-stone-500">
                          {admin.profile_email || "Chưa có email"} ·{" "}
                          {admin.profile_phone_number || "Chưa cập nhật SĐT"}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="rounded-[30px] bg-white p-5 shadow-[0_22px_70px_rgba(58,31,19,0.08)] sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b56a10]">
                Nội dung gần đây
              </p>
              <h2 className="mt-1 text-2xl font-black text-stone-950">
                10 bài viết mới nhất
              </h2>
            </div>
            <LayoutDashboard className="size-6 text-stone-300" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-stone-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-[0.16em] text-stone-400">
                <tr>
                  <th className="px-4 py-3">Bài viết</th>
                  <th className="hidden px-4 py-3 md:table-cell">Chuyên mục</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Ngày</th>
                  <th className="px-4 py-3 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentPosts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-stone-500">
                      Chưa có bài viết nào.
                    </td>
                  </tr>
                ) : (
                  recentPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-amber-50/40">
                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/blog?edit=${post.id}`}
                          className="font-black text-stone-900 hover:text-[#800000]"
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className="hidden px-4 py-4 text-stone-500 md:table-cell">
                        {post.category}
                      </td>
                      <td className="hidden px-4 py-4 text-stone-500 sm:table-cell">
                        {formatDate(post.published_at || post.created_at)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
                            post.is_published
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {post.is_published ? "Đã public" : "Bản nháp"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[30px] bg-white p-5 shadow-[0_22px_70px_rgba(58,31,19,0.08)] sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b56a10]">
              Trang được xem nhiều
            </p>
            <div className="mt-5 space-y-3">
              {topPaths.length === 0 ? (
                <p className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">
                  Chưa có dữ liệu truy cập. Dữ liệu sẽ xuất hiện sau khi khách vào website.
                </p>
              ) : (
                topPaths.map(([path, count]) => (
                  <div
                    key={path}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 px-4 py-3"
                  >
                    <span className="truncate text-sm font-bold text-stone-700">
                      {path}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#800000]">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[30px] bg-[#800000] p-5 text-white shadow-[0_22px_70px_rgba(58,31,19,0.12)] sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/60">
              Gợi ý vận hành
            </p>
            <h2 className="mt-2 text-2xl font-black">Việc nên làm tiếp</h2>
            <div className="mt-5 grid gap-3">
              <Link
                href="/admin/families"
                className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold hover:bg-white/15"
              >
                Tạo hoặc kiểm tra dòng họ
                <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold hover:bg-white/15"
              >
                Kiểm tra tài khoản quản trị
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </AdminShell>
  );
}
