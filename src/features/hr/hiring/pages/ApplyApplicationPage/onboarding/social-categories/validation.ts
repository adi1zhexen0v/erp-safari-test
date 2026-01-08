import { z } from "zod";

export const socialCategorySchema = z
  .object({
    category_type: z.string().min(1, { message: "validation.social.category_required" }),
    document_file: z.instanceof(File).nullable(),
    issue_date: z.string().optional(),
    expiry_date: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.document_file) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "validation.social.document_file_required",
        path: ["document_file"],
      });
    }
  });

export type SocialCategoryFormValues = z.infer<typeof socialCategorySchema>;

