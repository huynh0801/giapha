"use server";

import { BlogPost, PostScope } from "@/types";
import {
  countBlogImages,
  getBlogImageLimitError,
  getFamilyBlogImageLimit,
} from "@/utils/blogImageRules";
import {
  uploadStorageImage,
  deleteStorageImage,
} from "@/utils/storage/index";
import {
  getFamilyContextById,
  getProfile,
  getSupabase,
} from "@/utils/supabase/queries";
import { generateUniqueSlug, slugify } from "@/utils/slug";
import { revalidatePath } from "next/cache";

function getText(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() || "";
}

function sanitizeBlogContent(content: string) {
  return content
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

function normalizeSavedBlogContent(content: string) {
  return sanitizeBlogContent(content)
    .replace(
      /<figcaption(?:\s+[^>]*)?>\s*(?:Chú thích ảnh|Chú thích dưới ảnh|&nbsp;|<br\s*\/?>|\s)*\s*<\/figcaption>/gi,
      "",
    )
    .replace(/\sdata-placeholder="[^"]*"/gi, "");
}

async function ensureBlogAccess(scope: PostScope, familyId?: string) {
  if (scope === "system") {
    const profile = await getProfile();
    if (
      !profile?.is_active ||
      profile.role !== "system_admin" ||
      profile.must_change_password
    ) {
      return {
        error:
          "Chỉ Super Admin đang hoạt động mới có quyền đăng bài lên trang chính.",
      };
    }
    return { profile, context: null };
  }

  if (!familyId) {
    return { error: "Thiếu thông tin dòng họ cho bài viết nội bộ." };
  }

  const context = await getFamilyContextById(familyId);
  if (!context?.canEdit) {
    return {
      error:
        "Bạn không có quyền quản lý blog của dòng họ này. Chỉ Admin dòng họ active của đúng dòng họ mới được thao tác.",
    };
  }

  return { profile: null, context };
}

function getStoragePrefix(scope: PostScope, familyId?: string) {
  return scope === "family" && familyId ? `families/${familyId}` : "system";
}

function getSafeCount(formData: FormData, key: string) {
  const value = Number.parseInt(getText(formData, key), 10);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
}

async function uploadBlogImage(
  file: File,
  slug: string,
  scope: PostScope,
  familyId: string | null,
  folder: "covers" | "inline",
) {
  if (file.size > 15 * 1024 * 1024) {
    return { error: "Ảnh upload không được vượt quá 15MB." };
  }

  const prefix = getStoragePrefix(scope, familyId || undefined);
  const targetFolder = `${prefix}/${folder}`;
  const fileNamePrefix =
    folder === "covers" ? (slug ? `cover-${slug}` : "cover") : "inline";

  const result = await uploadStorageImage({
    file,
    folder: targetFolder,
    fileNamePrefix,
    maxDimension: folder === "covers" ? 1800 : 1600,
    quality: 78,
    bucketFallback: "blog-images",
  });

  if (!result.success || !result.publicUrl || !result.filePath) {
    return { error: result.error || "Không thể upload ảnh." };
  }

  return { publicUrl: result.publicUrl, filePath: result.filePath };
}

async function saveScopedBlogPost(scope: PostScope, formData: FormData) {
  const familyId = scope === "family" ? getText(formData, "family_id") : null;
  const access = await ensureBlogAccess(scope, familyId || undefined);
  if ("error" in access) return access;

  const id = getText(formData, "id");
  const title = getText(formData, "title");
  const requestedSlug = getText(formData, "slug");
  const excerpt = getText(formData, "excerpt");
  const category =
    getText(formData, "category") ||
    (scope === "family" ? "TIN NỘI BỘ DÒNG HỌ" : "VĂN HÓA DÒNG HỌ");
  const content = normalizeSavedBlogContent(getText(formData, "content"));
  const existingCoverUrl = getText(formData, "existing_cover_image_url");
  const existingCoverPath = getText(formData, "existing_cover_image_path");
  const existingPublishedAt = getText(formData, "existing_published_at");
  const rawPublished = formData.get("is_published");
  const isPublished =
    rawPublished === "on" ||
    rawPublished === "true" ||
    rawPublished === "1" ||
    rawPublished === "published";
  const image = formData.get("cover_image");
  const removeCoverImage = formData.get("remove_cover_image") === "1";

  if (!title) return { error: "Tiêu đề là bắt buộc." };
  if (!content) return { error: "Nội dung bài viết là bắt buộc." };

  const baseSlug = slugify(requestedSlug || title);
  if (!baseSlug) return { error: "Slug không hợp lệ." };

  const supabase = await getSupabase();
  const slug = await generateUniqueSlug(baseSlug, async (candidate) => {
    let query = supabase
      .from("blog_posts")
      .select("id")
      .eq("scope", scope)
      .eq("slug", candidate);

    if (familyId) {
      query = query.eq("family_id", familyId);
    } else {
      query = query.is("family_id", null);
    }

    if (id) {
      query = query.neq("id", id);
    }

    const { data } = await query.maybeSingle();
    return Boolean(data);
  });

  let coverImageUrl = existingCoverUrl;
  let coverImagePath = existingCoverPath || null;

  // Cover images allowed for family posts

  if (removeCoverImage) {
    coverImageUrl = "";
    coverImagePath = null;
  }

  if (scope === "family" && access.context) {
    const imageLimit = getFamilyBlogImageLimit(access.context.family.settings);
    const nextImageCount = countBlogImages(content);

    if (imageLimit !== null && nextImageCount > imageLimit) {
      return { error: getBlogImageLimitError(imageLimit) };
    }
  }

  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) {
      return { error: "Ảnh bìa phải là file hình ảnh." };
    }
    const uploaded = await uploadBlogImage(
      image,
      slug,
      scope,
      familyId,
      "covers",
    );
    if ("error" in uploaded) {
      return { error: `Không thể upload ảnh bìa: ${uploaded.error}` };
    }
    coverImageUrl = uploaded.publicUrl;
    coverImagePath = uploaded.filePath;
  }

  if (scope === "system" && !coverImageUrl) {
    return { error: "Ảnh bìa là bắt buộc khi tạo bài viết hệ thống." };
  }

  // Multiple notices allowed for family scope

  const publishedAt = isPublished
    ? existingPublishedAt || new Date().toISOString()
    : null;

  const payload = {
    scope,
    family_id: familyId,
    title,
    slug,
    excerpt: excerpt || null,
    category,
    content,
    cover_image_url: coverImageUrl,
    cover_image_path: coverImagePath,
    is_published: isPublished,
    status: isPublished ? "published" : "draft",
    visibility: isPublished ? (scope === "system" ? "public" : (getText(formData, "visibility") === "family_only" ? "family_only" : "public")) : "private",
    published_at: publishedAt,
  };

  const result = id
    ? await supabase
        .from("blog_posts")
        .update(payload)
        .eq("id", id)
        .eq("scope", scope)
        .select("*")
        .single()
    : await supabase
        .from("blog_posts")
        .insert(payload)
        .select("*")
        .single();

  if (result.error) {
    return { error: result.error.message };
  }

  if (
    existingCoverPath &&
    existingCoverPath !== coverImagePath
  ) {
    await deleteStorageImage({
      filePath: existingCoverPath,
      bucketFallback: "blog-images",
    });
  }

  const savedPost = result.data as BlogPost;

  if (scope === "system") {
    revalidatePath("/");
    revalidatePath("/news");
    revalidatePath("/admin");
    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${savedPost.slug}`);
  } else if (access.context) {
    const familySlug = access.context.family.slug;
    revalidatePath(`/dashboard/${familySlug}`);
    revalidatePath(`/dashboard/${familySlug}/blog`);
    revalidatePath(`/dashboard/${familySlug}/blog/${savedPost.slug}`);
  }

  return { success: true, post: savedPost };
}

async function uploadScopedInlineImage(scope: PostScope, formData: FormData) {
  const familyId = scope === "family" ? getText(formData, "family_id") : null;
  const access = await ensureBlogAccess(scope, familyId || undefined);
  if ("error" in access) return access;

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return { error: "Vui lòng chọn ảnh cần chèn." };
  }

  if (!image.type.startsWith("image/")) {
    return { error: "File chèn vào bài phải là hình ảnh." };
  }

  if (scope === "family" && access.context) {
    const imageLimit = getFamilyBlogImageLimit(access.context.family.settings);
    const currentContent = sanitizeBlogContent(getText(formData, "current_content"));
    const coverImageCount = getSafeCount(formData, "cover_image_count");
    const nextImageCount =
      coverImageCount + countBlogImages(currentContent) + 1;

    if (imageLimit !== null && nextImageCount > imageLimit) {
      return { error: getBlogImageLimitError(imageLimit) };
    }
  }

  const uploaded = await uploadBlogImage(
    image,
    "inline",
    scope,
    familyId,
    "inline",
  );
  if ("error" in uploaded) {
    return { error: `Không thể upload ảnh: ${uploaded.error}` };
  }

  return {
    success: true,
    url: uploaded.publicUrl,
    path: uploaded.filePath,
  };
}

async function deleteScopedBlogPost(scope: PostScope, formData: FormData) {
  const familyId = scope === "family" ? getText(formData, "family_id") : null;
  const access = await ensureBlogAccess(scope, familyId || undefined);
  if ("error" in access) return access;

  const id = getText(formData, "id");
  const slug = getText(formData, "slug");
  const coverImagePath = getText(formData, "cover_image_path");

  if (!id) return { error: "Thiếu ID bài viết." };

  const supabase = await getSupabase();
  let query = supabase.from("blog_posts").delete().eq("id", id).eq("scope", scope);
  if (scope === "family") {
    query = query.eq("family_id", familyId);
  } else {
    query = query.is("family_id", null);
  }

  const { error } = await query;
  if (error) return { error: error.message };

  if (coverImagePath) {
    await deleteStorageImage({
      filePath: coverImagePath,
      bucketFallback: "blog-images",
    });
  }

  if (scope === "system") {
    revalidatePath("/");
    revalidatePath("/news");
    revalidatePath("/admin");
    revalidatePath("/admin/blog");
    if (slug) revalidatePath(`/blog/${slug}`);
  } else if (access.context) {
    const familySlug = access.context.family.slug;
    revalidatePath(`/dashboard/${familySlug}`);
    revalidatePath(`/dashboard/${familySlug}/blog`);
    if (slug) revalidatePath(`/dashboard/${familySlug}/blog/${slug}`);
  }

  return { success: true };
}

export async function saveBlogPost(formData: FormData) {
  return saveScopedBlogPost("system", formData);
}

export const createOrUpdatePostAction = saveBlogPost;

export async function saveFamilyBlogPost(formData: FormData) {
  return saveScopedBlogPost("family", formData);
}

export async function uploadBlogInlineImage(formData: FormData) {
  return uploadScopedInlineImage("system", formData);
}

export async function uploadFamilyBlogInlineImage(formData: FormData) {
  return uploadScopedInlineImage("family", formData);
}

export async function deleteBlogPost(formData: FormData) {
  return deleteScopedBlogPost("system", formData);
}

export async function deleteFamilyBlogPost(formData: FormData) {
  return deleteScopedBlogPost("family", formData);
}
