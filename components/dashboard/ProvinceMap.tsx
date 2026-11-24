"use client";

import React, { useState } from "react";
import { VN_MAP_PROVINCES, VN_MAP_VIEWBOX } from "@/utils/map/vnMapPaths";

export interface ProvinceMapProps {
  /** Map of province code (e.g. "01", "79") to member count */
  counts: Record<string, number>;
  /** Selected province code */
  selected?: string | null;
  /** Selection callback */
  onSelect?: (code: string | null) => void;
  /** Unit label in Vietnamese, default "người" */
  unit?: string;
  /** Custom className for the SVG container */
  className?: string;
}

/**
 * Pure SVG interactive Vietnam map with choropleth heat shading based on member counts.
 * Renders all 34 geometric regions including Hoàng Sa & Trường Sa islands with bold province borders.
 */
export function ProvinceMap({
  counts,
  selected = null,
  onSelect,
  unit = "người",
  className = "w-full h-auto",
}: ProvinceMapProps) {
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  const values = Object.values(counts);
  const max = Math.max(1, ...(values.length > 0 ? values : [1]));

  return (
    <div className="relative w-full flex items-center justify-center">
      <svg
        viewBox={VN_MAP_VIEWBOX}
        role="img"
        aria-label="Bản đồ phân bố dòng họ Việt Nam"
        className={`${className} outline-none focus:outline-none`}
        onClick={() => onSelect?.(null)}
      >
        <g className="transition-colors duration-200 outline-none">
          {VN_MAP_PROVINCES.map((p) => {
            const count = counts[p.code] ?? 0;
            // Square root scaling ensures provinces with fewer members still have visible tint
            const strength = count > 0 ? 0.4 + 0.6 * Math.sqrt(count / max) : 0;
            const isSel = selected === p.code;
            const isHovered = hoveredCode === p.code;

            // Warm silk/parchment fill for zero-count provinces, radiant imperial gold for populated provinces
            let fillColor = "#e8dcce";
            let fillOpacity = 0.85;

            if (count > 0) {
              fillColor = "#f59e0b"; // Sắc vàng hoàng kim
              fillOpacity = strength;
            }

            if (isHovered && count > 0) {
              fillOpacity = Math.min(1, strength + 0.2);
            }

            // Bold distinct border strokes (làm đậm viền)
            const strokeColor = isSel
              ? "#fde047" // Bright luminous gold highlight when selected
              : isHovered
              ? "#d97706" // Warm amber on hover
              : count > 0
              ? "#b45309" // Bold deep amber-gold stroke for populated provinces
              : "#5c4a3e"; // Bold dark wood sepia stroke for unpopulated borders

            // Bold stroke widths
            const strokeWidth = isSel ? 3.5 : isHovered ? 2.6 : count > 0 ? 2.2 : 1.8;

            return (
              <path
                key={p.code}
                d={p.d}
                role="button"
                tabIndex={0}
                aria-label={`${p.name}: ${count} ${unit}`}
                aria-pressed={isSel}
                className="outline-none focus:outline-none focus-visible:outline-none select-none"
                onMouseEnter={() => setHoveredCode(p.code)}
                onMouseLeave={() => setHoveredCode(null)}
                onFocus={() => setHoveredCode(p.code)}
                onBlur={() => setHoveredCode(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(isSel ? null : p.code);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect?.(isSel ? null : p.code);
                  }
                }}
                style={{
                  fill: fillColor,
                  fillOpacity,
                  stroke: strokeColor,
                  strokeWidth,
                  strokeLinejoin: "round",
                  cursor: "pointer",
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                  transition: "fill-opacity 0.2s, stroke 0.2s, stroke-width 0.2s",
                }}
              >
                <title>
                  {p.name}: {count.toLocaleString("vi-VN")} {unit}
                </title>
              </path>
            );
          })}
        </g>
      </svg>

      {/* Floating Tooltip when hovering over a province */}
      {hoveredCode && (
        <div className="pointer-events-none absolute bottom-1 left-1 z-20 rounded-xl border border-[#deb887] bg-[#1e1b18]/95 px-3 py-1.5 text-xs text-[#f5eee6] shadow-md backdrop-blur-xs">
          <p className="font-bold text-[#f59e0b]">
            {VN_MAP_PROVINCES.find((p) => p.code === hoveredCode)?.name}
          </p>
          <p className="text-[11px] text-[#d6ccc2]">
            {(counts[hoveredCode] ?? 0).toLocaleString("vi-VN")} {unit}
          </p>
        </div>
      )}
    </div>
  );
}

export default ProvinceMap;
