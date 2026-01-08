import { useState } from "react";

export interface RangeValue {
  start: Date | null;
  end: Date | null;
}

export type CalendarMode = "single" | "range";

export function useCalendar(
  value: RangeValue | Date | null | undefined,
  onChange?: (v: RangeValue | Date | null) => void,
  mode: CalendarMode = "range",
  hasTime: boolean = false,
) {
  const safeRange: RangeValue =
    mode === "range"
      ? ((value as RangeValue) ?? { start: null, end: null })
      : { start: (value as Date | null) ?? null, end: null };

  const initialMonth = mode === "range" ? (safeRange.start ?? new Date()) : (safeRange.start ?? new Date());

  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);
  const [view, setView] = useState<"day" | "year">("day");

  function next() {
    const d = new Date(currentMonth);
    if (view === "day") d.setMonth(d.getMonth() + 1);
    else d.setFullYear(d.getFullYear() + 12);
    setCurrentMonth(d);
  }

  function prev() {
    const d = new Date(currentMonth);
    if (view === "day") d.setMonth(d.getMonth() - 1);
    else d.setFullYear(d.getFullYear() - 12);
    setCurrentMonth(d);
  }

  function goYearMode() {
    setView((prev) => (prev === "day" ? "year" : "day"));
  }

  function selectYear(year: number) {
    const d = new Date(currentMonth);
    d.setFullYear(year);
    setCurrentMonth(d);
    setView("day");
  }

  function selectDate(date: Date) {
    // Preserve time when hasTime is true
    const preserveTime = (newDate: Date, existingDate: Date | null) => {
      if (hasTime) {
        if (existingDate) {
          newDate.setHours(existingDate.getHours(), existingDate.getMinutes(), 0, 0);
        }
        return newDate;
      }

      // фикс против timezone-сдвига
      newDate.setHours(12, 0, 0, 0);
      return newDate;
    };

    if (mode === "single") {
      const dateWithTime = preserveTime(new Date(date), safeRange.start);
      onChange?.(dateWithTime);
      return;
    }

    const { start, end } = safeRange;

    if (!start) {
      const dateWithTime = preserveTime(new Date(date), null);
      onChange?.({ start: dateWithTime, end: null });
      return;
    }

    if (start && !end) {
      if (date < start) {
        const newStart = preserveTime(new Date(date), null);
        const newEnd = preserveTime(new Date(start), start);
        onChange?.({ start: newStart, end: newEnd });
      } else {
        const newEnd = preserveTime(new Date(date), null);
        onChange?.({ start, end: newEnd });
      }
      return;
    }

    const dateWithTime = preserveTime(new Date(date), null);
    onChange?.({ start: dateWithTime, end: null });
  }

  function reset(value: RangeValue | Date | null) {
    if (mode === "single") {
      setCurrentMonth((value as Date | null) ?? new Date());
    } else {
      const v = value as RangeValue;
      setCurrentMonth(v.start ?? new Date());
    }
    setView("day");
  }

  return {
    view,
    currentMonth,
    next,
    prev,
    goYearMode,
    selectYear,
    selectDate,
    reset,
  };
}
