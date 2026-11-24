"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Settings2,
  CalendarDays,
  Sparkles,
  ArrowRight,
  Flower2,
  Cake,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { computeEvents, CustomEventRecord, FamilyEvent } from "@/utils/eventHelpers";
import { getDayVanNienData, DayVanNienData } from "@/utils/calendar/vanNienHelper";
import { HeritageBadge } from "./HeritageUI";

export interface ClanCalendarCardProps {
  /** Member records for anniversary / birthday calculations */
  persons?: any[];
  /** Custom events list */
  customEvents?: CustomEventRecord[];
  /** Family slug for links */
  familySlug: string;
  /** Optional treeId */
  treeId?: string;
  /** Can edit permission */
  canEdit?: boolean;
  /** Optional extra className */
  className?: string;
}

type EventFilterRange = "today" | "7days" | "30days";

export function ClanCalendarCard({
  persons = [],
  customEvents = [],
  familySlug,
  treeId,
  canEdit = false,
  className = "",
}: ClanCalendarCardProps) {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<EventFilterRange>("today");
  const [showAstrology, setShowAstrology] = useState(true);
  const [showCustoms, setShowCustoms] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Calculate day details for current selected date
  const dayData: DayVanNienData = useMemo(() => {
    return getDayVanNienData(currentDate);
  }, [currentDate]);

  // Compute upcoming family events relative to today
  const allEvents: FamilyEvent[] = useMemo(() => {
    return computeEvents(persons, customEvents);
  }, [persons, customEvents]);

  // Group events by timeframe
  const todayEvents = useMemo(
    () => allEvents.filter((e) => e.daysUntil === 0),
    [allEvents],
  );
  const weekEvents = useMemo(
    () => allEvents.filter((e) => e.daysUntil >= 0 && e.daysUntil <= 7),
    [allEvents],
  );
  const monthEvents = useMemo(
    () => allEvents.filter((e) => e.daysUntil >= 0 && e.daysUntil <= 30),
    [allEvents],
  );

  const displayedEvents =
    activeTab === "today"
      ? todayEvents
      : activeTab === "7days"
      ? weekEvents
      : monthEvents;

  // Day navigation handlers
  const handlePrevDay = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() - 1);
      return next;
    });
  };

  const handleNextDay = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 1);
      return next;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const isCurrentToday = useMemo(() => {
    const today = new Date();
    return (
      today.getDate() === currentDate.getDate() &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  }, [currentDate]);

  const dateParam = `${dayData.solarYear}-${String(dayData.solarMonth).padStart(2, "0")}-${String(dayData.solarDay).padStart(2, "0")}`;
  const eventsHref = treeId
    ? `/dashboard/${familySlug}/events?treeId=${treeId}&date=${dateParam}`
    : `/dashboard/${familySlug}/events?date=${dateParam}`;

  return (
    <div
      className={`relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 shadow-[0_4px_24px_rgba(44,26,17,0.06)] rounded-2xl ${className}`}
    >
      <div className="relative overflow-hidden rounded-xl border border-[#deb887] bg-[#fffdf7]">
        {/* 4 Traditional Corner Brackets */}
        <span className="pointer-events-none absolute top-1.5 left-1.5 size-3.5 border-t-2 border-l-2 border-[#8c1d1d] z-10" />
        <span className="pointer-events-none absolute top-1.5 right-1.5 size-3.5 border-t-2 border-r-2 border-[#8c1d1d] z-10" />
        <span className="pointer-events-none absolute bottom-1.5 left-1.5 size-3.5 border-b-2 border-l-2 border-[#8c1d1d] z-10" />
        <span className="pointer-events-none absolute bottom-1.5 right-1.5 size-3.5 border-b-2 border-r-2 border-[#8c1d1d] z-10" />

        {/* ── 1. Top Header Bar with Day Navigation ────────────────────────── */}
        <div className="flex select-none items-center justify-between border-b border-[#deb887]/60 bg-gradient-to-r from-[#fbf7ed] via-[#fffdf7] to-[#fbf7ed] px-4 py-3 sm:px-6">
          {/* Navigation arrows */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevDay}
              className="flex size-8 items-center justify-center rounded-lg border border-[#deb887] bg-[#fffdf7] text-[#8c1d1d] shadow-xs transition hover:bg-[#f5e7c7] hover:scale-105 active:scale-95"
              title="Ngày trước"
              aria-label="Ngày trước"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleNextDay}
              className="flex size-8 items-center justify-center rounded-lg border border-[#deb887] bg-[#fffdf7] text-[#8c1d1d] shadow-xs transition hover:bg-[#f5e7c7] hover:scale-105 active:scale-95"
              title="Ngày tiếp theo"
              aria-label="Ngày tiếp theo"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Center: "Hôm nay" jump button */}
          <button
            type="button"
            onClick={handleToday}
            className={`font-serif text-base sm:text-lg font-black tracking-wide transition-colors ${
              isCurrentToday
                ? "text-[#8c1d1d] hover:text-[#6e1616]"
                : "text-[#183b28] hover:text-[#8c1d1d]"
            }`}
            title="Về ngày hôm nay"
          >
            {isCurrentToday ? "Hôm nay" : `Xem ngày ${dayData.solarDay}/${dayData.solarMonth}`}
          </button>

          {/* Right: Expand/Collapse toggle button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex size-8 items-center justify-center rounded-lg border border-[#deb887] bg-[#fffdf7] text-[#5c4a3e] shadow-xs transition hover:bg-[#f5e7c7] hover:text-[#8c1d1d]"
            title={isExpanded ? "Thu gọn lịch" : "Mở rộng lịch"}
            aria-label={isExpanded ? "Thu gọn lịch" : "Mở rộng lịch"}
          >
            {isExpanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </button>
        </div>

        {/* ── 2. Collapsible Main Body ───────────────────────────────────────── */}
        {isExpanded && (
          <div className="p-5 sm:p-7 space-y-6">
            {/* Top Date Hero Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-5">
                {/* Calendar Bloc (Traditional Heritage Style) */}
                <div className="shrink-0 w-24 sm:w-28 rounded-2xl overflow-hidden border-2 border-[#deb887] shadow-sm bg-white text-center">
                  <div className="bg-[#8c1d1d] text-white py-1 px-1.5">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider">
                      {dayData.weekdayName}
                    </p>
                  </div>
                  <div className="py-2 px-1">
                    <p className="text-3xl sm:text-4xl font-black text-[#8c1d1d] leading-none tracking-tight my-0.5">
                      {dayData.solarDay}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold text-[#7a6455]">
                      Tháng {dayData.solarMonth} · {dayData.solarYear}
                    </p>
                  </div>
                </div>

                {/* Lunar Date Text */}
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-widest text-[#8c1d1d]">
                    Âm lịch
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#183b28] mt-0.5">
                    {dayData.lunarDayStr}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-[#7a6455] mt-0.5">
                    {dayData.lunarYear}
                  </p>
                </div>
              </div>

              {/* Huangdao / Heidao & Warning Status Badges */}
              <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
                {dayData.isHoangDao ? (
                  <HeritageBadge variant="jade" className="px-3 py-1 text-xs">
                    <span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Ngày tốt (Hoàng đạo)</span>
                  </HeritageBadge>
                ) : (
                  <HeritageBadge variant="amber" className="px-3 py-1 text-xs">
                    <span className="size-2 rounded-full bg-amber-600" />
                    <span>Ngày xấu (Hắc đạo)</span>
                  </HeritageBadge>
                )}
                {dayData.isTamNuong && (
                  <HeritageBadge variant="crimson" className="px-2.5 py-1 text-xs">
                    <span>⚠ Tam Nương</span>
                  </HeritageBadge>
                )}
                {dayData.isNguyetKy && (
                  <HeritageBadge variant="amber" className="px-2.5 py-1 text-xs">
                    <span>⚠ Nguyệt Kỵ</span>
                  </HeritageBadge>
                )}
                {dayData.holiday && (
                  <HeritageBadge variant="crimson" className="px-2.5 py-1 text-xs">
                    <span>🏮 {dayData.holiday}</span>
                  </HeritageBadge>
                )}
              </div>
            </div>

            {/* Astrological / Vạn Niên Details */}
            {showAstrology && (
              <div className="space-y-4 pt-1">
                {/* 7 Chips Bar */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="rounded-lg border border-[#deb887] bg-[#fcfaf5] px-2.5 py-1 text-[#183b28]">
                    Ngày {dayData.lunarDayCanChi}
                  </span>
                  <span className="rounded-lg border border-[#deb887] bg-[#fcfaf5] px-2.5 py-1 text-[#183b28]">
                    Tháng {dayData.lunarMonthStr}
                  </span>
                  <span className="rounded-lg border border-[#deb887] bg-[#fcfaf5] px-2.5 py-1 text-[#183b28]">
                    {dayData.lunarYear}
                  </span>
                  <span className="rounded-lg border border-[#deb887] bg-[#fcfaf5] px-2.5 py-1 text-[#183b28]">
                    {dayData.truc}
                  </span>
                  <span className="rounded-lg border border-[#deb887] bg-[#fcfaf5] px-2.5 py-1 text-[#183b28]">
                    {dayData.saoName}
                  </span>
                  <span className="rounded-lg border border-[#deb887] bg-[#fcfaf5] px-2.5 py-1 text-[#183b28]">
                    {dayData.tietKhi}
                  </span>
                  <span className="rounded-lg border border-[#deb887] bg-[#fcfaf5] px-2.5 py-1 text-[#8c1d1d]">
                    Ngũ hành {dayData.naYin}
                  </span>
                </div>

                {/* Callout Box: "Vì sao? ..." */}
                <div className="rounded-xl border border-[#caa455] bg-[#fef8ea] p-3.5 sm:p-4 text-xs sm:text-sm text-[#92540b]">
                  <p className="leading-relaxed">
                    <span className="font-black text-[#8c1d1d]">Vì sao? </span>
                    {dayData.reasonText}
                  </p>
                </div>

                {/* Hours Breakdown (Giờ tốt Hoàng đạo & Giờ hắc đạo tránh) */}
                <div className="space-y-2.5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#183b28] mb-1.5">
                      Giờ tốt (hoàng đạo):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {dayData.auspiciousHours.map((hourStr, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-lg border border-[#cbe5d2] bg-[#eef7f0] px-2.5 py-1 text-xs font-bold text-[#183b28]"
                        >
                          {hourStr}
                        </span>
                      ))}
                    </div>
                  </div>

                  {dayData.inauspiciousHours.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#8c1d1d] mb-1.5">
                        Giờ hắc đạo (tránh việc lớn):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {dayData.inauspiciousHours.map((hourStr, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-lg border border-[#f5d7d4] bg-[#fdf6f5] px-2.5 py-1 text-xs font-medium text-[#7a6455]"
                          >
                            {hourStr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Do and Don't Recommendations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="rounded-xl border border-[#cbe5d2] bg-[#f0f9f3]/60 p-3.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#183b28] flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="size-4 text-emerald-700" />
                      <span>Nên làm</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {dayData.goodActivities.map((act, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-md bg-white/80 border border-[#cbe5d2] px-2 py-0.5 text-xs font-bold text-[#183b28]"
                        >
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#f5d7d4] bg-[#fff8f6]/60 p-3.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#8c1d1d] flex items-center gap-1.5 mb-2">
                      <XCircle className="size-4 text-[#8c1d1d]" />
                      <span>Nên tránh</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {dayData.badActivities.length > 0 ? (
                        dayData.badActivities.map((act, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-md bg-white/80 border border-[#f5d7d4] px-2 py-0.5 text-xs font-bold text-[#8c1d1d]"
                          >
                            {act}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#7a6455] italic">
                          Không có kiêng cữ đặc biệt
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Star Explanation */}
                <div className="rounded-xl border border-[#deb887]/60 bg-[#fbf7ed]/40 p-3 text-xs text-[#5c4a3e]">
                  <span className="font-bold text-[#183b28]">
                    {dayData.saoFullName} ({dayData.saoType})
                  </span>{" "}
                  — {dayData.saoDesc}
                </div>
              </div>
            )}

            {/* ── 3. Sự Kiện Trong Dòng Họ ────────────────────────────────────── */}
            <div className="border-t border-[#deb887]/50 pt-5 space-y-3.5">
              <p className="text-xs font-black uppercase tracking-wider text-[#8c1d1d]">
                Sự kiện trong dòng họ
              </p>

              {/* Timeframe Filter Tabs */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("today")}
                  className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all text-center ${
                    activeTab === "today"
                      ? "bg-[#8c1d1d] text-white border border-[#6e1616] shadow-xs"
                      : "bg-[#fffdf7] text-[#7a6455] border border-[#deb887]/80 hover:bg-[#f5e7c7]/50"
                  }`}
                >
                  Hôm nay ({todayEvents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("7days")}
                  className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all text-center ${
                    activeTab === "7days"
                      ? "bg-[#8c1d1d] text-white border border-[#6e1616] shadow-xs"
                      : "bg-[#fffdf7] text-[#7a6455] border border-[#deb887]/80 hover:bg-[#f5e7c7]/50"
                  }`}
                >
                  7 ngày ({weekEvents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("30days")}
                  className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all text-center ${
                    activeTab === "30days"
                      ? "bg-[#8c1d1d] text-white border border-[#6e1616] shadow-xs"
                      : "bg-[#fffdf7] text-[#7a6455] border border-[#deb887]/80 hover:bg-[#f5e7c7]/50"
                  }`}
                >
                  30 ngày ({monthEvents.length})
                </button>
              </div>

              {/* Events List / Empty State */}
              {displayedEvents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#deb887] bg-[#fcfaf5] p-3.5 text-center">
                  <p className="text-xs sm:text-sm text-[#7a6455] italic">
                    {activeTab === "today"
                      ? "Hôm nay không có giỗ, sinh nhật hay lễ tết nào."
                      : activeTab === "7days"
                      ? "Trong 7 ngày tới không có giỗ hay sự kiện nào."
                      : "Trong 30 ngày tới không có sự kiện nào."}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  {displayedEvents.slice(0, 5).map((event, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-[#deb887]/70 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] px-3.5 py-2.5 text-xs sm:text-sm shadow-2xs transition hover:border-[#caa455]"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {event.type === "death_anniversary" ? (
                          <Flower2 className="size-4 text-[#8c1d1d] shrink-0" />
                        ) : event.type === "birthday" ? (
                          <Cake className="size-4 text-[#92540b] shrink-0" />
                        ) : (
                          <CalendarDays className="size-4 text-[#183b28] shrink-0" />
                        )}
                        <span className="font-bold text-[#183b28] truncate">
                          {event.personName}
                        </span>
                        <span className="text-xs text-[#7a6455] truncate hidden sm:inline">
                          — {event.content}
                        </span>
                      </div>

                      <HeritageBadge
                        variant={event.daysUntil === 0 ? "crimson" : "amber"}
                        className="shrink-0 text-xs"
                      >
                        {event.daysUntil === 0
                          ? "Hôm nay"
                          : event.daysUntil === 1
                          ? "Ngày mai"
                          : `${event.daysUntil} ngày nữa`}
                      </HeritageBadge>
                    </div>
                  ))}
                </div>
              )}

              {/* Link to full events page */}
              <div className="flex justify-end pt-1">
                <Link
                  href={eventsHref}
                  className="text-xs font-bold text-[#8c1d1d] hover:text-[#6e1616] flex items-center gap-1 transition-colors group"
                >
                  <span className="group-hover:underline">Xem toàn bộ lịch</span>
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* ── 4. Phong Tục Hôm Nay ────────────────────────────────────────── */}
            {showCustoms && (
              <div className="border-t border-[#deb887]/50 pt-5 space-y-1.5">
                <p className="text-xs font-black uppercase tracking-wider text-[#8c1d1d]">
                  Phong tục hôm nay
                </p>
                <h4 className="text-sm sm:text-base font-bold text-[#183b28]">
                  {dayData.traditionalCustom.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#5c4a3e] leading-relaxed">
                  {dayData.traditionalCustom.desc}
                </p>
              </div>
            )}

            {/* ── 5. Display Preferences Toggle ───────────────────────────────── */}
            <div className="border-t border-[#deb887]/50 pt-3">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7a6455] hover:text-[#8c1d1d] transition-colors"
              >
                <Settings2 className="size-3.5 text-[#deb887]" />
                <span>Tuỳ chọn hiển thị</span>
                <ChevronDown
                  className={`size-3 transition-transform ${
                    showSettings ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showSettings && (
                <div className="mt-2.5 rounded-xl border border-[#deb887] bg-[#fbf7ed] p-3.5 flex flex-wrap items-center gap-5 text-xs text-[#5c4a3e] font-semibold">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAstrology}
                      onChange={(e) => setShowAstrology(e.target.checked)}
                      className="rounded border-[#deb887] accent-[#8c1d1d]"
                    />
                    <span>Thông tin vạn niên & giờ hoàng đạo</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCustoms}
                      onChange={(e) => setShowCustoms(e.target.checked)}
                      className="rounded border-[#deb887] accent-[#8c1d1d]"
                    />
                    <span>Phong tục tập quán cổ truyền</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 6. Bottom Banner Link ─────────────────────────────────────────── */}
        <Link
          href={eventsHref}
          className="flex items-center justify-between border-t border-[#deb887]/60 bg-gradient-to-r from-[#fbf7ed] via-[#fffdf7] to-[#fbf7ed] px-4 py-3 sm:px-6 text-xs sm:text-sm font-bold text-[#8c1d1d] transition hover:bg-[#f5e7c7] group"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="size-4 text-[#caa455]" />
            <span>Mở lịch & xem chi tiết ngày này</span>
          </span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export default ClanCalendarCard;
