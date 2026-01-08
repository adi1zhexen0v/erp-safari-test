import { useState } from "react";
import { useTranslation } from "react-i18next";
import { extractErrorMessage } from "@/shared/utils";
import {
  useGenerateTimesheetMutation,
  useApproveTimesheetMutation,
  useDeleteTimesheetMutation,
  useUpdateTimesheetEntryMutation,
} from "../api";
import type { GenerateTimesheetDto, UpdateTimesheetEntryDto } from "../types";
import type { PromptState } from "./useTimesheetModals";

export interface UseTimesheetMutationsReturn {
  generating: boolean;
  approvingTimesheetId: number | null;
  deletingTimesheetId: number | null;
  updatingEntryId: number | null;
  isApproving: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  handleGenerate: (dto: GenerateTimesheetDto) => Promise<void>;
  handleApprove: (id: number) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  handleUpdateEntry: (id: number, dto: UpdateTimesheetEntryDto) => Promise<void>;
  handleBatchUpdateEntries: (
    updates: Array<{ id: number; dto: UpdateTimesheetEntryDto }>,
  ) => Promise<void>;
  setPrompt: (state: PromptState | null) => void;
}

export function useTimesheetMutations(setPrompt: (state: PromptState | null) => void): UseTimesheetMutationsReturn {
  const { t } = useTranslation("TimesheetsPage");

  const [generateTimesheet] = useGenerateTimesheetMutation();
  const [approveTimesheet] = useApproveTimesheetMutation();
  const [deleteTimesheet] = useDeleteTimesheetMutation();
  const [updateTimesheetEntry] = useUpdateTimesheetEntryMutation();

  const [generating, setGenerating] = useState(false);
  const [approvingTimesheetId, setApprovingTimesheetId] = useState<number | null>(null);
  const [deletingTimesheetId, setDeletingTimesheetId] = useState<number | null>(null);
  const [updatingEntryId, setUpdatingEntryId] = useState<number | null>(null);

  const isApproving = approvingTimesheetId !== null;
  const isDeleting = deletingTimesheetId !== null;
  const isUpdating = updatingEntryId !== null;

  async function handleGenerate(dto: GenerateTimesheetDto) {
    try {
      setGenerating(true);
      await generateTimesheet(dto).unwrap();
      setPrompt({
        title: t("messages.generateSuccessTitle"),
        text: t("messages.generateSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.generateErrorText", t),
        variant: "error",
      });
    } finally {
      setGenerating(false);
    }
  }

  async function handleApprove(id: number) {
    try {
      setApprovingTimesheetId(id);
      await approveTimesheet(id).unwrap();
      setPrompt({
        title: t("messages.approveSuccessTitle"),
        text: t("messages.approveSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.approveErrorText", t),
        variant: "error",
      });
    } finally {
      setApprovingTimesheetId(null);
    }
  }

  async function handleDelete(id: number) {
    try {
      setDeletingTimesheetId(id);
      await deleteTimesheet(id).unwrap();
      setPrompt({
        title: t("messages.deleteSuccessTitle"),
        text: t("messages.deleteSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.deleteErrorText", t),
        variant: "error",
      });
    } finally {
      setDeletingTimesheetId(null);
    }
  }

  async function handleUpdateEntry(id: number, dto: UpdateTimesheetEntryDto) {
    try {
      setUpdatingEntryId(id);
      await updateTimesheetEntry({ id, body: dto }).unwrap();
      setPrompt({
        title: t("messages.updateSuccessTitle"),
        text: t("messages.updateSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.updateErrorText", t),
        variant: "error",
      });
    } finally {
      setUpdatingEntryId(null);
    }
  }

  async function handleBatchUpdateEntries(
    updates: Array<{ id: number; dto: UpdateTimesheetEntryDto }>,
  ): Promise<void> {
    if (updates.length === 0) return;

    try {
      setUpdatingEntryId(updates[0].id);
      
      const results = await Promise.allSettled(
        updates.map(({ id, dto }) => updateTimesheetEntry({ id, body: dto }).unwrap()),
      );

      const errors: Array<{ id: number; error: string }> = [];
      let successCount = 0;

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const entryId = updates[index].id;
          const errorMessage = extractErrorMessage(result.reason, "messages.updateErrorText", t);
          errors.push({ id: entryId, error: errorMessage });
        } else {
          successCount++;
        }
      });

      if (errors.length === 0) {
        setPrompt({
          title: t("messages.batchUpdateSuccessTitle"),
          text: t("messages.batchUpdateSuccessText", { count: successCount }),
          variant: "success",
        });
      } else if (successCount > 0) {
        const errorMessages = errors.map((e) => `Entry ${e.id}: ${e.error}`).join("\n");
        setPrompt({
          title: t("messages.batchUpdatePartialTitle"),
          text: `${t("messages.batchUpdatePartialText", { success: successCount, failed: errors.length })}\n${errorMessages}`,
          variant: "error",
        });
      } else {
        const errorMessages = errors.map((e) => `Entry ${e.id}: ${e.error}`).join("\n");
        setPrompt({
          title: t("messages.errorTitle"),
          text: `${t("messages.batchUpdateErrorText")}\n${errorMessages}`,
          variant: "error",
        });
      }
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.batchUpdateErrorText", t),
        variant: "error",
      });
    } finally {
      setUpdatingEntryId(null);
    }
  }

  return {
    generating,
    approvingTimesheetId,
    deletingTimesheetId,
    updatingEntryId,
    isApproving,
    isDeleting,
    isUpdating,
    handleGenerate,
    handleApprove,
    handleDelete,
    handleUpdateEntry,
    handleBatchUpdateEntries,
    setPrompt,
  };
}

