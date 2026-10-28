"use client";

import config from "@/app/config";
import { adminLoginAction } from "@/app/actions/auth";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Crown,
  Database,
  Lock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function explainAuthError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Không thể đăng nhập.";

  if (
    message.includes("fetch") ||
    message.includes("NetworkError") ||
    message.includes("Failed to fetch")
  ) {
    return "Không kết nối được dịch vụ xác thực. Vui lòng kiểm tra lại cấu hình.";
  }

  return message;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const nextParam = new URLSearchParams(window.location.search).get("next");
      const result = await adminLoginAction({
        email,
        password,
        nextPath: nextParam || undefined,
      });

      if (!result.success) {
        setError(result.error || "Không thể đăng nhập.");
        setLoading(false);
        return;
      }

      window.location.href = result.redirect || "/admin";
    } catch (authError) {
      setError(explainAuthError(authError));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f5e7c7] text-[#2c1a11] selection:bg-[#8c1d1d] selection:text-white relative overflow-hidden">
      {/* Nút quay về trang chủ */}
      <Link
        href="/"
        className="fixed top-5 left-5 z-30 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#deb887] bg-white/90 backdrop-blur-md text-xs font-bold text-[#8c1d1d] shadow-sm hover:bg-[#8c1d1d] hover:text-white transition-all duration-300"
      >
        <ArrowLeft className="size-4" />
        <span>Về trang chủ</span>
      </Link>

      <div className="flex-1 flex w-full min-h-screen">
        {/* CỘT TRÁI: Khu vực quyền uy quản trị tối cao (Ẩn trên mobile, hiện trên lg) */}
        <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative bg-[#183b28] text-[#f5e7c7] p-12 flex-col justify-between overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#caa455_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#caa455]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#8c1d1d]/20 blur-3xl pointer-events-none" />

          {/* Phần trên: Logo & Quyền uy */}
          <div className="relative z-10 pt-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#caa455]/40 bg-black/25 backdrop-blur-sm mb-6">
              <div className="relative size-7">
                <Image
                  src="/images/landing/logo.png"
                  alt="Logo Quản Trị"
                  fill
                  sizes="28px"
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.22em] text-[#caa455]">
                Cổng Quản Trị Hệ Thống
              </span>
            </div>

            <h1
              className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-wide"
              style={{
                fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
              }}
            >
              Điều Hành Dữ Liệu Gia Tộc Toàn Quốc
            </h1>

            <p className="mt-5 text-sm xl:text-base text-[#f5e7c7]/90 leading-relaxed max-w-md">
              Khu vực dành riêng cho Super Admin quản lý dòng họ, phân quyền tài khoản, đăng tin tức toàn hệ thống và giám sát kho lưu trữ Cloudflare R2.
            </p>
          </div>

          {/* Phần giữa: Cam kết an toàn & bảo mật */}
          <div className="relative z-10 my-8 space-y-4 max-w-md">
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="p-2 rounded-lg bg-[#caa455]/20 text-[#caa455]">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Xác Thực Quản Trị Cấp Cao</h3>
                <p className="text-xs text-[#f5e7c7]/80 mt-0.5">
                  Kiểm soát phiên đăng nhập nghiêm ngặt, tự động bảo vệ dữ liệu nhạy cảm của các dòng họ.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="p-2 rounded-lg bg-[#caa455]/20 text-[#caa455]">
                <Database className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Kiến Trúc Đa Khách Hàng</h3>
                <p className="text-xs text-[#f5e7c7]/80 mt-0.5">
                  Phân tách dữ liệu triệt để giữa các dòng họ độc lập, ngăn ngừa rò rỉ thông tin cá nhân.
                </p>
              </div>
            </div>
          </div>

          {/* Chân trang cột trái */}
          <div className="relative z-10 pt-4 border-t border-[#caa455]/20 text-xs text-[#caa455]/80 flex items-center justify-between">
            <span>© 2026 {config.siteName}</span>
            <span>Hệ Thống Quản Trị Trung Ương</span>
          </div>
        </div>

        {/* CỘT PHẢI: Form Đăng Nhập Admin */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12 relative z-10">
          <div className="w-full max-w-md">
            {/* Header Form trên mobile */}
            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white border border-[#deb887] shadow-sm mb-3">
                <Crown className="size-8 text-[#8c1d1d]" />
              </div>
              <h2 className="text-xl font-black text-[#183b28] uppercase tracking-wide">
                CỔNG QUẢN TRỊ HỆ THỐNG
              </h2>
            </div>

            {/* Khung viền chính của Form */}
            <div className="rounded-3xl border-2 border-[#deb887] bg-[#fffdf7] p-6 sm:p-8 shadow-[0_20px_50px_rgba(44,26,17,0.08)] relative">
              {/* 4 góc hoàng gia */}
              <div className="absolute top-2 left-2 size-3 border-t-2 border-l-2 border-[#183b28]" />
              <div className="absolute top-2 right-2 size-3 border-t-2 border-r-2 border-[#183b28]" />
              <div className="absolute bottom-2 left-2 size-3 border-b-2 border-l-2 border-[#183b28]" />
              <div className="absolute bottom-2 right-2 size-3 border-b-2 border-r-2 border-[#183b28]" />

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183b28]/10 text-[#183b28] text-[11px] font-black uppercase tracking-[0.2em] mb-2">
                  <Lock className="size-3" />
                  Khu vực hạn chế
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#183b28] tracking-tight">
                  Đăng nhập admin
                </h1>
                <p className="text-xs text-[#5c4a3e] mt-1.5 leading-relaxed">
                  Tài khoản thành viên thông thường không thể truy cập khu vực này.
                </p>
              </div>

              {/* Thông báo Lỗi */}
              {error && (
                <div className="mb-4 p-3.5 rounded-xl border border-red-300 bg-red-50 text-red-800 text-xs font-medium flex items-center gap-2">
                  <ShieldAlert className="size-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Biểu mẫu Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5">
                    Email Quản Trị
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8c6b54]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@gmail.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#deb887]/70 bg-white text-sm text-[#2c1a11] placeholder:text-[#8c6b54]/60 outline-none focus:border-[#183b28] focus:ring-2 focus:ring-[#183b28]/15 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5">
                    Mật Khẩu Quản Trị
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8c6b54]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 rounded-xl border-2 border-[#deb887]/70 bg-white text-sm text-[#2c1a11] placeholder:text-[#8c6b54]/60 outline-none focus:border-[#183b28] focus:ring-2 focus:ring-[#183b28]/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c6b54] hover:text-[#183b28] transition-colors p-1"
                      tabIndex={-1}
                      title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#183b28] hover:bg-[#122e1f] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#183b28]/25 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading && <Loader2 className="size-4 animate-spin text-[#caa455]" />}
                  <span>Đăng nhập quản trị</span>
                </button>
              </form>

              {/* Chân form */}
              <div className="mt-6 pt-4 border-t border-[#deb887]/40 text-center">
                <Link
                  href="/login"
                  className="text-xs text-[#8c6b54] hover:text-[#8c1d1d] font-semibold transition-colors"
                >
                  ← Chuyển sang Cổng đăng nhập Thành viên
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
