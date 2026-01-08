import type { CommercialOrganization } from "../../../types/commercialOrganizations";

export interface VehicleRentApiPayload {
  commercial_org_id: number;
  contract_city_id?: number;
  contract_date?: string;
  counterparty_bank_name?: string;
  counterparty_iban?: string;
  counterparty_bik?: string;
  car_brand?: string;
  car_year?: number;
  car_vin?: string;
  car_plate?: string;
  car_color?: string;
  rental_term_months?: number;
  rental_amount?: string;
}

export interface VehicleRentCity {
  id: number;
  name_ru: string;
  name_kk: string;
}

export interface VehicleRentContract {
  id: number;
  status: string;
  organization: number;
  created_by: number;
  contract_city: VehicleRentCity | null;
  contract_date: string;
  commercial_org: CommercialOrganization;
  counterparty_bank_name: string;
  counterparty_iban: string;
  counterparty_bik: string;
  car_brand: string;
  car_year: number;
  car_vin: string;
  car_plate: string;
  car_color: string;
  rental_term_months?: number;
  rental_amount: string;
  trustme_status: number | null;
  trustme_url: string | null;
  draft_docx_key: string;
  signed_pdf_key: string;
  draft_docx_url?: string | null;
  signed_pdf_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleRentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VehicleRentContract[];
}

export type VehicleRentResponse = VehicleRentContract;

export interface SubmitForSigningResponse {
  success: boolean;
  message: string;
  data: {
    trustme_document_id: string;
    trustme_url: string;
    trustme_status: number;
    docx_key: string;
    document_id: number;
    status: string;
  };
}
