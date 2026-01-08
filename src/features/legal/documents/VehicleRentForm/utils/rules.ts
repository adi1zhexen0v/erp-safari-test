import type { VehicleRentContract } from "../types";

export interface VehicleRentActionsConfig {
  canPreview: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canSubmitForSigning: boolean;
  canCreateAct: boolean;
  canDownloadPDF: boolean;
  canDownloadDraft: boolean;
}

export function getVehicleRentActions(
  document: VehicleRentContract,
  trustmeStatusDraft: number | null,
  trustmeStatusSigned: number,
): VehicleRentActionsConfig {
  const isDraft = document.trustme_status === trustmeStatusDraft;
  const isSigned = document.trustme_status === trustmeStatusSigned;

  return {
    canPreview: isDraft || isSigned,
    canEdit: isDraft,
    canDelete: isDraft,
    canSubmitForSigning: isDraft,
    canCreateAct: isSigned,
    canDownloadPDF: isSigned && !!document.signed_pdf_url,
    canDownloadDraft: isDraft,
  };
}
