import { formatDateToISO, formatDateForContract, numberToText } from "@/shared/utils";
import type { CityResponse } from "@/shared/api/common";
import type {
  ServiceContractFormValues,
  ServiceContractApiPayload,
  ServiceContractPreviewData,
  ServiceContractResponse,
} from "../types";

export function mapFormToApiPayload(formValues: ServiceContractFormValues): ServiceContractApiPayload {
  const payload: ServiceContractApiPayload = {};

  if (formValues.contract_city_id !== undefined) {
    payload.contract_city_id = formValues.contract_city_id;
  }

  if (formValues.contract_date) {
    payload.contract_date = formatDateToISO(formValues.contract_date);
  }

  let maxEndDate: Date | null = null;
  if (formValues.services && formValues.services.length > 0) {
    for (const service of formValues.services) {
      if (service.end_date) {
        if (!maxEndDate || service.end_date > maxEndDate) {
          maxEndDate = service.end_date;
        }
      }
    }
  }

  if (maxEndDate) {
    payload.contract_end_date = formatDateToISO(maxEndDate);
  }

  if (formValues.executor_full_name) {
    payload.executor_full_name = formValues.executor_full_name;
  }

  if (formValues.executor_phone) {
    payload.executor_phone = formValues.executor_phone;
  }

  if (formValues.executor_iin) {
    payload.executor_iin = formValues.executor_iin;
  }

  if (formValues.executor_bank_name) {
    payload.executor_bank_name = formValues.executor_bank_name;
  }

  if (formValues.executor_iban) {
    payload.executor_iban = formValues.executor_iban;
  }

  if (formValues.executor_bik) {
    payload.executor_bik = formValues.executor_bik;
  }

  if (formValues.service_name) {
    payload.service_name = formValues.service_name;
  }

  if (formValues.service_location) {
    payload.service_location = formValues.service_location;
  }

  const contractAmountNum = formValues.services.reduce((sum, service) => {
    const price = Number(service.price) || 0;
    return sum + price;
  }, 0);

  if (contractAmountNum > 0) {
    payload.contract_amount = contractAmountNum.toFixed(2);
  }

  if (formValues.services && formValues.services.length > 0) {
    payload.services = formValues.services.map((service, index) => ({
      service_name: service.service_name,
      start_date: service.start_date ? formatDateToISO(service.start_date) : undefined,
      end_date: service.end_date ? formatDateToISO(service.end_date) : undefined,
      price: service.price || undefined,
      order: index,
    }));
  }

  return payload;
}

function calculateServicePeriod(startDate: Date | null, endDate: Date | null): number | null {
  if (!startDate || !endDate) return null;

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null;

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  const months = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  return months > 0 ? months : null;
}

function formatServicePeriod(months: number | null, locale: "ru" | "kk"): string {
  if (months === null || months <= 0) return "";

  const textLocale = locale === "kk" ? "kk" : "ru";
  const numText = numberToText(months, textLocale);

  let monthWord: string;
  if (locale === "ru") {
    if (months === 1) {
      monthWord = "месяц";
    } else if (months >= 2 && months <= 4) {
      monthWord = "месяца";
    } else {
      monthWord = "месяцев";
    }
  } else if (locale === "kk") {
    monthWord = "ай";
  } else {
    monthWord = months === 1 ? "month" : "months";
  }

  return `${months} (${numText}) ${monthWord}`;
}

export function mapFormToPreviewData(
  formValues: ServiceContractFormValues,
  locale: "ru" | "kk" = "ru",
  cities: CityResponse[] = [],
): ServiceContractPreviewData {
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

  let maxEndDate: Date | null = null;
  if (formValues.services && formValues.services.length > 0) {
    for (const service of formValues.services) {
      if (service.end_date) {
        if (!maxEndDate || service.end_date > maxEndDate) {
          maxEndDate = service.end_date;
        }
      }
    }
  }

  const contractEndDateKk = maxEndDate
    ? formatDateForContract(maxEndDate, "kk", false, true)
    : "_____________";
  const contractEndDateRu = maxEndDate
    ? formatDateForContract(maxEndDate, "ru")
    : "_____________";

  let servicePeriodText = "";
  if (formValues.services && formValues.services.length > 0) {
    let minStartDate: Date | null = null;
    let maxEndDate: Date | null = null;

    for (const service of formValues.services) {
      if (service.start_date) {
        if (!minStartDate || service.start_date < minStartDate) {
          minStartDate = service.start_date;
        }
      }
      if (service.end_date) {
        if (!maxEndDate || service.end_date > maxEndDate) {
          maxEndDate = service.end_date;
        }
      }
    }

    if (minStartDate && maxEndDate) {
      const months = calculateServicePeriod(minStartDate, maxEndDate);
      if (months !== null) {
        servicePeriodText = formatServicePeriod(months, locale);
      }
    }
  }

  const contractAmountNum = formValues.services.reduce((sum, service) => {
    const price = Number(service.price) || 0;
    return sum + price;
  }, 0);
  const contractAmount = contractAmountNum > 0 ? contractAmountNum.toFixed(2) : "";

  const contractAmountKkText = contractAmountNum > 0 ? numberToText(contractAmountNum, "kk") : "";
  const contractAmountRuText = contractAmountNum > 0 ? numberToText(contractAmountNum, "ru") : "";

  const services = formValues.services.map((service, index) => ({
    service_name: service.service_name || "",
    start_date: service.start_date ? formatDateToISO(service.start_date) : "",
    end_date: service.end_date ? formatDateToISO(service.end_date) : "",
    price: service.price || "",
    order: index,
  }));

  return {
    contract_city: contractCity,
    contract_date: contractDate,
    contract_end_date_kk: contractEndDateKk,
    contract_end_date_ru: contractEndDateRu,
    executor_full_name: formValues.executor_full_name || "",
    executor_phone: formValues.executor_phone || "",
    executor_iin: formValues.executor_iin || "",
    executor_bank_name: formValues.executor_bank_name || "",
    executor_iban: formValues.executor_iban || "",
    executor_bik: formValues.executor_bik || "",
    service_name: formValues.service_name || "",
    service_location: formValues.service_location || "",
    service_period_text: servicePeriodText,
    contract_amount: contractAmount,
    contract_amount_kk_text: contractAmountKkText,
    contract_amount_ru_text: contractAmountRuText,
    services,
  };
}

export function mapApiResponseToForm(response: ServiceContractResponse): ServiceContractFormValues {
  const formValues: ServiceContractFormValues = {
    executor_full_name: response.executor_full_name || "",
    executor_phone: response.executor_phone || "",
    executor_iin: response.executor_iin || "",
    executor_bank_name: response.executor_bank_name || "",
    executor_iban: response.executor_iban || "",
    executor_bik: response.executor_bik || "",
    service_name: response.service_name || "",
    service_location: response.service_location || "",
    services: [],
  };

  if (response.contract_city) {
    formValues.contract_city_id = response.contract_city.id;
  }

  if (response.contract_date) {
    formValues.contract_date = new Date(response.contract_date);
  }

  formValues.contract_end_date = null;

  if (response.service_items && response.service_items.length > 0) {
    formValues.services = response.service_items.map((item) => ({
      service_name: item.service_name || "",
      start_date: item.start_date ? new Date(item.start_date) : null,
      end_date: item.end_date ? new Date(item.end_date) : null,
      price: item.price || "",
      order: item.order,
    }));
  } else {
    formValues.services = [{ service_name: "", start_date: null, end_date: null, price: "" }];
  }

  return formValues;
}

