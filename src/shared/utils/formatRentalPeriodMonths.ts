import { numberToText } from "./formatPrice";

export function formatRentalPeriodMonths(months: number | undefined, locale: "ru" | "kk" = "ru"): string {
  if (!months || months <= 0) {
    return "";
  }

  if (months > 12) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (locale === "ru") {
      const getYearDeclension = (n: number): string => {
        if (n === 1) return "год";
        if (n >= 2 && n <= 4) return "года";
        return "лет";
      };

      const getMonthDeclension = (n: number): string => {
        if (n === 1) return "месяц";
        if (n >= 2 && n <= 4) return "месяца";
        return "месяцев";
      };

      let yearsText = numberToText(years, locale);
      let monthsText = remainingMonths > 0 ? numberToText(remainingMonths, locale) : "";

      if (years === 1 && yearsText === "одна") {
        yearsText = "один";
      }
      if (remainingMonths === 1 && monthsText === "одна") {
        monthsText = "один";
      }

      if (remainingMonths > 0) {
        return `${years} (${yearsText}) ${getYearDeclension(years)} ${remainingMonths} (${monthsText}) ${getMonthDeclension(remainingMonths)}`;
      } else {
        return `${years} (${yearsText}) ${getYearDeclension(years)}`;
      }
    }

    const yearsText = numberToText(years, locale);
    const monthsText = remainingMonths > 0 ? numberToText(remainingMonths, locale) : "";

    if (remainingMonths > 0) {
      return `${years} (${yearsText}) жыл ${remainingMonths} (${monthsText}) ай`;
    } else {
      return `${years} (${yearsText}) жыл`;
    }
  }

  if (locale === "ru") {
    const getMonthDeclension = (n: number): string => {
      if (n === 1) return "месяц";
      if (n >= 2 && n <= 4) return "месяца";
      return "месяцев";
    };
    return `${months} ${getMonthDeclension(months)}`;
  }

  return `${months} ай`;
}
