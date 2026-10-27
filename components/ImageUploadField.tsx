"use client";

import { AlertCircle, Image as ImageIcon, RotateCcw, Shield, Trash2, Upload } from "lucide-react";
import React, { useEffect, useId, useRef, useState } from "react";

export interface ImageUploadFieldProps {
  name: string;
  removeName?: string;
  label?: string;
  currentImageUrl?: string | null;
  shape?: "shield" | "circle" | "banner" | "square";
  maxSizeMb?: number;
  helperText?: string;
  className?: string;
  accept?: string;
  disabled?: boolean;
}

export default function ImageUploadField({
  name,
  removeName,
  label,
  currentImageUrl = null,
  shape = "circle",
  maxSizeMb = 5,
  helperText,
  className = "",
  accept = "image/png,image/jpeg,image/webp,image/gif",
  disabled = false,
}: ImageUploadFieldProps): React.JSX.Element {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Revoke object URL on unmount or when filePreview changes
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  // Synchronize form reset
  useEffect(() => {
    const inputEl = fileInputRef.current;
    const form = inputEl?.form;
    if (!form) return;

    const handleFormReset = () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
      setSelectedFile(null);
      setFilePreview(null);
      setIsRemoved(false);
      setError(null);
    };

    form.addEventListener("reset", handleFormReset);
    return () => {
      form.removeEventListener("reset", handleFormReset);
    };
  }, [filePreview]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (file.type && !file.type.startsWith("image/")) {
      setError("Vui lòng chọn tệp tin hình ảnh hợp lệ (PNG, JPG, WebP,...).");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Kích thước ảnh vượt quá ${maxSizeMb}MB. Vui lòng chọn tệp nhỏ hơn.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Clean up old object URL if any
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setFilePreview(objectUrl);
    setIsRemoved(false);
  };

  // Handle remove / clear
  const handleRemove = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    setIsRemoved(true);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle restore original image
  const handleRestore = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    setIsRemoved(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const activePreview = filePreview || (!isRemoved ? currentImageUrl : null);

  // Styling based on shape
  const getShapeStyles = () => {
    switch (shape) {
      case "shield":
        return {
          container: "w-28 h-32 rounded-t-xl rounded-b-[42px] border-2 border-[#caa455] bg-[#fffdf7] shadow-xs",
          badgeIcon: <Shield className="size-8 text-[#caa455]/70" />,
        };
      case "banner":
        return {
          container: "w-full max-w-md h-36 rounded-xl border-2 border-[#deb887] bg-[#fffdf7] shadow-xs",
          badgeIcon: <ImageIcon className="size-8 text-[#caa455]/70" />,
        };
      case "square":
        return {
          container: "w-28 h-28 rounded-2xl border-2 border-[#deb887] bg-[#fffdf7] shadow-xs",
          badgeIcon: <ImageIcon className="size-8 text-[#caa455]/70" />,
        };
      case "circle":
      default:
        return {
          container: "w-28 h-28 rounded-full border-2 border-[#deb887] bg-[#fffdf7] shadow-xs",
          badgeIcon: <ImageIcon className="size-8 text-[#caa455]/70" />,
        };
    }
  };

  const { container: shapeContainerClasses, badgeIcon } = getShapeStyles();
  const defaultHelper = helperText || `Định dạng JPG, PNG hoặc WebP. Tối đa ${maxSizeMb}MB.`;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold uppercase tracking-wider text-[#7a6455]"
        >
          {label}
        </label>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        name={name}
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="sr-only"
        aria-label={label || "Chọn tệp hình ảnh"}
      />

      {/* Hidden input to signal removal of current image */}
      {removeName && (
        <input
          type="hidden"
          name={removeName}
          value={isRemoved ? "1" : "0"}
        />
      )}

      <div
        className={`flex ${
          shape === "banner" ? "flex-col items-start" : "flex-row items-center"
        } gap-4`}
      >
        {/* Preview Frame */}
        <div
          onClick={() => {
            if (!disabled) fileInputRef.current?.click();
          }}
          className={`relative group flex items-center justify-center overflow-hidden cursor-pointer shrink-0 transition-all hover:border-[#8c1d1d] hover:shadow-md ${shapeContainerClasses} ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
          title="Bấm để tải ảnh mới"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (!disabled && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          {activePreview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePreview}
                alt={label || "Hình ảnh xem trước"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-semibold transition-opacity p-1 text-center">
                <Upload className="size-4 mb-0.5" />
                <span>Thay ảnh</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-2 text-center text-[#7a6455]">
              {badgeIcon}
              <span className="mt-1 text-[11px] font-semibold text-[#caa455]">
                Tải ảnh lên
              </span>
            </div>
          )}
        </div>

        {/* Action Controls & Guidance */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-[#deb887] bg-[#fffdf7] text-[#183b28] hover:bg-[#f5e7c7]/50 hover:border-[#caa455] active:scale-95 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Upload className="size-3.5 text-[#8c1d1d]" />
              <span>{activePreview ? "Chọn ảnh khác" : "Tải ảnh lên"}</span>
            </button>

            {activePreview && (
              <button
                type="button"
                disabled={disabled}
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-rose-200 bg-rose-50/80 text-rose-700 hover:bg-rose-100 active:scale-95 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Trash2 className="size-3.5 text-rose-600" />
                <span>Xóa ảnh</span>
              </button>
            )}

            {isRemoved && currentImageUrl && (
              <button
                type="button"
                disabled={disabled}
                onClick={handleRestore}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 active:scale-95 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <RotateCcw className="size-3.5 text-stone-500" />
                <span>Hoàn tác xóa</span>
              </button>
            )}
          </div>

          {selectedFile && (
            <p className="mt-1.5 text-xs font-medium text-[#183b28] truncate">
              Tệp đã chọn: <span className="font-semibold">{selectedFile.name}</span> ({(selectedFile.size / 1024).toFixed(0)} KB)
            </p>
          )}

          {defaultHelper && !error && (
            <p className="mt-1.5 text-xs text-[#7a6455] leading-relaxed">
              {defaultHelper}
            </p>
          )}

          {error && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-rose-600">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
