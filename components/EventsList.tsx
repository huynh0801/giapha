"use client";

import { getZodiacSign } from "@/utils/dateHelpers";
import {
  computeEvents,
  CustomEventRecord,
  FamilyEvent,
} from "@/utils/eventHelpers";
import { motion } from "framer-motion";
import {
  AlignLeft,
  Cake,
  CalendarDays,
  Clock,
  Flower,
  MapPin,
  Plus,
  Star,
} from "lucide-react";
import { Solar } from "lunar-javascript";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import CustomEventModal from "./CustomEventModal";
import { useDashboard } from "./DashboardContext";
import { HeritageBadge, HeritageFrame } from "./dashboard/HeritageUI";

interface EventsListProps {
  persons: {
    id: string;
    full_name: string;
    birth_year: number | null;
    birth_month: number | null;
    birth_day: number | null;
    death_year: number | null;
    death_month: number | null;
    death_day: number | null;
    death_lunar_year: number | null;
    death_lunar_month: number | null;
    death_lunar_day: number | null;
    is_deceased: boolean;
  }[];
  customEvents?: CustomEventRecord[];
}

const DAY_LABELS: Record<string, string> = {
  "-1": "Hôm qua",
  "0": "Hôm nay",
  "1": "Ngày mai",
};

function daysUntilLabel(days: number): string {
  if (days.toString() in DAY_LABELS) return DAY_LABELS[days.toString()];
  if (days < 0) {
    const abs = Math.abs(days);
    if (abs <= 30) return `${abs} ngày trước`;
    if (abs <= 60) return `${Math.ceil(abs / 7)} tuần trước`;
    return `${Math.ceil(abs / 30)} tháng trước`;
  }
  if (days <= 30) return `${days} ngày nữa`;
  if (days <= 60) return `${Math.ceil(days / 7)} tuần nữa`;
  return `${Math.ceil(days / 30)} tháng nữa`;
}

function EventCard({
  event,
  index,
  onEditCustomEvent,
  canEdit,
}: {
  event: FamilyEvent;
  index: number;
  onEditCustomEvent: (e: FamilyEvent) => void;
  canEdit: boolean;
}) {
  const isBirthday = event.type === "birthday";
  const isCustom = event.type === "custom_event";
  const isDeathAnniversary = event.type === "death_anniversary";
  const isToday = event.daysUntil === 0;
  const isPast = event.daysUntil < 0;
  const isSoon = event.daysUntil > 0 && event.daysUntil <= 7;

  const { setMemberModalId } = useDashboard();

  const handleClick = () => {
    if (isCustom && canEdit) {
      onEditCustomEvent(event);
    } else if (event.personId) {
      setMemberModalId(event.personId);
    }
  };

  // Compute age or years since for display
  const yearsInfo = (() => {
    if (!event.originYear) return null;
    const now = new Date().getFullYear();
    const diff = now - event.originYear;
    if (diff <= 0) return null;
    if (isBirthday) return `${diff} tuổi`;
    if (event.type === "death_anniversary") return `Kỵ nhật lần thứ ${diff}`;
    return null;
  })();

  const dateLabel = (() => {
    const weekdays = [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];
    const d = event.nextOccurrence;
    const dayOfWeek = weekdays[d.getDay()];
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();

    let label = `${dayOfWeek}, ${day}/${month}`;
    if (event.type === "custom_event") {
      label += `/${year}`;
    }
    return label;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      onClick={handleClick}
      className={`group relative w-full text-left flex items-start gap-3.5 sm:gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer active:scale-[0.99] shadow-xs hover:shadow-md ${
        isToday
          ? "bg-gradient-to-r from-[#fffdf7] via-[#fef8ea] to-[#fffdf7] border-[#8c1d1d]"
          : isPast
            ? "bg-[#fffdf7]/60 border-[#deb887]/40 opacity-75"
            : isDeathAnniversary
              ? "bg-[#fffdf7] border-[#deb887]/80 hover:border-[#8c1d1d]"
              : isBirthday
                ? "bg-[#fffdf7] border-[#deb887]/80 hover:border-[#caa455]"
                : "bg-[#fffdf7] border-[#deb887]/80 hover:border-[#183b28]"
      }`}
    >
      {/* Decorative corner marker */}
      <span
        className={`pointer-events-none absolute top-1.5 right-1.5 size-2 border-t-2 border-r-2 opacity-60 transition-colors ${
          isDeathAnniversary
            ? "border-[#8c1d1d] group-hover:opacity-100"
            : isBirthday
              ? "border-[#caa455] group-hover:opacity-100"
              : "border-[#183b28] group-hover:opacity-100"
        }`}
      />

      {/* Icon Badge */}
      <div
        className={`shrink-0 size-11 flex items-center justify-center rounded-xl border shadow-xs transition-transform group-hover:scale-105 ${
          isToday
            ? "bg-[#8c1d1d] text-white border-[#6e1616]"
            : isDeathAnniversary
              ? "bg-[#fbeaea] text-[#8c1d1d] border-[#f0bcbc]"
              : isBirthday
                ? "bg-[#fef8ea] text-[#92540b] border-[#e8ce8a]"
                : "bg-[#eaf3ed] text-[#183b28] border-[#a3c9b2]"
        }`}
      >
        {isBirthday ? (
          <Cake className="size-5" />
        ) : isCustom ? (
          <Star className="size-5" />
        ) : (
          <Flower className="size-5" />
        )}
      </div>

      {/* Info Container */}
      <div className="flex-1 min-w-0">
        {/* Top row: name + badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <p
              className={`font-bold text-base truncate transition-colors ${
                isPast
                  ? "text-[#7a6455]"
                  : "text-[#183b28] group-hover:text-[#8c1d1d]"
              }`}
            >
              {event.personName}
            </p>

            {isDeathAnniversary && (
              <HeritageBadge variant="crimson" className="text-[10px] px-2 py-0.5">
                Kỵ nhật (Giỗ)
              </HeritageBadge>
            )}

            {isBirthday && (
              <HeritageBadge variant="amber" className="text-[10px] px-2 py-0.5">
                Sinh nhật
              </HeritageBadge>
            )}

            {isCustom && (
              <HeritageBadge variant="jade" className="text-[10px] px-2 py-0.5">
                Việc họ
              </HeritageBadge>
            )}

            {isBirthday &&
              event.originDay &&
              event.originMonth &&
              getZodiacSign(event.originDay, event.originMonth) && (
                <span className="text-[10px] font-bold text-[#7a6455] bg-[#f5e7c7]/60 border border-[#deb887] rounded-md px-1.5 py-0.5">
                  {getZodiacSign(event.originDay, event.originMonth)}
                </span>
              )}
          </div>

          {/* Days badge */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shadow-xs ${
              isToday
                ? "bg-[#8c1d1d] text-white animate-pulse"
                : isPast
                  ? "bg-[#f4efe6] text-[#7a6455] border border-[#deb887]/60"
                  : isSoon
                    ? "bg-[#fbeaea] text-[#8c1d1d] border border-[#f0bcbc]"
                    : "bg-[#fef8ea] text-[#92540b] border border-[#e8ce8a]"
            }`}
          >
            {!isToday && <Clock className="size-3" />}
            {daysUntilLabel(event.daysUntil)}
          </span>
        </div>

        {/* Date & lunar specifics */}
        <div className="flex flex-col gap-1 mt-2">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#5c4a3e]">
            <span className="flex items-center gap-1 font-semibold text-[#183b28]">
              <CalendarDays className="size-3.5 text-[#8c1d1d]" />
              {dateLabel}
            </span>

            {isDeathAnniversary && (
              <span className="inline-flex items-center gap-1 rounded bg-[#f5e7c7]/60 px-2 py-0.5 font-bold text-[#8c1d1d] border border-[#deb887]">
                Âm lịch: {event.eventDateLabel.replace(" ÂL", "")}
              </span>
            )}

            {yearsInfo && <span className="text-[#7a6455]">· {yearsInfo}</span>}
          </div>

          {event.location && (
            <p className="text-xs sm:text-sm text-[#7a6455] flex items-center gap-1.5 leading-snug">
              <MapPin className="size-3.5 shrink-0 text-[#caa455]" />
              <span className="truncate">{event.location}</span>
            </p>
          )}

          {event.content && (
            <p className="text-xs sm:text-sm text-[#5c4a3e] flex items-start gap-1.5 leading-snug mt-0.5">
              <AlignLeft className="size-3.5 shrink-0 text-[#deb887] mt-0.5" />
              <span className="line-clamp-2">{event.content}</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function EventsList({
  persons,
  customEvents = [],
}: EventsListProps) {
  const router = useRouter();
  const { canEdit } = useDashboard();
  const [filter, setFilter] = useState<
    "all" | "birthday" | "death_anniversary" | "custom_event" | "past"
  >("all");
  const [showCount, setShowCount] = useState(20);
  const [showDeceasedBirthdays, setShowDeceasedBirthdays] = useState(false);

  // Custom Event Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomEvent, setEditingCustomEvent] =
    useState<CustomEventRecord | null>(null);

  const handleOpenEditModal = (event: FamilyEvent) => {
    const rawEvent = customEvents.find((ce) => ce.id === event.personId);
    if (rawEvent) {
      setEditingCustomEvent(rawEvent);
      setIsModalOpen(true);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCustomEvent(null);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    router.refresh();
  };

  const [todayDate] = useState(() => {
    const today = new Date();
    const weekdays = [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];
    const dayOfWeek = weekdays[today.getDay()];
    const solarStr = `${dayOfWeek}, ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    let lunarStr = "";
    try {
      const solar = Solar.fromYmd(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate(),
      );
      const lunar = solar.getLunar();
      const lMonthRaw = lunar.getMonth();
      const isLeap = lMonthRaw < 0;
      const lMonth = Math.abs(lMonthRaw).toString().padStart(2, "0");
      const lDay = lunar.getDay().toString().padStart(2, "0");
      lunarStr = `${lDay}/${lMonth}${isLeap ? " nhuận" : ""} ÂL`;
    } catch (e) {
      console.error(e);
    }
    return { solar: solarStr, lunar: lunarStr };
  });

  const allEvents = useMemo(
    () => computeEvents(persons, customEvents),
    [persons, customEvents],
  );

  const filtered = useMemo(() => {
    let result = allEvents;
    if (filter === "past") {
      return result
        .filter((e) => e.daysUntil < 0 && e.daysUntil >= -365)
        .sort((a, b) => b.daysUntil - a.daysUntil);
    }
    if (filter !== "all") {
      result = result.filter((e) => e.type === filter);
    }
    if (!showDeceasedBirthdays) {
      result = result.filter((e) => !(e.type === "birthday" && e.isDeceased));
    }
    return result.filter((e) => e.daysUntil >= 0 && e.daysUntil <= 365);
  }, [allEvents, filter, showDeceasedBirthdays]);

  const visible = filtered.slice(0, showCount);

  const todayCount = allEvents.filter((e) => e.daysUntil === 0).length;
  const soonCount = allEvents.filter(
    (e) => e.daysUntil > 0 && e.daysUntil <= 7,
  ).length;

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <HeritageFrame cornerColor="#8c1d1d">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-[#f5e7c7] to-[#deb887] border-2 border-[#caa455] flex items-center justify-center shrink-0 shadow-sm text-[#8c1d1d]">
              <CalendarDays className="size-7" />
            </div>
            <div>
              <p
                className="text-xl sm:text-2xl font-bold text-[#183b28]"
                style={{
                  fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                }}
              >
                Hôm nay: {todayDate.solar}
              </p>
              {todayDate.lunar && (
                <div className="mt-1.5 flex items-center gap-2">
                  <HeritageBadge variant="crimson">
                    Âm lịch: {todayDate.lunar}
                  </HeritageBadge>
                  {(todayCount > 0 || soonCount > 0) && (
                    <HeritageBadge variant="amber">
                      {todayCount > 0
                        ? `${todayCount} sự kiện hôm nay`
                        : `${soonCount} sự kiện 7 ngày tới`}
                    </HeritageBadge>
                  )}
                </div>
              )}
            </div>
          </div>

          {canEdit && (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8c1d1d] to-[#6e1616] text-white font-bold text-sm shadow-sm hover:from-[#6e1616] hover:to-[#500e0e] active:scale-95 transition-all border border-[#8c1d1d]"
            >
              <Plus className="size-4.5" />
              <span>Thêm sự kiện gia tộc</span>
            </button>
          )}
        </div>
      </HeritageFrame>

      {/* Controls & Filter tabs */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { key: "all", label: "Tất cả sự kiện" },
              { key: "death_anniversary", label: "Ngày giỗ (Kỵ nhật)" },
              { key: "birthday", label: "Sinh nhật" },
              { key: "custom_event", label: "Việc họ & Tế lễ" },
              { key: "past", label: "Đã qua" },
            ] as const
          ).map((tab) => (
            <button
              type="button"
              key={tab.key}
              onClick={() => {
                setFilter(tab.key);
                setShowCount(20);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                filter === tab.key
                  ? "bg-[#8c1d1d] text-white shadow-xs border-2 border-[#6e1616]"
                  : "bg-[#fffdf7] text-[#7a6455] border-2 border-[#deb887]/70 hover:border-[#caa455] hover:text-[#183b28]"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span className="ml-auto text-xs font-bold text-[#7a6455] self-center">
            {filtered.length} sự kiện{filter === "past" ? " trong năm qua" : ""}
          </span>
        </div>

        {/* Toggle options — hide when viewing past events */}
        {filter !== "past" && (
          <div className="flex px-1">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#7a6455] cursor-pointer hover:text-[#183b28] select-none">
              <input
                type="checkbox"
                checked={showDeceasedBirthdays}
                onChange={(e) => setShowDeceasedBirthdays(e.target.checked)}
                className="rounded border-[#deb887] text-[#8c1d1d] focus:ring-[#8c1d1d] size-4 transition-all accent-[#8c1d1d]"
              />
              Hiển thị sinh nhật của tiền nhân đã quy tiên
            </label>
          </div>
        )}
      </div>

      {/* Event list */}
      {visible.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-[#deb887]/60 bg-[#fffdf7]/50 text-[#7a6455]">
          <CalendarDays className="size-10 mx-auto mb-3 text-[#deb887]" />
          <p className="font-bold">Không có sự kiện nào trong danh mục này</p>
          <p className="text-xs mt-1 text-[#7a6455]/80">
            Hãy bổ sung ngày sinh hoặc ngày mất (dương lịch hoặc âm lịch) cho thành viên
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((event, i) => (
            <EventCard
              key={`${event.personId}-${event.type}-${event.eventDateLabel}`}
              event={event}
              index={i}
              onEditCustomEvent={handleOpenEditModal}
              canEdit={canEdit}
            />
          ))}
        </div>
      )}

      {/* Load more */}
      {filtered.length > showCount && (
        <button
          type="button"
          onClick={() => setShowCount((n) => n + 20)}
          className="w-full py-3 text-sm font-bold text-[#8c1d1d] hover:text-[#6e1616] transition-colors rounded-xl border border-[#deb887] bg-[#fffdf7]"
        >
          Xem thêm {filtered.length - showCount} sự kiện khác…
        </button>
      )}

      <CustomEventModal
        key={`${isModalOpen ? editingCustomEvent?.id ?? "new" : "closed"}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        eventToEdit={editingCustomEvent}
      />
    </div>
  );
}
