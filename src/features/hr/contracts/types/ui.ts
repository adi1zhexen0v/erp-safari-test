export interface ContractFormValues {
  sign_date: string;
  start_date: string;
  work_city_id: number | null;
  employee_address_ru: string;
  employee_address_kk: string;
  job_position_ru: string;
  job_duties_ru: string[];
  job_position_kk: string;
  job_duties_kk: string[];
  working_days_list: ("Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun")[];
  work_start_time: string;
  work_end_time: string;
  has_break: boolean;
  break_start_time?: string;
  break_end_time?: string;
  trial_period: boolean;
  trial_duration_months?: number;
  is_online?: boolean;
  salary_amount: string;
}

export interface ContractChoice<T> {
  value: T;
  labelKey: string;
}

export type SectionId = "basic_info" | "position_duties" | "work_schedule";

