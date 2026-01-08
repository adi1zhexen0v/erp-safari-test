import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useSubmitContractForSigningMutation,
  useReviewJobApplicationMutation,
  useCreateOrderOnHiringMutation,
  useCompleteHiringMutation,
} from "@/features/hr/contracts/api";
import { extractErrorMessage } from "@/features/hr/contracts/utils";
import type { PromptState } from "./useContractModals";

export interface UseContractMutationsReturn {
  submittingContractId: number | null;
  reviewingJobApplicationCandidateId: number | null;
  completingHiringCandidateId: number | null;
  isSubmitting: boolean;
  handleSubmitForSigning: (id: number) => Promise<void>;
  handleReviewJobApplication: (candidateId: number, action: "approve" | "reject" | "revision") => Promise<void>;
  handleCreateOrder: (candidateId: number) => Promise<void>;
  handleCompleteHiring: (candidateId: number) => Promise<void>;
  handleUploadJobApplication: (candidateId: number) => void;
  handleUploadOrder: (candidateId: number) => void;
}

export function useContractMutations(
  setPrompt: (state: PromptState | null) => void,
  setUploadJobApplicationModal: (state: { candidateId: number } | null) => void,
  setUploadOrderModal: (state: { candidateId: number } | null) => void,
): UseContractMutationsReturn {
  const { t } = useTranslation("ContractsPage");

  const [submitContractForSigning] = useSubmitContractForSigningMutation();
  const [reviewJobApplication] = useReviewJobApplicationMutation();
  const [createOrderOnHiring] = useCreateOrderOnHiringMutation();
  const [completeHiring] = useCompleteHiringMutation();

  const [submittingContractId, setSubmittingContractId] = useState<number | null>(null);
  const [reviewingJobApplicationCandidateId, setReviewingJobApplicationCandidateId] = useState<number | null>(null);
  const [completingHiringCandidateId, setCompletingHiringCandidateId] = useState<number | null>(null);

  const isSubmitting = submittingContractId !== null;

  async function handleSubmitForSigning(id: number) {
    try {
      setSubmittingContractId(id);
      await submitContractForSigning(id).unwrap();
      setPrompt({
        title: t("messages.submitSuccessTitle"),
        text: t("messages.submitSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.submitErrorText", t),
        variant: "error",
      });
    } finally {
      setSubmittingContractId(null);
    }
  }

  async function handleReviewJobApplication(candidateId: number, action: "approve" | "reject" | "revision") {
    try {
      setReviewingJobApplicationCandidateId(candidateId);
      await reviewJobApplication({ candidateId, body: { action } }).unwrap();

      setPrompt({
        title: t("jobApplication.messages.uploadSuccess"),
        text:
          action === "approve"
            ? t("jobApplication.messages.approveSuccess")
            : action === "revision"
              ? t("jobApplication.messages.revisionSuccess")
              : t("jobApplication.messages.rejectSuccess"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.errorTitle", t),
        variant: "error",
      });
    } finally {
      setReviewingJobApplicationCandidateId(null);
    }
  }

  async function handleCreateOrder(candidateId: number) {
    try {
      setReviewingJobApplicationCandidateId(candidateId);
      await createOrderOnHiring(candidateId).unwrap();
      setPrompt({
        title: t("order.messages.createSuccess"),
        text: t("order.messages.createSuccess"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "order.messages.createError", t),
        variant: "error",
      });
    } finally {
      setReviewingJobApplicationCandidateId(null);
    }
  }

  async function handleCompleteHiring(candidateId: number) {
    try {
      setCompletingHiringCandidateId(candidateId);
      await completeHiring(candidateId).unwrap();
      setPrompt({
        title: t("order.messages.completeSuccess"),
        text: t("order.messages.completeSuccess"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "order.messages.completeError", t),
        variant: "error",
      });
    } finally {
      setCompletingHiringCandidateId(null);
    }
  }

  function handleUploadJobApplication(candidateId: number) {
    setUploadJobApplicationModal({ candidateId });
  }

  function handleUploadOrder(candidateId: number) {
    if (!candidateId || candidateId === undefined || candidateId === null || isNaN(candidateId)) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: t("order.messages.uploadError"),
        variant: "error",
      });
      return;
    }
    setUploadOrderModal({ candidateId });
  }

  return {
    submittingContractId,
    reviewingJobApplicationCandidateId,
    completingHiringCandidateId,
    isSubmitting,
    handleSubmitForSigning,
    handleReviewJobApplication,
    handleCreateOrder,
    handleCompleteHiring,
    handleUploadJobApplication,
    handleUploadOrder,
  };
}

