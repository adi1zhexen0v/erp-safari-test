export interface ServiceAgreementMSBFormValues {
  contract_city_id?: number;
  contract_date?: Date | null;
  commercial_org_id: number;
  counterparty_bank_name: string;
  counterparty_iban: string;
  counterparty_bik: string;
  services_description: string;
  service_start_date?: Date | null;
  service_end_date?: Date | null;
  correction_days?: number;
  payment_days?: number;
  contract_amount?: string;
  penalty_percent?: string;
  daily_penalty_percent?: string;
  dispute_resolution_body: string;
}

export interface ServiceAgreementMSBPreviewData {
  contract_city: string;
  contract_date: string;
  commercial_org_id: number;
  counterparty_bank_name: string;
  counterparty_iban: string;
  counterparty_bik: string;
  services_description: string;
  service_start_date: string;
  service_end_date: string;
  correction_days: string;
  payment_days: string;
  contract_amount: string;
  contract_amount_text: string;
  penalty_percent: string;
  daily_penalty_percent: string;
  dispute_resolution_body: string;
}

