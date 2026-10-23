import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fcf8ee]">
      {/* Visual Canvas / Banner Container */}
      <div className="relative mx-auto max-w-7xl">
        {/* Main Background Artwork */}
        <div className="relative aspect-[2048/768] min-h-[420px] w-full overflow-hidden sm:min-h-[480px] md:min-h-[520px] lg:min-h-[580px]">
          <Image
            src="/images/landing/hero-banner.png"
            alt="Tranh phong cảnh non nước và từ đường dòng họ"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right md:object-center select-none pointer-events-none"
          />

          {/* Soft parchment gradient overlay for text readability on smaller screens */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fbf6ed]/95 via-[#fbf6ed]/80 to-transparent md:w-3/5 lg:w-1/2 pointer-events-none" />

          {/* Floating Content on the Left */}
          <div className="absolute inset-0 flex items-center px-6 sm:px-10 md:px-14 lg:px-16">
            <div className="max-w-xl space-y-4 sm:space-y-6">
              {/* Main Calligraphy-styled Headline */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-black leading-[1.18] tracking-tight text-[#1b3a29] drop-shadow-xs">
                Dòng họ <br />
                <span className="text-[#8c1d1d]">là gốc rễ</span> <br />
                của mỗi chúng ta
              </h1>

              {/* Slogan Couplet */}
              <div className="space-y-1 text-sm sm:text-base md:text-lg font-medium text-[#4a392e] leading-relaxed">
                <p>Gìn giữ gia phả - Kết nối con cháu</p>
                <p>Duy trì truyền thống - Vững bước tương lai</p>
              </div>

              {/* Primary Call to Action Button */}
              <div className="pt-2 sm:pt-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#8c1d1d] hover:bg-[#a62424] active:scale-[0.98] text-[#fffcf5] px-7 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-bold shadow-[0_6px_20px_rgba(140,29,29,0.35)] transition-all duration-200 group"
                >
                  <span>Khám phá gia phả</span>
                  <ArrowRight className="size-4 sm:size-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
