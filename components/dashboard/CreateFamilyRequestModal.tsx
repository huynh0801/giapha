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
  LogIn,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  isLoggedIn?: boolean;
}

export default function CreateFamilyRequestModal({ isLoggedIn = false }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleButtonClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setIsOpen(true);
  };

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
        onClick={handleButtonClick}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8c1d1d] hover:bg-[#6e1616] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer shrink-0"
      >
        <PlusCircle className="size-4" />
        <span>Xin Tạo Dòng Họ Mới</span>
      </button>

      {/* Modal yêu cầu đăng nhập nếu chưa đăng nhập */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl border-2 border-[#deb887] bg-[#fffdf7] p-6 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#8c6b54] hover:bg-[#deb887]/20 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#8c1d1d]/10 text-[#8c1d1d] mb-3">
              <LogIn className="size-6" />
            </div>

            <h3 className="text-lg font-black text-[#183b28]">
              Yêu Cầu Đăng Nhập
            </h3>
            <p className="text-xs text-[#5c4a3e] mt-1.5 leading-relaxed">
              Bạn cần đăng nhập hoặc tạo tài khoản để có thể gửi đơn xin lập dòng họ và nhận quyền quản trị gia tộc.
            </p>

            <div className="flex gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="flex-1 py-2 rounded-xl border border-[#deb887] bg-white text-xs font-bold text-[#5c4a3e] hover:bg-[#f5e7c7] transition-all cursor-pointer"
              >
                Để sau
              </button>
              <button
                type="button"
                onClick={() => router.push("/login?next=/dashboard")}
                className="flex-1 py-2 rounded-xl bg-[#8c1d1d] hover:bg-[#6e1616] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <LogIn className="size-3.5" />
                <span>Đăng Nhập</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal form xin lập dòng họ (Bố cục 2 cột gọn gàng, không phải cuộn) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl border-2 border-[#deb887] bg-[#fffdf7] p-5 sm:p-6 shadow-2xl my-auto">
            {/* Nút đóng */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#8c6b54] hover:bg-[#deb887]/20 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {/* Header modal gọn gàng */}
            <div className="text-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8c1d1d]">
                Khởi Tạo Cội Nguồn
              </span>
              <h2 className="text-lg sm:text-xl font-black text-[#183b28] mt-0.5">
                Đăng Ký Tạo Gia Tộc Mới
              </h2>
              <p className="text-xs text-[#5c4a3e] mt-0.5">
                Gửi thông tin dòng họ của bạn để Ban Quản Trị xét duyệt và cấp không gian gia phả.
              </p>
            </div>

            {error && (
              <div className="mb-3 p-2.5 rounded-xl border border-red-300 bg-red-50 text-red-800 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Bố cục 2 cột không cần cuộn */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* CỘT 1: Thông tin liên hệ & danh xưng */}
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5c4a3e] mb-1">
                      Tên Dòng Họ <span className="text-[#8c1d1d]">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#8c6b54]" />
                      <input
                        name="family_name"
                        required
                        placeholder="Ví dụ: Họ Nguyễn Đại Tộc..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#deb887] bg-white text-xs sm:text-sm outline-none focus:border-[#8c1d1d]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5c4a3e] mb-1">
                      Số Điện Thoại Liên Hệ <span className="text-[#8c1d1d]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#8c6b54]" />
                      <input
                        name="phone_contact"
                        required
                        type="tel"
                        placeholder="Ví dụ: 0912345678"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#deb887] bg-white text-xs sm:text-sm outline-none focus:border-[#8c1d1d]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5c4a3e] mb-1">
                      Quê Quán / Nguyên Quán
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#8c6b54]" />
                      <input
                        name="origin_location"
                        placeholder="Ví dụ: Nam Sách, Hải Dương"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#deb887] bg-white text-xs sm:text-sm outline-none focus:border-[#8c1d1d]"
                      />
                    </div>
                  </div>
                </div>

                {/* CỘT 2: Mô tả & Logo */}
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5c4a3e] mb-1">
                      Mô Tả Sơ Lược / Lời Nhắn
                    </label>
                    <div className="relative">
                      <ScrollText className="absolute left-3 top-2.5 size-3.5 text-[#8c6b54]" />
                      <textarea
                        name="description"
                        rows={2}
                        placeholder="Giới thiệu sơ lược về thủy tổ, chi phái..."
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#deb887] bg-white text-xs sm:text-sm outline-none focus:border-[#8c1d1d]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5c4a3e] mb-1">
                      Logo / Ảnh Biểu Trưng (Tùy chọn)
                    </label>
                    <div className="flex items-center gap-3 p-2 rounded-xl border border-dashed border-[#deb887] bg-white/70">
                      {logoPreview ? (
                        <div className="relative size-11 rounded-lg border border-[#deb887] overflow-hidden bg-white shrink-0">
                          <Image src={logoPreview} alt="Logo preview" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="size-11 rounded-lg bg-[#deb887]/15 flex items-center justify-center text-[#8c6b54] shrink-0">
                          <ImageIcon className="size-5 opacity-70" />
                        </div>
                      )}
                      <input
                        type="file"
                        name="logo_file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="text-[11px] text-[#5c4a3e] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#deb887]/30 file:text-[#8c1d1d] hover:file:bg-[#deb887]/50 cursor-pointer w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hàng nút bấm dưới cùng */}
              <div className="flex gap-3 pt-3 border-t border-[#deb887]/40">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-[#deb887] bg-white text-xs font-bold text-[#5c4a3e] hover:bg-[#f5e7c7] transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2 rounded-xl bg-[#8c1d1d] hover:bg-[#6e1616] text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {isPending && <Loader2 className="size-3.5 animate-spin" />}
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
