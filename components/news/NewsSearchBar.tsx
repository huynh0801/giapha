"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X, RotateCcw, Tag } from "lucide-react";

interface NewsSearchBarProps {
  initialQuery?: string;
  initialCategory?: string;
  categories: string[];
  totalResults: number;
}

export default function NewsSearchBar({
  initialQuery = "",
  initialCategory = "",
  categories = [],
  totalResults,
}: NewsSearchBarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const applySearch = (newQuery: string, newCategory: string) => {
    const params = new URLSearchParams();
    const trimmedQ = newQuery.trim();
    if (trimmedQ) {
      params.set("q", trimmedQ);
    }
    if (newCategory && newCategory !== "all") {
      params.set("category", newCategory);
    }

    const queryString = params.toString();
    const targetUrl = queryString ? `/news?${queryString}` : "/news";

    startTransition(() => {
      router.push(targetUrl);
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    applySearch(searchTerm, initialCategory);
  };

  const handleClear = () => {
    setSearchTerm("");
    applySearch("", initialCategory);
  };

  const handleCategoryClick = (cat: string) => {
    const nextCat = initialCategory === cat ? "" : cat;
    applySearch(searchTerm, nextCat);
  };

  const handleResetAll = () => {
    setSearchTerm("");
    startTransition(() => {
      router.push("/news");
    });
  };

  const hasFilterActive = Boolean(initialQuery || initialCategory);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3.5 font-sans">
      {/* Khung thanh tìm kiếm phong cách hoàng gia */}
      <div className="relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/40 shadow-[0_2px_12px_rgba(44,26,17,0.06)]">
        <div className="relative border border-[#deb887] bg-[#fffdf7] p-2.5 sm:p-3.5">
          {/* 4 Góc trang trí hoa văn đỏ son truyền thống */}
          <span className="pointer-events-none absolute top-1 left-1 size-2.5 border-t-2 border-l-2 border-[#8c1d1d]" />
          <span className="pointer-events-none absolute top-1 right-1 size-2.5 border-t-2 border-r-2 border-[#8c1d1d]" />
          <span className="pointer-events-none absolute bottom-1 left-1 size-2.5 border-b-2 border-l-2 border-[#8c1d1d]" />
          <span className="pointer-events-none absolute bottom-1 right-1 size-2.5 border-b-2 border-r-2 border-[#8c1d1d]" />

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8c1d1d]">
                <Search className="size-4.5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm bài viết, sự kiện, câu chuyện lịch sử dòng họ..."
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-[#deb887] text-[#2c1a11] placeholder:text-[#8a7667] focus:outline-hidden focus:border-[#8c1d1d] focus:ring-1 focus:ring-[#8c1d1d] rounded-none shadow-inner"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Xóa từ khóa"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8a7667] hover:text-[#8c1d1d]"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#8c1d1d] hover:bg-[#a62424] active:scale-[0.99] text-[#fffcf5] border border-[#caa455] text-xs sm:text-sm font-bold tracking-wide shadow-xs transition-all disabled:opacity-60 cursor-pointer"
            >
              <Search className="size-4" />
              <span>{isPending ? "Đang tìm..." : "Tìm kiếm"}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Danh mục (Category Chips) & Trạng thái bộ lọc */}
      {(categories.length > 0 || hasFilterActive) && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1 text-[#7a6455] font-semibold mr-1">
              <Tag className="size-3.5 text-[#8c1d1d]" />
              <span>Chủ đề:</span>
            </span>

            <button
              type="button"
              onClick={() => handleCategoryClick("")}
              className={`px-3 py-1 text-xs font-semibold border transition-all cursor-pointer ${
                !initialCategory
                  ? "bg-[#8c1d1d] text-white border-[#caa455] shadow-2xs font-bold"
                  : "bg-[#fffdf7] text-[#5c4a3e] border-[#deb887] hover:border-[#8c1d1d] hover:text-[#8c1d1d]"
              }`}
            >
              Tất cả
            </button>

            {categories.map((cat) => {
              const active = initialCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-3 py-1 text-xs font-semibold border transition-all cursor-pointer ${
                    active
                      ? "bg-[#8c1d1d] text-white border-[#caa455] shadow-2xs font-bold"
                      : "bg-[#fffdf7] text-[#5c4a3e] border-[#deb887] hover:border-[#8c1d1d] hover:text-[#8c1d1d]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Reset button when filter is active */}
          {hasFilterActive && (
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[#8c1d1d] hover:text-[#a62424] hover:underline font-semibold transition-colors cursor-pointer ml-auto"
            >
              <RotateCcw className="size-3" />
              <span>Xem tất cả bản tin</span>
            </button>
          )}
        </div>
      )}

      {/* Thông báo kết quả tìm kiếm khi đang lọc */}
      {hasFilterActive && (
        <div className="flex items-center justify-between text-xs text-[#5c4a3e] px-1 pt-0.5 border-b border-[#deb887]/40 pb-2">
          <span>
            {initialQuery ? (
              <>
                Kết quả tìm kiếm cho từ khóa:{" "}
                <strong className="text-[#8c1d1d] font-bold">&ldquo;{initialQuery}&rdquo;</strong>
                {initialCategory ? ` thuộc chuyên mục "${initialCategory}"` : ""}
              </>
            ) : (
              <>
                Đang lọc theo chuyên mục:{" "}
                <strong className="text-[#8c1d1d] font-bold">&ldquo;{initialCategory}&rdquo;</strong>
              </>
            )}
            {" "}&bull; Có <strong className="text-[#183b28] font-bold">{totalResults}</strong> bài viết phù hợp.
          </span>
        </div>
      )}
    </div>
  );
}
