import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye } from "iconsax-react";
import { Button, Dropdown, DropdownItem } from "@/shared/ui";
import MoreIcon from "@/shared/assets/icons/MoreIcon";
import type { PayrollListResponse } from "../../../types";

interface Props {
  payroll: PayrollListResponse;
  onOpen: (id: number) => void;
  onApprove: (id: number) => void;
  onMarkPaid: (id: number) => void;
  onDelete: (id: number) => void;
  onRecalculate: (id: number) => void;
  index?: number;
  totalCount?: number;
  approvingId?: number | null;
  markingPaidId?: number | null;
  deletingId?: number | null;
  recalculatingId?: number | null;
}

export default function PayrollActions({
  payroll,
  onOpen,
  onApprove,
  onMarkPaid,
  onDelete,
  onRecalculate,
  index,
  totalCount,
  approvingId,
  markingPaidId,
  deletingId,
  recalculatingId,
}: Props) {
  const { t } = useTranslation("PayrollPage");
  const [isOpen, setIsOpen] = useState(false);

  const status = payroll.status;
  const direction = index !== undefined && totalCount !== undefined && index === totalCount - 1 ? "top" : "bottom";

  const canApprove = status === "calculated";
  const canMarkPaid = status === "approved";
  const canDelete = status === "draft" || status === "calculated";
  const canRecalculate = status === "draft" || status === "calculated";

  const hasActions = canApprove || canMarkPaid || canDelete || canRecalculate;

  const isApproving = approvingId === payroll.id;
  const isMarkingPaid = markingPaidId === payroll.id;
  const isDeleting = deletingId === payroll.id;
  const isRecalculating = recalculatingId === payroll.id;
  const isAnyLoading = isApproving || isMarkingPaid || isDeleting || isRecalculating;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        isIconButton
        onClick={(e) => {
          e.stopPropagation();
          onOpen(payroll.id);
        }}
        disabled={isAnyLoading}
        className="w-8! radius-xs! p-0!">
        <Eye size={16} color="currentColor" />
      </Button>
      {hasActions && (
        <Dropdown open={isOpen} onClose={() => setIsOpen(false)} direction={direction}>
          <Button
            variant="secondary"
            isIconButton
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            disabled={isAnyLoading}
            className="w-8! radius-xs! p-0!">
            <MoreIcon />
          </Button>

          {canApprove && (
            <DropdownItem onClick={() => onApprove(payroll.id)} disabled={isAnyLoading}>
              {t("actions.approve")}
            </DropdownItem>
          )}

          {canMarkPaid && (
            <DropdownItem onClick={() => onMarkPaid(payroll.id)} disabled={isAnyLoading}>
              {t("actions.markPaid")}
            </DropdownItem>
          )}

          {canRecalculate && (
            <DropdownItem onClick={() => onRecalculate(payroll.id)} disabled={isAnyLoading}>
              {t("actions.recalculate")}
            </DropdownItem>
          )}

          {canDelete && (
            <DropdownItem
              onClick={() => onDelete(payroll.id)}
              disabled={isAnyLoading}
              className="text-negative-500 hover:bg-negative-50 dark:hover:bg-negative-900">
              {t("actions.delete")}
            </DropdownItem>
          )}
        </Dropdown>
      )}
    </div>
  );
}
