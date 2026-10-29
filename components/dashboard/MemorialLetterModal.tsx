"use client";

import { useState, useTransition } from "react";
import { saveMemorialLetterAction } from "@/app/actions/memorial-letter";
import { MemorialAuthorType, PersonMemorialLetter } from "@/types";
import { AlertCircle, CheckCircle2, Feather, Loader2, X } from "lucide-react";

interface MemorialLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  personId: string;
  personName: string;
  familyId: string;
  treeId: string;
  initialLetter?: PersonMemorialLetter | null;
  currentUserName?: string | null;
  isSelfPerson?: boolean;
  isAdmin?: boolean;
  onSaved: (letter: PersonMemorialLetter) => void;
}

export default function MemorialLetterModal({
  isOpen,
  onClose,
  personId,
  personName,
  familyId,
  treeId,
  initialLetter,
  currentUserName,
  isSelfPerson = false,
  isAdmin = false,
  onSaved,
}: MemorialLetterModalProps) {
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

  const [title, setTitle] = useState(
    initialLetter?.title || "Tâm thư & Lời dặn dò gửi đời sau",
  );
  const [authorType, setAuthorType] = useState<MemorialAuthorType>(
    initialLetter?.author_type || defaultAuthorType,
  );
  const [authorName, setAuthorName] = useState(
    initialLetter?.author_name || currentUserName || "",
  );
  const [authorRelationship, setAuthorRelationship] = useState(
    initialLetter?.author_relationship || defaultRelationship,
  );
  const [content, setContent] = useState(initialLetter?.content || "");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!content.trim()) {
      setErrorMessage("Vui lòng nhập nội dung tâm thư.");
      return;
    }

    if (!authorName.trim()) {
      setErrorMessage("Vui lòng nhập họ tên người chấp bút / viết giùm.");
      return;
    }

    startTransition(async () => {
      const res = await saveMemorialLetterAction({
        personId,
        familyId,
        treeId,
        title: title.trim() || "Tâm thư gửi đời sau",
        content: content.trim(),
        authorType,
        authorName: authorName.trim(),
        authorRelationship: authorRelationship.trim() || undefined,
      });

      if (!res.success || !res.data) {
        setErrorMessage(res.error || "Không thể lưu tâm thư.");
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
              <Feather className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-black tracking-tight text-[#f5e7c7]">
                {initialLetter ? "Chỉnh Sửa Tâm Thư" : "Soạn Thảo Tâm Thư & Di Ngôn"}
              </h2>
              <p className="text-xs text-[#f5e7c7]/80">
                Lưu giữ di ngôn, tâm thư dặn dò cho thành viên:{" "}
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

          {/* Tiêu đề */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7d6c5d] mb-1.5">
              Tiêu đề bức thư
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Lời căn dặn con cháu muôn đời..."
              className="w-full rounded-xl border border-[#deb887] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#2c1a11] placeholder:text-stone-400 focus:border-[#8c1d1d] focus:outline-none focus:ring-1 focus:ring-[#8c1d1d]"
            />
          </div>

          {/* Chọn vai trò người viết & xưng hô */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7d6c5d] mb-1.5">
                Tư cách người viết
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
                className="w-full rounded-xl border border-[#deb887] bg-white px-3 py-2.5 text-xs font-medium text-[#2c1a11] focus:border-[#8c1d1d] focus:outline-none focus:ring-1 focus:ring-[#8c1d1d]"
              >
                {isSelfPerson && <option value="self">Chính bản thân tôi</option>}
                <option value="descendant">Con / Cháu viết giùm</option>
                <option value="admin">Ban quản trị / Đại diện</option>
                {!isSelfPerson && <option value="self">Chính chủ (Ghi lại di bút)</option>}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7d6c5d] mb-1.5">
                Họ tên người viết
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="VD: Trình Văn A"
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
                placeholder="VD: Con trai thứ hai, Cháu nội..."
                className="w-full rounded-xl border border-[#deb887] bg-white px-3.5 py-2 text-sm font-medium text-[#2c1a11] placeholder:text-stone-400 focus:border-[#8c1d1d] focus:outline-none focus:ring-1 focus:ring-[#8c1d1d]"
              />
            </div>
          </div>

          {/* Nội dung tâm thư */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7d6c5d] mb-1.5">
              Nội dung tâm thư / Di ngôn
            </label>
            <textarea
              required
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập những lời căn dặn tâm huyết, đạo lý gia phong, kỷ niệm sâu sắc hoặc tâm nguyện gửi lại cho các thế hệ con cháu..."
              className="w-full rounded-xl border border-[#deb887] bg-white p-3.5 text-sm leading-relaxed text-[#2c1a11] placeholder:text-stone-400 focus:border-[#8c1d1d] focus:outline-none focus:ring-1 focus:ring-[#8c1d1d]"
            />
            <p className="mt-1 text-[11px] text-[#7d6c5d]">
              Gợi ý: Lời dặn về sự hòa thuận, giữ gìn nền nếp gia phong, sự học, hướng về cội nguồn tổ tiên.
            </p>
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
                  Lưu tâm thư
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
