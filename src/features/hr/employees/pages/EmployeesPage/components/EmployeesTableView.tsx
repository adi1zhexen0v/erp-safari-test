import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MoreIcon } from "@/shared/assets/icons";
import { Badge, Button, Checkbox, Dropdown, DropdownItem, Table } from "@/shared/ui";
import { type CheckboxState } from "@/shared/ui";
import { STATUS_MAP } from "@/features/hr/employees/consts/statuses";
import type { WorkerListItem } from "@/features/hr/employees";
import type { EmployeesSortKey, EmployeesSortConfig } from "../../../hooks";

interface Props {
  employees: WorkerListItem[];
  rowStates: Record<string, CheckboxState>;
  headerState: CheckboxState;
  onToggleHeader: () => void;
  onToggleRow: (id: number) => void;
  sortConfig: EmployeesSortConfig | null;
  onSort: (key: EmployeesSortKey) => void;
  onDownloadProfile: (id: number) => void;
  isDownloading: boolean;
  onOpenLeaveForm: (employee: WorkerListItem) => void;
  onOpenMedicalLeaveForm: (employee: WorkerListItem) => void;
  onOpenResignationForm: (employee: WorkerListItem) => void;
  onOpenContractChanges: (employee: WorkerListItem) => void;
}

export default function EmployeesTableView({
  employees,
  rowStates,
  headerState,
  onToggleHeader,
  onToggleRow,
  sortConfig,
  onSort,
  onDownloadProfile,
  isDownloading,
  onOpenLeaveForm,
  onOpenMedicalLeaveForm,
  onOpenResignationForm,
  onOpenContractChanges,
}: Props) {
  const { t } = useTranslation("EmployeesPage");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("ru-RU");
  }

  return (
    <div className="w-full min-w-0">
      <div className="overflow-x-auto page-scroll pb-2">
        <Table.Table className="min-w-[1100px]">
      <Table.Header>
        <tr>
          <Table.HeadCell className="w-6">
            <Checkbox state={headerState} onChange={onToggleHeader} isHeader />
          </Table.HeadCell>

          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "full_name" ? sortConfig.direction : undefined}
            onSort={() => onSort("full_name")}>
            {t("table.fullName")}
          </Table.HeadCell>

          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "email" ? sortConfig.direction : undefined}
            onSort={() => onSort("email")}>
            {t("table.email")}
          </Table.HeadCell>

          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "iin" ? sortConfig.direction : undefined}
            onSort={() => onSort("iin")}>
            {t("table.iin")}
          </Table.HeadCell>

          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "start_date" ? sortConfig.direction : undefined}
            onSort={() => onSort("start_date")}>
            {t("table.hireDate")}
          </Table.HeadCell>

          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "work_position" ? sortConfig.direction : undefined}
            onSort={() => onSort("work_position")}>
            {t("table.position")}
          </Table.HeadCell>

          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "work_salary" ? sortConfig.direction : undefined}
            onSort={() => onSort("work_salary")}>
            {t("table.salary")}
          </Table.HeadCell>

          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "status" ? sortConfig.direction : undefined}
            onSort={() => onSort("status")}>
            {t("table.status")}
          </Table.HeadCell>

          <Table.HeadCell>{t("table.actions")}</Table.HeadCell>
        </tr>
      </Table.Header>

      <Table.Body>
        {employees.map((emp, index) => {
          const state = rowStates[String(emp.id)] || "unchecked";

          const email = emp.contacts?.email || "—";
          const iin = emp.iin || "—";
          const startDate = emp.active_contract?.start_date ? formatDate(emp.active_contract.start_date) : "—";
          const position = emp.active_contract?.job_position_ru || emp.active_contract?.work_position || "—";

          const salaryNum = Number(emp.active_contract?.salary_amount ?? 0);
          const salaryFormatted = salaryNum ? salaryNum.toLocaleString("ru-RU") + " ₸" : "—";
          const statusConfig = STATUS_MAP[emp.status as keyof typeof STATUS_MAP];

          return (
            <Table.Row key={emp.id} selected={state === "checked"}>
              <Table.Cell>
                <Checkbox state={state} onChange={() => onToggleRow(emp.id)} />
              </Table.Cell>

              <Table.Cell isBold>{emp.full_name}</Table.Cell>

              <Table.Cell>{email}</Table.Cell>

              <Table.Cell>{iin}</Table.Cell>

              <Table.Cell>{startDate}</Table.Cell>

              <Table.Cell>{position}</Table.Cell>

              <Table.Cell>{salaryFormatted}</Table.Cell>

              <Table.Cell>
                {statusConfig ? (
                  <Badge
                    variant="soft"
                    color={statusConfig.color}
                    text={t(statusConfig.label)}
                    icon={statusConfig.icon}
                  />
                ) : (
                  "—"
                )}
              </Table.Cell>

              <Table.Cell>
                <Dropdown
                  open={openDropdownId === emp.id}
                  onClose={() => setOpenDropdownId(null)}
                  width="w-max"
                  direction={index === employees.length - 1 ? "top" : "bottom"}>
                  <Button
                    variant="secondary"
                    isIconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === emp.id ? null : emp.id);
                    }}
                    className="w-8! radius-xs! p-0!">
                    <MoreIcon />
                  </Button>
                  <DropdownItem
                    onClick={() => {
                      if (!isDownloading) {
                        onDownloadProfile(emp.id);
                        setOpenDropdownId(null);
                      }
                    }}
                    className={isDownloading ? "opacity-50 cursor-not-allowed" : ""}>
                    {t("cards.downloadProfile")}
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      onOpenContractChanges(emp);
                      setOpenDropdownId(null);
                    }}>
                    {t("actions.modifyContract")}
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      onOpenLeaveForm(emp);
                      setOpenDropdownId(null);
                    }}>
                    {t("actions.sendOnLeave")}
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      onOpenMedicalLeaveForm(emp);
                      setOpenDropdownId(null);
                    }}>
                    {t("actions.sendOnSickLeave")}
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      onOpenResignationForm(emp);
                      setOpenDropdownId(null);
                    }}>
                    {t("actions.terminateContract")}
                  </DropdownItem>
                </Dropdown>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Table>
      </div>
    </div>
  );
}

