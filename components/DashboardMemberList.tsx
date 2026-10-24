"use client";

import PersonCard from "@/components/PersonCard";
import { Person, Relationship } from "@/types";
import {
  ArrowUpDown,
  ChevronDown,
  Filter,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDashboard } from "./DashboardContext";

export default function DashboardMemberList({
  initialPersons,
  relationships = [],
  canEdit = false,
  highlightedPersonIds,
  onHoverPerson,
}: {
  initialPersons: Person[];
  relationships?: Relationship[];
  canEdit?: boolean;
  highlightedPersonIds?: Set<string>;
  onHoverPerson?: (id: string | null) => void;
}) {
  const { setShowCreateMember } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("generation_asc");
  const [filterOption, setFilterOption] = useState("all");

  const filteredPersons = useMemo(() => {
    return initialPersons.filter((person) => {
      const matchesSearch = person.full_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      let matchesFilter = true;
      switch (filterOption) {
        case "male":
          matchesFilter = person.gender === "male";
          break;
        case "female":
          matchesFilter = person.gender === "female";
          break;
        case "in_law_female":
          matchesFilter = person.gender === "female" && person.is_in_law;
          break;
        case "in_law_male":
          matchesFilter = person.gender === "male" && person.is_in_law;
          break;
        case "deceased":
          matchesFilter = person.is_deceased;
          break;
        case "first_child":
          matchesFilter = person.birth_order === 1;
          break;
        case "all":
        default:
          matchesFilter = true;
          break;
      }

      return matchesSearch && matchesFilter;
    });
  }, [initialPersons, searchTerm, filterOption]);

  const { parentsOf, spousesOf } = useMemo(() => {
    const pOf = new Map<string, string[]>();
    const sOf = new Map<string, string[]>();

    relationships?.forEach((rel) => {
      if (rel.type === "biological_child" || rel.type === "adopted_child") {
        const parentId = rel.person_a;
        const childId = rel.person_b;
        if (!pOf.has(childId)) pOf.set(childId, []);
        pOf.get(childId)!.push(parentId);
      } else if (rel.type === "marriage") {
        const p1 = rel.person_a;
        const p2 = rel.person_b;
        if (!sOf.has(p1)) sOf.set(p1, []);
        if (!sOf.has(p2)) sOf.set(p2, []);
        sOf.get(p1)!.push(p2);
        sOf.get(p2)!.push(p1);
      }
    });

    return { parentsOf: pOf, spousesOf: sOf };
  }, [relationships]);

  const sortedPersons = useMemo(() => {
    // If not sorting by generation, use simple flat sort
    if (!sortOption.includes("generation")) {
      return [...filteredPersons].sort((a, b) => {
        switch (sortOption) {
          case "birth_asc":
            return (a.birth_year || 9999) - (b.birth_year || 9999);
          case "birth_desc":
            return (b.birth_year || 0) - (a.birth_year || 0);
          case "name_asc":
            return a.full_name.localeCompare(b.full_name, "vi");
          case "name_desc":
            return b.full_name.localeCompare(a.full_name, "vi");
          case "updated_desc":
            return (
              new Date(b.updated_at || 0).getTime() -
              new Date(a.updated_at || 0).getTime()
            );
          case "updated_asc":
            return (
              new Date(a.updated_at || 0).getTime() -
              new Date(b.updated_at || 0).getTime()
            );
          default:
            return 0;
        }
      });
    }

    // --- Complex Generation Sorting (Grouped by Family) ---
    const personMap = new Map<string, Person>();
    initialPersons.forEach((p) => personMap.set(p.id, p));

    const getGroupId = (personId: string) => {
      const parents = parentsOf.get(personId) || [];
      if (parents.length > 0) {
        return "parents_" + [...parents].sort().join("_");
      }

      const visited = new Set<string>([personId]);
      const queue = [personId];
      const cluster: string[] = [];

      while (queue.length > 0) {
        const curr = queue.shift()!;
        cluster.push(curr);
        const pts = parentsOf.get(curr);
        if (pts && pts.length > 0) {
          return "parents_" + [...pts].sort().join("_");
        }

        const sps = spousesOf.get(curr) || [];
        for (const s of sps) {
          if (!visited.has(s)) {
            visited.add(s);
            queue.push(s);
          }
        }
      }

      return "spouses_" + [...cluster].sort()[0];
    };

    const families = new Map<string, Person[]>();
    filteredPersons.forEach((p) => {
      const groupId = getGroupId(p.id);
      if (!families.has(groupId)) families.set(groupId, []);
      families.get(groupId)!.push(p);
    });

    const getFamilyScore = (_groupId: string, members: Person[]) => {
      const coreMember = members.find((m) => !m.is_in_law) || members[0];
      const parents = parentsOf.get(coreMember.id) || [];
      let parentBirthOrder = 999;
      if (parents.length > 0) {
        const p1 = personMap.get(parents[0]);
        if (p1) parentBirthOrder = p1.birth_order || 999;
      }

      return {
        parentBirthOrder,
        ownBirthOrder: coreMember.birth_order || 999,
        birthYear: coreMember.birth_year || 9999,
      };
    };

    const sortedGroups = Array.from(families.entries()).sort((a, b) => {
      const scoreA = getFamilyScore(a[0], a[1]);
      const scoreB = getFamilyScore(b[0], b[1]);

      if (scoreA.parentBirthOrder !== scoreB.parentBirthOrder) {
        return scoreA.parentBirthOrder - scoreB.parentBirthOrder;
      }
      if (scoreA.ownBirthOrder !== scoreB.ownBirthOrder) {
        return scoreA.ownBirthOrder - scoreB.ownBirthOrder;
      }
      return scoreA.birthYear - scoreB.birthYear;
    });

    const finalSorted: Array<Person & { _familyId?: string }> = [];
    sortedGroups.forEach(([groupId, members]) => {
      const getBloodlineRef = (p: Person) => {
        if (!p.is_in_law) return p;
        const spIds = spousesOf.get(p.id) || [];
        const bloodlineSpouse = members.find(
          (m) => spIds.includes(m.id) && !m.is_in_law,
        );
        return bloodlineSpouse || p;
      };

      members.sort((a, b) => {
        const refA = getBloodlineRef(a);
        const refB = getBloodlineRef(b);

        if (refA.id !== refB.id) {
          if ((refA.birth_order || 999) !== (refB.birth_order || 999)) {
            return (refA.birth_order || 999) - (refB.birth_order || 999);
          }
          return (refA.birth_year || 9999) - (refB.birth_year || 9999);
        }

        if (a.is_in_law !== b.is_in_law) {
          return a.is_in_law ? 1 : -1;
        }

        return (a.birth_year || 9999) - (b.birth_year || 9999);
      });
      finalSorted.push(...members.map((m) => ({ ...m, _familyId: groupId })));
    });

    finalSorted.sort((a, b) => {
      const genA = a.generation || 999;
      const genB = b.generation || 999;
      if (genA !== genB) {
        return sortOption === "generation_desc" ? genB - genA : genA - genB;
      }
      return 0;
    });

    return finalSorted;
  }, [filteredPersons, sortOption, initialPersons, parentsOf, spousesOf]);

  return (
    <>
      {/* Ornate Royal Heritage Toolbar */}
      <div className="relative mb-8 rounded-2xl border-2 border-[#deb887]/80 bg-gradient-to-br from-[#fffdf7] via-[#fdfbf6] to-[#fbf7ed] p-4 sm:p-5 shadow-[0_4px_16px_rgba(44,26,17,0.05)] overflow-hidden">
        {/* 4 Traditional Corner Accents */}
        <span className="pointer-events-none absolute top-1.5 left-1.5 size-2.5 border-t-2 border-l-2 border-[#caa455] opacity-70" />
        <span className="pointer-events-none absolute top-1.5 right-1.5 size-2.5 border-t-2 border-r-2 border-[#caa455] opacity-70" />
        <span className="pointer-events-none absolute bottom-1.5 left-1.5 size-2.5 border-b-2 border-l-2 border-[#caa455] opacity-70" />
        <span className="pointer-events-none absolute bottom-1.5 right-1.5 size-2.5 border-b-2 border-r-2 border-[#caa455] opacity-70" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm group">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#deb887] transition-colors group-focus-within:text-[#8c1d1d]" />
              <input
                type="text"
                placeholder="Tìm kiếm thành viên..."
                className="w-full rounded-xl border-2 border-[#deb887]/70 bg-white/95 pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-[#183b28] placeholder-[#9c8273] shadow-2xs transition-all focus:border-[#8c1d1d] focus:outline-none focus:ring-2 focus:ring-[#8c1d1d]/15"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Filter by Type */}
              <div className="relative w-full sm:w-auto">
                <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8c1d1d]" />
                <select
                  className="w-full sm:w-40 appearance-none rounded-xl border-2 border-[#deb887]/70 bg-white/95 pl-9 pr-8 py-2 text-xs sm:text-sm font-bold text-[#5c4a3e] shadow-2xs transition-all hover:border-[#caa455] focus:border-[#8c1d1d] focus:outline-none focus:ring-2 focus:ring-[#8c1d1d]/15 cursor-pointer"
                  value={filterOption}
                  onChange={(e) => setFilterOption(e.target.value)}
                >
                  <option value="all">Tất cả thành viên</option>
                  <option value="male">Nam (Trai họ)</option>
                  <option value="female">Nữ (Gái họ)</option>
                  <option value="in_law_female">Dâu</option>
                  <option value="in_law_male">Rể</option>
                  <option value="deceased">Đã quy tiên (Đã mất)</option>
                  <option value="first_child">Con trưởng</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-[#deb887]" />
              </div>

              {/* Sort Option */}
              <div className="relative w-full sm:w-auto">
                <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8c1d1d]" />
                <select
                  className="w-full sm:w-52 appearance-none rounded-xl border-2 border-[#deb887]/70 bg-white/95 pl-9 pr-8 py-2 text-xs sm:text-sm font-bold text-[#5c4a3e] shadow-2xs transition-all hover:border-[#caa455] focus:border-[#8c1d1d] focus:outline-none focus:ring-2 focus:ring-[#8c1d1d]/15 cursor-pointer"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="generation_asc">Theo thế hệ (Tăng dần)</option>
                  <option value="generation_desc">Theo thế hệ (Giảm dần)</option>
                  <option value="birth_asc">Năm sinh (Cụ cao tuổi trước)</option>
                  <option value="birth_desc">Năm sinh (Trẻ trước)</option>
                  <option value="name_asc">Tên (A → Z)</option>
                  <option value="name_desc">Tên (Z → A)</option>
                  <option value="updated_desc">Cập nhật (Mới nhất)</option>
                  <option value="updated_asc">Cập nhật (Cũ nhất)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-[#deb887]" />
              </div>
            </div>
          </div>

          {/* Add Member Button */}
          {canEdit && (
            <button
              type="button"
              onClick={() => setShowCreateMember(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8c1d1d] to-[#6e1616] hover:from-[#6e1616] hover:to-[#501010] px-4.5 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:shadow-sm border border-[#caa455]/50 transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <Plus className="size-4" strokeWidth={2.5} />
              <span>Thêm thành viên</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Members Grid / Generation Grouping */}
      {sortedPersons.length > 0 ? (
        sortOption.includes("generation") ? (
          <div className="space-y-14">
            {Object.entries(
              sortedPersons.reduce(
                (acc, person) => {
                  const gen = person.generation || 0;
                  if (!acc[gen]) acc[gen] = [];
                  acc[gen].push(person);
                  return acc;
                },
                {} as Record<number, Person[]>,
              ),
            )
              .sort(([genA], [genB]) => {
                if (sortOption === "generation_desc") {
                  return Number(genB) - Number(genA);
                }
                return Number(genA) - Number(genB);
              })
              .map(([gen, personsInGen]) => {
                const familiesMap = new Map<string, typeof personsInGen>();
                personsInGen.forEach((p) => {
                  const fid =
                    (p as Person & { _familyId?: string })._familyId ||
                    "unknown";
                  if (!familiesMap.has(fid)) familiesMap.set(fid, []);
                  familiesMap.get(fid)!.push(p);
                });

                return (
                  <div key={gen} className="space-y-6">
                    {/* Ornate Imperial Generation Medallion */}
                    <div className="flex items-center gap-3">
                      <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-[#deb887] to-[#deb887]/40" />
                      <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#caa455] bg-gradient-to-r from-[#fffdf7] via-[#fbf7ed] to-[#fffdf7] px-5 py-1.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#8c1d1d] shadow-[0_2px_8px_rgba(202,164,85,0.2)]">
                        <span className="text-[#caa455] text-xs">❖</span>
                        <span>{gen === "0" ? "Chưa xác định đời" : `Đời thứ ${gen}`}</span>
                        <span className="text-[#caa455] text-xs">❖</span>
                      </div>
                      <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent via-[#deb887] to-[#deb887]/40" />
                    </div>

                    {/* Families in this Generation */}
                    <div className="space-y-10">
                      {Array.from(familiesMap.values()).map(
                        (famPersons, idx) => {
                          const firstBloodline =
                            famPersons.find((p) => !p.is_in_law) ||
                            famPersons[0];
                          const parentIds =
                            parentsOf.get(firstBloodline.id) || [];
                          const parents = parentIds
                            .map((id) =>
                              initialPersons.find((p) => p.id === id),
                            )
                            .filter(Boolean) as Person[];
                          const parentNames = parents
                            .map((p) =>
                              p.full_name.trim().split(" ").splice(-2).join(" "),
                            )
                            .join(" & ");

                          const label = parentNames
                            ? `Nhánh con của: ${parentNames}`
                            : familiesMap.size > 1
                              ? `Gia đình ${idx + 1}`
                              : null;

                          // Group into couple clusters
                          const coupleGroups: Person[][] = [];
                          const placed = new Set<string>();

                          for (const p of famPersons) {
                            if (placed.has(p.id)) continue;
                            const group = [p];
                            placed.add(p.id);

                            const queue = [p.id];
                            while (queue.length > 0) {
                              const curr = queue.shift()!;
                              const spIds = spousesOf.get(curr) || [];
                              for (const spId of spIds) {
                                if (!placed.has(spId)) {
                                  const spObj = famPersons.find(
                                    (m) => m.id === spId,
                                  );
                                  if (spObj) {
                                    group.push(spObj);
                                    placed.add(spId);
                                    queue.push(spId);
                                  }
                                }
                              }
                            }

                            const bloodlineMembers = group
                              .filter((m) => !m.is_in_law)
                              .sort(
                                (a, b) =>
                                  (a.birth_year || 0) - (b.birth_year || 0),
                              );
                            const inLawMembers = group
                              .filter((m) => m.is_in_law)
                              .sort(
                                (a, b) =>
                                  (a.birth_year || 0) - (b.birth_year || 0),
                              );

                            const balanced: Person[] = [];
                            if (group.length <= 2) {
                              balanced.push(
                                ...bloodlineMembers,
                                ...inLawMembers,
                              );
                            } else {
                              let bIdx = 0;
                              let iIdx = 0;
                              const slots = new Array(group.length);
                              const mid = Math.floor(group.length / 2);
                              slots[mid] = bloodlineMembers[bIdx++];

                              let offset = 1;
                              while (
                                bIdx < bloodlineMembers.length ||
                                iIdx < inLawMembers.length
                              ) {
                                const next =
                                  bIdx < bloodlineMembers.length
                                    ? bloodlineMembers[bIdx++]
                                    : inLawMembers[iIdx++];
                                if (
                                  mid + offset < group.length &&
                                  !slots[mid + offset]
                                )
                                  slots[mid + offset] = next;
                                else if (
                                  mid - offset >= 0 &&
                                  !slots[mid - offset]
                                )
                                  slots[mid - offset] = next;
                                else {
                                  const empty = slots.findIndex((s) => !s);
                                  if (empty !== -1) slots[empty] = next;
                                }
                                offset++;
                              }
                              balanced.push(...slots.filter((s) => !!s));
                            }
                            coupleGroups.push(balanced);
                          }

                          return (
                            <div
                              key={idx}
                              className="relative rounded-2xl border-2 border-[#deb887]/80 bg-gradient-to-br from-[#fffdf7] via-[#fdfbf6] to-[#fbf7ed] p-5 sm:p-7 shadow-[0_4px_16px_rgba(44,26,17,0.04)]"
                            >
                              {/* 4 Corner Traditional Accents */}
                              <span className="pointer-events-none absolute top-2 left-2 size-2.5 border-t-2 border-l-2 border-[#caa455] opacity-60" />
                              <span className="pointer-events-none absolute top-2 right-2 size-2.5 border-t-2 border-r-2 border-[#caa455] opacity-60" />
                              <span className="pointer-events-none absolute bottom-2 left-2 size-2.5 border-b-2 border-l-2 border-[#caa455] opacity-60" />
                              <span className="pointer-events-none absolute bottom-2 right-2 size-2.5 border-b-2 border-r-2 border-[#caa455] opacity-60" />

                              {/* Family Branch Seal Badge */}
                              {label && (
                                <div className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 rounded-full border border-[#caa455] bg-gradient-to-r from-[#8c1d1d] to-[#6e1616] px-3.5 py-0.5 text-[11px] font-bold text-white shadow-xs z-20">
                                  <span>{label}</span>
                                </div>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                                {coupleGroups.map((group, gIdx) => {
                                  const isCouple = group.length > 1;
                                  const colSpanClass =
                                    group.length === 2
                                      ? "md:col-span-2"
                                      : group.length >= 3
                                        ? "md:col-span-2 lg:col-span-3"
                                        : "col-span-1";
                                  const innerGridClass =
                                    group.length === 2
                                      ? "md:grid-cols-2"
                                      : group.length >= 3
                                        ? "md:grid-cols-2 lg:grid-cols-3"
                                        : "grid-cols-1";

                                  return (
                                    <div
                                      key={gIdx}
                                      className={`relative ${colSpanClass}`}
                                    >
                                      {/* Ornate Couple Background Wrapper */}
                                      {isCouple && (
                                        <>
                                          <div className="hidden md:block absolute -inset-2.5 lg:-inset-3 rounded-2xl border-2 border-[#caa455]/50 bg-[#fbf7ed]/60 shadow-2xs z-0" />
                                          <div className="md:hidden absolute -inset-2 rounded-2xl border-2 border-[#caa455]/50 bg-[#fbf7ed]/60 shadow-2xs z-0" />
                                        </>
                                      )}

                                      <div
                                        className={`relative z-10 grid grid-cols-1 ${innerGridClass} gap-y-6 md:gap-x-6 h-full`}
                                      >
                                        {group.map((person, pIdx) => (
                                          <div
                                            key={person.id}
                                            className="relative h-full flex flex-col"
                                          >
                                            <PersonCard
                                              person={person}
                                              highlightedPersonIds={
                                                highlightedPersonIds
                                              }
                                              onHoverPerson={onHoverPerson}
                                            />

                                            {/* Golden Marriage Link between spouses (desktop >= md) */}
                                            {isCouple &&
                                              pIdx < group.length - 1 && (
                                                <div className="hidden md:flex absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-[#deb887] via-[#caa455] to-[#deb887] z-10 translate-x-1/2 items-center justify-center">
                                                  <span className="size-2 rounded-full border border-[#caa455] bg-white shadow-2xs" />
                                                </div>
                                              )}

                                            {/* Golden Marriage Link between spouses (mobile < md) */}
                                            {isCouple &&
                                              pIdx < group.length - 1 && (
                                                <div className="md:hidden flex absolute -bottom-6 left-1/2 w-0.5 h-6 bg-gradient-to-b from-[#deb887] via-[#caa455] to-[#deb887] z-10 -translate-x-1/2 items-center justify-center">
                                                  <span className="size-2 rounded-full border border-[#caa455] bg-white shadow-2xs" />
                                                </div>
                                              )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPersons.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                highlightedPersonIds={highlightedPersonIds}
                onHoverPerson={onHoverPerson}
              />
            ))}
          </div>
        )
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-[#deb887] bg-[#fffdf7] p-12 text-center shadow-xs">
          <Users className="mx-auto size-12 text-[#deb887]" />
          <h3 className="mt-3 text-lg font-bold text-[#183b28]">
            Không tìm thấy thành viên phù hợp
          </h3>
          <p className="mt-1 text-sm text-[#7a6455]">
            {initialPersons.length > 0
              ? "Hãy thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc."
              : "Cây gia phả này chưa có thành viên nào. Hãy thêm thành viên đầu tiên."}
          </p>
        </div>
      )}
    </>
  );
}
