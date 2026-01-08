import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Refresh2 } from "iconsax-react";
import { LegalDocumentType } from "@/features/legal/types/documentTypes";
import { SearchIcon } from "@/shared/assets/icons";
import { DatePicker, Input, Select } from "@/shared/ui";
import type { Locale } from "@/shared/utils/types";

export interface DocumentTypeOption {
  label: string;
  value: LegalDocumentType;
}

export interface StatusOption {
  label: string;
  value: string;
}

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  dateRange: { start: Date | null; end: Date | null };
  onDateRangeChange: (r: { start: Date | null; end: Date | null }) => void;
  documentTypeFilter: LegalDocumentType | null;
  onDocumentTypeChange: (v: LegalDocumentType | null) => void;
  statusFilter: string | null;
  onStatusChange: (v: string | null) => void;
  documentTypeOptions: DocumentTypeOption[];
  statusOptions: StatusOption[];
  hasActiveFilters: boolean;
  onReset: () => void;
  locale: Locale;
  disabled?: boolean;
}

export default function ApplicationsFilter({
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  documentTypeFilter,
  onDocumentTypeChange,
  statusFilter,
  onStatusChange,
  documentTypeOptions,
  statusOptions,
  hasActiveFilters,
  onReset,
  locale,
  disabled = false,
}: Props) {
  const { t } = useTranslation("LegalApplicationsPage");

  return (
    <div
      className={cn(
        "grid p-5 border surface-base-stroke surface-tertiary-fill gap-2 radius-lg mb-4 items-stretch mt-7",
        hasActiveFilters ? "grid-cols-[323fr_240fr_240fr_240fr_174px]" : "grid-cols-[323fr_240fr_240fr_240fr]",
      )}>
      <Input
        placeholder={t("filters.searchPlaceholder")}
        className="rounded-xl!"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        icon={<SearchIcon size={16} />}
        disabled={disabled}
      />

      <Select<LegalDocumentType>
        options={documentTypeOptions}
        placeholder={t("filters.documentType")}
        value={documentTypeFilter}
        onChange={(v) => onDocumentTypeChange(v)}
        disabled={disabled}
      />

      <Select<string>
        options={statusOptions}
        placeholder={t("filters.status")}
        value={statusFilter}
        onChange={(v) => onStatusChange(v)}
        disabled={disabled}
      />

      <DatePicker
        value={dateRange}
        mode="range"
        onChange={(v) => {
          if (!v || v instanceof Date) return;
          onDateRangeChange(v);
        }}
        locale={locale}
        placeholder={t("filters.createdDate")}
        disabled={disabled}
      />

      {hasActiveFilters && (
        <button
          className="px-3 h-10 flex justify-center items-center gap-2 content-base-low cursor-pointer"
          onClick={onReset}>
          <Refresh2 size={16} color="currentColor" />
          <span className="text-label-medium">{t("filters.reset")}</span>
        </button>
      )}
    </div>
  );
}
