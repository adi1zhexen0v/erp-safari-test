import type { Locale } from "@/shared/utils/types";
import type { DailyStatusCode } from "../types";

export function getDailyStatusCodeLabel(code: DailyStatusCode, locale: Locale): string {
  const labels: Record<Locale, Record<DailyStatusCode, string>> = {
    ru: {
      "8": "8ч - Работа",
      "4": "4ч - Полдня",
      В: "В - Выходной",
      О: "О - Отпуск",
      Б: "Б - Больничный",
      А: "А - Без содержания",
      К: "К - Командировка",
      Р: "Р - Декрет",
      П: "П - Прогул",
      "": "Не трудоустроен",
    },
    en: {
      "8": "8h - Work",
      "4": "4h - Half day",
      В: "W - Weekend",
      О: "L - Leave",
      Б: "S - Sick",
      А: "U - Unpaid",
      К: "T - Trip",
      Р: "M - Maternity",
      П: "A - Absence",
      "": "Not employed",
    },
    kk: {
      "8": "8сағ - Жұмыс",
      "4": "4сағ - Жарты күн",
      В: "В - Демалыс",
      О: "О - Еңбек демалысы",
      Б: "Б - Ауру",
      А: "А - Ақысыз",
      К: "К - Кәсіби сапар",
      Р: "Р - Аналық",
      П: "П - Қатыспау",
      "": "Жұмыста емес",
    },
  };

  return labels[locale]?.[code] || code;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}
