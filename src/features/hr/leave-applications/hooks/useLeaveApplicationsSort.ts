import { useMemo } from "react";
import type { LeaveApplication } from "../types";

export type SortKey = "employee" | "period" | "duration";

export interface SortConfig {
  key: SortKey;
  direction: "asc" | "desc";
}

export function useLeaveApplicationsSort(leaves: LeaveApplication[], sortConfig: SortConfig | null): LeaveApplication[] {
  return useMemo(() => {
    if (!sortConfig) {
      return leaves;
    }

    const { key, direction } = sortConfig;

    return [...leaves].sort((a, b) => {
      let cmp = 0;

      if (key === "employee") {
        cmp = String(a.worker.full_name ?? "").localeCompare(String(b.worker.full_name ?? ""), "ru");
      } else if (key === "period") {
        const aStart = new Date(a.start_date).getTime();
        const bStart = new Date(b.start_date).getTime();
        cmp = aStart - bStart;
      } else if (key === "duration") {
        cmp = a.days_count - b.days_count;
      }

      return direction === "asc" ? cmp : -cmp;
    });
  }, [leaves, sortConfig]);
}

export function toggleSort(currentSort: SortConfig | null, newKey: SortKey): SortConfig {
  if (currentSort?.key === newKey) {
    return { key: newKey, direction: currentSort.direction === "asc" ? "desc" : "asc" };
  }
  return { key: newKey, direction: "asc" };
}

