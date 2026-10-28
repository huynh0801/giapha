"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserAction } from "@/app/actions/auth";
import { crawlHoatrachLatestNews } from "@/lib/crawler/hoatrach";

export async function triggerHoatrachCrawlAction(options?: { limit?: number }): Promise<{
  success: boolean;
  message: string;
  count?: number;
  skipped?: number;
  errors?: string[];
}> {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== "system_admin") {
      return {
        success: false,
        message: "Chỉ Super Admin đang hoạt động mới có quyền kích hoạt cào tin tức.",
      };
    }

    const limit = options?.limit ?? 20;
    const crawlResult = await crawlHoatrachLatestNews({ limit });

    revalidatePath("/news");
    revalidatePath("/");
    revalidatePath("/admin/blog");

    if (crawlResult.totalCrawled > 0) {
      return {
        success: true,
        message: `Đã cào và đăng thành công ${crawlResult.totalCrawled} bài viết mới từ Cổng thông tin UBND Xã Hòa Trạch. (Bỏ qua ${crawlResult.totalSkipped} bài đã có).`,
        count: crawlResult.totalCrawled,
        skipped: crawlResult.totalSkipped,
        errors: crawlResult.errors,
      };
    } else if (crawlResult.totalSkipped > 0) {
      return {
        success: true,
        message: `Hệ thống đã kiểm tra: Toàn bộ ${crawlResult.totalSkipped} bài viết mới nhất trên cổng Hòa Trạch đều đã tồn tại trong cơ sở dữ liệu. Không có bài trùng lặp nào được thêm.`,
        count: 0,
        skipped: crawlResult.totalSkipped,
        errors: crawlResult.errors,
      };
    } else {
      return {
        success: false,
        message: `Không thể lấy được bài viết mới từ cổng Hòa Trạch. Vui lòng kiểm tra lại kết nối mạng hoặc server nguồn.`,
        errors: crawlResult.errors,
      };
    }
  } catch (err: any) {
    console.error("triggerHoatrachCrawlAction error:", err);
    return {
      success: false,
      message: `Lỗi máy chủ khi cào tin tức: ${err.message}`,
    };
  }
}
