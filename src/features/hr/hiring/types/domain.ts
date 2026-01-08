export type ApplicationStage = "invited" | "filling" | "review" | "decision" | "completed";

export type ApplicationStatus = "draft" | "submitted" | "revision_requested" | "approved" | "rejected";

export type ReviewAction = "approve" | "request_revision";

export type SectionKey =
  | "personal_data"
  | "contacts"
  | "addresses"
  | "emergency_contacts"
  | "id_documents"
  | "banking"
  | "education"
  | "experience"
  | "social_categories";

