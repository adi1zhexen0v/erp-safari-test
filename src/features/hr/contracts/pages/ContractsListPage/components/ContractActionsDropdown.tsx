import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ListContractsResponse } from "@/features/hr/contracts/types";
import { MoreIcon } from "@/shared/assets/icons";
import { Button, Dropdown, DropdownItem } from "@/shared/ui";
import { type ContractAction, getAvailableActions } from "@/features/hr/contracts/hooks";

interface Props {
  contract: ListContractsResponse;
  isLoading: boolean;
  submittingContractId?: number | null;
  downloadingContractId?: number | null;
  previewingContractId?: number | null;
  onAction: (action: ContractAction, contractId: number, contract?: ListContractsResponse) => void;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  direction?: "top" | "bottom";
}

export default function ContractActionsDropdown({
  contract,
  isLoading,
  submittingContractId,
  downloadingContractId,
  previewingContractId,
  onAction,
  isOpen: controlledOpen,
  onToggle,
  direction = "bottom",
}: Props) {
  const { t } = useTranslation("ContractsPage");
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onToggle || setInternalOpen;

  const isThisContractSubmitting = submittingContractId === contract.id;
  const isThisContractDownloading = downloadingContractId === contract.id;
  const isThisContractPreviewing = previewingContractId === contract.id;
  const { actions } = getAvailableActions(contract, isLoading || isThisContractSubmitting, t);
  const finalActions = actions;

  function handleActionClick(action: ContractAction) {
    onAction(action, contract.id, contract);
    setIsOpen(false);
  }

  return (
    <Dropdown open={isOpen && !isLoading} onClose={() => setIsOpen(false)} direction={direction}>
      <Button
        variant="secondary"
        isIconButton
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        disabled={isLoading}
        className="w-8! radius-xs! p-0!">
        <MoreIcon />
      </Button>

      {finalActions.map((action) => {
        if (action.id === "download_contract") {
          return (
            <React.Fragment key={action.id}>
              <DropdownItem
                onClick={() => {
                  if (!isThisContractDownloading) {
                    handleActionClick("download_contract_pdf");
                  }
                }}
                disabled={isThisContractDownloading}>
                {isThisContractDownloading ? t("actions.downloading") : t("contract.downloadPdf")}
              </DropdownItem>
              {contract.worker === null && (
                <DropdownItem
                  onClick={() => {
                    if (!isThisContractPreviewing) {
                      handleActionClick("download_contract_docx");
                    }
                  }}
                  disabled={isThisContractPreviewing}>
                  {isThisContractPreviewing ? t("actions.downloading") : t("contract.downloadDraft")}
                </DropdownItem>
              )}
            </React.Fragment>
          );
        }

        return (
          <DropdownItem key={action.id} onClick={() => handleActionClick(action.id)}>
            {action.label}
          </DropdownItem>
        );
      })}
    </Dropdown>
  );
}

