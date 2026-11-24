"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Users } from "lucide-react";
import { ProvinceMap } from "@/components/dashboard/ProvinceMap";
import { getTopProvinces, VN_MAP_PROVINCES } from "@/utils/map/vnMapPaths";

export interface ClanMapCardProps {
  /** Map of province codes to counts */
  counts?: Record<string, number>;
  /** Total count of members with residence mapped */
  totalMapped?: number;
  /** Optional family slug for links */
  familySlug?: string;
  /** Optional initial collapsed state for full variant */
  defaultExpanded?: boolean;
  /** Display variant: "hero" (pure map only, no frame, no background) or "full" (full section card with list) */
  variant?: "hero" | "full" | "map-only";
  /** Optional extra className */
  className?: string;
}

/**
 * Clan Geographic Distribution Card ("Bản đồ dòng họ")
 * Supports pure map-only mode without frame or background for the hero header,
 * with bold province boundaries.
 */
export function ClanMapCard({
  counts = {},
  totalMapped,
  defaultExpanded = true,
  variant = "hero",
  className = "",
}: ClanMapCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const topProvinces = getTopProvinces(counts, 5);
  const total =
    totalMapped ??
    Object.values(counts).reduce((acc, val) => acc + (val > 0 ? val : 0), 0);

  const selectedProvinceName = selectedCode
    ? VN_MAP_PROVINCES.find((p) => p.code === selectedCode)?.name ?? null
    : null;
  const selectedCount = selectedCode ? counts[selectedCode] ?? 0 : null;

  // PURE MAP-ONLY HERO VARIANT: Không khung, không phông nền, hiển thị bản đồ với viền đậm
  if (variant === "hero" || variant === "map-only") {
    return (
      <div
        className={`relative shrink-0 lg:w-76 xl:w-84 flex items-center justify-center p-0 bg-transparent ${className}`}
      >
        <ProvinceMap
          counts={counts}
          selected={selectedCode}
          onSelect={setSelectedCode}
          unit="người"
          className="h-auto max-h-68 sm:max-h-76 w-full mx-auto"
        />
      </div>
    );
  }

  // FULL SECTION CARD VARIANT
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 border-[#deb887]/50 bg-gradient-to-br from-[#1c1917] via-[#221e1a] to-[#181513] text-[#f5eee6] shadow-md transition-all duration-300 hover:border-[#caa455]/80 ${className}`}
    >
      {/* Heritage Corner Accents */}
      <span className="pointer-events-none absolute top-2 left-2 size-2.5 border-t-2 border-l-2 border-[#caa455] opacity-60" />
      <span className="pointer-events-none absolute top-2 right-2 size-2.5 border-t-2 border-r-2 border-[#caa455] opacity-60" />
      <span className="pointer-events-none absolute bottom-2 left-2 size-2.5 border-b-2 border-l-2 border-[#caa455] opacity-60" />
      <span className="pointer-events-none absolute bottom-2 right-2 size-2.5 border-b-2 border-r-2 border-[#caa455] opacity-60" />

      {/* Header Bar */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        className="flex cursor-pointer select-none items-center justify-between border-b border-[#deb887]/20 px-5 py-3.5 transition-colors hover:bg-white/5 outline-none focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg border border-[#caa455]/40 bg-[#caa455]/10 text-[#caa455]">
            <MapPin className="size-4" />
          </div>
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#f5eee6]">
            Bản đồ dòng họ
          </h3>
          {total > 0 && (
            <span className="rounded-full border border-[#deb887]/30 bg-[#2a2420] px-2 py-0.5 text-[11px] font-semibold text-[#deb887]">
              {total} thành viên có nơi ở
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={isExpanded ? "Thu gọn bản đồ" : "Mở rộng bản đồ"}
          className="rounded-lg p-1 text-[#caa455] hover:bg-white/10 transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="size-5" />
          ) : (
            <ChevronDown className="size-5" />
          )}
        </button>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[minmax(0,18rem)_1fr] lg:grid-cols-[minmax(0,20rem)_1fr]">
            {/* Left: SVG Map */}
            <div className="mx-auto w-full max-w-[18rem] sm:max-w-[20rem] flex flex-col items-center justify-center">
              <ProvinceMap
                counts={counts}
                selected={selectedCode}
                onSelect={setSelectedCode}
                unit="người"
                className="max-h-80 w-full"
              />
              <p className="mt-2 text-[11px] text-[#a89f91] text-center">
                * Bấm chọn từng tỉnh trên bản đồ để xem chi tiết
              </p>
            </div>

            {/* Right: Top Distribution List */}
            <div className="flex flex-col justify-center space-y-4">
              {/* Selected Highlight Banner */}
              {selectedCode && (
                <div className="rounded-xl border border-[#caa455]/50 bg-[#2d2520] p-3 text-sm flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#f59e0b]" />
                    <span className="font-bold text-[#deb887]">
                      {selectedProvinceName}
                    </span>
                  </div>
                  <span className="font-bold text-[#f5eee6] tabular-nums">
                    {selectedCount} người
                  </span>
                </div>
              )}

              {/* Top Provinces Ranking */}
              <div>
                <p className="text-sm font-semibold tracking-wide text-[#deb887]">
                  Con cháu nhiều nhất ở
                </p>

                {topProvinces.length === 0 ? (
                  <div className="mt-3 rounded-xl border border-dashed border-[#deb887]/30 bg-[#241f1c] p-4 text-center">
                    <Users className="mx-auto size-6 text-[#a89f91] mb-2" />
                    <p className="text-xs sm:text-sm text-[#a89f91] leading-relaxed">
                      Chưa có dữ liệu địa lý con cháu. Hãy cập nhật{" "}
                      <strong className="text-[#deb887]">"Nơi ở hiện tại"</strong>{" "}
                      trong danh bạ thành viên để hiển thị trên bản đồ.
                    </p>
                  </div>
                ) : (
                  <ol className="mt-3 space-y-2.5 text-sm">
                    {topProvinces.map((prov, index) => {
                      const isSelected = selectedCode === prov.code;
                      return (
                        <li
                          key={prov.code}
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            setSelectedCode(isSelected ? null : prov.code)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedCode(isSelected ? null : prov.code);
                            }
                          }}
                          className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 transition-all outline-none focus:outline-none ${
                            isSelected
                              ? "bg-[#caa455]/20 border border-[#caa455]"
                              : "hover:bg-white/5"
                          }`}
                        >
                          <span className="flex items-center gap-2.5 truncate">
                            <span className="w-4 font-bold text-[#caa455]/80">
                              {index + 1}.
                            </span>
                            <span
                              className={`truncate font-medium ${
                                isSelected ? "text-[#caa455] font-bold" : "text-[#f5eee6]"
                              }`}
                            >
                              {prov.name}
                            </span>
                          </span>
                          <span className="shrink-0 font-bold tabular-nums text-[#d6ccc2]">
                            {prov.count.toLocaleString("vi-VN")} người
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>

              {/* Legend & Multi-Island Affirmation */}
              <div className="border-t border-[#deb887]/20 pt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#a89f91]">
                <div className="flex items-center gap-2">
                  <span className="inline-block size-2 rounded-full bg-[#f59e0b]" />
                  <span>Mật độ con cháu cư trú</span>
                </div>
                <span>Bao gồm Hoàng Sa & Trường Sa</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClanMapCard;
