"use client";

import { computeKinship } from "@/utils/kinshipHelpers";
import { getAvatarBg } from "@/utils/styleHelprs";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  BookOpen,
  GitMerge,
  Info,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import DefaultAvatar from "./DefaultAvatar";
import { FemaleIcon, MaleIcon } from "./GenderIcons";
import { HeritageBadge, HeritageFrame } from "./dashboard/HeritageUI";

interface PersonNode {
  id: string;
  full_name: string;
  gender: "male" | "female" | "other";
  birth_year: number | null;
  birth_order: number | null;
  generation: number | null;
  is_in_law: boolean;
  avatar_url?: string | null;
}

interface RelEdge {
  type: string;
  person_a: string;
  person_b: string;
}

interface Props {
  persons: PersonNode[];
  relationships: RelEdge[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const getGenderStyle = (gender: string) => {
  if (gender === "male") return "bg-[#eaf3ed] text-[#183b28] border border-[#a3c9b2]";
  if (gender === "female") return "bg-[#fbeaea] text-[#8c1d1d] border border-[#f0bcbc]";
  return "bg-[#f5f1ea] text-[#7a6455] border border-[#deb887]";
};

// ── Person selector dropdown ──────────────────────────────────────────────────
function PersonSelector({
  label,
  selected,
  onSelect,
  persons,
  disabledId,
  variant = "jade",
}: {
  label: string;
  selected: PersonNode | null;
  onSelect: (p: PersonNode) => void;
  persons: PersonNode[];
  disabledId?: string;
  variant?: "jade" | "crimson";
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () =>
      persons
        .filter(
          (p) =>
            p.id !== disabledId &&
            p.full_name.toLowerCase().includes(search.toLowerCase()),
        )
        .slice(0, 20),
    [persons, disabledId, search],
  );

  return (
    <div className="w-full flex-1 min-w-0 relative">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-[#7a6455] uppercase tracking-wider">
          {label}
        </p>
        <HeritageBadge variant={variant === "jade" ? "jade" : "crimson"}>
          {variant === "jade" ? "Người A" : "Người B"}
        </HeritageBadge>
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
          selected
            ? "bg-[#fffdf7] border-[#caa455] text-[#183b28] shadow-sm"
            : "bg-[#fffdf7]/80 border-[#deb887]/70 text-[#7a6455] hover:border-[#caa455]"
        }`}
      >
        <div className="relative shrink-0">
          <div
            className={`size-10 rounded-full flex items-center justify-center text-sm font-bold text-white overflow-hidden ring-2 ring-[#deb887]/60 shadow-xs
            ${selected ? getAvatarBg(selected.gender) : "bg-[#f5e7c7] text-[#7a6455]"}`}
          >
            {selected ? (
              selected.avatar_url ? (
                <Image
                  unoptimized
                  src={selected.avatar_url}
                  alt={selected.full_name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <DefaultAvatar gender={selected.gender} size={40} />
              )
            ) : (
              "?"
            )}
          </div>
          {selected && (
            <div
              className={`absolute -bottom-1 -right-1 size-4 rounded-full ring-2 ring-white shadow-xs flex items-center justify-center ${getGenderStyle(selected.gender)}`}
            >
              {selected.gender === "male" ? (
                <MaleIcon className="size-3" />
              ) : selected.gender === "female" ? (
                <FemaleIcon className="size-3" />
              ) : null}
            </div>
          )}
        </div>

        <span className="font-bold text-sm sm:text-base truncate text-[#183b28]">
          {selected ? selected.full_name : "Chọn thành viên..."}
        </span>
        {selected?.birth_year && (
          <span className="text-xs text-[#7a6455] font-semibold shrink-0">
            ({selected.birth_year})
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 z-50 bg-[#fffdf7] rounded-xl shadow-xl border-2 border-[#caa455] overflow-hidden"
          >
            <div className="p-3 border-b border-[#deb887]/40 bg-[#fbf7ed]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#7a6455]" />
                <input
                  autoFocus
                  placeholder="Tìm tên thành viên..."
                  className="w-full pl-9 pr-4 py-2 text-base sm:text-sm rounded-lg border border-[#deb887] bg-white focus:outline-none focus:border-[#8c1d1d]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto divide-y divide-[#deb887]/20">
              {filtered.length === 0 ? (
                <p className="text-center py-6 text-sm text-[#7a6455]">
                  Không tìm thấy thành viên phù hợp
                </p>
              ) : (
                filtered.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => {
                      onSelect(p);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f5e7c7]/40 transition-colors text-left"
                  >
                    <div className="relative shrink-0">
                      <div
                        className={`size-8 rounded-full flex items-center justify-center text-xs font-bold text-white overflow-hidden ring-1 ring-[#deb887] shadow-xs
                        ${getAvatarBg(p.gender)}`}
                      >
                        {p.avatar_url ? (
                          <Image
                            unoptimized
                            src={p.avatar_url}
                            alt={p.full_name}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <DefaultAvatar gender={p.gender} size={32} />
                        )}
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full ring-1 ring-white shadow-xs flex items-center justify-center ${getGenderStyle(p.gender)}`}
                      >
                        {p.gender === "male" ? (
                          <MaleIcon className="size-2.5" />
                        ) : p.gender === "female" ? (
                          <FemaleIcon className="size-2.5" />
                        ) : null}
                      </div>
                    </div>

                    <span className="text-sm font-bold text-[#183b28] truncate">
                      {p.full_name}
                    </span>
                    {p.birth_year && (
                      <span className="text-xs text-[#7a6455] ml-auto shrink-0">
                        {p.birth_year}
                      </span>
                    )}
                    {p.generation != null && (
                      <HeritageBadge variant="amber" className="ml-1 text-[10px] px-1.5 py-0.5">
                        Đ.{p.generation}
                      </HeritageBadge>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Kinship reference table data ──────────────────────────────────────────────
const KINSHIP_TERMS = [
  {
    relation: "Bố / Mẹ",
    desc: "1 bậc trên (dòng trực hệ)",
    example: "Bố, ba, má...",
  },
  {
    relation: "Ông / Bà",
    desc: "2 bậc trên (dòng trực hệ)",
    example: "Ông nội, bà ngoại...",
  },
  {
    relation: "Cụ / Kỵ / Sơ...",
    desc: "3 bậc trên trở lên",
    example: "Cụ cố, cụ kỵ...",
  },
  {
    relation: "Con / Cháu / Chắt...",
    desc: "Các bậc dưới trực hệ",
    example: "Con, cháu, chắt, chít...",
  },
  {
    relation: "Anh / Chị / Em họ",
    desc: "Cùng thế hệ, khác nhánh",
    example: "Dựa vào thứ bậc của nhánh bố/mẹ",
  },
  {
    relation: "Bác / Chú / Cô",
    desc: "Anh/chị/em của bố (Bên Nội)",
    example: "Bác (anh), Chú (em trai), Cô (chị em gái)",
  },
  {
    relation: "Cậu / Dì",
    desc: "Anh/chị/em của mẹ (Bên Ngoại)",
    example: "Cậu (anh em trai), Dì (chị em gái)",
  },
  {
    relation: "Thím / Mợ / Dượng",
    desc: "Vợ/chồng của chú, cậu, cô, dì",
    example: "Thím (vợ chú), Mợ (vợ cậu), Dượng (chồng cô/dì)",
  },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function KinshipFinder({ persons, relationships }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const p1Id = searchParams.get("p1");
  const p2Id = searchParams.get("p2");

  const personA = useMemo(
    () => persons.find((p) => p.id === p1Id) || null,
    [persons, p1Id],
  );
  const personB = useMemo(
    () => persons.find((p) => p.id === p2Id) || null,
    [persons, p2Id],
  );

  const [showGuide, setShowGuide] = useState(false);

  const updateUrl = (p1Id: string | null, p2Id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p1Id) params.set("p1", p1Id);
    else params.delete("p1");
    if (p2Id) params.set("p2", p2Id);
    else params.delete("p2");

    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

  const result = useMemo(() => {
    if (!personA || !personB) return null;
    return computeKinship(personA, personB, persons, relationships);
  }, [personA, personB, persons, relationships]);

  const swap = () => {
    updateUrl(p2Id, p1Id);
  };

  return (
    <div className="space-y-6">
      {/* ── Selector Heritage Frame ── */}
      <HeritageFrame cornerColor="#8c1d1d">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-4">
          <PersonSelector
            label="Thành viên thứ nhất"
            variant="jade"
            selected={personA}
            onSelect={(p) => updateUrl(p.id, p2Id)}
            persons={persons}
            disabledId={personB?.id}
          />
          <button
            type="button"
            onClick={swap}
            title="Đổi chiều quan hệ"
            className="size-11 shrink-0 sm:mb-0.5 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] hover:from-[#f5e7c7] hover:to-[#e8ce8a] text-[#8c1d1d] transition-all border-2 border-[#deb887] shadow-xs active:scale-95"
          >
            <ArrowLeftRight className="size-4.5 rotate-90 sm:rotate-0" />
          </button>
          <PersonSelector
            label="Thành viên thứ hai"
            variant="crimson"
            selected={personB}
            onSelect={(p) => updateUrl(p1Id, p.id)}
            persons={persons}
            disabledId={personA?.id}
          />
        </div>
      </HeritageFrame>

      {/* ── Result ── */}
      <AnimatePresence mode="wait">
        {!personA || !personB ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 rounded-2xl border-2 border-dashed border-[#deb887]/60 bg-[#fffdf7]/50"
          >
            <Users className="size-12 mx-auto mb-3 text-[#deb887]" />
            <p className="font-bold text-[#7a6455]">
              Vui lòng chọn hai thành viên để phân tích danh xưng
            </p>
            <p className="mt-1 text-xs text-[#7a6455]/80">
              Hệ thống sẽ tự động đối chiếu phả đồ và gia lễ truyền thống
            </p>
          </motion.div>
        ) : result === null ? (
          <motion.div
            key="same"
            className="text-center py-8 rounded-2xl border-2 border-[#deb887]/60 bg-[#fffdf7] text-[#7a6455]"
          >
            Hãy chọn hai thành viên khác nhau trong dòng họ.
          </motion.div>
        ) : (
          <motion.div
            key={`${personA.id}-${personB.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-5"
          >
            {/* Description badge */}
            <div className="rounded-xl border-2 border-[#caa455] bg-gradient-to-r from-[#fef8ea] via-[#fffdf7] to-[#fef8ea] p-4 sm:p-5 flex items-center gap-3 shadow-xs">
              <Sparkles className="size-5 text-[#caa455] shrink-0" />
              <p className="text-sm font-bold text-[#92540b] leading-relaxed">
                {result.description}
              </p>
            </div>

            {/* Main kinship cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <HeritageFrame cornerColor="#183b28">
                <div className="flex items-center justify-between mb-3 border-b border-[#deb887]/40 pb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7a6455]">
                    {personA.full_name} gọi {personB.full_name} là:
                  </p>
                  <HeritageBadge variant="jade">Xưng hô A → B</HeritageBadge>
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#8c1d1d] capitalize my-2">
                  {result.aCallsB}
                </p>
              </HeritageFrame>

              <HeritageFrame cornerColor="#8c1d1d">
                <div className="flex items-center justify-between mb-3 border-b border-[#deb887]/40 pb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7a6455]">
                    {personB.full_name} gọi {personA.full_name} là:
                  </p>
                  <HeritageBadge variant="crimson">Xưng hô B → A</HeritageBadge>
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#183b28] capitalize my-2">
                  {result.bCallsA}
                </p>
              </HeritageFrame>
            </div>

            {/* Path info */}
            {result.pathLabels.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="rounded-2xl border-2 border-[#deb887]/80 bg-[#fffdf7] p-5 sm:p-6 shadow-xs"
              >
                <div className="flex items-center gap-2 mb-4 border-b border-[#deb887]/40 pb-2.5">
                  <GitMerge className="size-4 text-[#8c1d1d]" />
                  <p className="text-xs font-black uppercase tracking-wider text-[#183b28]">
                    Con đường huyết thống & Thứ bậc gia phả
                  </p>
                </div>
                <div className="space-y-3">
                  {result.pathLabels.map((label, i) => (
                    <div key={i} className="flex items-start gap-3.5">
                      <div className="size-6 rounded-full bg-gradient-to-br from-[#caa455] to-[#92540b] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        {i + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-[#5c4a3e] font-medium leading-relaxed pt-0.5">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Disclaimer for ambiguous terms */}
            {(result.aCallsB.includes("/") ||
              result.aCallsB.includes("họ hàng")) && (
              <p className="text-xs text-[#7a6455] italic px-1">
                * Danh xưng chi tiết có thể linh hoạt theo phong tục địa phương, thứ bậc sinh của các nhánh và vai vế Nội/Ngoại.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Guide & reference section ── */}
      <div className="border-t border-[#deb887]/60 pt-6 space-y-4">
        <button
          type="button"
          onClick={() => setShowGuide((v) => !v)}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#8c1d1d] hover:text-[#6e1616] transition-colors"
        >
          <BookOpen className="size-4" />
          <span>{showGuide ? "Thu gọn quy ước xưng hô" : "Xem quy ước danh xưng & gia lễ truyền thống"}</span>
        </button>

        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-2">
                {/* How it works */}
                <div className="rounded-xl border border-[#deb887] bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] p-5 shadow-xs">
                  <p className="text-sm font-bold text-[#183b28] flex items-center gap-2 mb-3">
                    <Info className="size-4 text-[#8c1d1d]" />
                    Nguyên lý tính toán danh xưng
                  </p>
                  <ol className="space-y-2 text-xs sm:text-sm text-[#5c4a3e]">
                    <li className="flex gap-2">
                      <span className="font-bold text-[#8c1d1d] shrink-0">1.</span>
                      Hệ thống dựng đồ thị liên kết huyết thống và hôn phối trong cây gia phả.
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-[#8c1d1d] shrink-0">2.</span>
                      Tìm <strong>Tổ tiên chung gần nhất (LCA)</strong> để xác định bậc cách thế hệ.
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-[#8c1d1d] shrink-0">3.</span>
                      Xác định <strong>vế Nội / Ngoại</strong> từ điểm rẽ nhánh của tổ tiên.
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-[#8c1d1d] shrink-0">4.</span>
                      So sánh <strong>thứ tự sinh (Seniority)</strong> giữa các chi phái để định danh &quot;Bác/Chú&quot; hoặc &quot;Anh/Em&quot;.
                    </li>
                  </ol>
                </div>

                {/* Reference table */}
                <div className="rounded-xl border border-[#deb887] bg-[#fffdf7] overflow-hidden shadow-xs">
                  <div className="px-5 py-3 border-b border-[#deb887]/40 bg-[#f5e7c7]/30">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#183b28]">
                      Bảng tra cứu danh xưng mẫu
                    </p>
                  </div>
                  <div className="divide-y divide-[#deb887]/20">
                    {KINSHIP_TERMS.map((row) => (
                      <div
                        key={row.relation}
                        className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-5 py-2.5"
                      >
                        <span className="text-sm font-bold text-[#8c1d1d] sm:w-44 shrink-0">
                          {row.relation}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-[#5c4a3e]">{row.desc}</p>
                          <p className="text-[11px] text-[#7a6455] italic">
                            {row.example}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
