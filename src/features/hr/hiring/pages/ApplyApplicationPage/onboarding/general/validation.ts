import { z } from "zod";

interface ValidationContext {
  hasPhotoFromApi?: boolean;
  hasEnrollmentFromApi?: boolean;
}

export const createPersonalInfoSchema = (
  isStudent: boolean = false,
  context?: ValidationContext
) =>
  z
    .object({
      iin: z
        .string()
        .min(12, { message: "validation.personal.iin_length" })
        .max(12, { message: "validation.personal.iin_length" }),

      name: z.string().min(1, { message: "validation.personal.name_required" }),
      surname: z.string().min(1, { message: "validation.personal.surname_required" }),
      father_name: z.string().optional().or(z.literal("")),

      date_of_birth: z
        .date({ message: "validation.personal.date_required" })
        .nullable()
        .refine((d) => d instanceof Date, {
          message: "validation.personal.date_invalid",
        }),

      gender: z.string().min(1, { message: "validation.personal.gender_required" }),
      family_status: z.string().min(1, { message: "validation.personal.family_required" }),
      city_of_birth_id: z.number({ message: "validation.personal.city_required" }).min(1, {
        message: "validation.personal.city_required",
      }),
      nationality: z.string().min(1, { message: "validation.personal.nationality_required" }),
      citizenship: z.string().min(1, { message: "validation.personal.citizenship_required" }),

      is_resident: z.boolean(),
      is_student: z.boolean(),

      photo_file: z.instanceof(File).optional().nullable(),
      enrollment_verification_file: z.instanceof(File).optional().nullable(),
    })
    .superRefine((data, ctx) => {
      const hasPhotoInForm = data.photo_file !== null && data.photo_file !== undefined;
      const hasPhotoFromApi = context?.hasPhotoFromApi ?? false;

      if (!hasPhotoInForm && !hasPhotoFromApi) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "validation.personal.photo_required",
          path: ["photo_file"],
        });
      }

      if (isStudent) {
        const hasEnrollmentInForm =
          data.enrollment_verification_file !== null && data.enrollment_verification_file !== undefined;
        const hasEnrollmentFromApi = context?.hasEnrollmentFromApi ?? false;

        if (!hasEnrollmentInForm && !hasEnrollmentFromApi) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "validation.personal.enrollment_file_required",
            path: ["enrollment_verification_file"],
          });
        }
      }
    });

export const personalInfoSchema = createPersonalInfoSchema();

export type PersonalInfoFormValues = z.infer<ReturnType<typeof createPersonalInfoSchema>>;
