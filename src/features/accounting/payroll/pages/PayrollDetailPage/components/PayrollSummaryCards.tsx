import { useState } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { Moneys, ArrowDown, ArrowUp, Wallet, InfoCircle } from "iconsax-react";
import { Toast, Dropdown } from "@/shared/ui";
import { formatPayrollAmount, aggregatePayrollTotals } from "../../../utils";
import type { GPHPayment, PayrollStatus } from "../../../types";

interface Props {
  gross: string;
  deductions: string;
  net: string;
  employerCost: string;
  gphPayments?: GPHPayment[];
  status: PayrollStatus;
  monthWorkDays: number;
}

export default function PayrollSummaryCards({
  gross,
  deductions,
  net,
  employerCost,
  gphPayments = [],
  status,
  monthWorkDays,
}: Props) {
  const { t } = useTranslation("PayrollPage");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const aggregatedTotals = aggregatePayrollTotals(gross, deductions, net, employerCost, gphPayments);

  const cards = [
    {
      key: "gross",
      label: t("detail.summaryCards.gross"),
      value: formatPayrollAmount(aggregatedTotals.gross) + " ₸",
      icon: Moneys,
      iconColor: "content-action-info",
      description: t("detail.summaryCards.workDays", { count: monthWorkDays }),
      tooltip: t("detail.summaryCards.grossTooltip"),
    },
    {
      key: "net",
      label: t("detail.summaryCards.net"),
      value: formatPayrollAmount(aggregatedTotals.net) + " ₸",
      icon: Wallet,
      iconColor: "content-action-positive",
      showToast: status === "calculated",
      tooltip: t("detail.summaryCards.netTooltip"),
    },
    {
      key: "deductions",
      label: t("detail.summaryCards.deductions"),
      value: formatPayrollAmount(aggregatedTotals.deductions) + " ₸",
      icon: ArrowDown,
      iconColor: "content-action-negative",
      tooltip: t("detail.summaryCards.deductionsTooltip"),
    },
    {
      key: "employerCost",
      label: t("detail.summaryCards.employerCost"),
      value: formatPayrollAmount(aggregatedTotals.employerCost) + " ₸",
      icon: ArrowUp,
      iconColor: "content-action-neutral",
      tooltip: t("detail.summaryCards.employerCostTooltip"),
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={card.key} className="p-5 radius-lg border surface-component-stroke flex flex-col">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 aspect-square flex justify-center items-center surface-component-fill radius-xs",
                    card.iconColor,
                  )}>
                  <Icon size={16} color="currentColor" />
                </div>
                <p className="text-label-sm content-base-primary">{card.label}</p>
              </div>

              <div
                className="relative"
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}>
                <Dropdown
                  open={hoveredCard === i}
                  onClose={() => setHoveredCard(null)}
                  direction="bottom"
                  align="right"
                  width="w-max"
                  className="elevation-level-2!">
                  <span className="content-action-neutral cursor-pointer">
                    <InfoCircle size={16} color="currentColor" />
                  </span>
                  <div
                    className="p-2 max-w-[200px]"
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}>
                    <p className="text-label-xs content-action-neutral">{card.tooltip}</p>
                  </div>
                </Dropdown>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h6 className="text-display-sm content-base-primary">{card.value}</h6>
              {card.showToast ? (
                <Toast
                  color="notice"
                  text={t("detail.summaryCards.waitingPayment")}
                  closable={false}
                  autoClose={false}
                />
              ) : (
                card.description && <p className="text-body-regular-sm content-action-neutral">{card.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
