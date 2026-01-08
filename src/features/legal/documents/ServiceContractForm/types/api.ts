export interface ServiceContractServiceItemInput {
  service_name: string;
  start_date?: string;
  end_date?: string;
  price?: string;
  order?: number;
}

export interface ServiceContractApiPayload {
  contract_city_id?: number;
  contract_date?: string;
  contract_end_date?: string;
  executor_full_name?: string;
  executor_phone?: string;
  executor_iin?: string;
  executor_bank_name?: string;
  executor_iban?: string;
  executor_bik?: string;
  service_name?: string;
  service_location?: string;
  service_period_text?: string;
  contract_amount?: string;
  services?: ServiceContractServiceItemInput[];
}

export interface ServiceContractServiceItem {
  id: number;
  service_name: string;
  start_date: string;
  end_date: string;
  price: string;
  order: number;
  date_range: string;
}

export interface ServiceContractCity {
  id: number;
  name_ru: string;
  name_kk: string;
}

export interface ServiceContractContract {
  id: number;
  status: "draft" | "pending_signing" | "signed" | "revoked";
  organization: number;
  created_by: number;
  contract_city: ServiceContractCity | null;
  contract_date: string;
  executor_full_name: string;
  executor_phone: string;
  executor_iin: string;
  contract_amount: string;
  contract_end_date: string;
  executor_bank_name: string;
  executor_iban: string;
  executor_bik: string;
  service_name: string;
  service_location: string;
  service_period_text: string;
  service_items: ServiceContractServiceItem[];
  trustme_status: number | null;
  trustme_url: string | null;
  draft_docx_key: string;
  signed_pdf_key: string;
  draft_docx_url: string | null;
  signed_pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceContractListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceContractContract[];
}

export type ServiceContractResponse = ServiceContractContract;

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

