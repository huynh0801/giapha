export const DEFAULT_FAMILY_BLOG_IMAGE_LIMIT = 1;

export type BlogImageLimit = number | null;

export function getFamilyBlogImageLimit(
  settings?: Record<string, unknown> | null,
): BlogImageLimit {
  const value = settings?.blog_max_images_per_post;

  if (value === null || value === "unlimited") {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(1, Math.floor(value));
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return Math.max(1, parsed);
    }
  }

  return DEFAULT_FAMILY_BLOG_IMAGE_LIMIT;
}

export function parseBlogImageLimitInput(value: string): BlogImageLimit {
  if (value === "unlimited") return null;

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_FAMILY_BLOG_IMAGE_LIMIT;
  }

  return Math.floor(parsed);
}

export function countBlogImages(content: string) {
  return (content.match(/<img\b/gi) || []).length;
}

export function getBlogImageLimitError(limit: number) {
  return `Bài viết của dòng họ này chỉ được đăng tối đa ${limit} ảnh.`;
}
