export type SortKey =
  | "candidate_name"
  | "invitation_email"
  | "job_position"
  | "invitation_date"
  | "stage"
  | "status"
  | "submitted_at"
  | "reviewed_at";

export interface SortConfig {
  key: SortKey;
  direction: "asc" | "desc";
}

