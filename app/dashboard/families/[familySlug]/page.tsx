import { requestJoinFamilyAction } from "@/app/actions/join-request";
import { getSupabase } from "@/utils/supabase/queries";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Eye,
  LockKeyhole,
  Send,
  ShieldCheck,
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

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-stone-500 transition-colors hover:text-[#800000]"
      >
        <ArrowLeft className="size-4" />
        Quay lại danh bạ dòng họ
      </Link>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-700">
              <ShieldCheck className="size-4" />
              Hồ sơ dòng họ
            </div>
            <h1 className="text-3xl font-black text-stone-950 sm:text-4xl">
              {family.name}
            </h1>
            <p className="mt-2 text-sm font-mono text-stone-400">
              /dashboard/families/{family.slug}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-600">
                {visibilityLabel(family.visibility)}
              </span>
              {family.has_active_membership && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  <CheckCircle2 className="size-3.5" />
                  Đã là thành viên
                </span>
              )}
              {family.request_status && !family.has_active_membership && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                  <Clock3 className="size-3.5" />
                  {requestLabel(family.request_status)}
                </span>
              )}
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-6 text-stone-600">
              {family.public_description ||
                "Dòng họ này đang để phần giới thiệu ở chế độ riêng tư. Bạn vẫn có thể gửi yêu cầu tham gia để Người phụ trách dòng họ xem xét."}
            </p>
          </div>

          {family.has_active_membership ? (
            <Link
              href={treeHref}
              title="Xem sơ đồ cây gia phả"
              className="group min-w-0 rounded-2xl bg-stone-50 px-4 py-3 transition hover:bg-amber-50 hover:ring-2 hover:ring-amber-200"
            >
              <p className="text-xs font-black uppercase tracking-wide text-stone-400 group-hover:text-[#800000]">
                Thành viên gia phả
              </p>
              <p className="mt-1 text-3xl font-black text-stone-950 group-hover:text-[#800000]">
                {family.member_count.toLocaleString("vi-VN")}
              </p>
            </Link>
          ) : (
            <div className="min-w-0 rounded-2xl bg-stone-50 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-wide text-stone-400">
                Thành viên gia phả
              </p>
              <p className="mt-1 text-3xl font-black text-stone-950">
                {family.member_count.toLocaleString("vi-VN")}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-stone-50 p-4">
            <p className="text-xs font-black uppercase text-stone-400">
              Nguồn gốc / địa chỉ
            </p>
            <p className="mt-1 whitespace-pre-line text-sm font-bold leading-6 text-stone-800">
              {family.public_origin_location || "Chưa cập nhật"}
            </p>
          </div>
          <div className="rounded-2xl bg-stone-50 p-4">
            <p className="text-xs font-black uppercase text-stone-400">
              Người phụ trách
            </p>
            <p className="mt-1 whitespace-pre-line text-sm font-bold leading-6 text-stone-800">
              {family.admin_names || "Chưa cập nhật"}
            </p>
            {family.has_active_membership && (
              <Link
                href={`/dashboard/${family.slug}/admins`}
                className="mt-3 inline-flex items-center justify-center rounded-full bg-white px-3 py-2 text-xs font-black text-[#800000] shadow-sm ring-1 ring-amber-200 transition hover:bg-amber-50"
              >
                Xem ban phụ trách dòng họ
              </Link>
            )}
          </div>
          <div className="rounded-2xl bg-stone-50 p-4">
            <p className="text-xs font-black uppercase text-stone-400">
              Thông tin liên hệ
            </p>
            <p className="mt-1 whitespace-pre-line text-sm leading-6 text-stone-700">
              {family.admin_contacts || "Chưa có thông tin liên hệ"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {family.has_active_membership ? (
            <Link
              href={`/dashboard/${family.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
            >
              VÀO TRANG CHÍNH
              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-100 px-4 py-3 text-sm font-black text-stone-500">
              <LockKeyhole className="size-4" />
              Chưa có quyền truy cập
            </div>
          )}
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-stone-700 shadow-sm transition hover:bg-stone-100"
          >
            <Eye className="size-4" />
            Quay lại danh bạ
          </Link>
          {!family.has_active_membership && family.request_status !== "pending" ? (
            <form action={requestJoinFamilyAction}>
              <input type="hidden" name="family_id" value={family.id} />
              <input type="hidden" name="return_to" value={returnTo} />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#800000] px-4 py-3 text-sm font-black text-white transition hover:bg-[#9f1111]"
              >
                <Send className="size-4" />
                Gửi yêu cầu tham gia
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-100 px-4 py-3 text-sm font-black text-stone-500">
              <Clock3 className="size-4" />
              {requestLabel(family.request_status) || "Đã có quyền truy cập"}
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-dashed border-stone-200 bg-stone-50 p-5 text-sm leading-6 text-stone-600">
        <div className="mb-2 inline-flex items-center gap-2 font-black text-stone-900">
          <LockKeyhole className="size-4 text-amber-700" />
          Quyền truy cập
        </div>
        <p>
          Dữ liệu cây gia phả, hồ sơ tổ tiên, sự kiện và tài liệu chỉ mở cho
          thành viên chính thức của đúng dòng họ này. Người ngoài chỉ xem được phần
          thông tin mà Người phụ trách dòng họ cho phép công khai.
        </p>
      </section>
    </main>
  );
}
