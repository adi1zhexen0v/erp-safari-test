import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalWrapper, Button, Prompt } from "@/shared/ui";
import { FileUploader } from "@/shared/components";
import { useUploadTerminationOrderMutation } from "../api";

interface Props {
  resignationId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadOrderModal({ resignationId, onClose, onSuccess }: Props) {
  const { t } = useTranslation("ContractsPage");
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<{ title: string; text: string; variant: "success" | "error" } | null>(null);

  const [uploadOrder, { isLoading: isUploading }] = useUploadTerminationOrderMutation();

  async function handleUpload() {
    if (!file) return;

    try {
      await uploadOrder({ id: resignationId, file }).unwrap();
      onSuccess();
    } catch {
      setPrompt({
        title: t("messages.errorTitle") || "Ошибка",
        text: t("resignationLetter.messages.uploadOrderError") || "Не удалось загрузить приказ",
        variant: "error",
      });
    }
  }

  function handlePromptClose() {
    setPrompt(null);
  }

  return (
    <>
      {prompt && (
        <Prompt title={prompt.title} text={prompt.text} variant={prompt.variant} onClose={handlePromptClose} />
      )}

      <ModalWrapper onClose={onClose}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 border-b surface-base-stroke pb-3">
            <h4 className="text-display-2xs content-base-primary">
              {t("resignationLetter.actions.uploadOrderScan") || "Загрузка приказа об увольнении"}
            </h4>
          </div>

          <div>
            <FileUploader
              accept=".pdf"
              maxSizeMB={10}
              value={file}
              onChange={setFile}
              namespace="ContractsPage"
              label={t("resignationLetter.actions.selectPdf") || "Выберите PDF файл"}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="md" onClick={onClose} disabled={isUploading}>
                {t("modals.close") || "Отмена"}
              </Button>
              <Button variant="primary" size="md" onClick={handleUpload} disabled={!file || isUploading}>
                {isUploading
                  ? t("resignationLetter.actions.uploading") || "Загрузка..."
                  : t("resignationLetter.actions.upload") || "Загрузить"}
              </Button>
            </div>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

