"use client";

import { signOutAction } from "@/app/actions/auth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LogoutButtonProps {
  redirectTo?: string;
  className?: string;
}

export default function LogoutButton({
  redirectTo = "/login",
  className = "",
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOutAction();
      router.push(redirectTo);
      router.refresh(); // Refresh to clear any cached Server Component data
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={[
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold text-stone-700 transition-colors hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
    >
      <LogOut className="size-4" />
      {isLoggingOut ? "Đang xử lý..." : "Đăng xuất"}
    </button>
  );
}
