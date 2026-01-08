import { useState } from "react";
import { useNavigate } from "react-router";
import cn from "classnames";
import { Pagination } from "@/shared/components";
import { Prompt, PromptForm } from "@/shared/ui";
import { useScrollDetection } from "@/shared/hooks";
import { ACCOUNTING_TIMESHEET_DETAIL_PAGE_ROUTE } from "@/shared/utils";
import { useTimesheetsListPage, useTimesheetModals, useTimesheetMutations, useTimesheetDownloads } from "../../hooks";
import {
  TimesheetsHeader,
  TimesheetsTable,
  GenerateTimesheetPrompt,
  TimesheetsPageSkeleton,
  TimesheetsFilter,
} from "./components";

export default function TimesheetsPage() {
  const navigate = useNavigate();
  const { scrollRef, hasScroll } = useScrollDetection();

  const {
    data,
    isLoading,
    isError,
    filteredTimesheets,
    pagination,
    pageTimesheets,
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
  } = useTimesheetsListPage();

  const { generateModal, setGenerateModal, prompt, setPrompt } = useTimesheetModals();

  const { generating, isApproving, isDeleting, handleGenerate, handleApprove, handleDelete } =
    useTimesheetMutations(setPrompt);

  const { handleDownloadDocx } = useTimesheetDownloads(setPrompt);

  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmApprove, setConfirmApprove] = useState<number | null>(null);

  if (isLoading && !data) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
            <TimesheetsHeader onGenerateClick={() => setGenerateModal(true)} />
            <TimesheetsPageSkeleton />
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
          <TimesheetsHeader onGenerateClick={() => setGenerateModal(true)} />
          <p className="mt-4 text-body-regular-md text-negative-500">{t("messages.error")}</p>
        </section>
      </>
    );
  }

  async function handleGenerateConfirm(dto: { year: number; month: number }) {
    await handleGenerate(dto);
    setGenerateModal(false);
  }

  async function handleApproveConfirm(id: number) {
    await handleApprove(id);
    setConfirmApprove(null);
  }

  async function handleDeleteConfirm(id: number) {
    await handleDelete(id);
    setConfirmDelete(null);
  }

  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
        <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
          <TimesheetsHeader onGenerateClick={() => setGenerateModal(true)} />

          <TimesheetsFilter
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

          {filteredTimesheets.length === 0 ? (
            <p className="text-body-regular-md content-action-neutral mb-4 mt-4">{t("messages.noResults")}</p>
          ) : (
            <>
              <TimesheetsTable
                timesheets={pageTimesheets}
                onOpen={(id) => navigate(ACCOUNTING_TIMESHEET_DETAIL_PAGE_ROUTE.replace(":id", String(id)))}
                onApprove={(id) => setConfirmApprove(id)}
                onDelete={(id) => setConfirmDelete(id)}
                onDownload={handleDownloadDocx}
                sortConfig={sortConfig}
                onSort={handleSort}
              />

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={pagination.setPage}
                fromItem={pagination.fromItem}
                toItem={pagination.toItem}
                total={filteredTimesheets.length}
              />
            </>
          )}
        </div>
      </section>

      {generateModal && (
        <GenerateTimesheetPrompt
          isOpen={generateModal}
          onClose={() => setGenerateModal(false)}
          onConfirm={handleGenerateConfirm}
          isLoading={generating}
          timesheets={data}
        />
      )}

      {prompt && (
        <Prompt
          title={prompt.title}
          text={prompt.text}
          variant={prompt.variant || "success"}
          onClose={() => setPrompt(null)}
          namespace="TimesheetsPage"
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
          namespace="TimesheetsPage"
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
          namespace="TimesheetsPage"
        />
      )}
    </>
  );
}

