import { useTranslation } from "react-i18next";
import { TickCircle, Wallet, Trash, Refresh } from "iconsax-react";
import { Button } from "@/shared/ui";
import type { PayrollStatus } from "../../../types";

interface Props {
  status: PayrollStatus;
  onApprove: () => void;
  onMarkPaid: () => void;
  onDelete: () => void;
  onRecalculate: () => void;
  isApproving: boolean;
  isMarkingPaid: boolean;
  isDeleting: boolean;
  isRecalculating: boolean;
}

export default function PayrollDetailActions({
  status,
  onApprove,
  onMarkPaid,
  onDelete,
  onRecalculate,
  isApproving,
  isMarkingPaid,
  isDeleting,
  isRecalculating,
}: Props) {
  const { t } = useTranslation("PayrollPage");

  const canApprove = status === "calculated";
  const canMarkPaid = status === "approved";
  const canDelete = status === "draft" || status === "calculated";
  const canRecalculate = status === "draft" || status === "calculated";

  const hasActions = canApprove || canMarkPaid || canDelete || canRecalculate;

  if (!hasActions) return null;

  return (
    <div className="flex justify-end gap-3 pt-6 mt-6 border-t surface-base-stroke">
      {canDelete && (
        <Button variant="secondary" size="lg" onClick={onDelete} disabled={isDeleting} className="text-negative-500!">
          <Trash size={16} color="currentColor" />
          {t("actions.delete")}
        </Button>
      )}

      {canRecalculate && (
        <Button variant="secondary" size="lg" onClick={onRecalculate} disabled={isRecalculating}>
          <Refresh size={16} color="currentColor" />
          {t("actions.recalculate")}
        </Button>
      )}

      {canApprove && (
        <Button variant="primary" size="lg" onClick={onApprove} disabled={isApproving}>
          <TickCircle size={16} color="currentColor" />
          {t("actions.approve")}
        </Button>
      )}

      {canMarkPaid && (
        <Button variant="primary" size="lg" onClick={onMarkPaid} disabled={isMarkingPaid}>
          <Wallet size={16} color="currentColor" />
          {t("actions.markPaid")}
        </Button>
      )}
    </div>
  );
}

