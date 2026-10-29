"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserAction } from "@/app/actions/auth";
import { crawlBaomoiQuangBinhNews } from "@/lib/crawler/baomoi";

export interface CrawlActionResponse {
  success: boolean;
  message: string;
  count?: number;
  skipped?: number;
  errors?: string[];
}

/**
 * Triggers crawling of latest news from Báo Mới (Quảng Bình tag).
 * Only accessible to active Super Admins.
 */
export async function triggerBaomoiCrawlAction(options?: {
  limit?: number;
}): Promise<CrawlActionResponse> {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== "system_admin") {
      return {
        success: false,
        message: "Chỉ Super Admin đang hoạt động mới có quyền kích hoạt cào tin tức.",
      };
    }

    const limit = options?.limit ?? 20;
    const crawlResult = await crawlBaomoiQuangBinhNews({ limit });

    revalidatePath("/news");
    revalidatePath("/");
    revalidatePath("/admin/blog");

    const pruneNote =
      crawlResult.totalPruned && crawlResult.totalPruned > 0
        ? ` Đã dọn dẹp ${crawlResult.totalPruned} bài viết cũ để duy trì 100 bài.`
        : "";

    if (crawlResult.totalCrawled > 0) {
      return {
        success: true,
        message: `Đã cào và đăng thành công ${crawlResult.totalCrawled} bài viết mới từ Báo Mới (Quảng Bình). (Bỏ qua ${crawlResult.totalSkipped} bài đã có).${pruneNote}`,
        count: crawlResult.totalCrawled,
        skipped: crawlResult.totalSkipped,
        errors: crawlResult.errors,
      };
    } else if (crawlResult.totalSkipped > 0) {
      return {
        success: true,
        message: `Hệ thống đã kiểm tra: Toàn bộ ${crawlResult.totalSkipped} bài viết mới nhất trên Báo Mới (Quảng Bình) đều đã tồn tại trong cơ sở dữ liệu. Không có bài trùng lặp nào được thêm.${pruneNote}`,
        count: 0,
        skipped: crawlResult.totalSkipped,
        errors: crawlResult.errors,
      };
    } else {
      const errorDetail =
        crawlResult.errors && crawlResult.errors.length > 0
          ? ` Chi tiết: ${crawlResult.errors.join("; ")}`
          : "";
      return {
        success: false,
        message: `Không thể lấy được bài viết mới từ Báo Mới (Quảng Bình). Vui lòng kiểm tra lại kết nối mạng hoặc cấu hình biến môi trường.${errorDetail}`,
        errors: crawlResult.errors,
      };
    }
  } catch (err: any) {
    console.error("triggerBaomoiCrawlAction error:", err);
    return {
      success: false,
      message: `Lỗi máy chủ khi cào tin tức: ${err.message}`,
    };
  }
}

/**
 * Alias maintaining backwards compatibility with existing hoatrach references.
 */
export async function triggerHoatrachCrawlAction(options?: {
  limit?: number;
}): Promise<CrawlActionResponse> {
  return triggerBaomoiCrawlAction(options);
}
