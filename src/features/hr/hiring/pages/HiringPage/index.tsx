import { useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useScrollDetection } from "@/shared/hooks";
import { Pagination } from "@/shared/components";
import { Prompt } from "@/shared/ui";
import {
  useHiringListPage,
  useHiringModals,
  useHiringMutations,
  useHiringDownloads,
  useHiringActions,
} from "@/features/hr/hiring";
import {
  CreateInvitationForm,
  HiringCardsView,
  HiringFilter,
  HiringHeader,
  HiringPageSkeleton,
  HiringTableView,
  HiringViewToggle,
} from "./components";

export default function HiringPage() {
  const { scrollRef, hasScroll } = useScrollDetection();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const pageData = useHiringListPage();

  const modals = useHiringModals();
  const mutations = useHiringMutations(modals.setPrompt);
  const downloads = useHiringDownloads(modals.setPrompt);
  const actions = useHiringActions(mutations, modals);

  const { t } = useTranslation("HiringPage");

  if (pageData.isLoading && !pageData.data) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden min-w-0">
          <div ref={scrollRef} className={cn("h-full page-scroll min-w-0", hasScroll && "pr-5")}>
            <HiringHeader onOpenInvite={() => setInviteOpen(true)} />
            <HiringFilter
              search={pageData.search}
              onSearchChange={pageData.setSearch}
              range={pageData.dateRange}
              onRangeChange={pageData.setDateRange}
              statusFilter={pageData.statusFilter}
              onStatusChange={pageData.setStatusFilter}
              statusOptions={pageData.statusOptions}
              hasActiveFilters={pageData.activeFilters}
              onReset={pageData.handleResetFilters}
              locale={pageData.locale}
              disabled
            />
            <HiringPageSkeleton />
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
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden min-w-0">
          <HiringHeader onOpenInvite={() => setInviteOpen(true)} />
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
        {inviteOpen && (
          <CreateInvitationForm
            onClose={() => setInviteOpen(false)}
            onSuccess={() => {
              setInviteOpen(false);
              setInviteSuccess(true);
            }}
          />
        )}

        {inviteSuccess && (
          <Prompt
            title={t("invite.successTitle")}
            text={t("invite.successText")}
            onClose={() => setInviteSuccess(false)}
          />
        )}

        {downloads.downloadingId && (
          <Prompt
            loaderMode={true}
            loaderText={t("messages.waitingForDownload")}
            title=""
            text=""
            onClose={() => {}}
            namespace="HiringPage"
          />
        )}

        {modals.prompt && (
          <Prompt
            title={modals.prompt.title}
            text={modals.prompt.text}
            variant={modals.prompt.variant || "success"}
            onClose={() => modals.setPrompt(null)}
          />
        )}

        {(mutations.reviewingApplicationId !== null || mutations.rejectingApplicationId !== null) && (
          <Prompt
            loaderMode={true}
            loaderText={t("modals.sending")}
            title=""
            text=""
            onClose={() => {}}
            namespace="HiringPage"
          />
        )}

        <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
          <HiringHeader onOpenInvite={() => setInviteOpen(true)} />

          <HiringFilter
            search={pageData.search}
            onSearchChange={pageData.setSearch}
            range={pageData.dateRange}
            onRangeChange={pageData.setDateRange}
            statusFilter={pageData.statusFilter}
            onStatusChange={pageData.setStatusFilter}
            statusOptions={pageData.statusOptions}
            hasActiveFilters={pageData.activeFilters}
            onReset={pageData.handleResetFilters}
            locale={pageData.locale}
          />

          <HiringViewToggle
            view={pageData.view}
            onChange={pageData.setView}
            amountOfApplications={pageData.filteredApplications.length}
          />

          {pageData.filteredApplications.length === 0 ? (
            <p className="text-body-regular-md content-action-neutral mb-4">{t("messages.noResults")}</p>
          ) : pageData.view === "table" ? (
            <HiringTableView
              applications={pageData.pageApplications}
              rowStates={pageData.rowStates}
              headerState={pageData.headerState}
              onToggleRow={pageData.onToggleRow}
              onToggleHeader={pageData.onToggleHeader}
              sortConfig={pageData.sortConfig}
              onSort={pageData.handleSort}
              locale={pageData.locale}
              onDownloadProfile={downloads.handleDownloadProfile}
              isDownloading={downloads.isDownloading}
              actions={actions}
              modals={modals}
              mutations={mutations}
            />
          ) : (
            <HiringCardsView
              applications={pageData.pageApplications}
              onDownloadProfile={downloads.handleDownloadProfile}
              isDownloading={downloads.isDownloading}
              actions={actions}
              modals={modals}
              mutations={mutations}
            />
          )}

          <Pagination
            currentPage={pageData.pagination.page}
            totalPages={pageData.pagination.totalPages}
            onPageChange={pageData.pagination.setPage}
            fromItem={pageData.pagination.fromItem}
            toItem={pageData.pagination.toItem}
            total={pageData.filteredApplications.length}
          />
        </div>
      </section>
    </>
  );
}
