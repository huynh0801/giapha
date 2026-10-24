import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingAbout() {
  return (
    <div className="relative overflow-hidden rounded-2xl flex flex-col lg:flex-row items-stretch w-full h-full flex-1 bg-[#faeed6]">
      {/* Desktop Background: img-detail.png (576x409) - Giữ nguyên 100% không cắt, neo sát phải, để hình bên trái đè lên */}
      <div className="hidden lg:block pointer-events-none absolute right-0 top-0 h-full w-auto aspect-[576/409] z-0 select-none">
        <Image
          src="/images/landing/about-card-bg.png?v=20261023e"
          alt="Nền giấy dó"
          fill
          unoptimized
          sizes="50vw"
          className="object-contain object-right"
          priority
        />
      </div>

      {/* Left side: img-detail2.png (612x407) - Giữ đúng tỷ lệ gốc, đè lên phần bên trái của nền giấy dó */}
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
      <div className="relative z-20 flex-1 flex flex-col justify-between p-5 sm:p-6 lg:p-7 space-y-3 min-w-0 h-full">
        {/* Mobile Background: img-detail.png */}
        <div className="lg:hidden pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden">
          <Image
            src="/images/landing/about-card-bg.png?v=20261023e"
            alt="Nền giấy dó"
            fill
            unoptimized
            sizes="100vw"
            className="object-cover object-right"
            priority
          />
        </div>

        <div>
          <span className="inline-block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#8c1d1d] font-sans mb-1">
            Sáng kiến số hóa di sản
          </span>
          <h2
            className="text-lg sm:text-xl lg:text-[1.45rem] font-bold text-[#183b28] tracking-tight leading-tight"
            style={{ fontFamily: '"SVN-Studio Brush", Georgia, serif' }}
          >
            Dự án số hóa gia phả vì cộng đồng
          </h2>

          <p className="mt-2 sm:mt-2.5 text-xs sm:text-[13px] text-[#3c3026] leading-relaxed font-sans font-normal">
            Gia Phả Dòng Họ là dự án số hóa phả hệ phi lợi nhuận vì cộng đồng,
            ra đời với sứ mệnh gìn giữ, tôn vinh và kết nối cội nguồn các gia
            tộc Việt Nam. Nền tảng hỗ trợ các dòng họ lưu truyền cây gia phả đa
            đời, số hóa tư liệu cổ và nhắc nhớ ngày giỗ tổ tiên trường tồn cùng
            thời gian.
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
