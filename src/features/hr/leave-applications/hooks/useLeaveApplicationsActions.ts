import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteAnnualLeaveMutation, useDeleteUnpaidLeaveMutation, useDeleteMedicalLeaveMutation } from "../api";
import type { LeaveApplication } from "../types";

export type LeaveAction = "edit" | "delete" | "preview";

export interface PromptState {
  title: string;
  text: string;
  variant?: "success" | "warning" | "error";
  leaveId?: string;
  isConfirmDialog?: boolean;
}

export interface UseLeaveApplicationsActionsReturn {
  isLoading: {
    isDeleting: boolean;
    isLoadingAny: boolean;
  };
  deletingLeaveId: number | null;
  prompt: PromptState | null;
  setPrompt: (state: PromptState | null) => void;
  handleDelete: (leave: LeaveApplication) => Promise<void>;
  handleAction: (action: LeaveAction, leave: LeaveApplication) => void;
}

interface ApiError {
  data?: {
    error?: string;
    message?: string;
    detail?: string;
  };
}

export function useLeaveApplicationsActions(): UseLeaveApplicationsActionsReturn {
  const { t } = useTranslation("LeaveApplicationsPage");

  const [deleteAnnualLeave] = useDeleteAnnualLeaveMutation();
  const [deleteUnpaidLeave] = useDeleteUnpaidLeaveMutation();
  const [deleteMedicalLeave] = useDeleteMedicalLeaveMutation();

  const [prompt, setPrompt] = useState<PromptState | null>(null);
  const [deletingLeaveId, setDeletingLeaveId] = useState<number | null>(null);

  const isDeleting = deletingLeaveId !== null;
  const isLoadingAny = isDeleting;

  async function handleDelete(leave: LeaveApplication) {
    try {
      setDeletingLeaveId(leave.id);
      if (leave.leave_type === "annual") {
        await deleteAnnualLeave(leave.id).unwrap();
      } else if (leave.leave_type === "unpaid") {
        await deleteUnpaidLeave(leave.id).unwrap();
      } else {
        await deleteMedicalLeave(leave.id).unwrap();
      }
      setPrompt({
        title: t("messages.deleteSuccessTitle"),
        text: t("messages.deleteSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const errorMessage = apiError?.data?.error || apiError?.data?.message || apiError?.data?.detail || t("messages.deleteFailed");
      setPrompt({
        title: t("messages.deleteErrorTitle") || t("messages.deleteConfirmTitle"),
        text: errorMessage,
        variant: "error",
        isConfirmDialog: false,
      });
    } finally {
      setDeletingLeaveId(null);
    }
  }

  function handleAction(action: LeaveAction) {
    switch (action) {
      case "delete":
        setPrompt({
          title: t("messages.deleteConfirmTitle"),
          text: t("messages.deleteConfirmText"),
          variant: "warning",
          isConfirmDialog: true,
        });
        break;
      case "edit":
      case "preview":
        break;
    }
  }

  return {
    isLoading: {
      isDeleting,
      isLoadingAny,
    },
    deletingLeaveId,
    prompt,
    setPrompt,
    handleDelete,
    handleAction,
  };
}

