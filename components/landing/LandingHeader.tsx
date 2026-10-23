"use client";

import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Trang chủ", href: "/", active: true },
  { label: "Gia phả", href: "/dashboard" },
  { label: "Thành viên", href: "/dashboard" },
  { label: "Tư liệu", href: "/about" },
  { label: "Tin tức", href: "/news" },
  { label: "Liên hệ", href: "/about" },
];

export default function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-30 w-full bg-[#fbf6ed] border-b border-[#e8dfcf]/60">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          {/* Traditional Red Seal */}
          <div className="relative flex size-12 items-center justify-center rounded-xl bg-[#8c1d1d] shadow-[0_4px_12px_rgba(140,29,29,0.25)] border-2 border-[#b53a3a]">
            <span className="text-2xl font-serif font-black text-[#faf2e4] select-none tracking-tight">
              祖
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black font-serif tracking-tight text-[#2c1a11] group-hover:text-[#8c1d1d] transition-colors">
              Gia Phả Dòng Họ
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-[#7a6a5d] tracking-normal">
              Tôn vinh cội nguồn - Gìn giữ truyền thống
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative text-sm font-bold tracking-tight transition-colors py-1 ${
                item.active
                  ? "text-[#2c1a11]"
                  : "text-[#5e4e42] hover:text-[#8c1d1d]"
              }`}
            >
              {item.label}
              {item.active && (
                <span className="absolute bottom-[-4px] left-0 right-0 h-[2.5px] bg-[#8c1d1d] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions: Search & Ornamental cloud / Admin */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/news"
            aria-label="Tìm kiếm bài viết"
            className="flex size-9 items-center justify-center rounded-full text-[#5e4e42] hover:text-[#8c1d1d] hover:bg-[#ede5d5]/60 transition-colors"
          >
            <Search className="size-5" />
          </Link>

          {/* Traditional cloud symbol */}
          <div className="hidden lg:flex items-center text-[#c29b63]">
            <svg
              className="size-8"
              viewBox="0 0 64 64"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M48 38c0-5.52-4.48-10-10-10-1.28 0-2.49.25-3.61.69C32.74 24.16 28.18 21 22.8 21 15.18 21 9 27.18 9 34.8c0 .41.03.82.07 1.22C5.07 37.1 2 40.7 2 45c0 5.52 4.48 10 10 10h36c6.63 0 12-5.37 12-12 0-5.63-3.88-10.36-9.1-11.64.07-.45.1-.9.1-1.36z" opacity="0.85" />
            </svg>
          </div>

          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center rounded-full bg-[#f4ece0] border border-[#d8cbbb] px-3.5 py-1.5 text-xs font-bold text-[#6a4f3b] hover:bg-[#8c1d1d] hover:text-white hover:border-[#8c1d1d] transition-all shadow-xs"
          >
            Quản trị
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            className="md:hidden flex size-9 items-center justify-center rounded-lg text-[#2c1a11] hover:bg-[#ede5d5]"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e8dfcf] bg-[#fbf6ed] px-4 py-4 space-y-2 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-bold transition-colors ${
                item.active
                  ? "bg-[#ede5d5] text-[#8c1d1d]"
                  : "text-[#5e4e42] hover:bg-[#f4ece0] hover:text-[#8c1d1d]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#e8dfcf]/60 flex gap-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-[#8c1d1d] text-white font-bold text-sm"
            >
              Đăng nhập Quản trị
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
