import { useMemo } from "react";
import { parseDate, normalizeDateToStartOfDay, normalizeDateToEndOfDay, matchesDateRange, type DateRange } from "@/shared/utils";
import type { GetApplicationsResponse } from "@/features/hr/hiring";

interface FilterState {
  search: string;
  dateRange: DateRange;
  statusFilter: string | null;
}

export function useApplicationsFilter(
  applications: GetApplicationsResponse[] | undefined,
  filters: FilterState,
): GetApplicationsResponse[] {
  return useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    const data = applications ?? [];

    return data.filter((app) => {
      const name = (app.candidate_name ?? "").toLowerCase();
      const matchesSearch = !term || name.includes(term);

      const submitted = parseDate(app.submitted_at);
      const matchesDate = matchesDateRange(
        submitted,
        filters.dateRange,
        normalizeDateToStartOfDay,
        normalizeDateToEndOfDay,
      );

      const matchesStatus = !filters.statusFilter || app.status === filters.statusFilter;

      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [applications, filters]);
}

export function hasActiveFilters(filters: FilterState): boolean {
  return !!filters.search.trim() || !!filters.dateRange.start || !!filters.dateRange.end || !!filters.statusFilter;
}

