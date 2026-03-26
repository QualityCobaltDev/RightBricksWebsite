import { z } from "zod";

export const articleCreateSchema = z.object({
  slug: z.string().min(3).max(160),
  category: z.string().min(2).max(100),
  canonicalUrl: z.string().url(),
  titleEn: z.string().min(5),
  bodyEn: z.string().min(100),
  titleKm: z.string().min(1).optional(),
  bodyKm: z.string().min(1).optional(),
  publishNow: z.boolean().default(false),
});
