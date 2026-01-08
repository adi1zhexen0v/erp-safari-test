import type {
  AmendmentStatus,
  ApplicationReviewStatus,
  ApprovalResolution,
  TrustMeDocument,
  CreatedBy,
  AmendmentWorker,
  AmendmentClause,
  AmendmentValuesJson,
} from "./domain";

export interface CreatePositionAmendmentDto {
  worker_id: number;
  effective_date: string;
  approval_resolution?: ApprovalResolution;
  new_values: {
    job_position_ru: string;
    job_position_kk: string;
    job_duties_ru?: string[];
    job_duties_kk?: string[];
    trial_period?: boolean;
    trial_duration_months?: number | null;
  };
}

export interface CreateSalaryAmendmentDto {
  worker_id: number;
  effective_date: string;
  approval_resolution?: ApprovalResolution;
  new_values: {
    salary_amount: string;
  };
}

export interface CreateOtherAmendmentDto {
  worker_id: number;
  clause_section: string;
  effective_date: string;
  approval_resolution?: ApprovalResolution;
  new_clause_text_ru: string;
  new_clause_text_kk: string;
}

export interface CreateAmendmentResponse {
  id: number;
  amendment_number: number;
  clause_section: string;
  status: AmendmentStatus;
  effective_date: string;
  created_at: string;
}

export interface AmendmentListResponse {
  id: number;
  amendment_number: number;
  worker: AmendmentWorker;
  contract_draft_id: number;
  clause: AmendmentClause;
  effective_date: string;
  approval_resolution: string;
  approval_resolution_display: string;
  application_review_status: ApplicationReviewStatus | null;
  status: AmendmentStatus;
  status_display: string;
  created_at: string;
  updated_at: string;
  applied_at: string | null;
  application_pdf_url: string | null;
  agreement_signing_url: string | null;
}

export interface AmendmentDetailResponse {
  id: number;
  amendment_number: number;
  worker: AmendmentWorker;
  contract_draft_id: number;
  clause: AmendmentClause;
  organization_id: number;
  created_by: CreatedBy;
  effective_date: string;
  approval_resolution: string;
  approval_resolution_display: string;
  old_clause_text_ru: string | null;
  old_clause_text_kk: string | null;
  new_clause_text_ru: string | null;
  new_clause_text_kk: string | null;
  old_values_json: AmendmentValuesJson | null;
  new_values_json: AmendmentValuesJson | null;
  application_signed_pdf_key: string | null;
  application_pdf_url: string | null;
  application_uploaded_at: string | null;
  application_review_status: ApplicationReviewStatus | null;
  application_review_note: string | null;
  application_reviewed_at: string | null;
  application_reviewed_by: CreatedBy | null;
  status: AmendmentStatus;
  status_display: string;
  created_at: string;
  updated_at: string;
  applied_at: string | null;
  agreement_trustme: TrustMeDocument | null;
  order_id: number | null;
  order_url: string | null;
  order_signed_pdf_url: string | null;
}

export interface ApplicationStatusResponse {
  id: number;
  status: AmendmentStatus;
  application_signed_pdf_key: string | null;
  application_pdf_url: string | null;
  application_uploaded_at: string | null;
  application_review_status: ApplicationReviewStatus | null;
  application_review_note: string | null;
  application_reviewed_at: string | null;
  reviewed_by_name: string | null;
}

export interface ReviewApplicationRequest {
  action: "approve" | "reject" | "revision";
  note?: string;
}

export interface AmendmentOrderResponse {
  id: number;
  order_number: number;
  amendment_id: number;
  organization_id: number;
  signed_pdf_key: string | null;
  signed_pdf_url: string | null;
  created_by_name: string;
  created_at: string;
  uploaded_at: string | null;
}

export interface SubmitAgreementResponse {
  signing_url: string;
  status: AmendmentStatus;
}

