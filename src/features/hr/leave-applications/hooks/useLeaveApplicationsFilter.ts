import { useMemo } from "react";
import { parseDate, normalizeDateToStartOfDay, normalizeDateToEndOfDay, matchesDateRange, type DateRange } from "@/shared/utils";
import type { LeaveApplication, LeaveType } from "../types";

interface FilterState {
  search: string;
  dateRange: DateRange;
  statusFilter: LeaveType | null;
}

export function useLeaveApplicationsFilter(leaves: LeaveApplication[] | undefined, filters: FilterState): LeaveApplication[] {
  return useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    const data = leaves ?? [];

    return data.filter((leave) => {
      const name = (leave.worker.full_name ?? "").toLowerCase();
      const reason = ((leave as { reason?: string }).reason ?? "").toLowerCase();
      const matchesSearch = !term || name.includes(term) || reason.includes(term);

      const createdDate = parseDate(leave.created_at);
      const matchesDate = matchesDateRange(createdDate, filters.dateRange, normalizeDateToStartOfDay, normalizeDateToEndOfDay);

      const matchesStatus = !filters.statusFilter || leave.leave_type === filters.statusFilter;

      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [leaves, filters]);
}

export function hasActiveFilters(filters: FilterState): boolean {
  return !!filters.search.trim() || !!filters.dateRange.start || !!filters.dateRange.end || !!filters.statusFilter;
}

