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
    <div className="flex flex-col h-full space-y-4">
      {/* Header with Title and "Xem tất cả" link */}
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2c1a11] tracking-normal">
          Tin tức mới nhất
        </h2>
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#8c1d1d] hover:text-[#b52a2a] transition-colors group"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* List of 3 Articles */}
      <div className="space-y-3.5">
        {displayNews.map((item) => (
          <Link
            key={item.id}
            href={item.slug.startsWith("http") ? item.slug : `/blog/${item.slug}`}
            className="group flex gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-[#faf0d7] border border-[#e2d0a8] hover:border-[#caa455] hover:shadow-[0_4px_16px_rgba(44,26,17,0.06)] transition-all duration-200"
          >
            {/* Thumbnail */}
            <div className="relative size-20 sm:size-24 rounded-xl overflow-hidden bg-[#eddcb7] shrink-0 border border-[#dfcda3]">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="96px"
                  unoptimized={item.imageUrl.startsWith("http")}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-[#8c1d1d] font-black text-2xl">
                  祖
                </div>
              )}
            </div>

            {/* Meta & Excerpt */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#2c1a11] group-hover:text-[#8c1d1d] transition-colors truncate leading-snug">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#8a7b6f] mt-0.5">
                {item.date}
              </p>
              <p className="text-sm sm:text-base text-[#5c4a3e] line-clamp-2 mt-1 leading-relaxed">
                {item.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
