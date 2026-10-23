"use client";

import Image from "next/image";
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
    <header className="relative z-30 w-full bg-[#f5e7c7] border-b border-[#e2d0a8]/70">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          {/* Logo from icon folder */}
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
              style={{ fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif' }}
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
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative font-sans text-sm sm:text-base font-bold tracking-tight transition-colors py-1 ${
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

          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center rounded-full bg-[#f4ece0] border border-[#d8cbbb] px-4 py-2 font-sans text-xs sm:text-sm font-bold text-[#6a4f3b] hover:bg-[#8c1d1d] hover:text-white hover:border-[#8c1d1d] transition-all shadow-xs"
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
        <div className="md:hidden border-t border-[#e2d0a8] bg-[#f5e7c7] px-4 py-4 space-y-2 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg font-sans text-base font-bold transition-colors ${
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
              className="w-full text-center py-2.5 rounded-xl bg-[#8c1d1d] text-white font-sans font-bold text-sm"
            >
              Đăng nhập Quản trị
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
