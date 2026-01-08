import { useState } from "react";
import type { PayrollEntry } from "../types";

export interface PromptState {
  title: string;
  text: string;
  variant?: "success" | "error" | "warning";
}

export function usePayrollModals() {
  const [generateModal, setGenerateModal] = useState<boolean>(false);
  const [confirmApprove, setConfirmApprove] = useState<number | null>(null);
  const [confirmMarkPaid, setConfirmMarkPaid] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmRecalculate, setConfirmRecalculate] = useState<number | null>(null);
  const [entryDetailModal, setEntryDetailModal] = useState<PayrollEntry | null>(null);
  const [prompt, setPrompt] = useState<PromptState | null>(null);

  return {
    generateModal,
    setGenerateModal,
    confirmApprove,
    setConfirmApprove,
    confirmMarkPaid,
    setConfirmMarkPaid,
    confirmDelete,
    setConfirmDelete,
    confirmRecalculate,
    setConfirmRecalculate,
    entryDetailModal,
    setEntryDetailModal,
    prompt,
    setPrompt,
  };
}

