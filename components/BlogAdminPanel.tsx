"use client";

import {
  deleteBlogPost,
  deleteFamilyBlogPost,
  saveBlogPost,
  saveFamilyBlogPost,
} from "@/app/actions/blog";
import RichBlogEditor from "@/components/RichBlogEditor";
import { BlogPost, PostScope } from "@/types";
import { getFamilyBlogImageLimit } from "@/utils/blogImageRules";
import {
  CheckCircle2,
  Edit3,
  Eye,
  ImageIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function formatDate(value: string | null) {
  if (!value) return "Chưa xuất bản";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function getScopeCopy(scope: PostScope) {
  if (scope === "family") {
    return {
      eyebrow: "Bảng tin nội bộ",
      newTitle: "Tạo thông báo nội bộ",
      editTitle: "Chỉnh sửa thông báo nội bộ",
      description:
        "Mỗi dòng họ chỉ giữ một thông báo nội bộ đang hoạt động. Muốn đăng nội dung mới, hãy sửa đè thông báo hiện có hoặc xóa thông báo cũ trước.",
      defaultCategory: "THÔNG BÁO NỘI BỘ",
      publishLabel: "Hiển thị cho thành viên dòng họ",
      empty: "Chưa có thông báo nội bộ nào.",
      save: "Lưu thông báo",
    };
  }

  return {
    eyebrow: "Khu quản trị tin tức",
    newTitle: "Đăng bài viết mới",
    editTitle: "Chỉnh sửa bài viết",
    description:
      "Bài viết hệ thống có thể xuất hiện ở trang chủ và trang tin tức công khai. Không đưa dữ liệu gia phả riêng tư vào khu vực này.",
    defaultCategory: "VĂN HÓA DÒNG HỌ",
    publishLabel: "Hiển thị ngoài trang chủ",
    empty: "Chưa có bài viết nào.",
    save: "Lưu bài viết",
  };
}

export default function BlogAdminPanel({
  posts,
  initialEditId,
  scope = "system",
  familyId,
  familySlug,
  familySettings,
  canEdit = true,
}: {
  posts: BlogPost[];
  initialEditId?: string;
  scope?: PostScope;
  familyId?: string;
  familySlug?: string;
  familySettings?: Record<string, unknown>;
  canEdit?: boolean;
}) {
  const isFamilyNotice = scope === "family";
  const initialPost = initialEditId
    ? posts.find((item) => item.id === initialEditId) || null
    : isFamilyNotice
      ? posts[0] || null
      : null;
  const router = useRouter();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(initialPost);
  const [imagePreview, setImagePreview] = useState<string>(
    initialPost?.cover_image_url || "",
  );
  const [coverCountsTowardLimit, setCoverCountsTowardLimit] = useState(
    Boolean(initialPost?.cover_image_path),
  );
  const [removeCoverImage, setRemoveCoverImage] = useState(false);
  const [coverInputKey, setCoverInputKey] = useState(0);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const copy = getScopeCopy(scope);
  const imageLimit =
    scope === "family" ? getFamilyBlogImageLimit(familySettings) : null;

  const getDetailHref = (post: BlogPost) =>
    scope === "family" && familySlug
      ? `/dashboard/${familySlug}/blog/${post.slug}`
      : `/blog/${post.slug}`;

  const resetForm = () => {
    const fallbackPost = isFamilyNotice ? posts[0] || null : null;
    setEditingPost(fallbackPost);
    setImagePreview(fallbackPost?.cover_image_url || "");
    setCoverCountsTowardLimit(Boolean(fallbackPost?.cover_image_path));
    setRemoveCoverImage(false);
    setCoverInputKey((value) => value + 1);
    setMessage("");
    setError("");
  };

  const startEditing = (post: BlogPost) => {
    setEditingPost(post);
    setImagePreview(post.cover_image_url);
    setCoverCountsTowardLimit(Boolean(post.cover_image_path));
    setRemoveCoverImage(false);
    setCoverInputKey((value) => value + 1);
    setMessage("");
    setError("");
  };

  const handleTitleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const form = event.currentTarget.form;
    if (!form) return;
    const slugInput = form.elements.namedItem("slug") as HTMLInputElement | null;
    if (slugInput && !slugInput.value.trim()) {
      slugInput.value = slugify(event.currentTarget.value);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setCoverCountsTowardLimit(true);
      setRemoveCoverImage(false);
    }
  };

  const handleRemoveCoverImage = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setImagePreview("");
    setCoverCountsTowardLimit(false);
    setRemoveCoverImage(true);
    setCoverInputKey((value) => value + 1);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (scope === "family") {
      formData.set("family_id", familyId || "");
      formData.set("remove_cover_image", "1");
    }

    setMessage("");
    setError("");
    startTransition(async () => {
      const result =
        scope === "family"
          ? await saveFamilyBlogPost(formData)
          : await saveBlogPost(formData);
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }
      setMessage("Đã lưu bài viết.");
      if ("post" in result && result.post) {
        setEditingPost(result.post);
        setImagePreview(result.post.cover_image_url);
        setCoverCountsTowardLimit(Boolean(result.post.cover_image_path));
        setRemoveCoverImage(false);
        setCoverInputKey((value) => value + 1);
      } else {
        form.reset();
        resetForm();
      }
      router.refresh();
    });
  };

  const handleDelete = (post: BlogPost) => {
    const confirmed = window.confirm(`Xóa bài "${post.title}"?`);
    if (!confirmed) return;

    const formData = new FormData();
    formData.set("id", post.id);
    formData.set("slug", post.slug);
    formData.set("cover_image_path", post.cover_image_path || "");
    if (scope === "family") {
      formData.set("family_id", familyId || "");
    }

    setMessage("");
    setError("");
    startTransition(async () => {
      const result =
        scope === "family"
          ? await deleteFamilyBlogPost(formData)
          : await deleteBlogPost(formData);
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }
      setMessage("Đã xóa bài viết.");
      if (editingPost?.id === post.id) resetForm();
      router.refresh();
    });
  };

  return (
    <div
      className={
        canEdit
          ? "grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-[minmax(0,1fr)_410px]"
          : "grid grid-cols-1 gap-6"
      }
    >
      {canEdit && (
        <form
          id="editor"
          key={editingPost?.id || "new"}
          onSubmit={handleSave}
          className={`rounded-3xl border p-5 sm:p-7 lg:p-8 ${
            isFamilyNotice
              ? "border-2 border-[#deb887]/80 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] shadow-xs"
              : "border-stone-200 bg-white shadow-[0_22px_70px_rgba(41,37,36,0.09)]"
          }`}
        >
          <input type="hidden" name="id" value={editingPost?.id || ""} />
          {scope === "family" && (
            <input type="hidden" name="family_id" value={familyId || ""} />
          )}
          <input
            type="hidden"
            name="existing_cover_image_url"
            value={editingPost?.cover_image_url || ""}
          />
          <input
            type="hidden"
            name="existing_cover_image_path"
            value={editingPost?.cover_image_path || ""}
          />
          <input
            type="hidden"
            name="existing_published_at"
            value={editingPost?.published_at || ""}
          />
          <input
            type="hidden"
            name="remove_cover_image"
            value={removeCoverImage ? "1" : ""}
          />

          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-600">
                {copy.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
                {editingPost ? copy.editTitle : copy.newTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                {copy.description}
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-100 px-4 py-2.5 text-sm font-bold text-stone-700 transition-colors hover:bg-stone-200"
            >
              <Plus className="size-4" />
              {isFamilyNotice && posts.length > 0 ? "Sửa thông báo hiện có" : "Bài mới"}
            </button>
          </div>

          <div
            className={
              isFamilyNotice
                ? "grid grid-cols-1 gap-6"
                : "grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
            }
          >
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                  Tiêu đề
                </label>
                <input
                  name="title"
                  defaultValue={editingPost?.title || ""}
                  onBlur={handleTitleBlur}
                  required
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-xl font-black tracking-tight text-stone-900 outline-none transition-all focus:border-amber-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(217,119,6,0.16)]"
                  placeholder="Nhập tiêu đề bài viết"
                />
              </div>

              <div
                className={
                  scope === "system"
                    ? "grid grid-cols-1 gap-4"
                    : "grid grid-cols-1 gap-4 md:grid-cols-2"
                }
              >
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                    Slug
                  </label>
                  <input
                    name="slug"
                    defaultValue={editingPost?.slug || ""}
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 outline-none transition-all focus:border-amber-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(217,119,6,0.16)]"
                    placeholder="duong-dan-bai-viet"
                  />
                </div>
                {scope === "system" ? (
                  <input
                    type="hidden"
                    name="category"
                    value={editingPost?.category || copy.defaultCategory}
                  />
                ) : (
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                      Chuyên mục
                    </label>
                    <input
                      name="category"
                      defaultValue={editingPost?.category || copy.defaultCategory}
                      required
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 outline-none transition-all focus:border-amber-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(217,119,6,0.16)]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                  Mô tả ngắn
                </label>
                <textarea
                  name="excerpt"
                  defaultValue={editingPost?.excerpt || ""}
                  rows={5}
                  className="min-h-[150px] w-full resize-y rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium leading-7 text-stone-700 outline-none transition-all focus:border-amber-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(217,119,6,0.16)]"
                  placeholder="Tóm tắt ngắn hiển thị trên danh sách bài viết"
                />
                <p className="mt-2 text-xs font-semibold text-stone-400">
                  Nên viết 2-4 câu ngắn để card blog ngoài trang chủ dễ đọc.
                </p>
              </div>

            </div>

            {!isFamilyNotice && (
            <aside className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                  Ảnh bìa {scope === "system" ? "bắt buộc" : "tuỳ chọn"}
                </label>
                <label className="group relative block min-h-[260px] cursor-pointer overflow-hidden rounded-[26px] bg-stone-50">
                  {imagePreview ? (
                    <>
                    <img
                      src={imagePreview}
                      alt="Ảnh bìa bài viết"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                      <button
                        type="button"
                        onClick={handleRemoveCoverImage}
                        className="absolute right-3 top-3 z-10 inline-flex items-center justify-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-red-700 shadow-lg transition hover:bg-red-50"
                      >
                        <X className="size-3.5" />
                        Xóa ảnh
                      </button>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
                      <ImageIcon className="mb-3 size-10" />
                      <span className="text-sm font-black">
                        Chọn ảnh bìa
                      </span>
                      <span className="mt-1 text-xs">
                        JPG, PNG hoặc WebP
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-4">
                    <span className="inline-flex rounded-full bg-white/95 px-3 py-1 text-xs font-black text-stone-800">
                      Upload ảnh
                    </span>
                  </div>
                  <input
                    key={coverInputKey}
                    name="cover_image"
                    type="file"
                    accept="image/*"
                    required={scope === "system" && !imagePreview}
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
              </div>

              <label className="flex items-center justify-between gap-4 rounded-2xl bg-amber-50 px-4 py-4 text-sm font-bold text-amber-900">
                <span>{copy.publishLabel}</span>
                <input
                  name="is_published"
                  type="checkbox"
                  defaultChecked={editingPost?.is_published ?? true}
                  className="size-5 rounded border-amber-300 text-amber-600"
                />
              </label>

            </aside>
            )}
          </div>

          <div className="mt-7">
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                  Nội dung
                </label>
                <p className="mt-1 text-sm font-semibold text-stone-500">
                  Soạn nội dung bài viết bằng trình biên tập bên dưới.
                </p>
              </div>
            </div>
            <RichBlogEditor
              name="content"
              initialContent={editingPost?.content || ""}
              scope={scope}
              familyId={familyId}
              imageLimit={imageLimit}
              coverImageCount={
                scope === "family" && coverCountsTowardLimit ? 0 : 0
              }
            />
            <p className="mt-3 text-xs font-semibold text-stone-400">
              Có thể sửa trực tiếp từng chữ, chèn ảnh vào đúng vị trí con trỏ,
              chỉnh chú thích, link và video ngay trong khung soạn thảo.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-4 border-t border-stone-200 pt-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-h-11 flex-1">
              {(message || error) && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                    error
                      ? "bg-red-50 text-red-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {error || message}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#800000] px-8 py-4 text-sm font-black uppercase tracking-wide text-white shadow-xl shadow-red-950/10 transition-colors hover:bg-[#650000] disabled:opacity-60 lg:w-auto"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {copy.save}
            </button>
          </div>
        </form>
      )}

      <aside
        id="posts"
        className={`scroll-mt-8 rounded-3xl p-5 sm:p-6 ${
          isFamilyNotice
            ? "border-2 border-[#deb887]/80 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] shadow-xs"
            : "bg-white shadow-[0_22px_70px_rgba(41,37,36,0.09)]"
        } ${
          canEdit ? "" : "w-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">
              {isFamilyNotice ? "Bảng tin hiện tại" : "Kho bài viết"}
            </p>
            <h3 className="mt-1 text-xl font-black text-stone-900">
              {isFamilyNotice ? `${posts.length} thông báo` : `${posts.length} bài`}
            </h3>
          </div>
          {isFamilyNotice ? (
            <Link
              href="/news"
              className="rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-black text-stone-700 shadow-sm transition hover:border-amber-300 hover:text-[#800000]"
            >
              Xem thêm
            </Link>
          ) : (
            <CheckCircle2 className="size-6 text-emerald-500" />
          )}
        </div>

        <div
          className={
            canEdit
              ? "max-h-[790px] space-y-3 overflow-y-auto pr-1"
              : "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          }
        >
          {posts.length === 0 ? (
            <div className="rounded-2xl bg-stone-50 p-6 text-center text-sm text-stone-500">
              {copy.empty}
            </div>
          ) : (
            posts.map((post) => {
              const href = getDetailHref(post);
              const canOpenSystemPost = scope === "family" || post.is_published;

              return (
                <article
                  key={post.id}
                  className={`group rounded-2xl p-4 transition-all ${
                    isFamilyNotice
                      ? "border border-[#deb887]/60 bg-[#fffdf7] hover:border-[#caa455] hover:shadow-xs"
                      : "bg-stone-50 hover:bg-amber-50/70"
                  }`}
                >
                  <div className="flex gap-3">
                    {!isFamilyNotice && (
                    <Link
                      href={canOpenSystemPost ? href : "#"}
                      className="block size-20 shrink-0 overflow-hidden rounded-xl bg-stone-200"
                    >
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-amber-600">
                          {post.category}
                        </span>
                        <span
                          className={`size-2 rounded-full ${
                            post.is_published ? "bg-emerald-500" : "bg-stone-300"
                          }`}
                        />
                      </div>
                      <Link
                        href={canOpenSystemPost ? href : "#"}
                        className="line-clamp-2 text-sm font-black leading-snug text-stone-900 hover:text-[#800000]"
                      >
                        {post.title}
                      </Link>
                      <p className="mt-1 text-xs text-stone-500">
                        {formatDate(post.published_at || post.created_at)}
                      </p>
                      {!canEdit && post.excerpt && (
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-stone-500">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => startEditing(post)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-stone-700 transition-colors hover:text-amber-700"
                      >
                        <Edit3 className="size-3.5" />
                        Sửa
                      </button>
                    )}
                    {canOpenSystemPost && (
                      <Link
                        href={href}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-stone-700 transition-colors hover:text-amber-700"
                      >
                        <Eye className="size-3.5" />
                        {!canEdit && "Xem"}
                      </Link>
                    )}
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => handleDelete(post)}
                        className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
}
