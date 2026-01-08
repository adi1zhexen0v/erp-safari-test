import type {
  ResignationStatus,
  ApplicationReviewStatus,
  ApprovalResolution,
  Worker,
  CreatedBy,
  TerminationOrder,
} from "./domain";

export interface ResignationLetterResponse {
  id: number;
  status: ResignationStatus;
  organization: number;
  created_by: CreatedBy;
  worker: Worker;
  worker_id: number | null;
  last_working_day: string;
  approval_resolution: ApprovalResolution | "" | null;
  approval_resolution_display: string | null;
  application_signed_pdf_key: string | null;
  application_signed_pdf_url: string | null;
  application_uploaded_at: string | null;
  application_review_status: ApplicationReviewStatus | null;
  application_review_status_display: string | null;
  application_review_note: string | null;
  application_reviewed_at: string | null;
  application_reviewed_by: number | null;
  application_reviewed_by_name: string | null;
  order: TerminationOrder | null;
  is_processed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateResignationLetterDto {
  worker_id: number;
  last_working_day: string;
  approval_resolution?: ApprovalResolution;
}

export interface UpdateResignationLetterDto {
  approval_resolution?: ApprovalResolution;
}

export interface SubmitResponse {
  success: boolean;
  message: string;
  data: ResignationLetterResponse;
}

export interface CancelResponse {
  success: boolean;
  message: string;
  data: ResignationLetterResponse;
}

export interface UploadApplicationResponse {
  success: boolean;
  message: string;
  data: ResignationLetterResponse;
}

export interface ReviewApplicationRequest {
  action: "approve" | "reject" | "revision";
  note?: string;
}

export interface ReviewApplicationResponse {
  success: boolean;
  message: string;
  data: ResignationLetterResponse;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: ResignationLetterResponse;
}

export interface UploadOrderResponse {
  success: boolean;
  message: string;
  data: ResignationLetterResponse;
}

