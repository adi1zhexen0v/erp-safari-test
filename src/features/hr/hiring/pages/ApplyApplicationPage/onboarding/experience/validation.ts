import { z } from "zod";

export const experienceSchema = z
  .object({
    organization_name: z.string().min(1, { message: "validation.experience.organization_required" }),
    work_position: z.string().min(1, { message: "validation.experience.position_required" }),
    beginning_date: z.string().min(1, { message: "validation.experience.begin_required" }),
    end_date: z.union([z.string(), z.number(), z.null()]).optional(),
  })
  .superRefine((data, ctx) => {
    const beginningDateStr = data.beginning_date;
    const endDateStr = data.end_date;

    if (beginningDateStr && endDateStr && typeof endDateStr === "string" && endDateStr.trim() !== "") {
      try {
        const beginningDate = new Date(beginningDateStr);
        const endDate = new Date(endDateStr);

        if (isNaN(beginningDate.getTime())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "validation.experience.begin_invalid",
            path: ["beginning_date"],
          });
        }

        if (isNaN(endDate.getTime())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "validation.experience.end_invalid",
            path: ["end_date"],
          });
        }

        if (!isNaN(beginningDate.getTime()) && !isNaN(endDate.getTime())) {
          if (beginningDate >= endDate) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "validation.experience.end_before_begin",
              path: ["end_date"],
            });
          }
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "validation.experience.date_invalid",
          path: ["end_date"],
        });
      }
    }
  });

export type ExperienceFormValues = z.infer<typeof experienceSchema>;
