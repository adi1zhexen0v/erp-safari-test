import type { HiringAction } from "@/features/hr/hiring";
import type { UseHiringMutationsReturn } from "./useHiringMutations";
import type { UseHiringModalsReturn } from "./useHiringModals";

export interface UseHiringActionsReturn {
  mutations: UseHiringMutationsReturn;
  modals: UseHiringModalsReturn;
  handleAction: (action: HiringAction, applicationId: number, onClose?: () => void) => void;
}

export function useHiringActions(
  mutations: UseHiringMutationsReturn,
  modals: UseHiringModalsReturn,
): UseHiringActionsReturn {
  function handleAction(action: HiringAction, applicationId: number, onClose?: () => void) {
    switch (action) {
      case "approve":
        mutations.handleApprove(applicationId, onClose);
        break;
      case "request_revision":
        if (onClose) {
          onClose();
        }
        modals.setRevisionModal({ id: applicationId, notes: "" });
        break;
      case "reject":
        if (onClose) {
          onClose();
        }
        modals.setRejectModal({ id: applicationId, reason: "" });
        break;
      case "create_contract":
        mutations.handleCreateContract(applicationId);
        break;
      case "view_details":
        break;
    }
  }

  return {
    mutations,
    modals,
    handleAction,
  };
}
