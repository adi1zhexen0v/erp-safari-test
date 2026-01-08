import { formatDateToISO, formatDateForContract, numberToText, formatRentalPeriodMonths } from "@/shared/utils";
import type { CityResponse } from "@/shared/api/common";
import type {
  GoodsSupplyFormValues,
  GoodsSupplyApiPayload,
  GoodsSupplyPreviewData,
  GoodsSupplyResponse,
} from "../types";

export function mapFormToApiPayload(formValues: GoodsSupplyFormValues): GoodsSupplyApiPayload {
  const payload: GoodsSupplyApiPayload = {
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

  if (formValues.delivery_address) {
    payload.delivery_address = formValues.delivery_address;
  }

  if (formValues.delivery_days !== undefined) {
    payload.delivery_days = formValues.delivery_days;
  }

  if (formValues.payment_days !== undefined) {
    payload.payment_days = formValues.payment_days;
  }

  if (formValues.court_location) {
    payload.court_location = formValues.court_location;
  }

  if (formValues.product_name) {
    payload.product_name = formValues.product_name;
  }

  if (formValues.product_model) {
    payload.product_model = formValues.product_model;
  }

  if (formValues.product_manufacturer) {
    payload.product_manufacturer = formValues.product_manufacturer;
  }

  if (formValues.product_power) {
    payload.product_power = formValues.product_power;
  }

  if (formValues.product_voltage) {
    payload.product_voltage = formValues.product_voltage;
  }

  if (formValues.product_material) {
    payload.product_material = formValues.product_material;
  }

  if (formValues.product_package) {
    payload.product_package = formValues.product_package;
  }

  if (formValues.product_size) {
    payload.product_size = formValues.product_size;
  }

  if (formValues.product_weight) {
    payload.product_weight = formValues.product_weight;
  }

  if (formValues.product_quantity !== undefined) {
    payload.product_quantity = formValues.product_quantity;
  }

  if (formValues.product_unit_price) {
    payload.product_unit_price = formValues.product_unit_price;
  }

  let calculatedProductTotalPrice = "";
  if (formValues.product_quantity !== undefined && formValues.product_unit_price) {
    const quantity = formValues.product_quantity;
    const unitPrice = Number(formValues.product_unit_price) || 0;
    calculatedProductTotalPrice = (quantity * unitPrice).toFixed(2);
  } else if (formValues.product_total_price) {
    calculatedProductTotalPrice = formValues.product_total_price;
  }

  if (calculatedProductTotalPrice) {
    payload.product_total_price = calculatedProductTotalPrice;
  }

  if (formValues.product_delivery_place) {
    payload.product_delivery_place = formValues.product_delivery_place;
  }

  if (formValues.product_warranty_term !== undefined) {
    payload.product_warranty_term = formValues.product_warranty_term;
  }

  if (calculatedProductTotalPrice) {
    payload.total_amount = calculatedProductTotalPrice;
  }

  return payload;
}

export function mapFormToPreviewData(
  formValues: GoodsSupplyFormValues,
  locale: "ru" | "kk" = "ru",
  cities: CityResponse[] = [],
): GoodsSupplyPreviewData {
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

  let totalAmount = "";
  let productTotalPrice = "";
  if (formValues.product_quantity !== undefined && formValues.product_unit_price) {
    const quantity = formValues.product_quantity;
    const unitPrice = Number(formValues.product_unit_price) || 0;
    const total = (quantity * unitPrice).toFixed(2);
    productTotalPrice = total;
    totalAmount = total;
  } else if (formValues.product_total_price) {
    productTotalPrice = formValues.product_total_price;
    totalAmount = formValues.product_total_price;
  }

  let totalAmountText = "";
  if (totalAmount) {
    const amountNum = Number(totalAmount);
    if (!isNaN(amountNum) && amountNum > 0) {
      totalAmountText = numberToText(amountNum, locale);
    }
  }

  let deliveryDaysText = "";
  if (formValues.delivery_days !== undefined) {
    const daysNum = formValues.delivery_days;
    if (daysNum > 0) {
      deliveryDaysText = numberToText(daysNum, locale);
    }
  }

  let paymentDaysText = "";
  if (formValues.payment_days !== undefined) {
    const daysNum = formValues.payment_days;
    if (daysNum > 0) {
      paymentDaysText = numberToText(daysNum, locale);
    }
  }

  let productWarrantyTerm = "";
  let productWarrantyMonths = "";
  if (formValues.product_warranty_term !== undefined) {
    const months = formValues.product_warranty_term;
    productWarrantyMonths = months.toString();
    if (months > 0) {
      productWarrantyTerm = formatRentalPeriodMonths(months, locale);
    }
  }

  return {
    contract_city: contractCity,
    contract_date: contractDate,
    commercial_org_id: formValues.commercial_org_id,
    counterparty_bank_name: formValues.counterparty_bank_name || "",
    counterparty_iban: formValues.counterparty_iban || "",
    counterparty_bik: formValues.counterparty_bik || "",
    delivery_address: formValues.delivery_address || "",
    delivery_days: formValues.delivery_days !== undefined ? formValues.delivery_days.toString() : "",
    delivery_days_text: deliveryDaysText,
    total_amount: totalAmount,
    total_amount_text: totalAmountText,
    payment_days: formValues.payment_days !== undefined ? formValues.payment_days.toString() : "",
    payment_days_text: paymentDaysText,
    court_location: formValues.court_location || "",
    product_name: formValues.product_name || "",
    product_model: formValues.product_model || "",
    product_manufacturer: formValues.product_manufacturer || "",
    product_power: formValues.product_power,
    product_voltage: formValues.product_voltage,
    product_material: formValues.product_material,
    product_package: formValues.product_package,
    product_size: formValues.product_size,
    product_weight: formValues.product_weight,
    product_quantity: formValues.product_quantity !== undefined ? formValues.product_quantity.toString() : "",
    product_unit_price: formValues.product_unit_price || "",
    product_total_price: productTotalPrice,
    product_delivery_place: formValues.product_delivery_place || "",
    product_warranty_term: productWarrantyTerm,
    product_warranty_months: productWarrantyMonths,
  };
}

export function mapApiResponseToForm(response: GoodsSupplyResponse): GoodsSupplyFormValues {
  const formValues: GoodsSupplyFormValues = {
    commercial_org_id: response.commercial_org?.id || 0,
    counterparty_bank_name: response.counterparty_bank_name || "",
    counterparty_iban: response.counterparty_iban || "",
    counterparty_bik: response.counterparty_bik || "",
    delivery_address: response.delivery_address || "",
    court_location: response.court_location || "",
    product_name: response.product_name || "",
    product_model: response.product_model || "",
    product_manufacturer: response.product_manufacturer || "",
    product_delivery_place: response.product_delivery_place || "",
  };

  if (response.contract_city) {
    formValues.contract_city_id = response.contract_city.id;
  }

  if (response.contract_date) {
    formValues.contract_date = new Date(response.contract_date);
  }

  if (response.delivery_days !== undefined) {
    formValues.delivery_days = response.delivery_days;
  }

  if (response.payment_days !== undefined) {
    formValues.payment_days = response.payment_days;
  }

  if (response.product_power) {
    formValues.product_power = response.product_power;
  }

  if (response.product_voltage) {
    formValues.product_voltage = response.product_voltage;
  }

  if (response.product_material) {
    formValues.product_material = response.product_material;
  }

  if (response.product_package) {
    formValues.product_package = response.product_package;
  }

  if (response.product_size) {
    formValues.product_size = response.product_size;
  }

  if (response.product_weight) {
    formValues.product_weight = response.product_weight;
  }

  if (response.product_quantity !== undefined) {
    formValues.product_quantity = response.product_quantity;
  }

  if (response.product_unit_price) {
    formValues.product_unit_price = response.product_unit_price;
  }

  if (response.product_total_price) {
    formValues.product_total_price = response.product_total_price;
  }

  if (response.product_warranty_term !== undefined) {
    formValues.product_warranty_term = response.product_warranty_term;
  }

  return formValues;
}

