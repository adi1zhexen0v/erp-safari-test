import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CheckboxState } from "@/shared/ui/Checkbox";
import { downloadBlob, type Locale } from "@/shared/utils";
import { usePagination } from "@/shared/hooks";
import { useGetWorkersQuery, useDownloadWorkerProfilePreviewMutation } from "../api";
import type { WorkerListItem, EmployeeStatus } from "../types";
import type { StatusOption } from "../pages/EmployeesPage/components/EmployeesFilter";
import { useEmployeesFilter, hasActiveEmployeesFilters } from "./useEmployeesFilter";
import {
  useEmployeesSort,
  toggleEmployeesSort,
  type EmployeesSortKey,
  type EmployeesSortConfig,
} from "./useEmployeesSort";

export interface UseEmployeesListPageReturn {
  data: ReturnType<typeof useGetWorkersQuery>["data"];
  isLoading: boolean;
  isError: boolean;
  search: string;
  setSearch: (value: string) => void;
  hireDateRange: {
    start: Date | null;
    end: Date | null;
  };
  setHireDateRange: (value: { start: Date | null; end: Date | null }) => void;
  statusFilter: EmployeeStatus | null;
  setStatusFilter: (value: EmployeeStatus | null) => void;
  statusOptions: StatusOption[];
  activeFilters: boolean;
  view: "table" | "cards";
  setView: (value: "table" | "cards") => void;
  locale: Locale;
  sortConfig: EmployeesSortConfig | null;
  handleSort: (key: EmployeesSortKey) => void;
  filteredWorkers: ReturnType<typeof useEmployeesFilter>;
  sortedWorkers: ReturnType<typeof useEmployeesSort>;
  rowStates: Record<string, CheckboxState>;
  onToggleRow: (id: number) => void;
  headerState: CheckboxState;
  onToggleHeader: () => void;
  pagination: ReturnType<typeof usePagination>;
  pageWorkers: WorkerListItem[];
  handleResetFilters: () => void;
  handleDownloadProfile: (id: number) => Promise<void>;
  isDownloadingProfile: boolean;
  downloadingId: number | null;
  prompt: { title: string; text: string; variant?: "success" | "error" } | null;
  setPrompt: (value: { title: string; text: string; variant?: "success" | "error" } | null) => void;
  leaveFormEmployee: WorkerListItem | null;
  setLeaveFormEmployee: (value: WorkerListItem | null) => void;
  leaveFormSuccess: boolean;
  setLeaveFormSuccess: (value: boolean) => void;
  medicalLeaveFormEmployee: WorkerListItem | null;
  setMedicalLeaveFormEmployee: (value: WorkerListItem | null) => void;
  medicalLeaveFormSuccess: boolean;
  setMedicalLeaveFormSuccess: (value: boolean) => void;
  resignationFormEmployee: WorkerListItem | null;
  setResignationFormEmployee: (value: WorkerListItem | null) => void;
  resignationFormSuccess: boolean;
  setResignationFormSuccess: (value: boolean) => void;
  contractChangesEmployee: WorkerListItem | null;
  setContractChangesEmployee: (value: WorkerListItem | null) => void;
  t: ReturnType<typeof useTranslation>["t"];
}

export function useEmployeesListPage(): UseEmployeesListPageReturn {
  const { i18n, t } = useTranslation("EmployeesPage");
  const locale = i18n.language as Locale;

  const [search, setSearch] = useState("");
  const [hireDateRange, setHireDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | null>(null);

  const statusOptions: StatusOption[] = useMemo(
    () => [
      { label: t("status.active"), value: "active" },
      { label: t("status.vacation"), value: "annual_leave" },
      { label: t("status.medical_leave"), value: "medical_leave" },
      { label: t("status.inactive"), value: "inactive" },
    ],
    [t],
  );

  const [view, setView] = useState<"table" | "cards">("table");
  const [sortConfig, setSortConfig] = useState<EmployeesSortConfig | null>(null);

  function handleSort(key: EmployeesSortKey) {
    setSortConfig((prev) => toggleEmployeesSort(prev, key));
  }

  const { data, isLoading, isError } = useGetWorkersQuery({
    status: statusFilter || undefined,
    search: search.trim() || undefined,
  });

  const [downloadProfile, { isLoading: isDownloadingProfile }] = useDownloadWorkerProfilePreviewMutation();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [prompt, setPrompt] = useState<{ title: string; text: string; variant?: "success" | "error" } | null>(null);
  const [leaveFormEmployee, setLeaveFormEmployee] = useState<WorkerListItem | null>(null);
  const [leaveFormSuccess, setLeaveFormSuccess] = useState(false);
  const [medicalLeaveFormEmployee, setMedicalLeaveFormEmployee] = useState<WorkerListItem | null>(null);
  const [medicalLeaveFormSuccess, setMedicalLeaveFormSuccess] = useState(false);
  const [resignationFormEmployee, setResignationFormEmployee] = useState<WorkerListItem | null>(null);
  const [resignationFormSuccess, setResignationFormSuccess] = useState(false);
  const [contractChangesEmployee, setContractChangesEmployee] = useState<WorkerListItem | null>(null);

  const filterState = useMemo(
    () => ({
      search,
      hireDateRange,
      statusFilter,
    }),
    [search, hireDateRange, statusFilter],
  );

  const filteredWorkers = useEmployeesFilter(data, filterState);
  const sortedWorkers = useEmployeesSort(filteredWorkers, sortConfig);

  const [rowStates, setRowStates] = useState<Record<string, CheckboxState>>({});

  function onToggleRow(id: number) {
    const key = String(id);
    setRowStates((prev) => ({
      ...prev,
      [key]: prev[key] === "checked" ? "unchecked" : "checked",
    }));
  }

  const headerState: CheckboxState = useMemo(() => {
    const total = sortedWorkers.length;
    if (total === 0) return "unchecked";

    const checkedCount = sortedWorkers.filter((worker) => rowStates[String(worker.id)] === "checked").length;

    if (checkedCount === 0) return "unchecked";
    if (checkedCount === total) return "checked";
    return "indeterminate";
  }, [sortedWorkers, rowStates]);

  function onToggleHeader() {
    const selectAll = headerState !== "checked";

    setRowStates((prev) => {
      const next = { ...prev };
      sortedWorkers.forEach((worker) => {
        next[String(worker.id)] = selectAll ? "checked" : "unchecked";
      });
      return next;
    });
  }

  const pagination = usePagination(sortedWorkers.length, 10, [search, hireDateRange, statusFilter]);
  const pageWorkers = sortedWorkers.slice(pagination.startIndex, pagination.endIndex);

  const activeFilters = hasActiveEmployeesFilters(filterState);

  function handleResetFilters() {
    setSearch("");
    setHireDateRange({ start: null, end: null });
    setStatusFilter(null);
    setRowStates({});
    pagination.setPage(1);
  }

  async function handleDownloadProfile(id: number) {
    setDownloadingId(id);
    try {
      const blob = await downloadProfile(id).unwrap();
      downloadBlob(blob, `Личный листок сотрудника ${id}.docx`);
      setDownloadingId(null);
    } catch (error) {
      setDownloadingId(null);
      const err = error as { data?: { error?: string; message?: string } };
      const errorMessage = err?.data?.error || err?.data?.message || t("messages.downloadFailed");
      setPrompt({
        title: t("messages.errorTitle"),
        text: errorMessage,
        variant: "error",
      });
    }
  }

  return {
    data,
    isLoading,
    isError,
    search,
    setSearch,
    hireDateRange,
    setHireDateRange,
    statusFilter,
    setStatusFilter,
    statusOptions,
    activeFilters,
    view,
    setView,
    locale,
    sortConfig,
    handleSort,
    filteredWorkers,
    sortedWorkers,
    rowStates,
    onToggleRow,
    headerState,
    onToggleHeader,
    pagination,
    pageWorkers,
    handleResetFilters,
    handleDownloadProfile,
    isDownloadingProfile,
    downloadingId,
    prompt,
    setPrompt,
    leaveFormEmployee,
    setLeaveFormEmployee,
    leaveFormSuccess,
    setLeaveFormSuccess,
    medicalLeaveFormEmployee,
    setMedicalLeaveFormEmployee,
    medicalLeaveFormSuccess,
    setMedicalLeaveFormSuccess,
    resignationFormEmployee,
    setResignationFormEmployee,
    resignationFormSuccess,
    setResignationFormSuccess,
    contractChangesEmployee,
    setContractChangesEmployee,
    t,
  };
}
