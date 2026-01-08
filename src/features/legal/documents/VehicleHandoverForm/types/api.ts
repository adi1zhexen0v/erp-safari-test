export interface VehicleHandoverAct {
  id: number;
  parent_contract: number;
  parent_contract_status: string;
  status: string;
  organization: number;
  created_by: number;
  act_date: string;
  trustme_status: number | null;
  trustme_url: string | null;
  draft_docx_key: string;
  signed_pdf_key: string;
  draft_docx_url?: string | null;
  signed_pdf_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleHandoverListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VehicleHandoverAct[];
}

export type VehicleHandoverResponse = VehicleHandoverAct;

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

export interface VehicleHandoverApiPayload {
  parent_contract: number;
  act_date?: string;
}

