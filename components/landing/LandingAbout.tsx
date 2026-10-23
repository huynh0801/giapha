import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingAbout() {
  return (
    <div className="relative overflow-hidden rounded-2xl flex flex-col lg:flex-row items-stretch w-full h-full flex-1">
      {/* Background: img-detail.png (parchment paper with natural deckle edge and cloud watermark) */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden rounded-2xl">
        <Image
          src="/images/landing/about-card-bg.png?v=20261023e"
          alt="Nền giấy dó"
          fill
          unoptimized
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover object-right"
          priority
        />
      </div>

      {/* Left side: img-detail2.png - Giữ đúng tỷ lệ gốc (612/407), không bóp méo hình */}
      <div className="relative z-10 w-full lg:w-auto lg:h-full aspect-[612/407] shrink-0 overflow-hidden">
        <Image
          src="/images/landing/about-painting.png?v=20261023e"
          alt="Nhà thờ từ đường dòng họ"
          fill
          unoptimized
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="size-full object-cover object-left"
          priority
        />
      </div>

      {/* Right side: Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-between p-5 sm:p-6 lg:p-7 space-y-3 min-w-0 h-full">
        <div>
          <h2
            className="text-lg sm:text-xl lg:text-[1.45rem] font-bold text-[#183b28] tracking-tight leading-tight"
            style={{ fontFamily: '"SVN-Studio Brush", Georgia, serif' }}
          >
            Về dòng họ chúng tôi
          </h2>

          <p className="mt-2 sm:mt-2.5 text-xs sm:text-[13px] text-[#3c3026] leading-relaxed font-sans font-normal">
            Dòng họ chúng tôi có lịch sử lâu đời, khởi nguồn từ những bậc tiền nhân
            giàu lòng nhân nghĩa, cần cù và hiếu học. Qua nhiều thế hệ, con cháu
            trong dòng họ luôn giữ gìn truyền thống, đoàn kết, cùng nhau xây dựng
            cuộc sống tốt đẹp hơn.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#8c1d1d] hover:bg-[#a62424] active:scale-[0.98] text-[#fffcf5] px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-sans font-bold shadow-xs transition-all duration-200 group"
          >
            <span>Xem chi tiết</span>
            <ArrowRight className="size-3.5 sm:size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
