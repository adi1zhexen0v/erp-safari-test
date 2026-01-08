import { useMemo } from "react";
import type { PayrollListResponse } from "../types";
import { PAYROLL_STATUS_ORDER } from "../consts";

export type SortKey = "status" | "period" | "workers" | "gross" | "net";

export interface SortConfig {
  key: SortKey;
  direction: "asc" | "desc";
}

export function usePayrollsSort(payrolls: PayrollListResponse[], sortConfig: SortConfig | null): PayrollListResponse[] {
  return useMemo(() => {
    if (!sortConfig) {
      return payrolls;
    }

    const { key, direction } = sortConfig;

    return [...payrolls].sort((a, b) => {
      let cmp = 0;

      if (key === "status") {
        const aStatus = PAYROLL_STATUS_ORDER[a.status] ?? -1;
        const bStatus = PAYROLL_STATUS_ORDER[b.status] ?? -1;
        cmp = aStatus - bStatus;
      } else if (key === "period") {
        if (a.year !== b.year) {
          cmp = a.year - b.year;
        } else {
          cmp = a.month - b.month;
        }
      } else if (key === "workers") {
        cmp = a.worker_count - b.worker_count;
      } else if (key === "gross") {
        cmp = parseFloat(a.total_gross_salary) - parseFloat(b.total_gross_salary);
      } else if (key === "net") {
        cmp = parseFloat(a.total_net_salary) - parseFloat(b.total_net_salary);
      }

      return direction === "asc" ? cmp : -cmp;
    });
  }, [payrolls, sortConfig]);
}

export function toggleSort(currentSort: SortConfig | null, newKey: SortKey): SortConfig {
  if (currentSort?.key === newKey) {
    return { key: newKey, direction: currentSort.direction === "asc" ? "desc" : "asc" };
  }
  return { key: newKey, direction: "asc" };
}

