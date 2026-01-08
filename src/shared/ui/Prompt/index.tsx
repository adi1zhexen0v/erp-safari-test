import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import errorIcon from "@/shared/assets/img/shared/alert-error.png";
import successIcon from "@/shared/assets/img/shared/alert-success.png";
import warningIcon from "@/shared/assets/img/shared/alert-warning.png";
import infoIcon from "@/shared/assets/img/shared/alert-info.png";
import { Button } from "../";

interface Props {
  onClose: () => void;
  title: string;
  text: string;
  variant?: "success" | "warning" | "error";
  namespace?: string;
  buttonText?: string;
  loaderMode?: boolean;
  loaderText?: string;
}

export default function Prompt({
  onClose,
  title,
  text,
  variant = "success",
  namespace = "ApplyApplicationPage",
  buttonText,
  loaderMode = false,
  loaderText,
}: Props) {
  const { t } = useTranslation(namespace);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    if (!loaderMode) return;

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === ".") return "..";
        if (prev === "..") return "...";
        return ".";
      });
    }, 750);

    return () => clearInterval(interval);
  }, [loaderMode]);

  if (loaderMode) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen surface-backdrop blur-level-1 flex justify-center items-center z-[10002]">
        <div
          className="p-8 surface-base-fill prompt-info-gradient rounded-2xl prompt-box-shadow flex flex-col items-center gap-6 w-[340px]"
          onClick={(e) => e.stopPropagation()}>
          <img src={infoIcon} alt="Loading" className="w-10 aspect-square" />
          <div className="flex flex-col gap-2">
            <h3 className="text-body-bold-md text-center content-base-primary">{t("messages.loading")}</h3>
            <p className="text-body-regular-sm text-center text-black/60 dark:text-white/60">
              {loaderText || text}
              <span className="inline-block w-6 text-left">{dots}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

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
      className="fixed top-0 left-0 w-screen h-screen surface-backdrop blur-level-1 flex justify-center items-center z-[10002]"
      onClick={onClose}>
      <div
        className={cn(
          "p-8 surface-base-fill rounded-2xl prompt-box-shadow flex flex-col items-center gap-6 w-[340px]",
          gradientClass,
        )}
        onClick={(e) => e.stopPropagation()}>
        <img src={icon} alt={variant} className="w-10 aspect-square" />

        <div className="flex flex-col gap-1">
          <h3 className="text-body-bold-md text-center content-base-primary">{title}</h3>
          <p className="text-body-regular-sm text-center text-black/60 dark:text-white/60">{text}</p>
        </div>

        <Button variant={variant === "error" ? "destructive" : "primary"} size="md" onClick={onClose}>
          {buttonText || t("prompt.ok")}
        </Button>
      </div>
    </div>
  );
}
