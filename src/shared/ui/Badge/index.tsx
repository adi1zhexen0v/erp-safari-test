import React from "react";
import cn from "classnames";

type BadgeVariant = "filled" | "soft" | "outline";
export type BadgeColor = "gray" | "info" | "positive" | "notice" | "negative";

interface BadgeProps {
  variant?: BadgeVariant;
  color?: BadgeColor;
  text: string;
  icon?: React.ReactNode;
  className?: string;
}

const colorVariantsMap: Record<BadgeVariant, Record<BadgeColor, string>> = {
  filled: {
    gray: "bg-grey-500 text-white",
    info: "bg-info-500 text-white",
    positive: "bg-positive-500 text-white",
    notice: "bg-notice-500 text-white",
    negative: "bg-negative-500 text-white",
  },
  soft: {
    gray: "bg-grey-100 text-grey-900 dark:text-grey-500",
    info: "bg-info-100 text-info-900 dark:text-info-500",
    positive: "bg-positive-100 text-positive-900 dark:text-positive-500",
    notice: "bg-notice-100 text-notice-900 dark:text-notice-500",
    negative: "bg-negative-100 text-negative-900 dark:text-negative-500",
  },
  outline: {
    gray: "bg-transparent border border-grey-200 text-grey-900 dark:text-grey-500 dark:border-grey-500",
    info: "bg-transparent border border-info-200 text-info-900 dark:text-info-500 dark:border-info-500",
    positive:
      "bg-transparent border border-positive-200 text-positive-900 dark:text-positive-500 dark:border-positive-500",
    notice: "bg-transparent border border-notice-200 text-notice-900 dark:text-notice-500 dark:border-notice-500",
    negative:
      "bg-transparent border border-negative-200 text-negative-900 dark:text-negative-500 dark:border-negative-500",
  },
};

export default function Badge({ variant = "filled", color = "gray", icon, text, className }: BadgeProps) {
  const variantClasses = colorVariantsMap[variant][color];
  const paddingClasses = icon ? "py-[2px] pl-1 pr-2" : "py-[2px] px-2";

  return (
    <div className="flex items-center">
      <span
        className={cn(
          "text-xs xl:text-sm leading-4 xl:leading-5 font-medium rounded-full flex items-center justify-center gap-1",
          paddingClasses,
          variantClasses,
          className,
        )}>
        {icon && <span className="flex items-center shrink-0">{icon}</span>}
        {text}
      </span>
    </div>
  );
}
