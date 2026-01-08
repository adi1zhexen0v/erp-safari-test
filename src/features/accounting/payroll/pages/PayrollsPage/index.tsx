import { useNavigate } from "react-router";
import cn from "classnames";
import { Pagination } from "@/shared/components";
import { Prompt, PromptForm } from "@/shared/ui";
import { useScrollDetection } from "@/shared/hooks";
import { ACCOUNTING_PAYROLL_DETAIL_PAGE_ROUTE } from "@/shared/utils";
import { usePayrollsListPage, usePayrollModals, usePayrollMutations } from "../../hooks";
import {
  PayrollsHeader,
  PayrollsTable,
  GeneratePayrollModal,
  PayrollsPageSkeleton,
  PayrollsFilter,
} from "./components";

export default function PayrollsPage() {
  const navigate = useNavigate();
  const { scrollRef, hasScroll } = useScrollDetection();

  const {
    data,
    isLoading,
    isError,
    filteredPayrolls,
    pagination,
    pagePayrolls,
    locale,
    t,
    sortConfig,
    handleSort,
    search,
    setSearch,
    dateRange,
    setDateRange,
    statusFilter,
    setStatusFilter,
    statusOptions,
    activeFilters,
    handleResetFilters,
  } = usePayrollsListPage();

  const {
    generateModal,
    setGenerateModal,
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
    generating,
    approvingId,
    markingPaidId,
    deletingId,
    recalculatingId,
    isApproving,
    isMarkingPaid,
    isDeleting,
    isRecalculating,
    handleGenerate,
    handleApprove,
    handleMarkPaid,
    handleDelete,
    handleRecalculate,
  } = usePayrollMutations(setPrompt);

  if (isLoading && !data) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
            <PayrollsHeader onGenerateClick={() => setGenerateModal(true)} />
            <PayrollsPageSkeleton />
          </div>
        </section>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <PayrollsHeader onGenerateClick={() => setGenerateModal(true)} />
          <p className="mt-4 text-body-regular-md text-negative-500">{t("messages.error")}</p>
        </section>
      </>
    );
  }

  async function handleGenerateConfirm(dto: { timesheet_id: number }) {
    await handleGenerate(dto);
    setGenerateModal(false);
  }

  async function handleApproveConfirm(id: number) {
    await handleApprove(id);
    setConfirmApprove(null);
  }

  async function handleMarkPaidConfirm(id: number) {
    await handleMarkPaid(id);
    setConfirmMarkPaid(null);
  }

  async function handleDeleteConfirm(id: number) {
    await handleDelete(id);
    setConfirmDelete(null);
  }

  async function handleRecalculateConfirm(id: number) {
    await handleRecalculate(id);
    setConfirmRecalculate(null);
  }

  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
        <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
          <PayrollsHeader onGenerateClick={() => setGenerateModal(true)} />

          <PayrollsFilter
            search={search}
            onSearchChange={setSearch}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            statusOptions={statusOptions}
            hasActiveFilters={activeFilters}
            onReset={handleResetFilters}
            locale={locale}
          />

          {filteredPayrolls.length === 0 ? (
            <p className="text-body-regular-md content-action-neutral mb-4 mt-4">{t("messages.noResults")}</p>
          ) : (
            <>
              <PayrollsTable
                payrolls={pagePayrolls}
                onOpen={(id) => navigate(ACCOUNTING_PAYROLL_DETAIL_PAGE_ROUTE.replace(":id", String(id)))}
                onApprove={(id) => setConfirmApprove(id)}
                onMarkPaid={(id) => setConfirmMarkPaid(id)}
                onDelete={(id) => setConfirmDelete(id)}
                onRecalculate={(id) => setConfirmRecalculate(id)}
                sortConfig={sortConfig}
                onSort={handleSort}
                approvingId={approvingId}
                markingPaidId={markingPaidId}
                deletingId={deletingId}
                recalculatingId={recalculatingId}
              />

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={pagination.setPage}
                fromItem={pagination.fromItem}
                toItem={pagination.toItem}
                total={filteredPayrolls.length}
              />
            </>
          )}
        </div>
      </section>

      {generateModal && (
        <GeneratePayrollModal
          isOpen={generateModal}
          onClose={() => setGenerateModal(false)}
          onConfirm={handleGenerateConfirm}
          isLoading={generating}
          payrolls={data}
        />
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
          onConfirm={() => handleApproveConfirm(confirmApprove)}
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
          onConfirm={() => handleMarkPaidConfirm(confirmMarkPaid)}
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
          onConfirm={() => handleDeleteConfirm(confirmDelete)}
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
          onConfirm={() => handleRecalculateConfirm(confirmRecalculate)}
          isLoading={isRecalculating}
          confirmText={t("confirm.recalculateConfirm")}
          cancelText={t("confirm.cancel")}
          namespace="PayrollPage"
        />
      )}
    </>
  );
}
