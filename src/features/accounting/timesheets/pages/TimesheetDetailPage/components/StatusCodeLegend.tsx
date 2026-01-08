import { useTranslation } from "react-i18next";
import { Toast } from "@/shared/ui";
import type { DailyStatusCode } from "../../../types";
import { STATUS_CODE_STYLES } from "../../../utils";

export default function StatusCodeLegend() {
  const { t } = useTranslation("TimesheetsPage");

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, code: DailyStatusCode) {
    e.dataTransfer.setData("text/plain", code);
    e.dataTransfer.effectAllowed = "copy";
  }

  return (
    <div className="mb-7">
      <p className="text-label-md content-base-primary mb-3">{t("detail.legend")}</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_CODE_STYLES.map(({ code, className }) => (
          <div
            key={code}
            draggable
            onDragStart={(e) => handleDragStart(e, code)}
            className="radius-sm p-1 surface-container-fill border surface-base-stroke flex items-center gap-2 justify-start cursor-grab">
            <div className={`w-7 aspect-square radius-xs flex items-center justify-center text-label-sm ${className}`}>
              {code}
            </div>
            <p className="text-body-regular-sm content-base-primary">{t(`detail.codeLabels.${code}`)}</p>
          </div>
        ))}
      </div>

      <Toast
        color="grey"
        text={t("detail.helpTitle")}
        additionalText={t("detail.helpText")}
        closable={false}
        autoClose={false}
        isFullWidth
      />
    </div>
  );
}

