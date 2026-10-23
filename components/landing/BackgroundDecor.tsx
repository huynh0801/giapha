import Image from "next/image";

interface BackgroundDecorProps {
  /**
   * Whether to include full staggered distribution for long pages (About, Blog detail).
   */
  withMid?: boolean;
}

export default function BackgroundDecor({ withMid = false }: BackgroundDecorProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden z-0"
    >
      {/* 1. Trái trên (Left Upper): Bắt đầu ở đỉnh lề trái */}
      <div className="absolute top-4 sm:top-8 lg:top-10 -left-12 sm:-left-8 lg:-left-4 w-52 sm:w-76 lg:w-[390px] aspect-[607/411] opacity-35 sm:opacity-55 lg:opacity-75">
        <Image
          src="/images/landing/decorate2.png"
          alt=""
          fill
          sizes="(max-width: 640px) 208px, (max-width: 1024px) 304px, 390px"
          priority
          className="object-contain object-left-top"
        />
      </div>

      {/* 2. Phải trên (Right Upper-Mid): So le lệch xuống phía dưới (~25-28%) */}
      <div className="absolute top-[28%] sm:top-[26%] lg:top-[24%] -right-12 sm:-right-8 lg:-right-4 w-44 sm:w-64 lg:w-80 aspect-[605/412] opacity-30 sm:opacity-45 lg:opacity-60">
        <Image
          src="/images/landing/decorate1.png"
          alt=""
          fill
          sizes="(max-width: 640px) 176px, (max-width: 1024px) 256px, 320px"
          className="object-contain object-right"
        />
      </div>

      {withMid ? (
        <>
          {/* 3. Trái giữa (Left Middle - for long pages): So le ở khoảng 52% */}
          <div className="absolute top-[52%] sm:top-[50%] -left-14 sm:-left-10 lg:-left-6 w-48 sm:w-68 lg:w-88 aspect-[607/411] opacity-25 sm:opacity-40 lg:opacity-55">
            <Image
              src="/images/landing/decorate2.png"
              alt=""
              fill
              sizes="(max-width: 640px) 192px, (max-width: 1024px) 272px, 352px"
              className="object-contain object-left"
            />
          </div>

          {/* 4. Phải dưới (Right Lower): So le lệch ở khoảng 76% */}
          <div className="absolute top-[76%] sm:top-[74%] -right-14 sm:-right-10 lg:-right-6 w-44 sm:w-64 lg:w-80 aspect-[605/412] opacity-25 sm:opacity-40 lg:opacity-55">
            <Image
              src="/images/landing/decorate1.png"
              alt=""
              fill
              sizes="(max-width: 640px) 176px, (max-width: 1024px) 256px, 320px"
              className="object-contain object-right"
            />
          </div>

          {/* 5. Trái chân trang (Left Bottom): Điểm xuyết ở góc dưới cùng bên trái */}
          <div className="absolute bottom-6 sm:bottom-12 lg:bottom-16 -left-14 sm:-left-10 lg:-left-6 w-40 sm:w-56 lg:w-72 aspect-[607/411] opacity-20 sm:opacity-30 lg:opacity-45">
            <Image
              src="/images/landing/decorate2.png"
              alt=""
              fill
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 224px, 288px"
              className="object-contain object-left-bottom"
            />
          </div>
        </>
      ) : (
        /* Dành cho trang ngắn hơn (như News): Điểm xuyết chân trang lệch bên trái */
        <div className="absolute bottom-8 sm:bottom-14 lg:bottom-20 -left-14 sm:-left-10 lg:-left-6 w-44 sm:w-60 lg:w-76 aspect-[607/411] opacity-25 sm:opacity-35 lg:opacity-50">
          <Image
            src="/images/landing/decorate2.png"
            alt=""
            fill
            sizes="(max-width: 640px) 176px, (max-width: 1024px) 240px, 304px"
            className="object-contain object-left-bottom"
          />
        </div>
      )}
    </div>
  );
}
