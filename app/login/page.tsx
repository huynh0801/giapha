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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5e7c7] text-[#2c1a11] selection:bg-[#8c1d1d] selection:text-white relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* HỌA TIẾT TRANG TRÍ NỀN (BACKGROUND DECOR) */}
      {/* 1. Vân chấm truyền thống toàn màn hình */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(#deb887_1.2px,transparent_1.2px)] [background-size:24px_24px] z-0"
      />

      {/* 2. Ánh hào quang cổ kính trung tâm */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#deb887]/25 blur-3xl z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 right-1/4 w-[400px] h-[400px] rounded-full bg-[#8c1d1d]/10 blur-3xl z-0"
      />

      {/* 3. Họa tiết decorate2 góc trên bên trái */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-6 -left-8 sm:-top-8 sm:-left-4 lg:top-0 lg:left-0 w-52 sm:w-80 lg:w-[440px] aspect-[607/411] opacity-65 sm:opacity-80 lg:opacity-90 z-0"
      >
        <Image
          src="/images/landing/decorate2.png"
          alt="Họa tiết góc trái"
          fill
          priority
          sizes="(max-width: 640px) 208px, (max-width: 1024px) 320px, 440px"
          className="object-contain object-left-top"
        />
      </div>

      {/* 4. Họa tiết decorate1 góc dưới bên phải */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-6 -right-8 sm:-bottom-8 sm:-right-4 lg:bottom-0 lg:right-0 w-52 sm:w-80 lg:w-[440px] aspect-[605/412] opacity-65 sm:opacity-80 lg:opacity-90 z-0"
      >
        <Image
          src="/images/landing/decorate1.png"
          alt="Họa tiết góc phải"
          fill
          priority
          sizes="(max-width: 640px) 208px, (max-width: 1024px) 320px, 440px"
          className="object-contain object-right-bottom"
        />
      </div>

      {/* 5. Họa tiết decorate1 nhẹ góc trên bên phải (phụ) */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-8 -right-8 w-44 sm:w-64 aspect-[605/412] opacity-25 sm:opacity-35 z-0 hidden sm:block"
      >
        <Image
          src="/images/landing/decorate1.png"
          alt=""
          fill
          sizes="256px"
          className="object-contain object-right-top"
        />
      </div>

      {/* 6. Họa tiết decorate2 nhẹ góc dưới bên trái (phụ) */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-8 -left-8 w-44 sm:w-64 aspect-[607/411] opacity-25 sm:opacity-35 z-0 hidden sm:block"
      >
        <Image
          src="/images/landing/decorate2.png"
          alt=""
          fill
          sizes="256px"
          className="object-contain object-left-bottom"
        />
      </div>

      {/* Nút quay về trang chủ */}
      <Link
        href="/"
        className="fixed top-4 left-4 sm:top-5 sm:left-5 z-30 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#deb887] bg-white/90 backdrop-blur-md text-xs font-bold text-[#8c1d1d] shadow-sm hover:bg-[#8c1d1d] hover:text-white transition-all duration-300"
      >
        <ArrowLeft className="size-4" />
        <span>Về trang chủ</span>
      </Link>

      {/* KHỐI NỘI DUNG CHÍNH (CĂN GIỮA) */}
      <div className="relative z-10 w-full max-w-md my-auto pt-10 sm:pt-6">
        {/* Header thương hiệu: Logo & Câu đối di sản */}
        <div className="text-center mb-5 sm:mb-6">
          <Link href="/" className="inline-block group">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#fffdf7] border-2 border-[#deb887] shadow-md shadow-[#deb887]/20 group-hover:scale-105 transition-transform duration-300">
              <div className="relative size-12 sm:size-14">
                <Image
                  src="/images/landing/logo.png"
                  alt="Logo Gia Phả Dòng Họ"
                  fill
                  sizes="56px"
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </Link>

          <h1
            className="text-2xl sm:text-3xl font-black text-[#183b28] uppercase tracking-wide mt-2.5"
            style={{
              fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
            }}
          >
            GIA PHẢ DÒNG HỌ
          </h1>

          {/* Câu đối cổ truyền */}
          <p className="mt-1 text-xs sm:text-[13px] font-serif italic text-[#7a6455] leading-relaxed max-w-sm mx-auto">
            &ldquo;Cây có cội mới trổ cành xanh ngọn,
            <br className="hidden sm:inline" /> Nước có nguồn mới tỏa nhánh muôn phương.&rdquo;
          </p>
        </div>

        {/* Khung viền chính của Form (Khung Chỉ Kép Di Sản) */}
        <div className="rounded-3xl border-2 border-[#deb887] bg-[#fffdf7]/95 backdrop-blur-md p-6 sm:p-8 shadow-[0_20px_60px_rgba(44,26,17,0.12)] relative">
          {/* Trang trí 4 góc truyền thống */}
          <div className="absolute top-2.5 left-2.5 size-3.5 border-t-2 border-l-2 border-[#8c1d1d]" />
          <div className="absolute top-2.5 right-2.5 size-3.5 border-t-2 border-r-2 border-[#8c1d1d]" />
          <div className="absolute bottom-2.5 left-2.5 size-3.5 border-b-2 border-l-2 border-[#8c1d1d]" />
          <div className="absolute bottom-2.5 right-2.5 size-3.5 border-b-2 border-r-2 border-[#8c1d1d]" />

          <div className="text-center mb-5">
            <span className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8c1d1d]">
              Cổng Thành Viên
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#183b28] mt-1 tracking-tight">
              {isLogin ? "Đăng Nhập Cội Nguồn" : "Đăng Ký Thành Viên"}
            </h2>
            <p className="text-xs text-[#5c4a3e] mt-1 leading-relaxed">
              {isLogin
                ? "Đăng nhập để vào không gian riêng tư và xem phả đồ dòng họ."
                : "Đăng ký tài khoản để gửi yêu cầu gia nhập vào gia phả."}
            </p>
          </div>

          {/* Thanh chuyển đổi Tab: Đăng Nhập ↔ Đăng Ký */}
          <div className="flex p-1 rounded-2xl bg-[#f5e7c7]/80 border border-[#deb887]/80 mb-5">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black tracking-wide transition-all ${
                isLogin
                  ? "bg-[#8c1d1d] text-white shadow-md shadow-[#8c1d1d]/20"
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
              className={`flex-1 py-2 rounded-xl text-xs font-black tracking-wide transition-all ${
                !isLogin
                  ? "bg-[#8c1d1d] text-white shadow-md shadow-[#8c1d1d]/20"
                  : "text-[#5c4a3e] hover:text-[#8c1d1d]"
              }`}
            >
              Đăng Ký Mới
            </button>
          </div>

          {/* Thông báo Demo */}
          {isDemo && (
            <div className="mb-4 p-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold">
              Tài khoản dùng thử Demo: <span className="font-mono">giaphaos@homielab.com</span> / <span className="font-mono">giaphaos</span>
            </div>
          )}

          {/* Thông báo Lỗi */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl border border-red-300 bg-red-50 text-red-800 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Thông báo Thành công */}
          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Biểu mẫu Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email-address"
                className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5"
              >
                Địa Chỉ Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8c6b54]" />
                <input
                  id="email-address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tenban@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-[#deb887]/70 bg-white text-sm text-[#2c1a11] placeholder:text-[#8c6b54]/60 outline-none focus:border-[#8c1d1d] focus:ring-2 focus:ring-[#8c1d1d]/15 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5"
              >
                Mật Khẩu
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8c6b54]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-xl border-2 border-[#deb887]/70 bg-white text-sm text-[#2c1a11] placeholder:text-[#8c6b54]/60 outline-none focus:border-[#8c1d1d] focus:ring-2 focus:ring-[#8c1d1d]/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c6b54] hover:text-[#8c1d1d] transition-colors p-1"
                  tabIndex={-1}
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5"
                >
                  Xác Nhận Mật Khẩu
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8c6b54]" />
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-xl border-2 border-[#deb887]/70 bg-white text-sm text-[#2c1a11] placeholder:text-[#8c6b54]/60 outline-none focus:border-[#8c1d1d] focus:ring-2 focus:ring-[#8c1d1d]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c6b54] hover:text-[#8c1d1d] transition-colors p-1"
                    tabIndex={-1}
                    title={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-6 rounded-xl bg-[#8c1d1d] hover:bg-[#6e1616] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#8c1d1d]/25 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && (
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{isLogin ? "Đăng Nhập Cội Nguồn" : "Đăng Ký Tài Khoản"}</span>
            </button>
          </form>

          {/* Chân form: Link phụ sang Admin Login */}
          <div className="mt-5 pt-4 border-t border-[#deb887]/40 text-center">
            <Link
              href="/admin/login"
              className="text-xs text-[#8c6b54] hover:text-[#8c1d1d] font-semibold transition-colors"
            >
              Bạn là Quản trị viên hệ thống? Đăng nhập tại đây →
            </Link>
          </div>
        </div>

        {/* Chân trang di sản */}
        <div className="mt-6 text-center text-xs text-[#8c6b54]/80">
          <p>© 2026 {config.siteName} — Bản quyền Di Sản Dòng Họ</p>
        </div>
      </div>
    </div>
  );
}
