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
  ShieldCheck,
  Sparkles,
  Users,
  ScrollText,
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
        {/* CỘT TRÁI: Hero Showcase Di Sản Cội Nguồn (Ẩn trên mobile, hiện trên lg) */}
        <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative bg-[#8c1d1d] text-[#f5e7c7] p-12 flex-col justify-between overflow-hidden shadow-2xl">
          {/* Họa tiết nền truyền thống */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#deb887_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#deb887]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#caa455]/20 blur-3xl pointer-events-none" />

          {/* Phần trên: Logo & Danh xưng */}
          <div className="relative z-10 pt-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#deb887]/40 bg-black/20 backdrop-blur-sm mb-6">
              <div className="relative size-7">
                <Image
                  src="/images/landing/logo.png"
                  alt="Logo Gia Phả Dòng Họ"
                  fill
                  sizes="28px"
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.22em] text-[#deb887]">
                Nền Tảng Gia Phả Việt Nam
              </span>
            </div>

            <h1
              className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-wide"
              style={{
                fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
              }}
            >
              Gìn Giữ Cội Nguồn, Kết Nối Muôn Phương
            </h1>

            {/* Câu đối cổ truyền */}
            <div className="mt-8 p-6 rounded-2xl border-l-4 border-[#deb887] bg-black/25 backdrop-blur-sm max-w-md">
              <p className="text-base xl:text-lg italic font-serif leading-relaxed text-[#f5e7c7]/95">
                &ldquo;Cây có cội mới trổ cành xanh ngọn,
                <br />
                Nước có nguồn mới tỏa nhánh muôn phương.&rdquo;
              </p>
              <span className="mt-2 block text-xs uppercase tracking-widest text-[#deb887] font-sans font-bold">
                — Lời răn tiền nhân
              </span>
            </div>
          </div>

          {/* Phần giữa: 3 giá trị di sản */}
          <div className="relative z-10 my-8 space-y-4 max-w-md">
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="p-2 rounded-lg bg-[#deb887]/20 text-[#deb887]">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Bảo Mật Tôn Nghiêm</h3>
                <p className="text-xs text-[#f5e7c7]/80 mt-0.5">
                  Dữ liệu phả hệ được bảo mật đa tầng, chỉ thành viên được xét duyệt mới có quyền tra cứu.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="p-2 rounded-lg bg-[#deb887]/20 text-[#deb887]">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Tra Cứu Danh Xưng Chuẩn Xác</h3>
                <p className="text-xs text-[#f5e7c7]/80 mt-0.5">
                  Tự động xác định tôn ti trật tự, thứ bậc xưng hô giữa hai người bất kỳ trong dòng họ.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="p-2 rounded-lg bg-[#deb887]/20 text-[#deb887]">
                <ScrollText className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Lưu Truyền Vạn Đời</h3>
                <p className="text-xs text-[#f5e7c7]/80 mt-0.5">
                  Phả đồ số hóa vĩnh cửu, tích hợp Cloudflare R2 lưu trữ hình ảnh và chứng thư gia phả.
                </p>
              </div>
            </div>
          </div>

          {/* Phần chân trang cột trái */}
          <div className="relative z-10 pt-4 border-t border-[#deb887]/20 text-xs text-[#deb887]/80 flex items-center justify-between">
            <span>© 2026 {config.siteName}</span>
            <span>Bản quyền Di Sản Dòng Họ</span>
          </div>
        </div>

        {/* CỘT PHẢI: Form Đăng Nhập & Đăng Ký */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12 relative z-10">
          <div className="w-full max-w-md">
            {/* Header Form trên mobile */}
            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white border border-[#deb887] shadow-sm mb-3">
                <div className="relative size-10">
                  <Image
                    src="/images/landing/logo.png"
                    alt="Logo Gia Phả"
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </div>
              </div>
              <h2 className="text-xl font-black text-[#183b28] uppercase tracking-wide">
                GIA PHẢ DÒNG HỌ
              </h2>
            </div>

            {/* Khung viền chính của Form */}
            <div className="rounded-3xl border-2 border-[#deb887] bg-[#fffdf7] p-6 sm:p-8 shadow-[0_20px_50px_rgba(44,26,17,0.08)] relative">
              {/* Trang trí 4 góc truyền thống */}
              <div className="absolute top-2 left-2 size-3 border-t-2 border-l-2 border-[#8c1d1d]" />
              <div className="absolute top-2 right-2 size-3 border-t-2 border-r-2 border-[#8c1d1d]" />
              <div className="absolute bottom-2 left-2 size-3 border-b-2 border-l-2 border-[#8c1d1d]" />
              <div className="absolute bottom-2 right-2 size-3 border-b-2 border-r-2 border-[#8c1d1d]" />

              <div className="text-center mb-6">
                <span className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8c1d1d]">
                  Cổng Thành Viên
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#183b28] mt-1 tracking-tight">
                  {isLogin ? "Đăng Nhập Cội Nguồn" : "Đăng Ký Thành Viên"}
                </h2>
                <p className="text-xs text-[#5c4a3e] mt-1.5 leading-relaxed">
                  {isLogin
                    ? "Đăng nhập để vào không gian riêng tư và xem phả đồ dòng họ."
                    : "Đăng ký tài khoản để gửi yêu cầu gia nhập vào gia phả."}
                </p>
              </div>

              {/* Thanh chuyển đổi Tab: Đăng Nhập ↔ Đăng Ký */}
              <div className="flex p-1 rounded-2xl bg-[#f5e7c7]/80 border border-[#deb887]/80 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all ${
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
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all ${
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
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#deb887]/70 bg-white text-sm text-[#2c1a11] placeholder:text-[#8c6b54]/60 outline-none focus:border-[#8c1d1d] focus:ring-2 focus:ring-[#8c1d1d]/15 transition-all"
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
                      className="w-full pl-10 pr-11 py-3 rounded-xl border-2 border-[#deb887]/70 bg-white text-sm text-[#2c1a11] placeholder:text-[#8c6b54]/60 outline-none focus:border-[#8c1d1d] focus:ring-2 focus:ring-[#8c1d1d]/15 transition-all"
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
                        className="w-full pl-10 pr-11 py-3 rounded-xl border-2 border-[#deb887]/70 bg-white text-sm text-[#2c1a11] placeholder:text-[#8c6b54]/60 outline-none focus:border-[#8c1d1d] focus:ring-2 focus:ring-[#8c1d1d]/15 transition-all"
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
                  className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#8c1d1d] hover:bg-[#6e1616] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#8c1d1d]/25 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading && (
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  <span>{isLogin ? "Đăng Nhập Cội Nguồn" : "Đăng Ký Tài Khoản"}</span>
                </button>
              </form>

              {/* Chân form: Link phụ */}
              <div className="mt-6 pt-4 border-t border-[#deb887]/40 text-center">
                <Link
                  href="/admin/login"
                  className="text-xs text-[#8c6b54] hover:text-[#8c1d1d] font-semibold transition-colors"
                >
                  Bạn là Quản trị viên hệ thống? Đăng nhập tại đây →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
