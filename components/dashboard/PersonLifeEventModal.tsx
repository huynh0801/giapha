"use client";

import { useState, useTransition } from "react";
import { savePersonLifeEventAction } from "@/app/actions/life-events";
import { MemorialAuthorType, PersonLifeEvent } from "@/types";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";

interface PersonLifeEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  personId: string;
  personName: string;
  familyId: string;
  treeId: string;
  initialEvent?: PersonLifeEvent | null;
  currentUserName?: string | null;
  isSelfPerson?: boolean;
  isAdmin?: boolean;
  onSaved: (event: PersonLifeEvent) => void;
}

export default function PersonLifeEventModal({
  isOpen,
  onClose,
  personId,
  personName,
  familyId,
  treeId,
  initialEvent,
  currentUserName,
  isSelfPerson = false,
  isAdmin = false,
  onSaved,
}: PersonLifeEventModalProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultAuthorType: MemorialAuthorType = isSelfPerson
    ? "self"
    : isAdmin
      ? "admin"
      : "descendant";

  const defaultRelationship = isSelfPerson
    ? "Bản thân"
    : isAdmin
      ? "Ban quản trị dòng họ"
      : "Con / Cháu";

  const [year, setYear] = useState<string>(
    initialEvent ? String(initialEvent.year) : new Date().getFullYear().toString(),
  );
  const [month, setMonth] = useState<string>(
    initialEvent?.month ? String(initialEvent.month) : "",
  );
  const [day, setDay] = useState<string>(
    initialEvent?.day ? String(initialEvent.day) : "",
  );
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [content, setContent] = useState(initialEvent?.content || "");
  const [imageUrl, setImageUrl] = useState(initialEvent?.image_url || "");
  const [authorType, setAuthorType] = useState<MemorialAuthorType>(
    initialEvent?.author_type || defaultAuthorType,
  );
  const [authorName, setAuthorName] = useState(
    initialEvent?.author_name || currentUserName || "",
  );
  const [authorRelationship, setAuthorRelationship] = useState(
    initialEvent?.author_relationship || defaultRelationship,
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const parsedYear = Number.parseInt(year, 10);
    if (!parsedYear || isNaN(parsedYear) || parsedYear < 1 || parsedYear > 2100) {
      setErrorMessage("Vui lòng nhập năm hợp lệ (1 - 2100).");
      return;
    }

    if (!title.trim()) {
      setErrorMessage("Vui lòng nhập tiêu đề sự kiện / mốc năm.");
      return;
    }

    if (!content.trim()) {
      setErrorMessage("Vui lòng nhập nội dung nhật ký / kỷ niệm.");
      return;
    }

    if (!authorName.trim()) {
      setErrorMessage("Vui lòng nhập họ tên người ghi chép.");
      return;
    }

    startTransition(async () => {
      const res = await savePersonLifeEventAction({
        id: initialEvent?.id,
        personId,
        familyId,
        treeId,
        year: parsedYear,
        month: month ? Number.parseInt(month, 10) : null,
        day: day ? Number.parseInt(day, 10) : null,
        title: title.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim() || null,
        authorType,
        authorName: authorName.trim(),
        authorRelationship: authorRelationship.trim() || undefined,
      });

      if (!res.success || !res.data) {
        setErrorMessage(res.error || "Không thể lưu mốc nhật ký.");
        return;
      }

      onSaved(res.data);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-[#deb887] bg-[#fdfbf7] text-[#2c1a11] shadow-2xl">
        {/* Header viền phong cách hoàng gia */}
        <div className="flex items-center justify-between border-b border-[#deb887]/60 bg-gradient-to-r from-[#8c1d1d] via-[#a82424] to-[#8c1d1d] px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#f5e7c7] text-[#8c1d1d] shadow-sm">
              <Calendar className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-black tracking-tight text-[#f5e7c7]">
                {initialEvent ? "Chỉnh Sửa Mốc Nhật Ký" : "Thêm Mốc Nhật Ký Từng Năm"}
              </h2>
              <p className="text-xs text-[#f5e7c7]/80">
                Ghi chép niên biểu & kỷ niệm cuộc đời:{" "}
                <span className="font-semibold text-white">{personName}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nội dung form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Mốc thời gian: Năm, Tháng, Ngày */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7d6c5d] mb-1.5">
                Năm sự kiện <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                max={2100}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="VD: 1975"
                className="w-full rounded-xl border border-[#deb887] bg-white px-3.5 py-2.5 text-sm font-bold text-[#183b28] placeholder:text-stone-400 focus:border-[#8c1d1d] focus:outline-none focus:ring-1 focus:ring-[#8c1d1d]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7d6c5d] mb-1.5">
                Tháng (tùy chọn)
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="1 - 12"
                className="w-full rounded-xl border border-[#deb887] bg-white px-3.5 py-2.5 text-sm font-medium text-[#2c1a11] placeholder:text-stone-400 focus:border-[#8c1d1d] focus:outline-none focus:ring-1 focus:ring-[#8c1d1d]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7d6c5d] mb-1.5">
                Ngày (tùy chọn)
              </label>
              <input
                type="number"
                min={1}
                max={31}
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="1 - 31"
                className="w-full rounded-xl border border-[#deb887] bg-white px-3.5 py-2.5 text-sm font-medium text-[#2c1a11] placeholder:text-stone-400 focus:border-[#8c1d1d] focus:outline-none focus:ring-1 focus:ring-[#8c1d1d]"
              />
            </div>
          </div>

          {/* Tiêu đề mốc năm */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7d6c5d] mb-1.5">
              Tiêu đề sự kiện / Mốc năm <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Lên đường nhập ngũ, Xây dựng nhà thờ họ, Con gái út chào đời..."
              className="w-full rounded-xl border border-[#deb887] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#2c1a11] placeholder:text-stone-400 focus:border-[#8c1d1d] focus:outline-none focus:ring-1 focus:ring-[#8c1d1d]"
            />
          </div>

          {/* Nội dung nhật ký */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7d6c5d] mb-1.5">
              Nội dung nhật ký / Kỷ niệm ghi lại <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ghi lại chi tiết diễn biến, cảm xúc, lời dặn hoặc kỷ niệm đáng nhớ của năm đó..."
              className="w-full rounded-xl border border-[#deb887] bg-white p-3.5 text-sm leading-relaxed text-[#2c1a11] placeholder:text-stone-400 focus:border-[#8c1d1d] focus:outline-none focus:ring-1 focus:ring-[#8c1d1d]"
            />
          </div>

          {/* Đính kèm ảnh kỷ niệm */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7d6c5d] mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="size-3.5" />
              Đường dẫn ảnh kỷ niệm (tùy chọn)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... hoặc /images/..."
              className="w-full rounded-xl border border-[#deb887] bg-white px-3.5 py-2 text-xs font-medium text-[#2c1a11] placeholder:text-stone-400 focus:border-[#8c1d1d] focus:outline-none focus:ring-1 focus:ring-[#8c1d1d]"
            />
            {imageUrl && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] text-[#7d6c5d]">Xem trước:</span>
                <img
                  src={imageUrl}
                  alt="Xem trước ảnh kỷ niệm"
                  className="size-12 rounded-lg object-cover border border-[#deb887]"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Thông tin người ghi chép */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-[#deb887]/30">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7d6c5d] mb-1.5">
                Tư cách người ghi
              </label>
              <select
                value={authorType}
                onChange={(e) => {
                  const val = e.target.value as MemorialAuthorType;
                  setAuthorType(val);
                  if (val === "self") setAuthorRelationship("Bản thân");
                  else if (val === "admin") setAuthorRelationship("Ban quản trị");
                  else if (val === "descendant") setAuthorRelationship("Con / Cháu");
                }}
                className="w-full rounded-xl border border-[#deb887] bg-white px-3 py-2 text-xs font-medium text-[#2c1a11] focus:border-[#8c1d1d] focus:outline-none focus:ring-1 focus:ring-[#8c1d1d]"
              >
                {isSelfPerson && <option value="self">Chính bản thân tôi ghi</option>}
                <option value="descendant">Con / Cháu ghi giùm</option>
                <option value="admin">Ban quản trị / Đại diện</option>
                {!isSelfPerson && <option value="self">Chính chủ (Ghi lại)</option>}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7d6c5d] mb-1.5">
                Họ tên người ghi
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="VD: Trình Văn B"
                className="w-full rounded-xl border border-[#deb887] bg-white px-3.5 py-2 text-sm font-medium text-[#2c1a11] placeholder:text-stone-400 focus:border-[#8c1d1d] focus:outline-none focus:ring-1 focus:ring-[#8c1d1d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7d6c5d] mb-1.5">
                Xưng hô / Quan hệ
              </label>
              <input
                type="text"
                value={authorRelationship}
                onChange={(e) => setAuthorRelationship(e.target.value)}
                placeholder="VD: Con gái út, Cháu nội..."
                className="w-full rounded-xl border border-[#deb887] bg-white px-3.5 py-2 text-sm font-medium text-[#2c1a11] placeholder:text-stone-400 focus:border-[#8c1d1d] focus:outline-none focus:ring-1 focus:ring-[#8c1d1d]"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#deb887]/40">
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-[#7d6c5d] hover:bg-stone-100 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8c1d1d] to-[#b32424] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-[#751818] hover:to-[#9c2020] transition-all disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  {initialEvent ? "Lưu thay đổi" : "Thêm mốc năm"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
