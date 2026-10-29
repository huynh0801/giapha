"use client";

import { useState, useTransition } from "react";
import MemorialLetterModal from "@/components/dashboard/MemorialLetterModal";
import { deleteMemorialLetterAction } from "@/app/actions/memorial-letter";
import { PersonMemorialLetter } from "@/types";
import {
  Calendar,
  Clock,
  Edit3,
  Feather,
  HeartHandshake,
  Loader2,
  Quote,
  Scroll,
  Trash2,
  User,
} from "lucide-react";

interface MemorialLetterCardProps {
  personId: string;
  personName: string;
  familyId: string;
  treeId: string;
  letter: PersonMemorialLetter | null;
  canWrite?: boolean;
  canEdit?: boolean;
  isSelfPerson?: boolean;
  isAdmin?: boolean;
  currentUserName?: string | null;
  currentUserId?: string | null;
}

export default function MemorialLetterCard({
  personId,
  personName,
  familyId,
  treeId,
  letter: initialLetter,
  canWrite = false,
  canEdit = false,
  isSelfPerson = false,
  isAdmin = false,
  currentUserName,
  currentUserId,
}: MemorialLetterCardProps) {
  const [letter, setLetter] = useState<PersonMemorialLetter | null>(initialLetter);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  // Kiểm tra quyền chỉnh sửa bài viết: Admin hoặc người tạo hoặc chính chủ
  const isAuthor = Boolean(
    currentUserId && letter?.created_by && currentUserId === letter.created_by,
  );
  const hasEditPermission = canEdit || isAdmin || isAuthor || isSelfPerson;

  const handleDelete = () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bức tâm thư này?")) {
      return;
    }

    startDeleteTransition(async () => {
      const res = await deleteMemorialLetterAction(personId, familyId);
      if (res.success) {
        setLetter(null);
      } else {
        alert(res.error || "Không thể xóa tâm thư.");
      }
    });
  };

  const getAuthorBadgeText = (l: PersonMemorialLetter) => {
    if (l.author_type === "self") {
      return "Chính chủ để lại";
    }
    if (l.author_type === "admin") {
      return "Ban quản trị đại diện";
    }
    return "Con / Cháu chấp bút ghi lại";
  };

  return (
    <div className="w-full">
      {letter ? (
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#deb887] bg-gradient-to-b from-[#fcf9f2] via-[#faf5e9] to-[#f7f0df] p-5 sm:p-7 shadow-sm text-[#2c1a11]">
          {/* Họa tiết góc thư tịch cổ */}
          <div className="pointer-events-none absolute -right-6 -bottom-6 text-[#deb887]/20 select-none">
            <Scroll className="size-36 rotate-12" />
          </div>

          {/* Header Tâm thư */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#deb887]/50 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#deb887] bg-[#f5e7c7] text-[#8c1d1d] shadow-sm">
                <Feather className="size-5" />
              </span>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8c1d1d]">
                  <Scroll className="size-3.5" />
                  Tâm thư & Lời dặn dò
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#183b28] tracking-tight">
                  {letter.title}
                </h3>
              </div>
            </div>

            {hasEditPermission && (
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#deb887] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#7d6c5d] hover:bg-[#f5e7c7] hover:text-[#8c1d1d] transition-all shadow-2xs"
                  title="Chỉnh sửa tâm thư"
                >
                  <Edit3 className="size-3.5" />
                  Sửa
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-all shadow-2xs disabled:opacity-50"
                  title="Xóa tâm thư"
                >
                  {isDeleting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Nội dung tâm thư */}
          <div className="relative z-10 my-5 space-y-3">
            <Quote className="size-6 text-[#deb887] opacity-60" />
            <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-[#3b2a1a] font-normal italic pl-3 sm:pl-4 border-l-2 border-[#deb887]/60">
              {letter.content}
            </div>
          </div>

          {/* Footer thông tin người chấp bút / tác giả */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#deb887]/50 pt-4 text-xs text-[#7d6c5d]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#deb887] bg-[#f5e7c7]/80 px-2.5 py-0.5 font-bold text-[#8c1d1d]">
                <HeartHandshake className="size-3.5" />
                {getAuthorBadgeText(letter)}
              </span>

              <span className="inline-flex items-center gap-1 text-[#2c1a11] font-semibold">
                <User className="size-3.5 text-[#7d6c5d]" />
                Người chấp bút: {letter.author_name}
                {letter.author_relationship ? ` (${letter.author_relationship})` : ""}
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-stone-500">
              <Calendar className="size-3.5" />
              <span>
                {new Date(letter.updated_at || letter.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl border-2 border-dashed border-[#deb887]/80 bg-[#fdfbf7]/60 p-6 text-center text-[#2c1a11]">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#f5e7c7] text-[#8c1d1d] shadow-2xs mb-3">
            <Feather className="size-6" />
          </div>
          <h4 className="text-base font-bold text-[#183b28]">Tâm thư & Lời dặn dò</h4>
          <p className="mt-1 text-xs text-[#7d6c5d] max-w-md mx-auto">
            Thành viên này chưa có tâm thư hoặc di ngôn ghi lại. Con cháu, người thân hoặc Ban quản trị có thể ghi chép tâm nguyện và lời dặn gửi gắm cho các thế hệ đời sau.
          </p>

          {canWrite && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8c1d1d] to-[#a82424] px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-[#751818] hover:to-[#911f1f] transition-all"
              >
                <Feather className="size-3.5" />
                Viết tâm thư / Ghi chép di ngôn
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal soạn thảo tâm thư */}
      <MemorialLetterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        personId={personId}
        personName={personName}
        familyId={familyId}
        treeId={treeId}
        initialLetter={letter}
        currentUserName={currentUserName}
        isSelfPerson={isSelfPerson}
        isAdmin={isAdmin}
        onSaved={(updatedLetter) => setLetter(updatedLetter)}
      />
    </div>
  );
}
