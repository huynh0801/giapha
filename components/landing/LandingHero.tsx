import Image from "next/image";
import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fcf8ee]">
      <Link
        href="/dashboard"
        className="block relative w-full aspect-[2048/768] cursor-pointer"
        aria-label="Khám phá gia phả"
      >
        <Image
          src="/images/landing/hero-banner.png"
          alt="Tranh phong cảnh non nước và từ đường dòng họ"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center select-none"
        />
      </Link>
    </section>
  );
}
