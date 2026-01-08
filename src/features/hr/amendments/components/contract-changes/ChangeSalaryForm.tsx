import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input, Select, DatePicker, Prompt } from "@/shared/ui";
import { formatDateToISO, type Locale } from "@/shared/utils";
import { useCreateSalaryAmendmentMutation } from "@/features/hr/amendments/api";
import type { ApprovalResolution } from "@/features/hr/amendments/types";
import type { ContractDetailResponse } from "@/features/hr/contracts/types";
import type { WorkerListItem } from "@/features/hr/employees";

interface Props {
  employee: WorkerListItem;
  contractData: ContractDetailResponse;
  onBack: () => void;
  onClose: () => void;
}

export default function ChangeSalaryForm({ employee, contractData, onBack, onClose }: Props) {
  const { i18n, t } = useTranslation("FillContractPage");
  const locale = (i18n.language as Locale) || "ru";

  const [createSalaryAmendment, { isLoading }] = useCreateSalaryAmendmentMutation();
  const [prompt, setPrompt] = useState<{
    title: string;
    text: string;
    variant: "success" | "error";
  } | null>(null);

  const initialSalaryAmount = useMemo(() => {
    return contractData?.salary_amount ? Number(contractData.salary_amount) : 0;
  }, [contractData]);

  const [salaryAmount, setSalaryAmount] = useState<number>(initialSalaryAmount);
  const [effectiveDate, setEffectiveDate] = useState<Date | null>(null);
  const [approvalResolution, setApprovalResolution] = useState<ApprovalResolution | null>(null);

  useEffect(() => {
    setSalaryAmount(initialSalaryAmount);
  }, [initialSalaryAmount]);

  const hasChanges = useMemo(() => {
    return salaryAmount !== initialSalaryAmount && salaryAmount > 0;
  }, [salaryAmount, initialSalaryAmount]);

  const isSubmitDisabled = !hasChanges || !effectiveDate || isLoading || salaryAmount <= 0;

  function handleSalaryAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value === "") {
      setSalaryAmount(0);
      return;
    }
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0) {
      const stringValue = numValue.toString();
      if (stringValue.replace(".", "").length <= 12) {
        setSalaryAmount(numValue);
      }
    }
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
      const salaryAmountString = salaryAmount.toFixed(2);

      await createSalaryAmendment({
        worker_id: employee.id,
        effective_date: formatDateToISO(effectiveDate),
        approval_resolution: approvalResolution || undefined,
        new_values: {
          salary_amount: salaryAmountString,
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
            <h4 className="text-display-2xs content-base-primary">{t("contractChanges.changeSalary.title")}</h4>
            <p className="text-body-regular-sm content-base-secondary">{t("contractChanges.changeSalary.subtitle")}</p>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label={t("form.salary_amount")}
              placeholder={t("placeholders.salary_amount")}
              type="number"
              value={salaryAmount > 0 ? salaryAmount : ""}
              onChange={handleSalaryAmountChange}
              onlyNumber
            />

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

