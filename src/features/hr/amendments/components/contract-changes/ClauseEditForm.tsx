import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Input, Button, Select, DatePicker, Prompt } from "@/shared/ui";
import { formatDateForContract, formatDateToISO, ruInflect } from "@/shared/utils";
import { type Locale } from "@/shared/utils";
import { useCreateOtherAmendmentMutation } from "@/features/hr/amendments/api";
import type { ApprovalResolution } from "@/features/hr/amendments/types";
import type { ContractClause, ContractDetailResponse } from "@/features/hr/contracts/types";
import type { WorkerListItem } from "@/features/hr/employees";

interface Props {
  employee: WorkerListItem;
  clause: ContractClause;
  contractData: ContractDetailResponse;
  onBack: () => void;
  onClose: () => void;
}

function getMonthDeclension(months: number): string {
  if (months === 1) return "месяц";
  if (months >= 2 && months <= 4) return "месяца";
  return "месяцев";
}

function replacePlaceholders(content: string, contractData: ContractDetailResponse): string {
  let result = content;

  const placeholderRegex = /\{\{(\w+)\}\}/g;

  function replacePlaceholder(_match: string, placeholder: string): string {
    switch (placeholder) {
      case "start_date_ru":
        return contractData.start_date
          ? formatDateForContract(new Date(contractData.start_date), "ru")
          : "_____________";

      case "start_date_kk":
        return contractData.start_date
          ? formatDateForContract(new Date(contractData.start_date), "kk")
          : "_____________";

      case "job_position_kk":
        return contractData.job_position_kk || "_____________";

      case "job_position_ru":
        return contractData.job_position_ru || "_____________";

      case "job_position_gent_ru":
        return contractData.job_position_ru ? ruInflect(contractData.job_position_ru, 2) : "_____________";

      case "job_description_list_ru":
        if (contractData.job_duties_ru && contractData.job_duties_ru.length > 0) {
          function formatDutyRu(duty: string, idx: number): string {
            if (idx === 0) return `- ${duty}`;
            if (idx < contractData.job_duties_ru.length - 1) return `\n- ${duty};`;
            return `\n- ${duty}`;
          }
          return contractData.job_duties_ru.map(formatDutyRu).join("");
        }
        return "_____________";

      case "job_description_list_kk":
        if (contractData.job_duties_kk && contractData.job_duties_kk.length > 0) {
          function formatDutyKk(duty: string, idx: number): string {
            if (idx === 0) return `- ${duty}`;
            if (idx < contractData.job_duties_kk.length - 1) return `\n- ${duty};`;
            return `\n- ${duty}`;
          }
          return contractData.job_duties_kk.map(formatDutyKk).join("");
        }
        return "_____________";

      case "trial_period_ru":
        if (contractData.trial_period) {
          return contractData.trial_duration_months
            ? `с испытательным сроком ${contractData.trial_duration_months} ${getMonthDeclension(contractData.trial_duration_months)}`
            : "с испытательным сроком";
        }
        return "";

      case "trial_period_kk":
        if (contractData.trial_period) {
          return contractData.trial_duration_months
            ? `${contractData.trial_duration_months} айлық сынақ мерзімімен`
            : "сынақ мерзімімен";
        }
        return "";

      default: {
        const contractDataRecord = contractData as unknown as Record<string, unknown>;
        const value = contractDataRecord[placeholder];
        if (value !== undefined && value !== null) {
          return String(value);
        }
        return "_____________";
      }
    }
  }

  result = result.replace(placeholderRegex, replacePlaceholder);

  return result;
}

export default function ClauseEditForm({ employee, clause, contractData, onBack, onClose }: Props) {
  const { i18n, t } = useTranslation("FillContractPage");
  const locale = (i18n.language as Locale) || "ru";

  const [createOtherAmendment, { isLoading }] = useCreateOtherAmendmentMutation();
  const [prompt, setPrompt] = useState<{
    title: string;
    text: string;
    variant: "success" | "error";
  } | null>(null);

  const initialContentRu = useMemo(() => {
    return replacePlaceholders(clause.content_ru, contractData);
  }, [clause.content_ru, contractData]);

  const initialContentKk = useMemo(() => {
    return replacePlaceholders(clause.content_kk, contractData);
  }, [clause.content_kk, contractData]);

  const [contentRu, setContentRu] = useState(initialContentRu);
  const [contentKk, setContentKk] = useState(initialContentKk);
  const [effectiveDate, setEffectiveDate] = useState<Date | null>(null);
  const [approvalResolution, setApprovalResolution] = useState<ApprovalResolution | null>(null);

  useEffect(() => {
    setContentRu(initialContentRu);
    setContentKk(initialContentKk);
  }, [initialContentRu, initialContentKk]);

  const hasChanges = useMemo(() => {
    return contentRu.trim() !== initialContentRu.trim() || contentKk.trim() !== initialContentKk.trim();
  }, [contentRu, contentKk, initialContentRu, initialContentKk]);

  const isSubmitDisabled = !hasChanges || !effectiveDate || isLoading;

  async function handleSubmit() {
    if (isSubmitDisabled) return;

    try {
      await createOtherAmendment({
        worker_id: employee.id,
        clause_section: clause.section_number,
        effective_date: formatDateToISO(effectiveDate),
        approval_resolution: approvalResolution || undefined,
        new_clause_text_ru: contentRu.trim(),
        new_clause_text_kk: contentKk.trim(),
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

  function handleContentRuChange(e: React.ChangeEvent<HTMLInputElement>) {
    setContentRu(e.target.value);
  }

  function handleContentKkChange(e: React.ChangeEvent<HTMLInputElement>) {
    setContentKk(e.target.value);
  }

  function handleApprovalResolutionChange(v: ApprovalResolution | null) {
    setApprovalResolution(v);
  }

  function handleEffectiveDateChange(v: Date | { start: Date | null; end: Date | null } | null) {
    if (v === null || v instanceof Date) {
      setEffectiveDate(v);
    } else {
      setEffectiveDate(v.start);
    }
  }

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
      <div className="flex flex-col justify-between p-1 h-full">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
            <h4 className="text-display-2xs content-base-primary">
              {t("contractChanges.changeOtherConditions.title")} - {clause.section_number}
            </h4>
            <p className="text-body-regular-sm content-base-secondary">
              {t("contractChanges.changeOtherConditions.editSubtitle") || "Редактирование пункта договора"}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label={t("form.job_duties_ru") || "Содержание (Русский)"}
              isTextarea
              placeholder={t("placeholders.job_duty_ru") || "Введите текст пункта"}
              value={contentRu}
              onChange={handleContentRuChange}
              className="h-40"
            />

            <Input
              label={t("form.job_duties_kk") || "Содержание (Казахский)"}
              isTextarea
              placeholder={t("placeholders.job_duty_kk") || "Введите текст пункта"}
              value={contentKk}
              onChange={handleContentKkChange}
              className="h-40"
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

        <div className="grid grid-cols-[2fr_3fr] gap-3">
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

