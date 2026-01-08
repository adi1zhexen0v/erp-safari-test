import type { JobApplicationStage } from "@/features/hr/contracts/types";

export interface JobApplicationActionsConfig {
  showDownloadButton: boolean;
  showUploadButton: boolean;
  showReviewButtons: boolean;
}

export function getJobApplicationActions(stage: JobApplicationStage): JobApplicationActionsConfig {
  if (stage === "contract_signed" || stage === "job_app_pending") {
    return {
      showDownloadButton: true,
      showUploadButton: true,
      showReviewButtons: false,
    };
  }

  if (stage === "job_app_review") {
    return {
      showDownloadButton: false,
      showUploadButton: false,
      showReviewButtons: true,
    };
  }

  return {
    showDownloadButton: false,
    showUploadButton: false,
    showReviewButtons: false,
  };
}

