import { useState, useEffect, useRef } from "react";
import { ArrowUp2, ArrowDown2, Clock } from "iconsax-react";
import cn from "classnames";
import { type Locale } from "@/shared/utils/types";
import Button from "../Button";
import { CALENDAR_LOCALE } from "../DatePicker/locale";
import Dropdown from "../Dropdown";
import styles from "../DatePicker/DatePicker.module.css";

interface Props {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string; // HH:MM format
  onChange?: (value: string) => void; // HH:MM format
  disabled?: boolean;
  locale: Locale;
}

export default function TimePicker({
  label,
  error,
  placeholder,
  value,
  onChange,
  disabled = false,
  locale,
}: Props) {
  const t = CALENDAR_LOCALE[locale];
  const [open, setOpen] = useState(false);

  // Parse HH:MM string to hours and minutes
  const parseTime = (timeStr: string | undefined): { hour: number; minute: number } => {
    if (!timeStr || !timeStr.includes(":")) {
      const now = new Date();
      return { hour: now.getHours(), minute: now.getMinutes() };
    }
    const [hourStr, minuteStr] = timeStr.split(":");
    return {
      hour: parseInt(hourStr, 10) || 0,
      minute: parseInt(minuteStr, 10) || 0,
    };
  };

  const { hour: initialHour, minute: initialMinute } = parseTime(value);
  const [hour, setHour] = useState<number>(initialHour);
  const [minute, setMinute] = useState<number>(initialMinute);
  const [hourInput, setHourInput] = useState<string>(initialHour.toString());
  const [minuteInput, setMinuteInput] = useState<string>(initialMinute.toString());
  const hourInputRef = useRef<HTMLInputElement | null>(null);
  const minuteInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const parsed = parseTime(value);
    // Обновляем input только если он не в фокусе (пользователь не вводит)
    const isHourFocused = document.activeElement === hourInputRef.current;
    const isMinuteFocused = document.activeElement === minuteInputRef.current;
    
    setHour(parsed.hour);
    setMinute(parsed.minute);
    
    if (!isHourFocused) {
      setHourInput(parsed.hour.toString().padStart(2, "0"));
    }
    if (!isMinuteFocused) {
      setMinuteInput(parsed.minute.toString().padStart(2, "0"));
    }
  }, [value]);

  const formatTime = (h: number, m: number): string => {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const updateTime = (newHour: number, newMinute: number) => {
    const clampedHour = Math.max(0, Math.min(23, newHour));
    const clampedMinute = Math.max(0, Math.min(59, newMinute));
    setHour(clampedHour);
    setMinute(clampedMinute);
    setHourInput(clampedHour.toString().padStart(2, "0"));
    setMinuteInput(clampedMinute.toString().padStart(2, "0"));
    onChange?.(formatTime(clampedHour, clampedMinute));
  };

  const handleHourInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Разрешаем только цифры и максимум 2 символа
    if (inputValue === "" || /^\d{1,2}$/.test(inputValue)) {
      setHourInput(inputValue);
      
      if (inputValue !== "") {
        const numValue = parseInt(inputValue, 10);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 23) {
          const clampedHour = Math.max(0, Math.min(23, numValue));
          setHour(clampedHour);
          onChange?.(formatTime(clampedHour, minute));
        }
      } else {
        // Если поле пустое, не обновляем значение
        onChange?.(formatTime(hour, minute));
      }
    }
  };

  const handleHourInputBlur = () => {
    const numValue = parseInt(hourInput, 10);
    if (isNaN(numValue) || numValue < 0 || numValue > 23) {
      setHourInput(hour.toString().padStart(2, "0"));
    } else {
      const formatted = numValue.toString().padStart(2, "0");
      setHourInput(formatted);
      updateTime(numValue, minute);
    }
  };

  const handleMinuteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Разрешаем только цифры и максимум 2 символа
    if (inputValue === "" || /^\d{1,2}$/.test(inputValue)) {
      setMinuteInput(inputValue);
      
      if (inputValue !== "") {
        const numValue = parseInt(inputValue, 10);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 59) {
          const clampedMinute = Math.max(0, Math.min(59, numValue));
          setMinute(clampedMinute);
          onChange?.(formatTime(hour, clampedMinute));
        }
      } else {
        // Если поле пустое, не обновляем значение
        onChange?.(formatTime(hour, minute));
      }
    }
  };

  const handleMinuteInputBlur = () => {
    const numValue = parseInt(minuteInput, 10);
    if (isNaN(numValue) || numValue < 0 || numValue > 59) {
      setMinuteInput(minute.toString());
    } else {
      const formatted = numValue.toString().padStart(2, "0");
      setMinuteInput(formatted);
      updateTime(hour, numValue);
    }
  };

  const increment = (type: "hour" | "minute") => {
    if (type === "hour") updateTime((hour + 1) % 24, minute);
    else updateTime(hour, (minute + 1) % 60);
  };

  const decrement = (type: "hour" | "minute") => {
    if (type === "hour") updateTime(hour === 0 ? 23 : hour - 1, minute);
    else updateTime(hour, minute === 0 ? 59 : minute - 1);
  };

  const defaultPlaceholder = t.selectTime;
  const displayPlaceholder = placeholder || defaultPlaceholder;
  const displayValue = value ? formatTime(hour, minute) : displayPlaceholder;
  const isPlaceholder = !value;

  return (
    <Dropdown open={open && !disabled} onClose={() => setOpen(false)} className="elevation-level-2!">
      <div className="flex flex-col gap-2">
        {label && <label className="text-label-sm content-base-primary">{label}</label>}
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) setOpen((o) => !o);
          }}
          className={cn(
            "w-full flex justify-between items-center px-3 py-3 radius-sm",
            "surface-base-fill input-box-shadow text-body-regular-sm outline-none",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            isPlaceholder ? styles.placeholder : "content-base-primary",
          )}>
          {displayValue}
          <span className="content-base-secondary w-4 h-4 flex items-center justify-center shrink-0">
            <Clock size={16} color="currentColor" style={{ width: "1rem", height: "1rem" }} />
          </span>
        </button>
        {error && !disabled && <p className="text-body-regular-xs content-action-negative">{error}</p>}
      </div>

      {!disabled && (
        <div className="p-4">
          <div className="flex items-center gap-4 justify-center py-2">
            <div className="flex flex-col items-center flex-1">
              <Button
                type="button"
                onClick={() => decrement("hour")}
                disabled={disabled}
                className="w-8! h-8! radius-xs! p-0! mb-2!"
                isIconButton
                variant="secondary">
                <ArrowUp2 size={16} color="currentColor" />
              </Button>

              <input
                ref={hourInputRef}
                type="text"
                inputMode="numeric"
                value={hourInput}
                onChange={handleHourInputChange}
                onBlur={handleHourInputBlur}
                disabled={disabled}
                className={cn(
                  "w-12 h-12 text-center text-body-regular-xl",
                  "surface-base-fill border border-grey-300 radius-sm",
                  "focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "content-base-primary",
                )}
                maxLength={2}
              />

              <Button
                type="button"
                onClick={() => increment("hour")}
                disabled={disabled}
                className="w-8! h-8! radius-xs! p-0! mt-2!"
                isIconButton
                variant="secondary">
                <ArrowDown2 size={16} color="currentColor" />
              </Button>

              <div className="text-label-sm content-base-secondary mt-2">{t.hour}</div>
            </div>

            <div className="text-body-regular-xl content-base-primary py-2">:</div>

            <div className="flex flex-col items-center flex-1">
              <Button
                type="button"
                onClick={() => decrement("minute")}
                disabled={disabled}
                className="w-8! h-8! radius-xs! p-0! mb-2!"
                isIconButton
                variant="secondary">
                <ArrowUp2 size={16} color="currentColor" />
              </Button>

              <input
                ref={minuteInputRef}
                type="text"
                inputMode="numeric"
                value={minuteInput}
                onChange={handleMinuteInputChange}
                onBlur={handleMinuteInputBlur}
                disabled={disabled}
                className={cn(
                  "w-12 h-12 text-center text-body-regular-xl",
                  "surface-base-fill border border-grey-300 radius-sm",
                  "focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "content-base-primary",
                )}
                maxLength={2}
              />

              <Button
                type="button"
                onClick={() => increment("minute")}
                disabled={disabled}
                className="w-8! h-8! radius-xs! p-0! mt-2!"
                isIconButton
                variant="secondary">
                <ArrowDown2 size={16} color="currentColor" />
              </Button>

              <div className="text-label-sm content-base-secondary mt-2">{t.minute}</div>
            </div>
          </div>
        </div>
      )}
    </Dropdown>
  );
}

