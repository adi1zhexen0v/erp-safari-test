import type { CompletionActAction } from "../types";
import type { UseCompletionActMutationsReturn } from "./useCompletionActMutations";
import type { UseCompletionActModalsReturn } from "./useCompletionActModals";

export interface UseCompletionActActionsReturn {
  mutations: UseCompletionActMutationsReturn;
  modals: UseCompletionActModalsReturn;
  handleAction: (action: CompletionActAction, actId: number, onClose?: () => void) => void;
}

export function useCompletionActActions(
  mutations: UseCompletionActMutationsReturn,
  modals: UseCompletionActModalsReturn,
): UseCompletionActActionsReturn {
  function handleAction(action: CompletionActAction, actId: number, onClose?: () => void) {
    switch (action) {
      case "edit":
        modals.openDetailModal(actId);
        break;
      case "submit":
        mutations.handleSubmit(actId, onClose);
        break;
      case "approve":
        mutations.handleApprove(actId, onClose);
        break;
      case "reject":
        if (onClose) {
          onClose();
        }
        modals.openRejectModal(actId);
        break;
      case "delete":
        mutations.handleDelete(actId, onClose);
        break;
      case "view_document":
        modals.openDetailModal(actId);
        break;
      case "upload_document":
        modals.openDetailModal(actId);
        break;
    }
  }

  return {
    mutations,
    modals,
    handleAction,
  };
}

