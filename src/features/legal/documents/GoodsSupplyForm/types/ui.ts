export interface GoodsSupplyFormValues {
  contract_city_id?: number;
  contract_date?: Date | null;
  commercial_org_id: number;
  counterparty_bank_name: string;
  counterparty_iban: string;
  counterparty_bik: string;
  delivery_address: string;
  delivery_days?: number;
  payment_days?: number;
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
  product_quantity?: number;
  product_unit_price?: string;
  product_total_price?: string;
  product_delivery_place: string;
  product_warranty_term?: number;
}

export interface GoodsSupplyPreviewData {
  contract_city: string;
  contract_date: string;
  commercial_org_id: number;
  counterparty_bank_name: string;
  counterparty_iban: string;
  counterparty_bik: string;
  delivery_address: string;
  delivery_days: string;
  delivery_days_text: string;
  total_amount: string;
  total_amount_text: string;
  payment_days: string;
  payment_days_text: string;
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
  product_quantity: string;
  product_unit_price: string;
  product_total_price: string;
  product_delivery_place: string;
  product_warranty_term: string;
  product_warranty_months: string;
}

