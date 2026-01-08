import { useEffect, useState } from "react";
import { InfoCircle, Warning2 } from "iconsax-react";
import { CheckIcon, CloseIcon } from "@/shared/assets/icons";

interface Props {
  color: "positive" | "negative" | "notice" | "grey";
  text: string;
  additionalText?: string;
  isFullWidth?: boolean;
  onClose?: () => void;
  closable?: boolean;
  autoClose?: boolean;
}

const additionalTextColorMap: Record<Props["color"], string> = {
  positive: "text-positive-500 dark:text-positive-200",
  negative: "text-negative-500 dark:text-negative-200",
  notice: "text-notice-500 dark:text-notice-200",
  grey: "text-grey-500 dark:text-grey-200",
};

const colorClasses: Record<Props["color"], { container: string; closeBtn: string }> = {
  positive: {
    container: "bg-positive-100 text-positive-900 dark:bg-positive-900 dark:text-positive-200",
    closeBtn: "text-positive-900 dark:text-positive-200",
  },
  negative: {
    container: "bg-negative-100 text-negative-900 dark:bg-negative-900 dark:text-negative-200",
    closeBtn: "text-negative-900 dark:text-negative-200",
  },
  notice: {
    container: "bg-notice-100 text-notice-900 dark:bg-notice-900 dark:text-notice-200",
    closeBtn: "text-notice-900 dark:text-notice-200",
  },
  grey: {
    container: "bg-grey-100 text-grey-900 dark:bg-grey-800 dark:text-grey-200",
    closeBtn: "text-grey-900 dark:text-grey-200",
  },
};

export default function Toast({
  color,
  text,
  additionalText,
  isFullWidth = false,
  onClose,
  closable = true,
  autoClose = true,
}: Props) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);

    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [text, color, onClose, autoClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`px-3 py-2 ${colorClasses[color].container} rounded-md flex justify-between gap-4 ${isFullWidth ? "w-full" : "min-w-2xs"}`}>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="shrink-0">
            {color === "positive" && <CheckIcon />}
            {color === "negative" && <InfoCircle size={16} color="currentColor" />}
            {color === "grey" && <InfoCircle size={16} color="currentColor" />}
            {color === "notice" && <Warning2 size={16} color="currentColor" />}
          </span>
          <p className="text-label-sm">{text}</p>
        </div>
        {additionalText && (
          <p className={`text-body-regular-xs pl-6 ${additionalTextColorMap[color]}`}>{additionalText}</p>
        )}
      </div>
      {closable && (
        <button
          className={`${colorClasses[color].closeBtn} cursor-pointer shrink-0 self-start`}
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}>
          <CloseIcon />
        </button>
      )}
    </div>
  );
}

