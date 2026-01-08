import type { Locale } from "@/shared/utils/types";

export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("");
}

export function formatPayrollAmount(amount: string | number, locale: Locale = "ru"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0";

  return new Intl.NumberFormat(locale === "kk" ? "kk-KZ" : locale === "en" ? "en-US" : "ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}
