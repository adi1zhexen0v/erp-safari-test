import type { JobApplicationStage } from "@/features/hr/contracts/types";

export interface OrderActionsConfig {
  showDownloadButton: boolean;
  showUploadButton: boolean;
}

export function getOrderActions(stage: JobApplicationStage): OrderActionsConfig {
  if (stage === "order_pending") {
    return {
      showDownloadButton: true,
      showUploadButton: true,
    };
  }

  return {
    showDownloadButton: false,
    showUploadButton: false,
  };
}

