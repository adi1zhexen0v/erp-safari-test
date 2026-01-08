import { CALENDAR_LOCALE } from "@/shared/ui/DatePicker/locale";
import type { Locale } from "./types";

export function getMonthName(month: number, locale: Locale): string {
  const monthIndex = month - 1;
  if (monthIndex < 0 || monthIndex > 11) {
    return "";
  }
  return CALENDAR_LOCALE[locale].months[monthIndex];
}

