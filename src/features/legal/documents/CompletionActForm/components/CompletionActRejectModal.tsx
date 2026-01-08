import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CloseCircle } from "iconsax-react";
import { ModalWrapper, Button, Input } from "@/shared/ui";

interface Props {
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  isLoading?: boolean;
}

export default function CompletionActRejectModal({ onClose, onConfirm, isLoading }: Props) {
  const { t } = useTranslation("LegalApplicationsPage");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (reason.trim().length < 10) {
      setError(t("completionAct.validation.reasonMinLength"));
      return;
    }
    setError(null);
    await onConfirm(reason);
  }

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <CloseCircle size={20} className="text-red-600" />
          </div>
          <h3 className="text-heading-lg content-base-primary">{t("completionAct.rejectTitle")}</h3>
        </div>

        <p className="text-body-regular-md content-base-secondary">{t("completionAct.rejectDescription")}</p>

        <Input
          label={t("completionAct.fields.rejectionReason")}
          placeholder={t("completionAct.fields.rejectionReasonPlaceholder")}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error && e.target.value.trim().length >= 10) {
              setError(null);
            }
          }}
          error={error || undefined}
          isTextarea
        />

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" size="lg" className="flex-1" onClick={onClose} disabled={isLoading}>
            {t("modals.cancel")}
          </Button>
          <Button
            variant="danger"
            size="lg"
            className="flex-1"
            onClick={handleConfirm}
            disabled={isLoading || reason.trim().length < 10}>
            {isLoading ? t("completionAct.actions.rejecting") : t("completionAct.actions.reject")}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
