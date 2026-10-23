import type { Gender, RelationshipType } from "@/types";
import type {
  ComputedPersonLineage,
  GenealogyIssue,
} from "@/utils/genealogyEngine";

export type CellValue = string | number | boolean | null;

export const IMPORT_FIELDS = [
  "person_key",
  "full_name",
  "gender",
  "parent_keys",
  "father_key",
  "mother_key",
  "spouse_keys",
  "birth_order",
  "generation",
  "birth_year",
  "birth_month",
  "birth_day",
  "death_year",
  "death_month",
  "death_day",
  "death_anniversary",
  "death_lunar_year",
  "death_lunar_month",
  "death_lunar_day",
  "other_names",
  "note",
  "phone_number",
  "occupation",
  "current_residence",
  "is_root",
] as const;

export type ImportField = (typeof IMPORT_FIELDS)[number];

export const IMPORT_FIELD_LABELS: Record<ImportField, string> = {
  person_key: "Mã thành viên (tùy chọn)",
  full_name: "Họ và tên",
  gender: "Giới tính",
  parent_keys: "Cha/mẹ (theo tên)",
  father_key: "Cha (theo tên)",
  mother_key: "Mẹ (theo tên)",
  spouse_keys: "Vợ/chồng (theo tên)",
  birth_order: "Thứ tự sinh",
  generation: "Đời thứ trong file",
  birth_year: "Năm sinh",
  birth_month: "Tháng sinh",
  birth_day: "Ngày sinh",
  death_year: "Năm mất",
  death_month: "Tháng mất",
  death_day: "Ngày mất",
  death_anniversary: "Ngày giỗ (âm lịch)",
  death_lunar_year: "Năm mất âm lịch",
  death_lunar_month: "Tháng giỗ âm lịch",
  death_lunar_day: "Ngày giỗ âm lịch",
  other_names: "Tên gọi khác",
  note: "Ghi chú",
  phone_number: "Số điện thoại",
  occupation: "Nghề nghiệp",
  current_residence: "Nơi ở hiện tại",
  is_root: "Người gốc",
};

export interface HeaderCandidate {
  rowIndex: number;
  confidence: number;
  mappedColumns: Partial<Record<ImportField, number>>;
}

export interface ParsedSheet {
  name: string;
  rows: CellValue[][];
  detectedHeaderRowIndex: number | null;
  candidates: HeaderCandidate[];
}

export interface ParsedWorkbook {
  fileName: string;
  sheets: ParsedSheet[];
}

export interface ImportMapping {
  sheetName: string;
  headerRowIndex: number;
  columns: Partial<Record<ImportField, number>>;
}

export interface NormalizedImportRow {
  rowNumber: number;
  person_key: string | null;
  full_name: string;
  gender: Gender | null;
  parent_keys: string[];
  father_key: string | null;
  mother_key: string | null;
  spouse_keys: string[];
  birth_order: number | null;
  generation: number | null;
  birth_year: number | null;
  birth_month: number | null;
  birth_day: number | null;
  death_year: number | null;
  death_month: number | null;
  death_day: number | null;
  death_lunar_year: number | null;
  death_lunar_month: number | null;
  death_lunar_day: number | null;
  other_names: string | null;
  note: string | null;
  phone_number: string | null;
  occupation: string | null;
  current_residence: string | null;
  is_root: boolean;
}

export interface ImportPreviewRow {
  rowNumber: number;
  internalKey: string;
  personId: string;
  fullName: string;
  action: "create" | "update" | "skip";
  matchReason: string;
  warnings: string[];
}

export interface ImportPersonPlan {
  internalKey: string;
  rowNumber: number;
  existingId: string | null;
  previewId: string;
  action: "create" | "update";
  payload: {
    external_ref: string | null;
    full_name: string;
    gender: Gender;
    birth_year: number | null;
    birth_month: number | null;
    birth_day: number | null;
    death_year: number | null;
    death_month: number | null;
    death_day: number | null;
    death_lunar_year: number | null;
    death_lunar_month: number | null;
    death_lunar_day: number | null;
    is_deceased: boolean;
    birth_order: number | null;
    other_names: string | null;
    note: string | null;
  };
  privatePayload: {
    phone_number: string | null;
    occupation: string | null;
    current_residence: string | null;
  };
}

export interface ImportRelationshipPlan {
  sourceInternalKey: string;
  targetInternalKey: string;
  type: RelationshipType;
  rowNumber: number;
}

export interface ImportPlan {
  persons: ImportPersonPlan[];
  relationships: ImportRelationshipPlan[];
  rows: ImportPreviewRow[];
  issues: GenealogyIssue[];
  lineageUpdates: ComputedPersonLineage[];
  rootInternalKey: string | null;
  counts: {
    personsToCreate: number;
    personsToUpdate: number;
    relationshipsToCreate: number;
    relationshipsSkipped: number;
  };
}
