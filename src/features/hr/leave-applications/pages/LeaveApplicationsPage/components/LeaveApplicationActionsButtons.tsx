import { Edit2, Trash } from "iconsax-react";
import { type LeaveApplication, type LeaveAction, canEditLeave } from "@/features/hr/leave-applications";
import { Button } from "@/shared/ui";

interface Props {
  leave: LeaveApplication;
  isLoading: {
    isDeleting: boolean;
  };
  deletingLeaveId: number | null;
  onAction: (action: LeaveAction, leave: LeaveApplication) => void;
  onEdit: (leave: LeaveApplication) => void;
}

export default function LeaveApplicationActionsButtons({ leave, deletingLeaveId, onAction, onEdit }: Props) {
  const isThisLeaveDeleting = deletingLeaveId === leave.id;

  const canEdit = canEditLeave(leave);

  function handleEditClick(e: React.MouseEvent) {
    e.stopPropagation();
    onEdit(leave);
  }

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    onAction("delete", leave);
  }

  return (
    <div className="flex flex-col gap-2">
      {canEdit && (
        <div className="absolute top-5 right-5 flex gap-2 justify-end">
          <Button
            variant="secondary"
            size="md"
            className="w-8! h-8! p-0! rounded-md!"
            isIconButton
            onClick={handleEditClick}>
            <Edit2 size={16} color="currentColor" />
          </Button>
          <Button
            variant="danger"
            size="md"
            className="w-8! h-8! p-0! rounded-md!"
            isIconButton
            disabled={isThisLeaveDeleting}
            onClick={handleDeleteClick}>
            <Trash size={16} color="currentColor" />
          </Button>
        </div>
      )}
    </div>
  );
}

