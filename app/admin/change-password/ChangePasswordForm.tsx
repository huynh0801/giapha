"use client";

import { changeOwnPassword } from "@/app/actions/user";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface ChangePasswordFormProps {
  forced: boolean;
}

export default function ChangePasswordForm({
  forced,
}: ChangePasswordFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await changeOwnPassword(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      setMessage("Đã đổi mật khẩu thành công.");
      window.setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 700);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!forced && (
        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400" />
            <input
              name="current_password"
              type="password"
              required={!forced}
              className="w-full rounded-2xl bg-stone-50 py-3.5 pl-12 pr-4 text-stone-900 outline-none transition-all focus:bg-white focus:shadow-[0_0_0_3px_rgba(217,119,6,0.16)]"
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
          Mật khẩu mới
        </label>
        <div className="relative">
          <KeyRound className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400" />
          <input
            name="new_password"
            type="password"
            required
            minLength={8}
            className="w-full rounded-2xl bg-stone-50 py-3.5 pl-12 pr-4 text-stone-900 outline-none transition-all focus:bg-white focus:shadow-[0_0_0_3px_rgba(217,119,6,0.16)]"
            placeholder="Tối thiểu 8 ký tự"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
          Xác nhận mật khẩu mới
        </label>
        <div className="relative">
          <KeyRound className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400" />
          <input
            name="confirm_password"
            type="password"
            required
            minLength={8}
            className="w-full rounded-2xl bg-stone-50 py-3.5 pl-12 pr-4 text-stone-900 outline-none transition-all focus:bg-white focus:shadow-[0_0_0_3px_rgba(217,119,6,0.16)]"
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-700">
          <CheckCircle2 className="size-4" />
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#800000] px-5 py-4 text-sm font-black uppercase tracking-wide text-white shadow-xl shadow-red-950/10 transition-colors hover:bg-[#650000] disabled:opacity-60"
      >
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Đổi mật khẩu
      </button>
    </form>
  );
}
