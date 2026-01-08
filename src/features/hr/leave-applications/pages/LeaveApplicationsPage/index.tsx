import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useScrollDetection } from "@/shared/hooks";
import type { WorkerListItem } from "@/features/hr/employees";
import { useLeaveApplicationsListPage, type LeaveApplication } from "@/features/hr/leave-applications";
import { Pagination } from "@/shared/components";
import {
  LeaveApplicationsHeader,
  LeaveApplicationsFilter,
  LeaveApplicationsViewToggle,
  LeaveApplicationsCardsView,
  LeaveApplicationsTableView,
  LeaveApplicationsPageSkeleton,
  EditLeaveModal,
} from "./components";

export default function LeaveApplicationsPage() {
  const { scrollRef, hasScroll } = useScrollDetection();

  const { t } = useTranslation("LeaveApplicationsPage");

  const pageData = useLeaveApplicationsListPage();

  const [editLeave, setEditLeave] = useState<LeaveApplication | null>(null);

  function handleEdit(leave: LeaveApplication) {
    setEditLeave(leave);
  }

  const editEmployee: WorkerListItem | null = useMemo(() => {
    if (!editLeave) return null;
    return {
      id: editLeave.worker.id,
      full_name: editLeave.worker.full_name,
      active_contract: {
        work_position: editLeave.worker.job_position || "",
      },
    } as WorkerListItem;
  }, [editLeave]);

  function handleCloseEditModal() {
    setEditLeave(null);
  }

  function handleEditSuccess() {
    setEditLeave(null);
  }

  if (pageData.isLoading && pageData.allLeaves.length === 0) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden min-w-0">
          <div ref={scrollRef} className={cn("h-full page-scroll min-w-0", hasScroll && "pr-5")}>
            <LeaveApplicationsHeader />
            <LeaveApplicationsFilter
              search={pageData.search}
              onSearchChange={pageData.setSearch}
              dateRange={pageData.dateRange}
              onDateRangeChange={pageData.setDateRange}
              statusFilter={pageData.statusFilter}
              onStatusChange={pageData.setStatusFilter}
              statusOptions={pageData.statusOptions}
              hasActiveFilters={pageData.activeFilters}
              onReset={pageData.handleResetFilters}
              locale={pageData.locale}
              disabled
            />
            <LeaveApplicationsPageSkeleton />
          </div>
        </section>
      </>
    );
  }

  if (pageData.isError) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <LeaveApplicationsHeader />
          <p className="mt-4 text-body-regular-md text-negative-500">{t("messages.error")}</p>
        </section>
      </>
    );
  }

  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />

      {editLeave && editEmployee && (
        <EditLeaveModal
          leave={editLeave}
          employee={editEmployee}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
        />
      )}

      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden min-w-0">
        <div ref={scrollRef} className={cn("h-full page-scroll min-w-0", hasScroll && "pr-5")}>
          <LeaveApplicationsHeader />

          <LeaveApplicationsFilter
            search={pageData.search}
            onSearchChange={pageData.setSearch}
            dateRange={pageData.dateRange}
            onDateRangeChange={pageData.setDateRange}
            statusFilter={pageData.statusFilter}
            onStatusChange={pageData.setStatusFilter}
            statusOptions={pageData.statusOptions}
            hasActiveFilters={pageData.activeFilters}
            onReset={pageData.handleResetFilters}
            locale={pageData.locale}
          />

          <LeaveApplicationsViewToggle
            view={pageData.view}
            onChange={pageData.setView}
            amountOfLeaves={pageData.filteredLeaves.length}
          />

          {pageData.filteredLeaves.length === 0 ? (
            <p className="text-body-regular-md content-action-neutral mb-4">{t("messages.noResults")}</p>
          ) : pageData.view === "table" ? (
            <LeaveApplicationsTableView
              leaves={pageData.pageLeaves}
              rowStates={pageData.rowStates}
              headerState={pageData.headerState}
              onToggleRow={pageData.onToggleRow}
              onToggleHeader={pageData.onToggleHeader}
              sortConfig={pageData.sortConfig}
              onSort={pageData.handleSort}
              locale={pageData.locale}
              onEdit={handleEdit}
            />
          ) : (
            <LeaveApplicationsCardsView leaves={pageData.pageLeaves} locale={pageData.locale} onEdit={handleEdit} />
          )}

          <Pagination
            currentPage={pageData.pagination.page}
            totalPages={pageData.pagination.totalPages}
            onPageChange={pageData.pagination.setPage}
            fromItem={pageData.pagination.fromItem}
            toItem={pageData.pagination.toItem}
            total={pageData.filteredLeaves.length}
          />
        </div>
      </section>
    </>
  );
}

