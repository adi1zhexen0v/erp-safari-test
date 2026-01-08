import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Refresh2 } from "iconsax-react";
import { SearchIcon } from "@/shared/assets/icons";
import { DatePicker, Input, Select } from "@/shared/ui";
import { type Locale } from "@/shared/utils";
import type { LeaveType } from "@/features/hr/leave-applications";

export interface StatusOption {
  label: string;
  value: LeaveType;
}

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  dateRange: { start: Date | null; end: Date | null };
  onDateRangeChange: (r: { start: Date | null; end: Date | null }) => void;
  statusFilter: LeaveType | null;
  onStatusChange: (v: LeaveType | null) => void;
  statusOptions: StatusOption[];
  hasActiveFilters: boolean;
  onReset: () => void;
  locale: Locale;
  disabled?: boolean;
}

export default function LeaveApplicationsFilter({
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  statusFilter,
  onStatusChange,
  statusOptions,
  hasActiveFilters,
  onReset,
  locale,
  disabled = false,
}: Props) {
  const { t } = useTranslation("LeaveApplicationsPage");

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    onSearchChange(e.target.value);
  }

  function handleDateRangeChange(v: Date | { start: Date | null; end: Date | null } | null) {
    if (!v || v instanceof Date) return;
    onDateRangeChange(v);
  }

  function handleStatusChange(v: LeaveType | null) {
    onStatusChange(v);
  }

  return (
    <div
      className={cn(
        "grid p-5 border surface-base-stroke surface-tertiary-fill gap-2 radius-lg mb-4 items-stretch mt-7",
        hasActiveFilters ? "grid-cols-[323fr_240fr_240fr_174px]" : "grid-cols-[323fr_240fr_240fr]",
      )}>
      <Input
        placeholder={t("filters.searchPlaceholder")}
        className="rounded-xl!"
        value={search}
        onChange={handleSearchChange}
        icon={<SearchIcon size={16} />}
        disabled={disabled}
      />

      <DatePicker
        value={dateRange}
        mode="range"
        onChange={handleDateRangeChange}
        locale={locale}
        placeholder={t("filters.period")}
        disabled={disabled}
      />

      <Select<LeaveType>
        options={statusOptions}
        placeholder={t("filters.status")}
        value={statusFilter}
        onChange={handleStatusChange}
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
