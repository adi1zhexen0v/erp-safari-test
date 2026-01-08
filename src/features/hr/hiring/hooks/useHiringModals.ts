import { useState } from "react";

export interface PromptState {
  title: string;
  text: string;
  variant?: "success" | "error" | "warning";
}

export interface RevisionModalState {
  id: number;
  notes: string;
}

export interface RejectModalState {
  id: number;
  reason: string;
}

export function useHiringModals() {
  const [revisionModal, setRevisionModal] = useState<RevisionModalState | null>(null);
  const [rejectModal, setRejectModal] = useState<RejectModalState | null>(null);
  const [prompt, setPrompt] = useState<PromptState | null>(null);

  return {
    revisionModal,
    setRevisionModal,
    rejectModal,
    setRejectModal,
    prompt,
    setPrompt,
  };
}

export type UseHiringModalsReturn = ReturnType<typeof useHiringModals>;

