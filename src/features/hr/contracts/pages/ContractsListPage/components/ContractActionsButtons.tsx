import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown2, Import } from "iconsax-react";
import { Button, Dropdown, DropdownItem } from "@/shared/ui";
import type { ListContractsResponse } from "@/features/hr/contracts/types";
import { type ContractAction, getAvailableActions } from "@/features/hr/contracts/hooks";

interface Props {
  contract: ListContractsResponse;
  isLoading: {
    isDownloading: boolean;
    isSubmitting: boolean;
    isPreviewing: boolean;
  };
  downloadingContractId: number | null;
  previewingContractId: number | null;
  submittingContractId: number | null;
  previewingJobApplicationCandidateId: number | null;
  reviewingJobApplicationCandidateId: number | null;
  previewingOrderCandidateId: number | null;
  completingHiringCandidateId: number | null;
  onAction: (action: ContractAction, contractId: number, contract?: ListContractsResponse) => Promise<void>;
}

export default function ContractActionsButtons({
  contract,
  isLoading,
  downloadingContractId,
  previewingContractId,
  submittingContractId,
  previewingJobApplicationCandidateId,
  reviewingJobApplicationCandidateId,
  previewingOrderCandidateId,
  completingHiringCandidateId,
  onAction,
}: Props) {
  const { t } = useTranslation("ContractsPage");
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);

  const isThisContractDownloading = downloadingContractId === contract.id;
  const isThisContractPreviewing = previewingContractId === contract.id;
  const isThisContractSubmitting = submittingContractId === contract.id;
  const isThisCandidatePreviewing = previewingJobApplicationCandidateId === contract.candidate_application_id;
  const isThisCandidateReviewing = reviewingJobApplicationCandidateId === contract.candidate_application_id;
  const isThisOrderPreviewing = previewingOrderCandidateId === contract.candidate_application_id;
  const isThisOrderCompleting = completingHiringCandidateId === contract.candidate_application_id;

  const { actions } = getAvailableActions(
    contract,
    isLoading.isDownloading ||
      isLoading.isSubmitting ||
      isThisContractPreviewing ||
      isThisContractSubmitting ||
      isThisCandidatePreviewing ||
      isThisCandidateReviewing ||
      isThisOrderPreviewing ||
      isThisOrderCompleting,
    t,
  );

  function getActionLoadingState(actionId: ContractAction): { isDisabled: boolean; loadingText: string } {
    const actionLoadingConfig: Record<ContractAction, { getIsLoading: () => boolean; getLoadingText: () => string }> = {
      download: {
        getIsLoading: () => isThisContractDownloading,
        getLoadingText: () => t("actions.downloading"),
      },
      submit_for_signing: {
        getIsLoading: () => isThisContractSubmitting,
        getLoadingText: () => t("actions.submitting"),
      },
      preview: {
        getIsLoading: () => isThisContractPreviewing,
        getLoadingText: () => t("actions.downloading"),
      },
      upload_job_application: {
        getIsLoading: () => false,
        getLoadingText: () => "",
      },
      preview_job_application: {
        getIsLoading: () => isThisCandidatePreviewing,
        getLoadingText: () => t("actions.downloading"),
      },
      review_job_application: {
        getIsLoading: () => isThisCandidateReviewing,
        getLoadingText: () => t("jobApplication.actions.reviewing"),
      },
      review_job_application_revision: {
        getIsLoading: () => isThisCandidateReviewing,
        getLoadingText: () => t("jobApplication.actions.reviewing"),
      },
      review_job_application_reject: {
        getIsLoading: () => isThisCandidateReviewing,
        getLoadingText: () => t("jobApplication.actions.reviewing"),
      },
      create_order: {
        getIsLoading: () => isThisCandidateReviewing,
        getLoadingText: () => t("order.actions.creating"),
      },
      upload_order: {
        getIsLoading: () => false,
        getLoadingText: () => "",
      },
      preview_order: {
        getIsLoading: () => isThisOrderPreviewing,
        getLoadingText: () => t("actions.downloading"),
      },
      complete_hiring: {
        getIsLoading: () => isThisOrderCompleting,
        getLoadingText: () => t("order.actions.completing"),
      },
      download_contract: {
        getIsLoading: () => false,
        getLoadingText: () => "",
      },
      download_contract_pdf: {
        getIsLoading: () => isThisContractDownloading,
        getLoadingText: () => t("actions.downloading"),
      },
      download_contract_docx: {
        getIsLoading: () => isThisContractPreviewing,
        getLoadingText: () => t("actions.downloading"),
      },
    };

    const config = actionLoadingConfig[actionId];
    const isDisabled = config.getIsLoading();
    const loadingText = isDisabled ? config.getLoadingText() : "";

    return { isDisabled, loadingText };
  }

  return (
    <div className="flex flex-col gap-2 pt-3 border-t surface-base-stroke">
      {actions.map((action) => {
        if (action.id === "download_contract") {
          return (
            <Dropdown
              key={action.id}
              open={isDownloadDropdownOpen}
              onClose={() => setIsDownloadDropdownOpen(false)}
              width="w-full">
              <Button
                variant={action.variant}
                size="md"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDownloadDropdownOpen(!isDownloadDropdownOpen);
                }}>
                <div className="flex justify-between items-center w-full relative">
                  <div></div>
                  <div className="flex items-center gap-2">
                    <Import size={16} color="currentColor" />
                    <span className="flex-1 text-center">{action.label}</span>
                  </div>
                  <ArrowDown2
                    size={16}
                    color="currentColor"
                    className={`transition-transform ${isDownloadDropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </Button>
              <DropdownItem
                className="justify-center"
                onClick={() => {
                  if (!isThisContractPreviewing) {
                    onAction("download_contract_docx", contract.id, contract);
                    setIsDownloadDropdownOpen(false);
                  }
                }}
                disabled={isThisContractPreviewing}>
                {isThisContractPreviewing ? t("actions.downloading") : t("contract.downloadDraft")}
              </DropdownItem>
              <DropdownItem
                className="justify-center"
                onClick={() => {
                  onAction("download_contract_pdf", contract.id, contract);
                  setIsDownloadDropdownOpen(false);
                }}
                disabled={isThisContractDownloading}>
                {isThisContractDownloading ? t("actions.downloading") : t("contract.downloadPdf")}
              </DropdownItem>
            </Dropdown>
          );
        }

        const { isDisabled, loadingText } = getActionLoadingState(action.id);

        return (
          <Button
            key={action.id}
            variant={action.variant}
            size="md"
            disabled={isDisabled}
            className="w-full"
            onClick={async (e) => {
              e.stopPropagation();
              await onAction(action.id, contract.id, contract);
            }}>
            {action.icon}
            {isDisabled && loadingText ? loadingText : action.label}
          </Button>
        );
      })}
    </div>
  );
}

