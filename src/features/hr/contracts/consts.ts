import type {
  ContractChoice,
  ContractType,
  WorkType,
  WorkSchedule,
  WorkFormat,
  WorkConditions,
  SalaryType,
  WithholdingType,
  PaymentMethod,
} from "./types";

export const CONTRACT_TYPE_CHOICES: ContractChoice<ContractType>[] = [
  { value: "indefinite", labelKey: "contracts.contractType.indefinite" },
  { value: "fixed_term", labelKey: "contracts.contractType.fixed_term" },
];

export const WORK_TYPE_CHOICES: ContractChoice<WorkType>[] = [
  { value: "main", labelKey: "contracts.workType.main" },
  { value: "part_time", labelKey: "contracts.workType.part_time" },
];

export const WORK_SCHEDULE_CHOICES: ContractChoice<WorkSchedule>[] = [
  { value: "normal", labelKey: "contracts.workSchedule.normal" },
  { value: "shift", labelKey: "contracts.workSchedule.shift" },
  { value: "5day", labelKey: "contracts.workSchedule.5day" },
  { value: "6day", labelKey: "contracts.workSchedule.6day" },
];

export const WORK_FORMAT_CHOICES: ContractChoice<WorkFormat>[] = [
  { value: "onsite", labelKey: "contracts.workFormat.onsite" },
  { value: "remote", labelKey: "contracts.workFormat.remote" },
  { value: "hybrid", labelKey: "contracts.workFormat.hybrid" },
];

export const WORK_CONDITIONS_CHOICES: ContractChoice<WorkConditions>[] = [
  { value: "normal", labelKey: "contracts.conditions.normal" },
  { value: "hazardous", labelKey: "contracts.conditions.hazardous" },
];

export const SALARY_TYPE_CHOICES: ContractChoice<SalaryType>[] = [
  { value: "fixed", labelKey: "contracts.salaryType.fixed" },
  { value: "hourly", labelKey: "contracts.salaryType.hourly" },
];

export const WITHHOLDING_TYPE_CHOICES: ContractChoice<WithholdingType>[] = [
  { value: "before_tax", labelKey: "contracts.withholding.before_tax" },
  { value: "after_tax", labelKey: "contracts.withholding.after_tax" },
];

export const PAYMENT_METHOD_CHOICES: ContractChoice<PaymentMethod>[] = [
  { value: "bank_transfer", labelKey: "contracts.payment.bank_transfer" },
  { value: "cash", labelKey: "contracts.payment.cash" },
];

export const IDLE_PAYMENT_CHOICES: ContractChoice<boolean>[] = [
  { value: true, labelKey: "contracts.idlePayment.yes" },
  { value: false, labelKey: "contracts.idlePayment.no" },
];

export const OVERTIME_PAYMENT_CHOICES: ContractChoice<boolean>[] = [
  { value: true, labelKey: "contracts.overtimePayment.yes" },
  { value: false, labelKey: "contracts.overtimePayment.no" },
];

export { SECTIONS, SECTION_FIELDS, DEFAULT_CONTRACT_VALUES } from "./consts/fillContract";