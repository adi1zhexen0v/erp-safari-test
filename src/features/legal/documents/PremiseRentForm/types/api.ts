import type { CommercialOrganization } from "../../../types/commercialOrganizations";

export interface PremiseRentApiPayload {
  commercial_org_id: number;
  contract_city_id?: number;
  contract_date?: string;
  counterparty_bank_name?: string;
  counterparty_iban?: string;
  counterparty_bik?: string;
  premise_area?: string;
  premise_address?: string;
  premise_usage_purpose?: string;
  rental_start_date?: string;
  rental_end_date?: string;
  rental_amount?: string;
  first_month_payment_deadline?: string;
}

export interface PremiseRentCity {
  id: number;
  name_ru: string;
  name_kk: string;
}

export interface PremiseRentContract {
  id: number;
  status: string;
  organization: number;
  created_by: number;
  contract_city: PremiseRentCity | null;
  contract_date: string;
  commercial_org: CommercialOrganization;
  counterparty_bank_name: string;
  counterparty_iban: string;
  counterparty_bik: string;
  premise_area: string;
  premise_address: string;
  premise_usage_purpose: string;
  rental_start_date: string;
  rental_end_date: string;
  rental_amount: string;
  first_month_payment_deadline: string;
  trustme_status: number | null;
  trustme_url: string | null;
  draft_docx_key: string;
  signed_pdf_key: string;
  draft_docx_url?: string | null;
  signed_pdf_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PremiseRentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PremiseRentContract[];
}

export type PremiseRentResponse = PremiseRentContract;

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

