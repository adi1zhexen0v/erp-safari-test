import { z } from "zod";

export const createIdDocumentsSchema = (isMilitaryRequired: boolean) =>
  z
    .object({
      national_id_number: z.string().min(1, { message: "validation.id.number_required" }),
      national_id_issue_date: z.date().nullable(),
      national_id_expiry_date: z.date().nullable(),
      national_id_issued_by: z.string().min(1, { message: "validation.id.issued_by_required" }),
      national_id_file: z.instanceof(File).optional().nullable(),
      military_certificate_file: z.instanceof(File).optional().nullable(),
    })
    .superRefine((data, ctx) => {
      if (isMilitaryRequired && !data.military_certificate_file) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "validation.id.military_file_required",
          path: ["military_certificate_file"],
        });
      }
    });

export const idDocumentsSchema = createIdDocumentsSchema(false);

export type IdDocumentsFormValues = z.infer<ReturnType<typeof createIdDocumentsSchema>>;
