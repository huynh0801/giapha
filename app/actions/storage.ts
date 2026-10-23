"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
        error: "Dung lượng ảnh vượt quá giới hạn cho phép (tối đa 5MB).",
      };
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return {
        success: false,
        error: "Định dạng file không hợp lệ. Chỉ chấp nhận JPG, PNG, WebP hoặc GIF.",
      };
    }

    const rawExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const extension = ["jpg", "jpeg", "png", "webp", "gif"].includes(rawExt)
      ? rawExt
      : "jpg";

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${extension}`;
    const cleanFamilyId = familyId.replace(/[^a-zA-Z0-9_\-]/g, "");
    const filePath = `${cleanFamilyId}/${fileName}`;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return {
        success: false,
        error: "Không thể lưu trữ ảnh trên máy chủ: " + uploadError.message,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return {
      success: true,
      publicUrl,
      filePath,
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

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.storage
      .from("avatars")
      .remove([filePath]);

    if (error) {
      console.error("Storage delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Lỗi khi xóa ảnh.",
    };
  }
}
