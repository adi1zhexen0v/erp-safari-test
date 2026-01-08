import { useTranslation } from "react-i18next";
import { Wallet, Building, Hospital, Judge, People } from "iconsax-react";
import { formatPayrollAmount, aggregateGPHTotals } from "../../../utils";
import type { GPHPayment } from "../../../types";

interface Props {
  totalNet: string;
  totalOpv: string;
  totalOpvr: string;
  totalVosms: string;
  totalOosms: string;
  totalIpn: string;
  totalSn: string;
  totalSo: string;
  gphPayments?: GPHPayment[];
}

interface PaymentDestination {
  icon: React.ReactNode;
  label: string;
  amount: string;
  description: string;
}

export default function PaymentSection({
  totalNet,
  totalOpv,
  totalOpvr,
  totalVosms,
  totalOosms,
  totalIpn,
  totalSn,
  totalSo,
  gphPayments = [],
}: Props) {
  const { t } = useTranslation("PayrollPage");

  const gphTotals = aggregateGPHTotals(gphPayments);

  const opv = parseFloat(totalOpv) || 0;
  const opvr = parseFloat(totalOpvr) || 0;
  const vosms = parseFloat(totalVosms) || 0;
  const oosms = parseFloat(totalOosms) || 0;
  const ipn = parseFloat(totalIpn) || 0;
  const sn = parseFloat(totalSn) || 0;
  const so = parseFloat(totalSo) || 0;

  const totalAllOpv = opv + gphTotals.opv;
  const totalAllVosms = vosms + gphTotals.vosms;
  const totalAllIpn = ipn + gphTotals.ipn;
  const totalAllSo = so + gphTotals.so;

  const paymentDestinations: PaymentDestination[] = [
    {
      icon: <Wallet size={16} color="currentColor" />,
      label: t("paymentSection.destinations.employees"),
      amount: `${formatPayrollAmount(totalNet)} ₸`,
      description: t("paymentSection.destinationDescriptions.employees"),
    },
    ...(gphPayments.length > 0
      ? [
          {
            icon: <Wallet size={16} color="currentColor" />,
            label: t("paymentSection.destinations.contractors"),
            amount: `${formatPayrollAmount(gphTotals.net.toFixed(2))} ₸`,
            description: t("paymentSection.destinationDescriptions.contractors"),
          },
        ]
      : []),
    {
      icon: <Building size={16} color="currentColor" />,
      label: t("paymentSection.destinations.enpf"),
      amount: `${formatPayrollAmount((totalAllOpv + opvr).toFixed(2))} ₸`,
      description: t("paymentSection.destinationDescriptions.enpf"),
    },
    {
      icon: <Hospital size={16} color="currentColor" />,
      label: t("paymentSection.destinations.medical"),
      amount: `${formatPayrollAmount((totalAllVosms + oosms).toFixed(2))} ₸`,
      description: t("paymentSection.destinationDescriptions.medical"),
    },
    {
      icon: <Judge size={16} color="currentColor" />,
      label: t("paymentSection.destinations.tax"),
      amount: `${formatPayrollAmount((totalAllIpn + sn).toFixed(2))} ₸`,
      description: t("paymentSection.destinationDescriptions.tax"),
    },
    {
      icon: <People size={16} color="currentColor" />,
      label: t("paymentSection.destinations.social"),
      amount: `${formatPayrollAmount(totalAllSo.toFixed(2))} ₸`,
      description: t("paymentSection.destinationDescriptions.social"),
    },
  ];

  return (
    <div className="p-5 radius-lg border surface-component-stroke flex flex-col gap-5">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-body-bold-lg content-base-primary">{t("paymentSection.breakdown")}</h3>
        <p className="text-body-regular-sm content-action-neutral">{t("paymentSection.totalPayments")}</p>
      </div>
      <div className="flex flex-col gap-3">
        {paymentDestinations.map((dest) => (
          <div key={dest.label} className="p-4 radius-sm surface-component-fill flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 aspect-square flex items-center justify-center radius-xs surface-container-fill content-action-neutral">
                {dest.icon}
              </div>

              <span className="text-label-sm content-base-primary">{dest.label}</span>
            </div>
            <p className="text-display-xs content-base-primary">{dest.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
