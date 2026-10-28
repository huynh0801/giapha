"use client";

import config from "@/app/config";
import { loginAction, signUpAction } from "@/app/actions/auth";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function explainAuthError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Không thể kết nối dịch vụ xác thực.";

  if (
    message.includes("fetch") ||
    message.includes("NetworkError") ||
    message.includes("Failed to fetch")
  ) {
    return "Không kết nối được dịch vụ xác thực. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.";
  }

  return message;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname === config.demoDomain) {
        const timeoutId = window.setTimeout(() => {
          setIsDemo(true);
          setEmail("giaphaos@homielab.com");
          setPassword("giaphaos");
        }, 0);

        return () => window.clearTimeout(timeoutId);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isLogin) {
        const nextParam =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("next")
            : null;

        const result = await loginAction({
          email,
          password,
          nextPath: nextParam || undefined,
        });

        if (!result.success) {
          if (
            process.env.NODE_ENV !== "production" &&
            result.error?.includes("relation") &&
            result.error?.includes("does not exist")
          ) {
            router.push("/setup");
            return;
          }
          setError(result.error || "Không thể đăng nhập.");
        } else {
          window.location.href = result.redirect || "/";
        }
      } else {
        if (password !== confirmPassword) {
          setError("Mật khẩu xác nhận không khớp.");
          setLoading(false);
          return;
        }

        const result = await signUpAction({ email, password, confirmPassword });
        if (!result.success) {
          setError(result.error || "Không thể đăng ký.");
        } else if (result.redirect) {
          router.push(result.redirect);
          router.refresh();
        } else {
          setSuccessMessage(
            result.message || "Đăng ký thành công! Bạn có thể đăng nhập để xem gia phả.",
          );
          setIsLogin(true);
          setConfirmPassword("");
          setPassword("");
        }
      }
    } catch (err) {
      setError(explainAuthError(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen w-full flex flex-col items-center justify-center bg-[#f5e7c7] text-[#2c1a11] selection:bg-[#8c1d1d] selection:text-white relative overflow-hidden p-3 sm:p-4">
      {/* HỌA TIẾT TRANG TRÍ NỀN (BACKGROUND DECOR) */}
      {/* 1. Vân chấm truyền thống toàn màn hình */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(#deb887_1.2px,transparent_1.2px)] [background-size:24px_24px] z-0"
      />

      {/* 2. Ánh hào quang cổ kính trung tâm */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[#deb887]/25 blur-3xl z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-6 right-1/4 w-[350px] h-[350px] rounded-full bg-[#8c1d1d]/10 blur-3xl z-0"
      />

      {/* 3. Họa tiết decorate2 góc trên bên trái */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-6 -left-8 sm:-top-6 sm:-left-4 lg:top-0 lg:left-0 w-44 sm:w-64 lg:w-[380px] aspect-[607/411] opacity-65 sm:opacity-80 lg:opacity-90 z-0"
      >
        <Image
          src="/images/landing/decorate2.png"
          alt="Họa tiết góc trái"
          fill
          priority
          sizes="(max-width: 640px) 176px, (max-width: 1024px) 256px, 380px"
          className="object-contain object-left-top"
        />
      </div>

      {/* 4. Họa tiết decorate1 góc dưới bên phải */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-6 -right-8 sm:-bottom-6 sm:-right-4 lg:bottom-0 lg:right-0 w-44 sm:w-64 lg:w-[380px] aspect-[605/412] opacity-65 sm:opacity-80 lg:opacity-90 z-0"
      >
        <Image
          src="/images/landing/decorate1.png"
          alt="Họa tiết góc phải"
          fill
          priority
          sizes="(max-width: 640px) 176px, (max-width: 1024px) 256px, 380px"
          className="object-contain object-right-bottom"
        />
      </div>

      {/* 5. Họa tiết decorate1 nhẹ góc trên bên phải (phụ) */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-6 -right-6 w-36 sm:w-52 aspect-[605/412] opacity-25 sm:opacity-35 z-0 hidden sm:block"
      >
        <Image
          src="/images/landing/decorate1.png"
          alt=""
          fill
          sizes="208px"
          className="object-contain object-right-top"
        />
      </div>

      {/* 6. Họa tiết decorate2 nhẹ góc dưới bên trái (phụ) */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-6 -left-6 w-36 sm:w-52 aspect-[607/411] opacity-25 sm:opacity-35 z-0 hidden sm:block"
      >
        <Image
          src="/images/landing/decorate2.png"
          alt=""
          fill
          sizes="208px"
          className="object-contain object-left-bottom"
        />
      </div>

      {/* Nút quay về trang chủ */}
      <Link
        href="/"
        className="fixed top-3 left-3 sm:top-4 sm:left-4 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#deb887] bg-white/90 backdrop-blur-md text-xs font-bold text-[#8c1d1d] shadow-xs hover:bg-[#8c1d1d] hover:text-white transition-all duration-300"
      >
        <ArrowLeft className="size-3.5" />
        <span>Về trang chủ</span>
      </Link>

      {/* KHỐI NỘI DUNG CHÍNH (CĂN GIỮA, GỌN GÀNG, KHÔNG CUỘN) */}
      <div className="relative z-10 w-full max-w-[420px] flex flex-col justify-center my-auto">
        {/* Header thương hiệu: Logo & Câu đối di sản */}
        <div className="text-center mb-2.5 sm:mb-3">
          <Link href="/" className="inline-block group mb-1">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-[#fffdf7] border-2 border-[#deb887] shadow-sm group-hover:scale-105 transition-transform duration-300">
              <div className="relative size-7 sm:size-8">
                <Image
                  src="/images/landing/logo.png"
                  alt="Logo Gia Phả Dòng Họ"
                  fill
                  sizes="32px"
                  priority
                  className="object-contain"
                />
              </div>
              <span
                className="text-base sm:text-lg font-black text-[#183b28] uppercase tracking-wider"
                style={{
                  fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                }}
              >
                Gia Phả Dòng Họ
              </span>
            </div>
          </Link>

          {/* Câu đối cổ truyền */}
          <p className="text-[11px] sm:text-xs font-serif italic text-[#7a6455] leading-tight">
            &ldquo;Cây có cội mới trổ cành xanh ngọn, Nước có nguồn mới tỏa nhánh muôn phương.&rdquo;
          </p>
        </div>

        {/* Khung viền chính của Form (Khung Chỉ Kép Di Sản) */}
        <div className="rounded-2xl sm:rounded-3xl border-2 border-[#deb887] bg-[#fffdf7]/95 backdrop-blur-md p-4 sm:p-6 shadow-[0_15px_40px_rgba(44,26,17,0.10)] relative">
          {/* Trang trí 4 góc truyền thống */}
          <div className="absolute top-2 left-2 size-3 border-t-2 border-l-2 border-[#8c1d1d]" />
          <div className="absolute top-2 right-2 size-3 border-t-2 border-r-2 border-[#8c1d1d]" />
          <div className="absolute bottom-2 left-2 size-3 border-b-2 border-l-2 border-[#8c1d1d]" />
          <div className="absolute bottom-2 right-2 size-3 border-b-2 border-r-2 border-[#8c1d1d]" />

          <div className="text-center mb-3">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8c1d1d]">
              Cổng Thành Viên
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#183b28] mt-0.5 tracking-tight">
              {isLogin ? "Đăng Nhập Cội Nguồn" : "Đăng Ký Thành Viên"}
            </h2>
          </div>

          {/* Thanh chuyển đổi Tab: Đăng Nhập ↔ Đăng Ký */}
          <div className="flex p-0.5 rounded-xl bg-[#f5e7c7]/80 border border-[#deb887]/80 mb-3.5">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black tracking-wide transition-all ${
                isLogin
                  ? "bg-[#8c1d1d] text-white shadow-xs shadow-[#8c1d1d]/20"
                  : "text-[#5c4a3e] hover:text-[#8c1d1d]"
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black tracking-wide transition-all ${
                !isLogin
                  ? "bg-[#8c1d1d] text-white shadow-xs shadow-[#8c1d1d]/20"
                  : "text-[#5c4a3e] hover:text-[#8c1d1d]"
              }`}
            >
              Đăng Ký Mới
            </button>
          </div>

          {/* Thông báo Demo */}
          {isDemo && (
            <div className="mb-3 p-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-[11px] font-semibold">
              Tài khoản Demo: <span className="font-mono">giaphaos@homielab.com</span> / <span className="font-mono">giaphaos</span>
            </div>
          )}

          {/* Thông báo Lỗi */}
          {error && (
            <div className="mb-3 p-2.5 rounded-lg border border-red-300 bg-red-50 text-red-800 text-[11px] font-medium">
              {error}
            </div>
          )}

          {/* Thông báo Thành công */}
          {successMessage && (
            <div className="mb-3 p-2.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 text-[11px] font-medium flex items-center gap-2">
              <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Biểu mẫu Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="email-address"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#5c4a3e] mb-1"
              >
                Địa Chỉ Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#8c6b54]" />
                <input
                  id="email-address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tenban@gmail.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-[#deb887]/70 bg-white text-xs sm:text-sm text-[#2c1a11] placeholder:text-[#8c6b54]/60 outline-none focus:border-[#8c1d1d] focus:ring-1 focus:ring-[#8c1d1d]/15 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#5c4a3e] mb-1"
              >
                Mật Khẩu
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#8c6b54]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 rounded-xl border-2 border-[#deb887]/70 bg-white text-xs sm:text-sm text-[#2c1a11] placeholder:text-[#8c6b54]/60 outline-none focus:border-[#8c1d1d] focus:ring-1 focus:ring-[#8c1d1d]/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c6b54] hover:text-[#8c1d1d] transition-colors p-1"
                  tabIndex={-1}
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-[11px] font-bold uppercase tracking-wider text-[#5c4a3e] mb-1"
                >
                  Xác Nhận Mật Khẩu
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#8c6b54]" />
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 rounded-xl border-2 border-[#deb887]/70 bg-white text-xs sm:text-sm text-[#2c1a11] placeholder:text-[#8c6b54]/60 outline-none focus:border-[#8c1d1d] focus:ring-1 focus:ring-[#8c1d1d]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c6b54] hover:text-[#8c1d1d] transition-colors p-1"
                    tabIndex={-1}
                    title={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showConfirmPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1.5 py-2.5 px-5 rounded-xl bg-[#8c1d1d] hover:bg-[#6e1616] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-[#8c1d1d]/25 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && (
                <div className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{isLogin ? "Đăng Nhập Cội Nguồn" : "Đăng Ký Tài Khoản"}</span>
            </button>
          </form>

          {/* Chân form: Link phụ sang Admin Login */}
          <div className="mt-3.5 pt-2.5 border-t border-[#deb887]/40 text-center">
            <Link
              href="/admin/login"
              className="text-[11px] sm:text-xs text-[#8c6b54] hover:text-[#8c1d1d] font-semibold transition-colors"
            >
              Bạn là Quản trị viên hệ thống? Đăng nhập tại đây →
            </Link>
          </div>
        </div>

        {/* Chân trang di sản */}
        <div className="mt-2 text-center text-[10px] sm:text-[11px] text-[#8c6b54]/80">
          <p>© 2026 {config.siteName} — Bản quyền Di Sản Dòng Họ</p>
        </div>
      </div>
    </div>
  );
}
