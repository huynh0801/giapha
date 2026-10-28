"use client";

import { useState, useTransition } from "react";
import {
  approveFamilyCreationAction,
  rejectFamilyCreationAction,
  FamilyCreationRequestAdminRow,
} from "@/app/actions/family-request";
import {
  Building2,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ScrollText,
  User,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  requests: FamilyCreationRequestAdminRow[];
}

export default function AdminFamilyRequestsList({ requests }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [selectedApproveReq, setSelectedApproveReq] =
    useState<FamilyCreationRequestAdminRow | null>(null);
  const [selectedRejectReq, setSelectedRejectReq] =
    useState<FamilyCreationRequestAdminRow | null>(null);
  const [customSlug, setCustomSlug] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredRequests = requests.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const handleApproveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApproveReq) return;
    setActionError(null);

    startTransition(async () => {
      const result = await approveFamilyCreationAction(
        selectedApproveReq.id,
        customSlug || undefined,
      );
      if (!result.success) {
        setActionError(result.error || "Không thể phê duyệt yêu cầu.");
      } else {
        setSelectedApproveReq(null);
        setCustomSlug("");
      }
    });
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRejectReq) return;
    setActionError(null);

    startTransition(async () => {
      const result = await rejectFamilyCreationAction(
        selectedRejectReq.id,
        rejectReason || undefined,
      );
      if (!result.success) {
        setActionError(result.error || "Không thể từ chối yêu cầu.");
      } else {
        setSelectedRejectReq(null);
        setRejectReason("");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Bộ lọc trạng thái */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Tất cả ({requests.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === "pending"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            <Clock3 className="size-3.5" />
            <span>Chờ xét duyệt ({pendingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter("approved")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              filter === "approved"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            Đã duyệt ({requests.filter((r) => r.status === "approved").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("rejected")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              filter === "rejected"
                ? "bg-red-700 text-white shadow-xs"
                : "bg-red-50 text-red-800 hover:bg-red-100"
            }`}
          >
            Đã từ chối ({requests.filter((r) => r.status === "rejected").length})
          </button>
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Hiển thị {filteredRequests.length} hồ sơ
        </span>
      </div>

      {/* Danh sách yêu cầu */}
      {filteredRequests.length === 0 ? (
        <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 mb-3">
            <Building2 className="size-7" />
          </div>
          <h3 className="text-base font-bold text-stone-900">
            Không có yêu cầu nào trong danh mục này
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Các yêu cầu xin tạo dòng họ từ người dùng sẽ hiển thị ở đây để Admin xét duyệt.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-[#deb887]"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                {/* Thông tin chính */}
                <div className="flex items-start gap-4">
                  {req.logo_url ? (
                    <div className="relative size-14 rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 shrink-0">
                      <Image
                        src={req.logo_url}
                        alt="Logo dòng họ"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-[#8c1d1d]">
                      <Building2 className="size-7" />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-stone-900">
                        {req.family_name}
                      </h3>
                      {req.status === "pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          <Clock3 className="size-3" /> Chờ xét duyệt
                        </span>
                      )}
                      {req.status === "approved" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="size-3" /> Đã phê duyệt
                        </span>
                      )}
                      {req.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                          <XCircle className="size-3" /> Đã từ chối
                        </span>
                      )}
                      {req.status === "cancelled" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-600">
                          Đã hủy
                        </span>
                      )}
                    </div>

                    {req.origin_location && (
                      <p className="text-xs text-stone-600 flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-stone-400 shrink-0" />
                        <span>Quê quán: {req.origin_location}</span>
                      </p>
                    )}

                    {req.description && (
                      <div className="p-3 rounded-xl bg-stone-50 text-xs text-stone-700 leading-relaxed max-w-2xl border border-stone-100">
                        <ScrollText className="size-3.5 inline mr-1.5 text-stone-400" />
                        {req.description}
                      </div>
                    )}

                    {/* Lý do từ chối nếu có */}
                    {req.status === "rejected" && req.rejection_reason && (
                      <p className="text-xs text-red-700 font-medium">
                        Lý do từ chối: &ldquo;{req.rejection_reason}&rdquo;
                      </p>
                    )}

                    {/* Người gửi */}
                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-500 border-t border-stone-100">
                      <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                        <User className="size-3.5 text-stone-400" />
                        <span>Người yêu cầu: {req.requester_name || "Chưa đặt tên"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="size-3.5 text-stone-400" />
                        <span>{req.requester_email || "Không có email"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#8c1d1d] font-bold">
                        <Phone className="size-3.5" />
                        <a href={`tel:${req.phone_contact}`} className="hover:underline">
                          {req.phone_contact}
                        </a>
                      </div>
                      <span className="text-stone-400">
                        • Ngày gửi: {new Date(req.created_at).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thao tác */}
                {req.status === "pending" && (
                  <div className="flex sm:flex-row lg:flex-col gap-2 shrink-0 self-end lg:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedApproveReq(req);
                        setCustomSlug("");
                        setActionError(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="size-4" />
                      <span>Phê duyệt</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRejectReq(req);
                        setRejectReason("");
                        setActionError(null);
                      }}
                      className="px-4 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="size-4" />
                      <span>Từ chối</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal xác nhận phê duyệt */}
      {selectedApproveReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedApproveReq(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:bg-stone-100"
            >
              <X className="size-5" />
            </button>

            <div className="text-center mb-5">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mb-2">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="text-xl font-black text-stone-900">
                Phê Duyệt Dòng Họ
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Dòng họ &ldquo;{selectedApproveReq.family_name}&rdquo; sẽ được tạo và gán cho{" "}
                <span className="font-bold text-stone-700">
                  {selectedApproveReq.requester_name || selectedApproveReq.requester_email}
                </span>{" "}
                làm Quản trị viên chính.
              </p>
            </div>

            {actionError && (
              <div className="mb-4 p-3 rounded-xl border border-red-300 bg-red-50 text-red-800 text-xs font-medium">
                {actionError}
              </div>
            )}

            <form onSubmit={handleApproveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Đường dẫn (Slug) dòng họ (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="Để trống để tự động sinh theo tên họ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 outline-none focus:border-emerald-600"
                />
                <span className="text-[11px] text-stone-400 mt-0.5 block">
                  Ví dụ: ho-nguyen-dai-toc
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApproveReq(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                  <span>Xác nhận Duyệt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal từ chối */}
      {selectedRejectReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedRejectReq(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:bg-stone-100"
            >
              <X className="size-5" />
            </button>

            <div className="text-center mb-5">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-100 text-red-700 mb-2">
                <XCircle className="size-6" />
              </div>
              <h3 className="text-xl font-black text-stone-900">
                Từ Chối Yêu Cầu
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Từ chối yêu cầu tạo dòng họ &ldquo;{selectedRejectReq.family_name}&rdquo;. Người gửi sẽ nhận được thông báo này.
              </p>
            </div>

            {actionError && (
              <div className="mb-4 p-3 rounded-xl border border-red-300 bg-red-50 text-red-800 text-xs font-medium">
                {actionError}
              </div>
            )}

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Lý do từ chối (Gửi cho thành viên)
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ví dụ: Tên dòng họ chưa đầy đủ, vui lòng bổ sung chi phái cụ thể..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 outline-none focus:border-red-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRejectReq(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                  <span>Xác nhận Từ chối</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
