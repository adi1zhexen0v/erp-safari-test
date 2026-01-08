import { useState } from "react";

export interface PromptState {
  title: string;
  text: string;
  variant?: "success" | "error" | "warning";
}

export function useTimesheetModals() {
  const [generateModal, setGenerateModal] = useState<boolean>(false);
  const [detailModal, setDetailModal] = useState<number | null>(null);
  const [prompt, setPrompt] = useState<PromptState | null>(null);

  return {
    generateModal,
    setGenerateModal,
    detailModal,
    setDetailModal,
    prompt,
    setPrompt,
  };
}

