import Image from "next/image";
import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f5e7c7]">
      <Link
        href="/dashboard"
        className="block relative w-full cursor-pointer"
        aria-label="Khám phá gia phả"
      >
        {/* Mobile Banner: herosection-mobile (portrait orientation, aspect-[1228/1281]) */}
        <div className="block md:hidden relative w-full aspect-[1228/1281]">
          <Image
            src="/images/landing/herosection-mobile.png"
            alt="Tranh phong cảnh non nước và từ đường dòng họ (bản di động)"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center select-none"
          />
        </div>

        {/* Desktop Banner: hero-banner (panoramic orientation, aspect-[2048/768]) */}
        <div className="hidden md:block relative w-full aspect-[2048/768]">
          <Image
            src="/images/landing/hero-banner.png"
            alt="Tranh phong cảnh non nước và từ đường dòng họ"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center select-none"
          />
        </div>
      </Link>
    </section>
  );
}
