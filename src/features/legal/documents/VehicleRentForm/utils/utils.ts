import { formatRentalPeriodMonths } from "@/shared/utils";
import { getOrganizationName, findOrganizationById } from "../../../utils";

export function formatRentalTerm(months: number | undefined, locale: "ru" | "kk" = "ru"): string {
  return formatRentalPeriodMonths(months, locale);
}

export { getOrganizationName, findOrganizationById };

