import { useMemo } from "react";
import cn from "classnames";
import { Pagination } from "@/shared/components";
import { Prompt } from "@/shared/ui";
import { useScrollDetection } from "@/shared/hooks";
import { CreateLeaveForm, CreateMedicalLeaveForm } from "@/features/hr/leave-applications";
import { CreateResignationForm } from "@/features/hr/resignation-letters";
import { ContractChangesModal } from "@/features/hr/amendments";
import { useEmployeesListPage } from "../../hooks";
import type { WorkerListItem } from "../../types";
import {
  EmployeesFilter,
  EmployeesHeader,
  EmployeesSummaryCards,
  EmployeesTableSkeleton,
  EmployeesTableView,
  EmployeesViewToggle,
  EmployeesCardsView,
} from "./components";

export default function EmployeesPage() {
  const { scrollRef, hasScroll } = useScrollDetection();

  const pageData = useEmployeesListPage();

  const summaryStats = useMemo(() => {
    const employees = pageData.data || [];
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((emp: WorkerListItem) => emp.status === "active").length;
    const totalSalary = employees.reduce((sum: number, emp: WorkerListItem) => {
      const salary = emp.active_contract?.salary_amount;
      if (salary) {
        const numSalary = typeof salary === "string" ? parseFloat(salary) : salary;
        return sum + (isNaN(numSalary) ? 0 : numSalary);
      }
      return sum;
    }, 0);

    return {
      totalEmployees,
      activeEmployees,
      totalSalary: Math.round(totalSalary),
    };
  }, [pageData.data]);
  if (pageData.isLoading && !pageData.data) {
    return (
      <>
        <title>{pageData.t("meta.title")}</title>
        <meta name="description" content={pageData.t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden min-w-0">
          <div ref={scrollRef} className={cn("h-full page-scroll min-w-0 overflow-x-hidden", hasScroll && "pr-5")}>
            <EmployeesHeader />
            <EmployeesSummaryCards
              totalEmployees={summaryStats.totalEmployees}
              activeEmployees={summaryStats.activeEmployees}
              totalSalary={summaryStats.totalSalary}
            />
            <EmployeesFilter
              search={pageData.search}
              onSearchChange={pageData.setSearch}
              hireDateRange={pageData.hireDateRange}
              onHireDateRangeChange={pageData.setHireDateRange}
              statusFilter={pageData.statusFilter}
              onStatusChange={pageData.setStatusFilter}
              statusOptions={pageData.statusOptions}
              hasActiveFilters={pageData.activeFilters}
              onReset={pageData.handleResetFilters}
              locale={pageData.locale}
              disabled
            />
            <EmployeesTableSkeleton />
          </div>
        </section>
      </>
    );
  }

  if (pageData.isError) {
    return (
      <>
        <title>{pageData.t("meta.title")}</title>
        <meta name="description" content={pageData.t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <EmployeesHeader />
          <p className="mt-4 text-body-regular-md text-negative-500">{pageData.t("messages.error")}</p>
        </section>
      </>
    );
  }

  return (
    <>
      <title>{pageData.t("meta.title")}</title>
      <meta name="description" content={pageData.t("meta.description")} />

      {pageData.isDownloadingProfile && pageData.downloadingId && (
        <Prompt
          loaderMode={true}
          loaderText={pageData.t("messages.waitingForDownload")}
          title=""
          text=""
          onClose={() => {}}
          namespace="EmployeesPage"
        />
      )}

      {pageData.prompt && (
        <Prompt
          title={pageData.prompt.title}
          text={pageData.prompt.text}
          variant={pageData.prompt.variant || "success"}
          onClose={() => pageData.setPrompt(null)}
        />
      )}

      {pageData.leaveFormSuccess && (
        <Prompt
          title={pageData.t("leaveForm.successTitle")}
          text={pageData.t("leaveForm.successText")}
          variant="success"
          onClose={() => pageData.setLeaveFormSuccess(false)}
        />
      )}

      {pageData.medicalLeaveFormSuccess && (
        <Prompt
          title={pageData.t("leaveForm.successTitle")}
          text={pageData.t("leaveForm.successText")}
          variant="success"
          onClose={() => pageData.setMedicalLeaveFormSuccess(false)}
        />
      )}

      {pageData.resignationFormSuccess && (
        <Prompt
          title={pageData.t("resignationForm.successTitle")}
          text={pageData.t("resignationForm.successText")}
          variant="success"
          onClose={() => pageData.setResignationFormSuccess(false)}
        />
      )}

      {pageData.leaveFormEmployee && (
        <CreateLeaveForm
          employee={pageData.leaveFormEmployee}
          onClose={() => pageData.setLeaveFormEmployee(null)}
          onSuccess={() => {
            pageData.setLeaveFormEmployee(null);
            pageData.setLeaveFormSuccess(true);
          }}
        />
      )}

      {pageData.medicalLeaveFormEmployee && (
        <CreateMedicalLeaveForm
          employee={pageData.medicalLeaveFormEmployee}
          onClose={() => pageData.setMedicalLeaveFormEmployee(null)}
          onSuccess={() => {
            pageData.setMedicalLeaveFormEmployee(null);
            pageData.setMedicalLeaveFormSuccess(true);
          }}
        />
      )}

      {pageData.resignationFormEmployee && (
        <CreateResignationForm
          employee={pageData.resignationFormEmployee}
          onClose={() => pageData.setResignationFormEmployee(null)}
          onSuccess={() => {
            pageData.setResignationFormEmployee(null);
            pageData.setResignationFormSuccess(true);
          }}
        />
      )}

      {pageData.contractChangesEmployee && (
        <ContractChangesModal
          employee={pageData.contractChangesEmployee}
          onClose={() => pageData.setContractChangesEmployee(null)}
        />
      )}

      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden min-w-0">
        <div ref={scrollRef} className={cn("h-full page-scroll min-w-0 overflow-x-hidden", hasScroll && "pr-5")}>
          <EmployeesHeader />
          <EmployeesSummaryCards
            totalEmployees={summaryStats.totalEmployees}
            activeEmployees={summaryStats.activeEmployees}
            totalSalary={summaryStats.totalSalary}
          />

          <EmployeesFilter
            search={pageData.search}
            onSearchChange={pageData.setSearch}
            hireDateRange={pageData.hireDateRange}
            onHireDateRangeChange={pageData.setHireDateRange}
            statusFilter={pageData.statusFilter}
            onStatusChange={pageData.setStatusFilter}
            statusOptions={pageData.statusOptions}
            hasActiveFilters={pageData.activeFilters}
            onReset={pageData.handleResetFilters}
            locale={pageData.locale}
          />

          <EmployeesViewToggle
            view={pageData.view}
            onChange={pageData.setView}
            amountOfEmployees={pageData.sortedWorkers.length}
          />

          {pageData.sortedWorkers.length === 0 ? (
            <p className="text-body-regular-md content-action-neutral mb-4">{pageData.t("messages.noResults")}</p>
          ) : pageData.view === "table" ? (
            <EmployeesTableView
              employees={pageData.pageWorkers}
              rowStates={pageData.rowStates}
              headerState={pageData.headerState}
              onToggleRow={pageData.onToggleRow}
              onToggleHeader={pageData.onToggleHeader}
              sortConfig={pageData.sortConfig}
              onSort={pageData.handleSort}
              onDownloadProfile={pageData.handleDownloadProfile}
              isDownloading={pageData.isDownloadingProfile}
              onOpenLeaveForm={(employee) => pageData.setLeaveFormEmployee(employee)}
              onOpenMedicalLeaveForm={(employee) => pageData.setMedicalLeaveFormEmployee(employee)}
              onOpenResignationForm={(employee) => pageData.setResignationFormEmployee(employee)}
              onOpenContractChanges={(employee) => pageData.setContractChangesEmployee(employee)}
            />
          ) : (
            <EmployeesCardsView
              employees={pageData.pageWorkers}
              onDownloadProfile={pageData.handleDownloadProfile}
              isDownloading={pageData.isDownloadingProfile}
              onOpenLeaveForm={(employee) => pageData.setLeaveFormEmployee(employee)}
              onOpenMedicalLeaveForm={(employee) => pageData.setMedicalLeaveFormEmployee(employee)}
              onOpenResignationForm={(employee) => pageData.setResignationFormEmployee(employee)}
              onOpenContractChanges={(employee) => pageData.setContractChangesEmployee(employee)}
            />
          )}

          <Pagination
            currentPage={pageData.pagination.page}
            totalPages={pageData.pagination.totalPages}
            onPageChange={pageData.pagination.setPage}
            fromItem={pageData.pagination.fromItem}
            toItem={pageData.pagination.toItem}
            total={pageData.sortedWorkers.length}
          />
        </div>
      </section>
    </>
  );
}
