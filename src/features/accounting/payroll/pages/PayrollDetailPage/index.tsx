import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useScrollDetection } from "@/shared/hooks";
import { ACCOUNTING_PAYROLLS_PAGE_ROUTE, type Locale } from "@/shared/utils";
import { Prompt, PromptForm } from "@/shared/ui";
import { useGetPayrollDetailQuery } from "../../api";
import { usePayrollModals, usePayrollMutations } from "../../hooks";
import type { PayrollEntry, GPHPayment } from "../../types";
import {
  PayrollDetailHeader,
  PayrollSummaryCards,
  PayrollEntryDetailModal,
  PayrollDetailActions,
  AccrualSection,
  AccountingSection,
  PaymentSection,
  ReportingSection,
  GPHPaymentDetailModal,
  PayrollDetailPageSkeleton,
} from "./components";

export default function PayrollDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation("PayrollPage");
  const locale = i18n.language as Locale;
  const { scrollRef, hasScroll } = useScrollDetection();
  const payrollId = id ? parseInt(id, 10) : 0;

  const {
    data: payroll,
    isLoading,
    refetch,
  } = useGetPayrollDetailQuery(payrollId, {
    skip: !payrollId || isNaN(payrollId),
  });

  const {
    confirmApprove,
    setConfirmApprove,
    confirmMarkPaid,
    setConfirmMarkPaid,
    confirmDelete,
    setConfirmDelete,
    confirmRecalculate,
    setConfirmRecalculate,
    prompt,
    setPrompt,
  } = usePayrollModals();

  const {
    isApproving,
    isMarkingPaid,
    isDeleting,
    isRecalculating,
    isMarkingGPHPaid,
    markingGPHPaidId,
    handleApprove,
    handleMarkPaid,
    handleDelete,
    handleRecalculate,
    handleMarkGPHPaid,
  } = usePayrollMutations(setPrompt);

  const [entryDetailModal, setEntryDetailModal] = useState<PayrollEntry | null>(null);
  const [gphPaymentDetailModal, setGphPaymentDetailModal] = useState<GPHPayment | null>(null);
  const [confirmMarkGPHPaid, setConfirmMarkGPHPaid] = useState<GPHPayment | null>(null);

  async function handleApproveConfirm() {
    if (!payroll) return;
    await handleApprove(payroll.id);
    setConfirmApprove(null);
  }

  async function handleMarkPaidConfirm() {
    if (!payroll) return;

    await handleMarkPaid(payroll.id);
    await refetch();
    setConfirmMarkPaid(null);
  }

  async function handleDeleteConfirm() {
    if (!payroll) return;
    await handleDelete(payroll.id);
    setConfirmDelete(null);
    navigate(ACCOUNTING_PAYROLLS_PAGE_ROUTE);
  }

  async function handleRecalculateConfirm() {
    if (!payroll) return;
    const newId = await handleRecalculate(payroll.id);
    setConfirmRecalculate(null);
    if (newId && newId !== payroll.id) {
      navigate(`/accounting/payrolls/${newId}`, { replace: true });
    }
  }

  async function handleMarkGPHPaidConfirm() {
    if (!confirmMarkGPHPaid) return;

    await handleMarkGPHPaid(confirmMarkGPHPaid.id);
    await refetch();
    setConfirmMarkGPHPaid(null);
  }

  if (isLoading || !payroll) {
    return <PayrollDetailPageSkeleton />;
  }

  return (
    <>
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden min-w-0">
        <div className="h-full min-w-0 flex flex-col">
          <PayrollDetailHeader
            month={payroll.month}
            year={payroll.year}
            status={payroll.status}
            locale={locale}
            onClose={() => navigate(ACCOUNTING_PAYROLLS_PAGE_ROUTE)}
          />

          <div ref={scrollRef} className={cn("flex-1 min-h-0 overflow-y-auto page-scroll", hasScroll && "pr-5")}>
            <div className="flex flex-col gap-3">
              <PayrollSummaryCards
                gross={payroll.total_gross_salary}
                deductions={payroll.total_employee_deductions}
                net={payroll.total_net_salary}
                employerCost={payroll.total_employer_cost}
                gphPayments={payroll.gph_payments}
                status={payroll.status}
                monthWorkDays={payroll.timesheet?.month_work_days || payroll.entries[0]?.month_work_days || 0}
              />

              <AccrualSection
                entries={payroll.entries}
                gphPayments={payroll.gph_payments}
                onViewEntryDetails={(entry) => setEntryDetailModal(entry)}
                onViewGPHDetails={(payment) => setGphPaymentDetailModal(payment)}
                onMarkGPHPaid={(payment) => setConfirmMarkGPHPaid(payment)}
                locale={locale}
                markingGPHPaidId={markingGPHPaidId}
              />

              <div className="grid grid-cols-[2fr_1fr] gap-3">
                <AccountingSection
                  opv={payroll.total_opv}
                  vosms={payroll.total_vosms}
                  ipn={payroll.total_ipn}
                  opvr={payroll.total_opvr}
                  oppv={payroll.total_oppv}
                  so={payroll.total_so}
                  oosms={payroll.total_oosms}
                  sn={payroll.total_sn}
                  totalEmployeeDeductions={payroll.total_employee_deductions}
                  totalEmployerContributions={payroll.total_employer_contributions}
                  gphPayments={payroll.gph_payments}
                />

                <PaymentSection
                  totalNet={payroll.total_net_salary}
                  totalOpv={payroll.total_opv}
                  totalOpvr={payroll.total_opvr}
                  totalVosms={payroll.total_vosms}
                  totalOosms={payroll.total_oosms}
                  totalIpn={payroll.total_ipn}
                  totalSn={payroll.total_sn}
                  totalSo={payroll.total_so}
                  gphPayments={payroll.gph_payments}
                />
              </div>

              <ReportingSection entries={payroll.entries} locale={locale} gphPayments={payroll.gph_payments} />
            </div>
          </div>

          <PayrollDetailActions
            status={payroll.status}
            onApprove={() => setConfirmApprove(payroll.id)}
            onMarkPaid={() => setConfirmMarkPaid(payroll.id)}
            onDelete={() => setConfirmDelete(payroll.id)}
            onRecalculate={() => setConfirmRecalculate(payroll.id)}
            isApproving={isApproving}
            isMarkingPaid={isMarkingPaid}
            isDeleting={isDeleting}
            isRecalculating={isRecalculating}
          />
        </div>
      </section>

      {entryDetailModal && (
        <PayrollEntryDetailModal
          entry={entryDetailModal}
          onClose={() => setEntryDetailModal(null)}
          locale={locale}
          month={payroll.month}
          year={payroll.year}
          payrollStatus={payroll.status}
        />
      )}

      {gphPaymentDetailModal && (
        <GPHPaymentDetailModal payment={gphPaymentDetailModal} onClose={() => setGphPaymentDetailModal(null)} />
      )}

      {prompt && (
        <Prompt
          title={prompt.title}
          text={prompt.text}
          variant={prompt.variant || "success"}
          onClose={() => setPrompt(null)}
          namespace="PayrollPage"
        />
      )}

      {confirmApprove !== null && (
        <PromptForm
          title={t("confirm.approveTitle")}
          text={t("confirm.approveText")}
          variant="warning"
          onClose={() => setConfirmApprove(null)}
          onConfirm={handleApproveConfirm}
          isLoading={isApproving}
          confirmText={t("confirm.approveConfirm")}
          cancelText={t("confirm.cancel")}
          namespace="PayrollPage"
        />
      )}

      {confirmMarkPaid !== null && (
        <PromptForm
          title={t("confirm.markPaidTitle")}
          text={t("confirm.markPaidText")}
          variant="warning"
          onClose={() => setConfirmMarkPaid(null)}
          onConfirm={handleMarkPaidConfirm}
          isLoading={isMarkingPaid}
          confirmText={t("confirm.markPaidConfirm")}
          cancelText={t("confirm.cancel")}
          namespace="PayrollPage"
        />
      )}

      {confirmDelete !== null && (
        <PromptForm
          title={t("confirm.deleteTitle")}
          text={t("confirm.deleteText")}
          variant="error"
          onClose={() => setConfirmDelete(null)}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
          confirmText={t("confirm.deleteConfirm")}
          cancelText={t("confirm.cancel")}
          namespace="PayrollPage"
        />
      )}

      {confirmRecalculate !== null && (
        <PromptForm
          title={t("confirm.recalculateTitle")}
          text={t("confirm.recalculateText")}
          variant="warning"
          onClose={() => setConfirmRecalculate(null)}
          onConfirm={handleRecalculateConfirm}
          isLoading={isRecalculating}
          confirmText={t("confirm.recalculateConfirm")}
          cancelText={t("confirm.cancel")}
          namespace="PayrollPage"
        />
      )}

      {confirmMarkGPHPaid !== null && (
        <PromptForm
          title={t("confirm.gphMarkPaidTitle")}
          text={t("confirm.gphMarkPaidText")}
          variant="warning"
          onClose={() => setConfirmMarkGPHPaid(null)}
          onConfirm={handleMarkGPHPaidConfirm}
          isLoading={isMarkingGPHPaid}
          confirmText={t("confirm.gphMarkPaidConfirm")}
          cancelText={t("confirm.cancel")}
          namespace="PayrollPage"
        />
      )}
    </>
  );
}

