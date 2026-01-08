import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalWrapper, Select, Button, Toast } from "@/shared/ui";
import { useGetTimesheetsQuery } from "@/features/accounting/timesheets";
import type { GeneratePayrollDto, PayrollListResponse } from "../../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dto: GeneratePayrollDto) => Promise<void>;
  isLoading: boolean;
  payrolls?: PayrollListResponse[];
}

export default function GeneratePayrollModal({ isOpen, onClose, onConfirm, isLoading, payrolls }: Props) {
  const { t } = useTranslation("PayrollPage");
  const { data: timesheets } = useGetTimesheetsQuery();

  const [selectedTimesheetId, setSelectedTimesheetId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ text: string; color: "notice" | "positive" | "negative" | "grey" } | null>(null);

  if (!isOpen) return null;

  const approvedTimesheets = timesheets?.filter((ts) => ts.status === "approved") || [];

  const timesheetOptions = approvedTimesheets.map((ts) => ({
    value: ts.id,
    label: `${ts.month_name_ru} ${ts.year}`,
  }));

  async function handleConfirm() {
    if (!selectedTimesheetId) {
      setToast({ text: t("generate.timesheetPlaceholder"), color: "notice" });
      return;
    }

    if (payrolls) {
      const selectedTimesheet = approvedTimesheets.find((ts) => ts.id === selectedTimesheetId);
      if (selectedTimesheet) {
        const existingPayroll = payrolls.find(
          (p) => p.year === selectedTimesheet.year && p.month === selectedTimesheet.month,
        );

        if (existingPayroll) {
          let message = t("generate.alreadyExists");
          if (existingPayroll.status === "draft" || existingPayroll.status === "calculated") {
            message += " " + t("generate.canRecalculate");
          }
          setToast({ text: message, color: "notice" });
          return;
        }
      }
    }

    await onConfirm({ timesheet_id: selectedTimesheetId });
    onClose();
  }

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 border-b surface-base-stroke pb-3">
          <h4 className="text-display-2xs content-base-primary">{t("generate.title")}</h4>
          <p className="text-body-regular-sm content-base-secondary">{t("generate.text")}</p>
        </div>

        <div className="flex flex-col gap-4">
          {approvedTimesheets.length === 0 ? (
            <p className="text-body-regular-sm content-base-low">{t("generate.noApprovedTimesheets")}</p>
          ) : (
            <Select
              label={t("generate.timesheet")}
              value={selectedTimesheetId}
              onChange={(value) => setSelectedTimesheetId(value)}
              options={timesheetOptions}
              placeholder={t("generate.timesheetPlaceholder")}
            />
          )}
        </div>

        {toast && <Toast color={toast.color} text={toast.text} onClose={() => setToast(null)} autoClose={true} />}

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="md" onClick={onClose} disabled={isLoading}>
              {t("generate.cancel")}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirm}
              disabled={isLoading || approvedTimesheets.length === 0}>
              {isLoading ? t("generate.loading") : t("generate.confirm")}
            </Button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
