"use client";

import { useTransition } from "react";
import { cancelFamilyCreationAction, FamilyCreationRequest } from "@/app/actions/family-request";
import { AlertCircle, Clock3, Loader2, X } from "lucide-react";

interface Props {
  request: FamilyCreationRequest;
}

export default function FamilyRequestStatusCard({ request }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    if (confirm("Bạn có chắc chắn muốn hủy yêu cầu tạo dòng họ này?")) {
      startTransition(async () => {
        await cancelFamilyCreationAction(request.id);
      });
    }
  };

  if (request.status === "pending") {
    return (
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/80 p-4 sm:p-5 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <Clock3 className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                Đang chờ xét duyệt
              </span>
              <span className="text-[11px] text-amber-700">
                • {new Date(request.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-[#183b28] mt-0.5">
              Hồ sơ tạo dòng họ: <span className="text-[#8c1d1d]">{request.family_name}</span>
            </h4>
            <p className="text-xs text-amber-800/90 mt-1">
              Yêu cầu của bạn đang được Ban Quản Trị xem xét. Sau khi duyệt, dòng họ sẽ tự động kích hoạt.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="self-end sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
          <span>Hủy yêu cầu</span>
        </button>
      </div>
    );
  }

  if (request.status === "rejected") {
    return (
      <div className="rounded-2xl border-2 border-red-200 bg-red-50/80 p-4 sm:p-5 shadow-xs mb-6 flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-red-100 text-red-800 shrink-0">
          <AlertCircle className="size-5" />
        </div>
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-red-900">
            Yêu cầu không được phê duyệt
          </span>
          <h4 className="text-sm font-bold text-[#183b28] mt-0.5">
            Dòng họ: <span className="text-red-700">{request.family_name}</span>
          </h4>
          {request.rejection_reason && (
            <p className="text-xs text-red-800 mt-1 font-medium">
              Lý do từ chối: &ldquo;{request.rejection_reason}&rdquo;
            </p>
          )}
          <p className="text-[11px] text-[#5c4a3e] mt-1">
            Bạn có thể chỉnh sửa thông tin và gửi lại đơn yêu cầu mới bất cứ lúc nào.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
