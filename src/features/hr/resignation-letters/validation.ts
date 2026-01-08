import { z } from "zod";

export const createResignationSchema = z.object({
  last_working_day: z
    .date({
      message: "resignationForm.last_working_day.error.required",
    })
    .refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      {
        message: "resignationForm.last_working_day.error.past",
        path: ["last_working_day"],
      },
    ),
  approval_resolution: z.enum(["approved_with_1month", "approved", "no_objection"]).optional().nullable(),
});

export type CreateResignationFormValues = z.infer<typeof createResignationSchema>;
