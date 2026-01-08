import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useAppSelector } from "@/shared/hooks";
import type { ContractFormValues } from "@/features/hr/contracts/types";

export interface UseLeaveProtectionReturn {
  modalOpen: boolean;
  confirmNavigation: () => void;
  cancelNavigation: () => void;
  requestConfirmation: (action: () => void) => void;
}

export function useLeaveProtection(methods: UseFormReturn<ContractFormValues>): UseLeaveProtectionReturn {
  const { formState } = methods;
  const isReadyForSigning = useAppSelector((state) => state.workContract.isReadyForSigning);

  const [modalOpen, setModalOpen] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const requestConfirmation = useCallback(
    (action: () => void) => {
      if (isReadyForSigning) {
        action();
        return;
      }
      pendingActionRef.current = action;
      setModalOpen(true);
    },
    [isReadyForSigning],
  );

  function confirmNavigation() {
    if (pendingActionRef.current) {
      pendingActionRef.current();
      pendingActionRef.current = null;
    }
    setModalOpen(false);
  }

  function cancelNavigation() {
    pendingActionRef.current = null;
    setModalOpen(false);
  }

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!formState.isDirty || formState.isValid || isReadyForSigning) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);

    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [formState.isDirty, formState.isValid, isReadyForSigning]);

  useEffect(() => {
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;
    window.history.pushState = function (...args) {
      if (formState.isDirty && !formState.isValid && !isReadyForSigning) {
        requestConfirmation(() => {
          originalPush.apply(window.history, args as Parameters<typeof window.history.pushState>);
        });
        return;
      }
      originalPush.apply(window.history, args as Parameters<typeof window.history.pushState>);
    };
    window.history.replaceState = function (...args) {
      if (formState.isDirty && !formState.isValid && !isReadyForSigning) {
        requestConfirmation(() => {
          originalReplace.apply(window.history, args as Parameters<typeof window.history.replaceState>);
        });
        return;
      }
      originalReplace.apply(window.history, args as Parameters<typeof window.history.replaceState>);
    };

    return () => {
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
    };
  }, [formState.isDirty, formState.isValid, isReadyForSigning, requestConfirmation]);

  return {
    modalOpen,
    confirmNavigation,
    cancelNavigation,
    requestConfirmation,
  };
}
