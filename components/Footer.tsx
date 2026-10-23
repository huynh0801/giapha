import { Landmark, Mail, Phone } from "lucide-react";

export interface FooterProps {
  className?: string;
  showDisclaimer?: boolean;
}

const currentYear = new Date().getFullYear();
const officialWebsiteUrl = "https://www.viendisanvanhoacdh.com/trang-ch%E1%BB%A7";

export default function Footer({
  className = "",
  showDisclaimer = false,
}: FooterProps) {
  return (
    <footer
      className={`border-t border-[#e8dccb] bg-[#fffdf8] text-sm text-stone-600 ${className}`}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 lg:px-8">
        {showDisclaimer && (
          <p className="w-fit rounded-lg border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800/80">
            Nội dung có thể thiếu sót. Vui lòng đóng góp để gia phả chính xác
            hơn.
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#eadfce] bg-white text-[#800000] shadow-sm">
              <Landmark className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-black uppercase tracking-tight text-[#800000]">
                GIA PHẢ DÒNG HỌ
              </p>
              <p className="mt-1 max-w-2xl leading-6 text-stone-500">
                Gìn giữ cội nguồn, kết nối thế hệ và số hóa tư liệu dòng họ một
                cách trang trọng.
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:flex lg:items-center">
            <a
              href="mailto:viendisanvanhoacdh@gmail.com"
              className="inline-flex h-10 min-w-0 items-center gap-2 rounded-lg border border-[#d9a04d] bg-white px-3 font-black text-[#800000] transition-colors hover:bg-amber-50"
            >
              <Mail className="size-4 shrink-0 text-[#b56a10]" />
              <span className="truncate">viendisanvanhoacdh@gmail.com</span>
            </a>
            <a
              href="tel:0911012110"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#eadfce] bg-white/70 px-3 font-bold text-stone-700 transition-colors hover:border-[#d9a04d] hover:bg-white hover:text-[#800000]"
            >
              <Phone className="size-4 shrink-0 text-[#b56a10]" />
              0911.012.110
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#eadfce] pt-4 text-xs font-semibold text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={officialWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit transition-colors hover:text-[#800000]"
          >
            Copyright © {currentYear} Viện Di sản Văn hóa Các Dòng họ Việt Nam.
          </a>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
