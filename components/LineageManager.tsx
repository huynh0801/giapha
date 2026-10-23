"use client";

import {
  applyLineageSyncAction,
  previewLineageSyncAction,
} from "@/app/actions/genealogy";
import type { Person } from "@/types";
import type {
  ComputedPersonLineage,
  GenealogyIssue,
} from "@/utils/genealogyEngine";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface LineageManagerProps {
  persons: Person[];
  familyId: string;
  treeId: string;
}

interface PreviewState {
  updates: ComputedPersonLineage[];
  issues: GenealogyIssue[];
}

export default function LineageManager({
  persons,
  familyId,
  treeId,
}: LineageManagerProps) {
  const router = useRouter();
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [computing, setComputing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const personById = useMemo(
    () => new Map(persons.map((person) => [person.id, person])),
    [persons],
  );

  const createPayload = () => {
    const formData = new FormData();
    formData.set("family_id", familyId);
    formData.set("tree_id", treeId);
    return formData;
  };

  const handleCompute = async () => {
    setComputing(true);
    setApplied(false);
    setError(null);
    try {
      const result = await previewLineageSyncAction(createPayload());
      if (result.error) throw new Error(result.error);
      if (!("updates" in result)) throw new Error("Không nhận được kết quả phân tích.");
      setPreview({
        updates: result.updates ?? [],
        issues: result.issues ?? [],
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể tính đời thứ.");
    } finally {
      setComputing(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    setError(null);
    try {
      const result = await applyLineageSyncAction(createPayload());
      if (result.error) throw new Error(result.error);
      if (!("updates" in result)) throw new Error("Không nhận được kết quả đồng bộ.");
      setPreview({
        updates: result.updates ?? [],
        issues: result.issues ?? [],
      });
      setApplied(true);
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Không thể cập nhật đời thứ.",
      );
    } finally {
      setApplying(false);
    }
  };

  const changedCount = preview?.updates.filter((update) => update.changed).length ?? 0;
  const blockingIssues =
    preview?.issues.filter((issue) => issue.severity === "error") ?? [];
  const warningIssues =
    preview?.issues.filter((issue) => issue.severity === "warning") ?? [];
  const sortedUpdates = useMemo(
    () =>
      (preview?.updates ?? []).slice().sort((a, b) => {
        if (a.changed !== b.changed) return a.changed ? -1 : 1;
        const generationDifference =
          (a.new_generation ?? Number.MAX_SAFE_INTEGER) -
          (b.new_generation ?? Number.MAX_SAFE_INTEGER);
        if (generationDifference !== 0) return generationDifference;
        return (
          (a.new_birth_order ?? Number.MAX_SAFE_INTEGER) -
          (b.new_birth_order ?? Number.MAX_SAFE_INTEGER)
        );
      }),
    [preview],
  );
  const displayedRows = showAll ? sortedUpdates : sortedUpdates.slice(0, 20);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleCompute}
          disabled={computing || applying}
          className="btn-secondary"
        >
          {computing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {computing ? "Đang phân tích..." : "Phân tích cây"}
        </button>

        {preview && changedCount > 0 && !applied && (
          <button
            type="button"
            onClick={handleApply}
            disabled={applying || blockingIssues.length > 0}
            className="btn-primary"
          >
            {applying ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            {applying ? "Đang cập nhật..." : `Áp dụng ${changedCount} thay đổi`}
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
          >
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {applied && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700"
        >
          <CheckCircle2 className="size-5 shrink-0" />
          Đã đồng bộ thành công đời thứ và vai trò dâu/rể.
        </div>
      )}

      {preview && (blockingIssues.length > 0 || warningIssues.length > 0) && (
        <section className="overflow-hidden rounded-lg border border-stone-200 bg-white">
          <div className="border-b border-stone-100 bg-stone-50 px-4 py-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-stone-800">
              <TriangleAlert className="size-4 text-amber-600" />
              Kiểm tra tính nhất quán
            </h3>
          </div>
          <div className="divide-y divide-stone-100">
            {[...blockingIssues, ...warningIssues].map((issue, index) => (
              <div
                key={`${issue.code}-${index}`}
                className="flex items-start gap-3 px-4 py-3 text-sm"
              >
                <span
                  className={`mt-1 size-2 shrink-0 rounded-full ${
                    issue.severity === "error" ? "bg-red-500" : "bg-amber-500"
                  }`}
                />
                <div>
                  <p className="font-semibold text-stone-800">{issue.message}</p>
                  {issue.personIds && issue.personIds.length > 0 && (
                    <p className="mt-1 text-xs text-stone-500">
                      {issue.personIds
                        .map((id) => personById.get(id)?.full_name)
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {preview && (
        <section>
          <p className="mb-3 text-sm font-medium text-stone-500">
            <span className="font-bold text-stone-800">{changedCount}</span> thành
            viên cần cập nhật trên tổng số {preview.updates.length} người.
          </p>
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Tên</th>
                    <th className="px-4 py-3 text-center font-semibold">Đời thứ</th>
                    <th className="px-4 py-3 text-center font-semibold">Thứ tự sinh</th>
                    <th className="px-4 py-3 text-center font-semibold">Dâu/Rể</th>
                    <th className="px-4 py-3 text-center font-semibold">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {displayedRows.map((update) => {
                    const person = personById.get(update.id);
                    return (
                      <tr key={update.id} className={update.changed ? "bg-amber-50/50" : ""}>
                        <td className="px-4 py-3 font-medium text-stone-800">
                          {person?.full_name ?? update.id}
                        </td>
                        <ChangeCell oldValue={update.old_generation} newValue={update.new_generation} />
                        <ChangeCell oldValue={update.old_birth_order} newValue={update.new_birth_order} />
                        <ChangeCell
                          oldValue={update.old_is_in_law ? "Có" : "Không"}
                          newValue={update.new_is_in_law ? "Có" : "Không"}
                        />
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex rounded px-2 py-1 text-xs font-bold ${
                              update.changed
                                ? "bg-amber-100 text-amber-800"
                                : "bg-stone-100 text-stone-500"
                            }`}
                          >
                            {update.changed ? "Cập nhật" : "Không đổi"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {sortedUpdates.length > 20 && (
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="mx-auto mt-3 flex min-h-11 items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-amber-700"
            >
              {showAll ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              {showAll ? "Thu gọn" : `Xem tất cả ${sortedUpdates.length} thành viên`}
            </button>
          )}
        </section>
      )}
    </div>
  );
}

function ChangeCell({
  oldValue,
  newValue,
}: {
  oldValue: number | string | null;
  newValue: number | string | null;
}) {
  const changed = oldValue !== newValue;
  return (
    <td className="px-4 py-3 text-center">
      <span className={changed ? "text-stone-400" : "font-semibold text-stone-700"}>
        {oldValue ?? "—"}
      </span>
      {changed && (
        <>
          <span className="mx-2 text-stone-300">→</span>
          <span className="font-bold text-amber-700">{newValue ?? "—"}</span>
        </>
      )}
    </td>
  );
}
