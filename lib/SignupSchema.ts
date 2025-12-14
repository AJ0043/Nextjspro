import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),

    email: z.string().email("Invalid email"),

    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^[0-9]+$/, "Phone must contain only digits"),

    role: z.union([z.literal("user"), z.literal("admin")]),

    password: z.string().min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => ["user", "admin"].includes(data.role), {
    message: "Please choose a valid role",
    path: ["role"],
  });

export type SignupInput = z.infer<typeof signupSchema>;
