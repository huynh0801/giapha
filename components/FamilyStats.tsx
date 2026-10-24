"use client";

import { Person, Relationship } from "@/types";
import { getZodiacAnimal, getZodiacSign } from "@/utils/dateHelpers";
import { motion } from "framer-motion";
import {
  Crown,
  Flower2,
  Heart,
  HeartOff,
  Mars,
  Moon,
  Skull,
  Star,
  Users,
  Venus,
} from "lucide-react";
import { useMemo } from "react";
import { HeritageBadge, HeritageFrame } from "./dashboard/HeritageUI";

interface FamilyStatsProps {
  persons: Person[];
  relationships: Relationship[];
}

interface StatCardProps {
  label: string;
  value: number;
  total: number;
  icon: React.ReactNode;
  accentColor: string;
  delay?: number;
}

function StatCard({
  label,
  value,
  total,
  icon,
  accentColor,
  delay = 0,
}: StatCardProps) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative overflow-hidden rounded-2xl border-2 border-[#deb887]/80 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] p-4 sm:p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#caa455] hover:shadow-md"
    >
      {/* Decorative corner accent */}
      <span className="pointer-events-none absolute top-1.5 right-1.5 size-2 border-t-2 border-r-2 border-[#deb887] opacity-60 group-hover:border-[#8c1d1d] group-hover:opacity-100 transition-colors" />

      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className={`p-2.5 rounded-xl border border-[#deb887]/50 ${accentColor} shadow-xs`}>
          {icon}
        </div>
        <HeritageBadge variant="amber" className="text-[11px] px-2 py-0.5">
          {pct}%
        </HeritageBadge>
      </div>

      <p
        className="text-3xl sm:text-4xl font-bold text-[#183b28] relative z-10"
        style={{
          fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
        }}
      >
        {value}
      </p>
      <p className="text-xs sm:text-sm font-bold text-[#7a6455] mt-1 relative z-10">
        {label}
      </p>

      {/* Progress bar */}
      <div className="mt-3.5 h-1.5 bg-[#deb887]/30 rounded-full overflow-hidden relative z-10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay: delay + 0.2, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-[#caa455] to-[#8c1d1d]"
        />
      </div>
    </motion.div>
  );
}

// Generation breakdown row
function GenerationRow({
  gen,
  count,
  max,
  delay,
}: {
  gen: number;
  count: number;
  max: number;
  delay: number;
}) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-[#183b28] w-16 shrink-0 flex items-center gap-1">
        <span className="size-1.5 rounded-full bg-[#8c1d1d]" />
        Đời {gen}
      </span>
      <div className="flex-1 h-3 bg-[#deb887]/25 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#caa455] via-[#deb887] to-[#183b28] rounded-full"
        />
      </div>
      <span className="text-xs sm:text-sm font-black text-[#8c1d1d] w-12 text-right shrink-0">
        {count} <span className="text-[10px] font-normal text-[#7a6455]">người</span>
      </span>
    </div>
  );
}

export default function FamilyStats({
  persons,
  relationships,
}: FamilyStatsProps) {
  const stats = useMemo(() => {
    const total = persons.length;

    // Gender
    const male = persons.filter((p) => p.gender === "male").length;
    const female = persons.filter((p) => p.gender === "female").length;

    // In-laws
    const daughtersInLaw = persons.filter(
      (p) => p.is_in_law && p.gender === "female",
    ).length;
    const sonsInLaw = persons.filter(
      (p) => p.is_in_law && p.gender === "male",
    ).length;

    // Deceased
    const deceased = persons.filter((p) => p.is_deceased).length;

    // First-born (con trưởng)
    const firstBorn = persons.filter((p) => p.birth_order === 1).length;

    // Married / unmarried (based on marriage relationships)
    const marriedIds = new Set<string>();
    relationships
      .filter((r) => r.type === "marriage")
      .forEach((r) => {
        marriedIds.add(r.person_a);
        marriedIds.add(r.person_b);
      });
    const married = persons.filter((p) => marriedIds.has(p.id)).length;
    const unmarried = total - married;

    // Generation breakdown
    const genMap = new Map<number, number>();
    const zodiacMap = new Map<string, number>();
    const chineseZodiacMap = new Map<string, number>();

    persons.forEach((p) => {
      // Generations
      if (p.generation != null) {
        genMap.set(p.generation, (genMap.get(p.generation) ?? 0) + 1);
      }

      // Zodiac Signs
      const zodiac = getZodiacSign(p.birth_day, p.birth_month);
      if (zodiac) {
        zodiacMap.set(zodiac, (zodiacMap.get(zodiac) ?? 0) + 1);
      }

      // Chinese Zodiac
      const chineseZodiac = getZodiacAnimal(
        p.birth_year,
        p.birth_month,
        p.birth_day,
      );
      if (chineseZodiac) {
        chineseZodiacMap.set(
          chineseZodiac,
          (chineseZodiacMap.get(chineseZodiac) ?? 0) + 1,
        );
      }
    });

    const generationBreakdown = Array.from(genMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([gen, count]) => ({ gen, count }));

    const zodiacBreakdown = Array.from(zodiacMap.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .map(([name, count]) => ({ name, count }));

    const chineseZodiacBreakdown = Array.from(chineseZodiacMap.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .map(([name, count]) => ({ name, count }));

    return {
      total,
      male,
      female,
      daughtersInLaw,
      sonsInLaw,
      deceased,
      firstBorn,
      married,
      unmarried,
      generationBreakdown,
      zodiacBreakdown,
      chineseZodiacBreakdown,
    };
  }, [persons, relationships]);

  const cards = [
    {
      label: "Tổng nhân đinh",
      value: stats.total,
      icon: <Users className="size-5 text-[#8c1d1d]" />,
      accentColor: "bg-[#f5e7c7] text-[#8c1d1d]",
    },
    {
      label: "Nam giới",
      value: stats.male,
      icon: <Mars className="size-5 text-[#183b28]" />,
      accentColor: "bg-[#eaf3ed] text-[#183b28]",
    },
    {
      label: "Nữ giới",
      value: stats.female,
      icon: <Venus className="size-5 text-[#8c1d1d]" />,
      accentColor: "bg-[#fbeaea] text-[#8c1d1d]",
    },
    {
      label: "Dâu hiền",
      value: stats.daughtersInLaw,
      icon: <Flower2 className="size-5 text-[#92540b]" />,
      accentColor: "bg-[#fef8ea] text-[#92540b]",
    },
    {
      label: "Rể quý",
      value: stats.sonsInLaw,
      icon: <Users className="size-5 text-[#183b28]" />,
      accentColor: "bg-[#eaf3ed] text-[#183b28]",
    },
    {
      label: "Đã thành gia",
      value: stats.married,
      icon: <Heart className="size-5 text-[#8c1d1d]" />,
      accentColor: "bg-[#fbeaea] text-[#8c1d1d]",
    },
    {
      label: "Chưa kết hôn",
      value: stats.unmarried,
      icon: <HeartOff className="size-5 text-[#7a6455]" />,
      accentColor: "bg-[#f5f1ea] text-[#7a6455]",
    },
    {
      label: "Đã quy tiên",
      value: stats.deceased,
      icon: <Skull className="size-5 text-[#7a6455]" />,
      accentColor: "bg-[#f4efe6] text-[#7a6455]",
    },
    {
      label: "Trưởng nam / nữ",
      value: stats.firstBorn,
      icon: <Crown className="size-5 text-[#92540b]" />,
      accentColor: "bg-[#fef8ea] text-[#92540b]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((card, i) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            total={stats.total}
            icon={card.icon}
            accentColor={card.accentColor}
            delay={i * 0.05}
          />
        ))}
      </div>

      {/* Generation Breakdown */}
      {stats.generationBreakdown.length > 0 && (
        <HeritageFrame cornerColor="#183b28">
          <div className="flex items-center justify-between mb-5 border-b border-[#deb887]/50 pb-3">
            <h2
              className="text-lg sm:text-xl font-bold text-[#183b28] flex items-center gap-2"
              style={{
                fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
              }}
            >
              <Crown className="size-5 text-[#caa455]" />
              Phân bố nhân khẩu theo thế hệ
            </h2>
            <HeritageBadge variant="amber">
              {stats.generationBreakdown.length} thế hệ
            </HeritageBadge>
          </div>
          <div className="space-y-3.5">
            {stats.generationBreakdown.map(({ gen, count }, i) => (
              <GenerationRow
                key={gen}
                gen={gen}
                count={count}
                max={stats.total}
                delay={0.2 + i * 0.05}
              />
            ))}
          </div>
          <p className="text-xs text-[#7a6455] mt-4 italic border-t border-[#deb887]/30 pt-2">
            * Thống kê tính trên các thành viên đã được định danh số đời trong phả đồ.
          </p>
        </HeritageFrame>
      )}

      {/* Gender ratio visual */}
      <HeritageFrame cornerColor="#8c1d1d">
        <div className="flex items-center justify-between mb-5 border-b border-[#deb887]/50 pb-3">
          <h2
            className="text-lg sm:text-xl font-bold text-[#183b28] flex items-center gap-2"
            style={{
              fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
            }}
          >
            <Users className="size-5 text-[#8c1d1d]" />
            Tỷ lệ cân bằng âm dương & giới tính
          </h2>
          <div className="flex gap-2">
            <HeritageBadge variant="jade">Nam: {stats.male}</HeritageBadge>
            <HeritageBadge variant="crimson">Nữ: {stats.female}</HeritageBadge>
          </div>
        </div>

        <div className="flex h-5 rounded-full overflow-hidden border border-[#deb887]/70 shadow-inner">
          {stats.total > 0 && (
            <>
              <motion.div
                initial={{ flex: 0 }}
                animate={{ flex: stats.male }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="bg-[#183b28] flex items-center justify-center text-[10px] text-white font-bold"
                title={`Nam: ${stats.male}`}
              />
              <motion.div
                initial={{ flex: 0 }}
                animate={{ flex: stats.female }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="bg-[#8c1d1d] flex items-center justify-center text-[10px] text-white font-bold"
                title={`Nữ: ${stats.female}`}
              />
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-6 mt-4 text-xs sm:text-sm font-semibold">
          <span className="flex items-center gap-2 text-[#183b28]">
            <span className="size-3 rounded-full bg-[#183b28] inline-block shadow-xs" />
            Nam đinh: {stats.male} người ({stats.total > 0 ? Math.round((stats.male / stats.total) * 100) : 0}%)
          </span>
          <span className="flex items-center gap-2 text-[#8c1d1d]">
            <span className="size-3 rounded-full bg-[#8c1d1d] inline-block shadow-xs" />
            Nữ đinh: {stats.female} người ({stats.total > 0 ? Math.round((stats.female / stats.total) * 100) : 0}%)
          </span>
        </div>
      </HeritageFrame>

      {/* Grid for Zodiacs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chinese Zodiac Breakdown */}
        {stats.chineseZodiacBreakdown.length > 0 && (
          <HeritageFrame cornerColor="#caa455">
            <h2
              className="text-base sm:text-lg font-bold text-[#183b28] mb-4 flex items-center gap-2 border-b border-[#deb887]/40 pb-2"
              style={{
                fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
              }}
            >
              <Moon className="size-4 text-[#92540b]" />
              Phân bố theo Thập Nhị Địa Chi (12 Con Giáp)
            </h2>
            <div className="space-y-2.5">
              {stats.chineseZodiacBreakdown.map(({ name, count }, i) => {
                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={name} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#7a6455] w-24 shrink-0">
                      Tuổi {name}
                    </span>
                    <div className="flex-1 h-2.5 bg-[#deb887]/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          duration: 0.6,
                          delay: 0.1 + i * 0.04,
                          ease: "easeOut",
                        }}
                        className="h-full bg-gradient-to-r from-[#caa455] to-[#92540b] rounded-full"
                      />
                    </div>
                    <span className="text-xs font-bold text-[#183b28] w-8 text-right shrink-0">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-[#7a6455] mt-4 italic border-t border-[#deb887]/20 pt-2">
              * Dựa trên năm sinh âm lịch của thành viên.
            </p>
          </HeritageFrame>
        )}

        {/* Western Zodiac Breakdown */}
        {stats.zodiacBreakdown.length > 0 && (
          <HeritageFrame cornerColor="#183b28">
            <h2
              className="text-base sm:text-lg font-bold text-[#183b28] mb-4 flex items-center gap-2 border-b border-[#deb887]/40 pb-2"
              style={{
                fontFamily: '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
              }}
            >
              <Star className="size-4 text-[#183b28]" />
              Phân bố theo Cung Hoàng Đạo
            </h2>
            <div className="space-y-2.5">
              {stats.zodiacBreakdown.map(({ name, count }, i) => {
                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={name} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#7a6455] w-24 shrink-0">
                      {name}
                    </span>
                    <div className="flex-1 h-2.5 bg-[#deb887]/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          duration: 0.6,
                          delay: 0.1 + i * 0.04,
                          ease: "easeOut",
                        }}
                        className="h-full bg-gradient-to-r from-[#183b28] to-[#caa455] rounded-full"
                      />
                    </div>
                    <span className="text-xs font-bold text-[#183b28] w-8 text-right shrink-0">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-[#7a6455] mt-4 italic border-t border-[#deb887]/20 pt-2">
              * Dựa trên ngày tháng sinh dương lịch.
            </p>
          </HeritageFrame>
        )}
      </div>
    </div>
  );
}
