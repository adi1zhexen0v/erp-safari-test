import { useTranslation } from "react-i18next";
import { Clock, TickCircle } from "iconsax-react";
import { Badge, Table } from "@/shared/ui";
import type { TimesheetResponse } from "../../../types";
import type { SortKey, SortConfig } from "../../../hooks";
import TimesheetActions from "./TimesheetActions";

interface Props {
  timesheets: TimesheetResponse[];
  onOpen: (id: number) => void;
  onApprove: (id: number) => void;
  onDelete: (id: number) => void;
  onDownload: (id: number, year: number, month: number) => void;
  sortConfig: SortConfig | null;
  onSort: (key: SortKey) => void;
}

export default function TimesheetsTable({
  timesheets,
  onOpen,
  onApprove,
  onDelete,
  onDownload,
  sortConfig,
  onSort,
}: Props) {
  const { t } = useTranslation("TimesheetsPage");

  return (
    <Table.Table>
      <Table.Header>
        <tr>
          <Table.HeadCell>{t("table.period")}</Table.HeadCell>
          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "status" ? sortConfig.direction : undefined}
            onSort={() => onSort("status")}>
            {t("table.status")}
          </Table.HeadCell>
          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "workDays" ? sortConfig.direction : undefined}
            onSort={() => onSort("workDays")}>
            {t("table.workDays")}
          </Table.HeadCell>
          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "workHours" ? sortConfig.direction : undefined}
            onSort={() => onSort("workHours")}>
            {t("table.workHours")}
          </Table.HeadCell>
          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "entries" ? sortConfig.direction : undefined}
            onSort={() => onSort("entries")}>
            {t("table.entries")}
          </Table.HeadCell>
          <Table.HeadCell>{t("table.actions")}</Table.HeadCell>
        </tr>
      </Table.Header>
      <Table.Body>
        {timesheets.map((timesheet, index) => (
          <Table.Row key={timesheet.id}>
            <Table.Cell isBold>
              {timesheet.month_name_ru} {timesheet.year}
            </Table.Cell>
            <Table.Cell>
              <Badge
                variant="soft"
                color={timesheet.status === "draft" ? "info" : "positive"}
                text={t(`status.${timesheet.status}`)}
                icon={
                  timesheet.status === "draft" ? (
                    <Clock size={16} color="currentColor" />
                  ) : (
                    <TickCircle size={16} color="currentColor" variant="Bold" />
                  )
                }
              />
            </Table.Cell>
            <Table.Cell>{timesheet.sum_work_days}</Table.Cell>
            <Table.Cell>{timesheet.sum_work_hours}</Table.Cell>
            <Table.Cell>{timesheet.entries_count || 0}</Table.Cell>
            <Table.Cell>
              <TimesheetActions
                timesheet={timesheet}
                onOpen={onOpen}
                onApprove={onApprove}
                onDelete={onDelete}
                onDownload={onDownload}
                index={index}
                totalCount={timesheets.length}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Table>
  );
}

