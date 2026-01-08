import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, TimePicker, Button } from "@/shared/ui";
import { WorkingDays } from "@/shared/components";
import { type Locale } from "@/shared/utils";
import type { ContractDetailResponse } from "@/features/hr/contracts/types";
import type { WorkerListItem } from "@/features/hr/employees";

interface Props {
  employee: WorkerListItem;
  contractData: ContractDetailResponse;
  onBack: () => void;
  onClose: () => void;
}

export default function ChangeWorkScheduleForm({ contractData, onBack }: Props) {
  const { t, i18n } = useTranslation("FillContractPage");
  const locale = (i18n.language as Locale) || "ru";

  const [workStartTime, setWorkStartTime] = useState(contractData.work_start_time || "");
  const [workEndTime, setWorkEndTime] = useState(contractData.work_end_time || "");
  const [hasBreak, setHasBreak] = useState(
    contractData.break_start_time !== null && contractData.break_end_time !== null,
  );
  const [breakStartTime, setBreakStartTime] = useState(contractData.break_start_time ?? "");
  const [breakEndTime, setBreakEndTime] = useState(contractData.break_end_time ?? "");
  const [workingDays, setWorkingDays] = useState<("Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun")[]>(
    contractData.working_days_list && contractData.working_days_list.length > 0
      ? contractData.working_days_list
      : ["Mon", "Tue", "Wed", "Thu", "Fri"],
  );

  useEffect(() => {
    if (contractData) {
      setWorkStartTime(contractData.work_start_time || "");
      setWorkEndTime(contractData.work_end_time || "");
      setHasBreak(contractData.break_start_time !== null && contractData.break_end_time !== null);
      setBreakStartTime(contractData.break_start_time ?? "");
      setBreakEndTime(contractData.break_end_time ?? "");
      setWorkingDays(
        contractData.working_days_list && contractData.working_days_list.length > 0
          ? contractData.working_days_list
          : ["Mon", "Tue", "Wed", "Thu", "Fri"],
      );
    }
  }, [contractData]);

  function handleWorkingDaysChange(days: string[]) {
    setWorkingDays(days as ("Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun")[]);
  }

  function handleWorkStartTimeChange(value: string) {
    setWorkStartTime(value);
  }

  function handleWorkEndTimeChange(value: string) {
    setWorkEndTime(value);
  }

  function handleHasBreakChange() {
    const newValue = !hasBreak;
    setHasBreak(newValue);
    if (!newValue) {
      setBreakStartTime("");
      setBreakEndTime("");
    }
  }

  function handleBreakStartTimeChange(value: string) {
    setBreakStartTime(value);
  }

  function handleBreakEndTimeChange(value: string) {
    setBreakEndTime(value);
  }

  return (
    <div className="flex flex-col justify-between p-1 h-full">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
          <h4 className="text-display-2xs content-base-primary">{t("contractChanges.changeWorkSchedule.title")}</h4>
          <p className="text-body-regular-sm content-base-secondary">
            {t("contractChanges.changeWorkSchedule.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-3">
          <div className="col-span-2">
            <WorkingDays
              label={t("form.working_days_list")}
              value={workingDays}
              onChange={handleWorkingDaysChange}
              locale={locale}
            />
          </div>

          <TimePicker
            label={t("form.work_start_time")}
            placeholder={t("placeholders.work_start_time")}
            value={workStartTime}
            onChange={handleWorkStartTimeChange}
            locale={locale}
          />

          <TimePicker
            label={t("form.work_end_time")}
            placeholder={t("placeholders.work_end_time")}
            value={workEndTime}
            onChange={handleWorkEndTimeChange}
            locale={locale}
          />

          <div className="col-span-2">
            <Checkbox
              label={t("form.has_break")}
              state={hasBreak ? "checked" : "unchecked"}
              onChange={handleHasBreakChange}
            />
          </div>

          {hasBreak && (
            <>
              <TimePicker
                label={t("form.break_start_time")}
                placeholder={t("placeholders.break_start_time")}
                value={breakStartTime}
                onChange={handleBreakStartTimeChange}
                locale={locale}
              />

              <TimePicker
                label={t("form.break_end_time")}
                placeholder={t("placeholders.break_end_time")}
                value={breakEndTime}
                onChange={handleBreakEndTimeChange}
                locale={locale}
              />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[2fr_3fr] gap-3">
        <Button variant="secondary" className="py-3" onClick={onBack} type="button">
          {t("buttons.back")}
        </Button>
        <Button variant="primary" className="py-3" type="button">
          {t("buttons.saveChanges")}
        </Button>
      </div>
    </div>
  );
}

