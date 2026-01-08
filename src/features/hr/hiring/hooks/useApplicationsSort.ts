import { useMemo } from "react";
import { parseDate } from "@/shared/utils";
import type { GetApplicationsResponse, SortConfig } from "@/features/hr/hiring";

export function useApplicationsSort(
  applications: GetApplicationsResponse[],
  sortConfig: SortConfig | null,
): GetApplicationsResponse[] {
  return useMemo(() => {
    if (!sortConfig) {
      return applications;
    }

    const { key, direction } = sortConfig;

    return [...applications].sort((a, b) => {
      let cmp = 0;

      if (key === "submitted_at" || key === "reviewed_at") {
        const aDate = parseDate(a[key]);
        const bDate = parseDate(b[key]);
        cmp = (aDate?.getTime() ?? 0) - (bDate?.getTime() ?? 0);
      } else {
        cmp = String(a[key] ?? "").localeCompare(String(b[key] ?? ""), "ru");
      }

      return direction === "asc" ? cmp : -cmp;
    });
  }, [applications, sortConfig]);
}

export function toggleSort(currentSort: SortConfig | null, newKey: SortConfig["key"]): SortConfig {
  if (currentSort?.key === newKey) {
    return { key: newKey, direction: currentSort.direction === "asc" ? "desc" : "asc" };
  }
  return { key: newKey, direction: "asc" };
}

