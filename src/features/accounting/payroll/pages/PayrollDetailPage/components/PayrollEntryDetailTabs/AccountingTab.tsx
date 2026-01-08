import { useTranslation } from "react-i18next";
import { DocumentText1, PercentageCircle, Profile2User, ReceiptText, TableDocument } from "iconsax-react";
import { Table } from "@/shared/ui";
import type { PayrollEntry } from "@/features/accounting/payroll/types";
import { formatPayrollAmount } from "@/features/accounting/payroll/utils";

interface Props {
  entry: PayrollEntry;
  locale: string;
  isFullScreen?: boolean;
}

interface BalanceEntry {
  account: string;
  nameKey: string;
  debit: number | null;
  credit: number | null;
  balance: number;
  type: "Дт" | "Кт";
}

export default function AccountingTab({ entry, isFullScreen = false }: Props) {
  const { t } = useTranslation("PayrollPage");

  const grossSalary = parseFloat(entry.gross_salary) || 0;
  const opv = parseFloat(entry.opv) || 0;
  const ipn = parseFloat(entry.ipn) || 0;
  const vosms = parseFloat(entry.vosms) || 0;
  const opvr = parseFloat(entry.opvr) || 0;
  const so = parseFloat(entry.so) || 0;
  const oosms = parseFloat(entry.oosms) || 0;
  const sn = parseFloat(entry.sn) || 0;
  const netSalary = parseFloat(entry.net_salary) || 0;
  const totalEmployer = parseFloat(entry.total_employer_contributions) || 0;

  const ipnRate = entry.calculation_snapshot?.flags?.ipn_rate ?? 10;

  const balanceEntries: BalanceEntry[] = [
    { account: "3120", nameKey: "tabs.accounting.account3120", debit: null, credit: ipn, balance: ipn, type: "Кт" },
    { account: "3150", nameKey: "tabs.accounting.account3150", debit: null, credit: sn, balance: sn, type: "Кт" },
    {
      account: "3211",
      nameKey: "tabs.accounting.account3211",
      debit: null,
      credit: so,
      balance: so,
      type: "Кт",
    },
    {
      account: "3212",
      nameKey: "tabs.accounting.account3212",
      debit: null,
      credit: vosms,
      balance: vosms,
      type: "Кт",
    },
    {
      account: "3213",
      nameKey: "tabs.accounting.account3213",
      debit: null,
      credit: oosms,
      balance: oosms,
      type: "Кт",
    },
    {
      account: "3220",
      nameKey: "tabs.accounting.account3220",
      debit: null,
      credit: opv,
      balance: opv,
      type: "Кт",
    },
    {
      account: "3250",
      nameKey: "tabs.accounting.account3250",
      debit: null,
      credit: opvr,
      balance: opvr,
      type: "Кт",
    },
    {
      account: "3350",
      nameKey: "tabs.accounting.account3350",
      debit: opv + ipn + vosms,
      credit: grossSalary,
      balance: netSalary,
      type: "Кт",
    },
    {
      account: "7210",
      nameKey: "tabs.accounting.account7210",
      debit: grossSalary + totalEmployer,
      credit: null,
      balance: grossSalary + totalEmployer,
      type: "Дт",
    },
  ];

  const totalDebit = balanceEntries.reduce((sum, e) => sum + (e.debit || 0), 0);
  const totalCredit = balanceEntries.reduce((sum, e) => sum + (e.credit || 0), 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-start gap-3 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
          <span className="content-action-neutral">
            <ReceiptText size={16} color="currentColor" />
          </span>
        </div>
        <span className="text-body-bold-lg content-base-primary">{t("tabs.accounting.balanceSheet")}</span>
      </div>

      <div className="overflow-x-auto page-scroll pb-2">
        <Table.Table>
          <Table.Header>
            <Table.Row>
              <Table.HeadCell>{t("tabs.accounting.account")}</Table.HeadCell>
              <Table.HeadCell>{t("tabs.accounting.accountName")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("tabs.accounting.debit")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("tabs.accounting.credit")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("tabs.accounting.finalBalance")}</Table.HeadCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {balanceEntries.map((be) => (
              <Table.Row key={be.account}>
                <Table.Cell>{be.account}</Table.Cell>
                <Table.Cell isBold>{t(be.nameKey)}</Table.Cell>
                <Table.Cell align="right" isBold>
                  {be.debit ? formatPayrollAmount(be.debit) : "−"}
                </Table.Cell>
                <Table.Cell align="right" isBold>
                  {be.credit ? formatPayrollAmount(be.credit) : "−"}
                </Table.Cell>
                <Table.Cell align="right" isBold>
                  {formatPayrollAmount(be.balance)}{" "}
                </Table.Cell>
              </Table.Row>
            ))}
            <Table.Row>
              <Table.Cell colSpan={2} align="right" isBold>
                {t("tabs.accounting.total")}
              </Table.Cell>
              <Table.Cell align="right" isBold>
                {formatPayrollAmount(totalDebit)}
              </Table.Cell>
              <Table.Cell align="right" isBold>
                {formatPayrollAmount(totalCredit)}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Table>
      </div>

      <div className="flex items-center justify-start gap-3 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
          <span className="content-action-neutral">
            <TableDocument size={16} color="currentColor" />
          </span>
        </div>
        <span className="text-body-bold-lg content-base-primary">{t("tabs.accounting.paymentSummary")}</span>
      </div>

      <div className={`grid gap-3 ${isFullScreen ? "grid-cols-3" : "grid-cols-1"}`}>
        <div className="p-5 radius-lg border surface-base-stroke flex flex-col gap-5 justify-between">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-start gap-3">
              <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
                <span className="content-action-neutral">
                  <Profile2User size={16} color="currentColor" />
                </span>
              </div>
              <span className="text-body-bold-lg content-base-primary">
                {t("tabs.accounting.worker")} {entry.worker.full_name}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-label-xs content-action-neutral">{t("tabs.accounting.accrued")}</span>
                <p className="text-body-bold-md content-action-positive">+ {formatPayrollAmount(grossSalary)} ₸</p>
              </div>

              <div className="border-t surface-base-stroke"></div>

              <div className="flex justify-between items-start">
                <span className="text-label-xs content-action-neutral">{t("tabs.accounting.deductions")}</span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-body-bold-md content-base-primary text-right">{t("tabs.accounting.opvPercent")}</p>
                  <p className="text-body-bold-md content-base-primary text-right">
                    {t("tabs.accounting.ipnPercent")} ({ipnRate * 100}%)
                  </p>
                  <p className="text-body-bold-md content-base-primary text-right">
                    {t("tabs.accounting.vosmsPercent")}
                  </p>
                </div>
              </div>

              <div className="border-t surface-base-stroke"></div>

              <div className="flex justify-between items-center">
                <span className="text-label-xs content-action-neutral">{t("tabs.accounting.totalDeductedAmount")}</span>
                <p className="text-body-bold-md content-action-negative">
                  - {formatPayrollAmount(opv + ipn + vosms)} ₸
                </p>
              </div>
            </div>
          </div>

          <div className="radius-sm p-3 surface-component-fill flex justify-between items-center">
            <span className="text-body-regular-sm content-base-primary">{t("tabs.accounting.toPay")}</span>
            <span className="text-display-2xs content-base-primary">{formatPayrollAmount(totalEmployer)} ₸</span>
          </div>
        </div>

        <div className="p-5 radius-lg border surface-base-stroke flex flex-col gap-5 justify-between ">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-start gap-3">
              <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
                <span className="content-action-neutral">
                  <PercentageCircle size={16} color="currentColor" />
                </span>
              </div>
              <span className="text-body-bold-lg content-base-primary">{t("tabs.accounting.employerTaxes")}</span>
            </div>

            <div className="flex flex-col gap-0">
              <div className="flex items-center justify-between py-2 border-b surface-base-stroke">
                <span className="text-label-xs content-action-neutral">{t("tabs.accounting.opvrPercent")}</span>
                <span className="text-body-bold-md content-base-primary">{formatPayrollAmount(opvr)} ₸</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b surface-base-stroke">
                <span className="text-label-xs content-action-neutral">{t("tabs.accounting.soPercent")}</span>
                <span className="text-body-bold-md content-base-primary">{formatPayrollAmount(so)} ₸</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b surface-base-stroke">
                <span className="text-label-xs content-action-neutral">{t("tabs.accounting.oosmsPercent")}</span>
                <span className="text-body-bold-md content-base-primary">{formatPayrollAmount(oosms)} ₸</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-label-xs content-action-neutral">{t("tabs.accounting.snPercent")}</span>
                <span className="text-body-bold-md content-base-primary">{formatPayrollAmount(sn)} ₸</span>
              </div>
            </div>
          </div>

          <div className="radius-sm p-3 surface-component-fill flex justify-between items-center">
            <span className="text-body-regular-sm content-base-primary">{t("tabs.accounting.totalEmployer")}</span>
            <span className="text-display-2xs content-base-primary">{formatPayrollAmount(totalEmployer)} ₸</span>
          </div>
        </div>

        <div className="p-5 radius-lg border surface-base-stroke flex flex-col gap-5 justify-between bg-primary-500">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-start gap-3">
              <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
                <span className="content-action-neutral">
                  <DocumentText1 size={16} color="currentColor" />
                </span>
              </div>
              <span className="text-body-bold-lg text-white">{t("tabs.accounting.finalSummary")}</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-between py-2 border-b border-white/20">
                <span className="text-label-xs text-white">{t("tabs.accounting.accruedToWorker")}</span>
                <span className="text-body-bold-md text-white">{formatPayrollAmount(grossSalary)} ₸</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/20">
                <span className="text-label-xs text-white">{t("tabs.accounting.paid")}</span>
                <span className="text-body-bold-md text-white">{formatPayrollAmount(netSalary)} ₸</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-label-xs text-white">{t("tabs.accounting.totalTaxesAndContributions")}</span>
                <span className="text-body-bold-md text-white">
                  {formatPayrollAmount(opv + ipn + vosms + totalEmployer)} ₸
                </span>
              </div>
            </div>
          </div>

          <div className="radius-sm p-3 bg-white flex justify-between items-center">
            <span className="text-body-regular-sm text-black">{t("tabs.accounting.fullEmployerCost")}</span>
            <span className="text-display-2xs text-black">{formatPayrollAmount(grossSalary + totalEmployer)} ₸</span>
          </div>
        </div>
      </div>
    </div>
  );
}

