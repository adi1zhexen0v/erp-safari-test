import React from "react";
import { useTranslation } from "react-i18next";
import { DocumentText1, ArrowDown2, Import } from "iconsax-react";
import type { ListContractsResponse } from "@/features/hr/contracts/types";
import { useContractModals } from "./useContractModals";
import { useContractDownloads } from "./useContractDownloads";
import { useContractMutations } from "./useContractMutations";

export type ContractAction =
  | "download"
  | "submit_for_signing"
  | "preview"
  | "upload_job_application"
  | "preview_job_application"
  | "review_job_application"
  | "review_job_application_revision"
  | "review_job_application_reject"
  | "create_order"
  | "upload_order"
  | "preview_order"
  | "complete_hiring"
  | "download_contract"
  | "download_contract_pdf"
  | "download_contract_docx";

export interface ActionConfig {
  id: ContractAction;
  label: string;
  variant: "primary" | "secondary" | "danger" | "destructive" | "tertiary";
  icon?: React.ReactNode;
}

export interface ContractActions {
  actions: ActionConfig[];
  isLoading: boolean;
}

export interface PromptState {
  title: string;
  text: string;
  variant?: "success" | "error" | "warning";
}

export interface UseContractsActionsReturn {
  fetchContractDetail: ReturnType<typeof useContractDownloads>["fetchContractDetail"];
  isLoading: {
    isDownloading: boolean;
    isSubmitting: boolean;
    isPreviewing: boolean;
    isLoadingAny: boolean;
  };
  downloadingContractId: number | null;
  previewingContractId: number | null;
  submittingContractId: number | null;
  previewingJobApplicationCandidateId: number | null;
  reviewingJobApplicationCandidateId: number | null;
  previewingOrderCandidateId: number | null;
  completingHiringCandidateId: number | null;
  downloadModal: { id: number } | null;
  setDownloadModal: (state: { id: number } | null) => void;
  uploadJobApplicationModal: { candidateId: number } | null;
  setUploadJobApplicationModal: (state: { candidateId: number } | null) => void;
  uploadOrderModal: { candidateId: number } | null;
  setUploadOrderModal: (state: { candidateId: number } | null) => void;
  prompt: PromptState | null;
  setPrompt: (state: PromptState | null) => void;
  handleDownload: (id: number, contract?: ListContractsResponse) => Promise<void>;
  handleSubmitForSigning: (id: number) => Promise<void>;
  handlePreview: (id: number) => Promise<void>;
  handleUploadJobApplication: (candidateId: number) => void;
  handlePreviewJobApplication: (candidateId: number) => Promise<void>;
  handleReviewJobApplication: (candidateId: number, action: "approve" | "reject" | "revision") => Promise<void>;
  handleUploadOrder: (candidateId: number) => void;
  handlePreviewOrder: (candidateId: number) => Promise<void>;
  handleCreateOrder: (candidateId: number) => Promise<void>;
  handleCompleteHiring: (candidateId: number) => Promise<void>;
  handleDownloadContractPdf: (id: number, contract?: ListContractsResponse) => Promise<void>;
  handleDownloadContractDocx: (id: number) => Promise<void>;
  handleAction: (action: ContractAction, contractId: number, contract?: ListContractsResponse) => Promise<void>;
}

export function getAvailableActions(
  contract: ListContractsResponse,
  isLoading: boolean,
  t: (key: string) => string,
): ContractActions {
  const { trustme_status, candidate_stage, candidate_application_id } = contract;

  const primaryActions: ActionConfig[] = [];
  const secondaryActions: ActionConfig[] = [];

  if (trustme_status === null) {
    primaryActions.push({
      id: "submit_for_signing",
      label: t("actions.submitForSigning"),
      variant: "primary",
      icon: React.createElement(DocumentText1, { size: 16, color: "currentColor" }),
    });
  }

  if (trustme_status === 3) {
    if (candidate_application_id) {
      if (candidate_stage === "job_app_approved") {
        primaryActions.push({
          id: "create_order",
          label: t("order.actions.create"),
          variant: "primary",
          icon: React.createElement(DocumentText1, { size: 16, color: "currentColor" }),
        });
      }

      if (candidate_stage === "order_uploaded") {
        primaryActions.push({
          id: "complete_hiring",
          label: t("order.actions.completeHiring"),
          variant: "primary",
          icon: React.createElement(DocumentText1, { size: 16, color: "currentColor" }),
        });
      }
    }

    if (contract.worker !== null) {
      secondaryActions.push({
        id: "download_contract_pdf",
        label: t("contract.downloadPdf"),
        variant: "secondary",
        icon: React.createElement(Import, { size: 16, color: "currentColor" }),
      });
    } else {
      secondaryActions.push({
        id: "download_contract",
        label: t("contract.download"),
        variant: "secondary",
        icon: React.createElement(ArrowDown2, { size: 16, color: "currentColor" }),
      });
    }
  }

  const actions = [...primaryActions, ...secondaryActions];

  return {
    actions,
    isLoading,
  };
}

export function useContractsActions(): UseContractsActionsReturn {
  const { t } = useTranslation("ContractsPage");

  const modals = useContractModals();

  const downloads = useContractDownloads(modals.setPrompt);

  const mutations = useContractMutations(
    modals.setPrompt,
    modals.setUploadJobApplicationModal,
    modals.setUploadOrderModal,
  );

  const isLoadingAny =
    downloads.isDownloading ||
    mutations.isSubmitting ||
    downloads.isPreviewing ||
    downloads.previewingJobApplicationCandidateId !== null ||
    mutations.reviewingJobApplicationCandidateId !== null ||
    downloads.previewingOrderCandidateId !== null ||
    mutations.completingHiringCandidateId !== null;

  async function handleAction(action: ContractAction, contractId: number, contract?: ListContractsResponse) {
    const candidateId = contract?.candidate_application_id;

    if ((action === "upload_order" || action === "preview_order" || action === "complete_hiring") && !candidateId) {
      modals.setPrompt({
        title: t("messages.errorTitle"),
        text: t("messages.errorTitle"),
        variant: "error",
      });
      return;
    }

    switch (action) {
      case "download":
        await downloads.handleDownload(contractId, contract);
        break;
      case "submit_for_signing":
        await mutations.handleSubmitForSigning(contractId);
        break;
      case "preview":
        await downloads.handlePreview(contractId);
        break;
      case "upload_job_application":
        if (candidateId) mutations.handleUploadJobApplication(candidateId);
        break;
      case "preview_job_application":
        if (candidateId) await downloads.handlePreviewJobApplication(candidateId);
        break;
      case "review_job_application":
        if (candidateId) await mutations.handleReviewJobApplication(candidateId, "approve");
        break;
      case "review_job_application_revision":
        if (candidateId) await mutations.handleReviewJobApplication(candidateId, "revision");
        break;
      case "review_job_application_reject":
        if (candidateId) await mutations.handleReviewJobApplication(candidateId, "reject");
        break;
      case "create_order":
        if (candidateId) await mutations.handleCreateOrder(candidateId);
        break;
      case "upload_order":
        if (candidateId) mutations.handleUploadOrder(candidateId);
        break;
      case "preview_order":
        if (candidateId) await downloads.handlePreviewOrder(candidateId);
        break;
      case "complete_hiring":
        if (candidateId) await mutations.handleCompleteHiring(candidateId);
        break;
      case "download_contract_pdf":
        await downloads.handleDownloadContractPdf(contractId, contract);
        break;
      case "download_contract_docx":
        await downloads.handleDownloadContractDocx(contractId);
        break;
    }
  }

  return {
    fetchContractDetail: downloads.fetchContractDetail,
    isLoading: {
      isDownloading: downloads.isDownloading,
      isSubmitting: mutations.isSubmitting,
      isPreviewing: downloads.isPreviewing,
      isLoadingAny,
    },
    downloadingContractId: downloads.downloadingContractId,
    previewingContractId: downloads.previewingContractId,
    submittingContractId: mutations.submittingContractId,
    previewingJobApplicationCandidateId: downloads.previewingJobApplicationCandidateId,
    reviewingJobApplicationCandidateId: mutations.reviewingJobApplicationCandidateId,
    previewingOrderCandidateId: downloads.previewingOrderCandidateId,
    completingHiringCandidateId: mutations.completingHiringCandidateId,
    downloadModal: modals.downloadModal,
    setDownloadModal: modals.setDownloadModal,
    uploadJobApplicationModal: modals.uploadJobApplicationModal,
    setUploadJobApplicationModal: modals.setUploadJobApplicationModal,
    uploadOrderModal: modals.uploadOrderModal,
    setUploadOrderModal: modals.setUploadOrderModal,
    prompt: modals.prompt,
    setPrompt: modals.setPrompt,
    handleDownload: downloads.handleDownload,
    handleSubmitForSigning: mutations.handleSubmitForSigning,
    handlePreview: downloads.handlePreview,
    handleUploadJobApplication: mutations.handleUploadJobApplication,
    handlePreviewJobApplication: downloads.handlePreviewJobApplication,
    handleReviewJobApplication: mutations.handleReviewJobApplication,
    handleUploadOrder: mutations.handleUploadOrder,
    handlePreviewOrder: downloads.handlePreviewOrder,
    handleCreateOrder: mutations.handleCreateOrder,
    handleCompleteHiring: mutations.handleCompleteHiring,
    handleDownloadContractPdf: downloads.handleDownloadContractPdf,
    handleDownloadContractDocx: downloads.handleDownloadContractDocx,
    handleAction,
  };
}

