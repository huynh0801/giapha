import { requestJoinFamilyAction } from "@/app/actions/join-request";
import { getUserActiveFamilyCreationRequest } from "@/app/actions/family-request";
import CreateFamilyRequestModal from "@/components/dashboard/CreateFamilyRequestModal";
import FamilyRequestStatusCard from "@/components/dashboard/FamilyRequestStatusCard";
import BackgroundDecor from "@/components/landing/BackgroundDecor";
import { HeritageBadge, HeritageFrame } from "@/components/dashboard/HeritageUI";
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
    return isPrimaryAdmin ? "Phụ trách chính" : "Phụ trách phụ";
  }
  if (role === "member") return "Thành viên";
  return "Chưa có quyền";
}

function roleVariant(role?: string | null, isPrimaryAdmin?: boolean | null, isSystemAdmin?: boolean): "crimson" | "jade" | "amber" | "neutral" {
  if (isSystemAdmin || isPrimaryAdmin) return "crimson";
  if (role === "family_admin") return "jade";
  if (role === "member") return "amber";
  return "neutral";
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

  const [profile, families, directory, activeRequest] = await Promise.all([
    getProfile(),
    getAccessibleFamilies(),
    getFamilyDirectory(q, visibility, currentPage),
    getUserActiveFamilyCreationRequest(),
  ]);

  const isSystemAdmin = profile?.is_active && profile.role === "system_admin";

  if (families.length === 1 && !resolvedSearchParams?.q && !activeRequest) {
    redirect(`/dashboard/${families[0].family.slug}`);
  }

  const totalCount = directory[0]?.total_count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const returnTo = buildDashboardHref({ q, visibility, page: currentPage });

  return (
    <div className="relative flex-1 w-full overflow-hidden">
      <BackgroundDecor subtle />
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Heritage Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#deb887] bg-[#f5e7c7]/50 px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#8c1d1d]">
          <FolderTree className="size-3.5" />
          Không gian gia tộc
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-[#183b28] tracking-tight leading-tight">
          Chọn dòng họ & Danh bạ
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5c4a3e]">
          Dữ liệu gia phả mặc định là riêng tư. Bạn chỉ xem đầy đủ cây gia phả,
          hồ sơ tổ tiên và sự kiện khi đã được Người phụ trách dòng họ duyệt quyền thành
          viên chính thức.
        </p>
      </div>

      {resolvedSearchParams?.request === "sent" && (
        <div className="mb-6 rounded-xl border-2 border-[#183b28]/30 bg-[#eaf3ed] p-4 text-sm font-bold text-[#183b28] shadow-xs flex items-center gap-3">
          <CheckCircle2 className="size-5 text-[#183b28] shrink-0" />
          <span>
            Yêu cầu tham gia đã được gửi. Người phụ trách dòng họ sẽ xem xét và phê duyệt
            cho bạn.
          </span>
        </div>
      )}

      {/* Family Creation Request Status */}
      {activeRequest && <FamilyRequestStatusCard request={activeRequest} />}

      {/* Accessible Families Section */}
      <section className="mb-10">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#183b28]">
              {families.length > 0 ? "Dòng họ bạn đang có quyền truy cập" : "Dòng họ của bạn"}
            </h2>
            {families.length > 0 && (
              <HeritageBadge variant="jade">
                {families.length} dòng họ
              </HeritageBadge>
            )}
          </div>
          <CreateFamilyRequestModal isLoggedIn={Boolean(profile?.is_active)} />
        </div>
          {families.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-[#deb887]/80 bg-[#fffdf7] p-8 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#deb887]/20 text-[#8c1d1d] mb-3">
                <FolderTree className="size-6" />
              </div>
              <h3 className="text-base font-bold text-[#183b28]">Bạn chưa tham gia dòng họ nào</h3>
              <p className="text-xs text-[#5c4a3e] mt-1 max-w-md mx-auto">
                Bạn có thể bấm nút "Xin Tạo Dòng Họ Mới" ở trên để gửi hồ sơ thành lập dòng họ của mình, hoặc tìm kiếm trong Danh bạ bên dưới để xin gia nhập.
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {families.map(({ family, membership, canManage }) => (
              <Link
                key={family.id}
                href={`/dashboard/${family.slug}`}
                className="group block transition-transform duration-200 hover:-translate-y-1"
              >
                <HeritageFrame innerClassName="p-5 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 gap-3.5">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#deb887] bg-[#f5e7c7] text-[#8c1d1d] shadow-xs">
                          <FolderTree className="size-6" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-xl font-bold tracking-tight text-[#183b28] group-hover:text-[#8c1d1d] transition-colors">
                            {family.name}
                          </h3>
                        </div>
                      </div>
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f4efe6] text-[#deb887] transition-all group-hover:bg-[#8c1d1d] group-hover:text-white">
                        <ArrowRight className="size-4" />
                      </div>
                    </div>

                    {family.description && (
                      <p className="mt-3.5 line-clamp-2 text-sm leading-relaxed text-[#5c4a3e]">
                        {family.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2 pt-3 border-t border-[#deb887]/40">
                    <HeritageBadge
                      variant={roleVariant(
                        membership?.role,
                        membership?.is_primary_admin,
                        isSystemAdmin,
                      )}
                    >
                      {roleLabel(
                        membership?.role,
                        membership?.is_primary_admin,
                        isSystemAdmin,
                      )}
                    </HeritageBadge>
                    {canManage && (
                      <HeritageBadge variant="jade">
                        Quyền phụ trách dòng họ
                      </HeritageBadge>
                    )}
                    <HeritageBadge variant="neutral">
                      {visibilityLabel(family.visibility)}
                    </HeritageBadge>
                  </div>
                </HeritageFrame>
              </Link>
            ))}
          </div>
          )}
        </section>

      {/* Directory Section (Framed INSIDE cards, clean container outside) */}
      <section className="mb-10">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-[#deb887]/60 pb-5">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#deb887] bg-[#f5e7c7]/50 px-3.5 py-1 text-xs font-black uppercase tracking-wide text-[#8c1d1d]">
              <LockKeyhole className="size-3.5" />
              Danh bạ dòng họ
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#183b28]">
              Tìm dòng họ để xin tham gia
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#5c4a3e]">
              Bạn có thể xem thông tin giới thiệu theo mức chia sẻ của từng dòng
              họ. Dữ liệu gia phả riêng tư không được mở nếu chưa được duyệt.
            </p>
          </div>
          <form className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#7a6455]" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Tìm theo tên hoặc slug dòng họ"
                className="w-full rounded-xl border border-[#deb887] bg-[#fffdf7] py-2.5 pl-10 pr-3.5 text-sm font-semibold text-[#183b28] placeholder-[#7a6455]/70 outline-none transition focus:border-[#caa455] focus:ring-1 focus:ring-[#caa455]"
              />
            </div>
            <select
              name="visibility"
              defaultValue={visibility}
              className="rounded-xl border border-[#deb887] bg-[#fffdf7] px-3.5 py-2.5 text-sm font-bold text-[#183b28] outline-none transition focus:border-[#caa455] sm:w-48"
            >
              <option value="all">Tất cả</option>
              <option value="public">Công khai giới thiệu</option>
              <option value="family_only">Chỉ thành viên</option>
              <option value="private">Riêng tư</option>
            </select>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8c1d1d] hover:bg-[#6e1616] px-5 py-2.5 text-sm font-black text-white shadow-xs transition-colors"
            >
              Lọc
            </button>
          </form>
        </div>

        {/* Directory Items with HeritageFrame INSIDE each card */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {directory.map((family) => {
            const statusLabel = requestLabel(family.request_status);
            const canRequest =
              !family.has_active_membership &&
              family.request_status !== "pending";

            return (
              <HeritageFrame
                key={family.id}
                className="transition-transform duration-200 hover:-translate-y-1"
                innerClassName="p-5 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <HeritageBadge variant="neutral">
                          {visibilityLabel(family.visibility)}
                        </HeritageBadge>
                        {family.has_active_membership && (
                          <HeritageBadge variant="jade">
                            <CheckCircle2 className="size-3.5" />
                            Đã là thành viên
                          </HeritageBadge>
                        )}
                        {statusLabel && !family.has_active_membership && (
                          <HeritageBadge variant="amber">
                            <Clock3 className="size-3.5" />
                            {statusLabel}
                          </HeritageBadge>
                        )}
                      </div>
                      <h3 className="truncate text-xl font-bold tracking-tight text-[#183b28]">
                        {family.name}
                      </h3>
                    </div>
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#deb887] bg-[#f5e7c7] text-[#8c1d1d] shadow-xs">
                      <ShieldCheck className="size-5" />
                    </div>
                  </div>

                  <p className="mt-3.5 line-clamp-3 text-sm leading-relaxed text-[#5c4a3e]">
                    {family.public_description ||
                      "Dòng họ này đang để thông tin giới thiệu ở chế độ riêng tư. Bạn có thể gửi yêu cầu tham gia để Người phụ trách dòng họ xem xét."}
                  </p>

                  <div className="mt-4 grid gap-2.5 text-sm sm:grid-cols-2">
                    <div className="rounded-xl border border-[#deb887]/40 bg-[#fbf7ed] px-3.5 py-2.5">
                      <p className="text-xs font-black uppercase text-[#7a6455]">
                        Người phụ trách
                      </p>
                      <p className="mt-1 line-clamp-2 font-bold text-[#183b28]">
                        {family.admin_names || "Chưa cập nhật"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#deb887]/40 bg-[#fbf7ed] px-3.5 py-2.5">
                      <p className="text-xs font-black uppercase text-[#7a6455]">
                        Thành viên
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1.5 font-bold text-[#183b28]">
                        <Users className="size-4 text-[#7a6455]" />
                        {family.member_count.toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2.5 pt-3.5 border-t border-[#deb887]/40 sm:flex-row">
                  <Link
                    href={`/dashboard/families/${family.slug}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#deb887] bg-[#fffdf7] px-4 py-2.5 text-sm font-black text-[#5c4a3e] shadow-xs transition hover:bg-[#f5e7c7]/40 hover:text-[#183b28]"
                  >
                    <Eye className="size-4" />
                    Xem thông tin
                  </Link>
                  {!profile ? (
                    <Link
                      href={`/login?next=${encodeURIComponent(returnTo)}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#8c1d1d] hover:bg-[#6e1616] px-4 py-2.5 text-sm font-black text-white shadow-xs transition-colors"
                    >
                      <Send className="size-4" />
                      Đăng nhập để tham gia
                    </Link>
                  ) : family.has_active_membership ? (
                    <Link
                      href={`/dashboard/${family.slug}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#183b28] hover:bg-[#122e1f] px-4 py-2.5 text-sm font-black text-white shadow-xs transition-colors"
                    >
                      Vào xem gia phả
                      <ArrowRight className="size-4" />
                    </Link>
                  ) : canRequest ? (
                    <form action={requestJoinFamilyAction} className="flex-1">
                      <input
                        type="hidden"
                        name="family_id"
                        value={family.id}
                      />
                      <input
                        type="hidden"
                        name="return_to"
                        value={returnTo}
                      />
                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8c1d1d] hover:bg-[#6e1616] px-4 py-2.5 text-sm font-black text-white shadow-xs transition-colors"
                      >
                        <Send className="size-4" />
                        Gửi yêu cầu
                      </button>
                    </form>
                  ) : (
                    <button
                      disabled
                      className="inline-flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#deb887]/60 bg-[#f4efe6] px-4 py-2.5 text-sm font-black text-[#7a6455]"
                    >
                      <Clock3 className="size-4" />
                      Đang chờ duyệt
                    </button>
                  )}
                </div>
              </HeritageFrame>
            );
          })}
        </div>

        {directory.length === 0 && (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-[#deb887] bg-[#fdfaf3] p-10 text-center">
            <FolderTree className="mx-auto mb-3 size-10 text-[#deb887]" />
            <h3 className="text-xl font-bold tracking-tight text-[#183b28]">
              Không tìm thấy dòng họ phù hợp
            </h3>
            <p className="mt-2 text-sm text-[#7a6455]">
              Hãy thử đổi từ khóa hoặc bỏ bộ lọc chế độ hiển thị.
            </p>
          </div>
        )}

        {totalCount > PAGE_SIZE && (
          <div className="mt-8 flex items-center justify-between gap-3 pt-4 border-t border-[#deb887]/50">
            <Link
              href={buildDashboardHref({
                q,
                visibility,
                page: Math.max(1, currentPage - 1),
              })}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition border ${
                currentPage <= 1
                  ? "pointer-events-none border-[#deb887]/30 bg-[#f4efe6] text-[#deb887]"
                  : "border-[#deb887] bg-[#fffdf7] text-[#5c4a3e] hover:bg-[#f5e7c7]/50 hover:text-[#183b28]"
              }`}
            >
              <ArrowLeft className="size-4" />
              Trước
            </Link>
            <span className="text-sm font-bold text-[#7a6455]">
              Trang {currentPage} / {totalPages}
            </span>
            <Link
              href={buildDashboardHref({
                q,
                visibility,
                page: Math.min(totalPages, currentPage + 1),
              })}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition border ${
                currentPage >= totalPages
                  ? "pointer-events-none border-[#deb887]/30 bg-[#f4efe6] text-[#deb887]"
                  : "border-[#deb887] bg-[#fffdf7] text-[#5c4a3e] hover:bg-[#f5e7c7]/50 hover:text-[#183b28]"
              }`}
            >
              Sau
              <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </section>
    </main>
    </div>
  );
}
