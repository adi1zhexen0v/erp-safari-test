import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Refresh2 } from "iconsax-react";
import { SearchIcon } from "@/shared/assets/icons";
import { DatePicker, Input, Select } from "@/shared/ui";
import { type Locale, type DateRange } from "@/shared/utils";

export interface StatusOption {
  label: string;
  value: string;
}

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  managerSignedDateRange: DateRange;
  onManagerSignedDateRangeChange: (r: DateRange) => void;
  employeeSignedDateRange: DateRange;
  onEmployeeSignedDateRangeChange: (r: DateRange) => void;
  startDateRange: DateRange;
  onStartDateRangeChange: (r: DateRange) => void;
  statusFilter: string | null;
  onStatusChange: (v: string | null) => void;
  statusOptions: StatusOption[];
  hasActiveFilters: boolean;
  onReset: () => void;
  locale: Locale;
  disabled?: boolean;
}

export default function ContractsFilter({
  search,
  onSearchChange,
  managerSignedDateRange,
  onManagerSignedDateRangeChange,
  employeeSignedDateRange,
  onEmployeeSignedDateRangeChange,
  startDateRange,
  onStartDateRangeChange,
  statusFilter,
  onStatusChange,
  statusOptions,
  hasActiveFilters,
  onReset,
  locale,
  disabled = false,
}: Props) {
  const { t } = useTranslation("ContractsPage");

  return (
    <div
      className={cn(
        "grid p-5 border surface-base-stroke surface-tertiary-fill gap-2 radius-lg mb-4 items-stretch mt-7",
        hasActiveFilters
          ? "grid-cols-[323fr_200fr_280fr_280fr_240fr_174px]"
          : "grid-cols-[323fr_200fr_280fr_280fr_240fr]",
      )}>
      <Input
        placeholder={t("filters.searchPlaceholder")}
        className="rounded-xl!"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        icon={<SearchIcon size={16} />}
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
        value={managerSignedDateRange}
        mode="range"
        onChange={(v) => {
          if (!v || v instanceof Date) return;
          onManagerSignedDateRangeChange(v);
        }}
        locale={locale}
        placeholder={t("filters.managerSignedDate")}
        disabled={disabled}
      />

      <DatePicker
        value={employeeSignedDateRange}
        mode="range"
        onChange={(v) => {
          if (!v || v instanceof Date) return;
          onEmployeeSignedDateRangeChange(v);
        }}
        locale={locale}
        placeholder={t("filters.employeeSignedDate")}
        disabled={disabled}
      />

      <DatePicker
        value={startDateRange}
        mode="range"
        onChange={(v) => {
          if (!v || v instanceof Date) return;
          onStartDateRangeChange(v);
        }}
        locale={locale}
        placeholder={t("filters.startDate")}
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

