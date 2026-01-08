import { useState } from "react";
import { useTranslation } from "react-i18next";
import { downloadBlob } from "@/shared/utils";
import {
  useLazyGetContractDetailQuery,
  useDownloadWorkContractPreviewMutation,
  usePreviewJobApplicationMutation,
  usePreviewOrderOnHiringMutation,
} from "@/features/hr/contracts/api";
import type { ListContractsResponse } from "@/features/hr/contracts/types";
import { extractErrorMessage } from "@/features/hr/contracts/utils";
import type { PromptState } from "./useContractModals";

export interface UseContractDownloadsReturn {
  fetchContractDetail: ReturnType<typeof useLazyGetContractDetailQuery>[0];
  downloadingContractId: number | null;
  previewingContractId: number | null;
  previewingJobApplicationCandidateId: number | null;
  previewingOrderCandidateId: number | null;
  isDownloading: boolean;
  isPreviewing: boolean;
  handleDownload: (id: number, contract?: ListContractsResponse) => Promise<void>;
  handlePreview: (id: number) => Promise<void>;
  handlePreviewJobApplication: (candidateId: number) => Promise<void>;
  handlePreviewOrder: (candidateId: number) => Promise<void>;
  handleDownloadContractPdf: (id: number, contract?: ListContractsResponse) => Promise<void>;
  handleDownloadContractDocx: (id: number) => Promise<void>;
  setPrompt: (state: PromptState | null) => void;
}

export function useContractDownloads(setPrompt: (state: PromptState | null) => void): UseContractDownloadsReturn {
  const { t } = useTranslation("ContractsPage");

  const [fetchContractDetail] = useLazyGetContractDetailQuery();
  const [downloadWorkContractPreview] = useDownloadWorkContractPreviewMutation();
  const [previewJobApplication] = usePreviewJobApplicationMutation();
  const [previewOrderOnHiring] = usePreviewOrderOnHiringMutation();

  const [downloadingContractId, setDownloadingContractId] = useState<number | null>(null);
  const [previewingContractId, setPreviewingContractId] = useState<number | null>(null);
  const [previewingJobApplicationCandidateId, setPreviewingJobApplicationCandidateId] = useState<number | null>(null);
  const [previewingOrderCandidateId, setPreviewingOrderCandidateId] = useState<number | null>(null);

  const isDownloading = downloadingContractId !== null;
  const isPreviewing = previewingContractId !== null;

  async function handleDownload(id: number, contract?: ListContractsResponse) {
    try {
      setDownloadingContractId(id);

      if (contract?.trustme_document?.signed_pdf_url) {
        window.open(contract.trustme_document.signed_pdf_url, "_blank");
        return;
      }

      const data = await fetchContractDetail(id).unwrap();
      const pdfUrl = data.trustme_document?.signed_pdf_url;
      if (!pdfUrl) {
        setPrompt({
          title: t("messages.errorTitle"),
          text: t("messages.fileNotAvailable"),
          variant: "error",
        });
        return;
      }

      window.open(pdfUrl, "_blank");
    } catch (error: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(error, "messages.downloadErrorText", t),
        variant: "error",
      });
    } finally {
      setDownloadingContractId(null);
    }
  }

  async function handlePreview(id: number) {
    try {
      setPreviewingContractId(id);
      const blob = await downloadWorkContractPreview(id).unwrap();
      downloadBlob(blob, `Трудовой договор №${id}.docx`);
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.previewErrorText", t),
        variant: "error",
      });
    } finally {
      setPreviewingContractId(null);
    }
  }

  async function handlePreviewJobApplication(candidateId: number) {
    try {
      setPreviewingJobApplicationCandidateId(candidateId);
      const blob = await previewJobApplication(candidateId).unwrap();
      downloadBlob(blob, `Заявление на прием на работу №${candidateId}.docx`);
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.previewErrorText", t),
        variant: "error",
      });
    } finally {
      setPreviewingJobApplicationCandidateId(null);
    }
  }

  async function handlePreviewOrder(candidateId: number) {
    try {
      setPreviewingOrderCandidateId(candidateId);
      const blob = await previewOrderOnHiring(candidateId).unwrap();
      downloadBlob(blob, `Приказ о приеме №${candidateId}.docx`);
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.previewErrorText", t),
        variant: "error",
      });
    } finally {
      setPreviewingOrderCandidateId(null);
    }
  }

  async function handleDownloadContractPdf(id: number, contract?: ListContractsResponse) {
    try {
      setDownloadingContractId(id);

      if (contract?.trustme_document?.signed_pdf_url) {
        window.open(contract.trustme_document.signed_pdf_url, "_blank");
        return;
      }

      const data = await fetchContractDetail(id).unwrap();
      const pdfUrl = data.trustme_document?.signed_pdf_url;
      if (!pdfUrl) {
        setPrompt({
          title: t("messages.errorTitle"),
          text: t("messages.fileNotAvailable"),
          variant: "error",
        });
        return;
      }

      window.open(pdfUrl, "_blank");
    } catch (error: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(error, "messages.downloadErrorText", t),
        variant: "error",
      });
    } finally {
      setDownloadingContractId(null);
    }
  }

  async function handleDownloadContractDocx(id: number) {
    try {
      setPreviewingContractId(id);
      const blob = await downloadWorkContractPreview(id).unwrap();
      downloadBlob(blob, `Трудовой договор №${id}.docx`);
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.previewErrorText", t),
        variant: "error",
      });
    } finally {
      setPreviewingContractId(null);
    }
  }

  return {
    fetchContractDetail,
    downloadingContractId,
    previewingContractId,
    previewingJobApplicationCandidateId,
    previewingOrderCandidateId,
    isDownloading,
    isPreviewing,
    handleDownload,
    handlePreview,
    handlePreviewJobApplication,
    handlePreviewOrder,
    handleDownloadContractPdf,
    handleDownloadContractDocx,
    setPrompt,
  };
}

