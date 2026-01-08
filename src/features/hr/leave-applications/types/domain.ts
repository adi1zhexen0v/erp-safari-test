export type LeaveStatus =
  | "draft"
  | "app_pending"
  | "app_review"
  | "app_approved"
  | "order_pending"
  | "order_uploaded"
  | "active"
  | "completed"
  | "cancelled";

export type ApplicationReviewStatus = "pending" | "approved" | "rejected" | "revision";

export type LeaveType = "annual" | "unpaid" | "medical";

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
  name?: string;
  surname?: string;
}

export interface CreatedBy {
  id: number;
  full_name: string;
}

