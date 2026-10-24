"use client";

import { Person } from "@/types";
import { getAvatarBg } from "@/utils/styleHelprs";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { useDashboard } from "./DashboardContext";
import DefaultAvatar from "./DefaultAvatar";
import { FemaleIcon, MaleIcon } from "./GenderIcons";

interface PersonCardProps {
  person: Person;
  highlightedPersonIds?: Set<string>;
  onHoverPerson?: (id: string | null) => void;
}

export default function PersonCard({
  person,
  highlightedPersonIds,
  onHoverPerson,
}: PersonCardProps) {
  const { setMemberModalId } = useDashboard();

  const isDeceased = person.is_deceased;
  const isHighlighted = highlightedPersonIds?.has(person.id) ?? false;

  const getGenderStyle = (gender: string) => {
    if (gender === "male") return "bg-[#eaf3ed] text-[#183b28] border border-[#a3c9b2]";
    if (gender === "female") return "bg-[#fdf0f0] text-[#8c1d1d] border border-[#f5c2c2]";
    return "bg-[#f5e7c7] text-[#7a6455] border border-[#deb887]";
  };

  const getBirthDeathText = () => {
    const b = person.birth_year ? String(person.birth_year) : "...";
    if (isDeceased) {
      const d = person.death_lunar_year || person.death_year || "...";
      return `${b} → ${d}`;
    }
    return b !== "..." ? `Sinh năm ${b}` : "...";
  };

  return (
    <button
      type="button"
      onClick={() => setMemberModalId(person.id)}
      onMouseEnter={() => onHoverPerson?.(person.id)}
      onMouseLeave={() => onHoverPerson?.(null)}
      onFocus={() => onHoverPerson?.(person.id)}
      onBlur={() => onHoverPerson?.(null)}
      className={`group relative block w-full text-left rounded-2xl border-2 p-3 sm:p-4 shadow-[0_3px_12px_rgba(44,26,17,0.05)] transition-all duration-200 overflow-hidden cursor-pointer ${
        isHighlighted
          ? "border-[#8c1d1d] bg-[#fef8ea] shadow-md ring-2 ring-[#8c1d1d]/30"
          : "border-[#deb887]/80 bg-gradient-to-br from-[#ffffff] via-[#fffdf9] to-[#fbf7ed] hover:border-[#8c1d1d] hover:shadow-[0_8px_20px_rgba(140,29,29,0.12)] hover:-translate-y-0.5"
      } ${isDeceased ? "opacity-90" : ""}`}
    >
      {/* Traditional Corner Accent Brackets on hover */}
      <span className="pointer-events-none absolute top-1.5 left-1.5 size-2 border-t-2 border-l-2 border-[#caa455] opacity-40 transition-all duration-200 group-hover:border-[#8c1d1d] group-hover:opacity-100" />
      <span className="pointer-events-none absolute top-1.5 right-1.5 size-2 border-t-2 border-r-2 border-[#caa455] opacity-40 transition-all duration-200 group-hover:border-[#8c1d1d] group-hover:opacity-100" />
      <span className="pointer-events-none absolute bottom-1.5 left-1.5 size-2 border-b-2 border-l-2 border-[#caa455] opacity-40 transition-all duration-200 group-hover:border-[#8c1d1d] group-hover:opacity-100" />
      <span className="pointer-events-none absolute bottom-1.5 right-1.5 size-2 border-b-2 border-r-2 border-[#caa455] opacity-40 transition-all duration-200 group-hover:border-[#8c1d1d] group-hover:opacity-100" />

      <div className="flex items-center gap-3.5 relative z-10">
        {/* Avatar with Royal Rim */}
        <div className="relative shrink-0">
          <div
            className={`size-14 sm:size-15 rounded-full flex items-center justify-center text-xl font-bold text-white overflow-hidden ring-2 ring-[#deb887] shadow-sm transition-transform duration-200 group-hover:scale-105 ${getAvatarBg(
              person.gender,
            )}`}
          >
            {person.avatar_url ? (
              <Image
                unoptimized
                src={person.avatar_url}
                alt={person.full_name}
                width={60}
                height={60}
                className="h-full w-full object-cover"
              />
            ) : (
              <DefaultAvatar gender={person.gender} size={36} />
            )}
          </div>

          {/* Gender Indicator Seal */}
          <div
            className={`absolute bottom-0 right-0 size-5 rounded-full ring-2 ring-white shadow-xs flex items-center justify-center ${getGenderStyle(
              person.gender,
            )}`}
          >
            {person.gender === "male" ? (
              <MaleIcon className="size-3.5" />
            ) : person.gender === "female" ? (
              <FemaleIcon className="size-3.5" />
            ) : null}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-[#183b28] group-hover:text-[#8c1d1d] transition-colors truncate leading-tight">
            {person.full_name}
          </h3>

          <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#7a6455] truncate">
            <Calendar className="size-3.5 text-[#caa455] shrink-0" />
            <span className="truncate">{getBirthDeathText()}</span>
          </div>

          {/* Heritage Badges */}
          {(isDeceased ||
            person.is_in_law ||
            person.birth_order != null ||
            person.generation != null) && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {person.is_in_law && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-2xs border ${
                    person.gender === "female"
                      ? "bg-[#fef0f0] text-[#8c1d1d] border-[#f5c2c2]"
                      : "bg-[#edf5f0] text-[#183b28] border-[#b8ddc6]"
                  }`}
                >
                  {person.gender === "male"
                    ? "Rể"
                    : person.gender === "female"
                      ? "Dâu"
                      : "Khách"}
                </span>
              )}

              {person.birth_order != null && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-2xs border ${
                    person.birth_order === 1
                      ? "bg-[#fef8ea] text-[#92540b] border-[#e8ce8a]"
                      : "bg-[#fffdf7] text-[#7a6455] border-[#deb887]/80"
                  }`}
                >
                  {person.birth_order === 1
                    ? "Con trưởng"
                    : `Con thứ ${person.birth_order}`}
                </span>
              )}

              {person.generation != null && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#edf5f0] text-[#183b28] border border-[#b8ddc6] uppercase tracking-wider shadow-2xs">
                  Đời thứ {person.generation}
                </span>
              )}

              {isDeceased && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#f4efe6] text-[#7a6455] border border-[#deb887]/60 uppercase tracking-wider shadow-2xs">
                  Đã mất
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
