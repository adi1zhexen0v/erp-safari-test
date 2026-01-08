export interface LoginDto {
  email: string;
  password: string;
}

export type OrganizationType = "llp" | "llc" | "jsc" | "ip" | "pf";

export interface Organization {
  id: number;
  name: string;
  bin: string;
  organization_type: OrganizationType;
  organization_type_display: {
    ru: string;
    kk: string;
  };
  address_ru: string;
  address_kk: string;
  registration_date: string;
  iban: string;
  bik: string;
  bank_name: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  organization: string | Organization;
  iin?: string;
  job_position_ru?: string;
  job_position_kk?: string;
}

export interface GetMeResponse {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  iin: string;
  job_position_ru: string;
  job_position_kk: string;
  organization: Organization;
}

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  iin: string;
  job_position_ru: string;
  job_position_kk: string;
  organization: string;
  organization_bin: string;
  organization_address_ru: string;
  organization_address_kk: string;
  organization_registration_date: string;
  organization_bank_name?: string;
  organization_iban?: string;
  organization_bik?: string;
  organization_type_full_title_ru: string;
  organization_type_full_title_kk: string;
  organization_type_short_title_ru: string;
  organization_type_short_title_kk: string;
  employer_position_ru: string;
  employer_position_kk: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface RefreshTokenResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}
