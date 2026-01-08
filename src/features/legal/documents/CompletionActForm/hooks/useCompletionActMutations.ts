import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateCompletionActMutation,
  useUpdateCompletionActMutation,
  useDeleteCompletionActMutation,
  useUploadCompletionActDocumentMutation,
  useSubmitCompletionActMutation,
  useApproveCompletionActMutation,
  useRejectCompletionActMutation,
} from "../api";
import type { CompletionActCreatePayload, CompletionActUpdatePayload } from "../types";
import type { PromptState } from "./useCompletionActModals";

export interface UseCompletionActMutationsReturn {
  createCompletionAct: ReturnType<typeof useCreateCompletionActMutation>[0];
  updateCompletionAct: ReturnType<typeof useUpdateCompletionActMutation>[0];
  deleteCompletionAct: ReturnType<typeof useDeleteCompletionActMutation>[0];
  uploadDocument: ReturnType<typeof useUploadCompletionActDocumentMutation>[0];
  submitCompletionAct: ReturnType<typeof useSubmitCompletionActMutation>[0];
  approveCompletionAct: ReturnType<typeof useApproveCompletionActMutation>[0];
  rejectCompletionAct: ReturnType<typeof useRejectCompletionActMutation>[0];
  isLoading: {
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    isUploading: boolean;
    isSubmitting: boolean;
    isApproving: boolean;
    isRejecting: boolean;
    isLoadingAny: boolean;
  };
  processingActId: number | null;
  handleCreate: (payload: CompletionActCreatePayload, onSuccess?: () => void) => Promise<void>;
  handleUpdate: (id: number, payload: CompletionActUpdatePayload, onSuccess?: () => void) => Promise<void>;
  handleDelete: (id: number, onSuccess?: () => void) => Promise<void>;
  handleUpload: (id: number, file: File, onSuccess?: () => void) => Promise<void>;
  handleSubmit: (id: number, onSuccess?: () => void) => Promise<void>;
  handleApprove: (id: number, onSuccess?: () => void) => Promise<void>;
  handleReject: (id: number, reason: string, onSuccess?: () => void) => Promise<void>;
  setPrompt: (state: PromptState | null) => void;
}

export function useCompletionActMutations(
  setPrompt: (state: PromptState | null) => void,
): UseCompletionActMutationsReturn {
  const { t } = useTranslation("LegalApplicationsPage");

  const [createCompletionAct, { isLoading: isCreating }] = useCreateCompletionActMutation();
  const [updateCompletionAct, { isLoading: isUpdating }] = useUpdateCompletionActMutation();
  const [deleteCompletionAct, { isLoading: isDeleting }] = useDeleteCompletionActMutation();
  const [uploadDocument, { isLoading: isUploading }] = useUploadCompletionActDocumentMutation();
  const [submitCompletionAct, { isLoading: isSubmitting }] = useSubmitCompletionActMutation();
  const [approveCompletionAct, { isLoading: isApproving }] = useApproveCompletionActMutation();
  const [rejectCompletionAct, { isLoading: isRejecting }] = useRejectCompletionActMutation();

  const [processingActId, setProcessingActId] = useState<number | null>(null);

  const isLoadingAny =
    isCreating || isUpdating || isDeleting || isUploading || isSubmitting || isApproving || isRejecting;

  async function handleCreate(payload: CompletionActCreatePayload, onSuccess?: () => void) {
    try {
      await createCompletionAct(payload).unwrap();
      setPrompt({
        title: t("completionAct.messages.createSuccessTitle"),
        text: t("completionAct.messages.createSuccessText"),
        variant: "success",
      });
      onSuccess?.();
    } catch (e) {
      console.error("Create CompletionAct error:", e);
      setPrompt({
        title: t("messages.errorTitle"),
        text: t("completionAct.messages.createError"),
        variant: "error",
      });
    }
  }

  async function handleUpdate(id: number, payload: CompletionActUpdatePayload, onSuccess?: () => void) {
    try {
      setProcessingActId(id);
      await updateCompletionAct({ id, payload }).unwrap();
      setPrompt({
        title: t("completionAct.messages.updateSuccessTitle"),
        text: t("completionAct.messages.updateSuccessText"),
        variant: "success",
      });
      onSuccess?.();
    } catch (e) {
      console.error("Update CompletionAct error:", e);
      setPrompt({
        title: t("messages.errorTitle"),
        text: t("completionAct.messages.updateError"),
        variant: "error",
      });
    } finally {
      setProcessingActId(null);
    }
  }

  async function handleDelete(id: number, onSuccess?: () => void) {
    try {
      setProcessingActId(id);
      await deleteCompletionAct(id).unwrap();
      setPrompt({
        title: t("completionAct.messages.deleteSuccessTitle"),
        text: t("completionAct.messages.deleteSuccessText"),
        variant: "success",
      });
      onSuccess?.();
    } catch (e) {
      console.error("Delete CompletionAct error:", e);
      setPrompt({
        title: t("messages.errorTitle"),
        text: t("completionAct.messages.deleteError"),
        variant: "error",
      });
    } finally {
      setProcessingActId(null);
    }
  }

  async function handleUpload(id: number, file: File, onSuccess?: () => void) {
    try {
      setProcessingActId(id);
      await uploadDocument({ id, file }).unwrap();
      setPrompt({
        title: t("completionAct.messages.uploadSuccessTitle"),
        text: t("completionAct.messages.uploadSuccessText"),
        variant: "success",
      });
      onSuccess?.();
    } catch (e) {
      console.error("Upload document error:", e);
      setPrompt({
        title: t("messages.errorTitle"),
        text: t("completionAct.messages.uploadError"),
        variant: "error",
      });
    } finally {
      setProcessingActId(null);
    }
  }

  async function handleSubmit(id: number, onSuccess?: () => void) {
    try {
      setProcessingActId(id);
      await submitCompletionAct(id).unwrap();
      setPrompt({
        title: t("completionAct.messages.submitSuccessTitle"),
        text: t("completionAct.messages.submitSuccessText"),
        variant: "success",
      });
      onSuccess?.();
    } catch (e) {
      console.error("Submit CompletionAct error:", e);
      setPrompt({
        title: t("messages.errorTitle"),
        text: t("completionAct.messages.submitError"),
        variant: "error",
      });
    } finally {
      setProcessingActId(null);
    }
  }

  async function handleApprove(id: number, onSuccess?: () => void) {
    try {
      setProcessingActId(id);
      await approveCompletionAct(id).unwrap();
      setPrompt({
        title: t("completionAct.messages.approveSuccessTitle"),
        text: t("completionAct.messages.approveSuccessText"),
        variant: "success",
      });
      onSuccess?.();
    } catch (e) {
      console.error("Approve CompletionAct error:", e);
      setPrompt({
        title: t("messages.errorTitle"),
        text: t("completionAct.messages.approveError"),
        variant: "error",
      });
    } finally {
      setProcessingActId(null);
    }
  }

  async function handleReject(id: number, reason: string, onSuccess?: () => void) {
    try {
      setProcessingActId(id);
      await rejectCompletionAct({ id, payload: { reason } }).unwrap();
      setPrompt({
        title: t("completionAct.messages.rejectSuccessTitle"),
        text: t("completionAct.messages.rejectSuccessText"),
        variant: "success",
      });
      onSuccess?.();
    } catch (e) {
      console.error("Reject CompletionAct error:", e);
      setPrompt({
        title: t("messages.errorTitle"),
        text: t("completionAct.messages.rejectError"),
        variant: "error",
      });
    } finally {
      setProcessingActId(null);
    }
  }

  return {
    createCompletionAct,
    updateCompletionAct,
    deleteCompletionAct,
    uploadDocument,
    submitCompletionAct,
    approveCompletionAct,
    rejectCompletionAct,
    isLoading: {
      isCreating,
      isUpdating,
      isDeleting,
      isUploading,
      isSubmitting,
      isApproving,
      isRejecting,
      isLoadingAny,
    },
    processingActId,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleUpload,
    handleSubmit,
    handleApprove,
    handleReject,
    setPrompt,
  };
}

