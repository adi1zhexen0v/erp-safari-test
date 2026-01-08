// @ts-expect-error - qazaq-tili не имеет типов
import qts from "qazaq-tili";

export function formatDateForDisplay(date: Date | string | null, includeTime?: boolean): string {
  if (!date) return "";

  if (typeof date === "string") {
    date = new Date(date);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const shouldIncludeTime = includeTime !== undefined ? includeTime : hours !== 0 || minutes !== 0;

  if (shouldIncludeTime) {
    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    return `${day}.${month}.${year}, ${hh}:${mm}`;
  }

  return `${day}.${month}.${year}`;
}

export function formatDateToISO(date: Date | string | null): string {
  if (!date) return "";

  if (typeof date === "string") {
    date = new Date(date);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * @deprecated Используйте formatDateForDisplay вместо этого
 * Оставлено для обратной совместимости
 */
export function formatDateForApi(date: Date | string | null): string {
  return formatDateForDisplay(date);
}

/**
 * Форматирует дату для API запросов в ISO формате
 * @deprecated Используйте formatDateToISO вместо этого
 * Оставлено для обратной совместимости, но теперь возвращает ISO формат
 */
export function formatDateYYYYMMDD(date: Date | string | null): string {
  return formatDateToISO(date);
}

export function formatDateForContract(
  date: Date | string | null,
  locale: "ru" | "kk" = "ru",
  shortYear: boolean = false,
  useCases: boolean = false,
): string {
  if (!date) {
    if (locale === "ru") {
      return shortYear ? "«___» __________ 20___ г." : "«___» __________ ____ года";
    } else {
      return shortYear ? "20___ жылғы «___» ______" : "____ жылғы «___» ______";
    }
  }

  if (typeof date === "string") {
    date = new Date(date);
  }

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  if (locale === "ru") {
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];
    const monthName = months[month] || "__________";

    if (shortYear) {
      const short = String(year).slice(2);
      return `«${day}» ${monthName} 20${short} г.`;
    }

    return `«${day}» ${monthName} ${year} года`;
  }

  const monthsKz = [
    "қаңтар",
    "ақпан",
    "наурыз",
    "сәуір",
    "мамыр",
    "маусым",
    "шілде",
    "тамыз",
    "қыркүйек",
    "қазан",
    "қараша",
    "желтоқсан",
  ];

  let monthNameKz = monthsKz[month] || "______";

  if (useCases) {
    monthNameKz = qts(monthNameKz, 2);
  }

  if (shortYear) {
    const short = String(year).slice(2);
    return `20${short} жылғы «${day}» ${monthNameKz}`;
  }

  return `${year} жылғы «${day}» ${monthNameKz}`;
}

/**
 * Форматирует дату для API запросов в ISO формате
 * @deprecated Используйте formatDateToISO вместо этого
 * Оставлено для обратной совместимости, но теперь возвращает ISO формат
 */
export function formatDateForLegalApi(date: Date | string | null): string {
  return formatDateToISO(date);
}

export function formatDateDDMMYYYY(date: Date | string | null): string {
  if (!date) return "";

  if (typeof date === "string") {
    date = new Date(date);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}.${month}.${year}`;
}

export function convertFromContractFormat(dateStr: string): string {
  if (!dateStr) return "";

  // Определяем формат: казахский (год в начале) или русский (год в конце)
  const isKazakhFormat = /^\d{2,4}\s+жылғы/.test(dateStr);

  if (isKazakhFormat) {
    // Казахский формат: "2024 жылғы «15» қаңтар" или "24 жылғы «15» қаңтар"
    const matchKz = dateStr.match(/(\d{2,4})\s+жылғы\s+«(\d{1,2})»\s+([а-яёқғңһұүіө]+)/iu);
    if (!matchKz) return "";

    const [, year, day, monthName] = matchKz;

    const processedDay = day.padStart(2, "0");
    const processedMonthName = monthName.toLowerCase();
    const processedYear = year.length === 2 ? "20" + year : year;

    const monthsKz = [
      "қаңтар",
      "ақпан",
      "наурыз",
      "сәуір",
      "мамыр",
      "маусым",
      "шілде",
      "тамыз",
      "қыркүйек",
      "қазан",
      "қараша",
      "желтоқсан",
    ];

    // Проверяем также формы с падежами (используется qazaq-tili)
    const monthIndex = monthsKz.findIndex((m) => processedMonthName.includes(m) || m.includes(processedMonthName));
    if (monthIndex === -1) return "";

    const month = String(monthIndex + 1).padStart(2, "0");

    return `${processedDay}.${month}.${processedYear}`;
  } else {
    // Русский формат: "«15» января 2024 года" или "«15» января 24 г."
    const matchRu = dateStr.match(/«(\d{1,2})»\s+([А-Яа-яё]+)\s+(\d{2,4})/u);
    if (!matchRu) return "";

    const [, day, monthName, year] = matchRu;

    const processedDay = day.padStart(2, "0");
    const processedMonthName = monthName.toLowerCase();
    const processedYear = year.length === 2 ? "20" + year : year;

    const monthsRu = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];

    const monthIndex = monthsRu.indexOf(processedMonthName);
    if (monthIndex === -1) return "";

    const month = String(monthIndex + 1).padStart(2, "0");

    return `${processedDay}.${month}.${processedYear}`;
  }
}

export function parseDateFromContractFormat(dateStr: string): Date | null {
  if (!dateStr) return null;
  const ddMMyyyy = convertFromContractFormat(dateStr);
  if (!ddMMyyyy) return null;
  const [day, month, year] = ddMMyyyy.split(".");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}
