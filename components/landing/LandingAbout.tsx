import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingAbout() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#faf0d7] border border-[#e2d0a8] shadow-[0_8px_30px_rgba(44,26,17,0.06)] p-5 sm:p-7 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center h-full">
      {/* Temple Artwork on the Left */}
      <div className="relative w-full md:w-5/12 aspect-[4/3] rounded-2xl overflow-hidden border border-[#e2d0be] shadow-xs shrink-0">
        <Image
          src="/images/landing/about-temple.png"
          alt="Nhà thờ từ đường dòng họ"
          fill
          sizes="(max-width: 768px) 100vw, 42vw"
          className="object-cover"
        />
      </div>

      {/* Description Content on the Right */}
      <div className="relative z-10 flex-1 space-y-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2c1a11] tracking-normal">
          Về dòng họ chúng tôi
        </h2>

        <p className="text-base sm:text-lg lg:text-xl text-[#3d2f25] leading-relaxed sm:leading-loose font-normal">
          Dòng họ chúng tôi có lịch sử lâu đời, khởi nguồn từ những bậc tiền nhân
          giàu lòng nhân nghĩa, cần cù và hiếu học. Qua nhiều thế hệ, con cháu
          trong dòng họ luôn giữ gìn truyền thống, đoàn kết, cùng nhau xây dựng
          cuộc sống tốt đẹp hơn.
        </p>

        <div className="pt-2">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full bg-[#8c1d1d] hover:bg-[#a62424] active:scale-[0.98] text-[#fffcf5] px-7 py-3 text-sm sm:text-base font-bold shadow-xs transition-all duration-200 group"
          >
            <span>Xem chi tiết</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Decorative Cloud Ornament at bottom right */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-28 sm:w-36 h-20 sm:h-24 opacity-85 z-0">
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
