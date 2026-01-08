import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalWrapper, Select, Button, Toast } from "@/shared/ui";
import { MONTHS_RU } from "@/shared/consts";
import type { GenerateTimesheetDto, TimesheetResponse } from "../../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dto: GenerateTimesheetDto) => Promise<void>;
  isLoading: boolean;
  timesheets?: TimesheetResponse[];
}

export default function GenerateTimesheetPrompt({ isOpen, onClose, onConfirm, isLoading, timesheets }: Props) {
  const { t } = useTranslation("TimesheetsPage");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
  const [toast, setToast] = useState<{ text: string; color: "notice" | "positive" | "negative" | "grey" } | null>(null);

  if (!isOpen) return null;

  async function handleConfirm() {
    if (timesheets) {
      const existingTimesheet = timesheets.find((ts) => ts.year === year && ts.month === month);

      if (existingTimesheet) {
        let message = t("generate.alreadyExists");
        if (existingTimesheet.status === "draft") {
          message += t("generate.needToApprove");
        }
        setToast({ text: message, color: "notice" });
        return;
      }
    }

    await onConfirm({ year, month });
    onClose();
  }

  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map((y) => ({
    value: y,
    label: String(y),
  }));

  const monthOptions = MONTHS_RU.map((name, index) => ({
    value: index + 1,
    label: name,
  }));

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 border-b surface-base-stroke pb-3">
          <h4 className="text-display-2xs content-base-primary">{t("generate.title")}</h4>
          <p className="text-body-regular-sm content-base-secondary">{t("generate.text")}</p>
        </div>

        <div className="flex flex-col gap-4">
          <Select
            label={t("generate.year")}
            value={year}
            onChange={(value) => setYear(value ?? currentYear)}
            options={yearOptions}
            placeholder={t("generate.yearPlaceholder")}
          />
          <Select
            label={t("generate.month")}
            value={month}
            onChange={(value) => setMonth(value ?? currentMonth)}
            options={monthOptions}
            placeholder={t("generate.monthPlaceholder")}
          />
        </div>
        {toast && <Toast color={toast.color} text={toast.text} onClose={() => setToast(null)} autoClose={true} />}

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="md" onClick={onClose} disabled={isLoading}>
              {t("generate.cancel")}
            </Button>
            <Button variant="primary" size="md" onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? t("generate.loading") || "Загрузка..." : t("generate.confirm")}
            </Button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

