import { formatDateToISO, formatDateForContract, numberToText } from "@/shared/utils";
import type { CityResponse } from "@/shared/api/common";
import type {
  ServiceAgreementMSBFormValues,
  ServiceAgreementMSBApiPayload,
  ServiceAgreementMSBPreviewData,
  ServiceAgreementMSBResponse,
} from "../types";

export function mapFormToApiPayload(formValues: ServiceAgreementMSBFormValues): ServiceAgreementMSBApiPayload {
  const payload: ServiceAgreementMSBApiPayload = {
    commercial_org_id: formValues.commercial_org_id,
  };

  if (formValues.contract_city_id !== undefined) {
    payload.contract_city_id = formValues.contract_city_id;
  }

  if (formValues.contract_date) {
    payload.contract_date = formatDateToISO(formValues.contract_date);
  }

  if (formValues.counterparty_bank_name) {
    payload.counterparty_bank_name = formValues.counterparty_bank_name;
  }

  if (formValues.counterparty_iban) {
    payload.counterparty_iban = formValues.counterparty_iban;
  }

  if (formValues.counterparty_bik) {
    payload.counterparty_bik = formValues.counterparty_bik;
  }

  if (formValues.services_description) {
    payload.services_description = formValues.services_description;
  }

  if (formValues.service_start_date) {
    payload.service_start_date = formatDateToISO(formValues.service_start_date);
  }

  if (formValues.service_end_date) {
    payload.service_end_date = formatDateToISO(formValues.service_end_date);
  }

  if (formValues.correction_days !== undefined) {
    payload.correction_days = formValues.correction_days;
  }

  if (formValues.payment_days !== undefined) {
    payload.payment_days = formValues.payment_days;
  }

  if (formValues.contract_amount) {
    payload.contract_amount = formValues.contract_amount;
  }

  if (formValues.penalty_percent) {
    payload.penalty_percent = formValues.penalty_percent;
  }

  if (formValues.daily_penalty_percent) {
    payload.daily_penalty_percent = formValues.daily_penalty_percent;
  }

  if (formValues.dispute_resolution_body) {
    payload.dispute_resolution_body = formValues.dispute_resolution_body;
  }

  return payload;
}

export function mapFormToPreviewData(
  formValues: ServiceAgreementMSBFormValues,
  locale: "ru" | "kk" = "ru",
  cities: CityResponse[] = [],
): ServiceAgreementMSBPreviewData {
  let contractCity = "_____________";
  if (formValues.contract_city_id) {
    const city = cities.find((c) => c.id === formValues.contract_city_id);
    if (city) {
      contractCity = locale === "kk" ? city.name_kk : city.name_ru;
    }
  }

  const contractDate = formValues.contract_date
    ? formatDateForContract(formValues.contract_date, locale)
    : formatDateForContract(new Date(), locale);

  const serviceStartDate = formValues.service_start_date
    ? formatDateForContract(formValues.service_start_date, locale)
    : "_____________";

  const serviceEndDate = formValues.service_end_date
    ? formatDateForContract(formValues.service_end_date, locale)
    : "_____________";

  let contractAmountText = "";
  if (formValues.contract_amount) {
    const amountNum = Number(formValues.contract_amount);
    if (!isNaN(amountNum) && amountNum > 0) {
      contractAmountText = numberToText(amountNum, locale);
    }
  }

  const correctionDays = formValues.correction_days !== undefined ? String(formValues.correction_days) : "_____________";
  const paymentDays = formValues.payment_days !== undefined ? String(formValues.payment_days) : "_____________";

  return {
    contract_city: contractCity,
    contract_date: contractDate,
    commercial_org_id: formValues.commercial_org_id,
    counterparty_bank_name: formValues.counterparty_bank_name || "",
    counterparty_iban: formValues.counterparty_iban || "",
    counterparty_bik: formValues.counterparty_bik || "",
    services_description: formValues.services_description || "",
    service_start_date: serviceStartDate,
    service_end_date: serviceEndDate,
    correction_days: correctionDays,
    payment_days: paymentDays,
    contract_amount: formValues.contract_amount || "",
    contract_amount_text: contractAmountText,
    penalty_percent: formValues.penalty_percent || "",
    daily_penalty_percent: formValues.daily_penalty_percent || "",
    dispute_resolution_body: formValues.dispute_resolution_body || "",
  };
}

export function mapApiResponseToForm(response: ServiceAgreementMSBResponse): ServiceAgreementMSBFormValues {
  const formValues: ServiceAgreementMSBFormValues = {
    commercial_org_id: response.commercial_org?.id || 0,
    counterparty_bank_name: response.counterparty_bank_name || "",
    counterparty_iban: response.counterparty_iban || "",
    counterparty_bik: response.counterparty_bik || "",
    services_description: response.services_description || "",
    dispute_resolution_body: response.dispute_resolution_body || "",
  };

  if (response.contract_city) {
    formValues.contract_city_id = response.contract_city.id;
  }

  if (response.contract_date) {
    formValues.contract_date = new Date(response.contract_date);
  }

  if (response.service_start_date) {
    formValues.service_start_date = new Date(response.service_start_date);
  }

  if (response.service_end_date) {
    formValues.service_end_date = new Date(response.service_end_date);
  }

  if (response.correction_days !== undefined) {
    formValues.correction_days = response.correction_days;
  }

  if (response.payment_days !== undefined) {
    formValues.payment_days = response.payment_days;
  }

  if (response.contract_amount) {
    formValues.contract_amount = response.contract_amount;
  }

  if (response.penalty_percent) {
    formValues.penalty_percent = response.penalty_percent;
  }

  if (response.daily_penalty_percent) {
    formValues.daily_penalty_percent = response.daily_penalty_percent;
  }

  return formValues;
}

