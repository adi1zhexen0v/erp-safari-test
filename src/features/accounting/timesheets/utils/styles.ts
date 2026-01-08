import type { DailyStatusCode } from "../types";
import { isValidCellValue, NON_NUMERIC_CODES } from "./validation";

export interface StatusCodeStyle {
  code: DailyStatusCode;
  className: string;
}

export const STATUS_CODE_STYLES: StatusCodeStyle[] = [
  { code: "8", className: "background-info-subtle background-on-background-strong-info" },
  { code: "4", className: "border surface-info-stroke background-on-background-strong-info" },
  { code: "В", className: "surface-neutral-subtle background-on-background-strong-neutral" },
  { code: "О", className: "surface-positive-subtle background-on-background-strong-positive" },
  { code: "Б", className: "surface-notice-subtle background-on-background-strong-notice" },
  { code: "А", className: "border surface-positive-stroke background-on-background-strong-positive" },
  { code: "К", className: "border surface-notice-stroke background-on-background-strong-notice" },
  { code: "Р", className: "border surface-neutral-stroke background-on-background-strong-neutral" },
  { code: "П", className: "surface-negative-subtle background-on-background-strong-negative" },
];

export function getStatusCodeStyle(code: DailyStatusCode): StatusCodeStyle | undefined {
  return STATUS_CODE_STYLES.find((s) => s.code === code);
}

export function getCellStyle(value: string): StatusCodeStyle | null {
  if (!isValidCellValue(value)) return null;
  if (NON_NUMERIC_CODES.includes(value as DailyStatusCode)) {
    return getStatusCodeStyle(value as DailyStatusCode) || null;
  }
  const num = parseInt(value, 10);
  if (num >= 1 && num <= 4) {
    return getStatusCodeStyle("4") || null;
  }
  if (num >= 5 && num <= 12) {
    return getStatusCodeStyle("8") || null;
  }
  return null;
}

