import { z } from "zod";

export const inquiryCreateSchema = z.object({
  listingId: z.string().optional(),
  projectId: z.string().optional(),
  name: z.string().min(2).max(120),
  email: z.string().email().optional(),
  phoneE164: z.string().min(8).max(20).optional(),
  message: z.string().max(2000).optional(),
  preferredLocale: z.enum(["EN", "KM"]).default("EN"),
  source: z
    .enum(["LISTING_DETAIL", "PROJECT_DETAIL", "CONTACT_FORM", "PHONE_CALL", "WHATSAPP", "MANUAL_ADMIN"])
    .default("LISTING_DETAIL"),
});

export const viewingRequestCreateSchema = z.object({
  listingId: z.string().min(1),
  requestedAt: z.string().datetime(),
  note: z.string().max(1000).optional(),
});

export const messageCreateSchema = z.object({
  threadId: z.string().min(1),
  body: z.string().min(1).max(4000),
});
