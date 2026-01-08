import type { Locale } from "@/shared/utils/types";
import { MONTHS_RU, MONTHS_KK, MONTHS_EN } from "@/shared/consts";

export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("");
}

export function formatTimesheetPeriod(month: number, year: number, locale: Locale): string {
  const months = locale === "kk" ? MONTHS_KK : locale === "en" ? MONTHS_EN : MONTHS_RU;
  const monthName = months[month - 1] || "";
  return `${monthName} ${year}`;
}

