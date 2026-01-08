import { useMemo } from "react";
import type { ListContractsResponse } from "@/features/hr/contracts/types";
import { parseDate } from "@/shared/utils";

export type SortKey = "contract_number" | "candidate_name" | "status" | "created_at";

export interface SortConfig {
  key: SortKey;
  direction: "asc" | "desc";
}

export function useContractsSort(contracts: ListContractsResponse[], sortConfig: SortConfig | null): ListContractsResponse[] {
  return useMemo(() => {
    if (!sortConfig) {
      return contracts;
    }

    const { key, direction } = sortConfig;

    return [...contracts].sort((a, b) => {
      let cmp = 0;

      if (key === "contract_number" || key === "candidate_name") {
        cmp = String(a[key] ?? "").localeCompare(String(b[key] ?? ""), "ru");
      } else if (key === "status") {
        const aStatus = a.trustme_status ?? -1;
        const bStatus = b.trustme_status ?? -1;
        cmp = aStatus - bStatus;
      } else if (key === "created_at") {
        const aDate = parseDate(a.created_at);
        const bDate = parseDate(b.created_at);
        if (!aDate || !bDate) {
          cmp = 0;
        } else {
          cmp = aDate.getTime() - bDate.getTime();
        }
      }

      return direction === "asc" ? cmp : -cmp;
    });
  }, [contracts, sortConfig]);
}

export function toggleSort(
  currentSort: SortConfig | null,
  newKey: SortKey,
): SortConfig {
  if (currentSort?.key === newKey) {
    return { key: newKey, direction: currentSort.direction === "asc" ? "desc" : "asc" };
  }
  return { key: newKey, direction: "asc" };
}

