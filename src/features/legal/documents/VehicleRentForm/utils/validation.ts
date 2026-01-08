import { z } from "zod";

export const vehicleRentSchema = z.object({
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
  car_brand: z.string().min(1, { message: "validation.legal.car_brand_required" }),
  car_year: z
    .number()
    .int()
    .positive({ message: "validation.legal.car_year_required" })
    .optional(),
  car_vin: z.string().min(1, { message: "validation.legal.car_vin_required" }),
  car_plate: z.string().min(1, { message: "validation.legal.car_plate_required" }),
  car_color: z.string().min(1, { message: "validation.legal.car_color_required" }),
  rental_term_months: z
    .number()
    .int()
    .positive({ message: "validation.legal.rental_term_text_required" })
    .optional(),
  rental_amount: z
    .string()
    .min(1, { message: "validation.legal.rental_amount_required" })
    .regex(/^\d+(\.\d+)?$/, { message: "validation.legal.rental_amount_invalid" })
    .optional(),
});
