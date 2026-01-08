export interface CommercialOrganization {
  id: number;
  name_ru: string;
  name_kk: string;
  bin: string;
  representative: string;
  basis: string;
  phone: string;
  email: string;
  address: string;
  region: string;
}

export type CommercialOrganizationWithBank = CommercialOrganization & {
  bank_name?: string;
  iban?: string;
  bik?: string;
};

