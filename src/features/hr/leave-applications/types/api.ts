import type {
  LeaveStatus,
  ApplicationReviewStatus,
  LeaveType,
  Worker,
  CreatedBy,
} from "./domain";

export interface VacationOrder {
  id: number;
  order_number: number;
  signed_pdf_key: string | null;
  pdf_url: string | null;
  uploaded_at: string | null;
  created_at: string;
  created_by: number;
  created_by_name: string;
  leave_type: "annual" | "unpaid";
}

export interface MedicalLeaveOrder {
  id: number;
  order_number: number;
  signed_pdf_key: string | null;
  pdf_url: string | null;
  uploaded_at: string | null;
  created_at: string;
  created_by: number;
  created_by_name: string;
}

export interface BaseLeaveResponse {
  id: number;
  status: LeaveStatus;
  organization: number;
  created_by: CreatedBy;
  worker: Worker;
  start_date: string;
  end_date: string;
  days_count: number;
  is_completed: boolean;
  application_signed_pdf_key: string | null;
  application_signed_pdf_url: string | null;
  application_uploaded_at: string | null;
  application_review_status: ApplicationReviewStatus | null;
  application_review_note: string | null;
  application_reviewed_at: string | null;
  application_reviewed_by: number | null;
  application_reviewed_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnnualLeaveResponse extends BaseLeaveResponse {
  reason: string | null;
  order: VacationOrder | null;
}

export interface UnpaidLeaveResponse extends BaseLeaveResponse {
  reason: string;
  approval_resolution: "approved" | "recommend" | "no_objection" | "" | null;
  approval_resolution_display: string | null;
  order: VacationOrder | null;
}

export interface MedicalLeaveResponse extends BaseLeaveResponse {
  diagnosis: string | null;
  certificate_pdf_key: string | null;
  certificate_pdf_url: string | null;
  certificate_uploaded_at: string | null;
  certificate_required: boolean;
  order: MedicalLeaveOrder | null;
}

export type LeaveApplication = (AnnualLeaveResponse | UnpaidLeaveResponse | MedicalLeaveResponse) & {
  leave_type: LeaveType;
};

export interface CreateAnnualLeaveDto {
  worker_id: number;
  start_date: string;
  end_date: string;
  reason?: string;
}

export interface CreateUnpaidLeaveDto {
  worker_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  approval_resolution?: "approved" | "recommend" | "no_objection";
}

export interface CreateMedicalLeaveDto {
  worker_id: number;
  start_date: string;
  end_date: string;
  diagnosis?: string;
  certificate_required?: boolean;
}

export interface UpdateAnnualLeaveDto {
  start_date?: string;
  end_date?: string;
  reason?: string;
}

export interface UpdateUnpaidLeaveDto {
  start_date?: string;
  end_date?: string;
  reason?: string;
  approval_resolution?: "approved" | "recommend" | "no_objection";
}

export interface UpdateMedicalLeaveDto {
  start_date?: string;
  end_date?: string;
  diagnosis?: string;
  certificate_required?: boolean;
}

export interface ApplicationStatusResponse {
  id: number;
  status: LeaveStatus;
  application_signed_pdf_key: string | null;
  pdf_url: string | null;
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

export interface VacationsResponse {
  annual_leave: AnnualLeaveResponse[];
  unpaid_leave: UnpaidLeaveResponse[];
}

