import { z } from "zod";

export const goodsSupplySchema = z.object({
  contract_city_id: z
    .number()
    .int()
    .positive({ message: "validation.legal.city_required" })
    .optional(),
  contract_date: z.date().nullable().optional(),
  commercial_org_id: z.number().min(1, { message: "validation.legal.commercial_org_id_required" }),
  counterparty_bank_name: z.string().min(1, { message: "validation.legal.counterparty_bank_name_required" }),
  counterparty_iban: z.string().min(1, { message: "validation.legal.counterparty_iban_required" }),
  counterparty_bik: z.string().min(1, { message: "validation.legal.counterparty_bik_required" }),
  delivery_address: z.string().min(1, { message: "validation.legal.delivery_address_required" }),
  delivery_days: z
    .number()
    .int()
    .positive({ message: "validation.legal.delivery_days_required" })
    .optional(),
  payment_days: z
    .number()
    .int()
    .positive({ message: "validation.legal.payment_days_required" })
    .optional(),
  court_location: z.string().min(1, { message: "validation.legal.court_location_required" }),
  product_name: z.string().min(1, { message: "validation.legal.product_name_required" }),
  product_model: z.string().min(1, { message: "validation.legal.product_model_required" }),
  product_manufacturer: z.string().min(1, { message: "validation.legal.product_manufacturer_required" }),
  product_power: z.string().optional(),
  product_voltage: z.string().optional(),
  product_material: z.string().optional(),
  product_package: z.string().optional(),
  product_size: z.string().optional(),
  product_weight: z.string().optional(),
  product_quantity: z
    .number()
    .int()
    .positive({ message: "validation.legal.product_quantity_required" })
    .optional(),
  product_unit_price: z
    .string()
    .min(1, { message: "validation.legal.product_unit_price_required" })
    .regex(/^\d+(\.\d+)?$/, { message: "validation.legal.product_unit_price_invalid" })
    .optional(),
  product_delivery_place: z.string().min(1, { message: "validation.legal.product_delivery_place_required" }),
  product_warranty_term: z
    .number()
    .int()
    .positive({ message: "validation.legal.product_warranty_term_required" })
    .optional(),
});

export type GoodsSupplyFormValues = z.infer<typeof goodsSupplySchema>;

