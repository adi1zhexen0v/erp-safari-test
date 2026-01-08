import { z } from "zod";
import type { LeaveType } from "./types";

export function createLeaveSchema(leaveType: LeaveType) {
  return z
    .object({
      start_date: z
        .date({
          message: "leaveForm.start_date.error.required",
        })
        .refine(
          function (date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
          },
          {
            message: "leaveForm.start_date.error.past",
            path: ["start_date"],
          },
        ),
      end_date: z.date({
        message: "leaveForm.end_date.error.required",
      }),
      reason: z.string().optional(),
      approval_resolution: z.enum(["approved", "recommend", "no_objection"]).optional().nullable(),
      diagnosis: z.string().optional(),
      certificate_required: z.boolean().optional(),
    })
    .refine(
      function (data) {
        return data.end_date > data.start_date;
      },
      {
        message: "leaveForm.end_date.error.before_start",
        path: ["end_date"],
      },
    )
    .refine(
      function (data) {
        if (leaveType === "unpaid") {
          return data.reason && data.reason.trim().length > 0;
        }
        return true;
      },
      {
        message: "leaveForm.reason.error.required",
        path: ["reason"],
      },
    );
}

export type CreateLeaveFormValues = z.infer<ReturnType<typeof createLeaveSchema>>;

export function editLeaveSchema(leaveType: LeaveType) {
  return z
    .object({
      start_date: z.date({
        message: "leaveForm.start_date.error.required",
      }),
      end_date: z.date({
        message: "leaveForm.end_date.error.required",
      }),
      reason: z.string().optional(),
      approval_resolution: z.enum(["approved", "recommend", "no_objection"]).optional().nullable(),
      diagnosis: z.string().optional(),
      certificate_required: z.boolean().optional(),
    })
    .refine(
      function (data) {
        return data.end_date > data.start_date;
      },
      {
        message: "leaveForm.end_date.error.before_start",
        path: ["end_date"],
      },
    )
    .refine(
      function (data) {
        if (leaveType === "unpaid") {
          return data.reason && data.reason.trim().length > 0;
        }
        return true;
      },
      {
        message: "leaveForm.reason.error.required",
        path: ["reason"],
      },
    );
}
