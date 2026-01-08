import type { CompletionActStatus } from "./domain";

export interface UserInfo {
  id: number;
  full_name: string;
}

export interface ParentContractInfo {
  id: number;
  executor_full_name: string;
  executor_iin: string;
  contract_amount: string;
  status: string;
}

export interface ServiceItemInfo {
  id: number;
  service_name: string;
  price: string;
  start_date: string;
  end_date: string;
}

export interface AvailableServiceItem {
  id: number;
  service_name: string;
  price: string;
  used: string;
  remaining: string;
}

export interface CompletionAct {
  id: number;
  act_number: number;
  display_number: string;
  parent_contract: ParentContractInfo;
  service_item: ServiceItemInfo;
  status: CompletionActStatus;
  period_start_date: string;
  period_end_date: string;
  amount: string;
  description: string;
  has_document: boolean;
  document_url: string | null;
  rejection_reason: string;
  created_by: UserInfo;
  created_at: string;
  approved_by: UserInfo | null;
  approved_at: string | null;
  rejected_by: UserInfo | null;
  rejected_at: string | null;
  updated_at: string;
  can_edit: boolean;
  can_submit: boolean;
  can_approve: boolean;
}

export interface CompletionActListItem {
  id: number;
  act_number: number;
  display_number: string;
  parent_contract: ParentContractInfo;
  service_item: ServiceItemInfo;
  status: CompletionActStatus;
  period_start_date: string;
  period_end_date: string;
  amount: string;
  has_document: boolean;
  created_by: UserInfo;
  created_at: string;
}

export interface CompletionActListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CompletionActListItem[];
}

export interface CompletionActCreatePayload {
  parent_contract: number;
  service_item: number;
  period_start_date: string;
  period_end_date: string;
  amount: string;
  description?: string;
}

export interface CompletionActUpdatePayload {
  service_item?: number;
  period_start_date?: string;
  period_end_date?: string;
  amount?: string;
  description?: string;
}

export interface CompletionActRejectPayload {
  reason: string;
}

export interface CompletionActApproveResponse {
  act: CompletionAct;
  message: string;
}

export interface DocumentUrlResponse {
  document_url: string;
  download: boolean;
}

