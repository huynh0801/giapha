"use client";

import { useState, useTransition } from "react";
import { requestFamilyCreationAction } from "@/app/actions/family-request";
import {
  Building2,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Phone,
  ScrollText,
  X,
  PlusCircle,
} from "lucide-react";
import Image from "next/image";

export default function CreateFamilyRequestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước ảnh không được vượt quá 5MB.");
        return;
      }
      setLogoPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await requestFamilyCreationAction({ success: false }, formData);
      if (!result.success) {
        setError(result.error || "Không thể gửi yêu cầu.");
      } else {
        setIsOpen(false);
        setLogoPreview(null);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8c1d1d] hover:bg-[#6e1616] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
      >
        <PlusCircle className="size-4" />
        <span>Xin Tạo Dòng Họ Mới</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border-2 border-[#deb887] bg-[#fffdf7] p-6 sm:p-8 shadow-2xl my-auto">
            {/* Nút đóng */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#8c6b54] hover:bg-[#deb887]/20 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {/* Header modal */}
            <div className="text-center mb-6">
              <span className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8c1d1d]">
                Khởi Tạo Cội Nguồn
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#183b28] mt-1">
                Đăng Ký Tạo Gia Tộc Mới
              </h2>
              <p className="text-xs text-[#5c4a3e] mt-1 leading-relaxed">
                Điền thông tin dòng họ của bạn để gửi Ban Quản Trị xét duyệt và cấp không gian gia phả.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl border border-red-300 bg-red-50 text-red-800 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5">
                  Tên Dòng Họ <span className="text-[#8c1d1d]">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8c6b54]" />
                  <input
                    name="family_name"
                    required
                    placeholder="Ví dụ: Họ Nguyễn Đại Tộc, Họ Trần Chi 3"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#deb887] bg-white text-sm outline-none focus:border-[#8c1d1d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5">
                  Số Điện Thoại Liên Hệ <span className="text-[#8c1d1d]">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8c6b54]" />
                  <input
                    name="phone_contact"
                    required
                    type="tel"
                    placeholder="Ví dụ: 0912345678 (Dùng để Admin xác minh)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#deb887] bg-white text-sm outline-none focus:border-[#8c1d1d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5">
                  Quê Quán / Nguyên Quán
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8c6b54]" />
                  <input
                    name="origin_location"
                    placeholder="Ví dụ: Nam Sách, Hải Dương"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#deb887] bg-white text-sm outline-none focus:border-[#8c1d1d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5">
                  Mô Tả Sơ Lược / Lời Nhắn
                </label>
                <div className="relative">
                  <ScrollText className="absolute left-3.5 top-3 size-4 text-[#8c6b54]" />
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Giới thiệu sơ lược về thủy tổ, chi phái hoặc lý do xin lập gia tộc..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#deb887] bg-white text-sm outline-none focus:border-[#8c1d1d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5">
                  Logo / Ảnh Đại Diện Dòng Họ (Tùy chọn)
                </label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative size-14 rounded-2xl border-2 border-[#deb887] overflow-hidden bg-white shrink-0">
                      <Image src={logoPreview} alt="Logo preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="size-14 rounded-2xl border-2 border-dashed border-[#deb887] bg-white/60 flex items-center justify-center text-[#8c6b54] shrink-0">
                      <ImageIcon className="size-6 opacity-60" />
                    </div>
                  )}
                  <input
                    type="file"
                    name="logo_file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="text-xs text-[#5c4a3e] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#deb887]/30 file:text-[#8c1d1d] hover:file:bg-[#deb887]/50 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#deb887] bg-white text-xs font-bold text-[#5c4a3e] hover:bg-[#f5e7c7] transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl bg-[#8c1d1d] hover:bg-[#6e1616] text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                  <span>Gửi Yêu Cầu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
