import { z } from "zod";

const serviceItemSchema = z.object({
  service_name: z.string().min(1, { message: "validation.legal.service_name_required" }),
  start_date: z
    .date()
    .nullable()
  .refine((val) => val !== null, { message: "validation.legal.service_start_date_required" }),
  end_date: z
    .date()
    .nullable()
    .refine((val) => val !== null, { message: "validation.legal.service_end_date_required" }),
  price: z
    .string()
    .min(1, { message: "validation.legal.service_price_required" })
    .regex(/^\d+(\.\d+)?$/, { message: "validation.legal.service_price_invalid" }),
  order: z.number().optional(),
});

export const serviceContractSchema = z.object({
  contract_city_id: z.number().optional(),
  contract_date: z.date().nullable().optional(),
  contract_end_date: z.date().nullable().optional(),
  executor_full_name: z.string().min(1, { message: "validation.legal.executor_full_name_required" }),
  executor_phone: z
    .string()
    .min(1, { message: "validation.legal.executor_phone_required" })
    .regex(/^\+7\d{10}$/, { message: "validation.legal.executor_phone_invalid" }),
  executor_iin: z
    .string()
    .min(1, { message: "validation.legal.executor_iin_required" })
    .regex(/^\d{12}$/, { message: "validation.legal.executor_iin_invalid" }),
  executor_bank_name: z.string().min(1, { message: "validation.legal.executor_bank_name_required" }),
  executor_iban: z.string().min(1, { message: "validation.legal.executor_iban_required" }),
  executor_bik: z.string().min(1, { message: "validation.legal.executor_bik_required" }),
  service_name: z.string().min(1, { message: "validation.legal.service_name_required" }),
  service_location: z.string().min(1, { message: "validation.legal.service_location_required" }),
  services: z
    .array(serviceItemSchema)
    .min(1, { message: "validation.legal.services_min_one" })
    .max(3, { message: "validation.legal.services_max_three" }),
});

