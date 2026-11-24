"use client";

import { useState, useTransition } from "react";
import { toggleFamilyApprovalAction } from "@/app/actions/system-settings";
import { CheckCircle2, AlertCircle, Loader2, ShieldCheck, Zap } from "lucide-react";

interface Props {
  initialEnabled: boolean;
}

export default function FamilyApprovalToggle({ initialEnabled }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleToggle = () => {
    const nextState = !enabled;
    setMessage(null);
    startTransition(async () => {
      const res = await toggleFamilyApprovalAction(nextState);
      if (res.success) {
        setEnabled(nextState);
        setMessage({
          type: "success",
          text: nextState
            ? "Đã BẬT chế độ kiểm duyệt. Thành viên tạo dòng họ phải được Super Admin phê duyệt."
            : "Đã TẮT chế độ kiểm duyệt. Thành viên tạo dòng họ sẽ có không gian gia tộc ngay lập tức.",
        });
      } else {
        setMessage({
          type: "error",
          text: res.error || "Không thể cập nhật cấu hình.",
        });
      }
    });
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-stone-900">
              Chế độ phê duyệt khi tạo dòng họ
            </span>
            {enabled ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="size-3.5" />
                ĐANG BẬT DUYỆT
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Zap className="size-3.5" />
                MỞ TỰ DO (KHÔNG CẦN DUYỆT)
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 max-w-2xl leading-relaxed">
            {enabled
              ? "Thành viên gửi đơn xin lập dòng họ sẽ vào hàng đợi chờ Super Admin xét duyệt. Dòng họ chỉ xuất hiện sau khi được duyệt."
              : "Thành viên tạo dòng họ sẽ được cấp workspace và trở thành Admin dòng họ ngay lập tức mà không cần chờ duyệt."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50 ${
            enabled ? "bg-[#800000]" : "bg-stone-300"
          }`}
          aria-label="Bật tắt chế độ duyệt dòng họ"
        >
          <span
            className={`pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          >
            {isPending && <Loader2 className="size-3 animate-spin text-stone-600" />}
          </span>
        </button>
      </div>

      {message && (
        <div
          className={`mt-3.5 flex items-center gap-2 text-xs font-bold rounded-xl p-2.5 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="size-4 shrink-0 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
}
