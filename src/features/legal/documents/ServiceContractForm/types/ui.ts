export interface ServiceContractFormValues {
  contract_city_id?: number;
  contract_date?: Date | null;
  contract_end_date?: Date | null;
  executor_full_name: string;
  executor_phone: string;
  executor_iin: string;
  executor_bank_name: string;
  executor_iban: string;
  executor_bik: string;
  service_name: string;
  service_location: string;
  services: Array<{
    service_name: string;
    start_date: Date | null;
    end_date: Date | null;
    price: string;
    order?: number;
  }>;
}

export interface ServiceContractPreviewData {
  contract_city: string;
  contract_date: string;
  contract_end_date_kk: string;
  contract_end_date_ru: string;
  executor_full_name: string;
  executor_phone: string;
  executor_iin: string;
  executor_bank_name: string;
  executor_iban: string;
  executor_bik: string;
  service_name: string;
  service_location: string;
  service_period_text: string;
  contract_amount: string;
  contract_amount_kk_text: string;
  contract_amount_ru_text: string;
  services: Array<{
    service_name: string;
    start_date: string;
    end_date: string;
    price: string;
    order?: number;
  }>;
}

