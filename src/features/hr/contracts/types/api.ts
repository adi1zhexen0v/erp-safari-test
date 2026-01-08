import type { TrustMeDocument, Worker } from "./domain";

export interface CreateContractDto {
  application_id: number;
  sign_date: string;
  start_date: string;
  work_city_id: number;
  job_position_ru: string;
  job_position_kk: string;
  job_duties_ru: string[];
  job_duties_kk: string[];
  trial_period?: boolean;
  trial_duration_months?: number;
  work_start_time: string;
  work_end_time: string;
  break_start_time?: string;
  break_end_time?: string;
  working_days_list: string[];
  salary_amount: string;
  employee_address_ru: string;
  employee_address_kk: string;
  is_online?: boolean;
}

export interface CreateContractResponse {
  success: boolean;
  message: string;
  contract_id: number;
  contract_number: string;
  end_date: string;
}

export interface CreateContractAlreadyExistsResponse {
  error: string;
  contract_id: number;
}

export interface ContractDetailResponse {
  id: number;
  contract_number: string;
  sign_date: string;
  start_date: string;
  end_date: string;
  work_city: string;
  contract_type: "indefinite" | "fixed_term";
  is_active: boolean;
  is_complete: boolean;
  job_position_ru: string;
  job_position_kk: string;
  job_duties_ru: string[];
  job_duties_kk: string[];
  work_start_time: string;
  work_end_time: string;
  break_start_time: string | null;
  break_end_time: string | null;
  working_days_list: ("Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun")[];
  salary_amount: string;
  salary_type: "fixed" | "hourly";
  employee_address_ru: string;
  employee_address_kk: string;
  is_online: boolean;
  trial_period: boolean;
  trial_duration_months: number | null;
  trustme_status: number;
  status_display: string;
  trustme_document: TrustMeDocument | null;
  job_application: JobApplication | null;
  candidate_application: number | null;
  worker: Worker | null;
  created_at: string;
  updated_at: string;
}

export interface ListContractsResponse {
  id: number;
  contract_number: string;
  candidate_application_id: number | null;
  candidate_stage: string;
  candidate_status: string;
  sign_date: string;
  start_date: string;
  end_date: string;
  job_position_ru: string;
  job_position_kk: string;
  salary_amount: string;
  is_online: boolean;
  trustme_status: number;
  status_display: string;
  trustme_document: TrustMeDocument | null;
  candidate_name: string;
  worker: Worker | null;
  job_application: JobApplication | null;
  job_application_url: string | null;
  job_application_signed_pdf_url: string | null;
  order_url: string | null;
  order_signed_pdf_url: string | null;
  created_at: string;
}

export interface SubmitForSigningResponse {
  success: boolean;
  message: string;
  data: {
    trustme_document_id: string;
    trustme_url: string;
    trustme_status: number;
    status_display: string;
    docx_preview_url: string;
    contract_id: number;
  };
}

export interface ContractClause {
  section_number: string;
  content_ru: string;
  content_kk: string;
  has_placeholders: boolean;
  placeholders: string[];
}

export type ContractClausesResponse = ContractClause[];

export type JobApplicationStage =
  | "decision"
  | "contract_signed"
  | "job_app_pending"
  | "job_app_review"
  | "job_app_approved"
  | "order_pending"
  | "order_uploaded"
  | "completed";

export type JobApplicationReviewStatus = "approved" | "rejected" | "revision" | null;

export interface JobApplication {
  id: number;
  stage: JobApplicationStage;
  trustme_status: number | null;
  trustme_url: string | null;
  signed_pdf_url: string | null;
  job_application_signed_pdf_key: string | null;
  job_application_uploaded_at: string | null;
  job_application_review_status: JobApplicationReviewStatus;
  job_application_review_note: string | null;
  job_application_reviewed_at: string | null;
  reviewed_by_name: string | null;
  order_id: number | null;
  is_migration_triggered: boolean;
  created_at: string;
}

export interface JobApplicationReviewRequest {
  action: "approve" | "reject" | "revision";
  note?: string;
}

export interface JobApplicationReviewResponse {
  id: number;
  stage: JobApplicationStage;
  job_application_signed_pdf_key: string;
  signed_pdf_url: string;
  job_application_uploaded_at: string;
  job_application_review_status: JobApplicationReviewStatus;
  job_application_review_note: string | null;
  job_application_reviewed_at: string;
  reviewed_by_name: string;
}

export interface OrderOnHiring {
  id: number;
  order_number: number;
  candidate_application_id: number;
  candidate_name: string;
  worker_id: number | null;
  worker_name: string | null;
  contract_draft_id: number;
  organization_id: number;
  signed_pdf_key: string | null;
  signed_pdf_url: string | null;
  created_by_name: string;
  created_at: string;
  uploaded_at: string | null;
  completed_at: string | null;
}

export interface OrderOnHiringResponse {
  id: number;
  order_number: number;
  candidate_application_id: number;
  candidate_name: string;
  worker_id: number | null;
  worker_name: string | null;
  contract_draft_id: number;
  organization_id: number;
  signed_pdf_key: string | null;
  signed_pdf_url: string | null;
  created_by_name: string;
  created_at: string;
  uploaded_at: string | null;
  completed_at: string | null;
}

export interface CompleteHiringResponse {
  worker_id: number;
  worker_name: string;
  order_id: number;
  message: string;
}

export type { AmendmentListResponse as AmendmentResponse } from "@/features/hr/amendments/types";
