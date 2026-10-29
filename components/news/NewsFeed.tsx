"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
  Search,
  SearchX,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { BlogPost } from "@/types";

type NewsPost = Pick<
  BlogPost,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "category"
  | "cover_image_url"
  | "published_at"
  | "created_at"
>;

function formatDate(value: string | null) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

interface NewsFeedProps {
  initialPosts: NewsPost[];
  initialTotalCount: number;
  initialTotalPages: number;
  initialPage: number;
  initialQuery?: string;
  initialCategory?: string;
  categories: string[];
}

export default function NewsFeed({
  initialPosts,
  initialTotalCount,
  initialTotalPages,
  initialPage,
  initialQuery = "",
  initialCategory = "",
  categories,
}: NewsFeedProps) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [posts, setPosts] = useState<NewsPost[]>(initialPosts);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<NewsPost[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const gridTopRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize state when server props update
  useEffect(() => {
    setPosts(initialPosts);
    setTotalCount(initialTotalCount);
    setTotalPages(initialTotalPages);
    setCurrentPage(initialPage);
  }, [initialPosts, initialTotalCount, initialTotalPages, initialPage]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update browser URL without triggering full page reload
  const updateUrl = useCallback((q: string, cat: string, page: number) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (cat.trim() && cat !== "all") params.set("category", cat.trim());
    if (page > 1) params.set("page", page.toString());
    const qs = params.toString();
    const newUrl = qs ? `/news?${qs}` : "/news";
    window.history.replaceState(null, "", newUrl);
  }, []);

  // AJAX Fetch Function
  const fetchNewsAjax = useCallback(
    async (q: string, cat: string, page: number) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        if (cat.trim() && cat !== "all") params.set("category", cat.trim());
        if (page > 1) params.set("page", page.toString());

        const res = await fetch(`/api/news/search?${params.toString()}`);
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();

        setPosts(data.posts || []);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);

        if (q.trim().length >= 2) {
          setSuggestions((data.posts || []).slice(0, 5));
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }

        updateUrl(q, cat, page);
      } catch (err) {
        console.error("AJAX news search error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [updateUrl]
  );

  // Debounced Search Input Handler
  const handleInputChange = (value: string) => {
    setSearchTerm(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchNewsAjax(value, selectedCategory, 1);
    }, 280);
  };

  const handleCategorySelect = (cat: string) => {
    const nextCat = selectedCategory === cat ? "" : cat;
    setSelectedCategory(nextCat);
    setShowDropdown(false);
    fetchNewsAjax(searchTerm, nextCat, 1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    fetchNewsAjax(searchTerm, selectedCategory, page);
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowDropdown(false);
    fetchNewsAjax("", selectedCategory, 1);
  };

  const handleResetAll = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setShowDropdown(false);
    fetchNewsAjax("", "", 1);
  };

  const hasFilterActive = Boolean(searchTerm.trim() || selectedCategory);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* AJAX Smart Search Bar & Category Chips */}
      <div className="w-full max-w-4xl mx-auto space-y-3.5 font-sans" ref={searchContainerRef}>
        {/* Khung thanh tìm kiếm thông minh phong cách hoàng gia */}
        <div className="relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/40 shadow-[0_2px_12px_rgba(44,26,17,0.06)]">
          <div className="relative border border-[#deb887] bg-[#fffdf7] p-2.5 sm:p-3.5">
            {/* 4 Góc trang trí hoa văn đỏ son truyền thống */}
            <span className="pointer-events-none absolute top-1 left-1 size-2.5 border-t-2 border-l-2 border-[#8c1d1d]" />
            <span className="pointer-events-none absolute top-1 right-1 size-2.5 border-t-2 border-r-2 border-[#8c1d1d]" />
            <span className="pointer-events-none absolute bottom-1 left-1 size-2.5 border-b-2 border-l-2 border-[#8c1d1d]" />
            <span className="pointer-events-none absolute bottom-1 right-1 size-2.5 border-b-2 border-r-2 border-[#8c1d1d]" />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowDropdown(false);
                fetchNewsAjax(searchTerm, selectedCategory, 1);
              }}
              className="flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="relative flex-1 w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8c1d1d]">
                  {isLoading ? (
                    <Loader2 className="size-4.5 animate-spin" />
                  ) : (
                    <Search className="size-4.5" />
                  )}
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => {
                    if (searchTerm.trim().length >= 2 && suggestions.length > 0) {
                      setShowDropdown(true);
                    }
                  }}
                  placeholder="Tìm kiếm..."
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-[#deb887] text-[#2c1a11] placeholder:text-[#8a7667] focus:outline-hidden focus:border-[#8c1d1d] focus:ring-1 focus:ring-[#8c1d1d] rounded-none shadow-inner"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    title="Xóa từ khóa"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8a7667] hover:text-[#8c1d1d] cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#8c1d1d] hover:bg-[#a62424] active:scale-[0.99] text-[#fffcf5] border border-[#caa455] text-xs sm:text-sm font-bold tracking-wide shadow-xs transition-all disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Search className="size-4" />
                )}
                <span>Tìm kiếm</span>
              </button>
            </form>

            {/* Smart Suggestions Dropdown (Live Preview) */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 z-40 bg-[#fffdf8] border-2 border-[#caa455] shadow-[0_16px_36px_rgba(44,26,17,0.18)] p-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-[#deb887]/50 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#8c1d1d]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="size-3.5" />
                    Gợi ý bài viết phù hợp ({suggestions.length})
                  </span>
                  <span className="text-[#8a7667] font-normal lowercase">bấm để đọc ngay</span>
                </div>
                <div className="divide-y divide-[#deb887]/30 max-h-80 overflow-y-auto">
                  {suggestions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/blog/${item.slug}`}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 p-2.5 hover:bg-[#f5e7c7]/50 transition-colors group"
                    >
                      <div className="relative size-12 shrink-0 border border-[#deb887] bg-[#f5e7c7] overflow-hidden">
                        <img
                          src={item.cover_image_url}
                          alt={item.title}
                          className="size-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[10px] text-[#7a6455]">
                          <span className="font-bold text-[#8c1d1d] uppercase">
                            {item.category || "Tin tức"}
                          </span>
                          <span>&bull;</span>
                          <span>{formatDate(item.published_at || item.created_at)}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#183b28] group-hover:text-[#8c1d1d] truncate transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <ArrowRight className="size-4 text-[#8a7667] group-hover:text-[#8c1d1d] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Danh mục (Category Chips) & Bộ lọc */}
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
                onClick={() => handleCategorySelect("")}
                className={`px-3 py-1 text-xs font-semibold border transition-all cursor-pointer ${
                  !selectedCategory
                    ? "bg-[#8c1d1d] text-white border-[#caa455] shadow-2xs font-bold"
                    : "bg-[#fffdf7] text-[#5c4a3e] border-[#deb887] hover:border-[#8c1d1d] hover:text-[#8c1d1d]"
                }`}
              >
                Tất cả
              </button>

              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
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
              {searchTerm.trim() ? (
                <>
                  Kết quả tìm kiếm:{" "}
                  <strong className="text-[#8c1d1d] font-bold">&ldquo;{searchTerm.trim()}&rdquo;</strong>
                  {selectedCategory ? ` trong chuyên mục "${selectedCategory}"` : ""}
                </>
              ) : (
                <>
                  Chuyên mục:{" "}
                  <strong className="text-[#8c1d1d] font-bold">&ldquo;{selectedCategory}&rdquo;</strong>
                </>
              )}
              {" "}&bull; Có <strong className="text-[#183b28] font-bold">{totalCount}</strong> bài viết phù hợp.
            </span>
          </div>
        )}
      </div>

      <div ref={gridTopRef} />

      {/* Grid of Articles với hiệu ứng mượt mà khi AJAX cập nhật */}
      {posts.length > 0 && (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 transition-opacity duration-200 ${
            isLoading ? "opacity-60 pointer-events-none" : "opacity-100"
          }`}
        >
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 hover:border-[#8c1d1d] transition-all shadow-[0_2px_12px_rgba(44,26,17,0.05)]"
            >
              <div className="relative border border-[#deb887] bg-[#fffdf7] group-hover:bg-[#fffefb] p-4 flex flex-col justify-between h-full transition-colors">
                {/* 4 Traditional Corner Brackets for each card */}
                <span className="pointer-events-none absolute top-1 left-1 size-3 border-t-2 border-l-2 border-[#8c1d1d]" />
                <span className="pointer-events-none absolute top-1 right-1 size-3 border-t-2 border-r-2 border-[#8c1d1d]" />
                <span className="pointer-events-none absolute bottom-1 left-1 size-3 border-b-2 border-l-2 border-[#8c1d1d]" />
                <span className="pointer-events-none absolute bottom-1 right-1 size-3 border-b-2 border-r-2 border-[#8c1d1d]" />

                <div>
                  {/* Image with gold framing */}
                  <div className="relative aspect-[16/10] w-full border border-[#deb887] bg-[#f5e7c7] overflow-hidden mb-3">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Meta: Category & Date */}
                  <div className="flex items-center justify-between gap-2 border-b border-[#deb887]/50 pb-1.5 mb-2 font-sans">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c1d1d]">
                      {post.category || "Tin tức"}
                    </span>
                    <span className="text-[11px] text-[#7a6455]">
                      {formatDate(post.published_at || post.created_at)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-sm sm:text-base font-bold text-[#183b28] group-hover:text-[#8c1d1d] transition-colors leading-snug line-clamp-2"
                    style={{
                      fontFamily:
                        '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                    }}
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="mt-2 text-xs text-[#5c4a3e] leading-relaxed line-clamp-2 font-sans">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                {/* Read more button */}
                <div className="mt-4 pt-2.5 border-t border-[#deb887]/50 flex items-center justify-end text-xs font-bold text-[#8c1d1d] group-hover:translate-x-0.5 transition-transform gap-1 font-sans">
                  <span>Xem chi tiết</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Phân Trang (AJAX Pagination Controls) */}
      {totalCount > 0 && (
        <div className="pt-6 sm:pt-8 border-t border-[#deb887]/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <div className="text-xs text-[#5c4a3e]">
            Hiển thị trang <strong className="text-[#183b28]">{currentPage}</strong> /{" "}
            <strong className="text-[#183b28]">{totalPages}</strong> (Tổng số{" "}
            <strong className="text-[#8c1d1d]">{totalCount}</strong> bản tin)
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              {/* Nút Trang Trước */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#deb887] bg-[#fffdf7] text-xs font-bold text-[#183b28] hover:border-[#8c1d1d] hover:text-[#8c1d1d] transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="size-3.5" />
                <span>Trước</span>
              </button>

              {/* Danh Sách Các Số Trang */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === currentPage;
                return isActive ? (
                  <span
                    key={pageNum}
                    className="size-8 flex items-center justify-center border-2 border-[#caa455] bg-[#8c1d1d] text-white text-xs font-bold shadow-xs select-none"
                  >
                    {pageNum}
                  </span>
                ) : (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isLoading}
                    className="size-8 flex items-center justify-center border border-[#deb887] bg-[#fffdf7] text-xs font-bold text-[#183b28] hover:border-[#8c1d1d] hover:text-[#8c1d1d] transition-colors shadow-2xs cursor-pointer"
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Nút Trang Sau */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#deb887] bg-[#fffdf7] text-xs font-bold text-[#183b28] hover:border-[#8c1d1d] hover:text-[#8c1d1d] transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Sau</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State: Khi không có kết quả */}
      {posts.length === 0 && (
        <div className="relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 max-w-xl mx-auto my-12 font-sans">
          <div className="relative border border-[#deb887] bg-[#fffdf7] p-8 sm:p-10 text-center space-y-4">
            <span className="pointer-events-none absolute top-1.5 left-1.5 size-3.5 border-t-2 border-l-2 border-[#8c1d1d]" />
            <span className="pointer-events-none absolute top-1.5 right-1.5 size-3.5 border-t-2 border-r-2 border-[#8c1d1d]" />
            <span className="pointer-events-none absolute bottom-1.5 left-1.5 size-3.5 border-b-2 border-l-2 border-[#8c1d1d]" />
            <span className="pointer-events-none absolute bottom-1.5 right-1.5 size-3.5 border-b-2 border-r-2 border-[#8c1d1d]" />

            <div className="inline-flex items-center justify-center size-14 border border-[#caa455] bg-[#fcf5e5] text-[#8c1d1d] shadow-2xs">
              {hasFilterActive ? (
                <SearchX className="size-7" />
              ) : (
                <BookOpen className="size-7" />
              )}
            </div>

            <h3
              className="text-lg sm:text-xl font-bold text-[#183b28]"
              style={{
                fontFamily:
                  '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
              }}
            >
              {hasFilterActive
                ? "Không Tìm Thấy Bản Tin Phù Hợp"
                : "Chưa Có Bản Tin Nào"}
            </h3>

            <p className="text-xs sm:text-sm text-[#5c4a3e] max-w-md mx-auto leading-relaxed font-sans">
              {hasFilterActive ? (
                searchTerm.trim() ? (
                  <>
                    Không tìm thấy bài viết nào khớp với từ khóa &ldquo;
                    <strong className="text-[#8c1d1d]">{searchTerm.trim()}</strong>&rdquo;
                    {selectedCategory ? ` trong chuyên mục "${selectedCategory}"` : ""}.
                    Vui lòng thử từ khóa khác hoặc xóa bộ lọc.
                  </>
                ) : (
                  <>
                    Không có bài viết nào trong chuyên mục &ldquo;
                    <strong className="text-[#8c1d1d]">{selectedCategory}</strong>&rdquo;.
                  </>
                )
              ) : (
                "Nội dung sự kiện, lễ giỗ tổ và các hoạt động dòng tộc sẽ sớm được ban biên tập cập nhật và đăng tải tại đây."
              )}
            </p>

            {hasFilterActive && (
              <div className="pt-2 font-sans">
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8c1d1d] hover:bg-[#a62424] text-white text-xs sm:text-sm font-bold border border-[#caa455] transition-colors shadow-xs cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Xem tất cả bản tin</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
