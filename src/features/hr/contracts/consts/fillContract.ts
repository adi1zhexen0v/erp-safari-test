import { InfoCircle, TagUser, Clock } from "iconsax-react";
import type { Icon } from "iconsax-react";
import type { ContractFormValues, SectionId } from "@/features/hr/contracts/types";

export const SECTIONS: { id: SectionId; icon: Icon }[] = [
  { id: "basic_info", icon: InfoCircle },
  { id: "position_duties", icon: TagUser },
  { id: "work_schedule", icon: Clock },
];

export const SECTION_FIELDS: Record<SectionId, (keyof ContractFormValues | string)[]> = {
  basic_info: ["sign_date", "start_date", "work_city_id", "employee_address_ru", "employee_address_kk"],
  position_duties: ["job_position_ru", "job_duties_ru", "job_position_kk", "job_duties_kk"],
  work_schedule: [
    "working_days_list",
    "work_start_time",
    "work_end_time",
    "has_break",
    "break_start_time",
    "break_end_time",
    "trial_period",
    "trial_duration_months",
    "is_online",
    "salary_amount",
  ],
};

export const DEFAULT_CONTRACT_VALUES: ContractFormValues = {
  sign_date: "",
  start_date: "",
  work_city_id: null,
  employee_address_ru: "",
  employee_address_kk: "",
  job_position_ru: "",
  job_duties_ru: [""],
  job_position_kk: "",
  job_duties_kk: [""],
  working_days_list: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  work_start_time: "",
  work_end_time: "",
  has_break: true,
  break_start_time: "",
  break_end_time: "",
  trial_period: false,
  trial_duration_months: undefined,
  is_online: undefined,
  salary_amount: "",
};

