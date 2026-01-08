import {
  ResignationLetterDetailsModal,
  CreateResignationForm,
  ResignationPreview,
  UploadApplicationModal,
  UploadOrderModal,
} from "./components";

export {
  resignationApi,
  useGetResignationLettersQuery,
  useGetResignationLetterQuery,
  useLazyGetResignationLetterQuery,
  useCreateResignationLetterMutation,
  useUpdateResignationLetterMutation,
  useDeleteResignationLetterMutation,
  useSubmitResignationLetterMutation,
  useCancelResignationLetterMutation,
  applicationApi,
  usePreviewResignationApplicationMutation,
  useUploadResignationApplicationMutation,
  useReviewResignationApplicationMutation,
  ordersApi,
  useCreateTerminationOrderMutation,
  usePreviewTerminationOrderMutation,
  useUploadTerminationOrderMutation,
} from "./api";

export type {
  ResignationStatus,
  ApplicationReviewStatus,
  ApprovalResolution,
  Worker,
  CreatedBy,
  TerminationOrder,
  ResignationLetterResponse,
  CreateResignationLetterDto,
  UpdateResignationLetterDto,
  SubmitResponse,
  CancelResponse,
  UploadApplicationResponse,
  ReviewApplicationRequest,
  ReviewApplicationResponse,
  CreateOrderResponse,
  UploadOrderResponse,
} from "./types";

export { RESIGNATION_STATUS_MAP } from "./consts";

export { createResignationSchema, type CreateResignationFormValues } from "./validation";

export { getAvailableActions, type ResignationAction, type ActionConfig, type ResignationActionsConfig } from "./utils";

export {
  ResignationLetterDetailsModal,
  CreateResignationForm,
  ResignationPreview,
  UploadApplicationModal,
  UploadOrderModal,
};

