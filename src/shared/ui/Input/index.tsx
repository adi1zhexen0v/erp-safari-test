import { forwardRef, useId } from "react";
import cn from "classnames";
import styles from "./Input.module.css";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder: string;
  error?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  isTextarea?: boolean;
  onlyNumber?: boolean;
  autoComplete?: "on" | "off";
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  (
    {
      label,
      placeholder,
      error,
      icon,
      className = "",
      children,
      disabled = false,
      isTextarea = false,
      onlyNumber = false,
      autoComplete,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const autoCompleteValue = onlyNumber ? "off" : autoComplete !== undefined ? autoComplete : "on";

    function handleNumberInput(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
      if (!onlyNumber) return;

      const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
      const key = e.key;

      if (allowed.includes(key)) return;
      if (/^\d$/.test(key)) return;

      const value = (e.target as HTMLInputElement).value;
      if (key === "." && !value.includes(".")) return;

      e.preventDefault();
    }

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm leading-5 font-semibold",
              disabled ? "content-base-low" : "text-black dark:text-white",
            )}>
            {label}
          </label>
        )}

        <div className="relative">
          {icon && !isTextarea && (
            <div className={cn("absolute top-1/2 -translate-y-1/2 left-3", disabled && "pointer-events-none")}>
              {icon}
            </div>
          )}

          {isTextarea ? (
            <textarea
              id={inputId}
              ref={ref as any}
              disabled={disabled}
              autoComplete={autoCompleteValue}
              className={cn(
                styles.input,
                "text-body-regular-sm dark:text-white input-box-shadow surface-base-fill radius-sm",
                "h-[120px] resize-none p-3 page-scroll",
                disabled && "cursor-not-allowed opacity-50",
                className,
              )}
              placeholder={placeholder}
              onKeyDown={handleNumberInput}
              {...(props as any)}
            />
          ) : (
            <input
              id={inputId}
              ref={ref as any}
              disabled={disabled}
              autoComplete={autoCompleteValue}
              onKeyDown={handleNumberInput}
              className={cn(
                styles.input,
                "text-body-regular-sm dark:text-white input-box-shadow surface-base-fill radius-sm",
                icon ? styles["input-icon"] : "",
                error ? styles["input-error"] : "",
                disabled && "cursor-not-allowed opacity-50",
                className,
              )}
              placeholder={placeholder}
              {...props}
            />
          )}

          {children}
        </div>

        {error && !disabled && <p className="text-body-regular-xs content-action-negative">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
