import { useMemo } from "react";
import type { ListContractsResponse } from "@/features/hr/contracts/types";
import { parseDate, normalizeDateToStartOfDay, normalizeDateToEndOfDay, matchesDateRange, type DateRange } from "@/shared/utils";

interface FilterState {
  search: string;
  managerSignedDateRange: DateRange;
  employeeSignedDateRange: DateRange;
  startDateRange: DateRange;
  statusFilter: string | null;
}

export function useContractsFilter(contracts: ListContractsResponse[] | undefined, filters: FilterState): ListContractsResponse[] {
  return useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    const data = contracts ?? [];

    return data.filter((contract) => {
      const contractNumber = (contract.contract_number ?? "").toLowerCase();
      const candidateName = (contract.candidate_name ?? "").toLowerCase();
      const matchesSearch = !term || contractNumber.includes(term) || candidateName.includes(term);

      const matchesStatus =
        !filters.statusFilter ||
        (() => {
          if (filters.statusFilter === "null") {
            return contract.trustme_status === null;
          }
          return contract.trustme_status === Number(filters.statusFilter);
        })();

      const managerSignedDate = parseDate(contract.trustme_document?.manager_signed_at ?? null);
      const matchesManagerSignedDate = matchesDateRange(
        managerSignedDate,
        filters.managerSignedDateRange,
        normalizeDateToStartOfDay,
        normalizeDateToEndOfDay,
      );

      const employeeSignedDate = parseDate(contract.trustme_document?.employee_signed_at ?? null);
      const matchesEmployeeSignedDate = matchesDateRange(
        employeeSignedDate,
        filters.employeeSignedDateRange,
        normalizeDateToStartOfDay,
        normalizeDateToEndOfDay,
      );

      const startDate = parseDate(contract.start_date);
      const matchesStartDate = matchesDateRange(
        startDate,
        filters.startDateRange,
        normalizeDateToStartOfDay,
        normalizeDateToEndOfDay,
      );

      return matchesSearch && matchesStatus && matchesManagerSignedDate && matchesEmployeeSignedDate && matchesStartDate;
    });
  }, [contracts, filters]);
}

export function hasActiveFilters(filters: FilterState): boolean {
  return (
    !!filters.search.trim() ||
    !!filters.managerSignedDateRange.start ||
    !!filters.managerSignedDateRange.end ||
    !!filters.employeeSignedDateRange.start ||
    !!filters.employeeSignedDateRange.end ||
    !!filters.startDateRange.start ||
    !!filters.startDateRange.end ||
    !!filters.statusFilter
  );
}

