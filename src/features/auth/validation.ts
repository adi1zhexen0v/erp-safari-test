import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "email.error.required").email("email.error.invalid"),

  password: z
    .string()
    .min(1, "password.error.required")
    .regex(/^.{8,}$/, "password.error.strongPassword")
    .regex(/[A-Z]/, "password.error.strongPassword")
    .regex(/[0-9]/, "password.error.strongPassword")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "password.error.strongPassword"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
