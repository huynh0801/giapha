import Image from "next/image";

interface BackgroundDecorProps {
  /**
   * Whether to include subtle middle left/right ornaments (recommended for tall pages like About).
   */
  withMid?: boolean;
}

export default function BackgroundDecor({ withMid = false }: BackgroundDecorProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden z-0"
    >
      {/* Top Left: decorate2 */}
      <div className="absolute -top-6 -left-10 sm:-top-8 sm:-left-6 lg:left-0 w-48 sm:w-72 lg:w-96 aspect-[607/411] opacity-35 sm:opacity-55 lg:opacity-75">
        <Image
          src="/images/landing/decorate2.png"
          alt=""
          fill
          sizes="(max-width: 640px) 192px, (max-width: 1024px) 288px, 384px"
          priority
          className="object-contain object-left-top"
        />
      </div>

      {/* Top Right: decorate1 */}
      <div className="absolute -top-6 -right-10 sm:-top-8 sm:-right-6 lg:right-0 w-48 sm:w-72 lg:w-96 aspect-[605/412] opacity-35 sm:opacity-55 lg:opacity-75">
        <Image
          src="/images/landing/decorate1.png"
          alt=""
          fill
          sizes="(max-width: 640px) 192px, (max-width: 1024px) 288px, 384px"
          priority
          className="object-contain object-right-top"
        />
      </div>

      {/* Middle Left & Right (for long content pages) */}
      {withMid && (
        <>
          <div className="absolute top-1/2 -translate-y-1/2 -left-12 sm:-left-8 lg:left-0 w-44 sm:w-64 lg:w-80 aspect-[607/411] opacity-20 sm:opacity-35 lg:opacity-50">
            <Image
              src="/images/landing/decorate2.png"
              alt=""
              fill
              sizes="(max-width: 640px) 176px, (max-width: 1024px) 256px, 320px"
              className="object-contain object-left"
            />
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-12 sm:-right-8 lg:right-0 w-44 sm:w-64 lg:w-80 aspect-[605/412] opacity-20 sm:opacity-35 lg:opacity-50">
            <Image
              src="/images/landing/decorate1.png"
              alt=""
              fill
              sizes="(max-width: 640px) 176px, (max-width: 1024px) 256px, 320px"
              className="object-contain object-right"
            />
          </div>
        </>
      )}

      {/* Bottom Left: decorate2 */}
      <div className="absolute bottom-4 -left-12 sm:bottom-8 sm:-left-8 lg:left-0 w-44 sm:w-64 lg:w-80 aspect-[607/411] opacity-25 sm:opacity-40 lg:opacity-55">
        <Image
          src="/images/landing/decorate2.png"
          alt=""
          fill
          sizes="(max-width: 640px) 176px, (max-width: 1024px) 256px, 320px"
          className="object-contain object-left-bottom"
        />
      </div>

      {/* Bottom Right: decorate1 */}
      <div className="absolute bottom-4 -right-12 sm:bottom-8 sm:-right-8 lg:right-0 w-44 sm:w-64 lg:w-80 aspect-[605/412] opacity-25 sm:opacity-40 lg:opacity-55">
        <Image
          src="/images/landing/decorate1.png"
          alt=""
          fill
          sizes="(max-width: 640px) 176px, (max-width: 1024px) 256px, 320px"
          className="object-contain object-right-bottom"
        />
      </div>
    </div>
  );
}
