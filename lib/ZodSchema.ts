import { z } from "zod";

export const SignupSchema = z.object({
  name: z
    .string()
    .min(3, "Name should be at least 3 characters")
    .max(50, "Name can't exceed 50 characters"),

  email: z
    .string()
    .email("Enter a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: z
    .string()
    .min(6, "Confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignupType = z.infer<typeof SignupSchema>;
