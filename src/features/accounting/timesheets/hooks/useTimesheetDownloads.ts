import { useState } from "react";
import { useTranslation } from "react-i18next";
import { downloadBlob, extractErrorMessage } from "@/shared/utils";
import { useDownloadTimesheetPreviewMutation } from "../api";
import type { PromptState } from "./useTimesheetModals";

export interface UseTimesheetDownloadsReturn {
  downloadingTimesheetId: number | null;
  isDownloading: boolean;
  handleDownloadDocx: (id: number, year: number, month: number) => Promise<void>;
  setPrompt: (state: PromptState | null) => void;
}

export function useTimesheetDownloads(setPrompt: (state: PromptState | null) => void): UseTimesheetDownloadsReturn {
  const { t } = useTranslation("TimesheetsPage");
  const [downloadTimesheetPreview] = useDownloadTimesheetPreviewMutation();

  const [downloadingTimesheetId, setDownloadingTimesheetId] = useState<number | null>(null);

  const isDownloading = downloadingTimesheetId !== null;

  async function handleDownloadDocx(id: number, year: number, month: number) {
    try {
      setDownloadingTimesheetId(id);
      const blob = await downloadTimesheetPreview(id).unwrap();
      const filename = `timesheet_${year}_${String(month).padStart(2, "0")}.docx`;
      downloadBlob(blob, filename);
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.downloadErrorText", t),
        variant: "error",
      });
    } finally {
      setDownloadingTimesheetId(null);
    }
  }

  return {
    downloadingTimesheetId,
    isDownloading,
    handleDownloadDocx,
    setPrompt,
  };
}

