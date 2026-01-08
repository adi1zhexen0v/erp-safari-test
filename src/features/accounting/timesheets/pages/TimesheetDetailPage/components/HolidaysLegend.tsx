import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import type { Locale } from "@/shared/utils/types";
import { HOLIDAYS } from "@/shared/consts/holidays";

interface HolidaysLegendProps {
  month: number;
}

export default function HolidaysLegend({ month }: HolidaysLegendProps) {
  const { t } = useTranslation("TimesheetsPage");
  const locale = (i18n.language as Locale) || "ru";

  const monthHolidays = useMemo(() => {
    return HOLIDAYS.filter((holiday) => holiday.month === month);
  }, [month]);

  if (monthHolidays.length === 0) {
    return null;
  }

  function getName(holiday: (typeof HOLIDAYS)[0]): string {
    if (locale === "ru") return holiday.name_ru;
    if (locale === "kk") return holiday.name_kk;
    return holiday.name_en;
  }

  return (
    <div className="mb-7">
      <p className="text-label-md content-base-primary mb-3">{t("detail.holidays")}</p>
      <div className="flex flex-wrap gap-5 mb-5">
        {monthHolidays.map((holiday) => (
          <div key={holiday.id} className="flex items-center gap-2 justify-start">
            <div className="w-8 aspect-square flex items-center justify-center background-brand-subtle radius-xs text-body-bold-sm">
              {holiday.day}
            </div>
            <p className="text-body-regular-sm content-base-primary">{getName(holiday)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
