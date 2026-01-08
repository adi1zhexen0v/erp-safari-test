import { useMemo, useState } from "react";
import cn from "classnames";
import { SelectArrowDownIcon } from "@/shared/assets/icons";
import { Dropdown, DropdownItem } from "..";
import styles from "./Select.module.css";

interface Option<T> {
  label: string;
  value: T | null;
}

interface Props<T> {
  label?: string;
  error?: string;
  options: Option<T>[];
  placeholder?: string;
  value?: T | null;
  onChange?: (value: T | null) => void;
  width?: string;
  disabled?: boolean;
  includePlaceholderOption?: boolean;
}

export default function Select<T extends string | number | boolean>({
  label,
  error,
  options,
  placeholder = "Select",
  value,
  onChange,
  width = "w-full",
  disabled = false,
  includePlaceholderOption = true,
}: Props<T>) {
  const [open, setOpen] = useState(false);

  const optionsWithPlaceholder = useMemo(() => {
    if (!includePlaceholderOption || !placeholder) {
      return options;
    }

    const hasPlaceholderOption = options.some((opt) => opt.value === null || opt.value === "");
    if (hasPlaceholderOption) {
      return options;
    }

    return [{ label: placeholder, value: null as T | null }, ...options];
  }, [options, placeholder, includePlaceholderOption]);

  const selected = optionsWithPlaceholder.find((o) => o.value === value);
  const isPlaceholder = !value || (selected?.value === null);

  return (
    <Dropdown open={open && !disabled} onClose={() => setOpen(false)} width={width} fullWidth>
      <div className="flex flex-col gap-2">
        {label && <label className="text-label-sm content-base-primary">{label}</label>}
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((p) => !p)}
          className={`
          w-full flex justify-between items-center px-3 py-3 radius-sm
          surface-base-fill input-box-shadow outline-none
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        `}
          style={{ width }}>
          <span className={cn(
            "text-body-regular-sm min-w-0 overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-left",
            isPlaceholder ? styles.placeholder : "content-base-primary",
          )}>
            {isPlaceholder ? placeholder : selected?.label}
          </span>

          <span className="content-base-secondary w-4 h-4 flex items-center justify-center shrink-0 ml-2">
            <SelectArrowDownIcon />
          </span>
        </button>
        {error && !disabled && <p className="text-body-regular-xs content-action-negative">{error}</p>}
      </div>

      {!disabled && (
        <div className={optionsWithPlaceholder.length > 8 ? "max-h-42 overflow-y-auto page-scroll" : ""}>
          {optionsWithPlaceholder.map((opt) => (
            <DropdownItem
              key={opt.value === null ? "__placeholder__" : String(opt.value)}
              active={opt.value === value}
              onClick={() => {
                onChange?.(opt.value);
                setOpen(false);
              }}>
              {opt.label}
            </DropdownItem>
          ))}
        </div>
      )}
    </Dropdown>
  );
}

