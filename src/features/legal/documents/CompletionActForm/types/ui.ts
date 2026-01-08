export interface CompletionActFormValues {
  parent_contract: number;
  service_item: number | null;
  period_start_date: Date | null;
  period_end_date: Date | null;
  amount: string;
  description?: string;
}

export interface CompletionActPreviewData {
  display_number: string;
  executor_name: string;
  service_name: string;
  period: string;
  amount: string;
  description: string;
  status: string;
  created_at: string;
}

