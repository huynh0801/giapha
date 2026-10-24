import React from "react";

export interface HeritageFrameProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  cornerColor?: string;
}

export function HeritageFrame({
  children,
  className = "",
  innerClassName = "",
  cornerColor = "#8c1d1d",
}: HeritageFrameProps) {
  return (
    <div
      className={`relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 shadow-[0_4px_20px_rgba(44,26,17,0.06)] ${className}`}
    >
      <div
        className={`relative border border-[#deb887] bg-[#fffdf7] p-5 sm:p-6 ${innerClassName}`}
      >
        {/* 4 Traditional Corner Brackets */}
        <span
          className="pointer-events-none absolute top-1.5 left-1.5 size-3.5 border-t-2 border-l-2"
          style={{ borderColor: cornerColor }}
        />
        <span
          className="pointer-events-none absolute top-1.5 right-1.5 size-3.5 border-t-2 border-r-2"
          style={{ borderColor: cornerColor }}
        />
        <span
          className="pointer-events-none absolute bottom-1.5 left-1.5 size-3.5 border-b-2 border-l-2"
          style={{ borderColor: cornerColor }}
        />
        <span
          className="pointer-events-none absolute bottom-1.5 right-1.5 size-3.5 border-b-2 border-r-2"
          style={{ borderColor: cornerColor }}
        />
        {children}
      </div>
    </div>
  );
}

export interface HeritageBadgeProps {
  children: React.ReactNode;
  variant?: "crimson" | "jade" | "amber" | "neutral";
  className?: string;
}

export function HeritageBadge({
  children,
  variant = "neutral",
  className = "",
}: HeritageBadgeProps) {
  const variantStyles = {
    crimson: "bg-[#8c1d1d] text-white border border-[#6e1616] shadow-xs",
    jade: "bg-[#eaf3ed] text-[#183b28] border border-[#a3c9b2]",
    amber: "bg-[#fef8ea] text-[#92540b] border border-[#e8ce8a]",
    neutral: "bg-[#f4efe6] text-[#5c4a3e] border border-[#deb887]/60",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export interface HeritageStatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  subtext?: string;
  className?: string;
}

export function HeritageStatCard({
  title,
  value,
  icon,
  subtext,
  className = "",
}: HeritageStatCardProps) {
  return (
    <div
      className={`relative p-4 rounded-xl border border-[#deb887]/70 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] shadow-xs flex items-center justify-between ${className}`}
    >
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-[#7a6455]">
          {title}
        </p>
        <p className="mt-1 text-2xl sm:text-3xl font-black text-[#183b28]">
          {value}
        </p>
        {subtext && (
          <p className="mt-0.5 text-xs font-medium text-[#7a6455]">{subtext}</p>
        )}
      </div>
      {icon && (
        <div className="flex size-11 items-center justify-center rounded-xl bg-[#f5e7c7] text-[#8c1d1d] border border-[#deb887]/60 shadow-xs shrink-0">
          {icon}
        </div>
      )}
    </div>
  );
}
