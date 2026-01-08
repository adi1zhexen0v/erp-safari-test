import PayrollsPage from "./pages/PayrollsPage";
import PayrollDetailPage from "./pages/PayrollDetailPage";

export { PayrollsPage, PayrollDetailPage };

export {
  payrollApi,
  useGetPayrollsQuery,
  useGetPayrollDetailQuery,
  useLazyGetPayrollDetailQuery,
  useGeneratePayrollMutation,
  useApprovePayrollMutation,
  useMarkPayrollPaidMutation,
  useDeletePayrollMutation,
  useRecalculatePayrollMutation,
} from "./api";

export {
  usePayrollModals,
  usePayrollMutations,
  usePayrollsListPage,
  usePayrollsSort,
  toggleSort,
  type PromptState,
  type UsePayrollMutationsReturn,
  type UsePayrollsListPageReturn,
  type StatusOption,
  type SortKey,
  type SortConfig,
} from "./hooks";

export type {
  PayrollStatus,
  SalaryType,
  WorkConditions,
  TaxCategory,
  CalculationSnapshotFlags,
  CalculationSnapshotInput,
  CalculationSnapshot,
  PayrollWorker,
  PayrollOrganization,
  PayrollManager,
  PayrollTimesheet,
  PayrollEntry,
  PayrollEntryListItem,
  PayrollListResponse,
  PayrollDetailResponse,
  GeneratePayrollDto,
  ApprovePayrollDto,
  MarkPaidDto,
} from "./types";

export {
  canEditPayroll,
  canApprovePayroll,
  canMarkPayrollPaid,
  getPayrollAvailableActions,
  getTaxCategoryLabel,
  formatPayrollAmount,
  calculatePaymentDestinations,
  groupEntriesByTaxCategory,
  groupEntriesByResidency,
  groupEntriesByContractType,
  getInitials,
  getStatusBadges,
  aggregatePayrollTotals,
  aggregateGPHTotals,
  type PaymentDestination,
  type GroupedEntryData,
  type AggregatedTotals,
  type GPHTotals,
  type StatusBadge,
} from "./utils";

export { PAYROLL_STATUS_ORDER, TAX_CATEGORY_LABELS } from "./consts";
export { MONTHS_RU, MONTHS_KK, MONTHS_EN } from "@/shared/consts";

