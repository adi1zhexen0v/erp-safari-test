import { useState, useEffect, useRef } from "react";
import { ArrowUp2, ArrowDown2 } from "iconsax-react";
import { type Locale } from "@/shared/utils/types";
import Button from "../Button";
import { CALENDAR_LOCALE } from "./locale";

interface Props {
  value: Date | null;
  onChange: (date: Date) => void;
  disabled?: boolean;
  onDateChange?: (date: Date) => void;
  locale: Locale;
}

export default function TimePicker({ value, onChange, disabled = false, onDateChange, locale }: Props) {
  const t = CALENDAR_LOCALE[locale];
  const [hour, setHour] = useState<number>(value?.getHours() ?? new Date().getHours());
  const [minute, setMinute] = useState<number>(value?.getMinutes() ?? 0);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setHour(value.getHours());
      setMinute(value.getMinutes());
    }
  }, [value]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const updateTime = (newHour: number, newMinute: number) => {
    let newDate: Date;

    if (value) {
      newDate = new Date(value);
      newDate.setHours(newHour, newMinute, 0, 0);
    } else {
      newDate = new Date();
      newDate.setHours(newHour, newMinute, 0, 0);
      if (onDateChange) onDateChange(newDate);
    }

    onChange(newDate);
  };

  const handleHourChange = (newHour: number) => {
    setHour(newHour);
    updateTime(newHour, minute);

    setTimeout(() => {
      const el = hourRef.current?.querySelector(`[data-hour="${newHour}"]`) as HTMLElement;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const handleMinuteChange = (newMinute: number) => {
    setMinute(newMinute);
    updateTime(hour, newMinute);

    setTimeout(() => {
      const el = minuteRef.current?.querySelector(`[data-minute="${newMinute}"]`) as HTMLElement;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const scrollToValue = (ref: React.RefObject<HTMLDivElement | null>, value: number, type: "hour" | "minute") => {
    setTimeout(() => {
      const el = ref.current?.querySelector(`[data-${type}="${value}"]`) as HTMLElement;
      el?.scrollIntoView({ behavior: "auto", block: "center" });
    }, 100);
  };

  useEffect(() => {
    if (hourRef.current) scrollToValue(hourRef, hour, "hour");
    if (minuteRef.current) scrollToValue(minuteRef, minute, "minute");
  }, [hour, minute]);

  const increment = (type: "hour" | "minute") => {
    if (type === "hour") handleHourChange((hour + 1) % 24);
    else handleMinuteChange((minute + 1) % 60);
  };

  const decrement = (type: "hour" | "minute") => {
    if (type === "hour") handleHourChange(hour === 0 ? 23 : hour - 1);
    else handleMinuteChange(minute === 0 ? 59 : minute - 1);
  };

  return (
    <div className="">
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

          <div
            ref={hourRef}
            className="flex-1 overflow-y-auto max-h-24 w-full flex flex-col items-center no-scrollbar"
            style={{ scrollBehavior: "smooth" }}>
            {hours.map((v) => (
              <button
                key={v}
                type="button"
                data-hour={v}
                onClick={() => handleHourChange(v)}
                disabled={disabled}
                className={`
                  w-12 h-8 shrink-0 flex items-center justify-center text-body-regular-md
                  transition-colors rounded cursor-pointer
                  ${hour === v ? "bg-primary-500 text-white font-semibold" : "text-grey-700 hover:bg-black/5"}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}>
                {v.toString().padStart(2, "0")}
              </button>
            ))}
          </div>

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

          <div
            ref={minuteRef}
            className="flex-1 overflow-y-auto max-h-24 w-full flex flex-col items-center no-scrollbar"
            style={{ scrollBehavior: "smooth" }}>
            {minutes.map((v) => (
              <button
                key={v}
                type="button"
                data-minute={v}
                onClick={() => handleMinuteChange(v)}
                disabled={disabled}
                className={`
                  w-12 h-8 shrink-0 flex items-center justify-center text-body-regular-md
                  transition-colors rounded cursor-pointer
                  ${minute === v ? "bg-primary-500 text-white font-semibold" : "text-grey-700 hover:bg-black/5"}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}>
                {v.toString().padStart(2, "0")}
              </button>
            ))}
          </div>

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
  );
}
