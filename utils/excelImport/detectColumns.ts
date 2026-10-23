import {
  IMPORT_FIELDS,
  type CellValue,
  type HeaderCandidate,
  type ImportField,
  type ImportMapping,
  type NormalizedImportRow,
} from "@/utils/excelImport/types";

const FIELD_SYNONYMS: Record<ImportField, string[]> = {
  person_key: [
    "ma",
    "ma nguoi",
    "ma thanh vien",
    "id",
    "code",
    "person id",
    "person key",
    "stt",
  ],
  full_name: [
    "ho ten",
    "ho va ten",
    "ten",
    "name",
    "full name",
    "thanh vien",
    "nguoi",
  ],
  gender: ["gioi tinh", "sex", "gender", "nam nu"],
  parent_keys: [
    "cha me",
    "bo me",
    "phu huynh",
    "cha va me",
    "ten cha me",
    "parents",
    "parent",
  ],
  father_key: ["cha", "bo", "ten cha", "ma cha", "ma bo", "father", "father id"],
  mother_key: ["me", "ten me", "ma me", "mother", "mother id"],
  spouse_keys: [
    "vo chong",
    "chong vo",
    "vo",
    "chong",
    "ten vo chong",
    "ma vo chong",
    "spouse",
    "husband",
    "wife",
  ],
  birth_order: ["thu tu sinh", "con thu", "birth order", "order"],
  generation: ["doi", "doi thu", "thuoc doi thu", "the he", "generation"],
  birth_year: ["nam sinh", "birth year", "year of birth"],
  birth_month: ["thang sinh", "birth month"],
  birth_day: ["ngay sinh", "birth day"],
  death_year: ["nam mat", "nam chet", "death year"],
  death_month: ["thang mat", "death month"],
  death_day: ["ngay mat", "death day"],
  death_anniversary: [
    "ngay gio",
    "ngay gio am lich",
    "gio",
    "death anniversary",
    "lunar death date",
  ],
  death_lunar_year: ["nam mat am lich", "nam gio", "lunar death year"],
  death_lunar_month: [
    "thang gio",
    "thang mat am lich",
    "thang gio am lich",
    "lunar death month",
  ],
  death_lunar_day: [
    "ngay gio am",
    "ngay mat am lich",
    "ngay gio am lich",
    "lunar death day",
  ],
  other_names: ["ten khac", "ten goi khac", "bi danh", "other names", "alias"],
  note: ["ghi chu", "note", "remark", "chu thich"],
  phone_number: ["so dien thoai", "dien thoai", "sdt", "phone", "phone number"],
  occupation: ["nghe nghiep", "cong viec", "occupation", "job"],
  current_residence: ["noi o", "noi cu tru", "dia chi", "residence", "address"],
  is_root: ["nguoi goc", "goc", "root", "is root"],
};

export function normalizeText(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function fieldForHeader(value: CellValue) {
  const normalized = normalizeText(value);
  if (!normalized) return null;
  let bestField: ImportField | null = null;
  let bestScore = 0;
  for (const field of IMPORT_FIELDS) {
    for (const synonym of FIELD_SYNONYMS[field]) {
      const exact = normalized === synonym;
      const canUsePartialMatch = normalized.length >= 4 && synonym.length >= 4;
      const contained =
        canUsePartialMatch &&
        (normalized.includes(synonym) || synonym.includes(normalized));
      const score = exact ? 1 : contained && normalized.length >= 3 ? 0.72 : 0;
      if (score > bestScore) {
        bestField = field;
        bestScore = score;
      }
    }
  }
  return bestField ? { field: bestField, score: bestScore } : null;
}

export function detectHeaderCandidates(rows: CellValue[][]): HeaderCandidate[] {
  const candidates: HeaderCandidate[] = [];
  rows.slice(0, 30).forEach((row, rowIndex) => {
    const mappedColumns: Partial<Record<ImportField, number>> = {};
    let matchedScore = 0;
    row.forEach((cell, columnIndex) => {
      const match = fieldForHeader(cell);
      if (!match || mappedColumns[match.field] != null) return;
      mappedColumns[match.field] = columnIndex;
      matchedScore += match.score;
    });
    if (mappedColumns.full_name == null) return;
    const relationshipMatches = [
      mappedColumns.parent_keys,
      mappedColumns.father_key,
      mappedColumns.mother_key,
      mappedColumns.spouse_keys,
    ].filter((value) => value != null).length;
    const identityBonus = mappedColumns.person_key != null ? 0.12 : 0;
    const confidence = Math.min(
      1,
      0.42 + identityBonus + relationshipMatches * 0.12 + Math.min(matchedScore, 5) * 0.055,
    );
    candidates.push({ rowIndex, confidence, mappedColumns });
  });
  return candidates.sort((a, b) => b.confidence - a.confidence);
}

function cellAt(
  row: CellValue[],
  columns: ImportMapping["columns"],
  field: ImportField,
) {
  const index = columns[field];
  return index == null ? null : (row[index] ?? null);
}

function nullableString(value: unknown) {
  const text = String(value ?? "").trim();
  return text || null;
}

function nullableNumber(value: unknown) {
  const text = String(value ?? "").trim().replace(/,/g, ".");
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function parseDateParts(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return {
      day: value.getDate(),
      month: value.getMonth() + 1,
      year: value.getFullYear(),
    };
  }

  const text = String(value ?? "").trim();
  if (!text) return { day: null, month: null, year: null };
  const cleaned = text
    .replace(/\b(al|am lich|lunar)\b/gi, "")
    .replace(/[年月]/g, "/")
    .replace(/[日]/g, "")
    .trim();
  const parts = cleaned
    .split(/[./\-\s]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length < 2) return { day: null, month: null, year: null };

  const numbers = parts.map((part) => Number(part));
  if (numbers.some((number) => !Number.isFinite(number))) {
    return { day: null, month: null, year: null };
  }

  const [first, second, third] = numbers;
  if (first > 31 || second > 12) {
    return { day: null, month: null, year: null };
  }

  return {
    day: first,
    month: second,
    year: third && third > 31 ? third : null,
  };
}

function normalizeGender(value: unknown): NormalizedImportRow["gender"] {
  const gender = normalizeText(value);
  if (["nam", "male", "m", "1"].includes(gender)) return "male";
  if (["nu", "female", "f", "0"].includes(gender)) return "female";
  if (["khac", "other"].includes(gender)) return "other";
  return null;
}

function normalizeBoolean(value: unknown) {
  return ["1", "true", "yes", "x", "co", "goc", "root"].includes(normalizeText(value));
}

function splitReferences(value: unknown) {
  return String(value ?? "")
    .split(/[,;|/\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function rowsToNormalizedImportRows(
  rows: CellValue[][],
  mapping: ImportMapping,
) {
  return rows
    .slice(mapping.headerRowIndex + 1)
    .map((row, index): NormalizedImportRow => {
      const anniversary = parseDateParts(
        cellAt(row, mapping.columns, "death_anniversary"),
      );
      return {
        rowNumber: mapping.headerRowIndex + index + 2,
        person_key: nullableString(cellAt(row, mapping.columns, "person_key")),
        full_name: nullableString(cellAt(row, mapping.columns, "full_name")) ?? "",
        gender: normalizeGender(cellAt(row, mapping.columns, "gender")),
        parent_keys: splitReferences(cellAt(row, mapping.columns, "parent_keys")),
        father_key: nullableString(cellAt(row, mapping.columns, "father_key")),
        mother_key: nullableString(cellAt(row, mapping.columns, "mother_key")),
        spouse_keys: splitReferences(cellAt(row, mapping.columns, "spouse_keys")),
        birth_order: nullableNumber(cellAt(row, mapping.columns, "birth_order")),
        generation: nullableNumber(cellAt(row, mapping.columns, "generation")),
        birth_year: nullableNumber(cellAt(row, mapping.columns, "birth_year")),
        birth_month: nullableNumber(cellAt(row, mapping.columns, "birth_month")),
        birth_day: nullableNumber(cellAt(row, mapping.columns, "birth_day")),
        death_year: nullableNumber(cellAt(row, mapping.columns, "death_year")),
        death_month: nullableNumber(cellAt(row, mapping.columns, "death_month")),
        death_day: nullableNumber(cellAt(row, mapping.columns, "death_day")),
        death_lunar_year:
          nullableNumber(cellAt(row, mapping.columns, "death_lunar_year")) ??
          anniversary.year,
        death_lunar_month:
          nullableNumber(cellAt(row, mapping.columns, "death_lunar_month")) ??
          anniversary.month,
        death_lunar_day:
          nullableNumber(cellAt(row, mapping.columns, "death_lunar_day")) ??
          anniversary.day,
        other_names: nullableString(cellAt(row, mapping.columns, "other_names")),
        note: nullableString(cellAt(row, mapping.columns, "note")),
        phone_number: nullableString(cellAt(row, mapping.columns, "phone_number")),
        occupation: nullableString(cellAt(row, mapping.columns, "occupation")),
        current_residence: nullableString(cellAt(row, mapping.columns, "current_residence")),
        is_root: normalizeBoolean(cellAt(row, mapping.columns, "is_root")),
      };
    })
    .filter((row) => row.full_name || row.person_key);
}

export function getColumnHeaders(rows: CellValue[][], headerRowIndex: number) {
  const row = rows[headerRowIndex] ?? [];
  return row.map((value, index) => ({
    index,
    label: String(value ?? "").trim() || `Cột ${index + 1}`,
  }));
}
