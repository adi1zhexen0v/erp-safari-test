import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type GetApplicationsResponse, getAvailableActions, type HiringAction } from "@/features/hr/hiring";
import { MoreIcon } from "@/shared/assets/icons";
import { Button, Dropdown, DropdownItem } from "@/shared/ui";

interface Props {
  application: GetApplicationsResponse;
  isLoading: boolean;
  onAction: (action: HiringAction, applicationId: number, onClose?: () => void) => void;
  onViewDetails?: (applicationId: number) => void;
  onDownloadProfile?: (id: number) => void;
  isDownloading?: boolean;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  direction?: "top" | "bottom";
}

export default function ApplicationActionsDropdown({
  direction = "bottom",
  application,
  isLoading,
  onAction,
  onViewDetails,
  onDownloadProfile,
  isDownloading,
  isOpen: controlledOpen,
  onToggle,
}: Props) {
  const { t } = useTranslation("HiringPage");
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onToggle || setInternalOpen;

  const { actions } = getAvailableActions(application, isLoading, t);

  function handleActionClick(action: HiringAction) {
    if (action === "view_details" && onViewDetails) {
      onViewDetails(application.id);
    } else {
      onAction(action, application.id);
    }
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

      {actions.map((action) => (
        <DropdownItem key={action.id} onClick={() => handleActionClick(action.id)}>
          {action.label}
        </DropdownItem>
      ))}

      {onDownloadProfile && application.status !== "draft" && (
        <DropdownItem
          onClick={() => {
            if (!isDownloading) {
              onDownloadProfile(application.id);
              setIsOpen(false);
            }
          }}
          className={isDownloading ? "opacity-50 cursor-not-allowed" : ""}>
          <div className="flex items-center gap-2">
            <span>{t("cards.downloadProfile")}</span>
          </div>
        </DropdownItem>
      )}
    </Dropdown>
  );
}
