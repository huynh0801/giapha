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
    <div className="relative overflow-hidden rounded-3xl bg-[#fcf5e5] border border-[#e2d0a8] shadow-[0_4px_20px_rgba(44,26,17,0.05)] p-5 sm:p-6 lg:p-7 flex flex-col justify-between h-full">
      {/* Header with Title and "Xem tất cả" link */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e2d0a8]/60">
        <h2
          className="text-xl sm:text-2xl lg:text-[1.65rem] font-bold text-[#183b28] tracking-tight leading-tight"
          style={{ fontFamily: '"SVN-Studio Brush", Georgia, serif' }}
        >
          Tin tức mới nhất
        </h2>
        <Link
          href="/news"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-sans font-bold text-[#8c1d1d] hover:text-[#b52a2a] transition-colors group"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="size-3.5 sm:size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* List of 3 Articles with thin dividers */}
      <div className="flex-1 flex flex-col justify-between divide-y divide-[#e2d0a8]/70 pt-2 sm:pt-2.5">
        {displayNews.map((item) => (
          <Link
            key={item.id}
            href={item.slug.startsWith("http") ? item.slug : `/blog/${item.slug}`}
            className="group flex gap-3 sm:gap-3.5 py-2.5 sm:py-3 first:pt-1 last:pb-0 transition-all duration-200"
          >
            {/* Thumbnail - landscape aspect ratio showing full image */}
            <div className="relative w-18 sm:w-20 aspect-[3/2] rounded-xl overflow-hidden bg-[#eddcb7] shrink-0 border border-[#dfcda3]">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="80px"
                  unoptimized={item.imageUrl.startsWith("http")}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-[#8c1d1d] font-bold text-xl">
                  祖
                </div>
              )}
            </div>

            {/* Meta & Excerpt */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="font-sans text-xs sm:text-sm font-bold text-[#2c1a11] group-hover:text-[#8c1d1d] transition-colors truncate leading-snug">
                {item.title}
              </h3>
              <p className="font-sans text-[10px] sm:text-[11px] font-semibold text-[#8a7b6f] mt-0.5">
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
  );
}
