"use client";

import { useDashboard } from "@/components/DashboardContext";
import DashboardMemberList from "@/components/DashboardMemberList";
import RootSelector from "@/components/RootSelector";
import { Person, Relationship } from "@/types";
import { findForestRoots, isChildRelationshipType } from "@/utils/treeHelpers";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

const FamilyTree = dynamic(() => import("@/components/FamilyTree"));
const MindmapTree = dynamic(() => import("@/components/MindmapTree"));
const BubbleMapTree = dynamic(
  () =>
    import("@/components/BubbleMapTree").catch((err) => {
      console.error("Failed to load BubbleMapTree:", err);
      return {
        default: () => (
          <div className="flex absolute inset-0 items-center justify-center p-4 text-center bg-stone-50 rounded-2xl border border-stone-200/60 shadow-inner text-stone-500">
            Tính năng này không được hỗ trợ trên trình duyệt của bạn. Vui lòng cập nhật hoặc sử dụng trình duyệt khác.
          </div>
        ),
      };
    }),
  { ssr: false },
);

interface DashboardViewsProps {
  persons: Person[];
  relationships: Relationship[];
  canEdit?: boolean;
  familyAdminEditExperience?: boolean;
}

export default function DashboardViews({
  persons,
  relationships,
  canEdit = false,
  familyAdminEditExperience = false,
}: DashboardViewsProps) {
  const { view: currentView, rootId } = useDashboard();
  const [hoveredPersonId, setHoveredPersonId] = useState<string | null>(null);

  // Prepare map and roots for tree views
  const { personsMap, roots, defaultRootId } = useMemo(() => {
    const pMap = new Map<string, Person>();
    persons.forEach((p) => pMap.set(p.id, p));

    const childIds = new Set(
      relationships
        .filter((relationship) => isChildRelationshipType(relationship.type))
        .map((r) => r.person_b),
    );

    let calculatedRoots: Person[] = [];
    if (rootId && pMap.has(rootId)) {
      calculatedRoots = [pMap.get(rootId)!];
    } else {
      calculatedRoots = findForestRoots(pMap, relationships);
    }

    return {
      personsMap: pMap,
      roots: calculatedRoots,
      defaultRootId: null,
    };
  }, [persons, relationships, rootId]);

  const activeRootId = rootId || defaultRootId;
  const highlightedPersonIds = useMemo(() => {
    const ids = new Set<string>();
    if (!hoveredPersonId) return ids;

    ids.add(hoveredPersonId);
    relationships.forEach((relationship) => {
      const isChildRelation = isChildRelationshipType(relationship.type);

      if (relationship.type === "marriage") {
        if (relationship.person_a === hoveredPersonId) ids.add(relationship.person_b);
        if (relationship.person_b === hoveredPersonId) ids.add(relationship.person_a);
      }

      if (isChildRelation) {
        if (relationship.person_a === hoveredPersonId) ids.add(relationship.person_b);
        if (relationship.person_b === hoveredPersonId) ids.add(relationship.person_a);
      }
    });

    return ids;
  }, [hoveredPersonId, relationships]);

  const isTreeWorkspace = currentView === "tree";

  return (
    <>
      <main
        className={`flex flex-1 flex-col bg-[#f7f3ec] ${
          currentView === "list" ? "overflow-auto" : "overflow-hidden"
        }`}
      >
        {currentView !== "list" && persons.length > 0 && (
          <div className="relative z-20 flex w-full flex-col gap-3 border-b border-amber-100 bg-[#fbfaf7]/95 px-4 py-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <RootSelector persons={persons} currentRootId={rootId} />
              <div className="hidden min-w-0 items-center gap-2 lg:flex">
                <span className="rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-black text-emerald-700 shadow-sm">
                  {relationships.length.toLocaleString("vi-VN")} quan hệ
                </span>
                <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-black text-stone-600 shadow-sm">
                  {persons.length.toLocaleString("vi-VN")} thành viên
                </span>
              </div>
            </div>
            <div
              id="tree-toolbar-portal"
              className="flex flex-wrap items-center justify-center gap-2"
            />
          </div>
        )}

        {currentView === "list" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
            <DashboardMemberList
              initialPersons={persons}
              relationships={relationships}
              canEdit={canEdit}
              highlightedPersonIds={highlightedPersonIds}
              onHoverPerson={setHoveredPersonId}
            />
          </div>
        )}

        <div className="flex-1 w-full relative z-10">
          {currentView === "tree" && (
            <FamilyTree
              personsMap={personsMap}
              relationships={relationships}
              roots={roots}
              canEdit={canEdit}
              familyAdminEditExperience={familyAdminEditExperience}
              highlightedPersonIds={highlightedPersonIds}
              onHoverPerson={setHoveredPersonId}
              relationSourcePersonId={hoveredPersonId}
            />
          )}
          {currentView === "mindmap" && (
            <MindmapTree
              personsMap={personsMap}
              relationships={relationships}
              roots={roots}
              canEdit={canEdit}
              highlightedPersonIds={highlightedPersonIds}
              onHoverPerson={setHoveredPersonId}
            />
          )}
          {currentView === "bubble" && (
            <BubbleMapTree
              personsMap={personsMap}
              relationships={relationships}
              roots={roots}
              highlightedPersonIds={highlightedPersonIds}
              onHoverPerson={setHoveredPersonId}
              canEdit={canEdit}
            />
          )}
        </div>
      </main>
    </>
  );
}
