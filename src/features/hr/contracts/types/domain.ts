export type ContractType = "indefinite" | "fixed_term";
export type WorkType = "main" | "part_time";
export type WorkSchedule = "normal" | "shift" | "5day" | "6day";
export type WorkFormat = "onsite" | "remote" | "hybrid";
export type WorkConditions = "normal" | "hazardous";
export type SalaryType = "fixed" | "hourly";
export type WithholdingType = "before_tax" | "after_tax";
export type PaymentMethod = "bank_transfer" | "cash";

export interface Worker {
  id: number;
  full_name: string;
}

export interface TrustMeDocument {
  document_id: string;
  url: string;
  status: number;
  status_display: string;
  manager_signed_at: string | null;
  employee_signed_at: string | null;
  signed_pdf_url: string | null;
}

