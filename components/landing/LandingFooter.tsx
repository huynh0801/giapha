import Image from "next/image";

export default function LandingFooter() {
  return (
    <footer className="relative w-full bg-[#1b3a29] text-[#e8ecd8] py-3.5 sm:py-5 overflow-hidden border-t-2 border-[#caa455]">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Ornament */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="relative w-8 h-4 sm:w-12 sm:h-6 md:w-16 md:h-8 opacity-80 shrink-0">
            <Image
              src="/images/landing/footer-clouds.png"
              alt="Họa tiết mây"
              fill
              sizes="64px"
              className="object-contain"
            />
          </div>
          <div className="w-4 sm:w-12 md:w-16 lg:w-32 h-[1px] bg-gradient-to-r from-transparent via-[#caa455] to-transparent shrink-0" />
        </div>

        {/* Center Slogan */}
        <div className="flex-1 text-center px-1.5 sm:px-4 min-w-0">
          <p
            className="text-[11px] sm:text-base md:text-xl lg:text-2xl font-bold tracking-wider text-[#f5ebd2] drop-shadow-xs"
            style={{ fontFamily: '"SVN-Studio Brush", Georgia, serif' }}
          >
            Dòng họ trường tồn - Con cháu hưng thịnh
          </p>
        </div>

        {/* Right Ornament */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="w-4 sm:w-12 md:w-16 lg:w-32 h-[1px] bg-gradient-to-r from-transparent via-[#caa455] to-transparent shrink-0" />
          <div className="relative w-8 h-4 sm:w-12 sm:h-6 md:w-16 md:h-8 opacity-80 scale-x-[-1] shrink-0">
            <Image
              src="/images/landing/footer-clouds.png"
              alt="Họa tiết mây"
              fill
              sizes="64px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
