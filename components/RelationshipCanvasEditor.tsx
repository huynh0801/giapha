"use client";

import {
  createOrUpdateRelationshipAction,
  deleteRelationshipAction,
} from "@/app/actions/genealogy";
import type { Person, Relationship, RelationshipType } from "@/types";
import { formatDisplayDate } from "@/utils/dateHelpers";
import { normalizeText } from "@/utils/excelImport/detectColumns";
import { relationshipTypeLabel } from "@/utils/treeHelpers";
import { getCanvasDataAction } from "@/app/actions/genealogy";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Panel,
  Position,
  ReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import {
  AlertTriangle,
  Baby,
  CheckCircle2,
  GitBranch,
  HeartHandshake,
  Link2,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

type RelationshipMode = RelationshipType;

interface PersonNodeData {
  [key: string]: unknown;
  person: Person;
  muted: boolean;
  selected: boolean;
  parentCount: number;
  childCount: number;
  spouseCount: number;
}

type PersonNode = Node<PersonNodeData, "personNode">;
type RelationshipEdge = Edge<{ relationship: Relationship }>;

const fourSideHandles = [
  {
    position: Position.Top,
    sourceStyle: { left: "calc(50% - 8px)" },
    targetStyle: { left: "calc(50% + 8px)" },
  },
  {
    position: Position.Right,
    sourceStyle: { top: "calc(50% - 8px)" },
    targetStyle: { top: "calc(50% + 8px)" },
  },
  {
    position: Position.Bottom,
    sourceStyle: { left: "calc(50% - 8px)" },
    targetStyle: { left: "calc(50% + 8px)" },
  },
  {
    position: Position.Left,
    sourceStyle: { top: "calc(50% - 8px)" },
    targetStyle: { top: "calc(50% + 8px)" },
  },
];

const relationModes: Array<{
  type: RelationshipMode;
  label: string;
  icon: typeof GitBranch;
  tone: string;
}> = [
  {
    type: "biological_child",
    label: "Cha/mẹ -> Con",
    icon: GitBranch,
    tone: "border-amber-300 bg-amber-50 text-amber-900",
  },
  {
    type: "marriage",
    label: "Vợ/chồng",
    icon: HeartHandshake,
    tone: "border-rose-300 bg-rose-50 text-rose-900",
  },
  {
    type: "adopted_child",
    label: "Nhận nuôi",
    icon: Baby,
    tone: "border-sky-300 bg-sky-50 text-sky-900",
  },
  {
    type: "step_child",
    label: "Con riêng",
    icon: GitBranch,
    tone: "border-violet-300 bg-violet-50 text-violet-900",
  },
  {
    type: "foster_child",
    label: "Con được nuôi",
    icon: Baby,
    tone: "border-teal-300 bg-teal-50 text-teal-900",
  },
];

function genderTone(gender: Person["gender"]) {
  if (gender === "male") return "border-sky-200 bg-sky-50 text-sky-900";
  if (gender === "female") return "border-rose-200 bg-rose-50 text-rose-900";
  return "border-stone-200 bg-stone-50 text-stone-800";
}

function parentLabel(person: Person) {
  if (person.gender === "male") return "cha";
  if (person.gender === "female") return "mẹ";
  return "cha/mẹ";
}

function relationSentence(
  source: Person | undefined,
  target: Person | undefined,
  type: RelationshipMode,
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
  return `${source.full_name} là ${parentLabel(source)} của ${target.full_name}.`;
}

function PersonRelationNode({ data }: NodeProps<PersonNode>) {
  const person = data.person;
  return (
    <div
      className={`min-h-[112px] w-[218px] rounded-lg border bg-white px-3 py-3 shadow-sm transition ${
        data.selected ? "ring-2 ring-amber-500 ring-offset-2" : ""
      } ${data.muted ? "opacity-35" : "opacity-100"}`}
    >
      {fourSideHandles.map((handle) => (
        <Fragment key={handle.position}>
          <Handle
            id={`source-${handle.position}`}
            type="source"
            position={handle.position}
            style={handle.sourceStyle}
            className="!size-3 !border-2 !border-white !bg-amber-600"
          />
          <Handle
            id={`target-${handle.position}`}
            type="target"
            position={handle.position}
            style={handle.targetStyle}
            className="!size-3 !border-2 !border-white !bg-stone-700"
          />
        </Fragment>
      ))}

      <div className="flex items-start gap-2">
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-md border text-xs font-black ${genderTone(
            person.gender,
          )}`}
        >
          {person.gender === "male" ? "Nam" : person.gender === "female" ? "Nữ" : "Khác"}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-stone-900">
            {person.full_name}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-stone-500">
            {formatDisplayDate(person.birth_year, person.birth_month, person.birth_day) ||
              "Chưa rõ năm sinh"}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[10px] font-bold uppercase text-stone-500">
        <div className="rounded bg-stone-50 px-1 py-1">
          <span className="block text-sm text-stone-900">{data.parentCount}</span>
          Cha mẹ
        </div>
        <div className="rounded bg-stone-50 px-1 py-1">
          <span className="block text-sm text-stone-900">{data.spouseCount}</span>
          Vợ chồng
        </div>
        <div className="rounded bg-stone-50 px-1 py-1">
          <span className="block text-sm text-stone-900">{data.childCount}</span>
          Con
        </div>
      </div>
    </div>
  );
}

function relationshipColor(type: RelationshipType) {
  if (type === "marriage") return "#e11d48";
  if (type === "adopted_child") return "#0284c7";
  return "#b45309";
}

function buildRelationshipStats(relationships: Relationship[]) {
  const stats = new Map<
    string,
    { parentCount: number; childCount: number; spouseCount: number }
  >();
  const ensure = (id: string) => {
    const current = stats.get(id) ?? {
      parentCount: 0,
      childCount: 0,
      spouseCount: 0,
    };
    stats.set(id, current);
    return current;
  };

  relationships.forEach((relationship) => {
    if (relationship.type === "marriage") {
      ensure(relationship.person_a).spouseCount += 1;
      ensure(relationship.person_b).spouseCount += 1;
      return;
    }
    ensure(relationship.person_a).childCount += 1;
    ensure(relationship.person_b).parentCount += 1;
  });
  return stats;
}

function buildNodes({
  persons,
  relationships,
  query,
  onlyUnlinked,
  selectedPersonId,
}: {
  persons: Person[];
  relationships: Relationship[];
  query: string;
  onlyUnlinked: boolean;
  selectedPersonId: string | null;
}): PersonNode[] {
  const stats = buildRelationshipStats(relationships);
  const linkedIds = new Set<string>();
  relationships.forEach((relationship) => {
    linkedIds.add(relationship.person_a);
    linkedIds.add(relationship.person_b);
  });
  const normalizedQuery = normalizeText(query);
  const sorted = persons
    .filter((person) => !onlyUnlinked || !linkedIds.has(person.id))
    .slice()
    .sort((a, b) => {
      const generationDiff =
        (a.generation ?? Number.MAX_SAFE_INTEGER) -
        (b.generation ?? Number.MAX_SAFE_INTEGER);
      if (generationDiff !== 0) return generationDiff;
      const yearDiff =
        (a.birth_year ?? Number.MAX_SAFE_INTEGER) -
        (b.birth_year ?? Number.MAX_SAFE_INTEGER);
      if (yearDiff !== 0) return yearDiff;
      return a.full_name.localeCompare(b.full_name, "vi");
    });

  const groups = new Map<string, Person[]>();
  sorted.forEach((person) => {
    const generation = person.generation ?? "unknown";
    const key = generation === "unknown" ? "unknown" : String(generation);
    groups.set(key, [...(groups.get(key) ?? []), person]);
  });

  const orderedGroups = [...groups.entries()].sort(([a], [b]) => {
    if (a === "unknown") return 1;
    if (b === "unknown") return -1;
    return Number(a) - Number(b);
  });

  return orderedGroups.flatMap(([generation, group], groupIndex) =>
    group.map((person, index) => {
      const stat = stats.get(person.id) ?? {
        parentCount: 0,
        childCount: 0,
        spouseCount: 0,
      };
      const matchesQuery =
        !normalizedQuery || normalizeText(person.full_name).includes(normalizedQuery);
      const columns = generation === "unknown" ? 4 : 5;
      return {
        id: person.id,
        type: "personNode",
        position: {
          x: (index % columns) * 270,
          y: groupIndex * 210 + Math.floor(index / columns) * 160,
        },
        data: {
          person,
          muted: !matchesQuery,
          selected: selectedPersonId === person.id,
          parentCount: stat.parentCount,
          childCount: stat.childCount,
          spouseCount: stat.spouseCount,
        },
      };
    }),
  );
}

function buildEdges(relationships: Relationship[]): RelationshipEdge[] {
  return relationships.map((relationship) => {
    const color = relationshipColor(relationship.type);
    const isMarriage = relationship.type === "marriage";
    return {
      id: relationship.id,
      source: relationship.person_a,
      target: relationship.person_b,
      sourceHandle: isMarriage ? "source-right" : "source-bottom",
      targetHandle: isMarriage ? "target-left" : "target-top",
      type: "smoothstep",
      label: relationshipTypeLabel(relationship.type),
      data: { relationship },
      markerEnd:
        isMarriage
          ? undefined
          : { type: MarkerType.ArrowClosed, color },
      style: {
        stroke: color,
        strokeWidth: isMarriage ? 2.4 : 2,
      },
      labelStyle: {
        fill: "#292524",
        fontSize: 12,
        fontWeight: 800,
      },
      labelBgStyle: {
        fill: "#fffaf0",
        fillOpacity: 0.92,
      },
    };
  });
}

export default function RelationshipCanvasEditor({
  familyId,
  treeId,
  canEdit = false,
  onRelationshipSaved,
}: {
  familyId: string;
  treeId: string;
  canEdit?: boolean;
  onRelationshipSaved?: () => void;
}) {
  const router = useRouter();
  const nodeTypes = useMemo(() => ({ personNode: PersonRelationNode }), []);
  const [persons, setPersons] = useState<Person[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<PersonNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<RelationshipEdge>([]);
  const [relationshipType, setRelationshipType] =
    useState<RelationshipMode>("biological_child");
  const [query, setQuery] = useState("");
  const [onlyUnlinked, setOnlyUnlinked] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);
  const [note, setNote] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const peopleById = useMemo(
    () => new Map(persons.map((person) => [person.id, person])),
    [persons],
  );
  const selectedRelationship = relationships.find(
    (relationship) => relationship.id === selectedEdgeId,
  );
  const pendingSource = pendingConnection?.source
    ? peopleById.get(pendingConnection.source)
    : undefined;
  const pendingTarget = pendingConnection?.target
    ? peopleById.get(pendingConnection.target)
    : undefined;
  const linkedIds = useMemo(() => {
    const ids = new Set<string>();
    relationships.forEach((relationship) => {
      ids.add(relationship.person_a);
      ids.add(relationship.person_b);
    });
    return ids;
  }, [relationships]);
  const visiblePeople = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    return persons
      .filter((person) => !onlyUnlinked || !linkedIds.has(person.id))
      .filter(
        (person) =>
          !normalizedQuery || normalizeText(person.full_name).includes(normalizedQuery),
      )
      .slice(0, 12);
  }, [linkedIds, onlyUnlinked, persons, query]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setStatus(null);
    try {
      const result = await getCanvasDataAction(familyId, treeId);
      if (!result.success) {
        throw new Error(result.error);
      }
      setPersons(result.persons);
      setRelationships(result.relationships);
    } catch (error) {
      console.error("Unable to load relationship canvas:", error);
      setStatus({
        type: "error",
        message: "Không thể tải bản đồ quan hệ.",
      });
    } finally {
      setLoading(false);
    }
  }, [familyId, treeId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  useEffect(() => {
    setNodes(
      buildNodes({
        persons,
        relationships,
        query,
        onlyUnlinked,
        selectedPersonId,
      }),
    );
    setEdges(buildEdges(relationships));
  }, [
    onlyUnlinked,
    persons,
    query,
    relationships,
    selectedPersonId,
    setEdges,
    setNodes,
  ]);

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!canEdit) return;
      if (!connection.source || !connection.target) return;
      if (connection.source === connection.target) {
        setStatus({
          type: "error",
          message: "Không thể tạo quan hệ với chính người đó.",
        });
        return;
      }
      setSelectedEdgeId(null);
      setPendingConnection(connection);
      setRelationshipType("biological_child");
      setNote("");
      setStatus(null);
    },
    [canEdit],
  );

  const applyPendingConnection = async () => {
    if (!pendingConnection?.source || !pendingConnection.target) return;
    setSaving(true);
    setStatus(null);
    try {
      const formData = new FormData();
      formData.set("family_id", familyId);
      formData.set("tree_id", treeId);
      formData.set("person_a", pendingConnection.source);
      formData.set("person_b", pendingConnection.target);
      formData.set("type", relationshipType);
      formData.set("note", note);
      const result = await createOrUpdateRelationshipAction(formData);
      if (result.error) throw new Error(result.error);
      setPendingConnection(null);
      setNote("");
      setStatus({
        type: "success",
        message: "Đã lưu quan hệ và tính lại đời thứ.",
      });
      await loadData();
      router.refresh();
      onRelationshipSaved?.();
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Không thể lưu quan hệ.",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteSelectedRelationship = async () => {
    if (!selectedRelationship) return;
    if (!window.confirm("Xóa quan hệ đang chọn?")) return;
    setSaving(true);
    setStatus(null);
    try {
      const formData = new FormData();
      formData.set("family_id", familyId);
      formData.set("tree_id", treeId);
      formData.set("relationship_id", selectedRelationship.id);
      const result = await deleteRelationshipAction(formData);
      if (result.error) throw new Error(result.error);
      setSelectedEdgeId(null);
      setStatus({
        type: "success",
        message: "Đã xóa quan hệ và cập nhật lại cây.",
      });
      await loadData();
      router.refresh();
      onRelationshipSaved?.();
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Không thể xóa quan hệ.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      id="relationship-canvas"
      className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm"
    >
      <header className="border-b border-stone-200 bg-stone-950 px-5 py-5 text-white sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-amber-400 text-stone-950">
              <Link2 className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Nối quan hệ trực quan</h2>
              <p className="mt-1 text-sm text-stone-300">
                {persons.length.toLocaleString("vi-VN")} thành viên,{" "}
                {relationships.length.toLocaleString("vi-VN")} quan hệ,{" "}
                {(persons.length - linkedIds.size).toLocaleString("vi-VN")} người chưa nối.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 text-sm font-black text-stone-200">
              <Link2 className="size-4" />
              Kéo dây trước, chọn quan hệ sau
            </div>
            <button
              type="button"
              onClick={() => void loadData()}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 text-sm font-black text-white transition hover:bg-white/10"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Làm mới
            </button>
          </div>
        </div>
      </header>

      <div className="grid min-h-[720px] lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-b border-stone-200 bg-stone-50/80 p-4 lg:border-b-0 lg:border-r">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm thành viên..."
              className="w-full rounded-md border border-stone-300 bg-white py-2.5 pl-10 pr-3 text-sm font-semibold text-stone-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOnlyUnlinked(false)}
              className={`rounded-md border px-3 py-2 text-sm font-black ${
                !onlyUnlinked
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-700"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setOnlyUnlinked(true)}
              className={`rounded-md border px-3 py-2 text-sm font-black ${
                onlyUnlinked
                  ? "border-amber-700 bg-amber-700 text-white"
                  : "border-stone-200 bg-white text-stone-700"
              }`}
            >
              Chưa nối
            </button>
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-black uppercase text-stone-500">
              <span>Danh sách</span>
              <span>{visiblePeople.length}</span>
            </div>
            <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
              {visiblePeople.map((person) => (
                <button
                  type="button"
                  key={person.id}
                  onClick={() => setSelectedPersonId(person.id)}
                  className={`flex w-full items-center gap-3 rounded-md border bg-white p-2.5 text-left transition hover:border-amber-300 ${
                    selectedPersonId === person.id
                      ? "border-amber-400 ring-2 ring-amber-200"
                      : "border-stone-200"
                  }`}
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-md border text-[10px] font-black ${genderTone(
                      person.gender,
                    )}`}
                  >
                    {person.gender === "male" ? "Nam" : person.gender === "female" ? "Nữ" : "Khác"}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black text-stone-900">
                      {person.full_name}
                    </span>
                    <span className="block text-xs font-semibold text-stone-500">
                      {person.generation ? `Đời ${person.generation}` : "Chưa rõ đời"}
                    </span>
                  </span>
                </button>
              ))}
              {!visiblePeople.length && (
                <div className="rounded-md border border-dashed border-stone-300 bg-white p-4 text-sm font-semibold text-stone-500">
                  Không có thành viên phù hợp.
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 rounded-md border border-stone-200 bg-white p-3">
            <div className="flex items-center gap-2 text-sm font-black text-stone-900">
              <UsersRound className="size-4 text-amber-700" />
              Trạng thái
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded bg-stone-50 p-2">
                <p className="text-lg font-black text-stone-900">{persons.length}</p>
                <p className="text-[10px] font-bold uppercase text-stone-500">Người</p>
              </div>
              <div className="rounded bg-stone-50 p-2">
                <p className="text-lg font-black text-stone-900">{relationships.length}</p>
                <p className="text-[10px] font-bold uppercase text-stone-500">Dây</p>
              </div>
              <div className="rounded bg-amber-50 p-2">
                <p className="text-lg font-black text-amber-800">
                  {persons.length - linkedIds.size}
                </p>
                <p className="text-[10px] font-bold uppercase text-amber-700">Chưa nối</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="relative min-h-[720px] bg-[#faf8f3]">
          {loading ? (
            <div className="flex h-full min-h-[720px] items-center justify-center text-sm font-bold text-stone-500">
              <Loader2 className="mr-2 size-5 animate-spin text-amber-700" />
              Đang tải bản đồ quan hệ...
            </div>
          ) : persons.length === 0 ? (
            <div className="flex h-full min-h-[720px] items-center justify-center p-6 text-center">
              <div className="max-w-sm">
                <UsersRound className="mx-auto size-10 text-stone-400" />
                <h3 className="mt-3 text-lg font-black text-stone-900">
                  Chưa có thành viên
                </h3>
                <p className="mt-1 text-sm font-medium leading-6 text-stone-500">
                  Import danh sách người ở phía trên trước, sau đó mở bản đồ này để nối quan hệ.
                </p>
              </div>
            </div>
          ) : (
            <ReactFlow<PersonNode, RelationshipEdge>
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={handleConnect}
              onNodeClick={(_, node) => {
                setSelectedPersonId(node.id);
                setSelectedEdgeId(null);
              }}
              onEdgeClick={(_, edge) => {
                setSelectedEdgeId(edge.id);
                setSelectedPersonId(null);
              }}
              fitView
              minZoom={0.25}
              maxZoom={1.35}
              nodesDraggable={canEdit}
              nodesConnectable={canEdit}
              elementsSelectable
              defaultEdgeOptions={{
                type: "smoothstep",
              }}
            >
              <Background color="#d6d3d1" gap={18} />
              <Controls position="bottom-right" />
              <MiniMap
                pannable
                zoomable
                position="bottom-left"
                nodeColor={(node) =>
                  peopleById.get(node.id)?.generation ? "#b45309" : "#78716c"
                }
              />
              <Panel position="top-right">
                <div className="rounded-md border border-stone-200 bg-white/95 px-3 py-2 text-xs font-black text-stone-600 shadow-sm">
                  {canEdit ? "Chế độ sửa" : "Chỉ xem"}
                </div>
              </Panel>
            </ReactFlow>
          )}
        </div>
      </div>

      {(pendingConnection || selectedRelationship || status) && (
        <div className="border-t border-stone-200 bg-white px-5 py-4 sm:px-6">
          {status && (
            <div
              className={`mb-3 flex items-start gap-2 rounded-md border p-3 text-sm font-semibold ${
                status.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              ) : (
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              )}
              {status.message}
            </div>
          )}

          {pendingConnection && (
            <div className="grid gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 lg:grid-cols-[minmax(0,1fr)_220px_260px_auto] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
                  Quan hệ vừa kéo
                </p>
                <p className="mt-1 text-sm font-black text-stone-900">
                  {relationSentence(pendingSource, pendingTarget, relationshipType)}
                </p>
                <p className="mt-1 text-xs font-semibold text-stone-600">
                  Chọn loại quan hệ rồi lưu; cây chính sẽ tự cập nhật sau khi server kiểm tra.
                </p>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-black text-stone-600">
                  Loại quan hệ
                </span>
                <select
                  value={relationshipType}
                  onChange={(event) =>
                    setRelationshipType(event.target.value as RelationshipMode)
                  }
                  className="min-h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm font-black text-stone-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                >
                  {relationModes.map((item) => (
                    <option key={item.type} value={item.type}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-black text-stone-600">
                  Ghi chú
                </span>
                <input
                  type="text"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Ví dụ: vợ cả, con nuôi..."
                  className="min-h-10 w-full rounded-md border border-stone-300 px-3 text-sm font-semibold outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPendingConnection(null)}
                  className="inline-flex min-h-10 items-center justify-center rounded-md border border-stone-300 bg-white px-3 text-sm font-black text-stone-700 hover:bg-stone-50"
                  disabled={saving}
                >
                  <X className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={applyPendingConnection}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-amber-700 px-4 text-sm font-black text-white hover:bg-amber-800 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                  Lưu
                </button>
              </div>
            </div>
          )}

          {selectedRelationship && !pendingConnection && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-stone-900">
                  {relationshipTypeLabel(selectedRelationship.type)}:{" "}
                  {peopleById.get(selectedRelationship.person_a)?.full_name} -{" "}
                  {peopleById.get(selectedRelationship.person_b)?.full_name}
                </p>
                {selectedRelationship.note && (
                  <p className="mt-1 text-xs font-semibold text-stone-500">
                    {selectedRelationship.note}
                  </p>
                )}
              </div>
              {canEdit && (
                <button
                  type="button"
                  onClick={deleteSelectedRelationship}
                  disabled={saving}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 text-sm font-black text-red-700 hover:bg-red-100 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                  Xóa quan hệ
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
