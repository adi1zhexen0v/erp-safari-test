import { type Locale } from "@/shared/utils/types";
import type { DatePickerMode } from "../DatePicker";
import { CALENDAR_LOCALE } from "./locale";

interface RangeValue {
  start: Date | null;
  end: Date | null;
}

interface Props {
  month: Date;
  onSelect: (d: Date) => void;
  range: RangeValue;
  hoverDate?: Date | null;
  onHover?: (d: Date | null) => void;
  locale: Locale;
  mode?: DatePickerMode;
}

export default function CalendarDays({ month, onSelect, range, hoverDate, onHover, locale, mode = "range" }: Props) {
  const t = CALENDAR_LOCALE[locale];
  const isRange = mode === "range";

  const year = month.getFullYear();
  const m = month.getMonth();

  const firstDay = new Date(year, m, 1);
  const lastDay = new Date(year, m + 1, 0);

  const startOffset = (firstDay.getDay() || 7) - 1;
  const days: (Date | null)[] = [];

  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, m, d, 12, 0, 0, 0));

  const { start, end } = range;

  function isSameDay(a: Date | null, b: Date | null) {
    return a && b && a.toDateString() === b.toDateString();
  }

  function isInRange(d: Date) {
    if (!isRange) return false;

    if (start && end) return d > start && d < end;
    if (start && hoverDate) return d > start && d < hoverDate;
    return false;
  }

  const gridCell = "relative w-[2.125rem] h-8 flex items-center justify-center cursor-pointer";

  return (
    <div className="grid grid-cols-7 gap-y-1">
      {t.weekdays.map((w) => (
        <div key={w} className="w-[2.125rem] h-8 flex items-center justify-center text-body-regular-sm text-grey-400">
          {w}
        </div>
      ))}

      {days.map((d, i) => {
        if (!d) return <div key={i} className="w-[2.125rem] h-8" />;

        const isStart = isRange && isSameDay(d, start);
        const isEnd = isRange && isSameDay(d, end);

        const inRange = isRange ? isInRange(d) : false;

        const isHoverEnd = isRange && !end && hoverDate && isSameDay(d, hoverDate);
        const isSingleSelected = !isRange && isSameDay(d, start);

        const showBg = isRange && (inRange || isStart || isEnd || isHoverEnd);

        const bgClasses = [
          "absolute inset-0",
          inRange ? "bg-black/10" : "",
          isStart ? "rounded-l-full bg-black/10" : "",
          isEnd || isHoverEnd ? "rounded-r-full bg-black/10" : "",
        ].join(" ");

        const fgClasses = [
          "relative z-10 w-[2.75rem] h-8 flex items-center justify-center radius-xs text-grey-950 dark:text-grey-200",
          isRange
            ? isStart || isEnd || isHoverEnd
              ? "bg-primary-500 text-white"
              : "hover:bg-black/5!"
            : isSingleSelected
              ? "bg-primary-500 text-white"
              : "hover:bg-black/5!",
        ].join(" ");

        return (
          <button
            type="button"
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(d);
            }}
            onMouseEnter={() => isRange && onHover?.(d)}
            onMouseLeave={() => isRange && onHover?.(null)}
            className={gridCell}>
            {showBg && <div className={bgClasses}></div>}

            <div className={fgClasses}>{d.getDate()}</div>
          </button>
        );
      })}
    </div>
  );
}
