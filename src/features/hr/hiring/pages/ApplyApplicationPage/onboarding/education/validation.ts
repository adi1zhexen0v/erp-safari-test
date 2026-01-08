import { z } from "zod";

export const createEducationSchema = (requireFiles: boolean = true) =>
  z
    .object({
      degree: z.string().min(1, { message: "validation.education.degree_required" }),
      university_name: z.string().min(1, { message: "validation.education.university_required" }),
      specialty: z.string().min(1, { message: "validation.education.specialty_required" }),
      graduation_year: z.string().length(4, { message: "validation.education.year_invalid" }),
      diploma_number: z.string().min(1, { message: "validation.education.diploma_number_required" }),
      diploma_file: z.instanceof(File).nullable(),
      diploma_transcript_file: z.instanceof(File).nullable(),
    })
    .superRefine((data, ctx) => {
      if (requireFiles) {
        if (!data.diploma_file) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "validation.education.file_required",
            path: ["diploma_file"],
          });
        }

        if (!data.diploma_transcript_file) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "validation.education.transcript_required",
            path: ["diploma_transcript_file"],
          });
        }
      }
    });

export const educationSchema = createEducationSchema(true);

export type EducationFormValues = z.infer<typeof educationSchema>;
