import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Refresh2 } from "iconsax-react";
import type { ApplicationStatus } from "@/features/hr/hiring";
import { SearchIcon } from "@/shared/assets/icons";
import { DatePicker, Input, Select } from "@/shared/ui";
import { type Locale } from "@/shared/utils";

export interface StatusOption {
  label: string;
  value: ApplicationStatus;
}

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  range: { start: Date | null; end: Date | null };
  onRangeChange: (r: { start: Date | null; end: Date | null }) => void;
  statusFilter: ApplicationStatus | null;
  onStatusChange: (v: ApplicationStatus | null) => void;
  statusOptions: StatusOption[];
  hasActiveFilters: boolean;
  onReset: () => void;
  locale: Locale;
  disabled?: boolean;
}

export default function HiringFilters({
  search,
  onSearchChange,
  range,
  onRangeChange,
  statusFilter,
  onStatusChange,
  statusOptions,
  hasActiveFilters,
  onReset,
  locale,
  disabled = false,
}: Props) {
  const { t } = useTranslation("HiringPage");

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
        onChange={(e) => onSearchChange(e.target.value)}
        icon={<SearchIcon size={16} />}
        disabled={disabled}
      />

      <DatePicker
        value={range}
        mode="range"
        onChange={(v) => {
          if (!v || v instanceof Date) return;
          onRangeChange(v);
        }}
        locale={locale}
        placeholder={t("filters.submittedDate")}
        disabled={disabled}
      />

      <Select<ApplicationStatus>
        options={statusOptions}
        placeholder={t("filters.status")}
        value={statusFilter}
        onChange={(v) => onStatusChange(v)}
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

