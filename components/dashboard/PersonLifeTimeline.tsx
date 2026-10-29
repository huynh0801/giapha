"use client";

import { useEffect, useState, useTransition } from "react";
import PersonLifeEventModal from "@/components/dashboard/PersonLifeEventModal";
import {
  deletePersonLifeEventAction,
  getPersonLifeEventsAction,
} from "@/app/actions/life-events";
import { PersonLifeEvent } from "@/types";
import {
  Calendar,
  Clock,
  Edit3,
  HeartHandshake,
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  User,
} from "lucide-react";

interface PersonLifeTimelineProps {
  personId: string;
  personName: string;
  familyId: string;
  treeId: string;
  initialEvents?: PersonLifeEvent[] | null;
  canWrite?: boolean;
  canEdit?: boolean;
  isSelfPerson?: boolean;
  isAdmin?: boolean;
  currentUserName?: string | null;
  currentUserId?: string | null;
}

export default function PersonLifeTimeline({
  personId,
  personName,
  familyId,
  treeId,
  initialEvents,
  canWrite = false,
  canEdit = false,
  isSelfPerson = false,
  isAdmin = false,
  currentUserName,
  currentUserId,
}: PersonLifeTimelineProps) {
  const [events, setEvents] = useState<PersonLifeEvent[]>(
    initialEvents ?? [],
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<PersonLifeEvent | null>(
    null,
  );
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (initialEvents !== undefined) {
      setEvents(initialEvents || []);
      return;
    }
    let isMounted = true;
    if (personId && familyId) {
      void getPersonLifeEventsAction(personId, familyId).then((res) => {
        if (isMounted && res.success && res.data) {
          setEvents(res.data);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [personId, familyId, initialEvents]);

  const handleOpenCreateModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: PersonLifeEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = (eventId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mốc nhật ký này?")) {
      return;
    }

    setIsDeletingId(eventId);
    startTransition(async () => {
      const res = await deletePersonLifeEventAction(eventId, familyId, personId);
      if (res.success) {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
      } else {
        alert(res.error || "Không thể xóa mốc nhật ký.");
      }
      setIsDeletingId(null);
    });
  };

  const handleSaved = (savedEvent: PersonLifeEvent) => {
    setEvents((prev) => {
      const existingIdx = prev.findIndex((e) => e.id === savedEvent.id);
      let updated: PersonLifeEvent[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = savedEvent;
      } else {
        updated = [...prev, savedEvent];
      }
      // Sắp xếp lại theo năm tăng dần
      return updated.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        if ((a.month || 0) !== (b.month || 0)) return (a.month || 0) - (b.month || 0);
        return (a.day || 0) - (b.day || 0);
      });
    });
  };

  const canModifyEvent = (event: PersonLifeEvent) => {
    if (canEdit || isAdmin || isSelfPerson) return true;
    if (currentUserId && event.created_by === currentUserId) return true;
    return false;
  };

  return (
    <div className="w-full">
      {/* Tiêu đề mục Niên biểu / Nhật ký */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#deb887]/40">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#f5e7c7] text-[#8c1d1d] shadow-2xs">
            <Calendar className="size-4" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#183b28] tracking-tight">
              Niên biểu & Nhật ký cuộc đời
            </h3>
            <p className="text-xs text-[#7d6c5d]">
              Ghi chép các sự kiện, mốc son và kỷ niệm đáng nhớ qua từng năm
            </p>
          </div>
        </div>

        {canWrite && events.length > 0 && (
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#8c1d1d] to-[#b32424] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:from-[#751818] hover:to-[#9c2020] transition-all"
          >
            <Plus className="size-3.5" />
            Thêm mốc năm
          </button>
        )}
      </div>

      {events.length > 0 ? (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#8c1d1d] before:via-[#deb887] before:to-[#deb887]/30">
          {events.map((event) => {
            const hasPermission = canModifyEvent(event);
            const formattedDate = [
              event.day ? `${event.day.toString().padStart(2, "0")}` : null,
              event.month ? `Tháng ${event.month}` : null,
              `Năm ${event.year}`,
            ]
              .filter(Boolean)
              .join(" / ");

            return (
              <div key={event.id} className="relative group">
                {/* Node biểu tượng hình tròn trên trục thời gian */}
                <div className="absolute -left-[30px] sm:-left-[38px] top-1.5 flex size-7 sm:size-8 items-center justify-center rounded-full border-2 border-[#deb887] bg-[#f5e7c7] text-[#8c1d1d] font-black text-[11px] shadow-sm group-hover:scale-110 transition-transform">
                  <Clock className="size-3.5" />
                </div>

                {/* Thẻ nội dung mốc năm */}
                <div className="overflow-hidden rounded-2xl border border-[#deb887] bg-gradient-to-b from-[#fcf9f2] via-[#faf5e9] to-[#f7f0df] p-4 sm:p-5 shadow-xs text-[#2c1a11]">
                  {/* Header sự kiện */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#deb887]/40 pb-2.5">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-[#8c1d1d] px-2 py-0.5 text-xs font-black text-[#f5e7c7] shadow-2xs">
                        Năm {event.year}
                      </span>
                      <h4 className="mt-1.5 text-base sm:text-lg font-black text-[#183b28]">
                        {event.title}
                      </h4>
                      <p className="text-[11px] text-[#7d6c5d] font-medium">
                        {formattedDate}
                      </p>
                    </div>

                    {hasPermission && (
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(event)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#deb887] bg-white px-2.5 py-1 text-xs font-semibold text-[#7d6c5d] hover:bg-[#f5e7c7] hover:text-[#8c1d1d] transition-all shadow-2xs"
                        >
                          <Edit3 className="size-3" />
                          Sửa
                        </button>
                        <button
                          type="button"
                          disabled={isDeletingId === event.id}
                          onClick={() => handleDelete(event.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all shadow-2xs disabled:opacity-50"
                        >
                          {isDeletingId === event.id ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <Trash2 className="size-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Ảnh kỷ niệm (nếu có) */}
                  {event.image_url && (
                    <div className="my-3 overflow-hidden rounded-xl border border-[#deb887]/60 max-w-md">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="max-h-64 w-full object-cover transition-transform hover:scale-105 duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Nội dung nhật ký */}
                  <div className="my-3 whitespace-pre-line text-sm leading-relaxed text-[#3b2a1a]">
                    {event.content}
                  </div>

                  {/* Chân mốc năm: Thông tin người ghi chép */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#deb887]/40 pt-2.5 text-xs text-[#7d6c5d]">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#deb887] bg-[#f5e7c7]/60 px-2 py-0.5 text-[11px] font-bold text-[#8c1d1d]">
                        <HeartHandshake className="size-3" />
                        {event.author_type === "self"
                          ? "Chính chủ ghi chép"
                          : event.author_type === "admin"
                            ? "Ban quản trị đại diện"
                            : "Con / Cháu ghi giùm"}
                      </span>
                      <span className="font-semibold text-[#2c1a11]">
                        Ghi chép: {event.author_name}
                        {event.author_relationship
                          ? ` (${event.author_relationship})`
                          : ""}
                      </span>
                    </div>

                    <span className="text-[11px] text-stone-500">
                      Cập nhật:{" "}
                      {new Date(
                        event.updated_at || event.created_at,
                      ).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="relative rounded-2xl border-2 border-dashed border-[#deb887]/80 bg-[#fdfbf7]/60 p-6 text-center text-[#2c1a11]">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#f5e7c7] text-[#8c1d1d] shadow-2xs mb-3">
            <Calendar className="size-6" />
          </div>
          <h4 className="text-base font-bold text-[#183b28]">
            Niên biểu & Nhật ký cuộc đời
          </h4>
          <p className="mt-1 text-xs text-[#7d6c5d] max-w-md mx-auto">
            Thành viên này chưa có mốc nhật ký nào ghi lại. Con cháu, người thân hoặc Ban quản trị có thể ghi chép từng mốc năm kỷ niệm để xây dựng dòng thời gian cuộc đời.
          </p>

          {canWrite && (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8c1d1d] to-[#a82424] px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-[#751818] hover:to-[#911f1f] transition-all"
              >
                <Plus className="size-3.5" />
                Thêm mốc năm đầu tiên
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal soạn thảo mốc năm */}
      <PersonLifeEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        personId={personId}
        personName={personName}
        familyId={familyId}
        treeId={treeId}
        initialEvent={selectedEvent}
        currentUserName={currentUserName}
        isSelfPerson={isSelfPerson}
        isAdmin={isAdmin}
        onSaved={handleSaved}
      />
    </div>
  );
}
