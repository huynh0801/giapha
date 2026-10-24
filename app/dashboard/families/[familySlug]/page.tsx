import { requestJoinFamilyAction } from "@/app/actions/join-request";
import BackgroundDecor from "@/components/landing/BackgroundDecor";
import {
  HeritageBadge,
  HeritageFrame,
} from "@/components/dashboard/HeritageUI";
import { getSupabase } from "@/utils/supabase/queries";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Eye,
  LockKeyhole,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  params: Promise<{ familySlug: string }>;
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

async function getFamilyBySlug(familySlug: string) {
  const supabase = await getSupabase();
  const { data, error } = await supabase.rpc("get_family_directory", {
    search_term: familySlug,
    visibility_filter: "all",
    page_number: 1,
    page_size: 50,
  });

  if (error) return null;
  const rows = (data || []) as DirectoryRow[];
  return rows.find((row) => row.slug === familySlug) || null;
}

export default async function FamilyDirectoryDetailPage({ params }: PageProps) {
  const { familySlug } = await params;
  const family = await getFamilyBySlug(familySlug);
  if (!family) notFound();

  const returnTo = `/dashboard/families/${familySlug}`;

  let primaryTreeId: string | null = null;
  if (family.has_active_membership) {
    const supabase = await getSupabase();
    const { data: tree } = await supabase
      .from("family_trees")
      .select("id")
      .eq("family_id", family.id)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    primaryTreeId = tree?.id || null;
  }

  const treeHref = primaryTreeId
    ? `/dashboard/${family.slug}/members?treeId=${primaryTreeId}&view=tree`
    : `/dashboard/${family.slug}/members?view=tree`;

  const canRequest =
    !family.has_active_membership && family.request_status !== "pending";

  return (
    <div className="relative flex-1 w-full overflow-hidden">
      <BackgroundDecor subtle />
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Return Button */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-[#deb887] bg-[#fffdf7] px-4 py-2 text-xs sm:text-sm font-bold text-[#5c4a3e] shadow-xs transition hover:bg-[#f5e7c7]/50 hover:text-[#8c1d1d]"
          >
            <ArrowLeft className="size-4 text-[#8c1d1d]" />
            <span>Quay lại danh bạ dòng họ</span>
          </Link>
        </div>

        {/* Main Heritage Profile Frame */}
        <HeritageFrame innerClassName="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#deb887] bg-[#f5e7c7]/50 px-3.5 py-1 text-xs font-black uppercase tracking-wide text-[#8c1d1d]">
                <ShieldCheck className="size-3.5" />
                Hồ sơ dòng họ
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#183b28] leading-tight">
                {family.name}
              </h1>

              <p className="mt-1 font-mono text-xs text-[#7a6455]">
                /dashboard/{family.slug}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <HeritageBadge variant="neutral">
                  {visibilityLabel(family.visibility)}
                </HeritageBadge>

                {family.has_active_membership && (
                  <HeritageBadge variant="jade">
                    <CheckCircle2 className="size-3.5" />
                    Đã là thành viên
                  </HeritageBadge>
                )}

                {requestLabel(family.request_status) && !family.has_active_membership && (
                  <HeritageBadge variant="amber">
                    <Clock3 className="size-3.5" />
                    {requestLabel(family.request_status)}
                  </HeritageBadge>
                )}
              </div>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#5c4a3e]">
                {family.public_description ||
                  "Dòng họ này đang để phần giới thiệu ở chế độ riêng tư. Bạn vẫn có thể gửi yêu cầu tham gia để Người phụ trách dòng họ xem xét."}
              </p>
            </div>

            {/* Member Count Stat Box */}
            {family.has_active_membership ? (
              <Link
                href={treeHref}
                title="Xem sơ đồ cây gia phả"
                className="group shrink-0 rounded-2xl border border-[#deb887]/80 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] p-4 sm:p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#caa455] hover:shadow-md lg:w-64"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-wider text-[#7a6455] group-hover:text-[#8c1d1d] transition-colors">
                    Thành viên gia phả
                  </p>
                  <Users className="size-4 text-[#deb887] group-hover:text-[#8c1d1d] transition-colors" />
                </div>
                <p className="mt-1.5 text-3xl font-black text-[#183b28] group-hover:text-[#8c1d1d] transition-colors">
                  {family.member_count.toLocaleString("vi-VN")}
                </p>
                <p className="mt-2 text-xs font-bold text-[#8c1d1d] flex items-center gap-1">
                  <span>Mở xem sơ đồ cây</span>
                  <ArrowRight className="size-3" />
                </p>
              </Link>
            ) : (
              <div className="shrink-0 rounded-2xl border border-[#deb887]/80 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] p-4 sm:p-5 shadow-xs lg:w-64">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-wider text-[#7a6455]">
                    Thành viên gia phả
                  </p>
                  <Users className="size-4 text-[#deb887]" />
                </div>
                <p className="mt-1.5 text-3xl font-black text-[#183b28]">
                  {family.member_count.toLocaleString("vi-VN")}
                </p>
                <p className="mt-2 text-xs font-medium text-[#7a6455]">
                  Đã ghi chép trong gia phả
                </p>
              </div>
            )}
          </div>

          {/* 3 Information Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#deb887]/60 bg-[#fcfaf5] p-4 shadow-xs">
              <p className="text-xs font-black uppercase tracking-wider text-[#8c1d1d] flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                Nguồn gốc / Địa chỉ
              </p>
              <p className="mt-2 whitespace-pre-line text-sm font-bold leading-relaxed text-[#183b28]">
                {family.public_origin_location || "Chưa cập nhật"}
              </p>
            </div>

            <div className="rounded-xl border border-[#deb887]/60 bg-[#fcfaf5] p-4 shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#8c1d1d] flex items-center gap-1.5">
                  <UserCheck className="size-3.5" />
                  Người phụ trách
                </p>
                <p className="mt-2 whitespace-pre-line text-sm font-bold leading-relaxed text-[#183b28]">
                  {family.admin_names || "Chưa cập nhật"}
                </p>
              </div>
              {family.has_active_membership && (
                <Link
                  href={`/dashboard/${family.slug}/admins`}
                  className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#deb887] bg-white px-3 py-1.5 text-xs font-bold text-[#5c4a3e] shadow-xs transition hover:bg-[#f5e7c7]/50 hover:text-[#8c1d1d]"
                >
                  <UserCog className="size-3.5 text-[#8c1d1d]" />
                  <span>Xem ban phụ trách dòng họ</span>
                </Link>
              )}
            </div>

            <div className="rounded-xl border border-[#deb887]/60 bg-[#fcfaf5] p-4 shadow-xs">
              <p className="text-xs font-black uppercase tracking-wider text-[#8c1d1d] flex items-center gap-1.5">
                <Mail className="size-3.5" />
                Thông tin liên hệ
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#5c4a3e]">
                {family.admin_contacts || "Chưa có thông tin liên hệ"}
              </p>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="mt-8 pt-6 border-t border-[#deb887]/50 flex flex-col sm:flex-row gap-3">
            {family.has_active_membership ? (
              <Link
                href={`/dashboard/${family.slug}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#183b28] hover:bg-[#122e1f] px-5 py-3 text-sm font-black text-white shadow-xs transition-colors"
              >
                <span>VÀO XEM GIA PHẢ</span>
                <ArrowRight className="size-4" />
              </Link>
            ) : canRequest ? (
              <form action={requestJoinFamilyAction} className="flex-1">
                <input type="hidden" name="family_id" value={family.id} />
                <input type="hidden" name="return_to" value={returnTo} />
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8c1d1d] hover:bg-[#6e1616] px-5 py-3 text-sm font-black text-white shadow-xs transition-colors"
                >
                  <Send className="size-4" />
                  <span>Gửi yêu cầu tham gia</span>
                </button>
              </form>
            ) : (
              <div className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#deb887]/60 bg-[#f4efe6] px-5 py-3 text-sm font-black text-[#7a6455]">
                <Clock3 className="size-4" />
                <span>{requestLabel(family.request_status) || "Đã có quyền truy cập"}</span>
              </div>
            )}

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#deb887] bg-[#fffdf7] px-5 py-3 text-sm font-black text-[#5c4a3e] shadow-xs transition hover:bg-[#f5e7c7]/40 hover:text-[#183b28]"
            >
              <Eye className="size-4" />
              <span>Quay lại danh bạ</span>
            </Link>
          </div>
        </HeritageFrame>

        {/* Privacy Note Section */}
        <section className="mt-6 rounded-2xl border-2 border-dashed border-[#deb887] bg-[#fdfaf3] p-5 text-sm leading-relaxed text-[#5c4a3e]">
          <div className="mb-2 inline-flex items-center gap-2 font-bold text-[#183b28]">
            <LockKeyhole className="size-4 text-[#8c1d1d]" />
            <span>Quy định bảo mật gia phả</span>
          </div>
          <p>
            Dữ liệu cây gia phả, hồ sơ tổ tiên, sự kiện và tài liệu chỉ mở cho
            thành viên chính thức của đúng dòng họ này. Người ngoài chỉ xem được phần
            thông tin mà Người phụ trách dòng họ cho phép công khai.
          </p>
        </section>
      </main>
    </div>
  );
}
