"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CalendarDays,
  HeartHandshake,
  Home,
  Hammer,
  Store,
  Navigation,
  Shield,
  Flame,
  FileSignature,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  Flower2,
  Cake,
  X,
} from "lucide-react";
import { computeEvents, CustomEventRecord, FamilyEvent } from "@/utils/eventHelpers";
import {
  getDayVanNienData,
  getMonthCalendarGrid,
  findAuspiciousDays,
  AuspiciousActivityKey,
  ACTIVITY_OPTIONS,
  DayVanNienData,
  MonthCalendarCell,
} from "@/utils/calendar/vanNienHelper";
import { HeritageBadge } from "./HeritageUI";

export interface HeritageCalendarDetailViewProps {
  /** Family member records */
  persons?: any[];
  /** Custom family events */
  customEvents?: CustomEventRecord[];
  /** Family slug */
  familySlug: string;
  /** Optional Tree ID */
  treeId?: string;
  /** Initial selected date */
  initialDate?: Date;
  /** Optional extra className */
  className?: string;
}

export default function HeritageCalendarDetailView({
  persons = [],
  customEvents = [],
  familySlug,
  treeId,
  initialDate,
  className = "",
}: HeritageCalendarDetailViewProps) {
  // Current selected active date
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => initialDate || new Date(),
  );

  // Current calendar month view (year & month 1-12)
  const [viewYear, setViewYear] = useState<number>(() =>
    (initialDate || new Date()).getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState<number>(() =>
    (initialDate || new Date()).getMonth() + 1,
  );

  // Auspicious Finder states
  const [finderActivity, setFinderActivity] =
    useState<AuspiciousActivityKey>("opening");
  const [finderRange, setFinderRange] = useState<number>(30); // 7, 30, 90

  // ── Calculate Day Data for the Selected Date ──────────────────────────────
  const selectedDayData: DayVanNienData = useMemo(() => {
    return getDayVanNienData(selectedDate);
  }, [selectedDate]);

  // ── Calculate Month Grid Cells ────────────────────────────────────────────
  const monthCells: MonthCalendarCell[] = useMemo(() => {
    return getMonthCalendarGrid(viewYear, viewMonth);
  }, [viewYear, viewMonth]);

  // ── Compute Clan Events ───────────────────────────────────────────────────
  const allClanEvents: FamilyEvent[] = useMemo(() => {
    return computeEvents(persons, customEvents);
  }, [persons, customEvents]);

  // Map to quickly check if a solar date has clan events: "YYYY-M-D"
  const clanEventsDateSet = useMemo(() => {
    const set = new Set<string>();
    for (const ev of allClanEvents) {
      if (ev.nextOccurrence) {
        const y = ev.nextOccurrence.getFullYear();
        const m = ev.nextOccurrence.getMonth() + 1;
        const d = ev.nextOccurrence.getDate();
        set.add(`${y}-${m}-${d}`);
      }
    }
    return set;
  }, [allClanEvents]);

  // Clan events on the specifically selected date
  const eventsOnSelectedDate = useMemo(() => {
    const targetY = selectedDate.getFullYear();
    const targetM = selectedDate.getMonth() + 1;
    const targetD = selectedDate.getDate();

    return allClanEvents.filter((ev) => {
      if (!ev.nextOccurrence) return false;
      return (
        ev.nextOccurrence.getFullYear() === targetY &&
        ev.nextOccurrence.getMonth() + 1 === targetM &&
        ev.nextOccurrence.getDate() === targetD
      );
    });
  }, [allClanEvents, selectedDate]);

  // ── Auspicious Days Results ───────────────────────────────────────────────
  const auspiciousResults = useMemo(() => {
    return findAuspiciousDays(finderActivity, finderRange, selectedDate);
  }, [finderActivity, finderRange, selectedDate]);

  // ── Month Navigation Handlers ─────────────────────────────────────────────
  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setSelectedDate(now);
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth() + 1);
  };

  // Jump to specific date
  const handleSelectDay = (cellDate: Date) => {
    setSelectedDate(cellDate);
    if (
      cellDate.getFullYear() !== viewYear ||
      cellDate.getMonth() + 1 !== viewMonth
    ) {
      setViewYear(cellDate.getFullYear());
      setViewMonth(cellDate.getMonth() + 1);
    }
  };

  // Check if a cell date is the currently selected date
  const isCellSelected = (cellDate: Date) => {
    return (
      cellDate.getFullYear() === selectedDate.getFullYear() &&
      cellDate.getMonth() === selectedDate.getMonth() &&
      cellDate.getDate() === selectedDate.getDate()
    );
  };

  const currentActivityInfo = ACTIVITY_OPTIONS.find(
    (a) => a.key === finderActivity,
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ── 1. Full Month Calendar Grid ────────────────────────────────────── */}
      <div className="relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 shadow-[0_4px_24px_rgba(44,26,17,0.06)] rounded-2xl">
        <div className="relative overflow-hidden rounded-xl border border-[#deb887] bg-[#fffdf7]">
          {/* Corner brackets */}
          <span className="pointer-events-none absolute top-1.5 left-1.5 size-3.5 border-t-2 border-l-2 border-[#8c1d1d] z-10" />
          <span className="pointer-events-none absolute top-1.5 right-1.5 size-3.5 border-t-2 border-r-2 border-[#8c1d1d] z-10" />
          <span className="pointer-events-none absolute bottom-1.5 left-1.5 size-3.5 border-b-2 border-l-2 border-[#8c1d1d] z-10" />
          <span className="pointer-events-none absolute bottom-1.5 right-1.5 size-3.5 border-b-2 border-r-2 border-[#8c1d1d] z-10" />

          {/* Month Header Bar */}
          <div className="flex select-none items-center justify-between border-b border-[#deb887]/60 bg-gradient-to-r from-[#fbf7ed] via-[#fffdf7] to-[#fbf7ed] px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="flex size-8 items-center justify-center rounded-lg border border-[#deb887] bg-[#fffdf7] text-[#8c1d1d] shadow-xs transition hover:bg-[#f5e7c7] hover:scale-105 active:scale-95"
                title="Tháng trước"
                aria-label="Tháng trước"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="flex size-8 items-center justify-center rounded-lg border border-[#deb887] bg-[#fffdf7] text-[#8c1d1d] shadow-xs transition hover:bg-[#f5e7c7] hover:scale-105 active:scale-95"
                title="Tháng sau"
                aria-label="Tháng sau"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            <div className="text-center">
              <h3 className="font-serif text-lg sm:text-xl font-black text-[#183b28] tracking-wide">
                Tháng {viewMonth}/{viewYear}
              </h3>
            </div>

            <div>
              <button
                type="button"
                onClick={handleToday}
                className="px-3 py-1 text-xs font-bold rounded-lg border border-[#deb887] bg-[#fffdf7] text-[#8c1d1d] shadow-xs transition hover:bg-[#f5e7c7]"
              >
                Hôm nay
              </button>
            </div>
          </div>

          {/* 7 Days of the Week Column Headers */}
          <div className="grid grid-cols-7 border-b border-[#deb887]/60 bg-[#fbf7ed]/70 text-center text-xs font-bold text-[#7a6455]">
            <div className="py-2.5">Thứ 2</div>
            <div className="py-2.5">Thứ 3</div>
            <div className="py-2.5">Thứ 4</div>
            <div className="py-2.5">Thứ 5</div>
            <div className="py-2.5">Thứ 6</div>
            <div className="py-2.5 text-[#183b28]">Thứ 7</div>
            <div className="py-2.5 text-[#8c1d1d]">Chủ Nhật</div>
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-1 p-2 sm:p-3 bg-[#fcfaf5]">
            {monthCells.map((cell, idx) => {
              const isSelected = isCellSelected(cell.date);
              const cellKey = `${cell.solarYear}-${cell.solarMonth}-${cell.solarDay}`;
              const hasClanEvent = clanEventsDateSet.has(cellKey);

              // Background styling based on good/bad day and selection
              let cellBg = "bg-white text-[#2c1a11]";
              if (isSelected) {
                cellBg =
                  "ring-2 ring-[#caa455] bg-[#fbf5e6] shadow-sm z-10 border-[#caa455]";
              } else if (cell.isHoangDao) {
                cellBg =
                  "bg-[#eef7f0]/70 text-[#183b28] hover:bg-[#e2f2e6] border-[#cbe5d2]";
              } else {
                cellBg =
                  "bg-[#fdf6f5]/70 text-[#8c1d1d] hover:bg-[#fceeed] border-[#f5d7d4]";
              }

              if (!cell.isCurrentMonth) {
                cellBg += " opacity-40";
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDay(cell.date)}
                  className={`group relative flex flex-col justify-between rounded-xl border p-1.5 sm:p-2.5 min-h-[64px] sm:min-h-[82px] transition text-left cursor-pointer ${cellBg}`}
                >
                  {/* Top row: Solar day + corner indicator badges */}
                  <div className="flex items-start justify-between w-full">
                    <span
                      className={`text-sm sm:text-base font-black ${
                        isSelected
                          ? "text-[#8c1d1d]"
                          : cell.isToday
                          ? "text-[#8c1d1d] underline decoration-2 underline-offset-2"
                          : cell.isHoangDao
                          ? "text-[#183b28]"
                          : "text-[#8c1d1d]"
                      }`}
                    >
                      {cell.solarDay}
                    </span>

                    {/* Indicators */}
                    <div className="flex items-center gap-1">
                      {cell.holiday && (
                        <span
                          className="text-[11px] leading-none"
                          title={cell.holiday}
                        >
                          🏮
                        </span>
                      )}
                      {(cell.isTamNuong || cell.isNguyetKy) && (
                        <span
                          className="size-1.5 sm:size-2 rounded-full bg-amber-500 shrink-0"
                          title={
                            cell.isTamNuong
                              ? "Ngày Tam Nương"
                              : "Ngày Nguyệt Kỵ"
                          }
                        />
                      )}
                      {hasClanEvent && (
                        <span
                          className="size-2 sm:size-2.5 rounded-full bg-[#8c1d1d] shrink-0 ring-1 ring-white"
                          title="Có sự kiện dòng họ"
                        />
                      )}
                    </div>
                  </div>

                  {/* Bottom row: Lunar day */}
                  <div className="flex items-baseline justify-between mt-1">
                    <span
                      className={`text-[11px] sm:text-xs font-semibold ${
                        cell.lunarDay === 1 || cell.lunarDay === 15
                          ? "text-[#8c1d1d] font-bold"
                          : "text-[#7a6455]"
                      }`}
                    >
                      {cell.lunarDay === 1
                        ? `1/${cell.lunarMonth}`
                        : cell.lunarDay}
                    </span>

                    {/* Small tag for today */}
                    {cell.isToday && (
                      <span className="hidden sm:inline-block text-[9px] font-bold text-[#8c1d1d] uppercase">
                        Nay
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 border-t border-[#deb887]/60 bg-[#fbf7ed]/60 px-4 py-2.5 text-[11px] sm:text-xs font-bold text-[#5c4a3e]">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#183b28]" />
              <span>Ngày tốt (Hoàng đạo)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#8c1d1d]" />
              <span>Ngày xấu (Hắc đạo)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-amber-500" />
              <span>Ngày kiêng (Tam Nương, Nguyệt Kỵ)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🏮</span>
              <span>Lễ, tết</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#8c1d1d] ring-1 ring-white" />
              <span>Có sự kiện dòng họ</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Selected Day Detail View ────────────────────────────────────── */}
      <div className="relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 shadow-[0_4px_24px_rgba(44,26,17,0.06)] rounded-2xl">
        <div className="relative overflow-hidden rounded-xl border border-[#deb887] bg-[#fffdf7] p-5 sm:p-7 space-y-6">
          {/* Traditional Corner Brackets */}
          <span className="pointer-events-none absolute top-1.5 left-1.5 size-3.5 border-t-2 border-l-2 border-[#8c1d1d] z-10" />
          <span className="pointer-events-none absolute top-1.5 right-1.5 size-3.5 border-t-2 border-r-2 border-[#8c1d1d] z-10" />
          <span className="pointer-events-none absolute bottom-1.5 left-1.5 size-3.5 border-b-2 border-l-2 border-[#8c1d1d] z-10" />
          <span className="pointer-events-none absolute bottom-1.5 right-1.5 size-3.5 border-b-2 border-r-2 border-[#8c1d1d] z-10" />

          {/* Date Hero Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Solar bloc */}
              <div className="shrink-0 w-28 sm:w-32 rounded-2xl overflow-hidden border-2 border-[#deb887] shadow-sm bg-white text-center">
                <div className="bg-[#8c1d1d] text-white py-1 px-1.5">
                  <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider">
                    {selectedDayData.weekdayName}
                  </p>
                </div>
                <div className="py-2 px-1">
                  <p className="text-3xl sm:text-4xl font-black text-[#8c1d1d] leading-none tracking-tight my-0.5">
                    {selectedDayData.solarDay}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-bold text-[#7a6455]">
                    Th{selectedDayData.solarMonth}/{selectedDayData.solarYear} (DL)
                  </p>
                </div>
              </div>

              {/* Lunar info */}
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-widest text-[#8c1d1d]">
                  Âm Lịch
                </p>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#183b28] mt-0.5">
                  {selectedDayData.lunarDayStr}
                </h3>
                <p className="text-sm sm:text-base font-bold text-[#7a6455] mt-0.5">
                  {selectedDayData.lunarYear}
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
              {selectedDayData.isHoangDao ? (
                <HeritageBadge variant="jade" className="px-3.5 py-1.5 text-xs font-bold">
                  <span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Ngày tốt (Hoàng đạo)</span>
                </HeritageBadge>
              ) : (
                <HeritageBadge variant="amber" className="px-3.5 py-1.5 text-xs font-bold">
                  <span className="size-2 rounded-full bg-amber-600" />
                  <span>Ngày xấu (Hắc đạo)</span>
                </HeritageBadge>
              )}

              {selectedDayData.isTamNuong && (
                <HeritageBadge variant="crimson" className="px-3 py-1.5 text-xs font-bold">
                  <span>⚠ Tam Nương</span>
                </HeritageBadge>
              )}

              {selectedDayData.isNguyetKy && (
                <HeritageBadge variant="amber" className="px-3 py-1.5 text-xs font-bold">
                  <span>⚠ Nguyệt Kỵ</span>
                </HeritageBadge>
              )}

              {selectedDayData.holiday && (
                <HeritageBadge variant="crimson" className="px-3 py-1.5 text-xs font-bold">
                  <span>🏮 {selectedDayData.holiday}</span>
                </HeritageBadge>
              )}
            </div>
          </div>

          {/* Astrological Chips Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-bold">
            <span className="rounded-lg border border-[#deb887] bg-[#fcfaf5] px-2.5 py-1 text-[#183b28]">
              Ngày {selectedDayData.lunarDayCanChi}
            </span>
            <span className="rounded-lg border border-[#deb887] bg-[#fcfaf5] px-2.5 py-1 text-[#183b28]">
              Tháng {selectedDayData.lunarMonthStr}
            </span>
            <span className="rounded-lg border border-[#deb887] bg-[#fcfaf5] px-2.5 py-1 text-[#183b28]">
              {selectedDayData.lunarYear}
            </span>
            <span className="rounded-lg border border-[#deb887] bg-[#fcfaf5] px-2.5 py-1 text-[#183b28]">
              {selectedDayData.truc}
            </span>
            <span className="rounded-lg border border-[#deb887] bg-[#fcfaf5] px-2.5 py-1 text-[#183b28]">
              {selectedDayData.saoName}
            </span>
            <span className="rounded-lg border border-[#deb887] bg-[#fcfaf5] px-2.5 py-1 text-[#183b28]">
              {selectedDayData.tietKhi}
            </span>
            <span className="rounded-lg border border-[#deb887] bg-[#fcfaf5] px-2.5 py-1 text-[#8c1d1d]">
              Ngũ hành {selectedDayData.naYin}
            </span>
          </div>

          {/* Callout Box: Vì sao? */}
          <div className="rounded-xl border border-[#caa455] bg-[#fef8ea] p-4 text-xs sm:text-sm text-[#92540b]">
            <p className="leading-relaxed">
              <span className="font-black text-[#8c1d1d]">Vì sao? </span>
              {selectedDayData.reasonText}
            </p>
          </div>

          {/* Hours Breakdown */}
          <div className="space-y-3">
            {/* Giờ Hoàng Đạo */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#183b28] mb-1.5">
                Giờ tốt (hoàng đạo):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedDayData.auspiciousHours.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-lg border border-[#cbe5d2] bg-[#eef7f0] px-2.5 py-1 text-xs font-bold text-[#183b28]"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Giờ Hắc Đạo */}
            {selectedDayData.inauspiciousHours.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#8c1d1d] mb-1.5">
                  Giờ hắc đạo (tránh việc lớn):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDayData.inauspiciousHours.map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-lg border border-[#f5d7d4] bg-[#fdf6f5] px-2.5 py-1 text-xs font-medium text-[#7a6455]"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Do and Don't Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="rounded-xl border border-[#cbe5d2] bg-[#f0f9f3]/60 p-3.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#183b28] flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="size-4 text-emerald-700" />
                <span>Nên làm</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedDayData.goodActivities.map((act, i) => (
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
                {selectedDayData.badActivities.length > 0 ? (
                  selectedDayData.badActivities.map((act, i) => (
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

          {/* Star Details */}
          <div className="rounded-xl border border-[#deb887]/60 bg-[#fbf7ed]/40 p-3.5 text-xs text-[#5c4a3e]">
            <span className="font-bold text-[#183b28]">
              {selectedDayData.saoFullName} ({selectedDayData.saoType})
            </span>{" "}
            — {selectedDayData.saoDesc}
          </div>

          {/* Clan Events Occurring On This Date */}
          {eventsOnSelectedDate.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#deb887]/50">
              <p className="text-xs font-bold uppercase tracking-widest text-[#8c1d1d] flex items-center gap-1.5">
                <Sparkles className="size-3.5" />
                <span>Sự kiện dòng họ trong ngày</span>
              </p>
              <div className="space-y-2">
                {eventsOnSelectedDate.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#deb887] bg-gradient-to-r from-[#fffdf7] to-[#fbf7ed]"
                  >
                    <div className="flex items-center gap-2.5">
                      {ev.type === "death_anniversary" ? (
                        <Flower2 className="size-4 text-[#8c1d1d]" />
                      ) : (
                        <Cake className="size-4 text-[#caa455]" />
                      )}
                      <div>
                        <p className="text-sm font-bold text-[#183b28]">
                          {ev.type === "death_anniversary"
                            ? `Ngày giỗ: ${ev.personName}`
                            : `Sinh nhật: ${ev.personName}`}
                        </p>
                        {ev.content && (
                          <p className="text-xs text-[#7a6455]">{ev.content}</p>
                        )}
                      </div>
                    </div>
                    <HeritageBadge variant="amber" className="text-xs">
                      Hôm nay
                    </HeritageBadge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 4. Auspicious Day Finder ("Tìm ngày đẹp cho việc lớn") ─────────── */}
      <div className="relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 shadow-[0_4px_24px_rgba(44,26,17,0.06)] rounded-2xl">
        <div className="relative overflow-hidden rounded-xl border border-[#deb887] bg-[#fffdf7] p-5 sm:p-7 space-y-6">
          {/* Traditional Corner Brackets */}
          <span className="pointer-events-none absolute top-1.5 left-1.5 size-3.5 border-t-2 border-l-2 border-[#8c1d1d] z-10" />
          <span className="pointer-events-none absolute top-1.5 right-1.5 size-3.5 border-t-2 border-r-2 border-[#8c1d1d] z-10" />
          <span className="pointer-events-none absolute bottom-1.5 left-1.5 size-3.5 border-b-2 border-l-2 border-[#8c1d1d] z-10" />
          <span className="pointer-events-none absolute bottom-1.5 right-1.5 size-3.5 border-b-2 border-r-2 border-[#8c1d1d] z-10" />

          {/* Finder Header */}
          <div>
            <div className="flex items-center gap-2 text-[#8c1d1d]">
              <Sparkles className="size-4" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#8c1d1d]">
                Trợ Thủ Phong Tục Gia Tộc
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-black text-[#183b28] tracking-tight mt-1">
              Tìm Ngày Đẹp Cho Việc Lớn
            </h3>
            <p className="text-xs sm:text-sm text-[#7a6455] mt-1">
              Chọn việc và khoảng thời gian, hệ thống tự động lọc sẵn các ngày cát
              lành theo 12 Trực và Hoàng đạo:
            </p>
          </div>

          {/* Step 1: Activity selection buttons */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5c4a3e]">
              1. Bạn muốn xem ngày cho việc gì?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {ACTIVITY_OPTIONS.map((opt) => {
                const isActive = finderActivity === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFinderActivity(opt.key)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition text-left ${
                      isActive
                        ? "border-[#8c1d1d] bg-[#8c1d1d] text-white shadow-xs"
                        : "border-[#deb887] bg-[#fcfaf5] text-[#183b28] hover:bg-[#f5e7c7] hover:border-[#caa455]"
                    }`}
                  >
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Timeframe range buttons */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5c4a3e]">
              2. Trong khoảng thời gian nào?
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { range: 7, label: "7 ngày tới" },
                { range: 30, label: "30 ngày tới" },
                { range: 90, label: "3 tháng tới" },
              ].map((item) => {
                const isActive = finderRange === item.range;
                return (
                  <button
                    key={item.range}
                    type="button"
                    onClick={() => setFinderRange(item.range)}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition ${
                      isActive
                        ? "border-[#8c1d1d] bg-[#8c1d1d] text-white shadow-xs"
                        : "border-[#deb887] bg-[#fcfaf5] text-[#183b28] hover:bg-[#f5e7c7]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Header */}
          <div className="pt-2">
            <p className="text-sm font-bold text-[#183b28]">
              Có{" "}
              <span className="text-[#8c1d1d] text-base font-black">
                {auspiciousResults.length}
              </span>{" "}
              ngày đẹp cho{" "}
              <span className="lowercase font-bold">
                {currentActivityInfo?.label || "công việc"}
              </span>
              :
            </p>
          </div>

          {/* Results Cards List */}
          <div className="space-y-3">
            {auspiciousResults.length > 0 ? (
              auspiciousResults.slice(0, 10).map((res, idx) => {
                const day = res.dayData;
                const isSelected = isCellSelected(res.date);

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectDay(res.date)}
                    className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? "border-[#caa455] bg-[#fbf5e6] shadow-sm ring-1 ring-[#caa455]"
                        : "border-[#deb887] bg-[#fffdf7] hover:bg-[#fbf7ed] hover:border-[#caa455]"
                    }`}
                  >
                    {/* Left: Solar day bloc */}
                    <div className="flex items-center gap-3.5">
                      <div className="shrink-0 w-16 text-center rounded-lg border border-[#deb887] bg-white py-1">
                        <p className="text-[10px] font-bold text-[#8c1d1d] uppercase">
                          {day.weekdayName}
                        </p>
                        <p className="text-xl font-black text-[#8c1d1d] leading-none my-0.5">
                          {day.solarDay}
                        </p>
                        <p className="text-[9px] font-semibold text-[#7a6455]">
                          Th{day.solarMonth}
                        </p>
                      </div>

                      {/* Middle: Details */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#183b28]">
                            {day.weekdayName}, {day.solarDay}/{day.solarMonth}
                          </h4>
                          <HeritageBadge variant="jade" className="text-[10px] py-0.5 px-2">
                            Ngày tốt
                          </HeritageBadge>
                        </div>
                        <p className="text-xs text-[#5c4a3e] mt-0.5">
                          Âm lịch {day.lunarDay}/{day.lunarMonth} · {day.truc} ·{" "}
                          {day.saoName} · {day.tietKhi} · {day.lunarYear}
                        </p>
                        <p className="text-[11px] font-medium text-[#7a6455] mt-1">
                          <span className="font-bold text-[#183b28]">
                            Giờ tốt:{" "}
                          </span>
                          {day.auspiciousHours
                            .slice(0, 5)
                            .map((h) => h.split(" ")[0])
                            .join(" · ")}
                        </p>
                      </div>
                    </div>

                    {/* Right: Reason & Action */}
                    <div className="self-end sm:self-center text-right">
                      <span className="text-xs font-bold text-[#8c1d1d] group-hover:underline">
                        Xem chi tiết ngày này →
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-[#deb887] text-center text-sm text-[#7a6455] bg-[#fcfaf5]">
                Không tìm thấy ngày thỏa mãn tất cả tiêu chí khắt khe trong khoảng
                thời gian này. Quý gia đình có thể nới rộng khoảng thời gian sang 3
                tháng.
              </div>
            )}
          </div>

          {/* Cultural Disclaimer */}
          <div className="flex items-start gap-2.5 rounded-xl border border-[#deb887]/60 bg-[#fbf7ed]/60 p-3.5 text-xs text-[#7a6455] leading-relaxed">
            <Info className="size-4 text-[#caa455] shrink-0 mt-0.5" />
            <p>
              Ngày tốt tính theo lịch cổ truyền (12 trực chi việc nên/kiêng, kết
              hợp ngày hoàng đạo và 28 sao). Đây là thông tin văn hóa tham khảo theo
              phong tục truyền thống, không phải lời khuyên bắt buộc – gia đình nên
              cân nhắc thêm tuổi gia chủ và gia phong khi thực hiện đại sự.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
