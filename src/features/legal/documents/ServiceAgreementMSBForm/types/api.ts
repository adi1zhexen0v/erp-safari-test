import type { CommercialOrganization } from "../../../types/commercialOrganizations";

export interface ServiceAgreementMSBApiPayload {
  commercial_org_id: number;
  contract_city_id?: number;
  contract_date?: string;
  counterparty_bank_name?: string;
  counterparty_iban?: string;
  counterparty_bik?: string;
  services_description?: string;
  service_start_date?: string;
  service_end_date?: string;
  correction_days?: number;
  payment_days?: number;
  contract_amount?: string;
  penalty_percent?: string;
  daily_penalty_percent?: string;
  dispute_resolution_body?: string;
}

export interface ServiceAgreementMSBCity {
  id: number;
  name_ru: string;
  name_kk: string;
}

export interface ServiceAgreementMSBContract {
  id: number;
  status: string;
  organization: number;
  created_by: number;
  contract_city: ServiceAgreementMSBCity | null;
  contract_date: string;
  commercial_org: CommercialOrganization;
  counterparty_bank_name: string;
  counterparty_iban: string;
  counterparty_bik: string;
  services_description: string;
  service_start_date: string;
  service_end_date: string;
  correction_days: number;
  payment_days: number;
  contract_amount: string;
  penalty_percent: string;
  daily_penalty_percent: string;
  dispute_resolution_body: string;
  trustme_status: number | null;
  trustme_url: string | null;
  draft_docx_key: string;
  signed_pdf_key: string;
  draft_docx_url?: string | null;
  signed_pdf_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceAgreementMSBListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceAgreementMSBContract[];
}

export type ServiceAgreementMSBResponse = ServiceAgreementMSBContract;

export interface SubmitForSigningResponse {
  success: boolean;
  message: string;
  data: {
    trustme_document_id: string;
    trustme_url: string;
    trustme_status: number;
    docx_key: string;
    document_id: number;
    status: string;
  };
}

