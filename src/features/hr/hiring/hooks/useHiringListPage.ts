import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { type CheckboxState } from "@/shared/ui";
import { type Locale } from "@/shared/utils";
import {
  type ApplicationStatus,
  type SortConfig,
  useHiringGetApplicationsQuery,
  type DateRange,
  STATUS_MAP,
} from "@/features/hr/hiring";
import { useApplicationsFilter, hasActiveFilters } from "./useApplicationsFilter";
import { useApplicationsSort, toggleSort } from "./useApplicationsSort";
import { useApplicationsPagination } from "./useApplicationsPagination";

export interface UseHiringListPageReturn {
  data: ReturnType<typeof useHiringGetApplicationsQuery>["data"];
  isLoading: boolean;
  isError: boolean;
  search: string;
  setSearch: (value: string) => void;
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;
  statusFilter: ApplicationStatus | null;
  setStatusFilter: (value: ApplicationStatus | null) => void;
  statusOptions: Array<{ label: string; value: ApplicationStatus }>;
  activeFilters: boolean;
  view: "table" | "cards";
  setView: (value: "table" | "cards") => void;
  locale: Locale;
  sortConfig: SortConfig | null;
  handleSort: (key: SortConfig["key"]) => void;
  filteredApplications: ReturnType<typeof useApplicationsFilter>;
  sortedApplications: ReturnType<typeof useApplicationsSort>;
  rowStates: Record<string, CheckboxState>;
  onToggleRow: (id: number) => void;
  headerState: CheckboxState;
  onToggleHeader: () => void;
  pagination: ReturnType<typeof useApplicationsPagination>;
  pageApplications: ReturnType<typeof useApplicationsFilter>;
  handleResetFilters: () => void;
  t: ReturnType<typeof useTranslation>["t"];
}

export function useHiringListPage(): UseHiringListPageReturn {
  const { i18n, t } = useTranslation("HiringPage");
  const locale = i18n.language as Locale;

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | null>(null);

  const { data, isLoading, isError } = useHiringGetApplicationsQuery({
    status: statusFilter || undefined,
  });

  const statusOptions = useMemo(() => {
    return Object.entries(STATUS_MAP).map(([key, config]) => ({
      label: t(config.label),
      value: key as ApplicationStatus,
    }));
  }, [t]);

  const [view, setView] = useState<"table" | "cards">("cards");

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  function handleSort(key: SortConfig["key"]) {
    setSortConfig((prev) => toggleSort(prev, key));
  }

  const filterState = useMemo(
    () => ({
      search,
      dateRange,
      statusFilter: statusFilter || null,
    }),
    [search, dateRange, statusFilter],
  );

  const filteredApplications = useApplicationsFilter(data, filterState);
  const sortedApplications = useApplicationsSort(filteredApplications, sortConfig);

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
    const total = filteredApplications.length;
    if (total === 0) return "unchecked";

    const checkedCount = filteredApplications.filter((app) => rowStates[String(app.id)] === "checked").length;

    if (checkedCount === 0) return "unchecked";
    if (checkedCount === total) return "checked";
    return "indeterminate";
  }, [filteredApplications, rowStates]);

  function onToggleHeader() {
    const selectAll = headerState !== "checked";

    setRowStates((prev) => {
      const next = { ...prev };
      filteredApplications.forEach((app) => {
        next[String(app.id)] = selectAll ? "checked" : "unchecked";
      });
      return next;
    });
  }

  const pagination = useApplicationsPagination(filteredApplications.length, 10, [search, dateRange, statusFilter]);

  const pageApplications = sortedApplications.slice(pagination.startIndex, pagination.endIndex);

  useEffect(() => {
    pagination.setPage(1);
  }, [search, dateRange, statusFilter, pagination]);

  function handleResetFilters() {
    setSearch("");
    setDateRange({ start: null, end: null });
    setStatusFilter(null);
    setRowStates({});
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
    view,
    setView,
    locale,
    sortConfig,
    handleSort,
    filteredApplications,
    sortedApplications,
    rowStates,
    onToggleRow,
    headerState,
    onToggleHeader,
    pagination,
    pageApplications,
    handleResetFilters,
    t,
  };
}

