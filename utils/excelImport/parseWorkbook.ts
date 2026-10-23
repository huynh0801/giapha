import { detectHeaderCandidates } from "@/utils/excelImport/detectColumns";
import type {
  CellValue,
  ParsedWorkbook,
} from "@/utils/excelImport/types";

export async function parseExcelWorkbook(file: File): Promise<ParsedWorkbook> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(await file.arrayBuffer(), {
    type: "array",
    cellDates: true,
  });
  const sheets = workbook.SheetNames.map((name) => {
    const worksheet = workbook.Sheets[name];
    const rows = XLSX.utils.sheet_to_json<CellValue[]>(worksheet, {
      header: 1,
      raw: false,
      defval: "",
      blankrows: true,
    });
    while (
      rows.length > 0 &&
      rows[rows.length - 1].every((value) => String(value ?? "").trim() === "")
    ) {
      rows.pop();
    }
    const candidates = detectHeaderCandidates(rows);
    return {
      name,
      rows,
      detectedHeaderRowIndex: candidates[0]?.rowIndex ?? null,
      candidates,
    };
  });
  return { fileName: file.name, sheets };
}
