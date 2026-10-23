"use client";

import config from "@/app/config";
import { adminLoginAction } from "@/app/actions/auth";
import {
  ArrowLeft,
  KeyRound,
  Loader2,
  Mail,
  Newspaper,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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
    return "Không kết nối được Supabase Auth. Hãy kiểm tra NEXT_PUBLIC_SUPABASE_URL, Publishable key trong .env.local rồi restart npm run dev.";
  }

  return message;
}

function getSafeAdminRedirect(nextPath: string | null) {
  if (
    !nextPath ||
    !nextPath.startsWith("/admin") ||
    nextPath.startsWith("/admin/login") ||
    nextPath.startsWith("//") ||
    nextPath.includes("://")
  ) {
    return "/admin";
  }

  return nextPath;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      router.push(result.redirect || "/admin");
      router.refresh();
    } catch (authError) {
      setError(explainAuthError(authError));
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-stone-950 antialiased">
      <Link
        href="/"
        className="fixed left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-stone-600 shadow-sm transition-colors hover:text-[#800000]"
      >
        <ArrowLeft className="size-4" />
        Trang chủ
      </Link>

      <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,460px)] lg:px-8">
        <div className="hidden lg:block">
          <div className="mb-8 inline-flex size-16 items-center justify-center rounded-[22px] bg-white text-[#800000] shadow-sm">
            <Newspaper className="size-8" />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b56a10]">
            Khu vực quản trị
          </p>
          <h1 className="mt-5 max-w-2xl text-6xl font-black leading-[0.95] tracking-tight text-[#800000]">
            Quản lý hệ thống gia phả
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
            Đăng nhập bằng tài khoản Super Admin để tạo dòng họ, quản lý tài
            khoản, đăng bài hệ thống và kiểm soát dữ liệu vận hành.
          </p>
        </div>

        <div className="w-full rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(58,31,19,0.12)] sm:p-8">
          <div className="mb-8">
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-[#b56a10]">
              <ShieldCheck className="size-7" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-amber-600">
              {config.siteName}
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-stone-950">
              Đăng nhập admin
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Tài khoản thường không vào được khu vực quản trị hệ thống.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl bg-stone-50 py-3.5 pl-12 pr-4 text-stone-900 outline-none transition-all focus:bg-white focus:shadow-[0_0_0_3px_rgba(245,158,11,0.18)]"
                  placeholder="admin@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                Mật khẩu
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl bg-stone-50 py-3.5 pl-12 pr-4 text-stone-900 outline-none transition-all focus:bg-white focus:shadow-[0_0_0_3px_rgba(245,158,11,0.18)]"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-950 px-5 py-4 text-sm font-black uppercase tracking-wide text-white shadow-xl shadow-stone-900/10 transition-all hover:bg-stone-800 disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Đăng nhập quản trị
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
