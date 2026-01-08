import type { PayrollStatus, SalaryType, WorkConditions, TaxCategory } from "./domain";

export interface CalculationSnapshotFlags {
  sn: boolean;
  so: boolean;
  ipn: boolean;
  opv: boolean;
  oppv: boolean;
  opvr: boolean;
  oosms: boolean;
  vosms: boolean;
  ipn_rate: number;
}

export interface CalculationSnapshotInput {
  salary: string;
  work_days: number;
  tariff_rate: string;
  tax_category: string;
  month_work_days: number;
}

export interface CalculationSnapshot {
  flags: CalculationSnapshotFlags;
  input: CalculationSnapshotInput;
}

export interface PayrollWorker {
  id: number;
  iin: string;
  name: string;
  surname: string;
  full_name: string;
}

export interface PayrollOrganization {
  id: number;
  name: string;
}

export interface PayrollManager {
  id: number;
  full_name: string;
}

export interface PayrollTimesheet {
  id: number;
  year: number;
  month: number;
  status: string;
  month_work_days: number;
}

export interface PayrollEntry {
  id: number;
  worker: PayrollWorker;
  salary_amount: string;
  salary_type: SalaryType;
  tariff_rate: string;
  work_conditions: WorkConditions;
  work_days: number;
  work_hours: number;
  month_work_days: number;
  tax_category: TaxCategory;
  is_astana_hub: boolean;
  is_gph_contract: boolean;
  is_resident: boolean;
  base_salary: string;
  gross_salary: string;
  bonuses: string;
  allowances: string;
  opv: string;
  vosms: string;
  ipn_base: string;
  ipn_calculated: string;
  ipn_correction: string;
  ipn_correction_amount: string;
  ipn: string;
  standard_deduction: string;
  social_deductions: string;
  multiparent_deduction: string;
  total_employee_deductions: string;
  opvr: string;
  oppv: string;
  so: string;
  oosms: string;
  sn: string;
  total_employer_contributions: string;
  net_salary: string;
  calculation_snapshot?: CalculationSnapshot;
  calculated_at: string;
}

export interface PayrollEntryListItem {
  id: number;
  worker: PayrollWorker;
  tax_category: TaxCategory;
  work_days: number;
  month_work_days: number;
  gross_salary: string;
  total_employee_deductions: string;
  total_employer_contributions: string;
  net_salary: string;
}

export interface PayrollListResponse {
  id: number;
  organization: PayrollOrganization;
  year: number;
  month: number;
  month_name_ru: string;
  status: PayrollStatus;
  total_gross_salary: string;
  total_employee_deductions: string;
  total_employer_contributions: string;
  total_net_salary: string;
  worker_count: number;
  entry_count: number;
  generated_by: PayrollManager;
  generated_at: string;
  approved_by: PayrollManager | null;
  approved_at: string | null;
  paid_by: PayrollManager | null;
  paid_at: string | null;
}

export interface GPHPaymentContractor {
  full_name: string;
  iin: string;
  phone?: string;
  bank_name?: string;
  iban?: string;
}

export interface GPHPaymentCompletionAct {
  id: number;
  act_number: number;
  display_number: string;
  service_name: string;
  period_start_date: string;
  period_end_date: string;
  amount: string;
}

export interface GPHPaymentOrganization {
  id: number;
  name: string;
  bin: string;
}

export interface GPHPaymentManager {
  id: number;
  full_name: string;
}

export interface GPHPaymentCalculationSnapshot {
  input: { gross_amount: string; is_astana_hub: boolean };
  opv: { base: string; rate: string; amount: string; max_base?: string };
  vosms: { base: string; rate: string; amount: string; max_base?: string };
  ipn: { base: string; rate: string; amount: string; note?: string };
  so: { base: string; rate: string; amount: string; min?: string; max?: string };
  totals: { net_amount: string; total_withheld: string; total_employer_cost: string };
  constants_used?: Record<string, string>;
}

export interface GPHPayment {
  id: number;
  contractor_name: string;
  contractor_iin: string;
  contractor: GPHPaymentContractor;
  completion_act: GPHPaymentCompletionAct;
  organization: GPHPaymentOrganization;
  gross_amount: string;
  opv: string;
  vosms: string;
  ipn: string;
  total_withheld: string;
  net_amount: string;
  so: string;
  total_cost: string;
  status: "pending" | "paid";
  is_astana_hub: boolean;
  can_mark_paid: boolean;
  paid_at: string | null;
  paid_by: GPHPaymentManager | null;
  calculated_at: string;
  calculation_snapshot?: GPHPaymentCalculationSnapshot;
}

export interface PayrollDetailResponse extends Omit<PayrollListResponse, "entry_count"> {
  timesheet: PayrollTimesheet;
  total_opv: string;
  total_vosms: string;
  total_ipn: string;
  total_opvr: string;
  total_oppv: string;
  total_so: string;
  total_oosms: string;
  total_sn: string;
  total_employer_cost: string;
  entries: PayrollEntry[];
  gph_payments?: GPHPayment[];
}

export interface GeneratePayrollDto {
  timesheet_id: number;
}

export interface ApprovePayrollDto {
  note?: string;
}

export interface MarkPaidDto {
  payment_reference?: string;
  note?: string;
}

