import { z } from "zod";

export const bankingSchema = z.object({
  bank_name: z.string().min(1, { message: "validation.banking.bank_name_required" }),
  iban_account: z
    .string()
    .min(20, { message: "validation.banking.iban_length" })
    .max(20, { message: "validation.banking.iban_length" }),
  bik_number: z
    .string()
    .min(8, { message: "validation.banking.bik_length" })
    .max(11, { message: "validation.banking.bik_length" }),

  bank_certificate_file: z.instanceof(File).nullable().refine((file) => file === null || file instanceof File, {
    message: "validation.personal.photo_required",
  }),
});

export type BankingFormValues = z.infer<typeof bankingSchema>;
