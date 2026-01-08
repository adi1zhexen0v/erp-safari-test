import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/shared/utils/types";
import type { DateRange } from "@/shared/utils";
import { usePagination } from "@/shared/hooks";
import { matchesDateRange, normalizeDateToStartOfDay, normalizeDateToEndOfDay } from "@/shared/utils";
import { MONTHS_RU, MONTHS_KK, MONTHS_EN } from "@/shared/consts";
import { useGetPayrollsQuery } from "../api";
import type { PayrollListResponse, PayrollStatus } from "../types";
import { usePayrollsSort, toggleSort, type SortKey, type SortConfig } from "./usePayrollsSort";

export interface StatusOption {
  label: string;
  value: PayrollStatus;
}

export interface UsePayrollsListPageReturn {
  data: PayrollListResponse[] | undefined;
  isLoading: boolean;
  isError: boolean;
  search: string;
  setSearch: (value: string) => void;
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;
  statusFilter: PayrollStatus | null;
  setStatusFilter: (value: PayrollStatus | null) => void;
  statusOptions: StatusOption[];
  activeFilters: boolean;
  locale: Locale;
  filteredPayrolls: PayrollListResponse[];
  sortConfig: SortConfig | null;
  handleSort: (key: SortKey) => void;
  pagination: ReturnType<typeof usePagination>;
  pagePayrolls: PayrollListResponse[];
  handleResetFilters: () => void;
  t: ReturnType<typeof useTranslation>["t"];
}

export function usePayrollsListPage(): UsePayrollsListPageReturn {
  const { i18n, t } = useTranslation("PayrollPage");
  const locale = i18n.language as Locale;

  const { data, isLoading, isError } = useGetPayrollsQuery();

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [statusFilter, setStatusFilter] = useState<PayrollStatus | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const statusOptions = useMemo<StatusOption[]>(() => {
    return [
      { label: t("status.draft") || "Черновик", value: "draft" },
      { label: t("status.calculated") || "Рассчитано", value: "calculated" },
      { label: t("status.approved") || "Утверждено", value: "approved" },
      { label: t("status.paid") || "Оплачено", value: "paid" },
    ];
  }, [t]);

  const activeFilters = useMemo(() => {
    return !!search.trim() || !!dateRange.start || !!dateRange.end || !!statusFilter;
  }, [search, dateRange, statusFilter]);

  function handleSort(key: SortKey) {
    setSortConfig((prev) => toggleSort(prev, key));
  }

  const filteredPayrolls = useMemo(() => {
    if (!data) return [];

    return data.filter((payroll) => {
      if (search) {
        const searchLower = search.toLowerCase();
        const yearStr = String(payroll.year);
        const monthStr = String(payroll.month);
        
        const monthRu = MONTHS_RU[payroll.month - 1]?.toLowerCase() || "";
        const monthKk = MONTHS_KK[payroll.month - 1]?.toLowerCase() || "";
        const monthEn = MONTHS_EN[payroll.month - 1]?.toLowerCase() || "";
        const monthNameRu = payroll.month_name_ru?.toLowerCase() || "";
        
        const periodText = `${monthRu} ${yearStr} ${monthKk} ${monthEn} ${monthNameRu} ${monthStr}`.toLowerCase();
        
        const matchesSearch =
          yearStr.includes(search) ||
          monthRu.includes(searchLower) ||
          monthKk.includes(searchLower) ||
          monthEn.includes(searchLower) ||
          monthNameRu.includes(searchLower) ||
          monthStr.includes(search) ||
          periodText.includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      if (statusFilter && payroll.status !== statusFilter) {
        return false;
      }

      if (dateRange.start || dateRange.end) {
        const payrollDate = new Date(payroll.year, payroll.month - 1, 1);
        const matchesDate = matchesDateRange(payrollDate, dateRange, normalizeDateToStartOfDay, normalizeDateToEndOfDay);
        if (!matchesDate) return false;
      }

      return true;
    });
  }, [data, search, statusFilter, dateRange]);

  const sortedPayrolls = usePayrollsSort(filteredPayrolls, sortConfig);

  const pagination = usePagination(sortedPayrolls.length, 10, [search, statusFilter, dateRange, sortConfig]);

  const pagePayrolls = sortedPayrolls.slice(pagination.startIndex, pagination.endIndex);

  function handleResetFilters() {
    setSearch("");
    setDateRange({ start: null, end: null });
    setStatusFilter(null);
    pagination.setPage(1);
  }

  return {
    data,
    isLoading,
    isError,
    search,
    setSearch,
    dateRange,
    setDateRange,
    statusFilter,
    setStatusFilter,
    statusOptions,
    activeFilters,
    locale,
    filteredPayrolls,
    sortConfig,
    handleSort,
    pagination,
    pagePayrolls,
    handleResetFilters,
    t,
  };
}

