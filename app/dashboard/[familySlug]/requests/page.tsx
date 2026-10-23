import { reviewJoinRequestAction } from "@/app/actions/join-request";
import { getFamilyContextBySlug, getSupabase } from "@/utils/supabase/queries";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string }>;
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

function statusLabel(status: JoinRequestRow["status"]) {
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

export default async function FamilyJoinRequestsPage({ params }: PageProps) {
  const { familySlug } = await params;
  const context = await getFamilyContextBySlug(familySlug);
  if (!context) notFound();
  if (!context.canManage) redirect(`/dashboard/${familySlug}`);

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

  const requests = (data || []) as unknown as JoinRequestRow[];
  const pendingCount = requests.filter(
    (request) => request.status === "pending",
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
              Thành viên
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
              Yêu cầu tham gia {context.family.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Chỉ Admin dòng họ đang hoạt động mới được duyệt thành viên mới.
              Khi duyệt, hệ thống tự tạo membership active với role Thành viên.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">
            <Clock3 className="size-4" />
            {pendingCount} yêu cầu đang chờ
          </div>
        </div>

        <div className="space-y-4">
          {requests.map((request) => {
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
                          {requester?.full_name ||
                            "Người dùng chưa cập nhật tên"}
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
                          Số điện thoại:{" "}
                          {requester?.phone_number || "Chưa cập nhật"}
                        </p>
                      </div>
                      <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                        <div className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase text-stone-400">
                          <MessageSquareText className="size-4" />
                          Lời nhắn
                        </div>
                        <p className="whitespace-pre-line text-sm leading-6 text-stone-700">
                          {request.message ||
                            "Người dùng chưa gửi lời nhắn bổ sung."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isPending ? (
                    <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                      <form action={reviewJoinRequestAction}>
                        <input
                          type="hidden"
                          name="family_id"
                          value={context.family.id}
                        />
                        <input
                          type="hidden"
                          name="request_id"
                          value={request.id}
                        />
                        <input type="hidden" name="decision" value="approve" />
                        <button
                          type="submit"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="size-4" />
                          Duyệt
                        </button>
                      </form>
                      <form action={reviewJoinRequestAction}>
                        <input
                          type="hidden"
                          name="family_id"
                          value={context.family.id}
                        />
                        <input
                          type="hidden"
                          name="request_id"
                          value={request.id}
                        />
                        <input type="hidden" name="decision" value="reject" />
                        <button
                          type="submit"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-100 px-4 py-2.5 text-sm font-black text-stone-700 transition hover:bg-stone-200"
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
        </div>

        {requests.length === 0 && (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-8 text-center">
            <UserRound className="mx-auto mb-3 size-10 text-stone-300" />
            <h2 className="text-xl font-black text-stone-900">
              Chưa có yêu cầu tham gia
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Khi người dùng gửi yêu cầu vào dòng họ này, danh sách sẽ xuất
              hiện tại đây để Admin dòng họ xem xét.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
