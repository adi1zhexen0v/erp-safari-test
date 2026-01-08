import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalWrapper, Button, Input } from "@/shared/ui";

interface Props {
  action: "revision" | "reject";
  onClose: () => void;
  onSubmit: (note: string) => void;
  isSubmitting: boolean;
  namespace?: string;
  translationPrefix?: string;
}

export default function ReviewNoteModal({
  action,
  onClose,
  onSubmit,
  isSubmitting,
  namespace = "ContractsPage",
  translationPrefix = "review",
}: Props) {
  const { t } = useTranslation(namespace);
  const [note, setNote] = useState("");

  function handleSubmit() {
    onSubmit(note);
  }

  function handleNoteChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNote(e.target.value);
  }

  const title =
    action === "revision"
      ? t(`${translationPrefix}.revisionTitle`) || "Отправить на доработку"
      : t(`${translationPrefix}.rejectTitle`) || "Отклонить заявление";

  const placeholder =
    action === "revision"
      ? t(`${translationPrefix}.revisionNotePlaceholder`) || "Комментарий (необязательно)"
      : t(`${translationPrefix}.rejectNotePlaceholder`) || "Причина отклонения (необязательно)";

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h4 className="text-display-2xs content-base-primary">{title}</h4>
        </div>

        <div>
          <Input isTextarea placeholder={placeholder} value={note} onChange={handleNoteChange} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
              {t("buttons.cancel") || "Отмена"}
            </Button>
            <Button
              variant={action === "reject" ? "danger" : "primary"}
              size="md"
              onClick={handleSubmit}
              disabled={isSubmitting}>
              {isSubmitting ? t(`${translationPrefix}.submitting`) || "Отправка..." : t("buttons.submit") || "Отправить"}
            </Button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

