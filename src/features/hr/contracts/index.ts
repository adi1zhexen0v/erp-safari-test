import ContractsListPage from "./pages/ContractsListPage";
import FillContractPage from "./pages/FillContractPage";

export {
  useCreateContractMutation,
  useGetContractDetailQuery,
  useLazyGetContractDetailQuery,
  useGetContractsQuery,
  useSubmitContractForSigningMutation,
  useDownloadWorkContractPreviewMutation,
  useGetContractClausesQuery,
  usePreviewJobApplicationMutation,
  useUploadJobApplicationMutation,
  useReviewJobApplicationMutation,
  useCreateOrderOnHiringMutation,
  usePreviewOrderOnHiringMutation,
  useUploadOrderOnHiringMutation,
  useCompleteHiringMutation,
} from "./api";

export type {
  CreateContractDto,
  CreateContractResponse,
  CreateContractAlreadyExistsResponse,
  ContractDetailResponse,
  ListContractsResponse,
  SubmitForSigningResponse,
  ContractClause,
  ContractClausesResponse,
  JobApplicationStage,
  JobApplicationReviewStatus,
  JobApplication,
  JobApplicationReviewRequest,
  JobApplicationReviewResponse,
  OrderOnHiring,
  OrderOnHiringResponse,
  CompleteHiringResponse,
  AmendmentResponse,
  ContractType,
  WorkType,
  WorkSchedule,
  WorkFormat,
  WorkConditions,
  SalaryType,
  WithholdingType,
  PaymentMethod,
  Worker,
  TrustMeDocument,
  ContractFormValues,
  ContractChoice,
  SectionId,
} from "./types";

export {
  useContractsFilter,
  hasActiveFilters,
  type SortKey,
  type SortConfig,
  useContractsSort,
  toggleSort,
  useContractsPagination,
  useGroupedContracts,
  type GroupedContract,
  useContractsActions,
  getAvailableActions,
  type ContractAction,
  type ActionConfig,
  type ContractActions,
  type PromptState,
  type UseContractsActionsReturn,
  useApplicationItems,
  type ApplicationItem,
  useContractsListPage,
  type UseContractsListPageReturn,
  useLeaveProtection,
  type UseLeaveProtectionReturn,
} from "./hooks";

export {
  parseDate,
  normalizeDateToStartOfDay,
  normalizeDateToEndOfDay,
  matchesDateRange,
  type DateRange,
} from "@/shared/utils";
export {
  getJobApplicationActions,
  type JobApplicationActionsConfig,
  getOrderActions,
  type OrderActionsConfig,
  getAmendmentText,
  extractErrorMessage,
  ContractSchema,
  type ContractSchemaType,
} from "./utils";

export { workContractSlice } from "./slice";

export {
  CONTRACT_TYPE_CHOICES,
  WORK_TYPE_CHOICES,
  WORK_SCHEDULE_CHOICES,
  WORK_FORMAT_CHOICES,
  WORK_CONDITIONS_CHOICES,
  PAYMENT_METHOD_CHOICES,
  SALARY_TYPE_CHOICES,
  WITHHOLDING_TYPE_CHOICES,
  IDLE_PAYMENT_CHOICES,
  OVERTIME_PAYMENT_CHOICES,
} from "./consts";
export {
  DEFAULT_CONTRACT_VALUES,
  SECTION_FIELDS,
  SECTIONS,
} from "./consts/fillContract";

export { ContractsListPage, FillContractPage };
