import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LandingNewsItem } from "./types";

interface LandingLatestNewsProps {
  news?: LandingNewsItem[];
}

const fallbackNews: LandingNewsItem[] = [
  {
    id: "fb-1",
    title: "Lễ giỗ Tổ dòng họ năm 2025",
    slug: "le-gio-to-dong-ho-nam-2025",
    date: "15/03/2025",
    excerpt:
      "Dòng họ đã long trọng tổ chức lễ giỗ Tổ vào ngày 15 tháng 3 năm 2025 tại nhà thờ họ với sự tham gia của đông đảo con cháu khắp mọi miền...",
    imageUrl: "/images/landing/nav-genealogy.png",
  },
  {
    id: "fb-2",
    title: "Cập nhật danh sách con cháu",
    slug: "cap-nhat-danh-sach-con-chau",
    date: "10/02/2025",
    excerpt:
      "Đã bổ sung thêm 23 thành viên mới trong danh sách con cháu của dòng họ, hoàn thiện hồ sơ phả hệ các đời gần đây...",
    imageUrl: "/images/landing/nav-members.png",
  },
  {
    id: "fb-3",
    title: "Số hóa gia phả dòng họ",
    slug: "so-hoa-gia-pha-dong-ho",
    date: "05/01/2025",
    excerpt:
      "Dự án số hóa gia phả chính thức được triển khai, nhằm lưu giữ và bảo tồn tư liệu quý của dòng họ trên nền tảng số hiện đại...",
    imageUrl: "/images/landing/nav-documents.png",
  },
];

export default function LandingLatestNews({ news }: LandingLatestNewsProps) {
  const displayNews = news && news.length > 0 ? news.slice(0, 3) : fallbackNews;

  return (
    <div className="relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 h-full flex flex-col shadow-[0_2px_12px_rgba(44,26,17,0.05)]">
      <div className="relative border border-[#deb887] bg-[#fffdf7] p-4 sm:p-5 flex flex-col justify-between h-full flex-1">
        {/* 4 Traditional Corner Brackets */}
        <span className="pointer-events-none absolute top-1 left-1 size-3 border-t-2 border-l-2 border-[#8c1d1d]" />
        <span className="pointer-events-none absolute top-1 right-1 size-3 border-t-2 border-r-2 border-[#8c1d1d]" />
        <span className="pointer-events-none absolute bottom-1 left-1 size-3 border-b-2 border-l-2 border-[#8c1d1d]" />
        <span className="pointer-events-none absolute bottom-1 right-1 size-3 border-b-2 border-r-2 border-[#8c1d1d]" />

        {/* Header with Title and "Xem tất cả" link */}
        <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#deb887]/60">
          <h2
            className="text-lg sm:text-xl font-bold text-[#183b28] uppercase tracking-normal leading-tight"
            style={{
              fontFamily:
                '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
            }}
          >
            Tin tức mới nhất
          </h2>
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-sans font-bold text-[#8c1d1d] hover:text-[#6e1616] transition-colors group"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="size-3.5 sm:size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* List of 3 Articles with thin dividers */}
        <div className="flex-1 flex flex-col justify-between divide-y divide-[#deb887]/50 pt-2">
          {displayNews.map((item) => (
            <Link
              key={item.id}
              href={item.slug.startsWith("http") ? item.slug : `/blog/${item.slug}`}
              className="group flex gap-3 sm:gap-3.5 py-2.5 first:pt-1 last:pb-0 transition-all duration-200"
            >
              {/* Thumbnail with gold frame */}
              <div className="relative w-16 sm:w-18 lg:w-20 aspect-[3/2] border border-[#deb887] bg-[#f5e7c7] overflow-hidden shrink-0">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="80px"
                    unoptimized={item.imageUrl.startsWith("http")}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-[#8c1d1d] font-bold text-xl">
                    祖
                  </div>
                )}
              </div>

              {/* Meta & Excerpt */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="font-sans text-xs sm:text-sm font-bold text-[#183b28] group-hover:text-[#8c1d1d] transition-colors truncate leading-snug">
                  {item.title}
                </h3>
                <p className="font-sans text-[10px] sm:text-[11px] font-medium text-[#7a6455] mt-0.5">
                  {item.date}
                </p>
                <p className="font-sans text-[11px] sm:text-xs text-[#5c4a3e] line-clamp-2 mt-0.5 leading-relaxed font-normal">
                  {item.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
