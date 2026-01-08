import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye } from "iconsax-react";
import {
  type LeaveApplication,
  LeaveDetailsModal,
  useLeaveApplicationsActions,
  LEAVE_STATUS_MAP,
  LEAVE_TYPE_MAP,
  getStatusText,
  type SortKey,
} from "@/features/hr/leave-applications";
import {
  Badge,
  Checkbox,
  Prompt,
  PromptForm,
  Table,
  Button,
  Dropdown,
  DropdownItem,
  type CheckboxState,
} from "@/shared/ui";
import { formatDateDDMMYYYY, type Locale } from "@/shared/utils";
import { MoreIcon } from "@/shared/assets/icons";

interface SortConfig {
  key: SortKey;
  direction: "asc" | "desc";
}

interface Props {
  leaves: LeaveApplication[];
  rowStates: Record<string, CheckboxState>;
  headerState: CheckboxState;
  onToggleHeader: () => void;
  onToggleRow: (id: number) => void;
  sortConfig: SortConfig | null;
  onSort: (key: SortKey) => void;
  locale: Locale;
  onEdit: (leave: LeaveApplication) => void;
}

export default function LeaveApplicationsTableView({
  leaves,
  rowStates,
  headerState,
  onToggleHeader,
  onToggleRow,
  sortConfig,
  onSort,
  onEdit,
}: Props) {
  const { t } = useTranslation("LeaveApplicationsPage");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);

  const { prompt, setPrompt, handleDelete, handleAction, deletingLeaveId } = useLeaveApplicationsActions();

  async function handleDeleteConfirm() {
    if (prompt && prompt.leaveId) {
      const leave = leaves.find(function (l) {
        return `${l.leave_type}-${l.id}` === prompt.leaveId;
      });
      if (leave) {
        await handleDelete(leave);
      }
    }
  }

  function handleActionWithConfirm(action: string, leave: LeaveApplication) {
    if (action === "delete") {
      setPrompt({
        title: t("messages.deleteConfirmTitle"),
        text: t("messages.deleteConfirmText"),
        variant: "warning",
        leaveId: `${leave.leave_type}-${leave.id}`,
      });
    } else {
      handleAction(action as "edit" | "delete" | "preview", leave);
    }
  }

  function getLeaveTypeBadge(leave: LeaveApplication) {
    const config = LEAVE_TYPE_MAP[leave.leave_type];
    return (
      <Badge
        variant="soft"
        color={config.color}
        text={t("table.leaveTypeLabels." + leave.leave_type)}
        icon={config.icon}
      />
    );
  }

  function getPeriodText(leave: LeaveApplication) {
    const start = formatDateDDMMYYYY(leave.start_date);
    const end = formatDateDDMMYYYY(leave.end_date);
    return `${start} - ${end}`;
  }

  function handlePromptClose() {
    setPrompt(null);
  }

  function handleErrorConfirm() {
    setPrompt(null);
  }

  function handleSelectedLeaveClose() {
    setSelectedLeave(null);
  }

  function handleSortEmployee() {
    onSort("employee");
  }

  function handleSortPeriod() {
    onSort("period");
  }

  function handleSortDuration() {
    onSort("duration");
  }

  function renderTableRow(leave: LeaveApplication, index: number) {
    const leaveKey = `${leave.leave_type}-${leave.id}`;
    const state = rowStates[leaveKey] || "unchecked";
    const isOpen = openDropdownId === leaveKey;

    function handleRowCheckboxChange() {
      onToggleRow(leave.id);
    }

    function handleViewClick(e: React.MouseEvent) {
      e.stopPropagation();
      setSelectedLeave(leave);
    }

    function handleDropdownToggle(e: React.MouseEvent) {
      e.stopPropagation();
      setOpenDropdownId(isOpen ? null : leaveKey);
    }

    function handleDropdownClose() {
      setOpenDropdownId(null);
    }

    function handleEditClick() {
      onEdit(leave);
      setOpenDropdownId(null);
    }

    function handleDeleteClick() {
      handleActionWithConfirm("delete", leave);
      setOpenDropdownId(null);
    }

    return (
      <Table.Row key={leaveKey} selected={state === "checked"}>
        <Table.Cell>
          <Checkbox state={state} onChange={handleRowCheckboxChange} />
        </Table.Cell>

        <Table.Cell isBold>{leave.worker.full_name}</Table.Cell>

        <Table.Cell>{getLeaveTypeBadge(leave)}</Table.Cell>

        <Table.Cell>{getPeriodText(leave)}</Table.Cell>

        <Table.Cell>
          {leave.days_count} {t("cards.days")}
        </Table.Cell>

        <Table.Cell>
          {LEAVE_STATUS_MAP[leave.status] && (
            <Badge
              variant="soft"
              color={LEAVE_STATUS_MAP[leave.status].color}
              text={getStatusText(leave, t)}
              icon={LEAVE_STATUS_MAP[leave.status].icon}
            />
          )}
        </Table.Cell>

        <Table.Cell>
          <div className="flex items-center gap-2">
            <Button variant="secondary" isIconButton onClick={handleViewClick} className="w-8! radius-xs! p-0!">
              <Eye size={16} color="currentColor" />
            </Button>

            {(leave.status === "draft" || leave.status === "app_pending") && (
              <Dropdown
                open={isOpen}
                onClose={handleDropdownClose}
                align="right"
                direction={index === leaves.length - 1 ? "top" : "bottom"}>
                <Button
                  variant="secondary"
                  isIconButton
                  onClick={handleDropdownToggle}
                  className="w-8! radius-xs! p-0!">
                  <MoreIcon />
                </Button>

                <DropdownItem onClick={handleEditClick}>
                  <span>{t("actions.edit")}</span>
                </DropdownItem>

                <DropdownItem onClick={handleDeleteClick} className="text-negative-500">
                  <span>{t("actions.delete")}</span>
                </DropdownItem>
              </Dropdown>
            )}
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }

  return (
    <>
      {prompt && prompt.variant === "warning" && prompt.leaveId ? (
        <PromptForm
          title={prompt.title}
          text={prompt.text}
          onClose={handlePromptClose}
          onConfirm={handleDeleteConfirm}
          confirmText={t("actions.delete")}
          variant="warning"
          isLoading={deletingLeaveId !== null}
        />
      ) : prompt && prompt.variant === "error" ? (
        <PromptForm
          title={prompt.title}
          text={prompt.text}
          onClose={handlePromptClose}
          onConfirm={handleErrorConfirm}
          confirmText={t("actions.delete")}
          variant="error"
        />
      ) : prompt && prompt.variant === "success" ? (
        <Prompt
          title={prompt.title}
          text={prompt.text}
          variant="success"
          namespace="LeaveApplicationsPage"
          onClose={handlePromptClose}
        />
      ) : null}

      <div className="overflow-x-auto page-scroll pb-2 min-w-0">
        <Table.Table>
        <Table.Header>
          <tr>
            <Table.HeadCell className="w-6">
              <Checkbox state={headerState} onChange={onToggleHeader} isHeader />
            </Table.HeadCell>

            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "employee" ? sortConfig.direction : undefined}
              onSort={handleSortEmployee}>
              {t("table.employee")}
            </Table.HeadCell>

            <Table.HeadCell>{t("table.leaveType")}</Table.HeadCell>

            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "period" ? sortConfig.direction : undefined}
              onSort={handleSortPeriod}>
              {t("table.period")}
            </Table.HeadCell>

            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "duration" ? sortConfig.direction : undefined}
              onSort={handleSortDuration}>
              {t("table.duration")}
            </Table.HeadCell>

            <Table.HeadCell>{t("table.status")}</Table.HeadCell>

            <Table.HeadCell>{t("table.actions")}</Table.HeadCell>
          </tr>
        </Table.Header>

        <Table.Body>{leaves.map(renderTableRow)}</Table.Body>
      </Table.Table>
      </div>

      {selectedLeave && <LeaveDetailsModal leave={selectedLeave} onClose={handleSelectedLeaveClose} />}
    </>
  );
}

