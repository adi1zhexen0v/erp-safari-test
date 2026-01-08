import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { CheckboxState } from "@/shared/ui/Checkbox";
import type { Locale } from "@/shared/utils/types";
import type { DateRange } from "@/shared/utils";
import { useGetAnnualLeavesQuery, useGetUnpaidLeavesQuery, useGetMedicalLeavesQuery } from "../api";
import type { LeaveApplication, LeaveType } from "../types";
import { useLeaveApplicationsFilter, hasActiveFilters } from "./useLeaveApplicationsFilter";
import { useLeaveApplicationsSort, toggleSort, type SortKey } from "./useLeaveApplicationsSort";
import { useLeaveApplicationsPagination } from "./useLeaveApplicationsPagination";

export interface UseLeaveApplicationsListPageReturn {
  data: {
    annualLeaves: ReturnType<typeof useGetAnnualLeavesQuery>["data"];
    unpaidLeaves: ReturnType<typeof useGetUnpaidLeavesQuery>["data"];
    medicalLeaves: ReturnType<typeof useGetMedicalLeavesQuery>["data"];
  };
  isLoading: boolean;
  isError: boolean;
  allLeaves: LeaveApplication[];
  search: string;
  setSearch: (value: string) => void;
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;
  statusFilter: LeaveType | null;
  setStatusFilter: (value: LeaveType | null) => void;
  statusOptions: Array<{ label: string; value: LeaveType }>;
  activeFilters: boolean;
  view: "table" | "cards";
  setView: (value: "table" | "cards") => void;
  locale: Locale;
  sortConfig: { key: SortKey; direction: "asc" | "desc" } | null;
  handleSort: (key: SortKey) => void;
  filteredLeaves: ReturnType<typeof useLeaveApplicationsFilter>;
  sortedLeaves: ReturnType<typeof useLeaveApplicationsSort>;
  rowStates: Record<string, CheckboxState>;
  onToggleRow: (id: number) => void;
  headerState: CheckboxState;
  onToggleHeader: () => void;
  pagination: ReturnType<typeof useLeaveApplicationsPagination>;
  pageLeaves: LeaveApplication[];
  handleResetFilters: () => void;
  t: ReturnType<typeof useTranslation>["t"];
}

export function useLeaveApplicationsListPage(): UseLeaveApplicationsListPageReturn {
  const { i18n, t } = useTranslation("LeaveApplicationsPage");
  const locale = i18n.language as Locale;

  const { data: annualLeaves, isLoading: isLoadingAnnual } = useGetAnnualLeavesQuery();
  const { data: unpaidLeaves, isLoading: isLoadingUnpaid } = useGetUnpaidLeavesQuery();
  const { data: medicalLeaves, isLoading: isLoadingMedical } = useGetMedicalLeavesQuery();

  const isLoading = isLoadingAnnual || isLoadingUnpaid || isLoadingMedical;
  const isError = false;

  const allLeaves = useMemo<LeaveApplication[]>(() => {
    const annual = (annualLeaves || []).map((leave) => {
      return { ...leave, leave_type: "annual" as const };
    });
    const unpaid = (unpaidLeaves || []).map((leave) => {
      return { ...leave, leave_type: "unpaid" as const };
    });
    const medical = (medicalLeaves || []).map((leave) => {
      return { ...leave, leave_type: "medical" as const };
    });
    return [...annual, ...unpaid, ...medical].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });
  }, [annualLeaves, unpaidLeaves, medicalLeaves]);

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [statusFilter, setStatusFilter] = useState<LeaveType | null>(null);

  const statusOptions = useMemo<Array<{ label: string; value: LeaveType }>>(() => {
    return [
      { label: t("filters.statusOptions.annual"), value: "annual" },
      { label: t("filters.statusOptions.unpaid"), value: "unpaid" },
      { label: t("filters.statusOptions.medical"), value: "medical" },
    ];
  }, [t]);

  const [view, setView] = useState<"table" | "cards">("cards");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" } | null>(null);

  function handleSort(key: SortKey) {
    setSortConfig((prev) => toggleSort(prev, key));
  }

  const filterState = useMemo(
    () => ({
      search,
      dateRange,
      statusFilter,
    }),
    [search, dateRange, statusFilter],
  );

  const filteredLeaves = useLeaveApplicationsFilter(allLeaves, filterState);
  const sortedLeaves = useLeaveApplicationsSort(filteredLeaves, sortConfig);

  const activeFilters = hasActiveFilters(filterState);

  const [rowStates, setRowStates] = useState<Record<string, CheckboxState>>({});

  function onToggleRow(id: number) {
    const leave = allLeaves.find((l) => l.id === id);
    if (!leave) return;
    const key = `${leave.leave_type}-${id}`;
    setRowStates((prev) => ({
      ...prev,
      [key]: prev[key] === "checked" ? "unchecked" : "checked",
    }));
  }

  const headerState: CheckboxState = useMemo(() => {
    const total = filteredLeaves.length;
    if (total === 0) return "unchecked";

    const checkedCount = filteredLeaves.filter((leave) => {
      const key = `${leave.leave_type}-${leave.id}`;
      return rowStates[key] === "checked";
    }).length;

    if (checkedCount === 0) return "unchecked";
    if (checkedCount === total) return "checked";
    return "indeterminate";
  }, [filteredLeaves, rowStates]);

  function onToggleHeader() {
    const selectAll = headerState !== "checked";

    setRowStates((prev) => {
      const next = { ...prev };
      filteredLeaves.forEach((leave) => {
        const key = `${leave.leave_type}-${leave.id}`;
        next[key] = selectAll ? "checked" : "unchecked";
      });
      return next;
    });
  }

  const pagination = useLeaveApplicationsPagination(filteredLeaves.length, 10, [search, dateRange, statusFilter]);

  useEffect(() => {
    pagination.setPage(1);
  }, [search, dateRange, statusFilter, pagination]);

  const pageLeaves = sortedLeaves.slice(pagination.startIndex, pagination.endIndex);

  function handleResetFilters() {
    setSearch("");
    setDateRange({ start: null, end: null });
    setStatusFilter(null);
    setRowStates({});
    pagination.setPage(1);
  }

  return {
    data: {
      annualLeaves,
      unpaidLeaves,
      medicalLeaves,
    },
    isLoading,
    isError,
    allLeaves,
    search,
    setSearch,
    dateRange,
    setDateRange,
    statusFilter,
    setStatusFilter,
    statusOptions,
    activeFilters,
    view,
    setView,
    locale,
    sortConfig,
    handleSort,
    filteredLeaves,
    sortedLeaves,
    rowStates,
    onToggleRow,
    headerState,
    onToggleHeader,
    pagination,
    pageLeaves,
    handleResetFilters,
    t,
  };
}

