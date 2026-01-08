import { STATUS_MAP } from "../consts/statuses";

export type EmployeeStatus = keyof typeof STATUS_MAP;

export interface WorkerContacts {
  email: string | null;
  phone: string | null;
  phone_additional: string | null;
}

export interface WorkerActiveContract {
  id: number;
  contract_number: string;
  job_position_ru: string | null;
  job_position_kk: string | null;
  work_position: string | null;
  salary_amount: string | null;
  start_date: string;
}

export interface WorkerListItem {
  id: number;
  iin: string;
  full_name: string;
  date_of_birth: string;
  gender: "male" | "female" | "other" | string;
  status: string;
  contacts: WorkerContacts | null;
  active_contract: WorkerActiveContract | null;
  created_at: string;
}

export interface GetWorkersQueryParams {
  status?: string;
  search?: string;
}

