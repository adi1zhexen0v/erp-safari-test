import cn from "classnames";
import { Pagination } from "@/shared/components";
import { useScrollDetection } from "@/shared/hooks";
import { useContractsListPage } from "@/features/hr/contracts/hooks";
import {
  ContractsCardsView,
  ContractsFilter,
  ContractsHeader,
  ContractsPageSkeleton,
  ContractsTableView,
  ContractsViewToggle,
} from "./components";

export default function ContractsListPage() {
  const { scrollRef, hasScroll } = useScrollDetection();

  const {
    data,
    isLoading,
    isError,
    refetchContracts,
    search,
    setSearch,
    managerSignedDateRange,
    setManagerSignedDateRange,
    employeeSignedDateRange,
    setEmployeeSignedDateRange,
    startDateRange,
    setStartDateRange,
    statusFilter,
    setStatusFilter,
    statusOptions,
    activeFilters,
    view,
    setView,
    locale,
    sortConfig,
    handleSort,
    filteredContracts,
    pageContracts,
    rowStates,
    onToggleRow,
    headerState,
    onToggleHeader,
    pagination,
    handleResetFilters,
    t,
  } = useContractsListPage();

  if (isLoading && !data) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden min-w-0">
          <div ref={scrollRef} className={cn("h-full page-scroll min-w-0", hasScroll && "pr-5")}>
            <ContractsHeader />

            <ContractsFilter
              search={search}
              onSearchChange={setSearch}
              managerSignedDateRange={managerSignedDateRange}
              onManagerSignedDateRangeChange={setManagerSignedDateRange}
              employeeSignedDateRange={employeeSignedDateRange}
              onEmployeeSignedDateRangeChange={setEmployeeSignedDateRange}
              startDateRange={startDateRange}
              onStartDateRangeChange={setStartDateRange}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              statusOptions={statusOptions}
              hasActiveFilters={activeFilters}
              onReset={handleResetFilters}
              locale={locale}
              disabled
            />

            <ContractsPageSkeleton />
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
          <ContractsHeader />
          <p className="mt-4 text-body-regular-md text-negative-500">{t("messages.error")}</p>
        </section>
      </>
    );
  }

  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden min-w-0">
        <div ref={scrollRef} className={cn("h-full page-scroll min-w-0", hasScroll && "pr-5")}>
          <ContractsHeader />

          <ContractsFilter
            search={search}
            onSearchChange={setSearch}
            managerSignedDateRange={managerSignedDateRange}
            onManagerSignedDateRangeChange={setManagerSignedDateRange}
            employeeSignedDateRange={employeeSignedDateRange}
            onEmployeeSignedDateRangeChange={setEmployeeSignedDateRange}
            startDateRange={startDateRange}
            onStartDateRangeChange={setStartDateRange}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            statusOptions={statusOptions}
            hasActiveFilters={activeFilters}
            onReset={handleResetFilters}
            locale={locale}
          />

          <ContractsViewToggle view={view} onChange={setView} amountOfContracts={filteredContracts.length} />

          {filteredContracts.length === 0 ? (
            <p className="text-body-regular-md content-action-neutral mb-4">{t("messages.noResults")}</p>
          ) : view === "table" ? (
            <ContractsTableView
              contracts={pageContracts.map((g) => g.contract)}
              rowStates={rowStates}
              headerState={headerState}
              onToggleRow={onToggleRow}
              onToggleHeader={onToggleHeader}
              sortConfig={sortConfig}
              onSort={handleSort}
              locale={locale}
            />
          ) : (
            <ContractsCardsView contracts={pageContracts} locale={locale} refetchContracts={refetchContracts} />
          )}

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
            fromItem={pagination.fromItem}
            toItem={pagination.toItem}
            total={filteredContracts.length}
          />
        </div>
      </section>
    </>
  );
}

