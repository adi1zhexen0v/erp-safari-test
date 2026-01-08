import { useId } from "react";
import cn from "classnames";
import { CheckboxIcon, MinusIcon } from "@/shared/assets/icons";

export type CheckboxState = "unchecked" | "checked" | "indeterminate";

interface CheckboxProps {
  state: CheckboxState;
  onChange?: () => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  isHeader?: boolean;
  label?: string;
}

export default function Checkbox({
  state,
  onChange,
  disabled = false,
  className,
  id,
  isHeader = false,
  label = "",
}: CheckboxProps) {
  const generatedId = useId();
  const finalId = id ?? generatedId;

  const isChecked = state === "checked";
  const isIndeterminate = state === "indeterminate";

  return (
    <div className="flex items-center gap-2">
      <button
        id={finalId}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onChange?.()}
        className={cn(
          "m-1 w-4 aspect-square radius-2xs flex items-center justify-center",
          "bg-white checkbox-box-shadow transition-colors cursor-pointer outline-none",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          (isChecked || isIndeterminate) && "bg-primary-500!",
          className,
        )}>
        {isHeader ? (
          <>
            {isIndeterminate && <MinusIcon />}
            {isChecked && !isIndeterminate && <CheckboxIcon />}
          </>
        ) : (
          <>{isChecked && <CheckboxIcon />}</>
        )}
      </button>

      {label && (
        <label
          htmlFor={finalId}
          className={cn(
            "cursor-pointer select-none content-base-secondary text-label-sm",
            disabled && "opacity-40 cursor-not-allowed",
          )}>
          {label}
        </label>
      )}
    </div>
  );
}
