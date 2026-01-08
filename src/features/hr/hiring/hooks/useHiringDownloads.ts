import { useState } from "react";
import { useTranslation } from "react-i18next";
import { downloadBlob } from "@/shared/utils";
import { useHiringDownloadApplicationProfilePreviewMutation } from "@/features/hr/hiring";
import type { PromptState } from "./useHiringModals";

export interface UseHiringDownloadsReturn {
  downloadingId: number | null;
  isDownloading: boolean;
  handleDownloadProfile: (id: number) => Promise<void>;
  setPrompt: (state: PromptState | null) => void;
}

export function useHiringDownloads(setPrompt: (state: PromptState | null) => void): UseHiringDownloadsReturn {
  const { t } = useTranslation("HiringPage");

  const [downloadProfile] = useHiringDownloadApplicationProfilePreviewMutation();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const isDownloading = downloadingId !== null;

  async function handleDownloadProfile(id: number) {
    setDownloadingId(id);
    try {
      const blob = await downloadProfile(id).unwrap();
      downloadBlob(blob, `Личный листок заявки ${id}.docx`);
      setDownloadingId(null);
    } catch (err: unknown) {
      setDownloadingId(null);
      const errorMessage =
        (err as { data?: { error?: string; message?: string } })?.data?.error ||
        (err as { data?: { error?: string; message?: string } })?.data?.message ||
        t("messages.downloadFailed");
      setPrompt({
        title: t("messages.errorTitle"),
        text: errorMessage,
        variant: "error",
      });
    }
  }

  return {
    downloadingId,
    isDownloading,
    handleDownloadProfile,
    setPrompt,
  };
}

