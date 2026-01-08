import type { ReactNode } from "react";
import cn from "classnames";

export interface ButtonGroupOption {
  label: string | ReactNode;
  value: string;
}

interface ButtonGroupProps {
  options: ButtonGroupOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export default function ButtonGroup({
  options,
  value,
  onChange,
  disabled = false,
  className,
  fullWidth = false,
}: ButtonGroupProps) {
  return (
    <div
      className={cn(
        "flex items-center p-0.5 surface-tertiary-fill radius-xs",
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}>
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(option.value)}
            className={cn(
              "px-3 py-1.5 radius-2xs flex justify-center items-center gap-2 text-label-md transition-colors",
              fullWidth && "flex-1",
              isActive
                ? "background-brand-fill segment-selected text-white"
                : "content-base-secondary text-body-regular-md hover:bg-black/5 cursor-pointer",
            )}>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

