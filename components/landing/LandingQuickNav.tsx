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
    description: "Xem sơ đồ, lịch sử của dòng họ",
    icon: "/images/landing/nav-genealogy.png",
    href: "/dashboard",
  },
  {
    title: "Thành viên",
    description: "Danh sách con cháu trong dòng họ",
    icon: "/images/landing/nav-members.png",
    href: "/dashboard",
  },
  {
    title: "Tư liệu",
    description: "Lưu trữ hình ảnh, văn bản, hiện vật quý",
    icon: "/images/landing/nav-documents.png",
    href: "/about",
  },
  {
    title: "Tin tức - Sự kiện",
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
    <section className="relative w-full bg-[#f5e7c7] border-y border-[#e2d0a8] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-0 lg:divide-x lg:divide-[#e2d0a8]">
          {quickNavItems.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className={`group flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl transition-all duration-200 hover:bg-[#eddcb7]/60 ${
                index === 4 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              {/* Icon Container with subtle animation */}
              <div className="relative mb-3 flex size-16 sm:size-20 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="size-14 sm:size-16 object-contain drop-shadow-xs"
                />
              </div>

              {/* Title */}
              <h3 className="font-serif text-base sm:text-lg font-black text-[#2c1a11] group-hover:text-[#8c1d1d] transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-1 text-xs text-[#705e52] max-w-[190px] leading-relaxed">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
