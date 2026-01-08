import { useTranslation } from "react-i18next";
import { Save2, TickCircle } from "iconsax-react";
import { Button } from "@/shared/ui";

interface Props {
  hasChanges: boolean;
  canEdit: boolean;
  isSaving: boolean;
  isApproving: boolean;
  onSave: () => void;
  onApprove: () => void;
}

export default function TimesheetActions({
  hasChanges,
  canEdit,
  isSaving,
  isApproving,
  onSave,
  onApprove,
}: Props) {
  const { t } = useTranslation("TimesheetsPage");

  return (
    <div className="flex justify-end gap-3 pt-6 mt-6 border-t surface-base-stroke">
      {canEdit && (
        <Button variant="secondary" size="lg" onClick={onSave} disabled={!hasChanges || isSaving}>
          <Save2 size={16} color="currentColor" />
          {isSaving ? t("actions.saving") : t("actions.saveChanges")}
        </Button>
      )}
      {canEdit && (
        <Button variant="primary" size="lg" onClick={onApprove} disabled={isApproving}>
          <TickCircle size={16} color="currentColor" />
          {t("actions.approve")}
        </Button>
      )}
    </div>
  );
}

