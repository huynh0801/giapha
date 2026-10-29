"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5e7c7] p-4 text-[#2c1a11]">
      <div className="relative w-full max-w-md rounded-2xl border-2 border-[#deb887] bg-[#fffdf7] p-6 sm:p-8 shadow-xl text-center">
        {/* 4 Traditional Corner Brackets */}
        <span className="pointer-events-none absolute top-2 left-2 size-3 border-t-2 border-l-2 border-[#8c1d1d]" />
        <span className="pointer-events-none absolute top-2 right-2 size-3 border-t-2 border-r-2 border-[#8c1d1d]" />
        <span className="pointer-events-none absolute bottom-2 left-2 size-3 border-b-2 border-l-2 border-[#8c1d1d]" />
        <span className="pointer-events-none absolute bottom-2 right-2 size-3 border-b-2 border-r-2 border-[#8c1d1d]" />

        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#8c1d1d]/10 text-[#8c1d1d] mb-4">
          <AlertTriangle className="size-7" />
        </div>

        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8c1d1d]">
          Thông Báo Hệ Thống
        </span>
        <h2 className="mt-1 text-xl sm:text-2xl font-black text-[#183b28] tracking-tight">
          Không Thể Tải Trang
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#6a594d] leading-relaxed">
          Đã xảy ra sự cố trong quá trình kết nối hoặc đồng bộ dữ liệu phiên làm việc.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              } else {
                reset();
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#8c1d1d] hover:bg-[#a62424] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="size-4" />
            <span>Tải lại trang</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#deb887] bg-white text-[#183b28] hover:bg-[#f5e7c7] font-bold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <Home className="size-4" />
            <span>Về trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
