import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useScrollDetection } from "@/shared/hooks";
import { Pagination } from "@/shared/components";
import { getUniqueTrustMeStatuses } from "@/shared/utils";
import type { Locale } from "@/shared/utils/types";
import { useGetAllLegalDocumentsQuery } from "../../api";
import { useGetCompletionActListQuery } from "../../documents/CompletionActForm";
import type { CompletionActListItem } from "../../documents/CompletionActForm/types";
import { LegalDocumentType } from "../../types/documentTypes";
import { TRUSTME_STATUS } from "../consts";
import { ApplicationsHeader, ApplicationsCardsView, ApplicationsPageSkeleton, ApplicationsFilter } from "./components";
import type { DocumentTypeOption, StatusOption } from "./components/ApplicationsFilter";

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeDateToStartOfDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function normalizeDateToEndOfDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(23, 59, 59, 999);
  return normalized;
}

function filterBySearch(doc: { id?: number }, searchTerm: string): boolean {
  if (!searchTerm) return true;
  const docId = String(doc.id ?? "");
  return docId.includes(searchTerm);
}

function filterByType(item: { type: LegalDocumentType }, filter: LegalDocumentType | null): boolean {
  return !filter || item.type === filter;
}

function filterByStatus(doc: { trustme_status: number | null }, filter: string | null): boolean {
  if (!filter) return true;
  if (filter === "null") {
    return doc.trustme_status === TRUSTME_STATUS.DRAFT;
  }
  return doc.trustme_status === Number(filter);
}

function filterByDate(createdAt: string, dateRange: { start: Date | null; end: Date | null }): boolean {
  const createdDate = parseDate(createdAt);
  if (!createdDate) {
    return !dateRange.start && !dateRange.end;
  }
  if (dateRange.start && createdDate < normalizeDateToStartOfDay(dateRange.start)) {
    return false;
  }
  if (dateRange.end && createdDate > normalizeDateToEndOfDay(dateRange.end)) {
    return false;
  }
  return true;
}

function sortDocumentsByDate(a: { doc: { created_at: string } }, b: { doc: { created_at: string } }): number {
  const dateA = new Date(a.doc.created_at).getTime();
  const dateB = new Date(b.doc.created_at).getTime();
  return dateB - dateA;
}

export default function LegalApplicationsPage() {
  const { scrollRef, hasScroll } = useScrollDetection();
  const { t, i18n } = useTranslation("LegalApplicationsPage");
  const { t: tTemplates } = useTranslation("LegalTemplatesPage");
  const locale = i18n.language as Locale;

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [documentTypeFilter, setDocumentTypeFilter] = useState<LegalDocumentType | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  const { data, isLoading, error } = useGetAllLegalDocumentsQuery();
  const { data: completionActs = [] } = useGetCompletionActListQuery();

  const completionActsByContract = useMemo(() => {
    const map = new Map<number, CompletionActListItem[]>();
    completionActs.forEach((act) => {
      const contractId = act.parent_contract.id;
      const existing = map.get(contractId) || [];
      map.set(contractId, [...existing, act]);
    });
    return map;
  }, [completionActs]);

  const documentTypeOptions: DocumentTypeOption[] = useMemo(() => {
    return [
      { label: tTemplates("templates.vehicleRent.title"), value: LegalDocumentType.VEHICLE_RENTAL },
      { label: tTemplates("templates.commercialPremiseRent.title"), value: LegalDocumentType.PREMISES_LEASE },
      {
        label: tTemplates("templates.serviceContract.title"),
        value: LegalDocumentType.SERVICE_AGREEMENT_INDIVIDUAL,
      },
      { label: tTemplates("templates.paidService.title"), value: LegalDocumentType.SERVICE_AGREEMENT_MSB },
      { label: tTemplates("templates.supplyContract.title"), value: LegalDocumentType.GOODS_SUPPLY },
      { label: t("filters.documentTypes.vehicleHandover"), value: LegalDocumentType.VEHICLE_HANDOVER },
      { label: t("filters.documentTypes.premisesHandover"), value: LegalDocumentType.PREMISES_HANDOVER },
    ];
  }, [tTemplates, t]);

  const statusOptions: StatusOption[] = useMemo(() => {
    if (!data) return [];
    const allDocsWithStatus = [
      ...data.vehicle_rentals,
      ...data.premises_leases,
      ...data.service_agreements_individual,
      ...data.service_agreements_msb,
      ...data.goods_supply,
      ...data.vehicle_handovers,
      ...data.premises_handovers,
    ];
    return getUniqueTrustMeStatuses(allDocsWithStatus, locale);
  }, [data, locale]);

  const allDocuments = useMemo(() => {
    if (!data) return [];

    const vehicleRentalActsCount = new Map<number, number>();
    data.vehicle_handovers.forEach((act) => {
      const count = vehicleRentalActsCount.get(act.parent_contract) || 0;
      vehicleRentalActsCount.set(act.parent_contract, count + 1);
    });

    const premisesLeaseActsCount = new Map<number, number>();
    data.premises_handovers.forEach((act) => {
      const count = premisesLeaseActsCount.get(act.parent_contract) || 0;
      premisesLeaseActsCount.set(act.parent_contract, count + 1);
    });

    return [
      ...data.vehicle_rentals.map((doc) => ({
        doc,
        type: LegalDocumentType.VEHICLE_RENTAL,
        actsCount: vehicleRentalActsCount.get(doc.id) || 0,
      })),
      ...data.premises_leases.map((doc) => ({
        doc,
        type: LegalDocumentType.PREMISES_LEASE,
        actsCount: premisesLeaseActsCount.get(doc.id) || 0,
      })),
      ...data.service_agreements_individual.map((doc) => ({
        doc,
        type: LegalDocumentType.SERVICE_AGREEMENT_INDIVIDUAL,
        completionActs: completionActsByContract.get(doc.id) || [],
      })),
      ...data.service_agreements_msb.map((doc) => ({ doc, type: LegalDocumentType.SERVICE_AGREEMENT_MSB })),
      ...data.goods_supply.map((doc) => ({ doc, type: LegalDocumentType.GOODS_SUPPLY })),
    ];
  }, [data, completionActsByContract]);

  const filteredDocuments = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const result = allDocuments.filter((item) => {
      const matchesSearch = filterBySearch(item.doc, searchTerm);
      const matchesDocumentType = filterByType(item, documentTypeFilter);
      const matchesStatus = filterByStatus(item.doc, statusFilter);
      const matchesDate = filterByDate(item.doc.created_at, dateRange);

      return matchesSearch && matchesDocumentType && matchesStatus && matchesDate;
    });

    result.sort(sortDocumentsByDate);

    return result;
  }, [allDocuments, search, documentTypeFilter, statusFilter, dateRange]);

  const pageSize = 10;
  const [page, setPage] = useState(1);

  const total = filteredDocuments.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPage(1);
  }, [search, dateRange, documentTypeFilter, statusFilter]);

  useEffect(() => {
    if (!data) return;
    setIsFiltering(true);
    const timeout = setTimeout(() => {
      setIsFiltering(false);
    }, 150);
    return () => clearTimeout(timeout);
  }, [search, dateRange, documentTypeFilter, statusFilter, data]);

  const startIndex = (page - 1) * pageSize;
  const pageDocuments = filteredDocuments.slice(startIndex, startIndex + pageSize);

  const fromItem = total === 0 ? 0 : startIndex + 1;
  const toItem = Math.min(total, startIndex + pageSize);

  const hasActiveFilters = search.trim() || dateRange.start || dateRange.end || documentTypeFilter || statusFilter;
  const showSkeleton = isFiltering;
  const showNoResults = !isFiltering && filteredDocuments.length === 0;
  const showDocuments = !isFiltering && filteredDocuments.length > 0;

  function handleResetFilters() {
    setSearch("");
    setDateRange({ start: null, end: null });
    setDocumentTypeFilter(null);
    setStatusFilter(null);
    setPage(1);
  }

  if (isLoading && !data) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
            <ApplicationsHeader />

            <ApplicationsFilter
              search={search}
              onSearchChange={setSearch}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              documentTypeFilter={documentTypeFilter}
              onDocumentTypeChange={setDocumentTypeFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              documentTypeOptions={documentTypeOptions}
              statusOptions={statusOptions}
              hasActiveFilters={!!hasActiveFilters}
              onReset={handleResetFilters}
              locale={locale}
              disabled
            />

            <ApplicationsPageSkeleton />
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <ApplicationsHeader />
          <p className="mt-4 text-body-regular-md content-base-primary">{t("messages.error")}</p>
        </section>
      </>
    );
  }

  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
        <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
          <ApplicationsHeader />

          <ApplicationsFilter
            search={search}
            onSearchChange={setSearch}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            documentTypeFilter={documentTypeFilter}
            onDocumentTypeChange={setDocumentTypeFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            documentTypeOptions={documentTypeOptions}
            statusOptions={statusOptions}
            hasActiveFilters={!!hasActiveFilters}
            onReset={handleResetFilters}
            locale={locale}
          />

          {showSkeleton && <ApplicationsPageSkeleton />}

          {showNoResults && (
            <p className="text-body-regular-md content-action-neutral mb-4">{t("messages.noResults")}</p>
          )}

          {showDocuments && <ApplicationsCardsView documents={pageDocuments} />}

          {!isFiltering && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              fromItem={fromItem}
              toItem={toItem}
              total={total}
            />
          )}
        </div>
      </section>
    </>
  );
}

