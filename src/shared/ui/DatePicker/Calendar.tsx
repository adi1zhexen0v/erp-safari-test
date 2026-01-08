import type { Locale } from "@/shared/utils/types";
import type { DatePickerMode } from "../DatePicker";
import Button from "../Button";
import CalendarDays from "./CalendarDays";
import CalendarHeader from "./CalendarHeader";
import CalendarYears from "./CalendarYears";
import TimePicker from "./TimePicker";
import { CALENDAR_LOCALE } from "./locale";

interface RangeValue {
  start: Date | null;
  end: Date | null;
}

interface Props {
  currentMonth: Date;
  view: "day" | "year";
  next: () => void;
  prev: () => void;
  goYearMode: () => void;
  selectYear: (year: number) => void;
  selectDate: (date: Date) => void;
  value: RangeValue;
  hoverDate?: Date | null;
  onHover?: (d: Date | null) => void;
  locale: Locale;
  mode?: DatePickerMode;
  hasTime?: boolean;
  onChange?: (v: RangeValue | Date | null) => void;
  onClose?: () => void;
}

export default function Calendar({
  currentMonth,
  view,
  next,
  prev,
  goYearMode,
  selectYear,
  selectDate,
  value,
  hoverDate,
  onHover,
  locale,
  mode = "range",
  hasTime = false,
  onChange,
  onClose,
}: Props) {
  const t = CALENDAR_LOCALE[locale];

  const monthLabel =
    view === "day"
      ? `${t.months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`
      : `${currentMonth.getFullYear()}`;

  const isRange = mode === "range";

  return (
    <div className="p-2 w-fit">
      {hasTime && mode === "single" && view === "day" ? (
        <div className="flex gap-4">
          <div className="flex-1">
            <CalendarHeader label={monthLabel} onPrev={prev} onNext={next} onClickLabel={goYearMode} />
            <CalendarDays
              month={currentMonth}
              range={value}
              onSelect={selectDate}
              hoverDate={isRange ? hoverDate : null}
              onHover={isRange ? onHover : undefined}
              locale={locale}
              mode={mode}
            />
          </div>

          <div className="flex flex-col border-l surface-base-stroke pl-4">
            <TimePicker
              value={value.start}
              onChange={(date) => {
                if (onChange) {
                  onChange(date);
                }
              }}
              onDateChange={(date) => {
                // Создаем дату по умолчанию, если она не была выбрана
                if (!value.start && onChange) {
                  onChange(date);
                }
              }}
              locale={locale}
            />
            {onClose && (
              <div className="mt-3">
                <Button type="button" variant="primary" className="w-full" size="md" onClick={onClose}>
                  {t.done}
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <CalendarHeader label={monthLabel} onPrev={prev} onNext={next} onClickLabel={goYearMode} />

          {view === "day" && (
            <CalendarDays
              month={currentMonth}
              range={value}
              onSelect={selectDate}
              hoverDate={isRange ? hoverDate : null}
              onHover={isRange ? onHover : undefined}
              locale={locale}
              mode={mode}
            />
          )}

          {view === "year" && <CalendarYears currentYear={currentMonth.getFullYear()} onSelect={selectYear} />}
        </>
      )}
    </div>
  );
}
