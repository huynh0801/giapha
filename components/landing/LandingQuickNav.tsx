import Image from "next/image";
import Link from "next/link";

interface QuickNavItem {
  title: string;
  description: string;
  icon: string;
  href: string;
}

const quickNavItems: QuickNavItem[] = [
  {
    title: "Gia phả dòng họ",
    description: "Xem sơ đồ, lịch sử\ncủa dòng họ",
    icon: "/images/landing/nav-genealogy.png",
    href: "/dashboard",
  },
  {
    title: "Thành viên",
    description: "Danh sách con cháu\ntrong dòng họ",
    icon: "/images/landing/nav-members.png",
    href: "/dashboard",
  },
  {
    title: "Tư liệu",
    description: "Lưu trữ hình ảnh, văn bản,\nhiện vật quý",
    icon: "/images/landing/nav-documents.png",
    href: "/about",
  },
  {
    title: "Tin tức – Sự kiện",
    description: "Các hoạt động\ncủa dòng họ",
    icon: "/images/landing/nav-news.png",
    href: "/news",
  },
  {
    title: "Liên hệ",
    description: "Góp ý, liên hệ\nvới ban quản trị",
    icon: "/images/landing/nav-contact.png",
    href: "/about",
  },
];

export default function LandingQuickNav() {
  return (
    <section className="relative w-full bg-[#f5e7c7] py-3 sm:py-4 lg:py-5 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-0 items-center">
          {quickNavItems.map((item, index) => (
            <div
              key={item.title}
              className={`relative flex flex-col items-center justify-center h-full px-2 sm:px-4 lg:px-6 ${
                index === 4 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <Link
                href={item.href}
                className="group flex flex-col items-center text-center w-full transition-all duration-200"
              >
                {/* Dainty Artistic Illustration */}
                <div className="relative h-11 sm:h-12 lg:h-13 w-full flex items-center justify-center mb-1 transition-transform duration-200 group-hover:scale-105">
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
                  className="text-xs sm:text-sm lg:text-[15px] font-bold tracking-normal text-[#183b28] group-hover:text-[#8c1d1d] transition-colors leading-tight"
                  style={{ fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif' }}
                >
                  {item.title}
                </h3>

                {/* Description matching exact line-breaks */}
                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] lg:text-xs text-[#5c4a3e] leading-snug max-w-[150px] whitespace-pre-line font-normal">
                  {item.description}
                </p>
              </Link>

              {/* Hand-drawn style vertical golden separator line between items (desktop) */}
              {index < quickNavItems.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-10 lg:h-12 w-[1px] bg-[#caa455]/50 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
