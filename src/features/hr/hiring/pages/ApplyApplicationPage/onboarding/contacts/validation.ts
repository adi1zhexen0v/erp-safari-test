import { z } from "zod";

export const contactsSchema = z.object({
  email: z.string().email({ message: "validation.contacts.email_invalid" }),
  phone: z.string().min(5, { message: "validation.contacts.phone_required" }),
  phone_additional: z.string().optional().or(z.literal("")),
});

export type ContactsFormValues = z.infer<typeof contactsSchema>;
