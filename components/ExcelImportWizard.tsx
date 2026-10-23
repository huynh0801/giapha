"use client";

import {
  applyExcelImportAction,
  previewExcelImportAction,
} from "@/app/actions/excel-import";
import type { GenealogyIssue } from "@/utils/genealogyEngine";
import {
  getColumnHeaders,
  rowsToNormalizedImportRows,
} from "@/utils/excelImport/detectColumns";
import { parseExcelWorkbook } from "@/utils/excelImport/parseWorkbook";
import {
  IMPORT_FIELD_LABELS,
  IMPORT_FIELDS,
  type ImportField,
  type ImportMapping,
  type ImportPreviewRow,
  type NormalizedImportRow,
  type ParsedWorkbook,
} from "@/utils/excelImport/types";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Link2,
  Loader2,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  Upload,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type WizardStep = "upload" | "mapping" | "preview" | "done";
type TemplateKind = "people" | "names" | "advanced";

interface PreviewState {
  counts: {
    personsToCreate: number;
    personsToUpdate: number;
    relationshipsToCreate: number;
    relationshipsSkipped: number;
  };
  rows: ImportPreviewRow[];
  issues: GenealogyIssue[];
}

const friendlyFields: ImportField[] = [
  "full_name",
  "gender",
  "birth_year",
  "birth_month",
  "birth_day",
  "death_anniversary",
  "generation",
  "parent_keys",
  "father_key",
  "mother_key",
  "spouse_keys",
  "is_root",
  "phone_number",
  "occupation",
  "current_residence",
  "note",
];

const advancedFields: ImportField[] = IMPORT_FIELDS.filter(
  (field) => !friendlyFields.includes(field),
);

const requiredFields: ImportField[] = ["full_name"];

const templateButtons: Array<{
  kind: TemplateKind;
  title: string;
  icon: typeof UsersRound;
}> = [
  { kind: "people", title: "Mẫu chỉ danh sách người", icon: UsersRound },
  { kind: "names", title: "Mẫu quan hệ theo tên", icon: Link2 },
  { kind: "advanced", title: "Mẫu nâng cao có mã", icon: FileSpreadsheet },
];

function buildTemplate(kind: TemplateKind) {
  if (kind === "people") {
    return {
      fileName: "mau-dong-ho-truong-chi-danh-sach-nguoi.xlsx",
      sheetName: "Danh sach nguoi",
      rows: [
        ["H\u1ecd v\u00e0 t\u00ean", "Gi\u1edbi t\u00ednh", "N\u0103m sinh", "Th\u00e1ng sinh", "Ng\u00e0y sinh", "Ng\u00e0y gi\u1ed7", "\u0110\u1eddi th\u1ee9", "S\u1ed1 \u0111i\u1ec7n tho\u1ea1i", "Ngh\u1ec1 nghi\u1ec7p", "N\u01a1i \u1edf hi\u1ec7n t\u1ea1i", "Ghi ch\u00fa"],
        ["Tr\u01b0\u01a1ng V\u0103n Khai", "Nam", 1930, 2, 15, "10/03/1998", 1, "", "N\u00f4ng nghi\u1ec7p", "Nam \u0110\u1ecbnh", "C\u00f3 ng\u00e0y gi\u1ed7 n\u00ean h\u1ec7 th\u1ed1ng t\u1ef1 \u0111\u00e1nh d\u1ea5u \u0111\u00e3 m\u1ea5t"],
        ["Nguy\u1ec5n Th\u1ecb Hoa", "N\u1eef", 1934, 5, 20, "", 1, "", "", "Nam \u0110\u1ecbnh", "C\u00f2n s\u1ed1ng v\u00ec kh\u00f4ng nh\u1eadp ng\u00e0y gi\u1ed7/ng\u00e0y m\u1ea5t"],
        ["Tr\u01b0\u01a1ng V\u0103n Minh", "Nam", 1958, 4, 10, "", 2, "0901000001", "Gi\u00e1o vi\u00ean", "H\u00e0 N\u1ed9i", ""],
        ["L\u00ea Th\u1ecb Lan", "N\u1eef", 1960, 7, 6, "", 2, "0901000002", "K\u1ebf to\u00e1n", "H\u00e0 N\u1ed9i", ""],
        ["Tr\u01b0\u01a1ng Th\u1ecb H\u1ea1nh", "N\u1eef", 1962, 12, 1, "", 2, "0901000003", "B\u00e1c s\u0129", "TP.HCM", ""],
        ["Tr\u01b0\u01a1ng Ho\u00e0ng Anh", "Nam", 1985, 3, 22, "", 3, "0901000005", "L\u1eadp tr\u00ecnh vi\u00ean", "\u0110\u00e0 N\u1eb5ng", ""],
        ["V\u0169 Th\u1ecb Mai", "N\u1eef", 1987, 10, 9, "", 3, "0901000006", "Thi\u1ebft k\u1ebf", "\u0110\u00e0 N\u1eb5ng", ""],
      ],
    };
  }

  if (kind === "names") {
    return {
      fileName: "mau-dong-ho-truong-quan-he-theo-ten.xlsx",
      sheetName: "Quan he theo ten",
      rows: [
        ["H\u1ecd v\u00e0 t\u00ean", "Gi\u1edbi t\u00ednh", "Cha/m\u1eb9", "V\u1ee3/ch\u1ed3ng", "Th\u1ee9 t\u1ef1 sinh", "N\u0103m sinh", "Ng\u00e0y gi\u1ed7", "\u0110\u1eddi th\u1ee9", "Ng\u01b0\u1eddi g\u1ed1c", "Ghi ch\u00fa"],
        ["Tr\u01b0\u01a1ng V\u0103n Khai", "Nam", "", "Nguy\u1ec5n Th\u1ecb Hoa", "", 1930, "10/03/1998", 1, "C\u00f3", "Th\u1ee7y t\u1ed5 nh\u00e1nh m\u1eabu"],
        ["Nguy\u1ec5n Th\u1ecb Hoa", "N\u1eef", "", "Tr\u01b0\u01a1ng V\u0103n Khai", "", 1934, "", 1, "", ""],
        ["Tr\u01b0\u01a1ng V\u0103n Minh", "Nam", "Tr\u01b0\u01a1ng V\u0103n Khai; Nguy\u1ec5n Th\u1ecb Hoa", "L\u00ea Th\u1ecb Lan", 1, 1958, "", 2, "", "Con tr\u01b0\u1edfng"],
        ["L\u00ea Th\u1ecb Lan", "N\u1eef", "", "Tr\u01b0\u01a1ng V\u0103n Minh", "", 1960, "", 2, "", "D\u00e2u \u0111\u1eddi 2"],
        ["Tr\u01b0\u01a1ng Th\u1ecb H\u1ea1nh", "N\u1eef", "Tr\u01b0\u01a1ng V\u0103n Khai; Nguy\u1ec5n Th\u1ecb Hoa", "Ph\u1ea1m V\u0103n Nam", 2, 1962, "", 2, "", "Con g\u00e1i th\u1ee9 hai"],
        ["Ph\u1ea1m V\u0103n Nam", "Nam", "", "Tr\u01b0\u01a1ng Th\u1ecb H\u1ea1nh", "", 1961, "", 2, "", "R\u1ec3 \u0111\u1eddi 2"],
        ["Tr\u01b0\u01a1ng Ho\u00e0ng Anh", "Nam", "Tr\u01b0\u01a1ng V\u0103n Minh; L\u00ea Th\u1ecb Lan", "V\u0169 Th\u1ecb Mai", 1, 1985, "", 3, "", ""],
        ["V\u0169 Th\u1ecb Mai", "N\u1eef", "", "Tr\u01b0\u01a1ng Ho\u00e0ng Anh", "", 1987, "", 3, "", ""],
        ["Tr\u01b0\u01a1ng Gia B\u1ea3o", "Nam", "Tr\u01b0\u01a1ng Ho\u00e0ng Anh; V\u0169 Th\u1ecb Mai", "", 1, 2012, "", 4, "", ""],
      ],
    };
  }

  return {
    fileName: "mau-dong-ho-truong-nang-cao-co-ma.xlsx",
    sheetName: "Nang cao",
    rows: [
      ["M\u00e3 th\u00e0nh vi\u00ean", "H\u1ecd v\u00e0 t\u00ean", "Gi\u1edbi t\u00ednh", "M\u00e3/t\u00ean cha", "M\u00e3/t\u00ean m\u1eb9", "M\u00e3/t\u00ean v\u1ee3 ch\u1ed3ng", "Th\u1ee9 t\u1ef1 sinh", "N\u0103m sinh", "Ng\u00e0y gi\u1ed7", "\u0110\u1eddi th\u1ee9", "Ng\u01b0\u1eddi g\u1ed1c", "Ghi ch\u00fa"],
      ["TRUONG-GOC-01", "Tr\u01b0\u01a1ng V\u0103n Khai", "Nam", "", "", "TRUONG-P1-VO", "", 1930, "10/03/1998", 1, "C\u00f3", "D\u00f9ng m\u00e3 \u0111\u1ec3 re-import \u1ed5n \u0111\u1ecbnh"],
      ["TRUONG-P1-VO", "Nguy\u1ec5n Th\u1ecb Hoa", "N\u1eef", "", "", "TRUONG-GOC-01", "", 1934, "", 1, "", ""],
      ["TRUONG-D2-01", "Tr\u01b0\u01a1ng V\u0103n Minh", "Nam", "TRUONG-GOC-01", "TRUONG-P1-VO", "TRUONG-D2-01-VO", 1, 1958, "", 2, "", ""],
      ["TRUONG-D2-01-VO", "L\u00ea Th\u1ecb Lan", "N\u1eef", "", "", "TRUONG-D2-01", "", 1960, "", 2, "", ""],
    ],
  };
}

function downloadTemplate(kind: TemplateKind) {
  void (async () => {
    const XLSX = await import("xlsx");
    const template = buildTemplate(kind);
    const worksheet = XLSX.utils.aoa_to_sheet(template.rows);
    worksheet["!cols"] = template.rows[0].map((header) => ({
      wch: Math.max(String(header).length + 8, 16),
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, template.sheetName);
    XLSX.writeFile(workbook, template.fileName);
  })();
}

export default function ExcelImportWizard({
  familyId,
  treeId,
  familySlug,
  onImportApplied,
  onRequestRelationshipEdit,
}: {
  familyId: string;
  treeId: string;
  familySlug?: string;
  onImportApplied?: () => void;
  onRequestRelationshipEdit?: () => void;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<WizardStep>("upload");
  const [workbook, setWorkbook] = useState<ParsedWorkbook | null>(null);
  const [mapping, setMapping] = useState<ImportMapping | null>(null);
  const [normalizedRows, setNormalizedRows] = useState<NormalizedImportRow[]>([]);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedSheet = workbook?.sheets.find(
    (sheet) => sheet.name === mapping?.sheetName,
  );
  const headerOptions = selectedSheet
    ? selectedSheet.rows.slice(0, 30).map((row, index) => ({
        index,
        label: `Dòng ${index + 1}: ${
          row
            .slice(0, 5)
            .map((value) => String(value ?? "").trim())
            .filter(Boolean)
            .join(" | ") || "(trống)"
        }`,
      }))
    : [];
  const columnHeaders = selectedSheet && mapping
    ? getColumnHeaders(selectedSheet.rows, mapping.headerRowIndex)
    : [];
  const confidence = selectedSheet?.candidates.find(
    (candidate) => candidate.rowIndex === mapping?.headerRowIndex,
  )?.confidence ?? 0;
  const mappedColumnLabel = (field: ImportField) => {
    const index = mapping?.columns[field];
    if (index == null) return null;
    return columnHeaders.find((column) => column.index === index)?.label ?? `Cột ${index + 1}`;
  };
  const detectedFriendlyCount = friendlyFields.filter(
    (field) => mapping?.columns[field] != null,
  ).length;
  const blockingIssues = preview?.issues.filter((issue) => issue.severity === "error") ?? [];
  const warningIssues = preview?.issues.filter((issue) => issue.severity === "warning") ?? [];
  const progressStep = step === "upload" ? 1 : step === "mapping" ? 2 : step === "preview" ? 3 : 4;

  const scanFile = async (file: File) => {
    const lowerName = file.name.toLowerCase();
    if (![".xlsx", ".xls", ".csv"].some((extension) => lowerName.endsWith(extension))) {
      setError("Vui lòng chọn file .xlsx, .xls hoặc .csv.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File Excel tối đa 10MB. Hãy tách file thành nhiều lần import.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseExcelWorkbook(file);
      if (parsed.sheets.length === 0) throw new Error("Workbook không có sheet dữ liệu.");
      const bestSheet = parsed.sheets
        .slice()
        .sort(
          (a, b) =>
            (b.candidates[0]?.confidence ?? 0) -
            (a.candidates[0]?.confidence ?? 0),
        )[0];
      const candidate = bestSheet.candidates[0];
      setWorkbook(parsed);
      setMapping({
        sheetName: bestSheet.name,
        headerRowIndex: candidate?.rowIndex ?? 0,
        columns: candidate?.mappedColumns ?? {},
      });
      setPreview(null);
      setStep("mapping");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể đọc file Excel.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const chooseSheet = (sheetName: string) => {
    const sheet = workbook?.sheets.find((item) => item.name === sheetName);
    if (!sheet) return;
    const candidate = sheet.candidates[0];
    setMapping({
      sheetName,
      headerRowIndex: candidate?.rowIndex ?? 0,
      columns: candidate?.mappedColumns ?? {},
    });
    setPreview(null);
  };

  const chooseHeaderRow = (headerRowIndex: number) => {
    if (!selectedSheet || !mapping) return;
    const candidate = selectedSheet.candidates.find(
      (item) => item.rowIndex === headerRowIndex,
    );
    setMapping({
      ...mapping,
      headerRowIndex,
      columns: candidate?.mappedColumns ?? {},
    });
  };

  const updateColumn = (field: ImportField, value: string) => {
    if (!mapping) return;
    const columns = { ...mapping.columns };
    if (value === "") delete columns[field];
    else columns[field] = Number(value);
    setMapping({ ...mapping, columns });
  };

  const createActionPayload = (rows: NormalizedImportRow[]) => {
    const formData = new FormData();
    formData.set("family_id", familyId);
    formData.set("tree_id", treeId);
    formData.set("rows_json", JSON.stringify(rows));
    return formData;
  };

  const handlePreview = async () => {
    if (!selectedSheet || !mapping) return;
    if (mapping.columns.full_name == null) {
      setError("Hãy chọn đúng cột Họ và tên trước khi tiếp tục.");
      return;
    }
    const rows = rowsToNormalizedImportRows(selectedSheet.rows, mapping);
    if (rows.length === 0) {
      setError("Không tìm thấy dòng thành viên nào sau dòng tiêu đề.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await previewExcelImportAction(createActionPayload(rows));
      if (result.error) throw new Error(result.error);
      setNormalizedRows(rows);
      setPreview({
        counts: result.counts!,
        rows: result.rows ?? [],
        issues: result.issues ?? [],
      });
      setStep("preview");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể tạo bản xem trước.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!preview || blockingIssues.length > 0) return;
    setLoading(true);
    setError(null);
    try {
      const result = await applyExcelImportAction(createActionPayload(normalizedRows));
      if (result.error) throw new Error(result.error);
      const imported = result.imported!;
      setSuccessMessage(
        `Đã tạo ${imported.personsCreated} người, cập nhật ${imported.personsUpdated} người và thêm ${imported.relationshipsCreated} quan hệ.`,
      );
      setStep("done");
      router.refresh();
      onImportApplied?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể áp dụng import.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("upload");
    setWorkbook(null);
    setMapping(null);
    setNormalizedRows([]);
    setPreview(null);
    setError(null);
    setSuccessMessage(null);
  };

  const openRelationshipWorkflow = () => {
    if (onRequestRelationshipEdit) {
      onRequestRelationshipEdit();
      return;
    }
    router.push(
      familySlug
        ? `/dashboard/${familySlug}/members?treeId=${treeId}&view=tree`
        : `/dashboard/members?treeId=${treeId}&view=tree`,
    );
  };

  return (
    <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <header className="border-b border-stone-200 bg-stone-950 px-5 py-5 text-white sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-emerald-400 text-stone-950">
              <ScanSearch className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Nhập Excel thông minh</h2>
              <p className="mt-1 text-sm text-stone-300">
                Có thể nhập chỉ danh sách người, nhập quan hệ bằng tên, hoặc dùng mã nâng cao.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {templateButtons.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.kind}
                  type="button"
                  onClick={() => downloadTemplate(item.kind)}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/20 px-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Icon className="size-4" />
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-2" aria-label={`Bước ${progressStep} trên 4`}>
          {["Tải file", "Nhận diện cột", "Kiểm tra", "Hoàn tất"].map((label, index) => (
            <div key={label}>
              <div className={`h-1 rounded-sm ${index < progressStep ? "bg-emerald-400" : "bg-white/15"}`} />
              <p className={`mt-1 text-[11px] font-semibold ${index < progressStep ? "text-white" : "text-stone-500"}`}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </header>

      <div className="p-5 sm:p-6">
        {error && (
          <div role="alert" className="mb-5 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
            {error}
          </div>
        )}

        {step === "upload" && (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex min-h-64 flex-col items-center justify-center border-2 border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center transition hover:border-emerald-500 hover:bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {loading ? <Loader2 className="size-8 animate-spin text-emerald-600" /> : <Upload className="size-8 text-emerald-600" />}
              <span className="mt-4 text-base font-bold text-stone-900">
                {loading ? "Đang quét workbook..." : "Chọn file Excel"}
              </span>
              <span className="mt-2 text-sm text-stone-500">Hỗ trợ XLSX, XLS và CSV; tối đa 5.000 dòng.</span>
            </button>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <ShieldCheck className="size-5 text-emerald-700" />
              <h3 className="mt-3 text-sm font-black text-emerald-950">Luồng an toàn</h3>
              <div className="mt-3 space-y-2 text-sm font-medium leading-6 text-emerald-900/80">
                <p>File chỉ có người vẫn import được. Đời thứ sẽ để chưa xác định cho tới khi nối quan hệ.</p>
                <p>File có quan hệ có thể dùng tên cha/mẹ/vợ/chồng; mã thành viên chỉ là lựa chọn nâng cao.</p>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void scanFile(file);
          }}
        />

        {step === "mapping" && workbook && mapping && selectedSheet && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1.5fr_180px]">
              <label className="block text-sm font-semibold text-stone-700">
                Sheet dữ liệu
                <select value={mapping.sheetName} onChange={(event) => chooseSheet(event.target.value)} className="mt-1.5 w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm">
                  {workbook.sheets.map((sheet) => <option key={sheet.name} value={sheet.name}>{sheet.name}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold text-stone-700">
                Dòng tiêu đề
                <select value={mapping.headerRowIndex} onChange={(event) => chooseHeaderRow(Number(event.target.value))} className="mt-1.5 w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm">
                  {headerOptions.map((option) => <option key={option.index} value={option.index}>{option.label}</option>)}
                </select>
              </label>
              <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2.5">
                <p className="text-xs font-bold uppercase text-stone-500">Độ tin cậy</p>
                <p className={`mt-1 text-xl font-black ${confidence >= 0.75 ? "text-emerald-700" : "text-amber-700"}`}>{Math.round(confidence * 100)}%</p>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-stone-900">Kiểm tra cột hệ thống tự nhận diện</h3>
                  <p className="text-sm text-stone-500">Hệ thống đã tự chọn cột phù hợp. Chỉ sửa các ô chọn bên dưới nếu thấy cột bị nhận nhầm.</p>
                </div>
                <span className="rounded bg-stone-100 px-2 py-1 text-xs font-bold text-stone-600">
                  {detectedFriendlyCount}/{friendlyFields.length} cột
                </span>
              </div>
              <div className="grid gap-2 rounded-md border border-stone-200 bg-stone-50 p-3 sm:grid-cols-2 lg:grid-cols-3">
                {friendlyFields.map((field) => {
                  const label = mappedColumnLabel(field);
                  const required = requiredFields.includes(field);
                  return (
                    <div
                      key={field}
                      className={`rounded-md border bg-white p-3 ${
                        label
                          ? "border-emerald-100"
                          : required
                            ? "border-red-200"
                            : "border-stone-200"
                      }`}
                    >
                      <p className="truncate text-xs font-black uppercase text-stone-500">
                        {IMPORT_FIELD_LABELS[field]}
                      </p>
                      <p
                        className={`mt-1 truncate text-sm font-black ${
                          label
                            ? "text-stone-900"
                            : required
                              ? "text-red-700"
                              : "text-stone-400"
                        }`}
                      >
                        {label ?? (required ? "Cần chọn cột" : "Không dùng")}
                      </p>
                    </div>
                  );
                })}
              </div>
              <details
                open={mapping.columns.full_name == null || confidence < 0.75 ? true : undefined}
                className="mt-4 rounded-md border border-stone-200 bg-white p-4"
              >
                <summary className="cursor-pointer text-sm font-black text-stone-800">
                  Sửa cột nhận diện thủ công
                </summary>
                <p className="mt-2 text-sm font-medium leading-6 text-stone-500">
                  Chỉ cần mở phần này khi hệ thống nhận nhầm cột. Nếu file chỉ có danh sách người, có thể để trống toàn bộ cột quan hệ.
                </p>
                <div className="mt-4 grid gap-x-5 gap-y-3 border-t border-stone-100 pt-4 sm:grid-cols-2">
                  {friendlyFields.map((field) => (
                    <ColumnSelect
                      key={field}
                      field={field}
                      mapping={mapping}
                      columnHeaders={columnHeaders}
                      onChange={updateColumn}
                    />
                  ))}
                </div>
              </details>
              <details className="mt-3 rounded-md border border-stone-200 bg-stone-50 p-4">
                <summary className="cursor-pointer text-sm font-black text-stone-700">
                  Trường nâng cao
                </summary>
                <div className="mt-4 grid gap-x-5 gap-y-3 sm:grid-cols-2">
                  {advancedFields.map((field) => (
                    <ColumnSelect
                      key={field}
                      field={field}
                      mapping={mapping}
                      columnHeaders={columnHeaders}
                      onChange={updateColumn}
                    />
                  ))}
                </div>
              </details>
            </div>

            <div className="overflow-x-auto border border-stone-200">
              <table className="min-w-full text-xs">
                <tbody>
                  {selectedSheet.rows.slice(Math.max(0, mapping.headerRowIndex - 1), mapping.headerRowIndex + 4).map((row, rowIndex) => {
                    const absoluteIndex = Math.max(0, mapping.headerRowIndex - 1) + rowIndex;
                    return (
                      <tr key={absoluteIndex} className={absoluteIndex === mapping.headerRowIndex ? "bg-emerald-50 font-bold text-emerald-950" : "border-t border-stone-100"}>
                        <td className="w-12 bg-stone-50 px-2 py-2 text-center font-mono text-stone-400">{absoluteIndex + 1}</td>
                        {row.slice(0, 10).map((cell, index) => <td key={index} className="max-w-48 truncate border-l border-stone-100 px-3 py-2">{String(cell ?? "")}</td>)}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" onClick={reset} className="btn"><ArrowLeft className="size-4" /> Chọn file khác</button>
              <button type="button" onClick={handlePreview} disabled={loading || mapping.columns.full_name == null} className="btn-primary">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <ScanSearch className="size-4" />}
                Kiểm tra dữ liệu
              </button>
            </div>
          </div>
        )}

        {step === "preview" && preview && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Metric label="Tạo mới" value={preview.counts.personsToCreate} tone="emerald" />
              <Metric label="Cập nhật" value={preview.counts.personsToUpdate} tone="sky" />
              <Metric label="Quan hệ mới" value={preview.counts.relationshipsToCreate} tone="amber" />
              <Metric label="Quan hệ đã có" value={preview.counts.relationshipsSkipped} tone="stone" />
            </div>

            {preview.counts.relationshipsToCreate + preview.counts.relationshipsSkipped === 0 && (
              <div className="rounded-md border border-sky-200 bg-sky-50 p-4 text-sm font-semibold text-sky-800">
                File này đang là danh sách thành viên độc lập. Sau khi import, dùng bản đồ quan hệ bên dưới để nối cha/mẹ, vợ/chồng và hệ thống sẽ tính lại đời thứ.
              </div>
            )}

            {(blockingIssues.length > 0 || warningIssues.length > 0) && (
              <div className="overflow-hidden rounded-md border border-stone-200">
                <div className="bg-stone-50 px-4 py-3 text-sm font-bold text-stone-800">
                  {blockingIssues.length} lỗi, {warningIssues.length} cảnh báo
                </div>
                <div className="max-h-64 divide-y divide-stone-100 overflow-y-auto">
                  {[...blockingIssues, ...warningIssues].map((issue, index) => (
                    <div key={`${issue.code}-${index}`} className="flex items-start gap-3 px-4 py-3 text-sm">
                      <span className={`mt-1 size-2 shrink-0 rounded-full ${issue.severity === "error" ? "bg-red-500" : "bg-amber-500"}`} />
                      <div>
                        <p className="font-semibold text-stone-800">{issue.message}</p>
                        {issue.rowNumbers?.length ? <p className="mt-1 text-xs text-stone-500">Dòng {issue.rowNumbers.join(", ")}</p> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="overflow-x-auto border border-stone-200">
              <table className="w-full min-w-[680px] text-sm">
                <thead className="bg-stone-50 text-left text-xs uppercase text-stone-500">
                  <tr><th className="px-3 py-2">Dòng</th><th className="px-3 py-2">Thành viên</th><th className="px-3 py-2">Xử lý</th><th className="px-3 py-2">Căn cứ</th></tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {preview.rows.slice(0, 100).map((row) => (
                    <tr key={row.internalKey}>
                      <td className="px-3 py-2 font-mono text-xs text-stone-400">{row.rowNumber}</td>
                      <td className="px-3 py-2 font-semibold text-stone-800">{row.fullName}</td>
                      <td className="px-3 py-2"><span className={`rounded px-2 py-1 text-xs font-bold ${row.action === "create" ? "bg-emerald-100 text-emerald-800" : "bg-sky-100 text-sky-800"}`}>{row.action === "create" ? "Tạo mới" : "Cập nhật"}</span></td>
                      <td className="px-3 py-2 text-stone-500">{row.matchReason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" onClick={() => setStep("mapping")} className="btn"><ArrowLeft className="size-4" /> Sửa cột nhận diện</button>
              <button type="button" onClick={handleApply} disabled={loading || blockingIssues.length > 0} className="btn-primary">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                {blockingIssues.length > 0 ? "Cần xử lý lỗi" : "Áp dụng import"}
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="py-8 text-center" role="status">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="size-7" /></div>
            <h3 className="mt-4 text-xl font-bold text-stone-900">Import hoàn tất</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600">{successMessage}</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={reset} className="btn"><RotateCcw className="size-4" /> Import file khác</button>
              <button type="button" onClick={openRelationshipWorkflow} className="btn">
                <Link2 className="size-4" /> Nối quan hệ
              </button>
              <button
                type="button"
                onClick={() =>
                  router.push(
                    familySlug
                      ? `/dashboard/${familySlug}/members?treeId=${treeId}`
                      : `/dashboard/members?treeId=${treeId}`,
                  )
                }
                className="btn-primary"
              >
                Xem thành viên <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ColumnSelect({
  field,
  mapping,
  columnHeaders,
  onChange,
}: {
  field: ImportField;
  mapping: ImportMapping;
  columnHeaders: Array<{ index: number; label: string }>;
  onChange: (field: ImportField, value: string) => void;
}) {
  return (
    <label className="grid grid-cols-[minmax(120px,0.8fr)_1.2fr] items-center gap-3 text-sm">
      <span className="font-semibold text-stone-700">
        {IMPORT_FIELD_LABELS[field]}{field === "full_name" ? " *" : ""}
      </span>
      <select value={mapping.columns[field] ?? ""} onChange={(event) => onChange(field, event.target.value)} className="min-w-0 rounded-md border border-stone-300 bg-white px-2.5 py-2 text-sm text-stone-800">
        <option value="">Không sử dụng</option>
        {columnHeaders.map((column) => <option key={column.index} value={column.index}>{column.label}</option>)}
      </select>
    </label>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "emerald" | "sky" | "amber" | "stone" }) {
  const styles = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    sky: "border-sky-200 bg-sky-50 text-sky-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    stone: "border-stone-200 bg-stone-50 text-stone-700",
  };
  return <div className={`rounded-md border p-3 ${styles[tone]}`}><p className="text-xs font-bold uppercase">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>;
}
