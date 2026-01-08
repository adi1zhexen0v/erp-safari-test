import { useTranslation } from "react-i18next";
import { Table } from "@/shared/ui";
import { formatDateForDisplay } from "@/shared/utils";
import type { PayrollListResponse } from "../../../types";
import type { SortKey, SortConfig } from "../../../hooks";
import { formatPayrollAmount } from "../../../utils";
import PayrollActions from "./PayrollActions";
import StatusBadge from "./StatusBadge";

interface Props {
  payrolls: PayrollListResponse[];
  onOpen: (id: number) => void;
  onApprove: (id: number) => void;
  onMarkPaid: (id: number) => void;
  onDelete: (id: number) => void;
  onRecalculate: (id: number) => void;
  sortConfig: SortConfig | null;
  onSort: (key: SortKey) => void;
  approvingId?: number | null;
  markingPaidId?: number | null;
  deletingId?: number | null;
  recalculatingId?: number | null;
}

export default function PayrollsTable({
  payrolls,
  onOpen,
  onApprove,
  onMarkPaid,
  onDelete,
  onRecalculate,
  sortConfig,
  onSort,
  approvingId,
  markingPaidId,
  deletingId,
  recalculatingId,
}: Props) {
  const { t } = useTranslation("PayrollPage");

  return (
    <Table.Table>
      <Table.Header>
        <tr>
          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "period" ? sortConfig.direction : undefined}
            onSort={() => onSort("period")}>
            {t("table.period")}
          </Table.HeadCell>
          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "status" ? sortConfig.direction : undefined}
            onSort={() => onSort("status")}>
            {t("table.status")}
          </Table.HeadCell>
          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "workers" ? sortConfig.direction : undefined}
            onSort={() => onSort("workers")}>
            {t("table.workers")}
          </Table.HeadCell>
          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "gross" ? sortConfig.direction : undefined}
            onSort={() => onSort("gross")}>
            {t("table.gross")}
          </Table.HeadCell>
          <Table.HeadCell>{t("table.deductions")}</Table.HeadCell>
          <Table.HeadCell
            sortable
            sortDirection={sortConfig?.key === "net" ? sortConfig.direction : undefined}
            onSort={() => onSort("net")}>
            {t("table.net")}
          </Table.HeadCell>
          <Table.HeadCell>{t("table.employerContributions")}</Table.HeadCell>
          <Table.HeadCell>{t("table.generatedBy")}</Table.HeadCell>
          <Table.HeadCell>{t("table.actions")}</Table.HeadCell>
        </tr>
      </Table.Header>
      <Table.Body>
        {payrolls.map((payroll, index) => (
          <Table.Row key={payroll.id}>
            <Table.Cell isBold>
              {payroll.month_name_ru} {payroll.year}
            </Table.Cell>
                <Table.Cell>
                  <StatusBadge status={payroll.status} t={t} />
                </Table.Cell>
            <Table.Cell>{payroll.worker_count}</Table.Cell>
            <Table.Cell>{formatPayrollAmount(payroll.total_gross_salary)} ₸</Table.Cell>
            <Table.Cell>{formatPayrollAmount(payroll.total_employee_deductions)} ₸</Table.Cell>
            <Table.Cell isBold className="text-positive-600">
              {formatPayrollAmount(payroll.total_net_salary)} ₸
            </Table.Cell>
            <Table.Cell>{formatPayrollAmount(payroll.total_employer_contributions)} ₸</Table.Cell>
            <Table.Cell>
              <div className="flex flex-col">
                <span className="text-body-regular-sm content-base-primary">
                  {payroll.generated_by?.full_name || "-"}
                </span>
                <span className="text-label-xs content-base-low">
                  {payroll.generated_at ? formatDateForDisplay(payroll.generated_at, false) : "-"}
                </span>
              </div>
            </Table.Cell>
            <Table.Cell>
              <PayrollActions
                payroll={payroll}
                onOpen={onOpen}
                onApprove={onApprove}
                onMarkPaid={onMarkPaid}
                onDelete={onDelete}
                onRecalculate={onRecalculate}
                index={index}
                totalCount={payrolls.length}
                approvingId={approvingId}
                markingPaidId={markingPaidId}
                deletingId={deletingId}
                recalculatingId={recalculatingId}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Table>
  );
}
