"use server";

import { optimizeAvatarImage } from "@/utils/imageOptimization";
import { uploadStorageImage, deleteStorageImage, listStorageFiles, type ListStorageResult } from "@/utils/storage/index";
import { getAccessibleFamilies, getIsSystemAdmin, getUser } from "@/utils/supabase/queries";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB input limit

export interface StorageUploadResult {
  success: boolean;
  publicUrl?: string;
  filePath?: string;
  error?: string;
}

export async function uploadAvatarAction(
  formData: FormData,
): Promise<StorageUploadResult> {
  try {
    const file = formData.get("file") as File | null;
    const familyId = (formData.get("familyId") as string | null) || "general";

    if (!file || file.size === 0) {
      return { success: false, error: "Không tìm thấy file ảnh để tải lên." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Dung lượng ảnh vượt quá giới hạn cho phép (tối đa 10MB).",
      };
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return {
        success: false,
        error: "Định dạng file không hợp lệ. Chỉ chấp nhận JPG, PNG, WebP hoặc GIF.",
      };
    }

    let optimized: Awaited<ReturnType<typeof optimizeAvatarImage>>;
    try {
      optimized = await optimizeAvatarImage(file, { maxDimension: 600 });
    } catch (optimizeError) {
      console.error("Avatar optimize error:", optimizeError);
      return {
        success: false,
        error:
          optimizeError instanceof Error
            ? optimizeError.message
            : "Không thể tối ưu hóa và chuyển đổi định dạng ảnh đại diện.",
      };
    }

    const cleanFamilyId = familyId.replace(/[^a-zA-Z0-9_\-]/g, "");

    // Upload using unified storage adapter with fallback to Supabase avatars bucket
    const result = await uploadStorageImage({
      file: optimized.buffer,
      folder: cleanFamilyId,
      fileNamePrefix: "avatar",
      maxDimension: 600,
      bucketFallback: "avatars",
    });

    // Reference optimized.contentType and optimized.extension for compatibility
    if (!result.success) {
      console.error("Storage upload error:", result.error);
      return {
        success: false,
        error: result.error || "Không thể lưu trữ ảnh trên máy chủ.",
      };
    }

    return {
      success: true,
      publicUrl: result.publicUrl,
      filePath: result.filePath,
    };
  } catch (err) {
    console.error("Upload avatar exception:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi không xác định khi tải ảnh lên.",
    };
  }
}

export async function deleteAvatarAction(
  filePath: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!filePath || typeof filePath !== "string") {
      return { success: true };
    }

    const result = await deleteStorageImage({
      filePath,
      bucketFallback: "avatars",
    });

    if (!result.success) {
      console.error("Storage delete error:", result.error);
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Lỗi khi xóa ảnh.",
    };
  }
}


export async function listMediaAction(
  familySlug?: string,
  continuationToken?: string
): Promise<ListStorageResult> {
  try {
    const user = await getUser();
    if (!user) {
      return {
        success: false,
        files: [],
        isTruncated: false,
        error: "Vui lòng đăng nhập để xem thư viện ảnh.",
      };
    }

    const isSystemAdmin = await getIsSystemAdmin();

    let targetFolder = "";

    if (familySlug) {
      const accessibleFamilies = await getAccessibleFamilies();
      const match = accessibleFamilies.find((f) => f.family.slug === familySlug);
      if (!match && !isSystemAdmin) {
        return {
          success: false,
          files: [],
          isTruncated: false,
          error: "Bạn không có quyền truy cập kho ảnh của dòng họ này.",
        };
      }
      if (match) {
        targetFolder = match.family.id;
      } else if (isSystemAdmin) {
        const { getSupabase } = await import("@/utils/supabase/queries");
        const supabase = await getSupabase();
        const { data: family } = await supabase
          .from("families")
          .select("id")
          .eq("slug", familySlug)
          .maybeSingle();
        if (family) {
          targetFolder = family.id;
        }
      }
    } else {
      if (!isSystemAdmin) {
        return {
          success: false,
          files: [],
          isTruncated: false,
          error: "Yêu cầu quyền Quản trị viên hệ thống.",
        };
      }
      targetFolder = "";
    }

    return await listStorageFiles({
      folder: targetFolder,
      maxKeys: 100,
      continuationToken,
    });
  } catch (err) {
    console.error("listMediaAction error:", err);
    return {
      success: false,
      files: [],
      isTruncated: false,
      error: err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải danh sách ảnh.",
    };
  }
}

export async function deleteMediaAction(
  filePath: string,
  familySlug?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Vui lòng đăng nhập." };
    }

    const isSystemAdmin = await getIsSystemAdmin();

    if (familySlug) {
      const accessibleFamilies = await getAccessibleFamilies();
      const match = accessibleFamilies.find((f) => f.family.slug === familySlug);
      if (!match && !isSystemAdmin) {
        return { success: false, error: "Bạn không có quyền quản lý ảnh của dòng họ này." };
      }
      if (match && !match.canEdit && !isSystemAdmin) {
        return { success: false, error: "Bạn không có quyền xóa ảnh trong dòng họ này." };
      }
      if (match && !filePath.startsWith(match.family.id) && !isSystemAdmin) {
        return { success: false, error: "Tệp tin không thuộc quyền quản lý của dòng họ này." };
      }
    } else {
      if (!isSystemAdmin) {
        return { success: false, error: "Yêu cầu quyền Quản trị viên hệ thống để xóa ảnh." };
      }
    }

    return await deleteStorageImage({ filePath });
  } catch (err) {
    console.error("deleteMediaAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Không thể xóa ảnh.",
    };
  }
}
