export type AmendmentStatus =
  | "draft"
  | "app_pending"
  | "app_review"
  | "app_approved"
  | "order_pending"
  | "order_uploaded"
  | "agr_pending"
  | "applied"
  | "cancelled";

export type ApplicationReviewStatus = "pending" | "approved" | "rejected" | "revision";

export type ApprovalResolution = "approved" | "supported" | "no_objection";

export interface TrustMeDocument {
  document_id: string;
  url: string;
  status: number;
  status_display: string;
  signed_pdf_key: string | null;
  signed_pdf_url: string | null;
}

export interface CreatedBy {
  id: number;
  full_name: string;
}

export interface AmendmentWorker {
  id: number;
  full_name: string;
  iin: string;
}

export interface AmendmentClause {
  section_number: string;
  has_placeholders: boolean;
}

export interface PositionValuesJson {
  job_position_ru?: string;
  job_position_kk?: string;
  job_duties_ru?: string[];
  job_duties_kk?: string[];
  trial_period?: boolean;
  trial_duration_months?: number | null;
}

export interface SalaryValuesJson {
  salary_amount?: string;
}

export type AmendmentValuesJson = PositionValuesJson | SalaryValuesJson;

