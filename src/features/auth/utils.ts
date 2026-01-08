import type { AuthUser, GetMeResponse, Organization, OrganizationType } from "./types";

function inferOrganizationType(fullTitleRu: string, shortTitleRu: string): OrganizationType {
  const titleLower = fullTitleRu.toLowerCase();
  const shortLower = shortTitleRu.toLowerCase();

  if (titleLower.includes("товарищество") || shortLower === "тоо") return "llp";
  if (titleLower.includes("общество") || shortLower === "ооо") return "llc";
  if (titleLower.includes("акционерное") || shortLower === "ао") return "jsc";
  if (titleLower.includes("индивидуальный") || shortLower === "ип") return "ip";
  if (titleLower.includes("фонд") || shortLower === "пф") return "pf";

  return "llp"; // default fallback
}

export function mapAuthUserToGetMeResponse(user: AuthUser | null): GetMeResponse | null {
  if (!user) return null;

  const organizationType = inferOrganizationType(
    user.organization_type_full_title_ru,
    user.organization_type_short_title_ru,
  );

  const organization: Organization = {
    id: 0, // AuthUser doesn't have organization id
    name: user.organization,
    bin: user.organization_bin,
    organization_type: organizationType,
    organization_type_display: {
      ru: user.organization_type_full_title_ru,
      kk: user.organization_type_full_title_kk,
    },
    address_ru: user.organization_address_ru,
    address_kk: user.organization_address_kk,
    registration_date: user.organization_registration_date,
    iban: user.organization_iban || "",
    bik: user.organization_bik || "",
    bank_name: user.organization_bank_name || "",
  };

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    phone: user.phone,
    iin: user.iin,
    job_position_ru: user.job_position_ru,
    job_position_kk: user.job_position_kk,
    organization,
  };
}
