import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10).max(128),
  firstName: z.string().min(1).max(120),
  lastName: z.string().min(1).max(120),
  preferredLocale: z.enum(["EN", "KM"]).default("EN"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
