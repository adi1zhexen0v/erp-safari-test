import { z } from "zod";

export const addressesSchema = z.object({
  address_registration: z.string().min(1, { message: "validation.addresses.address_registration_required" }),
  address_factual: z.string().min(1, { message: "validation.addresses.address_factual_required" }),
});

export type AddressesFormValues = z.infer<typeof addressesSchema>;
