import { useState, useMemo, useEffect, useRef } from "react";
import cn from "classnames";
import { SelectArrowDownIcon, SearchIcon } from "@/shared/assets/icons";
import { Input } from "..";

interface SearchableSelectProps<T extends Record<string, any>> {
  label?: string;
  error?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options: T[];
  value?: T | null;
  onChange?: (value: T | null) => void;
  searchKeys: (keyof T)[];
  displayKey: keyof T;
  getOptionLabel?: (option: T) => string;
  width?: string;
  disabled?: boolean;
}

export default function SearchableSelect<T extends Record<string, any>>({
  label,
  error,
  placeholder = "Выберите",
  searchPlaceholder = "Поиск...",
  options,
  value,
  onChange,
  searchKeys,
  displayKey,
  getOptionLabel,
  width = "w-full",
  disabled = false,
}: SearchableSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return options;
    }

    const query = searchQuery.toLowerCase().trim();
    return options.filter((option) => {
      return searchKeys.some((key) => {
        const fieldValue = option[key];
        if (fieldValue == null) return false;
        return String(fieldValue).toLowerCase().includes(query);
      });
    });
  }, [options, searchQuery, searchKeys]);

  const inputValue = useMemo(() => {
    if (isFocused || searchQuery) {
      return searchQuery;
    }

    const getDisplayText = (option: T | null): string => {
      if (!option) return "";
      if (getOptionLabel) return getOptionLabel(option);
      const displayValue = option[displayKey];
      return displayValue != null ? String(displayValue) : "";
    };

    return value ? getDisplayText(value) : "";
  }, [value, searchQuery, isFocused, getOptionLabel, displayKey]);

  const inputPlaceholder = useMemo(() => {
    if (isFocused || searchQuery) {
      return searchPlaceholder;
    }
    return placeholder;
  }, [isFocused, searchQuery, placeholder, searchPlaceholder]);

  const inputCursor = useMemo(() => {
    if (!value && !isFocused && !searchQuery) {
      return "cursor-pointer";
    }
    return "cursor-text";
  }, [value, isFocused, searchQuery]);

  const handleSelect = (option: T) => {
    onChange?.(option);
    setOpen(false);
    setSearchQuery("");
    setIsFocused(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsFocused(true);
      setOpen(true);
      setHighlightedIndex(-1);
      if (value) {
        setSearchQuery("");
      }
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setIsFocused(false);
        setOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
      }
    }, 200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    setHighlightedIndex(-1);
    if (!open) {
      setOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      setOpen(true);
      setHighlightedIndex(0);
      return;
    }

    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const nextIndex = prev < filteredOptions.length - 1 ? prev + 1 : 0;
          scrollToHighlighted(nextIndex);
          return nextIndex;
        });
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const nextIndex = prev > 0 ? prev - 1 : filteredOptions.length - 1;
          scrollToHighlighted(nextIndex);
          return nextIndex;
        });
        break;

      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;

      case "Escape":
        e.preventDefault();
        setOpen(false);
        setIsFocused(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const scrollToHighlighted = (index: number) => {
    if (!dropdownRef.current) return;

    const items = dropdownRef.current.querySelectorAll("[data-dropdown-item]");
    const item = items[index] as HTMLElement;
    if (item) {
      item.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };

  const handleInputClick = () => {
    if (!disabled && !open) {
      setOpen(true);
      setIsFocused(true);
    }
  };

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
        setIsFocused(false);
        setSearchQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="flex flex-col gap-2 relative" style={{ width }}>
      {label && (
        <label
          className={cn(
            "text-sm leading-5 font-semibold",
            disabled ? "content-base-low" : "text-black dark:text-white",
          )}>
          {label}
        </label>
      )}

      <div className="relative">
        {/* Input для поиска и выбора */}
        <div className="relative">
          <Input
            ref={inputRef}
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onClick={handleInputClick}
            disabled={disabled}
            icon={<SearchIcon />}
            className={inputCursor}
            autoComplete="off"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
            <span className="content-base-secondary">
              <SelectArrowDownIcon />
            </span>
          </div>
        </div>

        {error && !disabled && <p className="text-body-regular-xs content-action-negative mt-2">{error}</p>}

        {open && !disabled && (
          <div
            ref={dropdownRef}
            className={cn(
              "absolute z-50 mt-2 top-full left-0 right-0 rounded-lg background-static-white p-1",
              "animate-fadeIn shadow-[0_6px_12px_0_var(--color-alpha-black-05),0_1px_1px_0_var(--color-alpha-black-10),0_0_0_1px_var(--color-alpha-black-10)]",
              filteredOptions.length > 8 ? "max-h-42 overflow-y-auto page-scroll" : "",
            )}>
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-body-regular-sm content-base-low text-center">Ничего не найдено</div>
            ) : (
              filteredOptions.map((option, index) => {
                const optionText = getOptionLabel ? getOptionLabel(option) : String(option[displayKey] ?? "");
                const isSelected = value && JSON.stringify(value) === JSON.stringify(option);
                const isHighlighted = highlightedIndex === index;

                return (
                  <button
                    key={index}
                    type="button"
                    data-dropdown-item
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "w-full flex items-center text-left gap-2 px-3 py-2 text-label-sm rounded-md transition-colors content-base-primary",
                      isSelected
                        ? "bg-primary-500 content-on-background-brand"
                        : "content-base-primary hover:bg-grey-50 dark:hover:bg-grey-900 cursor-pointer",
                      isHighlighted && !isSelected && "bg-grey-50 dark:bg-grey-900",
                    )}>
                    {optionText}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
