import { z } from "zod";

export const createCandidateSchema = z.object({
  candidate_name: z.string().min(1, "createForm.candidate_name.error.required"),
  email: z.string().min(1, "createForm.email.error.required").email("createForm.email.error.invalid"),
  phone: z
    .string()
    .min(1, "createForm.phone.error.required")
    .min(5, "createForm.phone.error.invalid")
    .regex(/^[0-9+\-() ]+$/, "createForm.phone.error.invalid"),
  job_position: z.string().min(1, "createForm.job_position.error.required"),
});

export type CreateCandidateFormValues = z.infer<typeof createCandidateSchema>;
