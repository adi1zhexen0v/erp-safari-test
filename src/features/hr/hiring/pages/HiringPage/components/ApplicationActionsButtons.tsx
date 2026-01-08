import { useTranslation } from "react-i18next";
import { Import } from "iconsax-react";
import { type GetApplicationsResponse, getAvailableActions, type HiringAction } from "@/features/hr/hiring";
import { Button } from "@/shared/ui";

interface Props {
  application: GetApplicationsResponse;
  isLoading: {
    isReviewing: boolean;
    isRejecting: boolean;
    isCreatingContract: boolean;
  };
  reviewingApplicationId: number | null;
  rejectingApplicationId: number | null;
  onAction: (action: HiringAction, applicationId: number, onClose?: () => void) => void;
  onDownloadProfile?: (id: number) => void;
  isDownloading?: boolean;
}

export default function ApplicationActionsButtons({
  application,
  isLoading,
  reviewingApplicationId,
  rejectingApplicationId,
  onAction,
  onDownloadProfile,
  isDownloading,
}: Props) {
  const { t } = useTranslation("HiringPage");
  const isThisAppReviewing = reviewingApplicationId === application.id;
  const isThisAppRejecting = rejectingApplicationId === application.id;

  const { actions } = getAvailableActions(
    application,
    isThisAppReviewing || isThisAppRejecting || isLoading.isCreatingContract,
    t,
  );
  const buttonActions = actions.filter((action) => action.id !== "view_details");

  const hasButtons = buttonActions.length > 0 || (onDownloadProfile && application.status !== "draft");

  if (!hasButtons) {
    return null;
  }

  function getActionLoadingState(actionId: HiringAction): { isDisabled: boolean; loadingText: string } {
    const actionLoadingConfig: Record<
      HiringAction,
      { getIsLoading: () => boolean; getLoadingText: () => string }
    > = {
      approve: {
        getIsLoading: () => isThisAppReviewing,
        getLoadingText: () => t("actions.approving"),
      },
      request_revision: {
        getIsLoading: () => isThisAppReviewing,
        getLoadingText: () => t("modals.sending"),
      },
      reject: {
        getIsLoading: () => isThisAppRejecting,
        getLoadingText: () => t("actions.rejecting"),
      },
      create_contract: {
        getIsLoading: () => isLoading.isCreatingContract,
        getLoadingText: () => t("actions.creating"),
      },
      view_details: {
        getIsLoading: () => false,
        getLoadingText: () => "",
      },
    };

    const config = actionLoadingConfig[actionId];
    const isDisabled = config.getIsLoading();
    const loadingText = isDisabled ? config.getLoadingText() : "";

    return { isDisabled, loadingText };
  }

  return (
    <div className="flex flex-col gap-2 pt-3 border-t surface-base-stroke">
      {buttonActions.map((action) => {
        const { isDisabled, loadingText } = getActionLoadingState(action.id);

        return (
          <Button
            key={action.id}
            variant={action.variant}
            size="md"
            disabled={isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              onAction(action.id, application.id);
            }}>
            {action.icon}
            {isDisabled && loadingText ? loadingText : action.label}
          </Button>
        );
      })}

      {onDownloadProfile && application.status !== "draft" && (
        <Button
          variant="secondary"
          size="md"
          disabled={isDownloading}
          onClick={(e) => {
            e.stopPropagation();
            onDownloadProfile(application.id);
          }}>
          <Import size={16} color="currentColor" />
          {t("cards.downloadProfile")}
        </Button>
      )}
    </div>
  );
}
