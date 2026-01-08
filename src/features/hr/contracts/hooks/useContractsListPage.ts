import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CheckboxState } from "@/shared/ui";
import { getUniqueTrustMeStatuses, type Locale, type DateRange } from "@/shared/utils";
import { useGetResignationLettersQuery } from "@/features/hr/resignation-letters";
import { useGetContractsQuery, useGetAmendmentsQuery } from "@/features/hr/contracts/api";
import { useContractsFilter, hasActiveFilters } from "./useContractsFilter";
import { useContractsSort, toggleSort, type SortKey } from "./useContractsSort";
import { useContractsPagination } from "./useContractsPagination";
import { useGroupedContracts, type GroupedContract } from "./useGroupedContracts";

export interface UseContractsListPageReturn {
  data: ReturnType<typeof useGetContractsQuery>["data"];
  isLoading: boolean;
  isError: boolean;
  refetchContracts: ReturnType<typeof useGetContractsQuery>["refetch"];
  resignationLettersData: ReturnType<typeof useGetResignationLettersQuery>["data"];
  amendmentsData: ReturnType<typeof useGetAmendmentsQuery>["data"];
  search: string;
  setSearch: (value: string) => void;
  managerSignedDateRange: DateRange;
  setManagerSignedDateRange: (value: DateRange) => void;
  employeeSignedDateRange: DateRange;
  setEmployeeSignedDateRange: (value: DateRange) => void;
  startDateRange: DateRange;
  setStartDateRange: (value: DateRange) => void;
  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;
  statusOptions: ReturnType<typeof getUniqueTrustMeStatuses>;
  activeFilters: boolean;
  view: "table" | "cards";
  setView: (value: "table" | "cards") => void;
  locale: Locale;
  sortConfig: { key: SortKey; direction: "asc" | "desc" } | null;
  handleSort: (key: SortKey) => void;
  filteredContracts: ReturnType<typeof useContractsFilter>;
  sortedContracts: ReturnType<typeof useContractsSort>;
  groupedContracts: GroupedContract[];
  rowStates: Record<string, CheckboxState>;
  onToggleRow: (id: number) => void;
  headerState: CheckboxState;
  onToggleHeader: () => void;
  pagination: ReturnType<typeof useContractsPagination>;
  pageContracts: GroupedContract[];
  handleResetFilters: () => void;
  t: ReturnType<typeof useTranslation>["t"];
}

export function useContractsListPage(): UseContractsListPageReturn {
  const { i18n, t } = useTranslation("ContractsPage");
  const locale = i18n.language as Locale;

  const { data, isLoading, isError, refetch: refetchContracts } = useGetContractsQuery();
  const { data: resignationLettersData } = useGetResignationLettersQuery();
  const { data: amendmentsData } = useGetAmendmentsQuery();

  const [search, setSearch] = useState("");
  const [managerSignedDateRange, setManagerSignedDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [employeeSignedDateRange, setEmployeeSignedDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [startDateRange, setStartDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [view, setView] = useState<"table" | "cards">("cards");

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" } | null>(null);

  function handleSort(key: SortKey) {
    setSortConfig((prev) => toggleSort(prev, key));
  }

  const statusOptions = useMemo(() => {
    if (!data) return [];
    return getUniqueTrustMeStatuses(data, locale);
  }, [data, locale]);

  const filterState = useMemo(
    () => ({
      search,
      managerSignedDateRange,
      employeeSignedDateRange,
      startDateRange,
      statusFilter,
    }),
    [search, managerSignedDateRange, employeeSignedDateRange, startDateRange, statusFilter],
  );

  const filteredContracts = useContractsFilter(data, filterState);
  const sortedContracts = useContractsSort(filteredContracts, sortConfig);
  const groupedContracts = useGroupedContracts(sortedContracts, resignationLettersData, amendmentsData);

  const activeFilters = hasActiveFilters(filterState);

  const [rowStates, setRowStates] = useState<Record<string, CheckboxState>>({});

  function onToggleRow(id: number) {
    const key = String(id);
    setRowStates((prev) => ({
      ...prev,
      [key]: prev[key] === "checked" ? "unchecked" : "checked",
    }));
  }

  const headerState: CheckboxState = useMemo(() => {
    const total = filteredContracts.length;
    if (total === 0) return "unchecked";

    const checkedCount = filteredContracts.filter((contract) => rowStates[String(contract.id)] === "checked").length;

    if (checkedCount === 0) return "unchecked";
    if (checkedCount === total) return "checked";
    return "indeterminate";
  }, [filteredContracts, rowStates]);

  function onToggleHeader() {
    const selectAll = headerState !== "checked";

    setRowStates((prev) => {
      const next = { ...prev };
      filteredContracts.forEach((contract) => {
        next[String(contract.id)] = selectAll ? "checked" : "unchecked";
      });
      return next;
    });
  }

  const pagination = useContractsPagination(filteredContracts.length, 10, [
    search,
    managerSignedDateRange,
    employeeSignedDateRange,
    startDateRange,
    statusFilter,
  ]);

  const pageContracts = groupedContracts.slice(pagination.startIndex, pagination.endIndex);

  function handleResetFilters() {
    setSearch("");
    setManagerSignedDateRange({ start: null, end: null });
    setEmployeeSignedDateRange({ start: null, end: null });
    setStartDateRange({ start: null, end: null });
    setStatusFilter(null);
    setRowStates({});
    pagination.setPage(1);
  }

  return {
    data,
    isLoading,
    isError,
    refetchContracts,
    resignationLettersData,
    amendmentsData,
    search,
    setSearch,
    managerSignedDateRange,
    setManagerSignedDateRange,
    employeeSignedDateRange,
    setEmployeeSignedDateRange,
    startDateRange,
    setStartDateRange,
    statusFilter,
    setStatusFilter,
    statusOptions,
    activeFilters,
    view,
    setView,
    locale,
    sortConfig,
    handleSort,
    filteredContracts,
    sortedContracts,
    groupedContracts,
    rowStates,
    onToggleRow,
    headerState,
    onToggleHeader,
    pagination,
    pageContracts,
    handleResetFilters,
    t,
  };
}
