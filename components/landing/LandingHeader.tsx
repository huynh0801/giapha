"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  FolderTree,
  Info,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getCurrentUserAction,
  signOutAction,
  type HeaderAuthUser,
} from "@/app/actions/auth";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Gia phả", href: "/dashboard" },
  { label: "Thành viên", href: "/dashboard" },
  { label: "Tư liệu", href: "/about" },
  { label: "Tin tức", href: "/news" },
  { label: "Liên hệ", href: "/about" },
];

export interface LandingHeaderProps {
  currentUser?: HeaderAuthUser | null;
}

export default function LandingHeader({ currentUser: initialUser }: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<HeaderAuthUser | null | undefined>(initialUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync if prop changes or fetch client-side if not passed
  useEffect(() => {
    if (initialUser !== undefined) {
      setUser(initialUser);
      return;
    }
    let mounted = true;
    getCurrentUserAction().then((fetched) => {
      if (mounted) setUser(fetched);
    });
    return () => {
      mounted = false;
    };
  }, [initialUser]);

  // Close dropdown on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOutAction();
      setUser(null);
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Lỗi đăng xuất:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isItemActive = (href: string, label: string) => {
    if (!pathname) return href === "/";
    if (href === "/") return pathname === "/";
    if (href === "/news") {
      return pathname.startsWith("/news") || pathname.startsWith("/blog");
    }
    if (href === "/about") {
      if (label === "Liên hệ") return false;
      return pathname.startsWith("/about");
    }
    if (href === "/dashboard") return pathname.startsWith("/dashboard");
    return pathname === href;
  };

  const userInitial = (
    user?.fullName?.[0] ||
    user?.email?.[0] ||
    "U"
  ).toUpperCase();

  return (
    <header className="relative z-30 w-full bg-[#f5e7c7] border-b border-[#e2d0a8]/70">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
            <Image
              src="/images/landing/logo.png"
              alt="Logo Gia Phả Dòng Họ"
              width={48}
              height={48}
              priority
              className="size-full object-contain drop-shadow-xs"
            />
          </div>

          <div className="flex flex-col">
            <span
              className="text-2xl sm:text-3xl lg:text-[2rem] font-bold tracking-tight text-[#183b28] group-hover:text-[#8c1d1d] transition-colors leading-tight"
              style={{
                fontFamily:
                  '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
              }}
            >
              Gia Phả Dòng Họ
            </span>
            <span className="font-sans text-xs sm:text-sm font-semibold text-[#6a594d] tracking-normal mt-0.5">
              Tôn vinh cội nguồn - Gìn giữ truyền thống
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {navItems.map((item) => {
            const active = isItemActive(item.href, item.label);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative font-sans text-sm sm:text-base font-bold tracking-tight transition-colors py-1 ${
                  active
                    ? "text-[#2c1a11]"
                    : "text-[#5e4e42] hover:text-[#8c1d1d]"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-[-4px] left-0 right-0 h-[2.5px] bg-[#8c1d1d] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Search & Auth / Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/news"
            aria-label="Tìm kiếm bài viết"
            className="flex size-9 items-center justify-center rounded-full text-[#5e4e42] hover:text-[#8c1d1d] hover:bg-[#ede5d5]/60 transition-colors"
          >
            <Search className="size-5" />
          </Link>

          {/* Traditional cloud symbol - reused from footer-clouds */}
          <div className="hidden lg:flex items-center">
            <Image
              src="/images/landing/footer-clouds.png"
              alt="Họa tiết đám mây"
              width={54}
              height={24}
              style={{ width: "auto", height: "auto" }}
              className="h-6 w-auto object-contain opacity-85 select-none pointer-events-none"
            />
          </div>

          {/* Desktop Auth State: Login button or Profile Dropdown */}
          {user === undefined ? (
            // Placeholder while resolving to prevent layout flicker
            <div className="hidden sm:inline-block size-9" />
          ) : user === null ? (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#8c1d1d] hover:bg-[#a62424] active:scale-[0.98] text-[#fffcf5] px-4 py-2 font-sans text-xs sm:text-sm font-bold shadow-xs transition-all duration-200"
            >
              <LogIn className="size-4" />
              <span>Đăng nhập</span>
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#d8cbbb] bg-[#fbf7ee] py-1 pl-1 pr-3 hover:border-[#8c1d1d] hover:bg-white transition-all shadow-xs group"
                aria-label="Tài khoản người dùng"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#800000] text-white font-bold text-xs overflow-hidden shadow-xs">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="size-full object-cover"
                    />
                  ) : (
                    userInitial
                  )}
                </div>
                <span className="max-w-[120px] truncate text-xs font-bold text-[#3c2f25] group-hover:text-[#800000]">
                  {user.fullName || user.email?.split("@")[0] || "Tài khoản"}
                </span>
                <ChevronDown
                  className={`size-3.5 text-[#7d6c5d] transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180 text-[#800000]" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#fffdf8] border border-[#e2d0a8] shadow-[0_16px_40px_rgba(58,31,19,0.14)] overflow-hidden z-50 text-[#2c1a11] animate-in fade-in zoom-in-95 duration-150">
                  {/* Dropdown Header */}
                  <div className="bg-[#f5e7c7]/60 border-b border-[#e2d0a8]/70 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#800000] text-white font-bold text-sm shadow-xs overflow-hidden">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt="Avatar"
                            className="size-full object-cover"
                          />
                        ) : (
                          userInitial
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#2c1a11]">
                          {user.fullName || user.email}
                        </p>
                        {user.fullName && user.email && (
                          <p className="truncate text-xs text-[#7d6c5d]">
                            {user.email}
                          </p>
                        )}
                        <div className="mt-1 flex items-center gap-1.5">
                          {user.role === "system_admin" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#800000]">
                              <ShieldCheck className="size-3" />
                              Quản trị hệ thống
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-800">
                              <User className="size-3" />
                              Thành viên dòng họ
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items according to Role */}
                  <div className="p-2 space-y-0.5 text-xs sm:text-sm font-sans font-semibold">
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#3c2f25] hover:bg-[#f5e7c7] hover:text-[#800000] transition-colors"
                    >
                      <User className="size-4 text-[#800000]" />
                      <span>Hồ sơ cá nhân</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#3c2f25] hover:bg-[#f5e7c7] hover:text-[#800000] transition-colors"
                    >
                      <FolderTree className="size-4 text-[#800000]" />
                      <span>Không gian gia phả</span>
                    </Link>

                    {user.role === "system_admin" ? (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#3c2f25] hover:bg-[#f5e7c7] hover:text-[#800000] transition-colors"
                      >
                        <ShieldCheck className="size-4 text-[#800000]" />
                        <span>Trang quản trị</span>
                      </Link>
                    ) : (
                      <Link
                        href="/dashboard/about"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#3c2f25] hover:bg-[#f5e7c7] hover:text-[#800000] transition-colors"
                      >
                        <Info className="size-4 text-[#800000]" />
                        <span>Hồ sơ dòng họ</span>
                      </Link>
                    )}
                  </div>

                  {/* Dropdown Footer: Logout button */}
                  <div className="border-t border-[#e2d0a8]/70 p-2 bg-[#fbf7ee]">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 font-bold text-xs sm:text-sm transition-colors disabled:opacity-60"
                    >
                      <LogOut className="size-4" />
                      <span>
                        {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            className="md:hidden flex size-9 items-center justify-center rounded-lg text-[#2c1a11] hover:bg-[#ede5d5]"
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e2d0a8] bg-[#f5e7c7] px-4 py-4 space-y-2 shadow-lg">
          {navItems.map((item) => {
            const active = isItemActive(item.href, item.label);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg font-sans text-base font-bold transition-colors ${
                  active
                    ? "bg-[#ede5d5] text-[#8c1d1d]"
                    : "text-[#5e4e42] hover:bg-[#f4ece0] hover:text-[#8c1d1d]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Mobile Auth Section */}
          {user ? (
            <div className="pt-3 border-t border-[#e2d0a8]/80 space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#fffdf8] border border-[#e2d0a8]/60">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#800000] text-white font-bold text-sm shadow-xs overflow-hidden">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="size-full object-cover"
                    />
                  ) : (
                    userInitial
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#2c1a11]">
                    {user.fullName || user.email}
                  </p>
                  <span className="inline-block mt-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#800000]">
                    {user.role === "system_admin"
                      ? "Quản trị hệ thống"
                      : "Thành viên dòng họ"}
                  </span>
                </div>
              </div>

              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-sans text-sm font-bold text-[#3c2f25] hover:bg-[#ede5d5]"
              >
                <User className="size-4 text-[#800000]" />
                Hồ sơ cá nhân
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-sans text-sm font-bold text-[#3c2f25] hover:bg-[#ede5d5]"
              >
                <FolderTree className="size-4 text-[#800000]" />
                Không gian gia phả
              </Link>

              {user.role === "system_admin" ? (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-sans text-sm font-bold text-[#3c2f25] hover:bg-[#ede5d5]"
                >
                  <ShieldCheck className="size-4 text-[#800000]" />
                  Trang quản trị
                </Link>
              ) : (
                <Link
                  href="/dashboard/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-sans text-sm font-bold text-[#3c2f25] hover:bg-[#ede5d5]"
                >
                  <Info className="size-4 text-[#800000]" />
                  Hồ sơ dòng họ
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 text-rose-700 font-sans font-bold text-sm border border-rose-200 transition hover:bg-rose-100 disabled:opacity-60"
              >
                <LogOut className="size-4" />
                <span>
                  {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                </span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-[#e8dfcf]/60 flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#8c1d1d] text-white font-sans font-bold text-sm shadow-xs transition hover:bg-[#a62424]"
              >
                <LogIn className="size-4" />
                <span>Đăng nhập</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
