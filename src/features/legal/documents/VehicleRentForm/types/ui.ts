export interface VehicleRentFormValues {
  contract_city_id?: number;
  contract_date?: Date | null;
  commercial_org_id: number;
  counterparty_bank_name: string;
  counterparty_iban: string;
  counterparty_bik: string;
  car_brand: string;
  car_year?: number;
  car_vin: string;
  car_plate: string;
  car_color: string;
  rental_term_months?: number;
  rental_amount?: string;
}

export interface VehicleRentPreviewData {
  contract_city: string;
  contract_date: string;
  commercial_org_id: number;
  counterparty_bank_name: string;
  counterparty_iban: string;
  counterparty_bik: string;
  car_brand: string;
  car_year: string;
  car_vin: string;
  car_plate: string;
  car_color: string;
  rental_term_text: string;
  rental_amount: string;
  rental_amount_text: string;
}

