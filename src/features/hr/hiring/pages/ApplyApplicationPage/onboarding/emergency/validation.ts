import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, { message: "validation.emergency.name_required" }),
  phone: z.string().min(1, { message: "validation.emergency.phone_required" }),
  relation: z.string().min(1, { message: "validation.emergency.relation_required" }),
});

export const emergencyContactsSchema = z.object({
  contact_1: contactSchema,
  contact_2: contactSchema,
});

export type EmergencyContactsFormValues = z.infer<typeof emergencyContactsSchema>;
