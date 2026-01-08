import type { Locale } from "@/shared/utils/types";
import type { TaxCategory } from "../types";
import { getTaxCategoryLabel } from "./status";

export interface GroupedEntryData {
  key: string;
  label: string;
  count: number;
  gross: number;
  net: number;
}

export function groupEntriesByTaxCategory(
  entries: Array<{ tax_category: TaxCategory; gross_salary: string; net_salary: string }>,
  locale: Locale,
): GroupedEntryData[] {
  const groups: Record<TaxCategory, { count: number; gross: number; net: number }> = {} as Record<
    TaxCategory,
    { count: number; gross: number; net: number }
  >;

  entries.forEach((entry) => {
    if (!groups[entry.tax_category]) {
      groups[entry.tax_category] = { count: 0, gross: 0, net: 0 };
    }
    groups[entry.tax_category].count++;
    groups[entry.tax_category].gross += parseFloat(entry.gross_salary) || 0;
    groups[entry.tax_category].net += parseFloat(entry.net_salary) || 0;
  });

  return Object.entries(groups).map(([category, data]) => ({
    key: category,
    label: getTaxCategoryLabel(category as TaxCategory, locale),
    ...data,
  }));
}

export function groupEntriesByResidency(
  entries: Array<{ is_resident: boolean; gross_salary: string; net_salary: string }>,
): GroupedEntryData[] {
  const residents = { count: 0, gross: 0, net: 0 };
  const nonResidents = { count: 0, gross: 0, net: 0 };

  entries.forEach((entry) => {
    const target = entry.is_resident ? residents : nonResidents;
    target.count++;
    target.gross += parseFloat(entry.gross_salary) || 0;
    target.net += parseFloat(entry.net_salary) || 0;
  });

  const result: GroupedEntryData[] = [];
  if (residents.count > 0) {
    result.push({ key: "resident", label: "residents", ...residents });
  }
  if (nonResidents.count > 0) {
    result.push({ key: "non_resident", label: "nonResidents", ...nonResidents });
  }
  return result;
}

export function groupEntriesByContractType(
  entries: Array<{ is_gph_contract: boolean; gross_salary: string; net_salary: string }>,
): GroupedEntryData[] {
  const regular = { count: 0, gross: 0, net: 0 };
  const gph = { count: 0, gross: 0, net: 0 };

  entries.forEach((entry) => {
    const target = entry.is_gph_contract ? gph : regular;
    target.count++;
    target.gross += parseFloat(entry.gross_salary) || 0;
    target.net += parseFloat(entry.net_salary) || 0;
  });

  const result: GroupedEntryData[] = [];
  if (regular.count > 0) {
    result.push({ key: "regular", label: "regularContract", ...regular });
  }
  if (gph.count > 0) {
    result.push({ key: "gph", label: "gphContract", ...gph });
  }
  return result;
}

