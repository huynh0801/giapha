import Image from "next/image";

interface BackgroundDecorProps {
  /**
   * Whether to include subtle intermediate alternating accents for tall pages (About, Blog detail).
   */
  withMid?: boolean;
  /**
   * Subtle mode with lower opacity, gentle for dashboard screens to avoid visual clutter.
   */
  subtle?: boolean;
}

export default function BackgroundDecor({
  withMid = false,
  subtle = false,
}: BackgroundDecorProps) {
  // Determine opacity levels based on subtle prop
  const topOpacity = subtle
    ? "opacity-15 sm:opacity-20 lg:opacity-25"
    : "opacity-35 sm:opacity-55 lg:opacity-75";

  const midTopOpacity = subtle
    ? "opacity-10 sm:opacity-15 lg:opacity-20"
    : "opacity-30 sm:opacity-45 lg:opacity-60";

  const midBottomOpacity = subtle
    ? "opacity-10 sm:opacity-15 lg:opacity-20"
    : "opacity-25 sm:opacity-40 lg:opacity-55";

  const bottomOpacity = subtle
    ? "opacity-15 sm:opacity-20 lg:opacity-25"
    : "opacity-35 sm:opacity-55 lg:opacity-75";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden z-0"
    >
      {/* 1. Đỉnh trang: Chỉ nằm bên TRÁI (decorate2), không có bên phải */}
      <div
        className={`absolute -top-6 -left-10 sm:-top-8 sm:-left-6 lg:left-0 w-48 sm:w-72 lg:w-96 aspect-[607/411] ${topOpacity}`}
      >
        <Image
          src="/images/landing/decorate2.png"
          alt=""
          fill
          sizes="(max-width: 640px) 192px, (max-width: 1024px) 288px, 384px"
          priority
          className="object-contain object-left-top"
        />
      </div>

      {withMid && (
        <>
          {/* 2. Đoạn giữa trên: Chỉ nằm bên PHẢI (decorate1), không có bên trái */}
          <div
            className={`absolute top-[35%] -right-12 sm:top-[33%] sm:-right-8 lg:right-0 w-48 sm:w-72 lg:w-96 aspect-[605/412] ${midTopOpacity}`}
          >
            <Image
              src="/images/landing/decorate1.png"
              alt=""
              fill
              sizes="(max-width: 640px) 192px, (max-width: 1024px) 288px, 384px"
              className="object-contain object-right"
            />
          </div>

          {/* 3. Đoạn giữa dưới: Chỉ nằm bên TRÁI (decorate2), không có bên phải */}
          <div
            className={`absolute top-[68%] -left-12 sm:top-[66%] sm:-left-8 lg:left-0 w-48 sm:w-72 lg:w-96 aspect-[607/411] ${midBottomOpacity}`}
          >
            <Image
              src="/images/landing/decorate2.png"
              alt=""
              fill
              sizes="(max-width: 640px) 192px, (max-width: 1024px) 288px, 384px"
              className="object-contain object-left"
            />
          </div>
        </>
      )}

      {/* 4. Chân trang: Chỉ nằm bên PHẢI (decorate1), không có bên trái */}
      <div
        className={`absolute bottom-4 -right-12 sm:bottom-8 sm:-right-8 lg:right-0 w-48 sm:w-72 lg:w-96 aspect-[605/412] ${bottomOpacity}`}
      >
        <Image
          src="/images/landing/decorate1.png"
          alt=""
          fill
          sizes="(max-width: 640px) 192px, (max-width: 1024px) 288px, 384px"
          className="object-contain object-right-bottom"
        />
      </div>
    </div>
  );
}
