import { useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Eye, InfoCircle } from "iconsax-react";
import { Table, Button, Badge, Dropdown } from "@/shared/ui";
import { type Locale } from "@/shared/utils";
import type { PayrollEntry } from "../../../types";
import { formatPayrollAmount, getInitials, getStatusBadges } from "../../../utils";

interface Props {
  entries: PayrollEntry[];
  onViewEntryDetails: (entry: PayrollEntry) => void;
  locale: Locale;
}

export default function PayrollEntriesTable({ entries, onViewEntryDetails, locale }: Props) {
  const { t } = useTranslation("PayrollPage");
  const [hoveredEntryId, setHoveredEntryId] = useState<number | null>(null);

  if (entries.length === 0) {
    return (
      <div className="p-5 rounded-lg border surface-base-stroke text-center">
        <p className="text-body-regular-sm content-base-low">{t("detail.entries.empty")}</p>
      </div>
    );
  }

  return (
    <Table.Table>
      <Table.Header>
        <tr>
          <Table.HeadCell>{t("detail.entries.worker")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.entries.workDays")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.entries.gross")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.entries.net")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.entries.totalTaxes")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.entries.employerCost")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.entries.actions")}</Table.HeadCell>
        </tr>
      </Table.Header>
      <Table.Body>
        {entries.map((entry, index) => {
          const gross = parseFloat(entry.gross_salary) || 0;
          const deductions = parseFloat(entry.total_employee_deductions) || 0;
          const employerContribs = parseFloat(entry.total_employer_contributions) || 0;
          const totalTaxes = deductions + employerContribs;
          const employerCost = gross + employerContribs;
          const isEven = index % 2 === 0;
          const avatarBg = isEven ? "bg-grey-50 dark:bg-grey-900" : "bg-white dark:bg-grey-950";

          return (
            <Table.Row key={entry.id}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 aspect-square rounded-full flex items-center justify-center shrink-0",
                      avatarBg,
                    )}>
                    <span className="content-action-brand text-body-bold-xs">
                      {getInitials(entry.worker.full_name)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-body-bold-sm content-base-primary">{entry.worker.full_name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-label-xs content-action-neutral">{entry.worker.iin}</p>
                        {(() => {
                          const statusBadges = getStatusBadges(entry, locale);
                          if (statusBadges.length === 0) return null;

                          return (
                            <div
                              className="relative flex items-center"
                              onMouseEnter={() => setHoveredEntryId(entry.id)}
                              onMouseLeave={() => setHoveredEntryId(null)}>
                              <Dropdown
                                open={hoveredEntryId === entry.id}
                                onClose={() => setHoveredEntryId(null)}
                                direction="bottom"
                                align="left"
                                width="w-max"
                                className="elevation-level-2!">
                                <InfoCircle
                                  size={14}
                                  color="currentColor"
                                  className="content-action-neutral cursor-pointer hover:opacity-80 transition-opacity"
                                />
                                <div
                                  className="p-2 flex flex-col gap-2 min-w-40"
                                  onMouseEnter={() => setHoveredEntryId(entry.id)}
                                  onMouseLeave={() => setHoveredEntryId(null)}>
                                  <p className="text-label-xs content-action-neutral mb-1">
                                    {t("detail.entries.status")}
                                  </p>
                                  {statusBadges.map((badge) => (
                                    <Badge key={badge.key} variant="soft" color={badge.color} text={badge.label} />
                                  ))}
                                </div>
                              </Dropdown>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1.5 rounded-full overflow-hidden bg-grey-100 dark:bg-grey-900">
                    {(() => {
                      const percentage =
                        entry.month_work_days > 0
                          ? Math.min(100, Math.max(0, (entry.work_days / entry.month_work_days) * 100))
                          : 0;
                      const progressColor =
                        percentage <= 30
                          ? "surface-negative-fill"
                          : percentage <= 70
                            ? "surface-notice-fill"
                            : "surface-brand-fill";
                      return (
                        <div className={cn("h-full rounded-full", progressColor)} style={{ width: `${percentage}%` }} />
                      );
                    })()}
                  </div>
                  <span>
                    {entry.work_days} / {entry.month_work_days}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell>{formatPayrollAmount(entry.gross_salary)} ₸</Table.Cell>
              <Table.Cell>{formatPayrollAmount(entry.net_salary)} ₸</Table.Cell>
              <Table.Cell>{formatPayrollAmount(totalTaxes)} ₸</Table.Cell>
              <Table.Cell>{formatPayrollAmount(employerCost)} ₸</Table.Cell>
              <Table.Cell>
                <Button
                  variant="secondary"
                  isIconButton
                  onClick={() => onViewEntryDetails(entry)}
                  className="w-8! radius-xs! p-0!"
                  title={t("actions.viewDetails")}>
                  <Eye size={16} color="currentColor" />
                </Button>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Table>
  );
}
