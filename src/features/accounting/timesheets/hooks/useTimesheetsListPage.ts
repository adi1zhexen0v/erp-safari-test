import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/shared/utils/types";
import type { DateRange } from "@/shared/utils";
import { usePagination } from "@/shared/hooks";
import { matchesDateRange, normalizeDateToStartOfDay, normalizeDateToEndOfDay } from "@/shared/utils";
import { MONTHS_RU, MONTHS_KK, MONTHS_EN } from "@/shared/consts";
import { useGetTimesheetsQuery } from "../api";
import type { TimesheetResponse } from "../types";
import { useTimesheetsSort, toggleSort, type SortKey, type SortConfig } from "./useTimesheetsSort";

export interface StatusOption {
  label: string;
  value: "draft" | "approved";
}

export interface UseTimesheetsListPageReturn {
  data: TimesheetResponse[] | undefined;
  isLoading: boolean;
  isError: boolean;
  search: string;
  setSearch: (value: string) => void;
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;
  statusFilter: "draft" | "approved" | null;
  setStatusFilter: (value: "draft" | "approved" | null) => void;
  statusOptions: StatusOption[];
  activeFilters: boolean;
  yearFilter: number | null;
  setYearFilter: (value: number | null) => void;
  monthFilter: number | null;
  setMonthFilter: (value: number | null) => void;
  locale: Locale;
  filteredTimesheets: TimesheetResponse[];
  sortConfig: SortConfig | null;
  handleSort: (key: SortKey) => void;
  pagination: ReturnType<typeof usePagination>;
  pageTimesheets: TimesheetResponse[];
  handleResetFilters: () => void;
  t: ReturnType<typeof useTranslation>["t"];
}

export function useTimesheetsListPage(): UseTimesheetsListPageReturn {
  const { i18n, t } = useTranslation("TimesheetsPage");
  const locale = i18n.language as Locale;

  const { data, isLoading, isError } = useGetTimesheetsQuery();

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [statusFilter, setStatusFilter] = useState<"draft" | "approved" | null>(null);
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [monthFilter, setMonthFilter] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const statusOptions = useMemo<StatusOption[]>(() => {
    return [
      { label: t("status.draft") || "Черновик", value: "draft" },
      { label: t("status.approved") || "Утвержден", value: "approved" },
    ];
  }, [t]);

  const activeFilters = useMemo(() => {
    return !!search.trim() || !!dateRange.start || !!dateRange.end || !!statusFilter;
  }, [search, dateRange, statusFilter]);

  function handleSort(key: SortKey) {
    setSortConfig((prev) => toggleSort(prev, key));
  }

  const filteredTimesheets = useMemo(() => {
    if (!data) return [];

    return data.filter((timesheet) => {
      if (search) {
        const searchLower = search.toLowerCase();
        const yearStr = String(timesheet.year);
        const monthStr = String(timesheet.month);
        
        const monthRu = MONTHS_RU[timesheet.month - 1]?.toLowerCase() || "";
        const monthKk = MONTHS_KK[timesheet.month - 1]?.toLowerCase() || "";
        const monthEn = MONTHS_EN[timesheet.month - 1]?.toLowerCase() || "";
        const monthNameRu = timesheet.month_name_ru?.toLowerCase() || "";
        
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

      if (statusFilter && timesheet.status !== statusFilter) {
        return false;
      }

      if (dateRange.start || dateRange.end) {
        const timesheetDate = new Date(timesheet.year, timesheet.month - 1, 1);
        const matchesDate = matchesDateRange(timesheetDate, dateRange, normalizeDateToStartOfDay, normalizeDateToEndOfDay);
        if (!matchesDate) return false;
      }

      if (yearFilter && timesheet.year !== yearFilter) {
        return false;
      }

      if (monthFilter && timesheet.month !== monthFilter) {
        return false;
      }

      return true;
    });
  }, [data, search, statusFilter, dateRange, yearFilter, monthFilter]);

  const sortedTimesheets = useTimesheetsSort(filteredTimesheets, sortConfig);

  const pagination = usePagination(sortedTimesheets.length, 10, [search, statusFilter, dateRange, yearFilter, monthFilter, sortConfig]);

  const pageTimesheets = sortedTimesheets.slice(pagination.startIndex, pagination.endIndex);

  function handleResetFilters() {
    setSearch("");
    setDateRange({ start: null, end: null });
    setStatusFilter(null);
    setYearFilter(null);
    setMonthFilter(null);
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
    yearFilter,
    setYearFilter,
    monthFilter,
    setMonthFilter,
    locale,
    filteredTimesheets,
    sortConfig,
    handleSort,
    pagination,
    pageTimesheets,
    handleResetFilters,
    t,
  };
}

