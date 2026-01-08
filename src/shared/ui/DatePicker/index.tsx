import { useState, useId } from "react";
import { Calendar as CalendarIcon } from "iconsax-react";
import cn from "classnames";
import { type Locale } from "@/shared/utils/types";
import Dropdown from "../Dropdown";
import Calendar from "./Calendar";
import { useCalendar, type RangeValue } from "./useCalendar";
import styles from "./DatePicker.module.css";

export type DatePickerMode = "single" | "range";

export type { RangeValue };

interface BaseDatePickerProps {
  label?: string;
  error?: string;
  placeholder?: string;
  locale: Locale;
  disabled?: boolean;
  hasTime?: boolean;
  direction?: "bottom" | "top";
}

type SingleDateProps = BaseDatePickerProps & {
  mode?: "single";
  value?: Date | null;
  onChange?: (v: Date | null) => void;
};

type RangeDateProps = BaseDatePickerProps & {
  mode: "range";
  value?: RangeValue | null;
  onChange?: (v: RangeValue | null) => void;
};

export type DatePickerProps = SingleDateProps | RangeDateProps;

export default function DatePicker(props: DatePickerProps) {
  const {
    label,
    error,
    mode = "single",
    value,
    onChange,
    placeholder = "Выберите дату",
    locale,
    disabled = false,
    hasTime = false,
    direction = "bottom",
  } = props;

  const [open, setOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const inputId = useId();

  const isRange = mode === "range";

  const safeRange: RangeValue = isRange
    ? ((value as RangeValue | null) ?? { start: null, end: null })
    : { start: (value as Date | null) ?? null, end: null };

  const handleCalendarChange = (v: RangeValue | Date | null) => {
    if (!disabled) {
      if (mode === "single") {
        const dateValue =
          v instanceof Date ? v : v && typeof v === "object" && "start" in v ? (v as RangeValue).start : null;
        (onChange as ((v: Date | null) => void) | undefined)?.(dateValue);
      } else {
        const rangeValue = v && typeof v === "object" && "start" in v ? (v as RangeValue) : null;
        (onChange as ((v: RangeValue | null) => void) | undefined)?.(rangeValue);
      }

      if (!hasTime) {
        if (mode === "single") setOpen(false);

        if (mode === "range" && v && typeof v === "object" && "end" in v && (v as RangeValue).end) {
          setOpen(false);
        }
      }
    }
  };

  const cal = useCalendar(value as RangeValue | Date | null | undefined, handleCalendarChange, mode, hasTime);

  const isPlaceholder = (isRange && !safeRange.start && !safeRange.end) || (!isRange && !(value as Date | null));

  function formatValue() {
    if (isPlaceholder) return placeholder;

    const getLocaleString = (loc: Locale): string => {
      const localeMap: Record<Locale, string> = {
        ru: "ru-RU",
        kk: "kk-KZ",
        en: "en-US",
      };
      return localeMap[loc];
    };

    const formatDateTime = (date: Date) => {
      if (!hasTime) return date.toLocaleDateString(getLocaleString(locale));

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    if (!isRange) {
      const v = value as Date | null;
      return v ? formatDateTime(v) : placeholder;
    }

    const { start, end } = safeRange;
    if (start && !end) return formatDateTime(start);
    return `${start ? formatDateTime(start) : ""} — ${end ? formatDateTime(end) : ""}`;
  }

  return (
    <Dropdown
      open={open && !disabled}
      onClose={() => setOpen(false)}
      direction={direction}
      className="elevation-level-2!">
      <div className="w-full">
        <div className="flex flex-col gap-2">
          {label && (
            <label htmlFor={inputId} className="text-label-sm content-base-primary">
              {label}
            </label>
          )}
          <button
            id={inputId}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled) setOpen((o) => !o);
            }}
            className={cn(
              "w-full flex justify-between items-center px-3 py-3 radius-sm",
              "surface-base-fill input-box-shadow text-body-regular-sm outline-none",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            )}>
            <span
              className={cn(
                "min-w-0 overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-left",
                isPlaceholder ? styles.placeholder : "content-base-secondary",
              )}>
              {formatValue()}
            </span>
            <span className="content-base-secondary w-4 h-4 flex items-center justify-center shrink-0 ml-2">
              <CalendarIcon size={16} color="currentColor" style={{ width: "1rem", height: "1rem" }} />
            </span>
          </button>
          {error && !disabled && <p className="text-body-regular-xs content-action-negative">{error}</p>}
        </div>
      </div>

      {!disabled && (
        <Calendar
          {...cal}
          value={safeRange}
          hoverDate={isRange ? hoverDate : null}
          onHover={isRange ? setHoverDate : undefined}
          locale={locale}
          mode={mode}
          hasTime={hasTime}
          onChange={(v) => {
            if (mode === "single") {
              const dateValue =
                v instanceof Date ? v : v && typeof v === "object" && "start" in v ? (v as RangeValue).start : null;
              (onChange as ((v: Date | null) => void) | undefined)?.(dateValue);
            } else {
              const rangeValue = v && typeof v === "object" && "start" in v ? (v as RangeValue) : null;
              (onChange as ((v: RangeValue | null) => void) | undefined)?.(rangeValue);
            }
          }}
          onClose={hasTime ? () => setOpen(false) : undefined}
        />
      )}
    </Dropdown>
  );
}

