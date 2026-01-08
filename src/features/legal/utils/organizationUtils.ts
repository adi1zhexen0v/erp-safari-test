import type { CommercialOrganization } from "../types/commercialOrganizations";

export function getOrganizationName(
  organization: CommercialOrganization | null | undefined,
  locale: "ru" | "kk",
): string {
  if (!organization) return "_____________";
  return locale === "kk" ? organization.name_kk || organization.name_ru : organization.name_ru || organization.name_kk;
}

export function findOrganizationById(
  organizations: CommercialOrganization[],
  id: number | undefined,
): CommercialOrganization | null {
  if (!id) return null;
  return organizations.find((org) => org.id === id) || null;
}
