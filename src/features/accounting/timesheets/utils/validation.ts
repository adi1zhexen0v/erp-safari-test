import type { DailyStatusCode } from "../types";

export const NON_NUMERIC_CODES: DailyStatusCode[] = ["В", "О", "Б", "А", "К", "Р", "П"];

export function isValidCellValue(value: string): boolean {
  if (!value || value === "") return false;
  if (NON_NUMERIC_CODES.includes(value as DailyStatusCode)) return true;
  const num = parseInt(value, 10);
  return !isNaN(num) && num >= 1 && num <= 12;
}

