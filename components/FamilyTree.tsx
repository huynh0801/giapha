"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  createOrUpdateRelationshipAction,
  deleteRelationshipAction,
} from "@/app/actions/genealogy";
import { deleteMemberRecordAction } from "@/app/actions/member";
import { usePanZoom } from "@/hooks/usePanZoom";
import { Person, Relationship, RelationshipType } from "@/types";
import { normalizeText } from "@/utils/excelImport/detectColumns";
import {
  buildRelativeRelationLabels,
  buildAdjacencyLists,
  getFilteredTreeData,
  isChildRelationshipType,
  relationshipTypeLabel,
} from "@/utils/treeHelpers";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronsDownUp,
  ChevronsUpDown,
  Crosshair,
  Eye,
  FileSpreadsheet,
  ArrowLeftRight,
  Link2,
  Loader2,
  Lock,
  Maximize2,
  Minimize2,
  Minus,
  MousePointer2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Trash2,
  UserPlus,
  Users,
  ZoomIn,
  ZoomOut,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboard } from "./DashboardContext";
import ExcelImportWizard from "./ExcelImportWizard";
import ExportButton from "./ExportButton";
import RootSelector from "./RootSelector";
import FamilyNodeCard from "./FamilyNodeCard";
import TreeQuickAddDialog from "./TreeQuickAddDialog";
import TreeToolbar from "./TreeToolbar";

const DEFAULT_AUTO_COLLAPSE_LEVEL = 0;

type TreeEditMode = "view" | "edit";

type MemberFilter = "all" | "unlinked";

type RelationshipDraft = {
  relationshipId?: string;
  sourceId: string;
  targetId: string;
};

type RelationshipConflictContext = {
  source: Person;
  target: Person;
  relationshipType: RelationshipType;
  existingParents: Person[];
  sameGenderParents: Person[];
};

type RelationshipDrag = {
  sourceId: string;
  start: { x: number; y: number };
  current: { x: number; y: number };
};

type MiniMapState = {
  contentWidth: number;
  contentHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  scrollLeft: number;
  scrollTop: number;
  nodes: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    linked: boolean;
  }>;
  connections: Array<{
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>;
};

type PoolPosition = {
  x: number;
  y: number;
};

type PoolPositions = Record<string, PoolPosition>;

const relationshipModes: Array<{ type: RelationshipType; label: string }> = [
  { type: "biological_child", label: "Cha/mẹ -> Con" },
  { type: "marriage", label: "Vợ/chồng" },
  { type: "adopted_child", label: "Nhận nuôi" },
  { type: "step_child", label: "Con riêng" },
  { type: "foster_child", label: "Con được nuôi" },
];

function relationshipDisplayLabel(type: RelationshipType) {
  return (
    relationshipModes.find((mode) => mode.type === type)?.label ??
    relationshipTypeLabel(type)
  );
}

const relationHandlePositions = [
  {
    side: "top",
    className: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
  },
  {
    side: "right",
    className: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2",
  },
  {
    side: "bottom",
    className: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
  },
  {
    side: "left",
    className: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
  },
] as const;

function sortPeopleForTree(a: Person, b: Person) {
  const generationDiff =
    (a.generation ?? Number.MAX_SAFE_INTEGER) -
    (b.generation ?? Number.MAX_SAFE_INTEGER);
  if (generationDiff !== 0) return generationDiff;
  const yearDiff =
    (a.birth_year ?? Number.MAX_SAFE_INTEGER) -
    (b.birth_year ?? Number.MAX_SAFE_INTEGER);
  if (yearDiff !== 0) return yearDiff;
  const nameDiff = a.full_name.localeCompare(b.full_name, "vi");
  if (nameDiff !== 0) return nameDiff;
  return a.id.localeCompare(b.id);
}

function generationText(person: Person) {
  return person.generation ? `Đời ${person.generation}` : "Chưa rõ đời";
}

function genderText(person: Person) {
  if (person.gender === "male") return "Nam";
  if (person.gender === "female") return "Nữ";
  return "Khác";
}

function parentRoleText(person: Person) {
  if (person.gender === "male") return "cha";
  if (person.gender === "female") return "mẹ";
  return "cha/mẹ";
}

function relationshipSentence(
  source: Person | undefined,
  target: Person | undefined,
  type: RelationshipType,
) {
  if (!source || !target) return "";
  if (type === "marriage") {
    return `${source.full_name} và ${target.full_name} là vợ/chồng.`;
  }
  if (type === "adopted_child") {
    return `${source.full_name} nhận nuôi ${target.full_name}.`;
  }
  if (type === "step_child") {
    return `${target.full_name} là con riêng trong quan hệ với ${source.full_name}.`;
  }
  if (type === "foster_child") {
    return `${source.full_name} là người nuôi dưỡng ${target.full_name}.`;
  }
  return `${source.full_name} là ${parentRoleText(source)} của ${target.full_name}.`;
}

type QuickAddTarget =
  | {
      mode: "standalone";
    }
  | {
      mode: "person" | "couple";
      anchorPersonId: string;
      anchorPerson: Person;
      spouse?: Person | null;
    };

interface FamilyTreeProps {
  personsMap: Map<string, Person>;
  relationships: Relationship[];
  roots: Person[];
  canEdit?: boolean;
  familyAdminEditExperience?: boolean;
  highlightedPersonIds?: Set<string>;
  onHoverPerson?: (id: string | null) => void;
  relationSourcePersonId?: string | null;
}

export default function FamilyTree({
  personsMap,
  relationships,
  roots,
  canEdit = false,
  familyAdminEditExperience = false,
  highlightedPersonIds,
  onHoverPerson,
  relationSourcePersonId,
}: FamilyTreeProps) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [hideDaughtersInLaw, setHideDaughtersInLaw] = useState(false);
  const [hideSonsInLaw, setHideSonsInLaw] = useState(false);
  const [hideDaughters, setHideDaughters] = useState(false);
  const [hideSons, setHideSons] = useState(false);
  const [hideMales, setHideMales] = useState(false);
  const [hideFemales, setHideFemales] = useState(false);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [hideExpandButtons, setHideExpandButtons] = useState(false);
  const [autoCollapseLevel, setAutoCollapseLevel] = useState(
    DEFAULT_AUTO_COLLAPSE_LEVEL,
  );
  const [quickAddTarget, setQuickAddTarget] =
    useState<QuickAddTarget | null>(null);
  const [deleteConfirmPerson, setDeleteConfirmPerson] =
    useState<Person | null>(null);
  const [deletingPersonId, setDeletingPersonId] = useState<string | null>(null);
  const [treeError, setTreeError] = useState<string | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showMemberListDialog, setShowMemberListDialog] = useState(false);
  const [showCanvasTools, setShowCanvasTools] = useState(true);
  const [treeMode, setTreeMode] = useState<TreeEditMode>("view");
  const [memberQuery, setMemberQuery] = useState("");
  const [memberFilter, setMemberFilter] = useState<MemberFilter>("all");
  const [relationshipDrag, setRelationshipDrag] =
    useState<RelationshipDrag | null>(null);
  const [relationshipDraft, setRelationshipDraft] =
    useState<RelationshipDraft | null>(null);
  const [relationshipType, setRelationshipType] =
    useState<RelationshipType>("biological_child");
  const [relationshipNote, setRelationshipNote] = useState("");
  const [relationshipConflict, setRelationshipConflict] =
    useState<RelationshipConflictContext | null>(null);
  const [relationshipSaving, setRelationshipSaving] = useState(false);
  const [relationshipDeleteSaving, setRelationshipDeleteSaving] =
    useState(false);
  const [relationshipStatus, setRelationshipStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [miniMapState, setMiniMapState] = useState<MiniMapState | null>(null);
  const [poolPositions, setPoolPositions] = useState<PoolPositions>({});
  const [poolHydrated, setPoolHydrated] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    showAvatar,
    setShowAvatar,
    familyId,
    familySlug,
    treeId,
    rootId,
    setRootId,
  } = useDashboard();
  const {
    scale,
    pan,
    setPan,
    isPressed,
    isDragging,
    zoomAt,
    handlers: {
      handleMouseDown,
      handleMouseMove,
      handleMouseUpOrLeave,
      handleClickCapture,
      handleZoomIn,
      handleZoomOut,
      handleResetZoom,
      handleSetScale,
    },
  } = usePanZoom(containerRef);

  const canUseAdminTreeWorkspace = canEdit && familyAdminEditExperience;
  const effectiveCanEdit = canUseAdminTreeWorkspace && treeMode === "edit";
  const isEditWorkspace = effectiveCanEdit;
  const isExpandedWorkspace = isEditWorkspace || isFullscreen;

  const adj = useMemo(
    () => buildAdjacencyLists(relationships, personsMap),
    [relationships, personsMap],
  );

  const relationLabels = useMemo(() => {
    if (!relationSourcePersonId) return new Map<string, string[]>();
    return buildRelativeRelationLabels(
      relationSourcePersonId,
      relationships,
      personsMap,
    );
  }, [personsMap, relationSourcePersonId, relationships]);

  const treeHighlightedPersonIds = useMemo(() => {
    const ids = new Set(highlightedPersonIds ?? []);
    relationLabels.forEach((_labels, personId) => ids.add(personId));
    return ids;
  }, [highlightedPersonIds, relationLabels]);

  const getTreeData = useCallback(
    (personId: string) =>
      getFilteredTreeData(personId, personsMap, adj, {
        hideDaughtersInLaw,
        hideSonsInLaw,
        hideDaughters,
        hideSons,
        hideMales,
        hideFemales,
      }),
    [
      adj,
      hideDaughters,
      hideDaughtersInLaw,
      hideFemales,
      hideMales,
      hideSons,
      hideSonsInLaw,
      personsMap,
    ],
  );

  const persons = useMemo(
    () => [...personsMap.values()].sort(sortPeopleForTree),
    [personsMap],
  );

  const linkedPersonIds = useMemo(() => {
    const ids = new Set<string>();
    relationships.forEach((relationship) => {
      ids.add(relationship.person_a);
      ids.add(relationship.person_b);
    });
    return ids;
  }, [relationships]);

  const spouseIdsByPersonId = useMemo(() => {
    const map = new Map<string, string[]>();
    relationships.forEach((relationship) => {
      if (relationship.type !== "marriage") return;
      map.set(relationship.person_a, [
        ...(map.get(relationship.person_a) ?? []),
        relationship.person_b,
      ]);
      map.set(relationship.person_b, [
        ...(map.get(relationship.person_b) ?? []),
        relationship.person_a,
      ]);
    });
    return map;
  }, [relationships]);

  const parentIdsByChildId = useMemo(() => {
    const map = new Map<string, string[]>();
    relationships.forEach((relationship) => {
      if (!isChildRelationshipType(relationship.type)) return;
      if (!personsMap.has(relationship.person_a) || !personsMap.has(relationship.person_b)) {
        return;
      }
      map.set(relationship.person_b, [
        ...(map.get(relationship.person_b) ?? []),
        relationship.person_a,
      ]);
    });
    return map;
  }, [personsMap, relationships]);

  const unlinkedPersons = useMemo(
    () => persons.filter((person) => !linkedPersonIds.has(person.id)),
    [linkedPersonIds, persons],
  );

  const forestRootIds = useMemo(() => {
    const graph = new Map<string, Set<string>>();
    const ensureNode = (personId: string) => {
      if (!graph.has(personId)) graph.set(personId, new Set());
    };

    relationships.forEach((relationship) => {
      if (!personsMap.has(relationship.person_a) || !personsMap.has(relationship.person_b)) {
        return;
      }
      ensureNode(relationship.person_a);
      ensureNode(relationship.person_b);
      graph.get(relationship.person_a)!.add(relationship.person_b);
      graph.get(relationship.person_b)!.add(relationship.person_a);
    });

    const visited = new Set<string>();
    const componentRoots: string[] = [];

    const bestRoot = (ids: string[]) =>
      [...ids].sort((a, b) => {
        const personA = personsMap.get(a);
        const personB = personsMap.get(b);
        if (!personA || !personB) return a.localeCompare(b);
        return sortPeopleForTree(personA, personB);
      })[0];

    for (const personId of graph.keys()) {
      if (visited.has(personId)) continue;
      const stack = [personId];
      const component: string[] = [];
      visited.add(personId);

      while (stack.length > 0) {
        const current = stack.pop()!;
        component.push(current);
        graph.get(current)?.forEach((next) => {
          if (visited.has(next)) return;
          visited.add(next);
          stack.push(next);
        });
      }

      const componentSet = new Set(component);
      const topCandidates = component.filter((id) =>
        (parentIdsByChildId.get(id) ?? []).every(
          (parentId) => !componentSet.has(parentId),
        ),
      );
      const parentsWithChildren = topCandidates.filter((id) =>
        (adj.childrenByPersonId.get(id) ?? []).some((child) =>
          componentSet.has(child.id),
        ),
      );
      const candidateIds =
        parentsWithChildren.length > 0
          ? parentsWithChildren
          : topCandidates.length > 0
            ? topCandidates
            : component;
      const candidateSet = new Set(candidateIds);
      const reducedCandidates = candidateIds.filter((id) => {
        const spouseIds = spouseIdsByPersonId.get(id) ?? [];
        return !spouseIds.some((spouseId) => {
          if (!candidateSet.has(spouseId)) return false;
          const better = bestRoot([id, spouseId]);
          return better === spouseId;
        });
      });

      const rootIdValue = bestRoot(
        reducedCandidates.length > 0 ? reducedCandidates : candidateIds,
      );
      if (rootIdValue) componentRoots.push(rootIdValue);
    }

    return componentRoots;
  }, [
    adj.childrenByPersonId,
    parentIdsByChildId,
    personsMap,
    relationships,
    spouseIdsByPersonId,
  ]);

  const forestRoots = useMemo(
    () =>
      forestRootIds
        .map((rootIdValue) => personsMap.get(rootIdValue))
        .filter((person): person is Person => Boolean(person)),
    [forestRootIds, personsMap],
  );

  const displayRoots = useMemo(() => {
    if (roots && roots.length > 0) return roots;
    return forestRoots;
  }, [roots, forestRoots]);

  const visibleTreePersonIds = useMemo(() => {
    const ids = new Set<string>();
    const walk = (personId: string, visited: Set<string>) => {
      if (visited.has(personId)) return;
      visited.add(personId);
      const data = getTreeData(personId);
      if (!data.person) return;
      ids.add(data.person.id);
      data.spouses.forEach((spouse) => ids.add(spouse.person.id));
      data.children.forEach((child) => walk(child.id, new Set(visited)));
    };

    forestRootIds.forEach((rootIdValue) => walk(rootIdValue, new Set()));
    return ids;
  }, [forestRootIds, getTreeData]);

  const poolPersons = useMemo(
    () =>
      persons.filter(
        (person) =>
          !linkedPersonIds.has(person.id) && !forestRootIds.includes(person.id),
      ),
    [forestRootIds, linkedPersonIds, persons],
  );

  const poolStorageKey = treeId
    ? `family-tree-integrated-member-layout:${treeId}`
    : null;

  const layoutPersonIds = useMemo(
    () => [
      ...forestRootIds,
      ...poolPersons
        .map((person) => person.id)
        .filter((personId) => !forestRootIds.includes(personId)),
    ],
    [forestRootIds, poolPersons],
  );

  /* eslint-disable react-hooks/set-state-in-effect -- Pool layout is restored from localStorage and reconciled with imported members. */
  useEffect(() => {
    setPoolHydrated(false);
    if (!poolStorageKey || typeof window === "undefined") {
      setPoolPositions({});
      setPoolHydrated(true);
      return;
    }

    try {
      const saved = window.localStorage.getItem(poolStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          positions?: PoolPositions;
        };
        setPoolPositions(parsed.positions ?? {});
      } else {
        setPoolPositions({});
      }
    } catch {
      setPoolPositions({});
    } finally {
      setPoolHydrated(true);
    }
  }, [poolStorageKey]);

  useEffect(() => {
    if (!poolHydrated) return;
    setPoolPositions((current) => {
      const next: PoolPositions = {};
      layoutPersonIds.forEach((personId, index) => {
        const isBranch = forestRootIds.includes(personId);
        const branchIndex = forestRootIds.indexOf(personId);
        const standaloneIndex = Math.max(0, index - forestRootIds.length);
        next[personId] = current[personId] ?? {
          x: isBranch
            ? 120 + (branchIndex % 3) * 430
            : 120 + (standaloneIndex % 6) * 148,
          y: isBranch
            ? 144 + Math.floor(branchIndex / 3) * 390
            : 620 +
              Math.ceil(Math.max(forestRootIds.length, 1) / 3) * 390 +
              Math.floor(standaloneIndex / 6) * 164,
        };
      });
      return next;
    });
  }, [forestRootIds, layoutPersonIds, poolHydrated]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!poolHydrated || !poolStorageKey || typeof window === "undefined") return;
    window.localStorage.setItem(
      poolStorageKey,
      JSON.stringify({ positions: poolPositions }),
    );
  }, [poolHydrated, poolPositions, poolStorageKey]);

  const sidebarPersons = useMemo(() => {
    const normalizedQuery = normalizeText(memberQuery);
    return persons.filter((person) => {
      if (memberFilter === "unlinked" && linkedPersonIds.has(person.id)) {
        return false;
      }
      return (
        !normalizedQuery ||
        normalizeText(person.full_name).includes(normalizedQuery)
      );
    });
  }, [linkedPersonIds, memberFilter, memberQuery, persons]);

  const coParentSuggestion = useMemo(() => {
    if (
      !relationshipDraft ||
      !["biological_child", "adopted_child"].includes(relationshipType)
    ) {
      return null;
    }
    const spouseIds = spouseIdsByPersonId.get(relationshipDraft.sourceId) ?? [];
    const missingCoParents = spouseIds.filter(
      (spouseId) =>
        !relationships.some(
          (relationship) =>
            relationship.person_a === spouseId &&
            relationship.person_b === relationshipDraft.targetId &&
            relationship.type === relationshipType,
        ),
    );
    if (missingCoParents.length !== 1) return null;
    return personsMap.get(missingCoParents[0]) ?? null;
  }, [
    personsMap,
    relationshipDraft,
    relationshipType,
    relationships,
    spouseIdsByPersonId,
  ]);

  const getRelationshipConflict = useCallback(
    (
      draft: RelationshipDraft,
      nextRelationshipType: RelationshipType,
    ): RelationshipConflictContext | null => {
      if (
        draft.relationshipId ||
        !isChildRelationshipType(nextRelationshipType)
      ) {
        return null;
      }

      const source = personsMap.get(draft.sourceId);
      const target = personsMap.get(draft.targetId);
      if (!source || !target) return null;

      const existingParents = relationships
        .filter(
          (relationship) =>
            isChildRelationshipType(relationship.type) &&
            relationship.person_b === draft.targetId &&
            relationship.person_a !== draft.sourceId,
        )
        .map((relationship) => personsMap.get(relationship.person_a))
        .filter((person): person is Person => Boolean(person));

      if (existingParents.length === 0) return null;

      const unresolvedParents = existingParents.filter(
        (parent) =>
          !relationships.some(
            (relationship) =>
              relationship.type === "marriage" &&
              ((relationship.person_a === draft.sourceId &&
                relationship.person_b === parent.id) ||
                (relationship.person_a === parent.id &&
                  relationship.person_b === draft.sourceId)),
          ),
      );

      if (unresolvedParents.length === 0) return null;

      const sameGenderParents = unresolvedParents.filter(
        (parent) =>
          parent.gender !== "other" &&
          source.gender !== "other" &&
          parent.gender === source.gender,
      );

      return {
        source,
        target,
        relationshipType: nextRelationshipType,
        existingParents: unresolvedParents,
        sameGenderParents,
      };
    },
    [personsMap, relationships],
  );

  const centerTree = useCallback(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const inner = el.querySelector<HTMLElement>("#export-container");
    if (!inner) return;

    const containerRect = el.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) return;

    const personElements = el.querySelectorAll<HTMLElement>("[data-tree-person-id]");
    if (personElements.length > 0) {
      let minLeft = Infinity;
      let maxRight = -Infinity;
      let minTop = Infinity;

      personElements.forEach((node) => {
        const r = node.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          if (r.left < minLeft) minLeft = r.left;
          if (r.right > maxRight) maxRight = r.right;
          if (r.top < minTop) minTop = r.top;
        }
      });

      if (minLeft < maxRight && minTop !== Infinity) {
        const treeCenterX = (minLeft + maxRight) / 2;
        const viewportCenterX = containerRect.left + containerRect.width / 2;
        const deltaX = viewportCenterX - treeCenterX;

        const targetTop = containerRect.top + (isEditWorkspace ? 48 : 36);
        const deltaY = targetTop - minTop;

        setPan((currentPan) => ({
          x: Math.round(currentPan.x + deltaX),
          y: Math.round(currentPan.y + deltaY),
        }));
        return;
      }
    }

    const innerRect = inner.getBoundingClientRect();
    if (innerRect.width > 0) {
      const innerCenterX = innerRect.left + innerRect.width / 2;
      const viewportCenterX = containerRect.left + containerRect.width / 2;
      const deltaX = viewportCenterX - innerCenterX;
      const targetTop = containerRect.top + (isEditWorkspace ? 48 : 36);
      const deltaY = targetTop - innerRect.top;

      setPan((currentPan) => ({
        x: Math.round(currentPan.x + deltaX),
        y: Math.round(currentPan.y + deltaY),
      }));
    }
  }, [isEditWorkspace, setPan]);

  const updateMiniMap = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const containerRect = el.getBoundingClientRect();
    const nodeElements = Array.from(
      el.querySelectorAll<HTMLElement>("[data-tree-person-id]"),
    );

    const currentScale = Math.max(scale || 1, 0.2);
    const currentPan = pan;

    const nodes = nodeElements
      .map((node) => {
        const id = node.dataset.treePersonId;
        if (!id) return null;
        const rect = node.getBoundingClientRect();
        const contentX =
          (rect.left - containerRect.left - currentPan.x) / currentScale;
        const contentY =
          (rect.top - containerRect.top - currentPan.y) / currentScale;
        return {
          id,
          x: contentX,
          y: contentY,
          width: rect.width / currentScale,
          height: rect.height / currentScale,
          linked: linkedPersonIds.has(id),
        };
      })
      .filter((node): node is NonNullable<typeof node> => Boolean(node));

    const nodeById = new Map(nodes.map((node) => [node.id, node]));
    const connections = relationships.flatMap((relationship) => {
      const source = nodeById.get(relationship.person_a);
      const target = nodeById.get(relationship.person_b);
      if (!source || !target) return [];
      return [
        {
          id: relationship.id,
          x1: source.x + source.width / 2,
          y1: source.y + source.height / 2,
          x2: target.x + target.width / 2,
          y2: target.y + target.height / 2,
        },
      ];
    });

    let minX = 0;
    let maxX = el.clientWidth / currentScale;
    let minY = 0;
    let maxY = el.clientHeight / currentScale;

    if (nodes.length > 0) {
      minX = Math.min(...nodes.map((n) => n.x));
      maxX = Math.max(...nodes.map((n) => n.x + n.width));
      minY = Math.min(...nodes.map((n) => n.y));
      maxY = Math.max(...nodes.map((n) => n.y + n.height));
    }

    const contentWidth = Math.max(maxX - minX + 200, el.clientWidth / currentScale);
    const contentHeight = Math.max(maxY - minY + 200, el.clientHeight / currentScale);

    setMiniMapState({
      contentWidth,
      contentHeight,
      viewportWidth: el.clientWidth / currentScale,
      viewportHeight: el.clientHeight / currentScale,
      scrollLeft: Math.max(0, -currentPan.x / currentScale),
      scrollTop: Math.max(0, -currentPan.y / currentScale),
      nodes,
      connections,
    });
  }, [linkedPersonIds, pan, relationships, scale]);

  const fitTreeToView = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const containerRect = el.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) return;

    const currentScale = Math.max(scale || 1, 0.2);
    const personElements = el.querySelectorAll<HTMLElement>("[data-tree-person-id]");

    if (personElements.length > 0) {
      let minLeft = Infinity;
      let maxRight = -Infinity;
      let minTop = Infinity;
      let maxBottom = -Infinity;

      personElements.forEach((node) => {
        const r = node.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          if (r.left < minLeft) minLeft = r.left;
          if (r.right > maxRight) maxRight = r.right;
          if (r.top < minTop) minTop = r.top;
          if (r.bottom > maxBottom) maxBottom = r.bottom;
        }
      });

      if (minLeft < maxRight && minTop < maxBottom) {
        const unscaledTreeWidth = (maxRight - minLeft) / currentScale;
        const unscaledTreeHeight = (maxBottom - minTop) / currentScale;

        const availWidth = Math.max(containerRect.width - 100, 200);
        const availHeight = Math.max(containerRect.height - 100, 200);

        const fitScale = Math.min(
          1.2,
          Math.max(0.2, Math.min(availWidth / unscaledTreeWidth, availHeight / unscaledTreeHeight)),
        );

        handleSetScale(fitScale);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            centerTree();
            requestAnimationFrame(updateMiniMap);
          });
        });
        return;
      }
    }

    const inner = el.querySelector<HTMLElement>("#export-container");
    if (!inner) return;
    const innerRect = inner.getBoundingClientRect();
    const widthRatio = (containerRect.width - 80) / Math.max(innerRect.width / currentScale, 1);
    const heightRatio = (containerRect.height - 80) / Math.max(innerRect.height / currentScale, 1);
    const nextScale = Math.min(1.2, Math.max(0.2, Math.min(widthRatio, heightRatio)));
    handleSetScale(nextScale);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        centerTree();
        requestAnimationFrame(updateMiniMap);
      });
    });
  }, [centerTree, handleSetScale, scale, updateMiniMap]);

  const workspacePoint = useCallback((clientX: number, clientY: number) => {
    const rect = workspaceRef.current?.getBoundingClientRect();
    if (!rect) return { x: clientX, y: clientY };
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const focusPersonOnCanvas = useCallback(
    (person: Person) => {
      const container = containerRef.current;
      const node = container?.querySelector<HTMLElement>(
        `[data-tree-person-id="${person.id}"]`,
      );
      if (container && node) {
        const nodeRect = node.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const deltaX =
          containerRect.left +
          containerRect.width / 2 -
          (nodeRect.left + nodeRect.width / 2);
        const deltaY =
          containerRect.top +
          containerRect.height / 2 -
          (nodeRect.top + nodeRect.height / 2);

        setPan((prev) => ({
          x: Math.round(prev.x + deltaX),
          y: Math.round(prev.y + deltaY),
        }));

        onHoverPerson?.(person.id);
        window.setTimeout(() => onHoverPerson?.(null), 900);
        return;
      }
      setRootId(person.id);
      requestAnimationFrame(() => requestAnimationFrame(centerTree));
    },
    [centerTree, onHoverPerson, setPan, setRootId],
  );

  const movePoolPerson = useCallback((personId: string, position: PoolPosition) => {
    setPoolPositions((current) => ({
      ...current,
      [personId]: {
        x: Math.max(0, Math.round(position.x)),
        y: Math.max(0, Math.round(position.y)),
      },
    }));
  }, []);

  const resetPoolLayout = useCallback(() => {
    setPoolPositions(() => {
      const next: PoolPositions = {};
      layoutPersonIds.forEach((personId, index) => {
        const isBranch = forestRootIds.includes(personId);
        const branchIndex = forestRootIds.indexOf(personId);
        const standaloneIndex = Math.max(0, index - forestRootIds.length);
        next[personId] = {
          x: isBranch
            ? 120 + (branchIndex % 3) * 430
            : 120 + (standaloneIndex % 6) * 148,
          y: isBranch
            ? 144 + Math.floor(branchIndex / 3) * 390
            : 620 +
              Math.ceil(Math.max(forestRootIds.length, 1) / 3) * 390 +
              Math.floor(standaloneIndex / 6) * 164,
        };
      });
      return next;
    });
  }, [forestRootIds, layoutPersonIds]);

  const canvasLayoutPersonIds = isEditWorkspace ? layoutPersonIds : forestRootIds;

  const poolPlaneSize = useMemo(() => {
    const maxPoolX = Math.max(
      0,
      ...canvasLayoutPersonIds.map(
        (personId) => poolPositions[personId]?.x ?? 0,
      ),
    );
    const maxPoolY = Math.max(
      0,
      ...canvasLayoutPersonIds.map(
        (personId) => poolPositions[personId]?.y ?? 0,
      ),
    );
    return {
      minWidth: Math.max(isEditWorkspace ? 1320 : 1080, maxPoolX + 620),
      minHeight: Math.max(isEditWorkspace ? 900 : 720, maxPoolY + 280),
    };
  }, [canvasLayoutPersonIds, isEditWorkspace, poolPositions]);

  const autoScrollCanvasWhileDragging = useCallback((event: PointerEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const margin = 76;
    const maxStep = 24;
    let dx = 0;
    let dy = 0;

    if (event.clientX < rect.left + margin) {
      dx = maxStep;
    } else if (event.clientX > rect.right - margin) {
      dx = -maxStep;
    }
    if (event.clientY < rect.top + margin) {
      dy = maxStep;
    } else if (event.clientY > rect.bottom - margin) {
      dy = -maxStep;
    }

    if (dx || dy) {
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      updateMiniMap();
    }
  }, [setPan, updateMiniMap]);

  useEffect(() => {
    if (!isEditWorkspace || typeof document === "undefined") return;
    const previousOverflow = document.body.style.overflow;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
    };
  }, [isEditWorkspace]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const zoomFactor = event.deltaY < 0 ? 1.12 : 0.88;
      const nextScale = scale * zoomFactor;
      zoomAt(nextScale, event.clientX, event.clientY);
      requestAnimationFrame(updateMiniMap);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [scale, updateMiniMap, zoomAt]);

  const openExistingRelationshipDraft = useCallback(
    (relationship: Relationship) => {
      setRelationshipStatus(null);
      setRelationshipDraft({
        relationshipId: relationship.id,
        sourceId: relationship.person_a,
        targetId: relationship.person_b,
      });
      setRelationshipType(relationship.type);
      setRelationshipNote(relationship.note ?? "");
    },
    [],
  );

  const startRelationshipDrag = (
    event: React.PointerEvent<HTMLButtonElement>,
    person: Person,
  ) => {
    if (!effectiveCanEdit) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const point = workspacePoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
    );
    setRelationshipStatus(null);
    setRelationshipDraft(null);
    setRelationshipDrag({
      sourceId: person.id,
      start: point,
      current: point,
    });
  };

  const swapRelationshipDraft = () => {
    setRelationshipDraft((draft) =>
      draft
        ? {
            relationshipId: draft.relationshipId,
            sourceId: draft.targetId,
            targetId: draft.sourceId,
          }
        : draft,
    );
  };

  const clearRelationshipDraft = useCallback(() => {
    setRelationshipDraft(null);
    setRelationshipConflict(null);
    setRelationshipNote("");
    setRelationshipType("biological_child");
    setRelationshipDeleteSaving(false);
  }, []);

  const enterEditWorkspace = useCallback(() => {
    if (!canEdit) return;
    setTreeMode("edit");
    setShowCanvasTools(true);
    setShowMemberListDialog(false);
    requestAnimationFrame(() => {
      centerTree();
      requestAnimationFrame(updateMiniMap);
    });
  }, [canEdit, centerTree, updateMiniMap]);

  const exitEditWorkspace = useCallback(() => {
    setTreeMode("view");
    setRelationshipDrag(null);
    clearRelationshipDraft();
    setShowMemberListDialog(false);
    requestAnimationFrame(() => {
      centerTree();
      requestAnimationFrame(updateMiniMap);
    });
  }, [centerTree, clearRelationshipDraft, updateMiniMap]);

  const saveRelationshipDraft = async (
    options: {
      skipConflictCheck?: boolean;
      linkCoParents?: boolean;
    } = {},
  ) => {
    if (!relationshipDraft || !familyId || !treeId) return;

    if (!options.skipConflictCheck) {
      const conflict = getRelationshipConflict(
        relationshipDraft,
        relationshipType,
      );
      if (conflict) {
        setRelationshipConflict(conflict);
        return;
      }
    }

    setRelationshipSaving(true);
    setRelationshipStatus(null);
    const formData = new FormData();
    formData.set("family_id", familyId);
    formData.set("tree_id", treeId);
    if (relationshipDraft.relationshipId) {
      formData.set("relationship_id", relationshipDraft.relationshipId);
    }
    formData.set("person_a", relationshipDraft.sourceId);
    formData.set("person_b", relationshipDraft.targetId);
    formData.set("type", relationshipType);
    formData.set("note", relationshipNote);

    try {
      const result = await createOrUpdateRelationshipAction(formData);
      if (result.error) throw new Error(result.error);
      let coParentAdded = false;
      let coParentName = "";
      const linkedCoParentNames: string[] = [];
      if (
        !relationshipDraft.relationshipId &&
        !relationshipConflict &&
        coParentSuggestion &&
        isChildRelationshipType(relationshipType)
      ) {
        const coParentFormData = new FormData();
        coParentName = coParentSuggestion.full_name;
        coParentFormData.set("family_id", familyId);
        coParentFormData.set("tree_id", treeId);
        coParentFormData.set("person_a", coParentSuggestion.id);
        coParentFormData.set("person_b", relationshipDraft.targetId);
        coParentFormData.set("type", relationshipType);
        coParentFormData.set("note", relationshipNote);
        const coParentResult =
          await createOrUpdateRelationshipAction(coParentFormData);
        if (coParentResult.error) throw new Error(coParentResult.error);
        coParentAdded = true;
      }
      if (
        options.linkCoParents &&
        relationshipConflict &&
        relationshipConflict.source.id === relationshipDraft.sourceId &&
        relationshipConflict.target.id === relationshipDraft.targetId
      ) {
        for (const parent of relationshipConflict.existingParents) {
          const marriageFormData = new FormData();
          marriageFormData.set("family_id", familyId);
          marriageFormData.set("tree_id", treeId);
          marriageFormData.set("person_a", relationshipDraft.sourceId);
          marriageFormData.set("person_b", parent.id);
          marriageFormData.set("type", "marriage");
          marriageFormData.set(
            "note",
            `Tạo khi xử lý đồng phụ huynh của ${relationshipConflict.target.full_name}.`,
          );
          const marriageResult =
            await createOrUpdateRelationshipAction(marriageFormData);
          if (marriageResult.error) throw new Error(marriageResult.error);
          linkedCoParentNames.push(parent.full_name);
        }
      }
      setRelationshipStatus({
        type: "success",
        message:
          linkedCoParentNames.length > 0
            ? `Đã lưu quan hệ và nối rõ đồng phụ huynh: ${linkedCoParentNames.join(", ")}.`
            : coParentAdded
              ? `Đã lưu quan hệ và tự nối thêm ${coParentName} làm cha/mẹ còn lại.`
              : "Đã lưu quan hệ, tính lại đời thứ và cập nhật sơ đồ cây.",
      });
      clearRelationshipDraft();
      router.refresh();
      requestAnimationFrame(() => requestAnimationFrame(updateMiniMap));
    } catch (error) {
      setRelationshipStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Không thể lưu quan hệ.",
      });
    } finally {
      setRelationshipSaving(false);
    }
  };

  const deleteRelationshipDraft = async () => {
    if (!relationshipDraft?.relationshipId || !familyId || !treeId) return;
    setRelationshipDeleteSaving(true);
    setRelationshipStatus(null);

    const formData = new FormData();
    formData.set("family_id", familyId);
    formData.set("tree_id", treeId);
    formData.set("relationship_id", relationshipDraft.relationshipId);

    try {
      const result = await deleteRelationshipAction(formData);
      if (result.error) throw new Error(result.error);
      setRelationshipStatus({
        type: "success",
        message: "Đã xóa quan hệ và cập nhật lại sơ đồ cây.",
      });
      clearRelationshipDraft();
      router.refresh();
      requestAnimationFrame(() => requestAnimationFrame(updateMiniMap));
    } catch (error) {
      setRelationshipStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Không thể xóa quan hệ.",
      });
    } finally {
      setRelationshipDeleteSaving(false);
    }
  };

  useEffect(() => {
    if (!relationshipDrag) return;
    const sourceId = relationshipDrag.sourceId;

    const handlePointerMove = (event: PointerEvent) => {
      const point = workspacePoint(event.clientX, event.clientY);
      autoScrollCanvasWhileDragging(event);
      setRelationshipDrag((current) =>
        current?.sourceId === sourceId
          ? { ...current, current: point }
          : current,
      );
    };

    const handlePointerUp = (event: PointerEvent) => {
      const targetElement = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest<HTMLElement>("[data-tree-person-id]");
      const targetId = targetElement?.dataset.treePersonId;
      setRelationshipDrag(null);

      if (!targetId || targetId === sourceId) {
        if (targetId === sourceId) {
          setRelationshipStatus({
            type: "error",
            message: "Không thể tạo quan hệ với chính thành viên đó.",
          });
        }
        return;
      }

      const sourceIsInMainTree = visibleTreePersonIds.has(sourceId);
      const targetIsInMainTree = visibleTreePersonIds.has(targetId);
      setRelationshipDraft(
        !sourceIsInMainTree && targetIsInMainTree
          ? { sourceId: targetId, targetId: sourceId }
          : { sourceId, targetId },
      );
      setRelationshipType("biological_child");
      setRelationshipNote("");
      setRelationshipStatus(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [
    autoScrollCanvasWhileDragging,
    relationshipDrag,
    visibleTreePersonIds,
    workspacePoint,
  ]);

  useEffect(() => {
    const raf = requestAnimationFrame(updateMiniMap);
    window.addEventListener("resize", updateMiniMap);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateMiniMap);
    };
  }, [
    scale,
    forestRootIds,
    relationships,
    poolPersons.length,
    collapsedNodes,
    updateMiniMap,
  ]);

  useEffect(() => {
    const equalizeHeights = () => {
      if (!containerRef.current) return;
      const nodes = containerRef.current.querySelectorAll(".node-container");
      const levelMap: Record<string, HTMLElement[]> = {};

      nodes.forEach((node) => {
        const level = node.getAttribute("data-level");
        if (level == null) return;
        if (!levelMap[level]) levelMap[level] = [];
        levelMap[level].push(node as HTMLElement);
      });

      Object.values(levelMap).forEach((levelNodes) => {
        levelNodes.forEach((node) => {
          const innerFlex = node.firstElementChild as HTMLElement;
          if (innerFlex) innerFlex.style.minHeight = "0px";
        });

        let maxHeight = 0;
        levelNodes.forEach((node) => {
          const innerFlex = node.firstElementChild as HTMLElement;
          if (innerFlex) maxHeight = Math.max(maxHeight, innerFlex.offsetHeight);
        });

        levelNodes.forEach((node) => {
          const innerFlex = node.firstElementChild as HTMLElement;
          if (innerFlex && maxHeight > 0) {
            innerFlex.style.minHeight = `${maxHeight}px`;
          }
        });
      });
    };

    const timeoutId = window.setTimeout(equalizeHeights, 50);
    window.addEventListener("resize", equalizeHeights);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("resize", equalizeHeights);
    };
  }, [
    forestRootIds,
    personsMap,
    relationships,
    showAvatar,
    scale,
    hideDaughtersInLaw,
    hideSonsInLaw,
    hideDaughters,
    hideSons,
    hideMales,
    hideFemales,
    collapsedNodes,
  ]);

  useEffect(() => {
    const autoCollapsed = new Set<string>();

    const walk = (personId: string, visited: Set<string>, level: number) => {
      if (visited.has(personId)) return;
      visited.add(personId);

      const data = getTreeData(personId);
      if (!data.person) return;

      if (
        autoCollapseLevel > 0 &&
        level >= autoCollapseLevel &&
        data.children.length > 0
      ) {
        autoCollapsed.add(personId);
      }

      data.children.forEach((child) =>
        walk(child.id, new Set(visited), level + 1),
      );
    };

    forestRootIds.forEach((rootIdValue) => walk(rootIdValue, new Set(), 0));

    const raf = requestAnimationFrame(() => {
      setCollapsedNodes(autoCollapsed);
      requestAnimationFrame(centerTree);
    });

    return () => cancelAnimationFrame(raf);
  }, [autoCollapseLevel, centerTree, forestRootIds, getTreeData]);

  useEffect(() => {
    if (isEditWorkspace || persons.length === 0) return;
    const raf = requestAnimationFrame(() => {
      fitTreeToView();
      requestAnimationFrame(updateMiniMap);
    });
    return () => cancelAnimationFrame(raf);
  }, [
    collapsedNodes,
    fitTreeToView,
    forestRootIds,
    isEditWorkspace,
    persons.length,
    relationships.length,
    showAvatar,
    updateMiniMap,
  ]);

  const toggleCollapse = useCallback((personId: string) => {
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(personId)) next.delete(personId);
      else next.add(personId);
      return next;
    });
  }, []);

  const handleExpandAll = useCallback(() => {
    setAutoCollapseLevel(0);
    setCollapsedNodes(new Set());
  }, []);

  const handleCollapseAll = useCallback(() => {
    const autoCollapsed = new Set<string>();

    const walk = (personId: string, visited: Set<string>, level: number) => {
      if (visited.has(personId)) return;
      visited.add(personId);

      const data = getTreeData(personId);
      if (!data.person) return;

      if (level >= 2 && data.children.length > 0) {
        autoCollapsed.add(personId);
      }

      data.children.forEach((child) =>
        walk(child.id, new Set(visited), level + 1),
      );
    };

    const targetRoots = roots.length > 0 ? roots.map((r) => r.id) : forestRootIds;
    targetRoots.forEach((rootIdValue) => walk(rootIdValue, new Set(), 0));

    setAutoCollapseLevel(2);
    setCollapsedNodes(autoCollapsed);
  }, [forestRootIds, getTreeData, roots]);

  const stopTreeInteraction = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const openPersonQuickAdd = (event: React.MouseEvent, person: Person) => {
    stopTreeInteraction(event);
    setQuickAddTarget({
      mode: "person",
      anchorPersonId: person.id,
      anchorPerson: person,
    });
  };

  const deletePersonFromTree = (
    event: React.MouseEvent,
    person: Person,
  ) => {
    stopTreeInteraction(event);
    setTreeError(null);
    setDeleteConfirmPerson(person);
  };

  const confirmDeletePersonFromTree = async () => {
    const person = deleteConfirmPerson;
    if (!person) return;

    if (!familyId || !treeId) {
      setTreeError("Thiếu thông tin dòng họ hoặc cây gia phả.");
      return;
    }


    setDeletingPersonId(person.id);
    setTreeError(null);

    const formData = new FormData();
    formData.set("member_id", person.id);
    formData.set("family_id", familyId);
    formData.set("tree_id", treeId);
    const result = await deleteMemberRecordAction(formData);

    if (result?.error) {
      setTreeError(result.error || "Không thể xóa thành viên này.");
      setDeletingPersonId(null);
      return;
    }

    if (rootId === person.id) setRootId(null);
    router.refresh();
    setDeleteConfirmPerson(null);
    setDeletingPersonId(null);
  };

  const renderRelationBadge = (person: Person) => {
    const labels = relationLabels.get(person.id);
    if (!labels?.length) return null;

    return (
      <div className="pointer-events-none absolute left-1/2 top-full z-40 mt-1 max-w-[140px] -translate-x-1/2 truncate rounded-full border border-rose-200 bg-white px-2.5 py-1 text-[10px] font-black text-rose-600 shadow-[0_10px_24px_rgba(190,18,60,0.16)]">
        {labels.slice(0, 2).join(" / ")}
      </div>
    );
  };

  const findMarriageRelationship = (personA: string, personB: string) =>
    relationships.find(
      (relationship) =>
        relationship.type === "marriage" &&
        ((relationship.person_a === personA && relationship.person_b === personB) ||
          (relationship.person_a === personB && relationship.person_b === personA)),
    );

  const findChildRelationship = (parentId: string, childId: string) =>
    relationships.find(
      (relationship) =>
        isChildRelationshipType(relationship.type) &&
        relationship.person_a === parentId &&
        relationship.person_b === childId,
    );

  const renderRelationshipWireEditor = (
    relationship: Relationship | undefined,
    className = "",
  ) => {
    if (!relationship || !effectiveCanEdit) return null;
    const label = relationshipDisplayLabel(relationship.type);

    return (
      <button
        type="button"
        data-no-position-drag
        onMouseDown={stopTreeInteraction}
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          openExistingRelationshipDraft(relationship);
        }}
        className={`group/rel absolute z-[105] flex items-center justify-center rounded-full border border-transparent bg-transparent transition hover:border-amber-300 hover:bg-amber-100/80 hover:shadow-sm focus:border-amber-400 focus:bg-amber-100 focus:outline-none ${className}`}
        title={`Click để chỉnh sửa ${label}`}
        aria-label={`Click để chỉnh sửa ${label}`}
      >
        <span className="absolute left-1/2 top-1/2 h-full w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent transition group-hover/rel:bg-amber-500 group-focus/rel:bg-amber-500" />
        <span className="relative z-10 inline-flex size-7 items-center justify-center rounded-full border border-amber-200 bg-white text-amber-700 opacity-0 shadow-lg transition group-hover/rel:opacity-100 group-focus/rel:opacity-100">
          <Pencil className="size-3.5" />
        </span>
        <span className="pointer-events-none absolute left-1/2 top-0 hidden min-w-[128px] -translate-x-1/2 -translate-y-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-center shadow-xl group-hover/rel:block group-focus/rel:block">
          <span className="block text-[11px] font-black text-stone-900">
            {label}
          </span>
          <span className="mt-0.5 block text-[10px] font-bold text-amber-700">
            Bấm icon để sửa
          </span>
        </span>
      </button>
    );
  };

  const renderPersonActions = (person: Person) => {
    if (!effectiveCanEdit) return null;
    const isDeleting = deletingPersonId === person.id;

    return (
      <div className="absolute -right-3 -top-3 z-50 flex items-center gap-1 opacity-0 transition group-hover/person:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          data-no-position-drag
          onMouseDown={stopTreeInteraction}
          onClick={(event) => openPersonQuickAdd(event, person)}
          className="inline-flex size-8 items-center justify-center rounded-full border border-amber-200 bg-white text-amber-700 shadow-lg transition hover:bg-amber-50 hover:text-amber-800"
          title={`Thêm thành viên từ ${person.full_name}`}
          aria-label={`Thêm thành viên từ ${person.full_name}`}
        >
          <UserPlus className="size-3.5" />
        </button>
        <button
          type="button"
          data-no-position-drag
          disabled={isDeleting}
          onMouseDown={stopTreeInteraction}
          onClick={(event) => deletePersonFromTree(event, person)}
          className="inline-flex size-8 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 shadow-lg transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          title={`Xóa ${person.full_name}`}
          aria-label={`Xóa ${person.full_name}`}
        >
          {isDeleting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Trash2 className="size-3.5" />
          )}
        </button>
      </div>
    );
  };

  const renderRelationHandles = (person: Person) => {
    if (!effectiveCanEdit) return null;

    return (
      <div className="pointer-events-none absolute inset-0 z-40 opacity-0 transition duration-150 group-hover/person:opacity-100 group-focus-within/person:opacity-100">
        {relationHandlePositions.map((handle) => (
          <button
            key={handle.side}
            type="button"
            data-no-position-drag
            onMouseDown={stopTreeInteraction}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
            onPointerDown={(event) => startRelationshipDrag(event, person)}
            className={`pointer-events-auto absolute ${handle.className} flex size-5 items-center justify-center rounded-full border border-amber-200 bg-white shadow-[0_8px_22px_rgba(146,64,14,0.28)] transition hover:scale-125 hover:border-amber-300 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400`}
            title={`Kéo để nối quan hệ từ ${person.full_name}`}
            aria-label={`Kéo để nối quan hệ từ ${person.full_name}`}
          >
            <span className="size-2.5 rounded-full bg-amber-600 shadow-[0_0_0_3px_rgba(245,158,11,0.16)]" />
          </button>
        ))}
      </div>
    );
  };

  const renderStandalonePersonCard = (person: Person) => {
    const isUnlinked = !linkedPersonIds.has(person.id);

    return (
      <div
        key={person.id}
        className={`group/person relative rounded-[18px] border p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-[0_16px_34px_rgba(41,37,36,0.12)] ${
          isUnlinked
            ? "border-dashed border-amber-300/80 bg-white/92"
            : "border-emerald-200 bg-white/94"
        }`}
        data-tree-person-id={person.id}
        onMouseEnter={() => onHoverPerson?.(person.id)}
        onMouseLeave={() => onHoverPerson?.(null)}
      >
        <div
          className={`absolute left-2 top-2 z-30 rounded-full border border-white px-2 py-0.5 text-[10px] font-black shadow-sm ${
            isUnlinked
              ? "bg-amber-50 text-amber-800"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {isUnlinked ? "Chưa nối" : "Đã có quan hệ"}
        </div>
        <FamilyNodeCard
          person={person}
          level={person.generation ? person.generation - 1 : 0}
          highlightedPersonIds={treeHighlightedPersonIds}
        />
        {renderPersonActions(person)}
        {renderRelationHandles(person)}
        {renderRelationBadge(person)}
      </div>
    );
  };

  const renderTreeNode = (
    personId: string,
    visited: Set<string> = new Set(),
    level = 0,
    incomingRelationship?: Relationship,
  ): React.ReactNode => {
    if (visited.has(personId)) return null;
    visited.add(personId);

    const data = getTreeData(personId);
    if (!data.person) return null;

    const hasChildren = data.children.length > 0;
    const isCollapsed = collapsedNodes.has(personId);

    return (
      <li>
        {renderRelationshipWireEditor(
          incomingRelationship,
          "left-1/2 top-2 h-9 w-16 -translate-x-1/2",
        )}
        <div
          className="node-container inline-flex flex-col items-center"
          data-level={level}
        >
          <div
            className={`group/couple relative z-10 flex h-full items-stretch ${
              showAvatar
                ? "rounded-2xl border border-stone-200/80 bg-white shadow-md transition-opacity"
                : ""
            }`}
          >
            <div
              className="group/person relative"
              data-tree-person-id={data.person.id}
              onMouseEnter={() => onHoverPerson?.(data.person.id)}
              onMouseLeave={() => onHoverPerson?.(null)}
            >
              <FamilyNodeCard
                person={data.person}
                level={level}
                highlightedPersonIds={treeHighlightedPersonIds}
              />
              {renderPersonActions(data.person)}
              {renderRelationHandles(data.person)}
              {renderRelationBadge(data.person)}
            </div>

            {data.spouses.map((spouseData, idx) => (
              <div
                key={spouseData.person.id}
                className="group/couple relative flex"
              >
                <span
                  className="pointer-events-none absolute left-0 top-1/2 z-20 h-[3px] w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-300 shadow-[0_0_0_4px_rgba(255,255,255,0.9),0_8px_18px_rgba(244,63,94,0.2)]"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  data-no-position-drag
                  disabled={!effectiveCanEdit}
                  onMouseDown={stopTreeInteraction}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    if (!effectiveCanEdit) return;
                    const relationship = findMarriageRelationship(
                      data.person.id,
                      spouseData.person.id,
                    );
                    if (relationship) openExistingRelationshipDraft(relationship);
                  }}
                  className={`group/rel absolute left-0 top-1/2 z-30 min-w-[58px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-100 bg-white px-2 py-0.5 text-[10px] font-black text-rose-700 shadow-sm ${
                    effectiveCanEdit
                      ? "cursor-pointer transition hover:border-amber-300 hover:bg-amber-50"
                      : "cursor-default"
                  }`}
                  title={
                    effectiveCanEdit
                      ? "Click để chỉnh sửa Vợ/chồng"
                      : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    Hôn nhân
                    {effectiveCanEdit && <Pencil className="size-3" />}
                  </span>
                  {effectiveCanEdit && (
                    <span className="pointer-events-none absolute left-1/2 top-0 hidden min-w-[160px] -translate-x-1/2 -translate-y-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-center shadow-xl group-hover/rel:block group-focus/rel:block">
                      <span className="block text-[11px] font-black text-stone-900">
                        Mối quan hệ: Vợ/chồng
                      </span>
                      <span className="mt-0.5 block text-[10px] font-bold text-amber-700">
                        Click để chỉnh sửa
                      </span>
                    </span>
                  )}
                </button>
                <div
                  className="group/person relative"
                  data-tree-person-id={spouseData.person.id}
                  onMouseEnter={() => onHoverPerson?.(spouseData.person.id)}
                  onMouseLeave={() => onHoverPerson?.(null)}
                >
                  <FamilyNodeCard
                    isRingVisible={idx === 0}
                    isPlusVisible={idx > 0}
                    person={spouseData.person}
                    role={spouseData.person.gender === "male" ? "Chồng" : "Vợ"}
                    note={spouseData.note}
                    level={level}
                    highlightedPersonIds={treeHighlightedPersonIds}
                  />
                  {renderPersonActions(spouseData.person)}
                  {renderRelationHandles(spouseData.person)}
                  {renderRelationBadge(spouseData.person)}
                </div>
              </div>
            ))}

            {!hideExpandButtons && hasChildren && (
              <button
                type="button"
                data-no-position-drag
                onMouseDown={stopTreeInteraction}
                onClick={(event) => {
                  stopTreeInteraction(event);
                  toggleCollapse(personId);
                }}
                className="absolute -bottom-3 left-1/2 z-[100] flex size-6 -translate-x-1/2 items-center justify-center rounded-full border border-stone-200/80 bg-white text-stone-500 shadow-md transition-colors hover:border-amber-300 hover:text-amber-600"
                title={isCollapsed ? "Mở rộng" : "Thu gọn"}
                aria-label={isCollapsed ? "Mở rộng nhánh" : "Thu gọn nhánh"}
              >
                {isCollapsed ? (
                  <Plus className="size-3.5" />
                ) : (
                  <Minus className="size-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {hasChildren && !isCollapsed && (
          <ul>
            {data.children.map((child) => (
              <React.Fragment key={child.id}>
                {renderTreeNode(
                  child.id,
                  new Set(visited),
                  level + 1,
                  findChildRelationship(data.person.id, child.id),
                )}
              </React.Fragment>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div
      ref={workspaceRef}
      className={
        isExpandedWorkspace
          ? "fixed inset-0 z-[2147483600] h-[100dvh] w-screen overflow-hidden bg-[#f5f6f1]"
          : "relative h-full w-full overflow-hidden bg-[#f5f6f1]"
      }
    >
            <TreeToolbar
        scale={scale}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleResetZoom={handleResetZoom}
        handleCenter={centerTree}
        handleExpandAll={handleExpandAll}
        handleCollapseAll={handleCollapseAll}
        hideExpandButtons={hideExpandButtons}
        setHideExpandButtons={setHideExpandButtons}
        autoCollapseLevel={autoCollapseLevel}
        setAutoCollapseLevel={setAutoCollapseLevel}
        hideDaughtersInLaw={hideDaughtersInLaw}
        setHideDaughtersInLaw={setHideDaughtersInLaw}
        hideSonsInLaw={hideSonsInLaw}
        setHideSonsInLaw={setHideSonsInLaw}
        hideDaughters={hideDaughters}
        setHideDaughters={setHideDaughters}
        hideSons={hideSons}
        setHideSons={setHideSons}
        hideMales={hideMales}
        setHideMales={setHideMales}
        hideFemales={hideFemales}
        setHideFemales={setHideFemales}
        canEdit={canEdit}
        extraActions={
          canUseAdminTreeWorkspace ? (
            <button
              type="button"
              onClick={isEditWorkspace ? exitEditWorkspace : enterEditWorkspace}
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-black transition ${
                isEditWorkspace
                  ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
              title={isEditWorkspace ? "Thoát chế độ nối quan hệ" : "Mở chế độ nối quan hệ trên cây"}
            >
              {isEditWorkspace ? <X className="size-4" /> : <Link2 className="size-4" />}
              <span>{isEditWorkspace ? "Thoát sửa" : "Nối quan hệ"}</span>
            </button>
          ) : null
        }
      />
      <TreeQuickAddDialog
        target={quickAddTarget}
        personsMap={personsMap}
        relationships={relationships}
        onClose={() => setQuickAddTarget(null)}
      />

      {showImportDialog && familyId && treeId && (
        <TreeWorkspaceModal
          title="Nhập Excel vào sơ đồ cây"
          description="Import danh sách thành viên hoặc quan hệ theo tên, sau đó tiếp tục nối quan hệ ngay trên màn cây."
          onClose={() => setShowImportDialog(false)}
          wide
        >
          <ExcelImportWizard
            familyId={familyId}
            treeId={treeId}
            familySlug={familySlug ?? undefined}
            onImportApplied={() => {
              setShowImportDialog(false);
              setMemberFilter("unlinked");
              if (canUseAdminTreeWorkspace) setTreeMode("edit");
              router.refresh();
              requestAnimationFrame(() => requestAnimationFrame(updateMiniMap));
            }}
            onRequestRelationshipEdit={() => {
              setShowImportDialog(false);
              setMemberFilter("unlinked");
              if (canUseAdminTreeWorkspace) setTreeMode("edit");
              requestAnimationFrame(() => requestAnimationFrame(updateMiniMap));
            }}
          />
        </TreeWorkspaceModal>
      )}

      {showMemberListDialog && (
        <TreeMemberListDialog
          persons={sidebarPersons}
          totalCount={persons.length}
          unlinkedCount={unlinkedPersons.length}
          query={memberQuery}
          onQueryChange={setMemberQuery}
          filter={memberFilter}
          onFilterChange={setMemberFilter}
          linkedPersonIds={linkedPersonIds}
          onFocusPerson={(person) => {
            setShowMemberListDialog(false);
            requestAnimationFrame(() => focusPersonOnCanvas(person));
          }}
          editMode={treeMode}
          canEdit={canUseAdminTreeWorkspace}
          onToggleEditMode={() =>
            canUseAdminTreeWorkspace &&
            setTreeMode((mode) => (mode === "edit" ? "view" : "edit"))
          }
          onClose={() => setShowMemberListDialog(false)}
        />
      )}

      {deleteConfirmPerson && (
        <div className="fixed inset-0 z-[170] flex items-end justify-center bg-stone-950/35 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-5 shadow-[0_28px_90px_rgba(41,37,36,0.22)]">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Trash2 className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-red-500">
                  Xác nhận xóa
                </p>
                <h3 className="mt-1 text-xl font-black text-stone-950">
                  Xóa {deleteConfirmPerson.full_name}?
                </h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-stone-500">
                  Hồ sơ, dữ liệu riêng và các quan hệ trực tiếp của thành viên
                  này sẽ được gỡ khỏi cây hiện tại.
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmPerson(null)}
                disabled={deletingPersonId === deleteConfirmPerson.id}
                className="flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-black text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDeletePersonFromTree}
                disabled={deletingPersonId === deleteConfirmPerson.id}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingPersonId === deleteConfirmPerson.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Xóa thành viên
              </button>
            </div>
          </div>
        </div>
      )}

      {treeError && (
        <div className="absolute left-1/2 top-4 z-[160] flex max-w-md -translate-x-1/2 items-start gap-3 rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 shadow-xl">
          <span className="mt-1 size-2 rounded-full bg-red-500" />
          <span className="min-w-0 flex-1">{treeError}</span>
          <button
            type="button"
            onClick={() => setTreeError(null)}
            className="text-red-400 transition hover:text-red-700"
            aria-label="Đóng thông báo lỗi"
          >
            Đóng
          </button>
        </div>
      )}

      <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#f5f6f1]">
          {isEditWorkspace && (
            <div className="pointer-events-none absolute left-5 top-4 z-[110] hidden items-center gap-2 rounded-full border border-white/80 bg-white/84 px-3 py-2 text-xs font-black text-stone-600 shadow-[0_12px_34px_rgba(41,37,36,0.08)] backdrop-blur lg:flex">
              <>
                <Link2 className="size-3.5 text-amber-700" />
                Chế độ nối quan hệ
              </>
            </div>
          )}

          {isEditWorkspace && (
            <div className="absolute right-5 top-4 z-[150] flex items-center gap-2">
              <button
                type="button"
                data-no-pan
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => setQuickAddTarget({ mode: "standalone" })}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 text-sm font-black text-emerald-800 shadow-[0_14px_38px_rgba(6,95,70,0.14)] transition hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                <UserPlus className="size-4" />
                Thêm thành viên
              </button>
              <button
                type="button"
                data-no-pan
                onMouseDown={(event) => event.stopPropagation()}
                onClick={exitEditWorkspace}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-red-200 bg-white px-4 text-sm font-black text-red-700 shadow-[0_14px_38px_rgba(127,29,29,0.16)] transition hover:-translate-y-0.5 hover:bg-red-50"
              >
                <X className="size-4" />
                Thoát chế độ nối
              </button>
            </div>
          )}

          {showCanvasTools ? (
            <TreeCanvasTools
              scale={scale}
              canEdit={canEdit}
              showAvatar={showAvatar}
              hideExpandButtons={hideExpandButtons}
              autoCollapseLevel={autoCollapseLevel}
              hideDaughtersInLaw={hideDaughtersInLaw}
              hideSonsInLaw={hideSonsInLaw}
              hideDaughters={hideDaughters}
              hideSons={hideSons}
              hideMales={hideMales}
              hideFemales={hideFemales}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onResetZoom={handleResetZoom}
              onFit={fitTreeToView}
              onCenter={centerTree}
              onResetLayout={resetPoolLayout}
              onExpandAll={handleExpandAll}
              onCollapseAll={handleCollapseAll}
              onShowAvatarChange={setShowAvatar}
              onHideExpandButtonsChange={setHideExpandButtons}
              onAutoCollapseLevelChange={setAutoCollapseLevel}
              onHideDaughtersInLawChange={setHideDaughtersInLaw}
              onHideSonsInLawChange={setHideSonsInLaw}
              onHideDaughtersChange={setHideDaughters}
              onHideSonsChange={setHideSons}
              onHideMalesChange={setHideMales}
              onHideFemalesChange={setHideFemales}
              onClose={() => setShowCanvasTools(false)}
            />
          ) : (
            <button
              type="button"
              data-no-pan
              onMouseDown={(event) => event.stopPropagation()}
              onClick={() => setShowCanvasTools(true)}
              className="absolute bottom-5 right-5 z-[130] inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/80 bg-stone-950 px-4 text-sm font-black text-white shadow-[0_18px_50px_rgba(41,37,36,0.22)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-stone-800"
            >
              <SlidersHorizontal className="size-4" />
              Công cụ
            </button>
          )}

          <div
            ref={containerRef}
            className={`h-full w-full overflow-hidden select-none [touch-action:none] bg-[#f5f6f1] [background-image:linear-gradient(rgba(68,64,60,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(68,64,60,0.07)_1px,transparent_1px)] [background-size:34px_34px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isPressed ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              backgroundPosition: `${pan.x % 34}px ${pan.y % 34}px`,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onClickCapture={handleClickCapture}
            onDragStart={(event) => event.preventDefault()}
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `
        .css-tree ul {
          padding-top: 38px;
          position: relative;
          display: flex;
          justify-content: center;
          padding-left: 0;
          user-select: none;
        }

        .css-tree li {
          float: left;
          text-align: center;
          list-style-type: none;
          position: relative;
          padding: 38px 12px 0 12px;
        }

        .css-tree li::before,
        .css-tree li::after {
          content: '';
          position: absolute;
          top: 0;
          right: 50%;
          border-top: 2px solid rgba(120, 96, 58, 0.38);
          width: 50%;
          height: 38px;
        }

        .css-tree li::after {
          right: auto;
          left: 50%;
          border-left: 2px solid rgba(120, 96, 58, 0.38);
        }

        .css-tree li:only-child::after {
          display: none;
        }

        .css-tree li:only-child::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          border-left: 2px solid rgba(120, 96, 58, 0.38);
          width: 0;
          height: 38px;
        }

        .css-tree ul:first-child > li {
          padding-top: 0;
        }

        .css-tree ul:first-child > li::before {
          display: none;
        }

        .css-tree li:first-child::before,
        .css-tree li:last-child::after {
          border: 0 none;
        }

        .css-tree li:last-child::before {
          border-right: 2px solid rgba(120, 96, 58, 0.38);
          border-radius: 0 12px 0 0;
        }

        .css-tree li:first-child::after {
          border-radius: 12px 0 0 0;
        }

        .css-tree ul ul::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          border-left: 2px solid rgba(120, 96, 58, 0.38);
          width: 0;
          height: 38px;
        }
      `,
              }}
            />

            <div
              id="export-container"
              className={`css-tree relative w-max min-w-full overflow-visible px-10 pb-10 ${
                isDragging
                  ? "transition-none select-none opacity-90"
                  : "transition-transform duration-150 ease-out"
              } ${
                isEditWorkspace ? "pt-36" : "pt-10"
              }`}
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
                transformOrigin: "0 0",
                minWidth: poolPlaneSize.minWidth,
                minHeight: poolPlaneSize.minHeight,
              }}
            >
              {persons.length === 0 ? (
                <div className="relative z-10 mx-auto flex min-h-72 max-w-lg flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-10 text-center shadow-sm">
                  <MousePointer2 className="size-9 text-stone-400" />
                  <h3 className="mt-3 text-lg font-black text-stone-900">
                    Chưa có thành viên
                  </h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-stone-500">
                    Import thành viên hoặc thêm hồ sơ mới, sau đó kéo dây để
                    xác định quan hệ ngay trên sơ đồ.
                  </p>
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => setShowImportDialog(true)}
                      className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-emerald-700 px-4 text-sm font-black text-white transition hover:bg-emerald-800"
                    >
                      <FileSpreadsheet className="size-4" />
                      Nhập Excel
                    </button>
                  )}
                </div>
              ) : !isEditWorkspace && displayRoots.length > 0 ? (
                <ViewTreePlane
                  branchRoots={displayRoots}
                  renderBranch={(root) => (
                    <ul>
                      {renderTreeNode(root.id)}
                    </ul>
                  )}
                />
              ) : !isEditWorkspace ? (
                <EmptyTreeView
                  canEnterEdit={canUseAdminTreeWorkspace}
                  onEnterEdit={enterEditWorkspace}
                />
              ) : (
                <IntegratedTreePlane
                  branchRoots={displayRoots}
                  standalonePersons={isEditWorkspace ? poolPersons : []}
                  positions={poolPositions}
                  canEdit={effectiveCanEdit}
                  scale={scale}
                  onMovePerson={movePoolPerson}
                  onDragFrame={autoScrollCanvasWhileDragging}
                  renderBranch={(root) => (
                    <ul>
                      {renderTreeNode(root.id)}
                    </ul>
                  )}
                  renderStandalonePersonCard={renderStandalonePersonCard}
                />
              )}
            </div>
          </div>

          {canUseAdminTreeWorkspace && !isEditWorkspace && unlinkedPersons.length > 0 && (
            <UnlinkedMembersRail
              persons={unlinkedPersons}
              onConnectPerson={(person) => {
                enterEditWorkspace();
                setMemberFilter("unlinked");
                requestAnimationFrame(() =>
                  requestAnimationFrame(() => focusPersonOnCanvas(person)),
                );
              }}
            />
          )}

          {isEditWorkspace && (
            <TreeMiniMap
              state={miniMapState}
              onJump={(xRatio, yRatio) => {
                const el = containerRef.current;
                if (!el || !miniMapState) return;
                const currentScale = Math.max(scale || 1, 0.2);
                const targetContentX = xRatio * miniMapState.contentWidth;
                const targetContentY = yRatio * miniMapState.contentHeight;
                setPan({
                  x: Math.round(el.clientWidth / 2 - targetContentX * currentScale),
                  y: Math.round(el.clientHeight / 2 - targetContentY * currentScale),
                });
                requestAnimationFrame(updateMiniMap);
              }}
            />
          )}
        </div>

      {relationshipDrag && (
        <svg className="pointer-events-none absolute inset-0 z-[95] h-full w-full">
          <line
            x1={relationshipDrag.start.x}
            y1={relationshipDrag.start.y}
            x2={relationshipDrag.current.x}
            y2={relationshipDrag.current.y}
            stroke="#b45309"
            strokeWidth="4"
            strokeDasharray="9 7"
            strokeLinecap="round"
            filter="drop-shadow(0 8px 12px rgba(146,64,14,0.24))"
          />
          <circle
            cx={relationshipDrag.start.x}
            cy={relationshipDrag.start.y}
            r="5"
            fill="#fff7ed"
            stroke="#b45309"
            strokeWidth="3"
          />
          <circle
            cx={relationshipDrag.current.x}
            cy={relationshipDrag.current.y}
            r="6"
            fill="#b45309"
            stroke="#fff7ed"
            strokeWidth="3"
          />
        </svg>
      )}

      {relationshipStatus && (
        <RelationshipStatusToast
          status={relationshipStatus}
          onDismiss={() => setRelationshipStatus(null)}
        />
      )}

      {relationshipDraft && (
        <RelationshipDraftPanel
          source={relationshipDraft ? personsMap.get(relationshipDraft.sourceId) : undefined}
          target={relationshipDraft ? personsMap.get(relationshipDraft.targetId) : undefined}
          coParent={coParentSuggestion}
          relationshipType={relationshipType}
          relationshipNote={relationshipNote}
          saving={relationshipSaving}
          deleting={relationshipDeleteSaving}
          onTypeChange={setRelationshipType}
          onNoteChange={setRelationshipNote}
          onSwap={swapRelationshipDraft}
          onCancel={clearRelationshipDraft}
          onSave={saveRelationshipDraft}
          onDelete={
            relationshipDraft.relationshipId ? deleteRelationshipDraft : undefined
          }
        />
      )}

      {relationshipConflict && (
        <RelationshipConflictModal
          conflict={relationshipConflict}
          saving={relationshipSaving}
          onLinkCoParents={() =>
            saveRelationshipDraft({
              skipConflictCheck: true,
              linkCoParents: true,
            })
          }
          onSaveOnly={() =>
            saveRelationshipDraft({
              skipConflictCheck: true,
              linkCoParents: false,
            })
          }
          onCancel={() => setRelationshipConflict(null)}
        />
      )}
    </div>
  );
}

function UnlinkedMembersRail({
  persons,
  onConnectPerson,
}: {
  persons: Person[];
  onConnectPerson: (person: Person) => void;
}) {
  return (
    <aside
      data-no-pan
      className="absolute right-4 top-[124px] z-40 flex max-h-[calc(100%-144px)] w-[292px] flex-col overflow-hidden rounded-[24px] border border-white/80 bg-[#fffdf9]/94 shadow-[0_20px_58px_rgba(41,37,36,0.16)] backdrop-blur-xl max-sm:inset-x-4 max-sm:top-auto max-sm:bottom-4 max-sm:max-h-[34dvh] max-sm:w-auto"
      onMouseDown={(event) => event.stopPropagation()}
      onWheelCapture={(event) => event.stopPropagation()}
    >
      <div className="border-b border-stone-200 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-700">
              Chưa nối
            </p>
            <p className="mt-0.5 truncate text-sm font-black text-stone-950">
              {persons.length.toLocaleString("vi-VN")} thành viên ngoài cây
            </p>
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <Users className="size-4" />
          </span>
        </div>
        <p className="mt-2 text-xs font-semibold leading-5 text-stone-500">
          Bấm một người để mở không gian chỉnh sửa và nối vào nhánh phù hợp.
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 [scrollbar-color:#a8a29e_transparent] [scrollbar-width:thin]">
        {persons.map((person) => (
          <button
            key={person.id}
            type="button"
            onClick={() => onConnectPerson(person)}
            className="group flex w-full items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:shadow-[0_14px_30px_rgba(146,64,14,0.11)]"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-xs font-black text-amber-800">
              {genderText(person)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-black text-stone-950">
                {person.full_name}
              </span>
              <span className="mt-0.5 block truncate text-xs font-bold text-stone-500">
                {generationText(person)}
              </span>
            </span>
            <Link2 className="size-4 shrink-0 text-stone-400 transition group-hover:text-amber-700" />
          </button>
        ))}
      </div>
    </aside>
  );
}

function TreeMemberListDialog({
  persons,
  totalCount,
  unlinkedCount,
  query,
  onQueryChange,
  filter,
  onFilterChange,
  linkedPersonIds,
  onFocusPerson,
  editMode,
  canEdit,
  onToggleEditMode,
  onClose,
}: {
  persons: Person[];
  totalCount: number;
  unlinkedCount: number;
  query: string;
  onQueryChange: (value: string) => void;
  filter: MemberFilter;
  onFilterChange: (value: MemberFilter) => void;
  linkedPersonIds: Set<string>;
  onFocusPerson: (person: Person) => void;
  editMode: TreeEditMode;
  canEdit: boolean;
  onToggleEditMode: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483646] flex justify-end bg-stone-950/32 p-3 backdrop-blur-[2px] sm:p-4"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Danh sách thành viên"
    >
      <div
        data-no-pan
        className="flex h-[calc(100dvh-24px)] w-full max-w-[460px] flex-col overflow-hidden rounded-[28px] border border-white/80 bg-[#f8faf7] shadow-[0_32px_110px_rgba(41,37,36,0.28)] sm:h-[calc(100dvh-32px)]"
        onMouseDown={(event) => event.stopPropagation()}
        onWheelCapture={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-stone-200 bg-white/88 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
              Cây gia phả
            </p>
            <h2 className="mt-1 text-lg font-black text-stone-950">
              Danh sách thành viên
            </h2>
            <p className="mt-1 text-xs font-bold text-stone-500">
              {totalCount.toLocaleString("vi-VN")} thành viên ·{" "}
              {unlinkedCount.toLocaleString("vi-VN")} chưa nối
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-950"
            aria-label="Đóng danh sách thành viên"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1">
          <TreeMemberSidebar
            persons={persons}
            totalCount={totalCount}
            unlinkedCount={unlinkedCount}
            query={query}
            onQueryChange={onQueryChange}
            filter={filter}
            onFilterChange={onFilterChange}
            linkedPersonIds={linkedPersonIds}
            onFocusPerson={onFocusPerson}
            editMode={editMode}
            canEdit={canEdit}
            onToggleEditMode={onToggleEditMode}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ReadOnlyTreeControls({
  scale,
  canExport,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFit,
  showAvatar,
  hideExpandButtons,
  autoCollapseLevel,
  hideDaughtersInLaw,
  hideSonsInLaw,
  hideDaughters,
  hideSons,
  hideMales,
  hideFemales,
  onShowAvatarChange,
  onHideExpandButtonsChange,
  onAutoCollapseLevelChange,
  onHideDaughtersInLawChange,
  onHideSonsInLawChange,
  onHideDaughtersChange,
  onHideSonsChange,
  onHideMalesChange,
  onHideFemalesChange,
}: {
  scale: number;
  canExport: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFit: () => void;
  showAvatar: boolean;
  hideExpandButtons: boolean;
  autoCollapseLevel: number;
  hideDaughtersInLaw: boolean;
  hideSonsInLaw: boolean;
  hideDaughters: boolean;
  hideSons: boolean;
  hideMales: boolean;
  hideFemales: boolean;
  onShowAvatarChange: (value: boolean) => void;
  onHideExpandButtonsChange: (value: boolean) => void;
  onAutoCollapseLevelChange: (value: number) => void;
  onHideDaughtersInLawChange: (value: boolean) => void;
  onHideSonsInLawChange: (value: boolean) => void;
  onHideDaughtersChange: (value: boolean) => void;
  onHideSonsChange: (value: boolean) => void;
  onHideMalesChange: (value: boolean) => void;
  onHideFemalesChange: (value: boolean) => void;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const iconButtonClass =
    "inline-flex size-10 items-center justify-center border border-stone-200 bg-white/88 text-stone-600 transition hover:bg-white hover:text-amber-800 disabled:cursor-not-allowed disabled:opacity-45";

  return (
    <div
      data-no-pan
      className="absolute right-5 top-5 z-[60] flex flex-wrap items-center justify-end gap-2"
      onMouseDown={(event) => event.stopPropagation()}
      onWheelCapture={(event) => event.stopPropagation()}
    >
      <div className="flex h-10 overflow-hidden rounded-full border border-stone-200 bg-white/82 shadow-sm backdrop-blur-xl">
        <button
          type="button"
          onClick={onZoomOut}
          className={iconButtonClass}
          title="Thu nhỏ"
          disabled={scale <= 0.3}
        >
          <ZoomOut className="size-4" />
        </button>
        <button
          type="button"
          onClick={onResetZoom}
          className="min-w-[56px] border-x border-stone-200 bg-white/72 px-3 text-xs font-black text-stone-600 transition hover:bg-white hover:text-amber-800"
          title="Đặt lại zoom"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          type="button"
          onClick={onZoomIn}
          className={iconButtonClass}
          title="Phóng to"
          disabled={scale >= 2}
        >
          <ZoomIn className="size-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={onFit}
        className="inline-flex size-10 items-center justify-center rounded-full border border-stone-200 bg-white/82 text-stone-600 shadow-sm backdrop-blur-xl transition hover:bg-white hover:text-amber-800 hover:shadow-md"
        title="Xem toàn bộ cây"
      >
        <Crosshair className="size-4" />
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowFilters((value) => !value)}
          className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-black shadow-sm backdrop-blur-xl transition hover:shadow-md ${
            showFilters
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-stone-200 bg-white/82 text-stone-600 hover:bg-white hover:text-stone-900"
          }`}
          aria-expanded={showFilters}
        >
          <SlidersHorizontal className="size-4" />
          <span>Hiển thị</span>
        </button>

        {showFilters && (
          <div
            data-no-pan
            className="absolute right-0 top-full z-[70] mt-2 w-64 rounded-2xl border border-stone-200 bg-white/96 p-4 shadow-[0_18px_50px_rgba(41,37,36,0.18)] backdrop-blur-xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-400">
              Hiển thị
            </p>
            <div className="mt-3 grid gap-2 text-sm font-semibold text-stone-600">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!showAvatar}
                  onChange={(event) => onShowAvatarChange(!event.target.checked)}
                  className="size-4 rounded text-amber-600 focus:ring-amber-500"
                />
                Tối giản
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hideExpandButtons}
                  onChange={(event) =>
                    onHideExpandButtonsChange(event.target.checked)
                  }
                  className="size-4 rounded text-amber-600 focus:ring-amber-500"
                />
                Ẩn nút mở rộng
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Số thế hệ tự thu</span>
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={autoCollapseLevel}
                  onChange={(event) => {
                    const value = Number.parseInt(event.target.value, 10);
                    onAutoCollapseLevelChange(Number.isFinite(value) ? value : 0);
                  }}
                  className="h-8 w-16 rounded-lg border border-stone-200 px-2 text-center text-xs font-black outline-none focus:border-amber-500"
                />
              </label>
            </div>

            <div className="mt-4 border-t border-stone-100 pt-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-400">
                Lọc dữ liệu
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm font-semibold text-stone-600">
                {[
                  ["Ẩn dâu", hideDaughtersInLaw, onHideDaughtersInLawChange],
                  ["Ẩn rể", hideSonsInLaw, onHideSonsInLawChange],
                  ["Ẩn con gái", hideDaughters, onHideDaughtersChange],
                  ["Ẩn con trai", hideSons, onHideSonsChange],
                  ["Ẩn nam", hideMales, onHideMalesChange],
                  ["Ẩn nữ", hideFemales, onHideFemalesChange],
                ].map(([label, checked, onChange]) => (
                  <label key={label as string} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked as boolean}
                      onChange={(event) =>
                        (onChange as (value: boolean) => void)(
                          event.target.checked,
                        )
                      }
                      className="size-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    {label as string}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {canExport && <ExportButton />}
    </div>
  );
}

function TreeCanvasTools({
  scale,
  canEdit,
  showAvatar,
  hideExpandButtons,
  autoCollapseLevel,
  hideDaughtersInLaw,
  hideSonsInLaw,
  hideDaughters,
  hideSons,
  hideMales,
  hideFemales,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFit,
  onCenter,
  onResetLayout,
  onExpandAll,
  onCollapseAll,
  onShowAvatarChange,
  onHideExpandButtonsChange,
  onAutoCollapseLevelChange,
  onHideDaughtersInLawChange,
  onHideSonsInLawChange,
  onHideDaughtersChange,
  onHideSonsChange,
  onHideMalesChange,
  onHideFemalesChange,
  onClose,
}: {
  scale: number;
  canEdit: boolean;
  showAvatar: boolean;
  hideExpandButtons: boolean;
  autoCollapseLevel: number;
  hideDaughtersInLaw: boolean;
  hideSonsInLaw: boolean;
  hideDaughters: boolean;
  hideSons: boolean;
  hideMales: boolean;
  hideFemales: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFit: () => void;
  onCenter: () => void;
  onResetLayout: () => void;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  onShowAvatarChange: (value: boolean) => void;
  onHideExpandButtonsChange: (value: boolean) => void;
  onAutoCollapseLevelChange: (value: number) => void;
  onHideDaughtersInLawChange: (value: boolean) => void;
  onHideSonsInLawChange: (value: boolean) => void;
  onHideDaughtersChange: (value: boolean) => void;
  onHideSonsChange: (value: boolean) => void;
  onHideMalesChange: (value: boolean) => void;
  onHideFemalesChange: (value: boolean) => void;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const resizeStateRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);
  const [panelSize, setPanelSize] = useState<{
    width: number;
    height: number | null;
  }>({ width: 292, height: null });
  const iconButtonClass =
    "inline-flex size-10 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 disabled:cursor-not-allowed disabled:opacity-40";

  useEffect(() => {
    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));

    const handlePointerMove = (event: PointerEvent) => {
      const state = resizeStateRef.current;
      if (!state) return;
      event.preventDefault();

      setPanelSize({
        width: clamp(
          state.startWidth + (state.startX - event.clientX),
          260,
          Math.max(260, window.innerWidth - 32),
        ),
        height: clamp(
          state.startHeight + (event.clientY - state.startY),
          230,
          Math.max(230, window.innerHeight - 120),
        ),
      });
    };

    const handlePointerUp = () => {
      resizeStateRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);

  const startPanelResize = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;

    resizeStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
    };
    document.body.style.cursor = "nesw-resize";
    document.body.style.userSelect = "none";
  };

  return (
    <div
      ref={panelRef}
      data-no-pan
      className="absolute bottom-5 right-5 z-[130] min-h-[230px] min-w-[260px] max-w-[calc(100vw-2rem)] overflow-auto rounded-[24px] border border-white/80 bg-[#fffdf9]/95 p-3 shadow-[0_22px_64px_rgba(41,37,36,0.18)] backdrop-blur-xl [max-height:calc(100dvh-140px)]"
      style={{
        width: panelSize.width,
        height: panelSize.height ?? undefined,
      }}
      onMouseDown={(event) => event.stopPropagation()}
      onWheelCapture={(event) => event.stopPropagation()}
    >
      <div className="flex items-center gap-2">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-stone-950 text-white shadow-sm">
          <SlidersHorizontal className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-stone-950">
            Công cụ hiển thị
          </p>
          <p className="mt-0.5 text-xs font-bold text-stone-500">
            {Math.round(scale * 100)}% · điều hướng
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-500 transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
          title="Ẩn bảng công cụ"
          aria-label="Ẩn bảng công cụ"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onZoomOut}
          className={iconButtonClass}
          title="Thu nhỏ"
          disabled={scale <= 0.3}
        >
          <ZoomOut className="size-4" />
        </button>
        <button
          type="button"
          onClick={onZoomIn}
          className={iconButtonClass}
          title="Phóng to"
          disabled={scale >= 2}
        >
          <ZoomIn className="size-4" />
        </button>
        <button
          type="button"
          onClick={onResetZoom}
          className={iconButtonClass}
          title="Đặt lại zoom"
        >
          <RotateCcw className="size-4" />
        </button>
        <button
          type="button"
          onClick={onFit}
          className={iconButtonClass}
          title="Xem toàn bộ cây"
        >
          <Maximize2 className="size-4" />
        </button>
        <button
          type="button"
          onClick={onCenter}
          className={iconButtonClass}
          title="Căn giữa"
        >
          <Crosshair className="size-4" />
        </button>
        <button
          type="button"
          onClick={onResetLayout}
          className={iconButtonClass}
          title="Xếp lại vị trí"
        >
          <MousePointer2 className="size-4" />
        </button>
      </div>

      {(onExpandAll || onCollapseAll) && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {onCollapseAll && (
            <button
              type="button"
              onClick={onCollapseAll}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-2 text-xs font-bold text-stone-700 transition hover:bg-stone-50"
              title="Thu gọn các nhánh đời sau"
            >
              <ChevronsDownUp className="size-3.5" />
              <span>Thu gọn</span>
            </button>
          )}
          {onExpandAll && (
            <button
              type="button"
              onClick={onExpandAll}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-2 text-xs font-bold text-stone-700 transition hover:bg-stone-50"
              title="Mở rộng toàn bộ cây"
            >
              <ChevronsUpDown className="size-3.5" />
              <span>Mở rộng tất cả</span>
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="mt-3 inline-flex min-h-10 w-full items-center justify-between rounded-2xl border border-stone-200 bg-white px-3 text-xs font-black text-stone-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal className="size-4" />
          Bộ lọc và xuất file
        </span>
        {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
      </button>

      {open && (
        <div className="mt-2 rounded-[20px] border border-stone-200 bg-white/78 p-3 shadow-inner">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-stone-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!showAvatar}
                onChange={(event) => onShowAvatarChange(!event.target.checked)}
                className="size-4 rounded text-amber-600 focus:ring-amber-500"
              />
              Tối giản
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hideExpandButtons}
                onChange={(event) =>
                  onHideExpandButtonsChange(event.target.checked)
                }
                className="size-4 rounded text-amber-600 focus:ring-amber-500"
              />
              Ẩn nút mở
            </label>
            <label className="col-span-2 flex items-center justify-between gap-2">
              <span>Số thế hệ tự thu</span>
              <input
                type="number"
                min={0}
                max={99}
                value={autoCollapseLevel}
                onChange={(event) => {
                  const value = Number.parseInt(event.target.value, 10);
                  onAutoCollapseLevelChange(Number.isFinite(value) ? value : 0);
                }}
                className="h-8 w-16 rounded-lg border border-stone-200 bg-white px-2 text-center text-xs font-black outline-none focus:border-amber-500"
              />
            </label>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-stone-200 pt-3 text-xs font-bold text-stone-700">
            {[
              ["Ẩn dâu", hideDaughtersInLaw, onHideDaughtersInLawChange],
              ["Ẩn rể", hideSonsInLaw, onHideSonsInLawChange],
              ["Ẩn con gái", hideDaughters, onHideDaughtersChange],
              ["Ẩn con trai", hideSons, onHideSonsChange],
              ["Ẩn nam", hideMales, onHideMalesChange],
              ["Ẩn nữ", hideFemales, onHideFemalesChange],
            ].map(([label, checked, onChange]) => (
              <label key={label as string} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked as boolean}
                  onChange={(event) =>
                    (onChange as (value: boolean) => void)(event.target.checked)
                  }
                  className="size-4 rounded text-amber-600 focus:ring-amber-500"
                />
              {label as string}
              </label>
            ))}
          </div>

          {canEdit && (
            <div className="mt-3 border-t border-stone-200 pt-3">
              <ExportButton />
            </div>
          )}
        </div>
      )}
      <button
        type="button"
        className="absolute bottom-1.5 right-1.5 grid size-8 cursor-nesw-resize place-items-end rounded-br-[20px] rounded-tl-xl text-stone-400 transition hover:bg-amber-50 hover:text-amber-700"
        onPointerDown={startPanelResize}
        onMouseDown={(event) => event.stopPropagation()}
        title="Kéo để đổi kích thước"
        aria-label="Kéo để đổi kích thước bảng công cụ"
      >
        <span className="mb-1 mr-1 block size-3 rounded-br-[8px] border-b-2 border-r-2 border-current" />
      </button>
    </div>
  );
}

function TreeMemberSidebar({
  persons,
  totalCount,
  unlinkedCount,
  query,
  onQueryChange,
  filter,
  onFilterChange,
  linkedPersonIds,
  onFocusPerson,
  editMode,
  canEdit,
  onToggleEditMode,
}: {
  persons: Person[];
  totalCount: number;
  unlinkedCount: number;
  query: string;
  onQueryChange: (value: string) => void;
  filter: MemberFilter;
  onFilterChange: (value: MemberFilter) => void;
  linkedPersonIds: Set<string>;
  onFocusPerson: (person: Person) => void;
  editMode: TreeEditMode;
  canEdit: boolean;
  onToggleEditMode: () => void;
}) {
  return (
    <aside
      data-no-pan
      className="flex h-full min-h-0 shrink-0 flex-col overflow-hidden bg-transparent p-4"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="rounded-[22px] border border-stone-200 bg-white/92 p-3 shadow-[0_14px_34px_rgba(41,37,36,0.07)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
              Bộ lọc
            </p>
            <p className="mt-0.5 text-sm font-black text-stone-950">
              {totalCount.toLocaleString("vi-VN")} người ·{" "}
              {unlinkedCount.toLocaleString("vi-VN")} chưa nối
            </p>
          </div>
          {canEdit && (
            <button
              type="button"
              onClick={onToggleEditMode}
              className={`inline-flex min-h-9 items-center gap-2 rounded-2xl border px-3 text-xs font-black transition ${
                editMode === "edit"
                  ? "border-stone-900 bg-stone-900 text-white shadow-sm"
                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
              }`}
            >
              {editMode === "edit" ? (
                <Lock className="size-3.5" />
              ) : (
                <Eye className="size-3.5" />
              )}
              {editMode === "edit" ? "Sửa" : "Xem"}
            </button>
          )}
        </div>

        <label className="relative mt-3 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Tìm thành viên..."
            className="min-h-11 w-full rounded-xl border border-stone-200 bg-[#fffdf9] pl-10 pr-3 text-sm font-semibold text-stone-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </label>

        <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-stone-100 p-1">
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            className={`min-h-9 rounded-lg px-3 text-sm font-black transition ${
              filter === "all"
                ? "bg-stone-950 text-white shadow-sm"
                : "text-stone-600 hover:bg-white/70"
            }`}
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("unlinked")}
            className={`min-h-9 rounded-lg px-3 text-sm font-black transition ${
              filter === "unlinked"
                ? "bg-amber-700 text-white shadow-sm"
                : "text-stone-600 hover:bg-white/70"
            }`}
          >
            Chưa nối
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-1 text-xs font-black uppercase tracking-[0.14em] text-stone-500">
        <span>Danh sách</span>
        <span>{persons.length.toLocaleString("vi-VN")}</span>
      </div>

      <div
        className="mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1 [scrollbar-color:#a8a29e_transparent] [scrollbar-width:thin]"
        onWheelCapture={(event) => event.stopPropagation()}
      >
        {persons.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 bg-white p-4 text-center text-sm font-semibold text-stone-500">
            Không có thành viên phù hợp.
          </div>
        ) : (
          persons.map((person) => {
            const isLinked = linkedPersonIds.has(person.id);
            const genderTone =
              person.gender === "male"
                ? "border-sky-200 bg-sky-50 text-sky-700"
                : person.gender === "female"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-stone-200 bg-stone-50 text-stone-700";
            return (
              <button
                key={person.id}
                type="button"
                onClick={() => onFocusPerson(person)}
                className={`relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-[0_14px_30px_rgba(146,64,14,0.11)] ${
                  isLinked ? "border-emerald-200" : "border-stone-200"
                }`}
              >
                <span
                  className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${
                    isLinked ? "bg-emerald-500" : "bg-amber-400"
                  }`}
                />
                <span
                  className={`inline-flex size-11 shrink-0 items-center justify-center rounded-lg border text-xs font-black ${genderTone}`}
                >
                  {genderText(person)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black text-stone-950">
                    {person.full_name}
                  </span>
                  <span className="mt-0.5 block truncate text-xs font-bold text-stone-500">
                    {generationText(person)}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${
                    isLinked
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                  title={isLinked ? "Đã có quan hệ" : "Chưa nối quan hệ"}
                >
                  {isLinked ? "Đã nối" : "Chưa nối"}
                </span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}

function ViewTreePlane({
  branchRoots,
  renderBranch,
}: {
  branchRoots: Person[];
  renderBranch: (root: Person) => React.ReactNode;
}) {
  return (
    <div className="flex min-h-[620px] w-full items-start justify-center px-10 pb-24 pt-8">
      <div className="flex w-max min-w-[min(100%,960px)] flex-wrap items-start justify-center gap-x-16 gap-y-20">
        {branchRoots.map((root) => (
          <div key={root.id} className="min-w-max">
            {renderBranch(root)}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyTreeView({
  canEnterEdit,
  onEnterEdit,
}: {
  canEnterEdit: boolean;
  onEnterEdit: () => void;
}) {
  return (
    <div className="flex min-h-[620px] w-full items-center justify-center px-6 pb-24 pt-28">
      <div className="max-w-md rounded-[28px] border border-dashed border-amber-300 bg-white/92 p-6 text-center shadow-[0_22px_54px_rgba(41,37,36,0.12)]">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <Link2 className="size-5" />
        </div>
        <h3 className="mt-4 text-lg font-black text-stone-950">
          Cây chưa có quan hệ để hiển thị
        </h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-stone-500">
          Các thành viên chưa nối đang nằm ở danh sách bên phải. Vào chế độ nối
          để tạo nhánh gia phả đầu tiên.
        </p>
        {canEnterEdit && (
          <button
            type="button"
            onClick={onEnterEdit}
            className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-stone-950 px-5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-800"
          >
            <Link2 className="size-4" />
            Mở chế độ nối
          </button>
        )}
      </div>
    </div>
  );
}

function IntegratedTreePlane({
  branchRoots,
  standalonePersons,
  positions,
  canEdit,
  scale,
  onMovePerson,
  onDragFrame,
  renderBranch,
  renderStandalonePersonCard,
}: {
  branchRoots: Person[];
  standalonePersons: Person[];
  positions: PoolPositions;
  canEdit: boolean;
  scale: number;
  onMovePerson: (personId: string, position: PoolPosition) => void;
  onDragFrame: (event: PointerEvent) => void;
  renderBranch: (root: Person) => React.ReactNode;
  renderStandalonePersonCard: (person: Person) => React.ReactNode;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const suppressClickPersonIdRef = useRef<string | null>(null);
  const dragMovedPersonIdRef = useRef<string | null>(null);
  const [dragging, setDragging] = useState<{
    personId: string;
    offsetX: number;
    offsetY: number;
    startClientX: number;
    startClientY: number;
    moved: boolean;
  } | null>(null);

  const totalItemCount = branchRoots.length + standalonePersons.length;
  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = layerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const normalizedScale = Math.max(scale || 1, 0.2);
      const hasMoved =
        dragging.moved ||
        Math.hypot(
          event.clientX - dragging.startClientX,
          event.clientY - dragging.startClientY,
        ) > 5;
      if (!hasMoved) return;

      dragMovedPersonIdRef.current = dragging.personId;
      onDragFrame(event);
      onMovePerson(dragging.personId, {
        x: (event.clientX - rect.left) / normalizedScale - dragging.offsetX,
        y: (event.clientY - rect.top) / normalizedScale - dragging.offsetY,
      });
      if (!dragging.moved) {
        setDragging((current) =>
          current?.personId === dragging.personId
            ? { ...current, moved: true }
            : current,
        );
      }
    };

    const handlePointerUp = () => {
      if (dragMovedPersonIdRef.current === dragging.personId) {
        suppressClickPersonIdRef.current = dragging.personId;
        window.setTimeout(() => {
          if (suppressClickPersonIdRef.current === dragging.personId) {
            suppressClickPersonIdRef.current = null;
          }
        }, 0);
      }
      dragMovedPersonIdRef.current = null;
      setDragging(null);
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging, onDragFrame, onMovePerson, scale]);

  if (totalItemCount === 0) {
    return null;
  }

  const startPositionDrag = (
    event: React.PointerEvent<HTMLDivElement>,
    personId: string,
    position: PoolPosition,
  ) => {
    if (!canEdit) return;
    const target = event.target as HTMLElement;
    if (
      target.closest(
        "a,input,select,textarea,[data-no-position-drag]",
      )
    ) {
      return;
    }
    const rect = layerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const normalizedScale = Math.max(scale || 1, 0.2);
    event.stopPropagation();
    dragMovedPersonIdRef.current = null;
    setDragging({
      personId,
      offsetX: (event.clientX - rect.left) / normalizedScale - position.x,
      offsetY: (event.clientY - rect.top) / normalizedScale - position.y,
      startClientX: event.clientX,
      startClientY: event.clientY,
      moved: false,
    });
  };

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 z-20">
      {branchRoots.map((root, index) => {
        const position =
          positions[root.id] ?? {
            x: 120 + (index % 3) * 430,
            y: 144 + Math.floor(index / 3) * 390,
          };
        return (
          <div
            key={`branch-${root.id}`}
            className={`pointer-events-auto absolute select-none ${
              canEdit ? "cursor-move" : "cursor-default"
            } ${dragging?.personId === root.id ? "z-50" : "z-20"}`}
            style={{ left: position.x, top: position.y }}
            onMouseDown={(event) => {
              if (canEdit) event.stopPropagation();
            }}
            onClickCapture={(event) => {
              if (suppressClickPersonIdRef.current === root.id) {
                event.preventDefault();
                event.stopPropagation();
                suppressClickPersonIdRef.current = null;
              }
            }}
            onPointerDown={(event) =>
              startPositionDrag(event, root.id, position)
            }
          >
            {renderBranch(root)}
          </div>
        );
      })}

      {standalonePersons.map((person, index) => {
        const position =
          positions[person.id] ?? {
            x: 120 + (index % 6) * 148,
            y: 620 + Math.ceil(Math.max(branchRoots.length, 1) / 3) * 390,
          };
        return (
          <div
            key={`standalone-${person.id}`}
            className={`pointer-events-auto absolute w-[124px] select-none ${
              canEdit ? "cursor-move" : "cursor-default"
            } ${dragging?.personId === person.id ? "z-50" : "z-30"}`}
            style={{ left: position.x, top: position.y }}
            onMouseDown={(event) => {
              if (canEdit) event.stopPropagation();
            }}
            onClickCapture={(event) => {
              if (suppressClickPersonIdRef.current === person.id) {
                event.preventDefault();
                event.stopPropagation();
                suppressClickPersonIdRef.current = null;
              }
            }}
            onPointerDown={(event) =>
              startPositionDrag(event, person.id, position)
            }
          >
            {renderStandalonePersonCard(person)}
          </div>
        );
      })}
    </div>
  );
}

function TreeMiniMap({
  state,
  onJump,
}: {
  state: MiniMapState | null;
  onJump: (xRatio: number, yRatio: number) => void;
}) {
  if (!state || state.viewportWidth <= 0 || state.viewportHeight <= 0) {
    return null;
  }

  const mapWidth = 168;
  const mapHeight = 104;
  const ratio = Math.min(
    mapWidth / state.contentWidth,
    mapHeight / state.contentHeight,
  );
  const contentWidth = Math.max(state.contentWidth * ratio, 28);
  const contentHeight = Math.max(state.contentHeight * ratio, 28);
  const viewportWidth = Math.max(
    Math.min(state.viewportWidth * ratio, contentWidth),
    18,
  );
  const viewportHeight = Math.max(
    Math.min(state.viewportHeight * ratio, contentHeight),
    18,
  );
  const viewportLeft = Math.min(
    Math.max(state.scrollLeft * ratio, 0),
    Math.max(contentWidth - viewportWidth, 0),
  );
  const viewportTop = Math.min(
    Math.max(state.scrollTop * ratio, 0),
    Math.max(contentHeight - viewportHeight, 0),
  );
  const offsetX = (mapWidth - contentWidth) / 2;
  const offsetY = (mapHeight - contentHeight) / 2;

  return (
    <button
      type="button"
      data-no-pan
      className="absolute bottom-4 left-4 z-40 rounded-[20px] border border-white/80 bg-[#fffdf9]/94 p-2 text-left shadow-[0_16px_48px_rgba(41,37,36,0.15)] backdrop-blur-xl transition hover:border-amber-300 hover:shadow-xl"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onJump(
          (event.clientX - rect.left) / rect.width,
          (event.clientY - rect.top) / rect.height,
        );
      }}
      title="Bấm để di chuyển nhanh trong sơ đồ"
      aria-label="Mini map sơ đồ cây"
    >
      <div className="mb-1 flex items-center justify-between gap-3 px-1">
        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-500">
          Bản đồ
        </span>
        <span className="text-[10px] font-black text-emerald-700">
          {state.nodes.filter((node) => node.linked).length}/
          {state.nodes.length}
        </span>
      </div>
      <div
        className="relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-100"
        style={{ width: mapWidth, height: mapHeight }}
      >
        <div
          className="absolute rounded-xl bg-white/75"
          style={{
            width: contentWidth,
            height: contentHeight,
            left: offsetX,
            top: offsetY,
          }}
        />
        <svg className="absolute inset-0 size-full" aria-hidden="true">
          {state.connections.map((connection) => (
            <line
              key={connection.id}
              x1={offsetX + connection.x1 * ratio}
              y1={offsetY + connection.y1 * ratio}
              x2={offsetX + connection.x2 * ratio}
              y2={offsetY + connection.y2 * ratio}
              stroke="#047857"
              strokeOpacity="0.38"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          ))}
        </svg>
        {state.nodes.map((node) => (
          <span
            key={node.id}
            className={`absolute rounded-[3px] border ${
              node.linked
                ? "border-emerald-700 bg-emerald-500 shadow-[0_0_0_1px_rgba(4,120,87,0.16)]"
                : "border-stone-300 bg-stone-300/65"
            }`}
            style={{
              left: offsetX + node.x * ratio,
              top: offsetY + node.y * ratio,
              width: Math.max(node.width * ratio, node.linked ? 5 : 4),
              height: Math.max(node.height * ratio, node.linked ? 5 : 4),
              opacity: node.linked ? 0.92 : 0.48,
            }}
          />
        ))}
        <div
          className="absolute rounded-lg border-2 border-amber-700 bg-amber-100/22"
          style={{
            width: viewportWidth,
            height: viewportHeight,
            left: offsetX + viewportLeft,
            top: offsetY + viewportTop,
          }}
        />
      </div>
    </button>
  );
}

function RelationshipStatusToast({
  status,
  onDismiss,
}: {
  status: { type: "success" | "error"; message: string };
  onDismiss: () => void;
}) {
  return (
    <div
      className={`absolute left-4 right-4 top-4 z-[120] mx-auto flex max-w-2xl items-start gap-2 rounded-xl border px-4 py-3 text-sm font-bold shadow-lg ${
        status.type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
      role="status"
    >
      {status.type === "success" ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      ) : (
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      )}
      <span className="min-w-0 flex-1">{status.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="text-current/70 transition hover:text-current"
        aria-label="Đóng thông báo"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function RelationshipConflictModal({
  conflict,
  saving,
  onLinkCoParents,
  onSaveOnly,
  onCancel,
}: {
  conflict: RelationshipConflictContext;
  saving: boolean;
  onLinkCoParents: () => void;
  onSaveOnly: () => void;
  onCancel: () => void;
}) {
  const [previewMode, setPreviewMode] = useState<
    "current" | "link" | "only"
  >("current");

  if (typeof document === "undefined") return null;

  const childName = conflict.target.full_name;
  const sourceRole = parentRoleText(conflict.source);
  const sourceSentence = `${conflict.source.full_name} là ${sourceRole} của ${childName}`;
  const existingParentLabels = conflict.existingParents.map((parent) => ({
    person: parent,
    role: parentRoleText(parent),
  }));
  const existingSummary = existingParentLabels
    .map(({ person, role }) => `${person.full_name} (${role})`)
    .join(", ");
  const title =
    previewMode === "link"
      ? "Nếu gộp cha/mẹ thành vợ chồng"
      : previewMode === "only"
        ? `Nếu chỉ thêm ${sourceRole}`
        : "Quan hệ hiện tại";

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-stone-950/64 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Xử lý quan hệ chưa rõ"
    >
      <div className="flex max-h-[calc(100dvh-32px)] w-full max-w-5xl flex-col overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_34px_120px_rgba(20,16,12,0.42)]">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-amber-200 bg-gradient-to-r from-amber-50 via-white to-stone-50 px-5 py-4">
          <div className="flex min-w-0 gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <AlertTriangle className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">
                Cần chọn cách gộp nhánh
              </p>
              <h3 className="mt-1 text-xl font-black text-stone-950">
                {childName} sắp có thêm {sourceRole}
              </h3>
              <p className="mt-1 text-sm font-bold text-stone-600">
                {sourceSentence}. Hiện có: {existingSummary}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-white text-stone-500 transition hover:bg-amber-100 hover:text-stone-900 disabled:opacity-60"
            aria-label="Đóng"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <RelationshipConflictPreview
            conflict={conflict}
            mode={previewMode}
            title={title}
          />

          <div className="flex min-h-0 flex-col gap-3">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-black leading-5 text-amber-800">
              Cần làm rõ: {conflict.source.full_name} và {existingSummary} có
              phải là vợ/chồng cùng nuôi {childName} không?
            </div>

            {conflict.sameGenderParents.length > 0 && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-black leading-5 text-red-700">
                {childName} sẽ có nhiều {sourceRole}:{" "}
                {conflict.sameGenderParents
                  .map(
                    (parent) =>
                      `${parent.full_name} (${parentRoleText(parent)})`,
                  )
                  .join(", ")}
                .
              </div>
            )}

            <button
              type="button"
              onClick={onLinkCoParents}
              onMouseEnter={() => setPreviewMode("link")}
              onFocus={() => setPreviewMode("link")}
              onMouseLeave={() => setPreviewMode("current")}
              onBlur={() => setPreviewMode("current")}
              disabled={saving}
              className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 disabled:opacity-60 ${
                previewMode === "link"
                  ? "border-emerald-400 bg-emerald-50 shadow-[0_14px_34px_rgba(4,120,87,0.14)]"
                  : "border-emerald-200 bg-white hover:bg-emerald-50"
              }`}
            >
              <span className="block text-sm font-black text-emerald-800">
                Gộp cha/mẹ thành vợ chồng
              </span>
              <span className="mt-1 block text-xs font-bold leading-5 text-emerald-700">
                Tạo dây vợ/chồng giữa {conflict.source.full_name} và{" "}
                {existingSummary}.
              </span>
            </button>
            <button
              type="button"
              onClick={onSaveOnly}
              onMouseEnter={() => setPreviewMode("only")}
              onFocus={() => setPreviewMode("only")}
              onMouseLeave={() => setPreviewMode("current")}
              onBlur={() => setPreviewMode("current")}
              disabled={saving}
              className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 disabled:opacity-60 ${
                previewMode === "only"
                  ? "border-stone-500 bg-stone-50 shadow-[0_14px_34px_rgba(41,37,36,0.12)]"
                  : "border-stone-200 bg-white hover:bg-stone-50"
              }`}
            >
              <span className="block text-sm font-black text-stone-900">
                Chỉ thêm {sourceRole} cho {childName}
              </span>
              <span className="mt-1 block text-xs font-bold leading-5 text-stone-600">
                Không tạo dây vợ/chồng.
              </span>
            </button>

            <div className="mt-auto flex flex-col gap-2 border-t border-stone-100 pt-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-black text-stone-700 transition hover:bg-stone-50 disabled:opacity-60"
              >
                Quay lại chỉnh quan hệ
              </button>
              {saving && (
                <span className="inline-flex min-h-9 items-center justify-center gap-2 text-sm font-black text-amber-700">
                  <Loader2 className="size-4 animate-spin" />
                  Đang cập nhật cây
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function RelationshipConflictPreview({
  conflict,
  mode,
  title,
}: {
  conflict: RelationshipConflictContext;
  mode: "current" | "link" | "only";
  title: string;
}) {
  const sourceRole = parentRoleText(conflict.source);
  const parentNodes =
    mode === "current"
      ? conflict.existingParents
      : [conflict.source, ...conflict.existingParents];
  const floatingSource = mode === "current";

  return (
    <section className="rounded-2xl border border-stone-200 bg-[#fbfaf7] p-3 shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-400">
            Sơ đồ gần nhất
          </p>
          <h4 className="mt-1 text-base font-black text-stone-950">{title}</h4>
        </div>
        {mode === "current" && (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">
            {conflict.source.full_name} chưa nối
          </span>
        )}
        {mode === "link" && (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">
            Có quan hệ vợ/chồng
          </span>
        )}
        {mode === "only" && (
          <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-black text-stone-700">
            Không tạo vợ/chồng
          </span>
        )}
      </div>

      <div className="mt-3 overflow-x-auto rounded-xl border border-stone-200 bg-white p-3">
        <div className="mx-auto min-w-[500px] max-w-2xl">
          <div className="flex items-start justify-center gap-3">
            {parentNodes.map((parent, index) => (
              <React.Fragment key={parent.id}>
                {mode === "link" && index > 0 && (
                  <div className="mt-8 flex min-w-14 items-center justify-center">
                    <span className="h-px flex-1 bg-rose-200" />
                    <span className="mx-1 rounded-full border border-rose-100 bg-rose-50 px-2 py-0.5 text-[10px] font-black text-rose-700">
                      Vợ/chồng
                    </span>
                    <span className="h-px flex-1 bg-rose-200" />
                  </div>
                )}
                <MiniRelationPersonCard
                  person={parent}
                  role={parentRoleText(parent)}
                  active={parent.id === conflict.source.id}
                  dashed={false}
                />
              </React.Fragment>
            ))}
          </div>

          <div className="relative mx-auto h-8 max-w-sm">
            <div
              className={`absolute left-[16%] right-[16%] top-3 h-px ${
                mode === "only"
                  ? "border-t border-dashed border-stone-300"
                  : "bg-amber-200"
              }`}
            />
            <div
              className={`absolute left-1/2 top-3 h-7 w-px -translate-x-1/2 ${
                mode === "only"
                  ? "border-l border-dashed border-stone-300"
                  : "bg-amber-200"
              }`}
            />
          </div>

          <div className="flex justify-center">
            <MiniRelationPersonCard
              person={conflict.target}
              role="con"
              active={false}
              dashed={false}
            />
          </div>

          {floatingSource && (
            <div className="mt-3 flex justify-center">
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 px-3 py-1.5">
                <MiniRelationPersonCard
                  person={conflict.source}
                  role={`đang thêm: ${sourceRole}`}
                  active
                  dashed
                  compact
                />
                <span className="text-xs font-black text-emerald-700">
                  Kéo vào cây
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MiniRelationPersonCard({
  person,
  role,
  active,
  dashed,
  compact = false,
}: {
  person: Person;
  role: string;
  active: boolean;
  dashed: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`min-w-[128px] rounded-xl border bg-white px-3 py-2 text-center shadow-sm ${
        active
          ? "border-emerald-300 bg-emerald-50"
          : dashed
            ? "border-dashed border-stone-300"
            : "border-stone-200"
      } ${compact ? "min-w-[150px]" : ""}`}
    >
      <p className="truncate text-sm font-black text-stone-950">
        {person.full_name}
      </p>
      <p
        className={`mt-1 text-[11px] font-black uppercase ${
          active ? "text-emerald-700" : "text-stone-500"
        }`}
      >
        {role}
      </p>
    </div>
  );
}

function RelationshipDraftPanel({
  source,
  target,
  coParent,
  relationshipType,
  relationshipNote,
  saving,
  deleting,
  onTypeChange,
  onNoteChange,
  onSwap,
  onCancel,
  onSave,
  onDelete,
}: {
  source?: Person;
  target?: Person;
  coParent: Person | null;
  relationshipType: RelationshipType;
  relationshipNote: string;
  saving: boolean;
  deleting: boolean;
  onTypeChange: (value: RelationshipType) => void;
  onNoteChange: (value: string) => void;
  onSwap: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete?: () => void;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Xác nhận mối quan hệ"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_34px_120px_rgba(20,16,12,0.42)]">
        <header className="flex items-start justify-between gap-4 border-b border-stone-200 bg-stone-950 px-5 py-4 text-white">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
              Xác định quan hệ
            </p>
            <h3 className="mt-1 text-xl font-black">
              {onDelete ? "Chỉnh sửa quan hệ" : "Quan hệ vừa kéo"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving || deleting}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10 disabled:opacity-60"
            aria-label="Đóng"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="space-y-4 p-5">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-base font-black text-stone-950">
              {relationshipSentence(source, target, relationshipType)}
            </p>
            {relationshipType !== "marriage" && (
              <button
                type="button"
                onClick={onSwap}
                disabled={saving || deleting}
                className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-full border border-amber-200 bg-white px-3 text-xs font-black text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
              >
                <ArrowLeftRight className="size-3.5" />
                Đảo chiều quan hệ
              </button>
            )}
          </div>

          {coParent && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-800">
              Hệ thống phát hiện {source?.full_name} đang có vợ/chồng là{" "}
              {coParent.full_name}. Khi lưu, hệ thống sẽ tự nối thêm{" "}
              {coParent.full_name} làm cha/mẹ còn lại của {target?.full_name}.
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-stone-500">
                Loại quan hệ
              </span>
              <select
                value={relationshipType}
                onChange={(event) =>
                  onTypeChange(event.target.value as RelationshipType)
                }
                className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm font-black text-stone-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              >
                {relationshipModes.map((mode) => (
                  <option key={mode.type} value={mode.type}>
                    {mode.label || relationshipTypeLabel(mode.type)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-stone-500">
                Ghi chú
              </span>
              <input
                type="text"
                value={relationshipNote}
                onChange={(event) => onNoteChange(event.target.value)}
                placeholder="Ví dụ: vợ cả, con nuôi..."
                className="min-h-11 w-full rounded-lg border border-stone-300 px-3 text-sm font-semibold outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving || deleting}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-stone-300 bg-white px-4 text-sm font-black text-stone-700 transition hover:bg-stone-50 disabled:opacity-60"
            >
              Hủy
            </button>
            <div className="flex flex-1 flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={saving || deleting}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                >
                  {deleting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  Xóa quan hệ
                </button>
              )}
              <button
                type="button"
                onClick={onSave}
                disabled={saving || deleting}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-amber-700 px-5 text-sm font-black text-white transition hover:bg-amber-800 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                {onDelete ? "Lưu thay đổi" : "Lưu quan hệ"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function TreeWorkspaceModal({
  title,
  description,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-end justify-center bg-stone-950/55 p-3 backdrop-blur-sm sm:items-center sm:p-5"
      style={{ zIndex: 2147483647 }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`flex max-h-[calc(100dvh-24px)] w-full flex-col overflow-hidden rounded-2xl border border-white/70 bg-stone-50 shadow-[0_30px_110px_rgba(20,16,12,0.38)] sm:max-h-[calc(100dvh-40px)] ${
          wide ? "max-w-[1320px]" : "max-w-3xl"
        }`}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-stone-200 bg-white px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-black text-stone-950">{title}</h2>
            <p className="mt-1 max-w-3xl text-sm font-medium leading-6 text-stone-500">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition hover:bg-stone-50 hover:text-stone-900"
            aria-label="Đóng"
          >
            <X className="size-5" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
