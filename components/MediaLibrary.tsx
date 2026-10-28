"use client";

import { useState, useTransition, useId } from "react";
import Image from "next/image";
import {
  Copy,
  Check,
  Trash2,
  Upload,
  Search,
  ExternalLink,
  Eye,
  X,
  FileImage,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import type { StorageFileItem } from "@/utils/storage/index";
import { uploadAvatarAction, deleteMediaAction, listMediaAction } from "@/app/actions/storage";

export interface MediaLibraryProps {
  familySlug?: string;
  familyId?: string;
  canManage?: boolean;
  initialFiles?: StorageFileItem[];
}

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function formatDate(isoString?: string) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(d);
  } catch {
    return "";
  }
}

export default function MediaLibrary({
  familySlug,
  familyId,
  canManage = true,
  initialFiles = [],
}: MediaLibraryProps) {
  const [files, setFiles] = useState<StorageFileItem[]>(initialFiles);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<StorageFileItem | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputId = useId();

  const filteredFiles = files.filter((f) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.key.toLowerCase().includes(q);
  });

  const handleCopyUrl = async (file: StorageFileItem) => {
    try {
      await navigator.clipboard.writeText(file.url);
      setCopiedKey(file.key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      setErrorMsg("Không thể sao chép liên kết vào clipboard.");
    }
  };

  const handleDelete = async (file: StorageFileItem) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa vĩnh viễn tệp "${file.name}" khỏi kho lưu trữ? Thao tác này không thể hoàn tác.`
    );
    if (!confirmed) return;

    setIsDeleting(file.key);
    setErrorMsg(null);
    try {
      const res = await deleteMediaAction(file.key, familySlug);
      if (res.success) {
        setFiles((prev) => prev.filter((item) => item.key !== file.key));
        if (selectedFile?.key === file.key) {
          setSelectedFile(null);
        }
      } else {
        setErrorMsg(res.error || "Không thể xóa ảnh.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa ảnh.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("familyId", familyId || "general");

      const res = await uploadAvatarAction(formData);
      if (res.success && res.publicUrl && res.filePath) {
        const newFile: StorageFileItem = {
          key: res.filePath,
          name: res.filePath.split("/").pop() || "image.webp",
          url: res.publicUrl,
          size: file.size,
          lastModified: new Date().toISOString(),
          folder: familyId || "general",
        };
        setFiles((prev) => [newFile, ...prev]);
      } else {
        setErrorMsg(res.error || "Tải ảnh thất bại.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Lỗi tải ảnh.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRefresh = () => {
    startTransition(async () => {
      setErrorMsg(null);
      const res = await listMediaAction(familySlug);
      if (res.success) {
        setFiles(res.files);
      } else {
        setErrorMsg(res.error || "Không thể làm mới danh sách ảnh.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Thanh công cụ tìm kiếm và upload */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-[#deb887]/60 bg-[#fff9ed]/90 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8c6b54]" />
          <input
            type="text"
            placeholder="Tìm kiếm ảnh theo tên tệp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#deb887]/60 bg-white/90 text-sm text-[#2c1a11] placeholder:text-[#8c6b54]/70 focus:outline-none focus:ring-2 focus:ring-[#8c1d1d]/30 focus:border-[#8c1d1d]"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isPending}
            title="Làm mới danh sách"
            className="p-2 rounded-xl border border-[#deb887]/60 bg-white hover:bg-[#f5e7c7]/50 text-[#5c4a3e] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${isPending ? "animate-spin text-[#8c1d1d]" : ""}`} />
          </button>

          {canManage && (
            <div>
              <input
                id={fileInputId}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleUploadFile}
                disabled={isUploading}
                className="hidden"
              />
              <label
                htmlFor={fileInputId}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8c1d1d] hover:bg-[#6e1616] text-white text-sm font-bold shadow-sm transition-all cursor-pointer ${
                  isUploading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <Upload className="size-4" />
                <span>{isUploading ? "Đang tải lên..." : "Tải ảnh mới"}</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl border border-red-300 bg-red-50 text-red-800 text-sm">
          <AlertCircle className="size-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Thông tin số lượng */}
      <div className="flex items-center justify-between text-xs font-semibold text-[#8c6b54] px-1">
        <span>Tổng số: {filteredFiles.length} tệp tin</span>
        {search && <span>Kết quả lọc theo &ldquo;{search}&rdquo;</span>}
      </div>

      {/* Lưới ảnh */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-[#deb887]/60 bg-[#fff9ed]/50">
          <div className="size-14 mx-auto rounded-full bg-[#f5e7c7] flex items-center justify-center text-[#8c1d1d] mb-3">
            <FileImage className="size-7" />
          </div>
          <h3 className="text-base font-bold text-[#2c1a11]">Chưa có hình ảnh nào</h3>
          <p className="mt-1 text-xs text-[#5c4a3e] max-w-sm mx-auto">
            {search
              ? "Không tìm thấy tệp tin ảnh nào khớp với từ khóa tìm kiếm."
              : "Kho lưu trữ hiện tại đang trống. Bạn có thể bấm nút \"Tải ảnh mới\" ở trên để tải ảnh lên."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredFiles.map((file) => {
            const isCopied = copiedKey === file.key;
            const isThisDeleting = isDeleting === file.key;

            return (
              <div
                key={file.key}
                className="group relative flex flex-col rounded-xl border border-[#deb887]/60 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Thumbnail ảnh */}
                <div
                  onClick={() => setSelectedFile(file)}
                  className="relative aspect-square w-full bg-[#f5e7c7]/30 cursor-pointer overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.url}
                    alt={file.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="p-2 rounded-full bg-white/90 text-[#2c1a11] shadow">
                      <Eye className="size-4" />
                    </span>
                  </div>
                </div>

                {/* Thông tin và nút thao tác */}
                <div className="p-2.5 flex-1 flex flex-col justify-between gap-1 text-xs">
                  <p className="font-semibold text-[#2c1a11] truncate" title={file.name}>
                    {file.name}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#8c6b54]">
                    <span>{formatBytes(file.size)}</span>
                    <span>{formatDate(file.lastModified)}</span>
                  </div>

                  <div className="mt-1.5 pt-1.5 border-t border-[#f0e6d2] flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(file)}
                      title="Sao chép liên kết"
                      className={`flex-1 inline-flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                        isCopied
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                          : "border-[#deb887]/60 hover:bg-[#f5e7c7]/40 text-[#5c4a3e]"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="size-3 text-emerald-600" />
                          <span>Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Sao chép liên kết</span>
                        </>
                      )}
                    </button>

                    {canManage && (
                      <button
                        type="button"
                        onClick={() => handleDelete(file)}
                        disabled={isThisDeleting}
                        title="Xóa ảnh"
                        className="p-1 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal xem chi tiết ảnh */}
      {selectedFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-2xl bg-white border border-[#deb887] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#deb887]/40 bg-[#fff9ed]">
              <div className="truncate pr-4">
                <h4 className="text-sm font-bold text-[#183b28] truncate">
                  {selectedFile.name}
                </h4>
                <p className="text-xs text-[#8c6b54]">
                  {formatBytes(selectedFile.size)} • {formatDate(selectedFile.lastModified)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="p-1.5 rounded-full hover:bg-[#deb887]/30 text-[#5c4a3e] transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Nội dung ảnh */}
            <div className="relative max-h-[65vh] flex items-center justify-center bg-[#2c1a11]/5 p-4 overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedFile.url}
                alt={selectedFile.name}
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>

            {/* Footer hành động */}
            <div className="px-5 py-3.5 border-t border-[#deb887]/40 bg-[#fff9ed] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-[#8c6b54] truncate select-all font-mono bg-white px-2.5 py-1.5 rounded-lg border border-[#deb887]/50 max-w-md">
                {selectedFile.url}
              </div>

              <div className="flex items-center gap-2 justify-end">
                <a
                  href={selectedFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-[#deb887]/60 hover:bg-[#f5e7c7]/50 text-[#5c4a3e] transition-colors"
                  title="Mở trong tab mới"
                >
                  <ExternalLink className="size-4" />
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyUrl(selectedFile)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#deb887]/60 bg-white hover:bg-[#f5e7c7]/50 text-xs font-bold text-[#5c4a3e] transition-colors"
                >
                  {copiedKey === selectedFile.key ? (
                    <>
                      <Check className="size-3.5 text-emerald-600" />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Sao chép liên kết</span>
                    </>
                  )}
                </button>

                {canManage && (
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedFile)}
                    disabled={isDeleting === selectedFile.key}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Xóa ảnh</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
