import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface QuickNavItem {
  title: string;
  description: string;
  icon: string;
}

const quickNavItems: QuickNavItem[] = [
  {
    title: "Gia phả dòng họ",
    description: "Xem sơ đồ, lịch sử\ncủa dòng họ",
    icon: "/images/landing/nav-genealogy.png",
  },
  {
    title: "Thành viên",
    description: "Danh sách con cháu\ntrong dòng họ",
    icon: "/images/landing/nav-members.png",
  },
  {
    title: "Tư liệu",
    description: "Lưu trữ hình ảnh, văn bản,\nhiện vật quý",
    icon: "/images/landing/nav-documents.png",
  },
  {
    title: "Tin tức – Sự kiện",
    description: "Các hoạt động\ncủa dòng họ",
    icon: "/images/landing/nav-news.png",
  },
  {
    title: "Liên hệ",
    description: "Góp ý, liên hệ\nvới ban quản trị",
    icon: "/images/landing/nav-contact.png",
  },
];

export default function LandingQuickNav() {
  return (
    <section className="relative w-full bg-[#f5e7c7] py-3 sm:py-4 lg:py-5 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mobile & Tablet Layout: 2x2 grid of cards + 1 full-width horizontal card */}
        <div className="grid lg:hidden grid-cols-2 gap-2.5 sm:gap-3.5">
          {/* First 4 cards: 2x2 grid, non-clickable informative showcase */}
          {quickNavItems.slice(0, 4).map((item) => (
            <div
              key={item.title}
              className="bg-[#faeed6]/90 border border-[#deb887]/80 rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center justify-between shadow-[0_2px_8px_rgba(44,26,17,0.04)]"
            >
              {/* Illustration centered on top */}
              <div className="relative h-11 sm:h-13 w-full flex items-center justify-center mb-1.5">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={80}
                  height={55}
                  style={{ width: "auto", height: "auto" }}
                  className="max-h-full max-w-full object-contain select-none pointer-events-none drop-shadow-2xs"
                />
              </div>

              {/* Bottom area: Title & description centered, no arrow */}
              <div className="flex flex-col items-center text-center w-full mt-auto">
                <h3
                  className="text-xs sm:text-sm font-bold tracking-normal text-[#183b28] leading-tight text-center"
                  style={{ fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif' }}
                >
                  {item.title}
                </h3>
                <p className="mt-0.5 text-[10px] sm:text-[11px] text-[#5c4a3e] leading-snug whitespace-pre-line font-sans font-medium text-center">
                  {item.description}
                </p>
              </div>
            </div>
          ))}

          {/* 5th card: Full-width horizontal layout, only this button is clickable */}
          <Link
            href="/about"
            className="col-span-2 bg-[#faeed6]/90 border border-[#deb887]/80 rounded-2xl p-2.5 sm:p-3.5 flex items-center justify-between shadow-[0_2px_8px_rgba(44,26,17,0.04)] hover:border-[#8c1d1d] hover:bg-[#fff8ec] active:scale-[0.99] transition-all group cursor-pointer"
          >
            {/* Left illustration */}
            <div className="relative h-11 w-13 sm:h-12 sm:w-15 shrink-0 flex items-center justify-center">
              <Image
                src={quickNavItems[4].icon}
                alt={quickNavItems[4].title}
                width={70}
                height={50}
                style={{ width: "auto", height: "auto" }}
                className="max-h-full max-w-full object-contain select-none pointer-events-none drop-shadow-2xs"
              />
            </div>

            {/* Middle text */}
            <div className="flex flex-col text-left flex-1 ml-3 min-w-0">
              <h3
                className="text-xs sm:text-sm font-bold tracking-normal text-[#183b28] group-hover:text-[#8c1d1d] transition-colors leading-tight"
                style={{ fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif' }}
              >
                {quickNavItems[4].title}
              </h3>
              <p className="mt-0.5 text-[10px] sm:text-[11px] text-[#5c4a3e] leading-snug font-sans font-medium">
                {quickNavItems[4].description.replace("\n", " ")}
              </p>
            </div>

            {/* Right arrow */}
            <div className="shrink-0 ml-2 text-[#183b28] group-hover:text-[#8c1d1d] group-hover:translate-x-0.5 transition-all">
              <ArrowRight className="size-4" />
            </div>
          </Link>
        </div>

        {/* Desktop Layout: EXACT design as before (5 items in horizontal strip with vertical golden separators) */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-0 items-center">
          {quickNavItems.map((item, index) => (
            <div
              key={item.title}
              className="relative flex flex-col items-center justify-center h-full px-2 sm:px-4 lg:px-6"
            >
              <div className="flex flex-col items-center text-center w-full">
                {/* Dainty Artistic Illustration */}
                <div className="relative h-11 sm:h-12 lg:h-13 w-full flex items-center justify-center mb-1">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={90}
                    height={60}
                    style={{ width: "auto", height: "auto" }}
                    className="max-h-full max-w-full object-contain select-none pointer-events-none drop-shadow-2xs"
                  />
                </div>

                {/* Title in Deep Forest Green */}
                <h3
                  className="text-xs sm:text-sm lg:text-[15px] font-bold tracking-normal text-[#183b28] leading-tight"
                  style={{ fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif' }}
                >
                  {item.title}
                </h3>

                {/* Description matching exact line-breaks */}
                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] lg:text-xs text-[#5c4a3e] leading-snug max-w-[150px] whitespace-pre-line font-sans font-medium">
                  {item.description}
                </p>
              </div>

              {/* Hand-drawn style vertical golden separator line between items (desktop) */}
              {index < quickNavItems.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-14 lg:h-16 w-[2px] lg:w-[2.5px] bg-[#a6742a] rounded-full shadow-2xs" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
