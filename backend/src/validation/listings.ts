import { z } from "zod";

export const listingCreateSchema = z.object({
  slug: z.string().min(3).max(160),
  listingType: z.enum(["SALE", "RENT"]),
  propertyType: z.enum([
    "APARTMENT",
    "CONDO",
    "VILLA",
    "HOUSE",
    "SHOPHOUSE",
    "OFFICE",
    "RETAIL",
    "LAND",
    "WAREHOUSE",
    "FACTORY",
    "HOTEL",
    "OTHER",
  ]),
  provinceId: z.string().min(1),
  districtId: z.string().min(1),
  communeId: z.string().optional(),
  addressLine1: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  priceUsd: z.number().positive(),
  priceKhrApprox: z.number().positive().optional(),
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  titleEn: z.string().min(10),
  descriptionEn: z.string().min(40),
  titleKm: z.string().min(1).optional(),
  descriptionKm: z.string().min(1).optional(),
});

export const listingUpdateSchema = listingCreateSchema.partial();
