import type { Locale } from "@/shared/utils/types";
import type { TaxCategory } from "../types";
import { TAX_CATEGORY_LABELS } from "../consts";

export interface StatusBadge {
  label: string;
  color: "info" | "positive" | "notice" | "gray";
  key: string;
}

export function getTaxCategoryLabel(category: TaxCategory, locale: Locale): string {
  return TAX_CATEGORY_LABELS[category]?.[locale] || category;
}

export function getStatusBadges(
  entry: { tax_category: TaxCategory; is_astana_hub: boolean },
  locale: Locale,
): StatusBadge[] {
  const badges: StatusBadge[] = [];

  if (entry.tax_category && entry.tax_category !== "standard") {
    const label = getTaxCategoryLabel(entry.tax_category, locale);
    const color =
      entry.tax_category === "student"
        ? "info"
        : entry.tax_category === "astana_hub"
          ? "positive"
          : entry.tax_category.includes("disabled") || entry.tax_category === "parent_disabled_child"
            ? "notice"
            : "gray";
    badges.push({
      label,
      color,
      key: entry.tax_category,
    });
  }
  if (entry.is_astana_hub && entry.tax_category !== "astana_hub") {
    const label = TAX_CATEGORY_LABELS.astana_hub[locale];
    badges.push({
      label,
      color: "positive",
      key: "astana_hub",
    });
  }

  return badges;
}

