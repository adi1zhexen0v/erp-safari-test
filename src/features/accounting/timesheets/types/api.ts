import type { DailyData, TimesheetStatus } from "./domain";

export interface GenerateTimesheetDto {
  year: number;
  month: number;
}

export interface UpdateTimesheetEntryDto {
  daily_data: DailyData;
  edit_note?: string;
}

export interface TimesheetResponse {
  id: number;
  organization_id: number;
  year: number;
  month: number;
  month_name_ru: string;
  status: TimesheetStatus;
  total_calendar_days: number;
  month_work_days: number;
  month_work_hours_8h: number;
  month_work_hours_4h: number;
  month_weekend_days: number;
  month_holiday_days: number;
  sum_work_days: number;
  sum_work_hours: number;
  sum_weekend_days: number;
  sum_holiday_days: number;
  sum_leave_days: number;
  sum_business_trip_days: number;
  sum_maternity_leave_days: number;
  sum_absence_days: number;
  generated_by: { id: number; full_name: string };
  generated_at: string;
  approved_by: { id: number; full_name: string } | null;
  approved_at: string | null;
  standard_hours_per_day: number;
  entries_count?: number;
  entries?: TimesheetEntryResponse[];
}

export interface TimesheetEntryResponse {
  id: number;
  worker: { id: number; full_name: string; iin: string };
  daily_data: DailyData;
  work_days: number;
  work_hours: number;
  annual_leave_days: number;
  unpaid_leave_days: number;
  medical_leave_days: number;
  weekend_days: number;
  holiday_days: number;
  business_trip_days: number;
  maternity_leave_days: number;
  absence_days: number;
  overtime_hours: number;
  is_manually_edited: boolean;
  edit_note: string;
}
