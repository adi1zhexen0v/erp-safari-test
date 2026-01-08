import { useState } from "react";

export interface PromptState {
  title: string;
  text: string;
  variant?: "success" | "error" | "warning";
}

export interface RejectModalState {
  id: number;
  reason: string;
}

export interface CreateModalState {
  parentContractId: number;
}

export interface DetailModalState {
  id: number;
}

export function useCompletionActModals() {
  const [createModal, setCreateModal] = useState<CreateModalState | null>(null);
  const [detailModal, setDetailModal] = useState<DetailModalState | null>(null);
  const [rejectModal, setRejectModal] = useState<RejectModalState | null>(null);
  const [prompt, setPrompt] = useState<PromptState | null>(null);

  function openCreateModal(parentContractId: number) {
    setCreateModal({ parentContractId });
  }

  function closeCreateModal() {
    setCreateModal(null);
  }

  function openDetailModal(id: number) {
    setDetailModal({ id });
  }

  function closeDetailModal() {
    setDetailModal(null);
  }

  function openRejectModal(id: number) {
    setRejectModal({ id, reason: "" });
  }

  function closeRejectModal() {
    setRejectModal(null);
  }

  function updateRejectReason(reason: string) {
    if (rejectModal) {
      setRejectModal({ ...rejectModal, reason });
    }
  }

  return {
    createModal,
    setCreateModal,
    openCreateModal,
    closeCreateModal,
    detailModal,
    setDetailModal,
    openDetailModal,
    closeDetailModal,
    rejectModal,
    setRejectModal,
    openRejectModal,
    closeRejectModal,
    updateRejectReason,
    prompt,
    setPrompt,
  };
}

export type UseCompletionActModalsReturn = ReturnType<typeof useCompletionActModals>;

