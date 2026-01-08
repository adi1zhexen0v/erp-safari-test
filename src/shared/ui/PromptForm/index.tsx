import { useTranslation } from "react-i18next";
import cn from "classnames";
import errorIcon from "@/shared/assets/img/shared/alert-error.png";
import successIcon from "@/shared/assets/img/shared/alert-success.png";
import warningIcon from "@/shared/assets/img/shared/alert-warning.png";
import { Button } from "../";

interface Props {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  text: string;
  variant?: "success" | "warning" | "error";
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  namespace?: string;
}

export default function PromptForm({
  onClose,
  onConfirm,
  title,
  text,
  variant = "warning",
  isLoading = false,
  confirmText,
  cancelText,
  namespace = "ApplyApplicationPage",
}: Props) {
  const { t } = useTranslation(namespace);

  const iconMap = {
    success: successIcon,
    warning: warningIcon,
    error: errorIcon,
  };

  const gradientClassMap = {
    success: "prompt-gradient",
    warning: "prompt-warning-gradient",
    error: "prompt-error-gradient",
  };

  const icon = iconMap[variant];
  const gradientClass = gradientClassMap[variant];

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen surface-backdrop blur-level-1 flex justify-center items-center z-[10200]"
      onClick={onClose}>
      <div
        className={cn(
          "p-8 bg-white rounded-2xl prompt-box-shadow flex flex-col items-center gap-6 w-[340px]",
          gradientClass,
        )}
        onClick={(e) => e.stopPropagation()}>
        <img src={icon} alt={variant} className="w-10 aspect-square" />
        <div className="flex flex-col gap-1">
          <h3 className="text-body-bold-md text-center content-base-primary">{title}</h3>
          <p className="text-body-regular-sm text-center content-base-secondary">{text}</p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Button
            variant={variant === "error" ? "destructive" : "primary"}
            size="md"
            onClick={onConfirm}
            disabled={isLoading}>
            {isLoading ? t("prompt_form.submitting") : confirmText || t("prompt_form.confirm")}
          </Button>
          <Button variant="secondary" size="md" onClick={onClose} disabled={isLoading}>
            {cancelText || t("prompt_form.cancel")}
          </Button>
        </div>
      </div>
    </div>
  );
}
