import { numberToText } from "@/shared/utils";
import { getOrganizationName, findOrganizationById } from "../../../utils";

export function calculateDaysDifference(startDate: Date, endDate: Date): number {
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getDaysDeclension(days: number): string {
  const lastDigit = days % 10;
  const lastTwoDigits = days % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "дней";
  }
  if (lastDigit === 1) {
    return "день";
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return "дня";
  }
  return "дней";
}

function getMonthsDeclension(months: number): string {
  const lastDigit = months % 10;
  const lastTwoDigits = months % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "месяцев";
  }
  if (lastDigit === 1) {
    return "месяц";
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return "месяца";
  }
  return "месяцев";
}

function formatDaysTerm(days: number, locale: "ru" | "kk"): string {
  const daysText = numberToText(days, locale);
  if (locale === "ru") {
    const declension = getDaysDeclension(days);
    return `${days} (${daysText}) ${declension}`;
  }
  return `${days} (${daysText}) күн`;
}

function formatMonthsTerm(months: number, locale: "ru" | "kk"): string {
  const monthsText = numberToText(months, locale);
  if (locale === "ru") {
    const declension = getMonthsDeclension(months);
    return `${months} (${monthsText}) ${declension}`;
  }
  return `${months} (${monthsText}) ай`;
}

export function calculateRentalTerm(
  startDate: Date | null | undefined,
  endDate: Date | null | undefined,
  locale: "ru" | "kk" = "ru",
): string {
  if (!startDate || !endDate || endDate <= startDate) {
    return "";
  }

  const diffDays = calculateDaysDifference(startDate, endDate);
  if (diffDays < 30) {
    return formatDaysTerm(diffDays, locale);
  }
  const months = Math.round(diffDays / 30);
  return formatMonthsTerm(months, locale);
}

export function extractAreaNumber(area: string | undefined | null): string {
  if (!area) return "";

  return area
    .replace(/кв\.?\s?м\.?/gi, "")
    .replace(/м²/gi, "")
    .replace(/м2/gi, "")
    .trim();
}

export { getOrganizationName, findOrganizationById };
