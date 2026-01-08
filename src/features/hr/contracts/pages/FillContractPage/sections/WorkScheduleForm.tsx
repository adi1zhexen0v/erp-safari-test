import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMemo, useState, useEffect } from "react";
import type { ContractFormValues } from "@/features/hr/contracts/types";
import { Checkbox, Input, Select, TimePicker, Toast } from "@/shared/ui";
import { WorkingDays } from "@/shared/components";
import { type Locale } from "@/shared/utils";

export default function WorkScheduleForm() {
  const { i18n, t } = useTranslation("FillContractPage");
  const locale = (i18n.language as Locale) || "ru";
  const {
    setValue,
    watch,
    formState: { errors, isSubmitted },
  } = useFormContext<ContractFormValues>();

  const hasBreak = watch("has_break");
  const trialPeriod = watch("trial_period");
  const [toast, setToast] = useState<{ text: string; color: "positive" | "negative" | "notice" | "grey" } | null>(null);

  useEffect(() => {
    if (isSubmitted) {
      if (errors.working_days_list?.message === "validation.working_days_exactly_five") {
        setToast({
          color: "negative",
          text: t("validation.working_days_exactly_five"),
        });
      } else {
        setToast(null);
      }
    }
  }, [errors.working_days_list, isSubmitted, t]);

  const workEndTimeError = useMemo(() => {
    if (!errors.work_end_time?.message) return undefined;
    if (errors.work_end_time.message === "validation.working_hours_four_or_eight") {
      return undefined;
    }
    return t(errors.work_end_time.message as string);
  }, [errors.work_end_time?.message, t]);

  const isOnlineOptions = useMemo(
    () => [
      { label: t("form.is_online_offline"), value: false },
      { label: t("form.is_online_online"), value: true },
    ],
    [t],
  );

  return (
    <div className="flex flex-col gap-7">
      <h2 className="text-display-2xs content-base-primary">{t("sections.work_schedule")}</h2>

      {toast && (
        <Toast
          key={`${toast.color}-${toast.text}`}
          color={toast.color}
          text={toast.text}
          onClose={() => setToast(null)}
        />
      )}

      <div className="grid grid-cols-2 gap-y-4 gap-x-3">
        <div className="col-span-2">
          <WorkingDays
            label={t("form.working_days_list")}
            value={watch("working_days_list")}
            onChange={(days) =>
              setValue("working_days_list", days as ("Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun")[], {
                shouldValidate: true,
              })
            }
            locale={locale}
            error={errors.working_days_list?.message ? t(errors.working_days_list.message as string) : undefined}
          />
        </div>

        <TimePicker
          label={t("form.work_start_time")}
          placeholder={t("placeholders.work_start_time")}
          value={watch("work_start_time")}
          onChange={(value) => setValue("work_start_time", value, { shouldValidate: true })}
          locale={locale}
          error={errors.work_start_time?.message ? t(errors.work_start_time.message as string) : undefined}
        />

        <TimePicker
          label={t("form.work_end_time")}
          placeholder={t("placeholders.work_end_time")}
          value={watch("work_end_time")}
          onChange={(value) => setValue("work_end_time", value, { shouldValidate: true })}
          locale={locale}
          error={workEndTimeError}
        />

        <div className="col-span-2">
          <Checkbox
            label={t("form.has_break")}
            state={hasBreak ? "checked" : "unchecked"}
            onChange={() => {
              const newValue = !hasBreak;
              setValue("has_break", newValue, { shouldValidate: true });
              if (!newValue) {
                setValue("break_start_time", undefined, { shouldValidate: true });
                setValue("break_end_time", undefined, { shouldValidate: true });
              }
            }}
          />
        </div>

        {hasBreak && (
          <>
            <TimePicker
              label={t("form.break_start_time")}
              placeholder={t("placeholders.break_start_time")}
              value={watch("break_start_time")}
              onChange={(value) => setValue("break_start_time", value, { shouldValidate: true })}
              locale={locale}
              error={errors.break_start_time?.message ? t(errors.break_start_time.message as string) : undefined}
            />

            <TimePicker
              label={t("form.break_end_time")}
              placeholder={t("placeholders.break_end_time")}
              value={watch("break_end_time")}
              onChange={(value) => setValue("break_end_time", value, { shouldValidate: true })}
              locale={locale}
              error={errors.break_end_time?.message ? t(errors.break_end_time.message as string) : undefined}
            />
          </>
        )}

        <Select
          label={t("form.is_online")}
          placeholder={t("placeholders.is_online")}
          options={isOnlineOptions}
          value={watch("is_online") ?? undefined}
          onChange={(value) => setValue("is_online", value ?? undefined, { shouldValidate: true })}
          error={errors.is_online?.message ? t(errors.is_online.message as string) : undefined}
        />

        <Input
          label={t("form.salary_amount")}
          placeholder={t("placeholders.salary_amount")}
          value={watch("salary_amount")}
          onChange={(e) => setValue("salary_amount", e.target.value, { shouldValidate: true })}
          onlyNumber
          error={errors.salary_amount?.message ? t(errors.salary_amount.message as string) : undefined}
        />

        <div className="col-span-2">
          <Checkbox
            label={t("form.trial_period")}
            state={trialPeriod ? "checked" : "unchecked"}
            onChange={() => {
              const newValue = !trialPeriod;
              setValue("trial_period", newValue, { shouldValidate: true });
              if (!newValue) {
                setValue("trial_duration_months", undefined, { shouldValidate: true });
              }
            }}
          />
        </div>

        {trialPeriod && (
          <Input
            label={t("form.trial_duration_months")}
            placeholder={t("placeholders.trial_duration_months")}
            value={watch("trial_duration_months")?.toString() || ""}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value === "" ? undefined : parseInt(value, 10);
              setValue("trial_duration_months", isNaN(numValue as number) ? undefined : numValue, {
                shouldValidate: true,
              });
            }}
            onlyNumber
            error={
              errors.trial_duration_months?.message ? t(errors.trial_duration_months.message as string) : undefined
            }
          />
        )}
      </div>
    </div>
  );
}

