import { useTranslation } from "react-i18next";
import cn from "classnames";
import { MoneyRecive, MoneySend } from "iconsax-react";
import type { PayrollEntry } from "@/features/accounting/payroll/types";
import { formatPayrollAmount } from "@/features/accounting/payroll/utils";

interface Props {
  entry: PayrollEntry;
  isFullScreen?: boolean;
}

type PaymentType = "worker" | "pension" | "tax" | "social";

interface PaymentOrder {
  id: string;
  type: PaymentType;
  amount: number;
  recipient: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  typeKey: string;
}

const typeColors: Record<PaymentType, { bg: string; text: string; border: string }> = {
  worker: { bg: "bg-positive-100", text: "text-positive-700", border: "border-positive-300" },
  pension: { bg: "bg-negative-100", text: "text-negative-700", border: "border-negative-300" },
  tax: { bg: "bg-primary-100", text: "text-primary-700", border: "border-primary-300" },
  social: { bg: "bg-notice-100", text: "text-notice-700", border: "border-notice-300" },
};

export default function PaymentTab({ entry, isFullScreen = false }: Props) {
  const { t } = useTranslation("PayrollPage");

  const netSalary = parseFloat(entry.net_salary) || 0;
  const opv = parseFloat(entry.opv) || 0;
  const opvr = parseFloat(entry.opvr) || 0;
  const ipn = parseFloat(entry.ipn) || 0;
  const sn = parseFloat(entry.sn) || 0;
  const vosms = parseFloat(entry.vosms) || 0;
  const oosms = parseFloat(entry.oosms) || 0;
  const so = parseFloat(entry.so) || 0;

  const paymentOrders: PaymentOrder[] = [
    {
      id: "PAY-001",
      type: "worker",
      typeKey: "paymentTypeWorker",
      amount: netSalary,
      recipient: entry.worker.full_name,
      description: t("tabs.payment.salaryPayment"),
      debitAccount: "3350",
      creditAccount: "1030",
    },
    {
      id: "PAY-002",
      type: "pension",
      typeKey: "paymentTypePension",
      amount: opv,
      recipient: t("tabs.payment.enpf"),
      description: t("tabs.payment.opvDescription"),
      debitAccount: "3220",
      creditAccount: "1030",
    },
    {
      id: "PAY-003",
      type: "pension",
      typeKey: "paymentTypePension",
      amount: opvr,
      recipient: t("tabs.payment.enpf"),
      description: t("tabs.payment.opvrDescription"),
      debitAccount: "3250",
      creditAccount: "1030",
    },
    {
      id: "PAY-004",
      type: "tax",
      typeKey: "paymentTypeTax",
      amount: ipn,
      recipient: t("tabs.payment.taxAuthority"),
      description: t("tabs.payment.ipnDescription"),
      debitAccount: "3120",
      creditAccount: "1030",
    },
    {
      id: "PAY-005",
      type: "tax",
      typeKey: "paymentTypeTax",
      amount: sn,
      recipient: t("tabs.payment.taxAuthority"),
      description: t("tabs.payment.snDescription"),
      debitAccount: "3150",
      creditAccount: "1030",
    },
    {
      id: "PAY-006",
      type: "social",
      typeKey: "paymentTypeSocial",
      amount: oosms,
      recipient: t("tabs.payment.fsms"),
      description: t("tabs.payment.oosmsDescription"),
      debitAccount: "3213",
      creditAccount: "1030",
    },
    {
      id: "PAY-007",
      type: "social",
      typeKey: "paymentTypeSocial",
      amount: vosms,
      recipient: t("tabs.payment.fsms"),
      description: t("tabs.payment.vosmsDescription"),
      debitAccount: "3212",
      creditAccount: "1030",
    },
    {
      id: "PAY-008",
      type: "social",
      typeKey: "paymentTypeSocial",
      amount: so,
      recipient: t("tabs.payment.gfss"),
      description: t("tabs.payment.soDescription"),
      debitAccount: "3211",
      creditAccount: "1030",
    },
  ];

  const totals = {
    enpf: opv + opvr,
    tax: ipn + sn,
    fsms: vosms + oosms,
    gfss: so,
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-start gap-3 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
          <span className="content-action-neutral">
            <MoneyRecive size={16} color="currentColor" />
          </span>
        </div>
        <span className="text-body-bold-lg content-base-primary">{t("tabs.payment.outgoingPayments")}</span>
      </div>

      <div className={`grid gap-2 ${isFullScreen ? "grid-cols-3" : "grid-cols-1"}`}>
        {paymentOrders.map((order) => {
          const colors = typeColors[order.type];
          return (
            <div key={order.id} className="p-4 radius-sm border surface-base-stroke">
              <div className="flex items-center justify-between mb-3">
                <span className={cn("px-2 py-0.5 radius-xs text-body-bold-sm", colors.bg, colors.text)}>
                  {t(`tabs.payment.${order.typeKey}`)}
                </span>
                <span className="text-label-xs content-action-neutral">{order.id}</span>
              </div>

              <p className="text-display-2xs content-base-primary mb-1">{formatPayrollAmount(order.amount)} ₸</p>
              <p className="text-body-bold-md content-base-primary mb-2">{order.recipient}</p>
              <p className="text-label-sm content-action-neutral pb-4 border-b surface-base-stroke">
                {order.description}
              </p>

              <p className="text-label-sm content-action-neutral mt-4">
                {t("tabs.payment.debitCredit")} {order.debitAccount} / {t("tabs.payment.creditAccount")}{" "}
                {order.creditAccount}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-start gap-3 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
          <span className="content-action-neutral">
            <MoneySend size={16} color="currentColor" />
          </span>
        </div>
        <span className="text-body-bold-lg content-base-primary">{t("tabs.payment.wherePaymentsGo")}</span>
      </div>

      <div className={`grid gap-4 ${isFullScreen ? "grid-cols-4" : "grid-cols-1"}`}>
        <div className="p-4 rounded-lg border surface-base-stroke">
          <p className="text-label-sm content-action-neutral mb-1">{t("tabs.payment.enpfPension")}</p>
          <p className="text-display-2xs content-base-primary pb-3 border-b surface-base-stroke">
            {formatPayrollAmount(totals.enpf)} ₸
          </p>
          <p className="text-label-sm content-action-neutral mt-3">{t("tabs.payment.opvOpvr")}</p>
        </div>
        <div className="p-4 rounded-lg border surface-base-stroke">
          <p className="text-label-sm content-action-neutral mb-1">{t("tabs.payment.taxAuthorityIPNSN")}</p>
          <p className="text-display-2xs content-base-primary pb-3 border-b surface-base-stroke">
            {formatPayrollAmount(totals.tax)} ₸
          </p>
          <p className="text-label-sm content-action-neutral mt-3">{t("tabs.payment.ipnSn")}</p>
        </div>
        <div className="p-4 rounded-lg border surface-base-stroke">
          <p className="text-label-sm content-action-neutral mb-1">{t("tabs.payment.fsmsMedical")}</p>
          <p className="text-display-2xs content-base-primary pb-3 border-b surface-base-stroke">
            {formatPayrollAmount(totals.fsms)} ₸
          </p>
          <p className="text-label-sm content-action-neutral mt-3">{t("tabs.payment.vosmsOosms")}</p>
        </div>
        <div className="p-4 rounded-lg border surface-base-stroke">
          <p className="text-label-sm content-action-neutral mb-1">{t("tabs.payment.gfssSocial")}</p>
          <p className="text-display-2xs content-base-primary pb-3 border-b surface-base-stroke">
            {formatPayrollAmount(totals.gfss)} ₸
          </p>
          <p className="text-label-sm content-action-neutral mt-3">{t("tabs.payment.soOnly")}</p>
        </div>
      </div>
    </div>
  );
}
