import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalWrapper, Button, Prompt } from "@/shared/ui";
import { FileUploader } from "@/shared/components";
import {
  useUploadAnnualApplicationMutation,
  useUploadUnpaidApplicationMutation,
  useUploadMedicalApplicationMutation,
} from "../api";
import type { LeaveType } from "../types";

interface Props {
  leaveId: number;
  leaveType: LeaveType;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadApplicationModal({ leaveId, leaveType, onClose, onSuccess }: Props) {
  const { t } = useTranslation("LeaveApplicationsPage");
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<{ title: string; text: string; variant: "success" | "error" } | null>(null);

  const [uploadAnnual, { isLoading: isUploadingAnnual }] = useUploadAnnualApplicationMutation();
  const [uploadUnpaid, { isLoading: isUploadingUnpaid }] = useUploadUnpaidApplicationMutation();
  const [uploadMedical, { isLoading: isUploadingMedical }] = useUploadMedicalApplicationMutation();

  const isUploading = isUploadingAnnual || isUploadingUnpaid || isUploadingMedical;

  async function handleUpload() {
    if (!file) return;

    try {
      if (leaveType === "annual") {
        await uploadAnnual({ id: leaveId, file }).unwrap();
      } else if (leaveType === "unpaid") {
        await uploadUnpaid({ id: leaveId, file }).unwrap();
      } else {
        await uploadMedical({ id: leaveId, file }).unwrap();
      }
      onSuccess();
    } catch {
      setPrompt({
        title: t("messages.errorTitle") || "Ошибка",
        text: t("messages.uploadError") || "Не удалось загрузить заявление",
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
              {t("actions.uploadApplication") || "Загрузка заявления"}
            </h4>
          </div>

          <div>
            <FileUploader
              accept=".pdf"
              maxSizeMB={10}
              value={file}
              onChange={setFile}
              namespace="LeaveApplicationsPage"
              label={t("actions.selectPdf") || "Выберите PDF файл"}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="md" onClick={onClose} disabled={isUploading}>
                {t("buttons.cancel") || "Отмена"}
              </Button>
              <Button variant="primary" size="md" onClick={handleUpload} disabled={!file || isUploading}>
                {isUploading ? t("actions.uploading") || "Загрузка..." : t("actions.upload") || "Загрузить"}
              </Button>
            </div>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

