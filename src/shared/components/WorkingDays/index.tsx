import { useMemo, useState } from "react";
import cn from "classnames";
import { type Locale } from "@/shared/utils/types";
import { CALENDAR_LOCALE } from "@/shared/ui/DatePicker/locale";
import Button from "@/shared/ui/Button";

const DAY_ABBREVIATIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  label?: string;
  value?: string[];
  onChange?: (days: string[]) => void;
  locale: Locale;
  error?: string;
  disabled?: boolean;
}

export default function WorkingDays({
  label,
  value,
  onChange,
  locale,
  error,
  disabled = false,
}: Props) {
  const defaultDays = useMemo(() => ["Mon", "Tue", "Wed", "Thu", "Fri"], []);
  const [internalValue, setInternalValue] = useState<string[]>(defaultDays);
  const [validationError, setValidationError] = useState<string>("");

  const currentValue = value ?? internalValue;
  const weekdays = CALENDAR_LOCALE[locale].weekdays;

  const handleDayToggle = (dayIndex: number) => {
    if (disabled) return;

    const dayAbbr = DAY_ABBREVIATIONS[dayIndex];
    const isSelected = currentValue.includes(dayAbbr);
    const newValue = isSelected
      ? currentValue.filter((d) => d !== dayAbbr)
      : [...currentValue, dayAbbr];

    // Валидация: минимум 1 день
    if (newValue.length === 0) {
      setValidationError("Необходимо выбрать минимум 1 день");
      return;
    }

    // Валидация: максимум 6 дней
    if (newValue.length > 6) {
      setValidationError("Можно выбрать максимум 6 дней");
      return;
    }

    setValidationError("");
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const displayError = error || validationError;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          className={cn(
            "text-label-sm content-base-primary",
            disabled && "opacity-50",
          )}>
          {label}
        </label>
      )}

      <div className="flex gap-2">
        {weekdays.map((weekday, index) => {
          const dayAbbr = DAY_ABBREVIATIONS[index];
          const isSelected = currentValue.includes(dayAbbr);

          return (
            <Button
              key={dayAbbr}
              type="button"
              variant={isSelected ? "primary" : "secondary"}
              size="md"
              disabled={disabled}
              onClick={() => handleDayToggle(index)}
              className={cn(
                "w-10 h-10 p-0 flex items-center justify-center",
                !isSelected && "opacity-50",
              )}>
              {weekday}
            </Button>
          );
        })}
      </div>

      {displayError && !disabled && (
        <p className="text-body-regular-xs text-negative-500">{displayError}</p>
      )}
    </div>
  );
}


















