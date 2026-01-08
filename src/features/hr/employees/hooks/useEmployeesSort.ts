import { useMemo } from "react";
import { parseDate } from "@/shared/utils";
import type { WorkerListItem } from "../types";

export type EmployeesSortKey = "full_name" | "email" | "iin" | "start_date" | "work_position" | "work_salary" | "status";

export interface EmployeesSortConfig {
  key: EmployeesSortKey;
  direction: "asc" | "desc";
}

export function useEmployeesSort(
  workers: WorkerListItem[],
  sortConfig: EmployeesSortConfig | null,
): WorkerListItem[] {
  return useMemo(() => {
    if (!sortConfig) {
      return workers;
    }

    const { key, direction } = sortConfig;

    return [...workers].sort((a, b) => {
      let cmp = 0;

      if (key === "start_date") {
        const aDate = parseDate(a.active_contract?.start_date ?? null);
        const bDate = parseDate(b.active_contract?.start_date ?? null);
        cmp = (aDate?.getTime() ?? 0) - (bDate?.getTime() ?? 0);
      } else if (key === "work_salary") {
        const aSalary = Number(a.active_contract?.salary_amount ?? 0);
        const bSalary = Number(b.active_contract?.salary_amount ?? 0);
        cmp = aSalary - bSalary;
      } else if (key === "full_name") {
        cmp = String(a.full_name ?? "").localeCompare(String(b.full_name ?? ""), "ru");
      } else if (key === "email") {
        cmp = String(a.contacts?.email ?? "").localeCompare(String(b.contacts?.email ?? ""), "ru");
      } else if (key === "iin") {
        cmp = String(a.iin ?? "").localeCompare(String(b.iin ?? ""), "ru");
      } else if (key === "work_position") {
        const aPosition = a.active_contract?.job_position_ru || a.active_contract?.work_position || "";
        const bPosition = b.active_contract?.job_position_ru || b.active_contract?.work_position || "";
        cmp = String(aPosition).localeCompare(String(bPosition), "ru");
      } else if (key === "status") {
        cmp = String(a.status ?? "").localeCompare(String(b.status ?? ""), "ru");
      }

      return direction === "asc" ? cmp : -cmp;
    });
  }, [workers, sortConfig]);
}

export function toggleEmployeesSort(
  currentSort: EmployeesSortConfig | null,
  newKey: EmployeesSortKey,
): EmployeesSortConfig {
  if (currentSort?.key === newKey) {
    return { key: newKey, direction: currentSort.direction === "asc" ? "desc" : "asc" };
  }
  return { key: newKey, direction: "asc" };
}

