import ApplyApplicationPage from "./pages/ApplyApplicationPage";
import HiringPage from "./pages/HiringPage";

export {
  useHiringCreateCandidateMutation,
  useHiringGetApplicationsQuery,
  useHiringGetApplicationDetailQuery,
  useHiringReviewApplicationMutation,
  useHiringRejectApplicationMutation,
  useHiringDownloadApplicationProfilePreviewMutation,
  useApplyApplicationGetCompletenessQuery,
  useApplyApplicationSubmitMutation,
  useApplyApplicationValidateTokenQuery,
} from "./api";

export type {
  CreateCandidateDto,
  CreateCandidateResponse,
  GetApplicationsResponse,
  ReviewApplicationDto,
  ReviewApplicationResponse,
  RejectApplicationDto,
  RejectApplicationResponse,
  ApplicationDetailResponse,
  SectionStatus,
  CompletenessResponse,
  DraftData,
  ValidateTokenResponse,
  ApplicationStage,
  ApplicationStatus,
  ReviewAction,
  SectionKey,
  SortKey,
  SortConfig,
} from "./types";

export {
  useApplicationsFilter,
  hasActiveFilters,
  useApplicationsSort,
  toggleSort,
  useApplicationsPagination,
  useHiringModals,
  type PromptState,
  type RevisionModalState,
  type RejectModalState,
  type UseHiringModalsReturn,
  useHiringMutations,
  type UseHiringMutationsReturn,
  useHiringDownloads,
  type UseHiringDownloadsReturn,
  useHiringActions,
  type UseHiringActionsReturn,
  useHiringListPage,
  type UseHiringListPageReturn,
  useApplyApplicationPage,
  type UseApplyApplicationPageReturn,
} from "./hooks";

export {
  parseDate,
  normalizeDateToStartOfDay,
  normalizeDateToEndOfDay,
  matchesDateRange,
  type DateRange,
} from "@/shared/utils";
export { getAvailableActions, type HiringAction, type ActionConfig, type ApplicationActions } from "./utils";

export { completenessSlice, setGender, setIsResident, setIsStudent } from "./slice";

export { type CreateCandidateFormValues, createCandidateSchema } from "./validation";

export {
  CITIZENSHIP_OPTIONS,
  type CitizenshipOption,
  NATIONALITY_OPTIONS,
  type NationalityOption,
  EXPERIENCE_SECTOR_OPTIONS,
  type ExperienceSectorOption,
  SOCIAL_CATEGORY_OPTIONS,
  type SocialCategoryOption,
  STATUS_MAP,
} from "./consts";

export { ApplyApplicationPage, HiringPage };
