import { useMemo } from "react";
import type { UseFormSetValue, FieldValues, Path, PathValue } from "react-hook-form";
import type { CommercialOrganization } from "../types/commercialOrganizations";

interface UseOrganizationSelectionParams<T extends FieldValues> {
  commercialOrgId: number;
  commercialOrganizations: CommercialOrganization[];
  existingOrg?: CommercialOrganization | null;
  setValue: UseFormSetValue<T>;
  orgIdField: Path<T>;
  i18n: { language: string };
}

export function useOrganizationSelection<T extends FieldValues>({
  commercialOrgId,
  commercialOrganizations,
  existingOrg,
  setValue,
  orgIdField,
  i18n,
}: UseOrganizationSelectionParams<T>) {
  const selectedOrganization = useMemo(() => {
    if (commercialOrgId && commercialOrgId > 0) {
      const found = commercialOrganizations.find((org) => org.id === commercialOrgId);
      if (found) return found;
    }
    if (existingOrg) {
      return existingOrg;
    }
    return null;
  }, [commercialOrgId, commercialOrganizations, existingOrg]);

  function getOrganizationName(org: CommercialOrganization | null): string {
    if (!org) return "";
    const currentLocale = i18n.language === "kk" ? "kk" : "ru";
    const name = currentLocale === "kk" ? org.name_kk || org.name_ru : org.name_ru || org.name_kk;
    return `${name} (${org.bin})`;
  }

  function handleOrganizationChange(org: CommercialOrganization | null) {
    if (org) {
      setValue(orgIdField, org.id as PathValue<T, Path<T>>, { shouldValidate: true });
    } else {
      setValue(orgIdField, 0 as PathValue<T, Path<T>>, { shouldValidate: true });
    }
  }

  return {
    selectedOrganization,
    getOrganizationName,
    handleOrganizationChange,
  };
}
