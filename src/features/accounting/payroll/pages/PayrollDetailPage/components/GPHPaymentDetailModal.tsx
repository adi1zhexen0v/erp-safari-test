import { useTranslation } from "react-i18next";
import { TickCircle, Clock } from "iconsax-react";
import { ModalForm, Badge } from "@/shared/ui";
import { TengeCircleIcon } from "@/shared/assets/icons";
import type { GPHPayment } from "../../../types";
import { formatPayrollAmount, getInitials } from "../../../utils";

interface Props {
  payment: GPHPayment | null;
  onClose: () => void;
}

export default function GPHPaymentDetailModal({ payment, onClose }: Props) {
  const { t } = useTranslation("PayrollPage");

  if (!payment) return null;

  const initials = getInitials(payment.contractor_name);
  const isPaid = payment.status === "paid";

  return (
    <ModalForm icon={TengeCircleIcon} onClose={onClose} resize>
      <div className="flex flex-col h-full min-h-0">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke pt-2">
          <h4 className="text-body-bold-lg content-base-primary">{t("detail.gphPayment.title")}</h4>
        </div>

        <div className="flex items-center gap-4 py-5 border-b surface-base-stroke">
          <div className="w-14 aspect-square rounded-full flex items-center justify-center bg-primary-100">
            <span className="text-primary-700 text-xl font-bold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body-bold-lg content-base-primary">{payment.contractor_name}</p>
            <p className="text-label-sm content-base-low">ИИН: {payment.contractor_iin}</p>
          </div>
        </div>

        <div className="py-5 border-b surface-base-stroke">
          <h5 className="text-body-bold-md content-base-primary mb-3">{t("detail.gphPayment.completionAct")}</h5>
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-label-sm content-base-low">{t("detail.gphPayment.actNumber")}</p>
              <p className="text-body-regular-sm content-base-primary">{payment.completion_act.display_number}</p>
            </div>
            <div>
              <p className="text-label-sm content-base-low">{t("detail.gphPayment.serviceName")}</p>
              <p className="text-body-regular-sm content-base-primary">{payment.completion_act.service_name}</p>
            </div>
            <div>
              <p className="text-label-sm content-base-low">{t("detail.gphPayment.period")}</p>
              <p className="text-body-regular-sm content-base-primary">
                {new Date(payment.completion_act.period_start_date).toLocaleDateString("ru-RU")} -{" "}
                {new Date(payment.completion_act.period_end_date).toLocaleDateString("ru-RU")}
              </p>
            </div>
            <div>
              <p className="text-label-sm content-base-low">{t("detail.gphPayment.amount")}</p>
              <p className="text-body-regular-sm content-base-primary">
                {formatPayrollAmount(payment.completion_act.amount)} ₸
              </p>
            </div>
          </div>
        </div>

        <div className="py-5 border-b surface-base-stroke">
          <h5 className="text-body-bold-md content-base-primary mb-3">{t("detail.gphPayment.paymentDetails")}</h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-label-sm content-base-low">{t("detail.gphPayment.gross")}</p>
              <p className="text-body-bold-sm content-base-primary">{formatPayrollAmount(payment.gross_amount)} ₸</p>
            </div>
            <div>
              <p className="text-label-sm content-base-low">{t("detail.gphPayment.net")}</p>
              <p className="text-body-bold-sm content-action-positive">{formatPayrollAmount(payment.net_amount)} ₸</p>
            </div>
            <div>
              <p className="text-label-sm content-base-low">{t("detail.gphPayment.totalWithheld")}</p>
              <p className="text-body-bold-sm content-base-primary">{formatPayrollAmount(payment.total_withheld)} ₸</p>
            </div>
            <div>
              <p className="text-label-sm content-base-low">{t("detail.gphPayment.totalCost")}</p>
              <p className="text-body-bold-sm content-base-primary">{formatPayrollAmount(payment.total_cost)} ₸</p>
            </div>
          </div>
        </div>

        <div className="py-5 border-b surface-base-stroke">
          <h5 className="text-body-bold-md content-base-primary mb-3">{t("detail.gphPayment.taxBreakdown")}</h5>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-body-regular-sm content-base-secondary">{t("detail.gphPayment.opv")}</span>
              <span className="text-body-bold-sm content-base-primary">{formatPayrollAmount(payment.opv)} ₸</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body-regular-sm content-base-secondary">{t("detail.gphPayment.vosms")}</span>
              <span className="text-body-bold-sm content-base-primary">{formatPayrollAmount(payment.vosms)} ₸</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body-regular-sm content-base-secondary">
                {t("detail.gphPayment.ipn", { rate: payment.is_astana_hub ? "0%" : "10%" })}
              </span>
              <span className="text-body-bold-sm content-base-primary">{formatPayrollAmount(payment.ipn)} ₸</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t surface-base-stroke">
              <span className="text-body-bold-sm content-base-primary">{t("detail.gphPayment.totalWithheld")}</span>
              <span className="text-body-bold-md content-action-negative">
                {formatPayrollAmount(payment.total_withheld)} ₸
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-body-regular-sm content-base-secondary">{t("detail.gphPayment.so")}</span>
              <span className="text-body-bold-sm content-base-primary">{formatPayrollAmount(payment.so)} ₸</span>
            </div>
          </div>
        </div>

        <div className="py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-label-sm content-base-low mb-1">{t("detail.gphPayment.status")}</p>
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
            </div>
            {isPaid && payment.paid_at && payment.paid_by && (
              <div className="text-right">
                <p className="text-label-sm content-base-low">{t("detail.gphPayment.paidBy")}</p>
                <p className="text-body-regular-sm content-base-primary">{payment.paid_by.full_name}</p>
                <p className="text-label-xs content-base-low">
                  {new Date(payment.paid_at).toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalForm>
  );
}
