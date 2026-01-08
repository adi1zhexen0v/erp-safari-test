import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Add, Trash } from "iconsax-react";
import { Button, Input, Select, DatePicker, Prompt, Checkbox } from "@/shared/ui";
import { formatDateToISO, type Locale } from "@/shared/utils";
import { useCreatePositionAmendmentMutation } from "@/features/hr/amendments/api";
import type { ApprovalResolution } from "@/features/hr/amendments/types";
import type { ContractDetailResponse } from "@/features/hr/contracts/types";
import type { WorkerListItem } from "@/features/hr/employees";

interface Props {
  employee: WorkerListItem;
  contractData: ContractDetailResponse;
  onBack: () => void;
  onClose: () => void;
}

export default function ChangePositionForm({ employee, contractData, onBack, onClose }: Props) {
  const { i18n, t } = useTranslation("FillContractPage");
  const locale = (i18n.language as Locale) || "ru";

  const [createPositionAmendment, { isLoading }] = useCreatePositionAmendmentMutation();
  const [prompt, setPrompt] = useState<{
    title: string;
    text: string;
    variant: "success" | "error";
  } | null>(null);

  const initialValues = useMemo(() => {
    return {
      jobPositionRu: contractData?.job_position_ru ?? "",
      jobPositionKk: contractData?.job_position_kk ?? "",
      jobDutiesRu:
        contractData?.job_duties_ru && contractData.job_duties_ru.length > 0 ? contractData.job_duties_ru : [""],
      jobDutiesKk:
        contractData?.job_duties_kk && contractData.job_duties_kk.length > 0 ? contractData.job_duties_kk : [""],
      trialPeriod: contractData?.trial_period ?? false,
      trialDurationMonths: contractData?.trial_duration_months ?? null,
    };
  }, [contractData]);

  const [jobPositionRu, setJobPositionRu] = useState(initialValues.jobPositionRu);
  const [jobPositionKk, setJobPositionKk] = useState(initialValues.jobPositionKk);
  const [jobDutiesRu, setJobDutiesRu] = useState<string[]>(initialValues.jobDutiesRu);
  const [jobDutiesKk, setJobDutiesKk] = useState<string[]>(initialValues.jobDutiesKk);
  const [trialPeriod, setTrialPeriod] = useState(initialValues.trialPeriod);
  const [trialDurationMonths, setTrialDurationMonths] = useState<number | null>(initialValues.trialDurationMonths);
  const [effectiveDate, setEffectiveDate] = useState<Date | null>(null);
  const [approvalResolution, setApprovalResolution] = useState<ApprovalResolution | null>(null);

  useEffect(() => {
    setJobPositionRu(initialValues.jobPositionRu);
    setJobPositionKk(initialValues.jobPositionKk);
    setJobDutiesRu(initialValues.jobDutiesRu);
    setJobDutiesKk(initialValues.jobDutiesKk);
    setTrialPeriod(initialValues.trialPeriod);
    setTrialDurationMonths(initialValues.trialDurationMonths);
  }, [initialValues]);

  const hasChanges = useMemo(() => {
    const dutiesChanged =
      JSON.stringify(jobDutiesRu.filter((d) => d.trim())) !==
        JSON.stringify(initialValues.jobDutiesRu.filter((d) => d.trim())) ||
      JSON.stringify(jobDutiesKk.filter((d) => d.trim())) !==
        JSON.stringify(initialValues.jobDutiesKk.filter((d) => d.trim()));

    return (
      jobPositionRu !== initialValues.jobPositionRu ||
      jobPositionKk !== initialValues.jobPositionKk ||
      dutiesChanged ||
      trialPeriod !== initialValues.trialPeriod ||
      trialDurationMonths !== initialValues.trialDurationMonths
    );
  }, [jobPositionRu, jobPositionKk, jobDutiesRu, jobDutiesKk, trialPeriod, trialDurationMonths, initialValues]);

  const isSubmitDisabled = !hasChanges || !effectiveDate || isLoading;

  function addDuty() {
    setJobDutiesRu([...jobDutiesRu, ""]);
    setJobDutiesKk([...jobDutiesKk, ""]);
  }

  function removeDuty(index: number) {
    function filterRu(_: string, i: number): boolean {
      return i !== index;
    }
    function filterKk(_: string, i: number): boolean {
      return i !== index;
    }
    setJobDutiesRu(jobDutiesRu.filter(filterRu));
    setJobDutiesKk(jobDutiesKk.filter(filterKk));
  }

  function updateDutyRu(index: number, value: string) {
    const newDuties = [...jobDutiesRu];
    newDuties[index] = value;
    setJobDutiesRu(newDuties);
  }

  function updateDutyKk(index: number, value: string) {
    const newDuties = [...jobDutiesKk];
    newDuties[index] = value;
    setJobDutiesKk(newDuties);
  }

  function handleJobPositionRuChange(e: React.ChangeEvent<HTMLInputElement>) {
    setJobPositionRu(e.target.value);
  }

  function handleJobPositionKkChange(e: React.ChangeEvent<HTMLInputElement>) {
    setJobPositionKk(e.target.value);
  }

  function createRemoveDutyHandler(index: number) {
    return () => removeDuty(index);
  }

  function createUpdateDutyRuHandler(index: number) {
    return (e: React.ChangeEvent<HTMLInputElement>) => updateDutyRu(index, e.target.value);
  }

  function createUpdateDutyKkHandler(index: number) {
    return (e: React.ChangeEvent<HTMLInputElement>) => updateDutyKk(index, e.target.value);
  }

  function handleTrialPeriodChange() {
    setTrialPeriod((prev) => !prev);
  }

  function handleTrialDurationMonthsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTrialDurationMonths(value === "" ? null : parseInt(value, 10));
  }

  function handleApprovalResolutionChange(value: ApprovalResolution | null) {
    setApprovalResolution(value);
  }

  function handleEffectiveDateChange(value: Date | null) {
    setEffectiveDate(value);
  }

  async function handleSubmit() {
    if (isSubmitDisabled) return;

    try {
      function filterNonEmpty(d: string): boolean {
        return d.trim().length > 0;
      }
      const filteredDutiesRu = jobDutiesRu.filter(filterNonEmpty);
      const filteredDutiesKk = jobDutiesKk.filter(filterNonEmpty);

      await createPositionAmendment({
        worker_id: employee.id,
        effective_date: formatDateToISO(effectiveDate),
        approval_resolution: approvalResolution || undefined,
        new_values: {
          job_position_ru: jobPositionRu.trim(),
          job_position_kk: jobPositionKk.trim(),
          job_duties_ru: filteredDutiesRu.length > 0 ? filteredDutiesRu : undefined,
          job_duties_kk: filteredDutiesKk.length > 0 ? filteredDutiesKk : undefined,
          trial_period: trialPeriod,
          trial_duration_months: trialPeriod ? trialDurationMonths : null,
        },
      }).unwrap();

      setPrompt({
        title: t("contractChanges.successTitle") || "Успешно",
        text: t("contractChanges.successText") || "Изменения успешно отправлены на подписание",
        variant: "success",
      });
    } catch (error) {
      console.error("Ошибка при создании дополнения к договору", error);
      setPrompt({
        title: t("contractChanges.errorTitle") || "Ошибка",
        text: t("contractChanges.errorText") || "Ошибка при создании дополнения к договору",
        variant: "error",
      });
    }
  }

  function handlePromptClose() {
    const wasSuccess = prompt?.variant === "success";
    setPrompt(null);
    if (wasSuccess) {
      onClose();
    }
  }

  const approvalResolutionOptions = [
    { label: t("contractChanges.approval_resolution.approved") || "Согласовано", value: "approved" as const },
    { label: t("contractChanges.approval_resolution.supported") || "Ходатайствую", value: "supported" as const },
    {
      label: t("contractChanges.approval_resolution.no_objection") || "Не возражаю",
      value: "no_objection" as const,
    },
  ];

  return (
    <>
      {prompt && (
        <Prompt
          onClose={handlePromptClose}
          title={prompt.title}
          text={prompt.text}
          variant={prompt.variant}
          namespace="FillContractPage"
        />
      )}
      <div className="flex flex-col justify-between gap-10 p-1 h-full">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
            <h4 className="text-display-2xs content-base-primary">{t("contractChanges.changePosition.title")}</h4>
            <p className="text-body-regular-sm content-base-secondary">
              {t("contractChanges.changePosition.subtitle")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label={t("form.job_position_ru")}
              placeholder={t("placeholders.job_position_ru")}
              value={jobPositionRu ?? ""}
              onChange={handleJobPositionRuChange}
            />

            <Input
              label={t("form.job_position_kk")}
              placeholder={t("placeholders.job_position_kk")}
              value={jobPositionKk ?? ""}
              onChange={handleJobPositionKkChange}
            />

            <div className="flex flex-col gap-4">
              {jobDutiesRu.map((duty, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-label-sm content-base-primary">
                      {t("contractChanges.changePosition.dutyLabel", { number: index + 1 })}
                    </label>
                    {jobDutiesRu.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        isIconButton
                        className="w-8! rounded-[6px]!"
                        onClick={createRemoveDutyHandler(index)}>
                        <span className="content-action-negative">
                          <Trash size={16} color="currentColor" />
                        </span>
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Input
                      isTextarea
                      placeholder={t("placeholders.job_duty_ru")}
                      value={duty ?? ""}
                      onChange={createUpdateDutyRuHandler(index)}
                      className="h-20"
                    />
                    <Input
                      isTextarea
                      placeholder={t("placeholders.job_duty_kk")}
                      value={jobDutiesKk[index] ?? ""}
                      onChange={createUpdateDutyKkHandler(index)}
                      className="h-20"
                    />
                  </div>
                </div>
              ))}

              <Button type="button" variant="secondary" size="md" onClick={addDuty} className="w-full">
                <Add size={16} color="currentColor" />
                {t("buttons.add_duty")}
              </Button>
            </div>

            <Checkbox
              label={t("form.trial_period")}
              state={trialPeriod ? "checked" : "unchecked"}
              onChange={handleTrialPeriodChange}
            />

            {trialPeriod && (
              <Input
                label={t("form.trial_duration_months")}
                placeholder={t("placeholders.trial_duration_months")}
                value={trialDurationMonths?.toString() || ""}
                onChange={handleTrialDurationMonthsChange}
                onlyNumber
              />
            )}

            <Select
              label={t("contractChanges.approval_resolution.label") || "Резолюция согласования"}
              placeholder={t("contractChanges.approval_resolution.placeholder") || "Выберите резолюцию"}
              options={approvalResolutionOptions}
              value={approvalResolution}
              onChange={handleApprovalResolutionChange}
            />

            <DatePicker
              direction="top"
              locale={locale}
              mode="single"
              label={t("contractChanges.effective_date.label") || "Дата вступления в силу"}
              placeholder={t("contractChanges.effective_date.placeholder") || "Выберите дату"}
              value={effectiveDate}
              onChange={handleEffectiveDateChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] gap-3 pb-0.5">
          <Button variant="secondary" className="py-3" onClick={onBack} type="button">
            {t("buttons.back")}
          </Button>
          <Button variant="primary" className="py-3" type="button" onClick={handleSubmit} disabled={isSubmitDisabled}>
            {isLoading ? t("buttons.loading") || "Загрузка..." : t("buttons.saveChanges")}
          </Button>
        </div>
      </div>
    </>
  );
}
