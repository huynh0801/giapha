import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingAbout() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#fcf5e5] border border-[#e2d0a8] shadow-[0_4px_20px_rgba(44,26,17,0.05)] flex flex-col md:flex-row items-stretch h-full">
      {/* Temple Artwork on the Left - Full bleed to top, bottom, and left */}
      <div className="relative w-full md:w-[46%] min-h-[220px] md:min-h-full shrink-0 overflow-hidden">
        <Image
          src="/images/landing/about-temple.png"
          alt="Nhà thờ từ đường dòng họ"
          fill
          sizes="(max-width: 768px) 100vw, 35vw"
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Description Content on the Right */}
      <div className="relative z-10 flex-1 flex flex-col justify-between p-5 sm:p-6 lg:p-7 space-y-3 sm:space-y-4">
        <div>
          <h2
            className="text-xl sm:text-2xl lg:text-[1.65rem] font-bold text-[#183b28] tracking-tight leading-tight"
            style={{ fontFamily: '"SVN-Studio Brush", Georgia, serif' }}
          >
            Về dòng họ chúng tôi
          </h2>

          <p className="mt-2.5 text-xs sm:text-[13px] lg:text-sm text-[#3c3026] leading-relaxed font-sans font-normal">
            Dòng họ chúng tôi có lịch sử lâu đời, khởi nguồn từ những bậc tiền nhân
            giàu lòng nhân nghĩa, cần cù và hiếu học. Qua nhiều thế hệ, con cháu
            trong dòng họ luôn giữ gìn truyền thống, đoàn kết, cùng nhau xây dựng
            cuộc sống tốt đẹp hơn.
          </p>
        </div>

        <div className="pt-1">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#8c1d1d] hover:bg-[#a62424] active:scale-[0.98] text-[#fffcf5] px-5 py-2 text-xs sm:text-sm font-sans font-bold shadow-xs transition-all duration-200 group"
          >
            <span>Xem chi tiết</span>
            <ArrowRight className="size-3.5 sm:size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Decorative Cloud Ornament at bottom right */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-28 sm:w-36 h-20 sm:h-24 opacity-80 z-0">
        <Image
          src="/images/landing/cloud-ornament.png"
          alt="Họa tiết mây trang trí"
          fill
          sizes="144px"
          className="object-contain object-bottom-right"
        />
      </div>
    </div>
  );
}
