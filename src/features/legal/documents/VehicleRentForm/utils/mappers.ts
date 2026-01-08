import { formatDateToISO, formatDateForContract, numberToText } from "@/shared/utils";
import type { CityResponse } from "@/shared/api/common";
import type {
  VehicleRentFormValues,
  VehicleRentApiPayload,
  VehicleRentPreviewData,
  VehicleRentResponse,
} from "../types";
import { formatRentalTerm } from "./utils";

export function mapFormToApiPayload(formValues: VehicleRentFormValues): VehicleRentApiPayload {
  const payload: VehicleRentApiPayload = {
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

  if (formValues.car_brand) {
    payload.car_brand = formValues.car_brand;
  }

  if (formValues.car_year !== undefined) {
    payload.car_year = formValues.car_year;
  }

  if (formValues.car_vin) {
    payload.car_vin = formValues.car_vin;
  }

  if (formValues.car_plate) {
    payload.car_plate = formValues.car_plate;
  }

  if (formValues.car_color) {
    payload.car_color = formValues.car_color;
  }

  if (formValues.rental_term_months !== undefined) {
    payload.rental_term_months = formValues.rental_term_months;
  }

  if (formValues.rental_amount) {
    payload.rental_amount = formValues.rental_amount;
  }

  return payload;
}

export function mapFormToPreviewData(
  formValues: VehicleRentFormValues,
  locale: "ru" | "kk" = "ru",
  cities: CityResponse[] = [],
): VehicleRentPreviewData {
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

  let rentalAmountText = "";
  if (formValues.rental_amount) {
    const amountNum = Number(formValues.rental_amount);
    if (!isNaN(amountNum) && amountNum > 0) {
      rentalAmountText = numberToText(amountNum, locale);
    }
  }

  const rentalTermText = formatRentalTerm(formValues.rental_term_months, locale);
  const carYear = formValues.car_year !== undefined ? String(formValues.car_year) : "";

  return {
    contract_city: contractCity,
    contract_date: contractDate,
    commercial_org_id: formValues.commercial_org_id,
    counterparty_bank_name: formValues.counterparty_bank_name || "",
    counterparty_iban: formValues.counterparty_iban || "",
    counterparty_bik: formValues.counterparty_bik || "",
    car_brand: formValues.car_brand || "",
    car_year: carYear,
    car_vin: formValues.car_vin || "",
    car_plate: formValues.car_plate || "",
    car_color: formValues.car_color || "",
    rental_term_text: rentalTermText,
    rental_amount: formValues.rental_amount || "",
    rental_amount_text: rentalAmountText,
  };
}

export function mapApiResponseToForm(response: VehicleRentResponse): VehicleRentFormValues {
  const formValues: VehicleRentFormValues = {
    commercial_org_id: response.commercial_org?.id || 0,
    counterparty_bank_name: response.counterparty_bank_name || "",
    counterparty_iban: response.counterparty_iban || "",
    counterparty_bik: response.counterparty_bik || "",
    car_brand: response.car_brand || "",
    car_vin: response.car_vin || "",
    car_plate: response.car_plate || "",
    car_color: response.car_color || "",
  };

  if (response.contract_city) {
    formValues.contract_city_id = response.contract_city.id;
  }

  if (response.contract_date) {
    formValues.contract_date = new Date(response.contract_date);
  }

  if (response.rental_term_months !== undefined) {
    formValues.rental_term_months = response.rental_term_months;
  }

  if (response.car_year !== undefined) {
    formValues.car_year = response.car_year;
  }

  if (response.rental_amount) {
    formValues.rental_amount = response.rental_amount;
  }

  return formValues;
}
