import { formatDateToISO, formatDateForDisplay } from "@/shared/utils";
import type { CompletionAct, CompletionActFormValues, CompletionActCreatePayload, CompletionActPreviewData } from "../types";
import { COMPLETION_ACT_STATUS_MAP } from "../types";

export function mapFormToApiPayload(
  formValues: CompletionActFormValues,
): CompletionActCreatePayload {
  return {
    parent_contract: formValues.parent_contract,
    service_item: formValues.service_item!,
    period_start_date: formatDateToISO(formValues.period_start_date!),
    period_end_date: formatDateToISO(formValues.period_end_date!),
    amount: formValues.amount,
    description: formValues.description || undefined,
  };
}

export function mapApiResponseToForm(act: CompletionAct): CompletionActFormValues {
  return {
    parent_contract: act.parent_contract.id,
    service_item: act.service_item.id,
    period_start_date: act.period_start_date ? new Date(act.period_start_date) : null,
    period_end_date: act.period_end_date ? new Date(act.period_end_date) : null,
    amount: act.amount,
    description: act.description || "",
  };
}

export function mapActToPreviewData(
  act: CompletionAct,
  locale: "ru" | "kk" = "ru",
): CompletionActPreviewData {
  const periodStart = formatDateForDisplay(act.period_start_date);
  const periodEnd = formatDateForDisplay(act.period_end_date);

  return {
    display_number: act.display_number,
    executor_name: act.parent_contract.executor_full_name,
    service_name: act.service_item.service_name,
    period: `${periodStart} — ${periodEnd}`,
    amount: act.amount,
    description: act.description,
    status: COMPLETION_ACT_STATUS_MAP[act.status][locale],
    created_at: formatDateForDisplay(act.created_at),
  };
}

export function getDefaultFormValues(parentContractId: number): CompletionActFormValues {
  return {
    parent_contract: parentContractId,
    service_item: null,
    period_start_date: null,
    period_end_date: null,
    amount: "",
    description: "",
  };
}

