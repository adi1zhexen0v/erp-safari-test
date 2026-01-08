export interface PremiseRentFormValues {
  contract_city_id?: number;
  contract_date?: Date | null;
  commercial_org_id: number;
  counterparty_bank_name: string;
  counterparty_iban: string;
  counterparty_bik: string;
  premise_area?: string;
  premise_address?: string;
  premise_usage_purpose?: string;
  rental_start_date?: Date | null;
  rental_end_date?: Date | null;
  rental_amount?: string;
  first_month_payment_deadline?: Date | null;
}

export interface PremiseRentPreviewData {
  contract_city: string;
  contract_date: string;
  commercial_org_id: number;
  counterparty_bank_name: string;
  counterparty_iban: string;
  counterparty_bik: string;
  premise_area: string;
  premise_address: string;
  premise_usage_purpose: string;
  rental_start_date: string;
  rental_end_date: string;
  rental_term_text: string;
  rental_amount: string;
  rental_amount_text: string;
  first_month_payment_deadline: string;
}

