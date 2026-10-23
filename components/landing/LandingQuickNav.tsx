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
    description: "Các hoạt động của dòng họ",
    icon: "/images/landing/nav-news.png",
    href: "/news",
  },
  {
    title: "Liên hệ",
    description: "Góp ý, liên hệ với ban quản trị",
    icon: "/images/landing/nav-contact.png",
    href: "/about",
  },
];

export default function LandingQuickNav() {
  return (
    <section className="relative w-full bg-[#f5e7c7] py-4 sm:py-6 lg:py-7 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-0 items-start">
          {quickNavItems.map((item, index) => (
            <div key={item.title} className="relative flex items-stretch">
              <Link
                href={item.href}
                className="group flex flex-1 flex-col items-center text-center px-2 sm:px-3 lg:px-3.5 transition-all duration-200"
              >
                {/* Compact Artistic Illustration */}
                <div className="relative h-16 sm:h-20 lg:h-22 w-full flex items-center justify-center mb-1.5 sm:mb-2 transition-transform duration-200 group-hover:scale-105">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={130}
                    height={95}
                    className="max-h-full max-w-full object-contain select-none pointer-events-none drop-shadow-xs"
                  />
                </div>

                {/* Title in Deep Forest Green */}
                <h3
                  className="text-sm sm:text-base lg:text-[1.05rem] font-bold tracking-tight text-[#183b28] group-hover:text-[#8c1d1d] transition-colors leading-tight"
                  style={{ fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif' }}
                >
                  {item.title}
                </h3>

                {/* Description matching exact line-breaks */}
                <p className="mt-1 text-[11px] sm:text-xs text-[#4a3b30] leading-snug max-w-[155px] whitespace-pre-line font-medium">
                  {item.description}
                </p>
              </Link>

              {/* Hand-drawn style vertical golden separator line between items (desktop) */}
              {index < quickNavItems.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1 bottom-1 w-[1px] bg-[#caa455]/70 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
