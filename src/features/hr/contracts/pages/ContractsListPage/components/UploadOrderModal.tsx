import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalWrapper, Button } from "@/shared/ui";
import { FileUploader } from "@/shared/components";
import { useUploadOrderOnHiringMutation } from "@/features/hr/contracts/api";
import { extractErrorMessage } from "@/features/hr/contracts/utils";

interface Props {
  candidateId: number;
  onClose: () => void;
  onSuccess?: () => void;
  onPrompt?: (prompt: { title: string; text: string; variant: "success" | "error" }) => void;
}

export default function UploadOrderModal({ candidateId, onClose, onSuccess, onPrompt }: Props) {
  const { t } = useTranslation("ContractsPage");
  const [file, setFile] = useState<File | null>(null);
  const [uploadOrder, { isLoading }] = useUploadOrderOnHiringMutation();

  async function handleUpload() {
    if (!file) return;
    if (!candidateId) {
      onPrompt?.({
        title: t("messages.errorTitle"),
        text: t("order.messages.uploadError"),
        variant: "error",
      });
      return;
    }

    try {
      await uploadOrder({ candidateId, file }).unwrap();
      onPrompt?.({
        title: t("order.messages.uploadSuccess"),
        text: t("order.messages.uploadSuccess"),
        variant: "success",
      });
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error, "order.messages.uploadError", t);
      onPrompt?.({
        title: t("messages.errorTitle"),
        text: errorMessage,
        variant: "error",
      });
      onClose();
    }
  }

  return (
    <>
      <ModalWrapper onClose={onClose}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 border-b surface-base-stroke pb-3">
            <h4 className="text-display-2xs content-base-primary">
              {t("order.actions.uploadScan") || "Загрузка приказа"}
            </h4>
          </div>

          <div>
            <FileUploader
              accept=".pdf"
              maxSizeMB={10}
              value={file}
              onChange={setFile}
              namespace="ContractsPage"
              label={t("order.actions.uploadScan") || "Выберите PDF файл"}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="md" onClick={onClose} disabled={isLoading}>
                {t("modals.close") || "Отмена"}
              </Button>
              <Button variant="primary" size="md" onClick={handleUpload} disabled={!file || isLoading}>
                {isLoading ? t("order.actions.uploading") || "Загрузка..." : t("order.actions.upload") || "Загрузить"}
              </Button>
            </div>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

