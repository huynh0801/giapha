import Image from "next/image";

export default function LandingFooter() {
  return (
    <footer className="relative w-full bg-[#1b3a29] text-[#e8ecd8] py-4 sm:py-5 overflow-hidden border-t-2 border-[#caa455]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Ornament */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block relative w-12 h-6 md:w-16 md:h-8 opacity-75">
            <Image
              src="/images/landing/footer-clouds.png"
              alt="Họa tiết mây"
              fill
              sizes="64px"
              className="object-contain"
            />
          </div>
          <div className="hidden md:block w-16 lg:w-32 h-[1px] bg-gradient-to-r from-transparent via-[#caa455] to-transparent" />
        </div>

        {/* Center Slogan */}
        <div className="flex-1 text-center px-4">
          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-wider text-[#f5ebd2] drop-shadow-xs"
            style={{ fontFamily: '"SVN-Studio Brush", Georgia, serif' }}
          >
            Dòng họ trường tồn - Con cháu hưng thịnh
          </p>
        </div>

        {/* Right Ornament */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block w-16 lg:w-32 h-[1px] bg-gradient-to-r from-transparent via-[#caa455] to-transparent" />
          <div className="hidden sm:block relative w-12 h-6 md:w-16 md:h-8 opacity-75 scale-x-[-1]">
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
