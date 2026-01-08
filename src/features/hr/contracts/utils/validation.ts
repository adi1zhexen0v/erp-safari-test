import { z } from "zod";

function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

export const ContractSchema = z
  .object({
    sign_date: z.string().min(1, { message: "validation.sign_date_required" }),
    start_date: z.string().min(1, { message: "validation.start_date_required" }),
    work_city_id: z.number().min(1, { message: "validation.work_city_required" }).nullable(),
    employee_address_ru: z.string().min(1, { message: "validation.employee_address_ru_required" }),
    employee_address_kk: z.string().min(1, { message: "validation.employee_address_kk_required" }),
    job_position_ru: z
      .string()
      .min(1, { message: "validation.job_position_ru_required" })
      .max(200, { message: "validation.job_position_ru_max_length" }),
    job_duties_ru: z
      .array(z.string().min(1, { message: "validation.job_duty_required" }))
      .min(1, { message: "validation.job_duties_ru_min_items" }),
    job_position_kk: z
      .string()
      .min(1, { message: "validation.job_position_kk_required" })
      .max(200, { message: "validation.job_position_kk_max_length" }),
    job_duties_kk: z
      .array(z.string().min(1, { message: "validation.job_duty_required" }))
      .min(1, { message: "validation.job_duties_kk_min_items" }),
    working_days_list: z
      .array(z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], { message: "validation.invalid_working_day" }))
      .min(1, { message: "validation.working_days_min" })
      .max(6, { message: "validation.working_days_max" }),
    work_start_time: z.string().regex(timeRegex, { message: "validation.invalid_time_format" }),
    work_end_time: z.string().regex(timeRegex, { message: "validation.invalid_time_format" }),
    has_break: z.boolean(),
    break_start_time: z.string().regex(timeRegex, { message: "validation.invalid_time_format" }).optional(),
    break_end_time: z.string().regex(timeRegex, { message: "validation.invalid_time_format" }).optional(),
    trial_period: z.boolean(),
    trial_duration_months: z.number().int().min(1).max(6).optional(),
    is_online: z.boolean().optional(),
    salary_amount: z.string().min(1, { message: "validation.salary_amount_required" }),
  })
  .refine(
    (data) => {
      return data.work_city_id !== null;
    },
    { message: "validation.work_city_required", path: ["work_city_id"] },
  )
  .refine(
    (data) => {
      if (data.start_date && data.sign_date) {
        return new Date(data.start_date) >= new Date(data.sign_date);
      }
      return true;
    },
    { message: "validation.start_date_after_sign_date", path: ["start_date"] },
  )
  .refine(
    (data) => {
      if (
        data.trial_period &&
        (!data.trial_duration_months || data.trial_duration_months < 1 || data.trial_duration_months > 6)
      ) {
        return false;
      }
      return true;
    },
    { message: "validation.trial_duration_required", path: ["trial_duration_months"] },
  )
  .refine(
    (data) => {
      if (
        data.has_break &&
        data.break_start_time &&
        data.break_end_time &&
        data.work_start_time &&
        data.work_end_time
      ) {
        const workStart = parseTimeToMinutes(data.work_start_time);
        const workEnd = parseTimeToMinutes(data.work_end_time);
        const breakStart = parseTimeToMinutes(data.break_start_time);
        const breakEnd = parseTimeToMinutes(data.break_end_time);
        return workStart < breakStart && breakStart < breakEnd && breakEnd < workEnd;
      }
      return true;
    },
    { message: "validation.break_within_work_hours", path: ["break_start_time"] },
  )
  .refine(
    (data) => {
      return data.job_duties_ru.length === data.job_duties_kk.length;
    },
    { message: "validation.job_duties_equal_length", path: ["job_duties_kk"] },
  )
  .refine(
    (data) => {
      if (data.work_start_time && data.work_end_time) {
        return parseTimeToMinutes(data.work_end_time) > parseTimeToMinutes(data.work_start_time);
      }
      return true;
    },
    { message: "validation.work_end_after_start", path: ["work_end_time"] },
  )
  .refine(
    (data) => {
      const amount = parseFloat(data.salary_amount);
      return !isNaN(amount) && amount > 0;
    },
    { message: "validation.salary_amount_positive", path: ["salary_amount"] },
  )
  .refine(
    (data) => {
      return data.is_online !== undefined;
    },
    { message: "validation.is_online_required", path: ["is_online"] },
  )
  .refine(
    (data) => {
      return data.working_days_list.length === 5;
    },
    { message: "validation.working_days_exactly_five", path: ["working_days_list"] },
  )
  .refine(
    (data) => {
      if (data.work_start_time && data.work_end_time) {
        const workStart = parseTimeToMinutes(data.work_start_time);
        const workEnd = parseTimeToMinutes(data.work_end_time);
        let workingMinutes = workEnd - workStart;
        if (data.has_break && data.break_start_time && data.break_end_time) {
          const breakStart = parseTimeToMinutes(data.break_start_time);
          const breakEnd = parseTimeToMinutes(data.break_end_time);
          workingMinutes -= breakEnd - breakStart;
        }
        return workingMinutes === 240 || workingMinutes === 480;
      }
      return true;
    },
    { message: "validation.working_hours_four_or_eight", path: ["work_end_time"] },
  );

export type ContractSchemaType = z.infer<typeof ContractSchema>;
