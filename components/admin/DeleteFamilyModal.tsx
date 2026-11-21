"use client";

import { AdminFamilyRow } from "@/components/AdminFamilyDashboard";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface DeleteFamilyModalProps {
  family: AdminFamilyRow | null;
  isOpen: boolean;
  isDeleting: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onConfirm: (family: AdminFamilyRow, confirmationName: string) => void;
}

export default function DeleteFamilyModal({
  family,
  isOpen,
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}: DeleteFamilyModalProps) {
  const [confirmationInput, setConfirmationInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setConfirmationInput("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !family) return null;

  const isMatched = confirmationInput.trim() === family.name.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMatched && !isDeleting) {
      onConfirm(family, confirmationInput.trim());
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-stone-900/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-stone-900">
                Xóa dòng họ vĩnh viễn
              </h3>
              <p className="text-xs font-semibold text-stone-500">
                Hành động nguy hiểm không thể hoàn tác
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 disabled:opacity-50"
            title="Đóng"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3 rounded-2xl bg-red-50/70 p-4 border border-red-200">
          <p className="text-sm font-bold text-red-950">
            Bạn đang chuẩn bị xóa dòng họ:{" "}
            <span className="font-black text-red-600 underline">
              {family.name}
            </span>{" "}
            <span className="text-xs font-semibold text-stone-500">
              (/{family.slug})
            </span>
          </p>
          <p className="text-xs font-medium leading-relaxed text-red-800">
            Toàn bộ dữ liệu thành viên ({family.person_count || 0} hồ sơ), cây gia phả,
            bài viết, sự kiện, yêu cầu và tư cách thành viên thuộc dòng họ này sẽ bị xóa
            hoàn toàn khỏi cơ sở dữ liệu.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-xl bg-red-100 p-3 text-xs font-bold text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Để xác nhận, vui lòng nhập chính xác tên dòng họ:{" "}
              <span className="font-black text-stone-950 select-all">
                {family.name}
              </span>
            </label>
            <input
              type="text"
              autoFocus
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              disabled={isDeleting}
              placeholder={family.name}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={!isMatched || isDeleting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-200 disabled:shadow-none"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Đang xóa...</span>
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  <span>Xác nhận xóa dòng họ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
