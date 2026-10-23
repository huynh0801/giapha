import { requestJoinFamilyAction } from "@/app/actions/join-request";
import {
  getAccessibleFamilies,
  getProfile,
  getSupabase,
} from "@/utils/supabase/queries";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Eye,
  FolderTree,
  LockKeyhole,
  Search,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const PAGE_SIZE = 6;

type DirectoryRow = {
  id: string;
  name: string;
  slug: string;
  visibility: "private" | "family_only" | "public";
  status: "active" | "archived" | "suspended";
  public_description: string | null;
  public_origin_location: string | null;
  logo_url: string | null;
  admin_names: string | null;
  admin_contacts: string | null;
  member_count: number;
  has_active_membership: boolean;
  request_status: "pending" | "approved" | "rejected" | "cancelled" | null;
  total_count: number;
};

interface PageProps {
  searchParams?: Promise<{
    q?: string;
    visibility?: string;
    page?: string;
    request?: string;
  }>;
}

function roleLabel(role?: string | null, isPrimaryAdmin?: boolean | null, isSystemAdmin?: boolean) {
  if (isSystemAdmin) return "Quản trị hệ thống";
  if (role === "family_admin") {
    return isPrimaryAdmin ? "Quản trị chính" : "Quản trị phụ";
  }
  if (role === "member") return "Thành viên";
  return "Chưa có quyền";
}

function visibilityLabel(value: string) {
  if (value === "public") return "Công khai giới thiệu";
  if (value === "family_only") return "Chỉ thành viên";
  return "Riêng tư";
}

function requestLabel(status: DirectoryRow["request_status"]) {
  if (status === "pending") return "Đang chờ duyệt";
  if (status === "approved") return "Đã được duyệt";
  if (status === "rejected") return "Đã từ chối";
  if (status === "cancelled") return "Đã hủy";
  return null;
}

function buildDashboardHref(params: {
  q: string;
  visibility: string;
  page: number;
}) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.visibility !== "all") sp.set("visibility", params.visibility);
  if (params.page > 1) sp.set("page", String(params.page));
  const query = sp.toString();
  return `/dashboard${query ? `?${query}` : ""}`;
}

async function getFamilyDirectory(q: string, visibility: string, page: number) {
  const supabase = await getSupabase();
  const { data, error } = await supabase.rpc("get_family_directory", {
    search_term: q,
    visibility_filter: visibility,
    page_number: page,
    page_size: PAGE_SIZE,
  });

  if (error) {
    console.error("Cannot load family directory:", error);
    return [] as DirectoryRow[];
  }

  return (data || []) as DirectoryRow[];
}

export default async function DashboardFamilySwitcherPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const profile = await getProfile();
  const isSystemAdmin = profile?.is_active && profile.role === "system_admin";

  const families = await getAccessibleFamilies();

  if (families.length === 1 && !resolvedSearchParams?.q) {
    redirect(`/dashboard/${families[0].family.slug}`);
  }

  const q = resolvedSearchParams?.q?.trim() || "";
  const visibility = ["all", "private", "family_only", "public"].includes(
    resolvedSearchParams?.visibility || "",
  )
    ? resolvedSearchParams?.visibility || "all"
    : "all";
  const currentPage = Math.max(
    1,
    Number.parseInt(resolvedSearchParams?.page || "1", 10) || 1,
  );
  const directory = await getFamilyDirectory(q, visibility, currentPage);
  const totalCount = directory[0]?.total_count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const returnTo = buildDashboardHref({ q, visibility, page: currentPage });

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-600">
          Không gian làm việc
        </p>
        <h1 className="mt-2 text-3xl font-black text-stone-950 sm:text-4xl">
          Chọn dòng họ
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-500">
          Dữ liệu gia phả mặc định là riêng tư. Bạn chỉ xem đầy đủ cây gia phả,
          hồ sơ tổ tiên và sự kiện khi đã được Admin dòng họ duyệt quyền thành
          viên active.
        </p>
      </div>

      {resolvedSearchParams?.request === "sent" && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          Yêu cầu tham gia đã được gửi. Admin dòng họ sẽ xem xét và duyệt quyền
          cho bạn.
        </div>
      )}

      {families.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-black text-stone-900">
              Dòng họ bạn đang có quyền truy cập
            </h2>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              {families.length} dòng họ
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {families.map(({ family, membership, canManage }) => (
              <Link
                key={family.id}
                href={`/dashboard/${family.slug}`}
                className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                      <FolderTree className="size-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-black text-stone-900">
                        {family.name}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-stone-400">
                        /dashboard/{family.slug}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="mt-2 size-5 shrink-0 text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-amber-700" />
                </div>

                {family.description && (
                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-stone-500">
                    {family.description}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-600">
                    {roleLabel(membership?.role, membership?.is_primary_admin, isSystemAdmin)}
                  </span>
                  {canManage && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      Có quyền quản trị
                    </span>
                  )}
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                    {visibilityLabel(family.visibility)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-700">
              <LockKeyhole className="size-4" />
              Danh bạ dòng họ
            </div>
            <h2 className="text-2xl font-black text-stone-950">
              Tìm dòng họ để xin tham gia
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Bạn có thể xem thông tin giới thiệu theo mức chia sẻ của từng dòng
              họ. Dữ liệu gia phả riêng tư không được mở nếu chưa được duyệt.
            </p>
          </div>
          <form className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Tìm theo tên hoặc slug dòng họ"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-3 text-sm font-semibold text-stone-900 outline-none transition focus:border-amber-500 focus:bg-white"
              />
            </div>
            <select
              name="visibility"
              defaultValue={visibility}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-bold text-stone-700 outline-none transition focus:border-amber-500 focus:bg-white sm:w-48"
            >
              <option value="all">Tất cả</option>
              <option value="public">Công khai giới thiệu</option>
              <option value="family_only">Chỉ thành viên</option>
              <option value="private">Riêng tư</option>
            </select>
            <button type="submit" className="btn-primary justify-center">
              Lọc
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {directory.map((family) => {
            const statusLabel = requestLabel(family.request_status);
            const canRequest =
              !family.has_active_membership && family.request_status !== "pending";

            return (
              <article
                key={family.id}
                className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-stone-600">
                        {visibilityLabel(family.visibility)}
                      </span>
                      {family.has_active_membership && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                          <CheckCircle2 className="size-3.5" />
                          Đã là thành viên
                        </span>
                      )}
                      {statusLabel && !family.has_active_membership && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                          <Clock3 className="size-3.5" />
                          {statusLabel}
                        </span>
                      )}
                    </div>
                    <h3 className="truncate text-lg font-black text-stone-950">
                      {family.name}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-stone-400">
                      {family.slug}
                    </p>
                  </div>
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
                    <ShieldCheck className="size-5" />
                  </div>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-600">
                  {family.public_description ||
                    "Dòng họ này đang để thông tin giới thiệu ở chế độ riêng tư. Bạn có thể gửi yêu cầu tham gia để Admin dòng họ xem xét."}
                </p>

                <div className="mt-4 grid gap-2 text-sm text-stone-600 sm:grid-cols-2">
                  <div className="rounded-xl bg-white px-3 py-2">
                    <p className="text-xs font-black uppercase text-stone-400">
                      Admin dòng họ
                    </p>
                    <p className="mt-1 line-clamp-2 font-bold text-stone-800">
                      {family.admin_names || "Chưa cập nhật"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white px-3 py-2">
                    <p className="text-xs font-black uppercase text-stone-400">
                      Thành viên
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 font-bold text-stone-800">
                      <Users className="size-4 text-stone-400" />
                      {family.member_count.toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={`/dashboard/families/${family.slug}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-stone-700 shadow-sm transition hover:bg-stone-100"
                  >
                    <Eye className="size-4" />
                    Xem thông tin
                  </Link>
                  {family.has_active_membership ? (
                    <Link
                      href={`/dashboard/${family.slug}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700"
                    >
                      Mở workspace
                      <ArrowRight className="size-4" />
                    </Link>
                  ) : canRequest ? (
                    <form action={requestJoinFamilyAction} className="flex-1">
                      <input type="hidden" name="family_id" value={family.id} />
                      <input type="hidden" name="return_to" value={returnTo} />
                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#800000] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#9f1111]"
                      >
                        <Send className="size-4" />
                        Gửi yêu cầu
                      </button>
                    </form>
                  ) : (
                    <button
                      disabled
                      className="inline-flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-stone-200 px-4 py-2.5 text-sm font-black text-stone-500"
                    >
                      <Clock3 className="size-4" />
                      Đang chờ duyệt
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {directory.length === 0 && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
            <FolderTree className="mx-auto mb-3 size-9 text-stone-300" />
            <h3 className="text-lg font-black text-stone-900">
              Không tìm thấy dòng họ phù hợp
            </h3>
            <p className="mt-2 text-sm text-stone-500">
              Hãy thử đổi từ khóa hoặc bỏ bộ lọc chế độ hiển thị.
            </p>
          </div>
        )}

        {totalCount > PAGE_SIZE && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <Link
              href={buildDashboardHref({
                q,
                visibility,
                page: Math.max(1, currentPage - 1),
              })}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition ${
                currentPage <= 1
                  ? "pointer-events-none bg-stone-100 text-stone-300"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              <ArrowLeft className="size-4" />
              Trước
            </Link>
            <span className="text-sm font-bold text-stone-500">
              Trang {currentPage} / {totalPages}
            </span>
            <Link
              href={buildDashboardHref({
                q,
                visibility,
                page: Math.min(totalPages, currentPage + 1),
              })}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition ${
                currentPage >= totalPages
                  ? "pointer-events-none bg-stone-100 text-stone-300"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              Sau
              <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
