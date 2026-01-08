import { useTranslation } from "react-i18next";
import { formatPayrollAmount, aggregateGPHTotals } from "../../../utils";
import type { GPHPayment } from "../../../types";

interface Props {
  opv: string;
  vosms: string;
  ipn: string;
  opvr: string;
  oppv: string;
  so: string;
  oosms: string;
  sn: string;
  totalEmployeeDeductions: string;
  totalEmployerContributions: string;
  gphPayments?: GPHPayment[];
}

interface TaxItem {
  label: string;
  rate: string;
  amount: string;
}

function TaxTable({
  title,
  items,
  total,
  totalLabel,
}: {
  title: string;
  items: TaxItem[];
  total: string;
  totalLabel: string;
}) {
  return (
    <div className="p-5 radius-lg border surface-component-stroke flex flex-col gap-5">
      <h4 className="text-body-bold-lg content-base-primary">{title}</h4>
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={`flex items-end justify-between gap-5 ${index < items.length - 1 ? "pb-3 border-b surface-component-stroke" : ""}`}>
            <span className="text-label-sm content-action-neutral">{item.label}</span>
            <p className="text-body-bold-lg content-base-primary">{item.amount}</p>
          </div>
        ))}
      </div>

      <div className="p-4 radius-sm surface-component-fill flex justify-between items-center gap-5">
        <span className="text-body-regular-md content-base-primary">{totalLabel}</span>
        <p className="text-display-2xs content-base-primary">{total}</p>
      </div>
    </div>
  );
}

export default function AccountingSection({
  opv,
  vosms,
  ipn,
  opvr,
  oppv,
  so,
  oosms,
  sn,
  totalEmployeeDeductions,
  totalEmployerContributions,
  gphPayments = [],
}: Props) {
  const { t } = useTranslation("PayrollPage");

  const gphTotals = aggregateGPHTotals(gphPayments);

  const payrollOpv = parseFloat(opv) || 0;
  const payrollVosms = parseFloat(vosms) || 0;
  const payrollIpn = parseFloat(ipn) || 0;

  const totalOpv = payrollOpv + gphTotals.opv;
  const totalVosms = payrollVosms + gphTotals.vosms;
  const totalIpn = payrollIpn + gphTotals.ipn;
  const totalAllEmployeeDeductions = parseFloat(totalEmployeeDeductions) + gphTotals.totalWithheld;

  const employeeDeductions: TaxItem[] = [
    { label: t("detail.taxSummary.opv"), rate: "10%", amount: `${formatPayrollAmount(totalOpv.toFixed(2))} ₸` },
    { label: t("detail.taxSummary.vosms"), rate: "2%", amount: `${formatPayrollAmount(totalVosms.toFixed(2))} ₸` },
    { label: t("detail.taxSummary.ipn"), rate: "10%", amount: `${formatPayrollAmount(totalIpn.toFixed(2))} ₸` },
  ];

  const payrollSo = parseFloat(so) || 0;

  const totalSo = payrollSo + gphTotals.so;
  const totalAllEmployerContributions = parseFloat(totalEmployerContributions) + gphTotals.so;

  const employerContributions: TaxItem[] = [
    { label: t("detail.taxSummary.opvr"), rate: "2.5%", amount: `${formatPayrollAmount(opvr)} ₸` },
    { label: t("detail.taxSummary.oppv"), rate: "5%", amount: `${formatPayrollAmount(oppv)} ₸` },
    { label: t("detail.taxSummary.so"), rate: "5%", amount: `${formatPayrollAmount(totalSo.toFixed(2))} ₸` },
    { label: t("detail.taxSummary.oosms"), rate: "3%", amount: `${formatPayrollAmount(oosms)} ₸` },
    { label: t("detail.taxSummary.sn"), rate: "11%", amount: `${formatPayrollAmount(sn)} ₸` },
  ];

  return (
    <div className="flex flex-col gap-3">
      <TaxTable
        title={t("accountingSection.employerLiabilities")}
        items={employerContributions}
        total={`${formatPayrollAmount(totalAllEmployerContributions.toFixed(2))} ₸`}
        totalLabel={t("entry.fields.totalEmployerContributions")}
      />

      <TaxTable
        title={t("accountingSection.employeeLiabilities")}
        items={employeeDeductions}
        total={`${formatPayrollAmount(totalAllEmployeeDeductions.toFixed(2))} ₸`}
        totalLabel={t("entry.fields.totalEmployeeDeductions")}
      />
    </div>
  );
}
