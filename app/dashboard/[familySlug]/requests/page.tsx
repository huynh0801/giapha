import { reviewJoinRequestAction } from "@/app/actions/join-request";
import {
  reviewGenealogyRequestAction,
  GenealogyRequest,
} from "@/app/actions/family-claim";
import { getFamilyContextBySlug, getSupabase } from "@/utils/supabase/queries";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  GitBranch,
  MessageSquareText,
  ShieldCheck,
  UserCheck,
  UserPlus,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string }>;
  searchParams?: Promise<{ tab?: string }>;
}

type JoinRequestRow = {
  id: string;
  family_id: string;
  profile_id: string;
  message: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled";
  created_at: string;
  reviewed_at: string | null;
  requester: {
    id: string;
    full_name: string | null;
    phone_number: string | null;
    avatar_url: string | null;
    created_at: string;
  } | null;
};

function statusLabel(status: string) {
  if (status === "pending") return "Đang chờ duyệt";
  if (status === "approved") return "Đã duyệt";
  if (status === "rejected") return "Đã từ chối";
  return "Đã hủy";
}

function formatDate(value: string | null) {
  if (!value) return "Chưa có";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function FamilyJoinRequestsPage({
  params,
  searchParams,
}: PageProps) {
  const [{ familySlug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const context = await getFamilyContextBySlug(familySlug);
  if (!context) notFound();
  if (!context.canManage) redirect(`/dashboard/${familySlug}`);

  const activeTab = resolvedSearchParams?.tab === "genealogy" ? "genealogy" : "join";

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("join_requests")
    .select(
      [
        "id",
        "family_id",
        "profile_id",
        "message",
        "status",
        "created_at",
        "reviewed_at",
        "requester:profiles!join_requests_profile_id_fkey(id, full_name, phone_number, avatar_url, created_at)",
      ].join(", "),
    )
    .eq("family_id", context.family.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const joinRequests = (data || []) as unknown as JoinRequestRow[];
  const pendingJoinCount = joinRequests.filter((r) => r.status === "pending").length;

  // Read genealogy requests from family settings
  const familySettings = (context.family.settings as Record<string, unknown>) || {};
  const genealogyRequests = (Array.isArray(familySettings.genealogy_requests)
    ? familySettings.genealogy_requests
    : []) as GenealogyRequest[];

  const pendingGenealogyCount = genealogyRequests.filter(
    (r) => r.status === "pending",
  ).length;

  return (
    <main className="flex w-full flex-1 flex-col bg-stone-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href={`/dashboard/${familySlug}`}
              className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-stone-500 transition-colors hover:text-[#800000]"
            >
              <ArrowLeft className="size-4" />
              Quay về dashboard dòng họ
            </Link>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-600">
              Quản Trị Xét Duyệt
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
              Yêu cầu phê duyệt {context.family.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Quản trị viên dòng họ xem xét và phê duyệt thành viên mới hoặc xác nhận cành nhánh huyết thống trên cây phả hệ.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {pendingGenealogyCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs">
                <GitBranch className="size-3.5" />
                {pendingGenealogyCount} phả hệ chờ duyệt
              </span>
            )}
            {pendingJoinCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8c1d1d] text-white px-3.5 py-1.5 text-xs font-bold shadow-xs">
                <Users className="size-3.5" />
                {pendingJoinCount} gia nhập chờ duyệt
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex items-center gap-2 border-b border-stone-200 pb-3">
          <Link
            href={`/dashboard/${familySlug}/requests?tab=join`}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "join"
                ? "bg-[#8c1d1d] text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Users className="size-4" />
            <span>Gia nhập dòng họ</span>
            {pendingJoinCount > 0 && (
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === "join"
                    ? "bg-white/20 text-white"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {pendingJoinCount}
              </span>
            )}
          </Link>

          <Link
            href={`/dashboard/${familySlug}/requests?tab=genealogy`}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "genealogy"
                ? "bg-[#8c1d1d] text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <GitBranch className="size-4" />
            <span>Xác nhận phả hệ & Nhận tên</span>
            {pendingGenealogyCount > 0 && (
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === "genealogy"
                    ? "bg-white/20 text-white"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {pendingGenealogyCount}
              </span>
            )}
          </Link>
        </div>

        {/* ── TAB 1: YÊU CẦU GIA NHẬP DÒNG HỌ ── */}
        {activeTab === "join" && (
          <div className="space-y-4">
            {joinRequests.map((request) => {
              const requester = request.requester;
              const isPending = request.status === "pending";

              return (
                <article
                  key={request.id}
                  className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-stone-600">
                        <UserRound className="size-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-black text-stone-950">
                            {requester?.full_name || "Người dùng chưa cập nhật tên"}
                          </h2>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              isPending
                                ? "bg-amber-50 text-amber-700"
                                : request.status === "approved"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-stone-100 text-stone-500"
                            }`}
                          >
                            {statusLabel(request.status)}
                          </span>
                        </div>
                        <div className="mt-2 grid gap-2 text-sm text-stone-500 sm:grid-cols-2">
                          <p>Gửi lúc: {formatDate(request.created_at)}</p>
                          <p>
                            Số điện thoại: {requester?.phone_number || "Chưa cập nhật"}
                          </p>
                        </div>
                        <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                          <div className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase text-stone-400">
                            <MessageSquareText className="size-4" />
                            Lời nhắn
                          </div>
                          <p className="whitespace-pre-line text-sm leading-6 text-stone-700">
                            {request.message || "Người dùng chưa gửi lời nhắn bổ sung."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {isPending ? (
                      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col shrink-0">
                        <form action={reviewJoinRequestAction}>
                          <input type="hidden" name="family_id" value={context.family.id} />
                          <input type="hidden" name="request_id" value={request.id} />
                          <input type="hidden" name="decision" value="approve" />
                          <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="size-4" />
                            Duyệt
                          </button>
                        </form>
                        <form action={reviewJoinRequestAction}>
                          <input type="hidden" name="family_id" value={context.family.id} />
                          <input type="hidden" name="request_id" value={request.id} />
                          <input type="hidden" name="decision" value="reject" />
                          <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-100 px-4 py-2.5 text-sm font-black text-stone-700 transition hover:bg-stone-200 cursor-pointer"
                          >
                            <XCircle className="size-4" />
                            Từ chối
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-xl bg-stone-50 px-4 py-2 text-sm font-bold text-stone-500">
                        <ShieldCheck className="size-4" />
                        Xử lý lúc {formatDate(request.reviewed_at)}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}

            {joinRequests.length === 0 && (
              <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-8 text-center">
                <UserRound className="mx-auto mb-3 size-10 text-stone-300" />
                <h2 className="text-xl font-black text-stone-900">
                  Chưa có yêu cầu tham gia dòng họ
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                  Khi người dùng gửi yêu cầu vào dòng họ này, danh sách sẽ xuất hiện tại đây để Admin xem xét.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: YÊU CẦU PHẢ HỆ & NHẬN DANH TÍNH ── */}
        {activeTab === "genealogy" && (
          <div className="space-y-4">
            {genealogyRequests.map((request) => {
              const isPending = request.status === "pending";

              return (
                <article
                  key={request.id}
                  className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div
                        className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${
                          request.type === "claim_person"
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-[#8c1d1d]/10 text-[#8c1d1d]"
                        }`}
                      >
                        {request.type === "claim_person" ? (
                          <UserCheck className="size-6" />
                        ) : (
                          <UserPlus className="size-6" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-black text-stone-950">
                            {request.user_name}
                          </h2>
                          {request.user_email && (
                            <span className="text-xs text-stone-500">
                              ({request.user_email})
                            </span>
                          )}
                          <span
                            className={`rounded-full px-3 py-0.5 text-xs font-black ${
                              isPending
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : request.status === "approved"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-stone-100 text-stone-500"
                            }`}
                          >
                            {statusLabel(request.status)}
                          </span>
                        </div>

                        {/* Chi tiết yêu cầu phả hệ */}
                        <div className="mt-3 rounded-2xl bg-stone-50 p-4 border border-stone-200/60">
                          <div className="text-xs font-extrabold uppercase tracking-wider text-amber-700 mb-1.5 flex items-center gap-1.5">
                            <GitBranch className="size-3.5" />
                            {request.type === "claim_person"
                              ? "Yêu cầu nhận danh tính có sẵn trên cây"
                              : "Yêu cầu tạo hồ sơ mới & nối cây gia phả"}
                          </div>

                          {request.type === "claim_person" ? (
                            <div className="text-sm font-bold text-stone-900">
                              Xin nhận là:{" "}
                              <span className="text-[#8c1d1d] font-black text-base">
                                {request.person_name}
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-1 text-sm text-stone-800">
                              <div>
                                <span className="font-semibold">Họ và tên:</span>{" "}
                                <strong className="text-[#8c1d1d] font-black">
                                  {request.new_person_data?.full_name}
                                </strong>{" "}
                                ({request.new_person_data?.gender === "male" ? "Nam" : "Nữ"}
                                {request.new_person_data?.birth_year
                                  ? `, Sinh ${request.new_person_data.birth_year}`
                                  : ""}
                                {request.new_person_data?.birth_order
                                  ? `, Con thứ ${request.new_person_data.birth_order}`
                                  : ""}
                                )
                              </div>
                              {request.new_person_data?.parent_name && (
                                <div>
                                  <span className="font-semibold">Nối làm con của:</span>{" "}
                                  <strong className="text-emerald-800">
                                    {request.new_person_data.parent_name}
                                  </strong>
                                </div>
                              )}
                            </div>
                          )}

                          {request.message && (
                            <div className="mt-3 pt-2.5 border-t border-stone-200/60 text-xs text-stone-600">
                              <span className="font-bold text-stone-700">Lời nhắn / Căn cứ huyết thống: </span>
                              <span className="italic">&ldquo;{request.message}&rdquo;</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-2 text-xs text-stone-400">
                          Gửi yêu cầu lúc: {formatDate(request.created_at)}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {isPending ? (
                      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col shrink-0 min-w-44">
                        <form action={reviewGenealogyRequestAction}>
                          <input type="hidden" name="family_id" value={context.family.id} />
                          <input type="hidden" name="request_id" value={request.id} />
                          <input type="hidden" name="decision" value="approved" />
                          <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="size-4" />
                            Chấp thuận & Đồng bộ cây
                          </button>
                        </form>

                        <form action={reviewGenealogyRequestAction} className="space-y-1.5">
                          <input type="hidden" name="family_id" value={context.family.id} />
                          <input type="hidden" name="request_id" value={request.id} />
                          <input type="hidden" name="decision" value="rejected" />
                          <input
                            type="text"
                            name="rejection_reason"
                            placeholder="Lý do từ chối (tuỳ chọn)..."
                            className="w-full px-2.5 py-1 text-xs border border-stone-300 rounded-lg bg-white"
                          />
                          <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-100 px-4 py-2 text-sm font-black text-red-700 transition hover:bg-red-50 hover:border-red-200 border border-transparent cursor-pointer"
                          >
                            <XCircle className="size-4" />
                            Từ chối yêu cầu
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="text-right shrink-0">
                        <div className="inline-flex items-center gap-2 rounded-xl bg-stone-50 px-3.5 py-1.5 text-xs font-bold text-stone-500">
                          <ShieldCheck className="size-4" />
                          {request.status === "approved" ? "Đã duyệt" : "Đã từ chối"} lúc{" "}
                          {formatDate(request.reviewed_at || null)}
                        </div>
                        {request.rejection_reason && (
                          <p className="mt-1 text-xs text-red-600 italic">
                            Lý do: {request.rejection_reason}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}

            {genealogyRequests.length === 0 && (
              <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-8 text-center">
                <GitBranch className="mx-auto mb-3 size-10 text-stone-300" />
                <h2 className="text-xl font-black text-stone-900">
                  Chưa có yêu cầu xác nhận phả hệ
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                  Khi thành viên gửi yêu cầu nhận danh tính hoặc thêm con cháu vào cây, danh sách sẽ hiển thị tại đây để Ban Quản Trị đối chiếu phả đồ.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
