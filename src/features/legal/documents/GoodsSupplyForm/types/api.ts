import type { CommercialOrganization } from "../../../types/commercialOrganizations";

export interface GoodsSupplyApiPayload {
  commercial_org_id: number;
  contract_city_id?: number;
  contract_date?: string;
  counterparty_bank_name?: string;
  counterparty_iban?: string;
  counterparty_bik?: string;
  delivery_address?: string;
  delivery_days?: number;
  total_amount?: string;
  payment_days?: number;
  court_location?: string;
  product_name?: string;
  product_model?: string;
  product_manufacturer?: string;
  product_power?: string;
  product_voltage?: string;
  product_material?: string;
  product_package?: string;
  product_size?: string;
  product_weight?: string;
  product_quantity?: number;
  product_unit_price?: string;
  product_total_price?: string;
  product_delivery_place?: string;
  product_warranty_term?: number;
}

export interface GoodsSupplyCity {
  id: number;
  name_ru: string;
  name_kk: string;
}

export interface GoodsSupplyContract {
  id: number;
  status: string;
  organization: number;
  created_by: number;
  contract_city: GoodsSupplyCity | null;
  contract_date: string;
  commercial_org: CommercialOrganization;
  counterparty_bank_name: string;
  counterparty_iban: string;
  counterparty_bik: string;
  delivery_address: string;
  delivery_days: number;
  total_amount: string;
  payment_days: number;
  court_location: string;
  product_name: string;
  product_model: string;
  product_manufacturer: string;
  product_power?: string;
  product_voltage?: string;
  product_material?: string;
  product_package?: string;
  product_size?: string;
  product_weight?: string;
  product_quantity: number;
  product_unit_price: string;
  product_total_price: string;
  product_delivery_place: string;
  product_warranty_term: number;
  trustme_status: number | null;
  trustme_url: string | null;
  draft_docx_key: string;
  signed_pdf_key: string;
  draft_docx_url?: string | null;
  signed_pdf_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoodsSupplyListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: GoodsSupplyContract[];
}

export type GoodsSupplyResponse = GoodsSupplyContract;

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

