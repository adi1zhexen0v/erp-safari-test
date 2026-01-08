import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import {
  useHiringReviewApplicationMutation,
  useHiringRejectApplicationMutation,
} from "@/features/hr/hiring";
import { HR_FILL_CONTRACT_PAGE_ROUTE } from "@/shared/utils";
import type { PromptState } from "./useHiringModals";

export interface UseHiringMutationsReturn {
  reviewApplication: ReturnType<typeof useHiringReviewApplicationMutation>[0];
  rejectApplication: ReturnType<typeof useHiringRejectApplicationMutation>[0];
    isLoading: {
      isReviewing: boolean;
      isRejecting: boolean;
      isCreatingContract: boolean;
      isLoadingAny: boolean;
    };
  reviewingApplicationId: number | null;
  rejectingApplicationId: number | null;
  handleApprove: (id: number, onClose?: () => void) => Promise<void>;
  handleSendRevision: (id: number, notes: string) => Promise<void>;
  handleSendReject: (id: number, reason: string) => Promise<void>;
  handleCreateContract: (id: number) => void;
  setPrompt: (state: PromptState | null) => void;
}

export function useHiringMutations(
  setPrompt: (state: PromptState | null) => void,
): UseHiringMutationsReturn {
  const { t } = useTranslation("HiringPage");
  const navigate = useNavigate();

  const [reviewApplication] = useHiringReviewApplicationMutation();
  const [rejectApplication] = useHiringRejectApplicationMutation();

  const [reviewingApplicationId, setReviewingApplicationId] = useState<number | null>(null);
  const [rejectingApplicationId, setRejectingApplicationId] = useState<number | null>(null);

  const isReviewing = reviewingApplicationId !== null;
  const isRejecting = rejectingApplicationId !== null;
  const isCreatingContract = false;
  const isLoadingAny = isReviewing || isRejecting || isCreatingContract;

  async function handleApprove(id: number, onClose?: () => void) {
    try {
      setReviewingApplicationId(id);
      await reviewApplication({ id, action: "approve" }).unwrap();
      if (onClose) {
        onClose();
      }
      setPrompt({
        title: t("messages.approveSuccessTitle"),
        text: t("messages.approveSuccessText"),
        variant: "success",
      });
    } catch (e) {
      console.error("Approve error:", e);
      if (onClose) {
        onClose();
      }
      setPrompt({
        title: t("messages.errorTitle"),
        text: t("messages.approveErrorText"),
        variant: "error",
      });
    } finally {
      setReviewingApplicationId(null);
    }
  }

  async function handleSendRevision(id: number, notes: string) {
    try {
      setReviewingApplicationId(id);
      await reviewApplication({
        id,
        action: "request_revision",
        notes,
      }).unwrap();

      setPrompt({
        title: t("messages.revisionSuccessTitle"),
        text: t("messages.revisionSuccessText"),
        variant: "success",
      });
    } catch (e) {
      console.error("Revision error:", e);
      setPrompt({
        title: t("messages.errorTitle"),
        text: t("messages.revisionErrorText"),
        variant: "error",
      });
    } finally {
      setReviewingApplicationId(null);
    }
  }

  async function handleSendReject(id: number, reason: string) {
    try {
      setRejectingApplicationId(id);
      await rejectApplication({
        id,
        rejection_reason: reason,
      }).unwrap();

      setPrompt({
        title: t("messages.rejectSuccessTitle"),
        text: t("messages.rejectSuccessText"),
        variant: "success",
      });
    } catch (e) {
      console.error("Reject error:", e);
      setPrompt({
        title: t("messages.errorTitle"),
        text: t("messages.rejectErrorText"),
        variant: "error",
      });
    } finally {
      setRejectingApplicationId(null);
    }
  }

  function handleCreateContract(id: number) {
    navigate(HR_FILL_CONTRACT_PAGE_ROUTE.replace(":applicationId", String(id)));
  }

  return {
    reviewApplication,
    rejectApplication,
    isLoading: {
      isReviewing,
      isRejecting,
      isCreatingContract,
      isLoadingAny,
    },
    reviewingApplicationId,
    rejectingApplicationId,
    handleApprove,
    handleSendRevision,
    handleSendReject,
    handleCreateContract,
    setPrompt,
  };
}

