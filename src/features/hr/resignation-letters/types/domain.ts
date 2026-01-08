export type ResignationStatus =
  | "draft"
  | "app_pending"
  | "app_review"
  | "app_approved"
  | "order_pending"
  | "order_uploaded"
  | "completed"
  | "cancelled";

export type ApplicationReviewStatus = "pending" | "approved" | "rejected" | "revision";

export type ApprovalResolution = "approved_with_1month" | "approved" | "no_objection";

export interface Worker {
  id: number;
  iin: string;
  full_name: string;
  date_of_birth: string;
  gender: "male" | "female" | "other" | string;
  status: string;
  hired_date: string;
  created_at: string;
  job_position?: string;
}

export interface CreatedBy {
  id: number;
  full_name: string;
}

export interface TerminationOrder {
  id: number;
  order_number: number;
  signed_pdf_key: string | null;
  signed_pdf_url: string | null;
  created_by: number;
  created_by_name: string;
  created_at: string;
  uploaded_at: string | null;
}

