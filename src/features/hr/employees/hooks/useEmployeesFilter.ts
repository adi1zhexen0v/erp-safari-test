import { useMemo } from "react";
import {
  parseDate,
  normalizeDateToStartOfDay,
  normalizeDateToEndOfDay,
  matchesDateRange,
  type DateRange,
} from "@/shared/utils";
import type { WorkerListItem, EmployeeStatus } from "../types";

interface FilterState {
  search: string;
  hireDateRange: DateRange;
  statusFilter: EmployeeStatus | null;
}

export function useEmployeesFilter(
  workers: WorkerListItem[] | undefined,
  filters: FilterState,
): WorkerListItem[] {
  return useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    const data = workers ?? [];

    return data.filter((worker) => {
      const name = (worker.full_name ?? "").toLowerCase();
      const email = (worker.contacts?.email ?? "").toLowerCase();
      const iin = (worker.iin ?? "").toLowerCase();
      const position = (
        worker.active_contract?.job_position_ru ||
        worker.active_contract?.work_position ||
        ""
      ).toLowerCase();

      const matchesSearch =
        !term || name.includes(term) || email.includes(term) || iin.includes(term) || position.includes(term);

      const startDate = parseDate(worker.active_contract?.start_date ?? null);
      const matchesDate = matchesDateRange(
        startDate,
        filters.hireDateRange,
        normalizeDateToStartOfDay,
        normalizeDateToEndOfDay,
      );

      return matchesSearch && matchesDate;
    });
  }, [workers, filters]);
}

export function hasActiveEmployeesFilters(filters: FilterState): boolean {
  return (
    !!filters.search.trim() ||
    !!filters.hireDateRange.start ||
    !!filters.hireDateRange.end ||
    !!filters.statusFilter
  );
}

