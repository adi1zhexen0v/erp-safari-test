import { z } from "zod";

export const serviceAgreementMSBSchema = z.object({
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
  services_description: z.string().min(1, { message: "validation.legal.services_description_required" }),
  service_start_date: z.date().nullable().optional(),
  service_end_date: z.date().nullable().optional(),
  correction_days: z
    .number()
    .int()
    .positive({ message: "validation.legal.correction_days_required" })
    .optional(),
  payment_days: z
    .number()
    .int()
    .positive({ message: "validation.legal.payment_days_required" })
    .optional(),
  contract_amount: z
    .string()
    .min(1, { message: "validation.legal.contract_amount_required" })
    .regex(/^\d+(\.\d+)?$/, { message: "validation.legal.contract_amount_invalid" })
    .optional(),
  penalty_percent: z
    .string()
    .min(1, { message: "validation.legal.penalty_percent_required" })
    .regex(/^\d+(\.\d+)?$/, { message: "validation.legal.penalty_percent_invalid" })
    .optional(),
  daily_penalty_percent: z
    .string()
    .min(1, { message: "validation.legal.daily_penalty_percent_required" })
    .regex(/^\d+(\.\d+)?$/, { message: "validation.legal.daily_penalty_percent_invalid" })
    .optional(),
  dispute_resolution_body: z.string().min(1, { message: "validation.legal.dispute_resolution_body_required" }),
});

