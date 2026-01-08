import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Eye, TickCircle, Clock, Wallet } from "iconsax-react";
import { Table, Button, Badge } from "@/shared/ui";
import type { GPHPayment } from "../../../types";
import { formatPayrollAmount, getInitials } from "../../../utils";

interface Props {
  payments: GPHPayment[];
  onViewDetails: (payment: GPHPayment) => void;
  onMarkPaid?: (payment: GPHPayment) => void;
  markingGPHPaidId?: number | null;
}

export default function GPHPaymentsTable({ payments, onViewDetails, onMarkPaid, markingGPHPaidId }: Props) {
  const { t } = useTranslation("PayrollPage");

  if (payments.length === 0) {
    return (
      <div className="p-5 rounded-lg border surface-base-stroke text-center">
        <p className="text-body-regular-sm content-base-low">{t("detail.gphPayments.empty")}</p>
      </div>
    );
  }

  return (
    <Table.Table>
      <Table.Header>
        <tr>
          <Table.HeadCell>{t("detail.gphPayments.contractor")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.gphPayments.completionAct")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.gphPayments.gross")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.gphPayments.withheld")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.gphPayments.net")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.gphPayments.totalCost")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.gphPayments.status")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.gphPayments.actions")}</Table.HeadCell>
        </tr>
      </Table.Header>
      <Table.Body>
        {payments.map((payment, index) => {
          const isPaid = payment.status === "paid";
          const isEven = index % 2 === 0;
          const avatarBg = isEven ? "bg-grey-50 dark:bg-grey-900" : "bg-white dark:bg-grey-950";

          return (
            <Table.Row key={payment.id}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 aspect-square rounded-full flex items-center justify-center shrink-0",
                      avatarBg,
                    )}>
                    <span className="content-action-brand text-body-bold-xs">
                      {getInitials(payment.contractor_name)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-body-bold-sm content-base-primary">{payment.contractor_name}</p>
                      <p className="text-label-xs content-action-neutral">{payment.contractor_iin}</p>
                    </div>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <div>
                  <p className="text-body-regular-sm content-base-primary">{payment.completion_act.display_number}</p>
                  <p className="text-label-xs content-action-neutral truncate max-w-[200px]">
                    {payment.completion_act.service_name}
                  </p>
                </div>
              </Table.Cell>
              <Table.Cell>{formatPayrollAmount(payment.gross_amount)} ₸</Table.Cell>
              <Table.Cell>{formatPayrollAmount(payment.total_withheld)} ₸</Table.Cell>
              <Table.Cell>{formatPayrollAmount(payment.net_amount)} ₸</Table.Cell>
              <Table.Cell>{formatPayrollAmount(payment.total_cost)} ₸</Table.Cell>
              <Table.Cell>
                <Badge
                  variant="soft"
                  color={isPaid ? "positive" : "notice"}
                  text={isPaid ? t("detail.gphPayments.statusPaid") : t("detail.gphPayments.statusPending")}
                  icon={
                    isPaid ? (
                      <TickCircle size={16} color="currentColor" variant="Bold" />
                    ) : (
                      <Clock size={16} color="currentColor" />
                    )
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    isIconButton
                    onClick={() => onViewDetails(payment)}
                    className="w-8! radius-xs! p-0!"
                    title={t("actions.viewDetails")}>
                    <Eye size={16} color="currentColor" />
                  </Button>
                  {!isPaid && onMarkPaid && (
                    <Button
                      variant="primary"
                      isIconButton
                      onClick={() => onMarkPaid(payment)}
                      disabled={markingGPHPaidId === payment.id}
                      className="w-8! radius-xs! p-0!"
                      title={t("actions.markPaid")}>
                      <Wallet size={16} color="currentColor" />
                    </Button>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Table>
  );
}
