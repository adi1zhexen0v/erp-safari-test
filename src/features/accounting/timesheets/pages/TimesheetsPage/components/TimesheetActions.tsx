import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye } from "iconsax-react";
import { Button, Dropdown, DropdownItem } from "@/shared/ui";
import { MoreIcon } from "@/shared/assets/icons";
import type { TimesheetResponse } from "../../../types";
import { getTimesheetAvailableActions } from "../../../utils";

interface Props {
  timesheet: TimesheetResponse;
  onOpen: (id: number) => void;
  onApprove: (id: number) => void;
  onDelete: (id: number) => void;
  onDownload: (id: number, year: number, month: number) => void;
  index?: number;
  totalCount?: number;
}

export default function TimesheetActions({
  timesheet,
  onOpen,
  onApprove,
  onDelete,
  onDownload,
  index,
  totalCount,
}: Props) {
  const { t } = useTranslation("TimesheetsPage");
  const [isOpen, setIsOpen] = useState(false);

  const availableActions = getTimesheetAvailableActions(timesheet.status);
  const direction = index !== undefined && totalCount !== undefined && index === totalCount - 1 ? "top" : "bottom";

  function handleOpenClick(e: React.MouseEvent) {
    e.stopPropagation();
    onOpen(timesheet.id);
  }

  function handleDropdownToggle(e: React.MouseEvent) {
    e.stopPropagation();
    setIsOpen(!isOpen);
  }

  function handleApprove() {
    onApprove(timesheet.id);
  }

  function handleDelete() {
    onDelete(timesheet.id);
  }

  function handleDownload() {
    onDownload(timesheet.id, timesheet.year, timesheet.month);
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" isIconButton onClick={handleOpenClick} className="w-8! radius-xs! p-0!">
        <Eye size={16} color="currentColor" />
      </Button>
      <Dropdown open={isOpen} onClose={() => setIsOpen(false)} direction={direction}>
        <Button variant="secondary" isIconButton onClick={handleDropdownToggle} className="w-8! radius-xs! p-0!">
          <MoreIcon />
        </Button>
        {availableActions.includes("approve") && (
          <DropdownItem onClick={handleApprove}>{t("actions.approve")}</DropdownItem>
        )}
        {availableActions.includes("delete") && (
          <DropdownItem onClick={handleDelete} className="text-negative-500">
            {t("actions.delete")}
          </DropdownItem>
        )}
        {availableActions.includes("download") && (
          <DropdownItem onClick={handleDownload}>{t("actions.download")}</DropdownItem>
        )}
      </Dropdown>
    </div>
  );
}
