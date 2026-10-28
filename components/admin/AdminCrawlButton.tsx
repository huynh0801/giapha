"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DownloadCloud, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { triggerHoatrachCrawlAction } from "@/app/actions/crawler";

export default function AdminCrawlButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  async function handleCrawl() {
    if (isLoading) return;

    const confirmed = window.confirm(
      "Bạn có muốn cào 20 bài viết mới nhất từ Báo Mới (Chuyên mục Quảng Bình: baomoi.com/quang-binh-tag67.epi) vào hệ thống ngay bây giờ?"
    );
    if (!confirmed) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await triggerHoatrachCrawlAction({ limit: 20 });
      if (res.success) {
        setFeedback({ type: "success", text: res.message });
        router.refresh();
      } else {
        setFeedback({ type: "error", text: res.message });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Đã xảy ra lỗi không xác định." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
      {feedback && (
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border animate-in fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
              : "bg-red-50 text-red-800 border-red-300"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="size-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="ml-2 text-stone-400 hover:text-stone-700 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleCrawl}
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#caa455] bg-[#8c1d1d] hover:bg-[#a62424] px-5 py-3 text-sm font-black text-[#fffdf7] shadow-sm transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        title="Quét và tải 20 bài viết mới nhất từ Báo Mới (Quảng Bình)"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin text-amber-300" />
            <span>Đang cào tin từ Báo Mới...</span>
          </>
        ) : (
          <>
            <DownloadCloud className="size-4 text-amber-300" />
            <span>Cập nhật tin từ Báo Mới</span>
          </>
        )}
      </button>
    </div>
  );
}
