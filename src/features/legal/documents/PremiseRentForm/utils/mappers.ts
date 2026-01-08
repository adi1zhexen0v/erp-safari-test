import { formatDateToISO, formatDateForContract, numberToText } from "@/shared/utils";
import type { CityResponse } from "@/shared/api/common";
import type {
  PremiseRentFormValues,
  PremiseRentApiPayload,
  PremiseRentPreviewData,
  PremiseRentResponse,
} from "../types";
import { calculateRentalTerm, extractAreaNumber } from "./utils";

export function mapFormToApiPayload(formValues: PremiseRentFormValues): PremiseRentApiPayload {
  const payload: PremiseRentApiPayload = {
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

  if (formValues.premise_area) {
    payload.premise_area = formValues.premise_area;
  }

  if (formValues.premise_address) {
    payload.premise_address = formValues.premise_address;
  }

  if (formValues.premise_usage_purpose) {
    payload.premise_usage_purpose = formValues.premise_usage_purpose;
  }

  if (formValues.rental_start_date) {
    payload.rental_start_date = formatDateToISO(formValues.rental_start_date);
  }

  if (formValues.rental_end_date) {
    payload.rental_end_date = formatDateToISO(formValues.rental_end_date);
  }

  if (formValues.rental_amount) {
    payload.rental_amount = formValues.rental_amount;
  }

  if (formValues.first_month_payment_deadline) {
    payload.first_month_payment_deadline = formatDateToISO(formValues.first_month_payment_deadline);
  }

  return payload;
}

export function mapFormToPreviewData(
  formValues: PremiseRentFormValues,
  locale: "ru" | "kk" = "ru",
  cities: CityResponse[] = [],
): PremiseRentPreviewData {
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

  const rentalStartDate = formValues.rental_start_date
    ? formatDateForContract(formValues.rental_start_date, locale)
    : "_____________";

  const rentalEndDate = formValues.rental_end_date
    ? formatDateForContract(formValues.rental_end_date, locale)
    : "_____________";

  const firstMonthPaymentDeadline = formValues.first_month_payment_deadline
    ? formatDateForContract(formValues.first_month_payment_deadline, locale)
    : "_____________";

  const rentalTermText = calculateRentalTerm(formValues.rental_start_date, formValues.rental_end_date, locale);

  let rentalAmountText = "";
  if (formValues.rental_amount) {
    const amountNum = Number(formValues.rental_amount);
    if (!isNaN(amountNum) && amountNum > 0) {
      rentalAmountText = numberToText(amountNum, locale);
    }
  }

  return {
    contract_city: contractCity,
    contract_date: contractDate,
    commercial_org_id: formValues.commercial_org_id,
    counterparty_bank_name: formValues.counterparty_bank_name || "",
    counterparty_iban: formValues.counterparty_iban || "",
    counterparty_bik: formValues.counterparty_bik || "",
    premise_area: formValues.premise_area || "",
    premise_address: formValues.premise_address || "",
    premise_usage_purpose: formValues.premise_usage_purpose || "",
    rental_start_date: rentalStartDate,
    rental_end_date: rentalEndDate,
    rental_term_text: rentalTermText,
    rental_amount: formValues.rental_amount || "",
    rental_amount_text: rentalAmountText,
    first_month_payment_deadline: firstMonthPaymentDeadline,
  };
}

export function mapApiResponseToForm(response: PremiseRentResponse): PremiseRentFormValues {
  const formValues: PremiseRentFormValues = {
    commercial_org_id: response.commercial_org?.id || 0,
    counterparty_bank_name: response.counterparty_bank_name || "",
    counterparty_iban: response.counterparty_iban || "",
    counterparty_bik: response.counterparty_bik || "",
    premise_area: extractAreaNumber(response.premise_area),
    premise_address: response.premise_address || "",
    premise_usage_purpose: response.premise_usage_purpose || "",
  };

  if (response.contract_city) {
    formValues.contract_city_id = response.contract_city.id;
  }

  if (response.contract_date) {
    formValues.contract_date = new Date(response.contract_date);
  }

  if (response.rental_start_date) {
    formValues.rental_start_date = new Date(response.rental_start_date);
  }

  if (response.rental_end_date) {
    formValues.rental_end_date = new Date(response.rental_end_date);
  }

  if (response.rental_amount) {
    formValues.rental_amount = response.rental_amount;
  }

  if (response.first_month_payment_deadline) {
    formValues.first_month_payment_deadline = new Date(response.first_month_payment_deadline);
  }

  return formValues;
}

export function mapApiResponseToPreviewData(
  response: PremiseRentResponse,
  locale: "ru" | "kk" = "ru",
  _cities: CityResponse[] = [],
): PremiseRentPreviewData {
  let contractCity = "_____________";
  if (response.contract_city) {
    contractCity = locale === "kk" ? response.contract_city.name_kk : response.contract_city.name_ru;
  }

  const contractDate = response.contract_date
    ? formatDateForContract(new Date(response.contract_date), locale)
    : formatDateForContract(new Date(), locale);

  const rentalStartDate = response.rental_start_date
    ? formatDateForContract(new Date(response.rental_start_date), locale)
    : "_____________";

  const rentalEndDate = response.rental_end_date
    ? formatDateForContract(new Date(response.rental_end_date), locale)
    : "_____________";

  const firstMonthPaymentDeadline = response.first_month_payment_deadline
    ? formatDateForContract(new Date(response.first_month_payment_deadline), locale)
    : "_____________";

  let rentalTermText = "";
  if (response.rental_start_date && response.rental_end_date) {
    const startDate = new Date(response.rental_start_date);
    const endDate = new Date(response.rental_end_date);
    if (endDate > startDate) {
      rentalTermText = calculateRentalTerm(startDate, endDate, locale);
    }
  }

  let rentalAmountText = "";
  if (response.rental_amount) {
    const amountNum = Number(response.rental_amount);
    if (!isNaN(amountNum) && amountNum > 0) {
      rentalAmountText = numberToText(amountNum, locale);
    }
  }

  return {
    contract_city: contractCity,
    contract_date: contractDate,
    commercial_org_id: response.commercial_org?.id || 0,
    counterparty_bank_name: response.counterparty_bank_name || "",
    counterparty_iban: response.counterparty_iban || "",
    counterparty_bik: response.counterparty_bik || "",
    premise_area: extractAreaNumber(response.premise_area),
    premise_address: response.premise_address || "",
    premise_usage_purpose: response.premise_usage_purpose || "",
    rental_start_date: rentalStartDate,
    rental_end_date: rentalEndDate,
    rental_term_text: rentalTermText,
    rental_amount: response.rental_amount || "",
    rental_amount_text: rentalAmountText,
    first_month_payment_deadline: firstMonthPaymentDeadline,
  };
}
