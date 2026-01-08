import { z } from "zod";
import type { ServiceContractServiceItem } from "../../ServiceContractForm/types";
import type { CompletionActListItem } from "../types";

export const completionActSchema = z
  .object({
    parent_contract: z.number({ error: "Выберите контракт" }),
    service_item: z.number({ error: "Выберите услугу" }).nullable(),
    period_start_date: z.date({ error: "Укажите дату начала" }).nullable(),
    period_end_date: z.date({ error: "Укажите дату окончания" }).nullable(),
    amount: z
      .string({ error: "Укажите сумму" })
      .min(1, "Укажите сумму")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Сумма должна быть больше 0"),
    description: z.string().default(""),
  })
  .refine((data) => data.service_item !== null, {
    message: "Выберите услугу",
    path: ["service_item"],
  })
  .refine((data) => data.period_start_date !== null, {
    message: "Укажите дату начала",
    path: ["period_start_date"],
  })
  .refine((data) => data.period_end_date !== null, {
    message: "Укажите дату окончания",
    path: ["period_end_date"],
  })
  .refine(
    (data) => {
      if (data.period_start_date && data.period_end_date) {
        return data.period_end_date >= data.period_start_date;
      }
      return true;
    },
    {
      message: "Дата окончания не может быть раньше даты начала",
      path: ["period_end_date"],
    },
  );

export function createCompletionActSchemaWithContext(
  selectedService: ServiceContractServiceItem | null,
  existingActs: CompletionActListItem[] = [],
  currentActId?: number,
) {
  return completionActSchema
    .superRefine((data, ctx) => {
      if (selectedService && data.period_start_date) {
        const serviceStartDate = new Date(selectedService.start_date);
        serviceStartDate.setHours(0, 0, 0, 0);
        const actStartDate = new Date(data.period_start_date);
        actStartDate.setHours(0, 0, 0, 0);
        if (actStartDate < serviceStartDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Дата начала не может быть раньше ${serviceStartDate.toLocaleDateString("ru-RU")}`,
            path: ["period_start_date"],
          });
        }
      }
    })
    .superRefine((data, ctx) => {
      if (selectedService && data.period_start_date) {
        const serviceEndDate = new Date(selectedService.end_date);
        serviceEndDate.setHours(23, 59, 59, 999);
        const actStartDate = new Date(data.period_start_date);
        actStartDate.setHours(0, 0, 0, 0);
        if (actStartDate > serviceEndDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Дата начала не может быть позже ${serviceEndDate.toLocaleDateString("ru-RU")}`,
            path: ["period_start_date"],
          });
        }
      }
    })
    .superRefine((data, ctx) => {
      if (selectedService && data.period_end_date) {
        const serviceStartDate = new Date(selectedService.start_date);
        serviceStartDate.setHours(0, 0, 0, 0);
        const actEndDate = new Date(data.period_end_date);
        actEndDate.setHours(0, 0, 0, 0);
        if (actEndDate < serviceStartDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Дата окончания не может быть раньше ${serviceStartDate.toLocaleDateString("ru-RU")}`,
            path: ["period_end_date"],
          });
        }
      }
    })
    .superRefine((data, ctx) => {
      if (selectedService && data.period_end_date) {
        const serviceEndDate = new Date(selectedService.end_date);
        serviceEndDate.setHours(23, 59, 59, 999);
        const actEndDate = new Date(data.period_end_date);
        actEndDate.setHours(0, 0, 0, 0);
        if (actEndDate > serviceEndDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Дата окончания не может быть позже ${serviceEndDate.toLocaleDateString("ru-RU")}`,
            path: ["period_end_date"],
          });
        }
      }
    })
    .superRefine((data, ctx) => {
      if (selectedService && data.service_item) {
        // Рассчитываем использованную сумму для выбранного сервиса
        const usedAmount = existingActs
          .filter((act) => act.service_item.id === data.service_item && act.id !== currentActId)
          .reduce((sum, act) => sum + parseFloat(act.amount || "0"), 0);

        const servicePrice = parseFloat(selectedService.price);
        const remainingAmount = servicePrice - usedAmount;
        const requestedAmount = parseFloat(data.amount || "0");

        if (requestedAmount > remainingAmount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Превышен остаток. Доступно: ${remainingAmount.toLocaleString("ru-RU")} ₸`,
            path: ["amount"],
          });
        }
      }
    });
}

export const rejectReasonSchema = z.object({
  reason: z.string({ error: "Укажите причину отклонения" }).min(10, "Причина должна содержать минимум 10 символов"),
});

export type CompletionActSchemaType = z.infer<typeof completionActSchema>;
export type RejectReasonSchemaType = z.infer<typeof rejectReasonSchema>;
