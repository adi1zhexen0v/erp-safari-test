import { z } from "zod";

export const premiseRentSchema = z
  .object({
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
    premise_area: z
      .string()
      .regex(/^\d+(\.\d+)?$/, { message: "validation.legal.premise_area_invalid" })
      .optional(),
    premise_address: z.string().optional(),
    premise_usage_purpose: z.string().optional(),
    rental_start_date: z.date().nullable().optional(),
    rental_end_date: z.date().nullable().optional(),
    rental_amount: z
      .string()
      .regex(/^\d+(\.\d+)?$/, { message: "validation.legal.rental_amount_invalid" })
      .optional(),
    first_month_payment_deadline: z.date().nullable().optional(),
  })
  .refine(
    (data) => {
      if (!data.rental_start_date || !data.rental_end_date) return true;
      return data.rental_end_date > data.rental_start_date;
    },
    {
      message: "validation.legal.rental_end_date_must_be_after_start",
      path: ["rental_end_date"],
    },
  );

export type PremiseRentFormValues = z.infer<typeof premiseRentSchema>;

