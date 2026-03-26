import { Prisma } from "@prisma/client";
import { SearchFilters } from "@/search/types";

export function buildListingWhereClause(filters: SearchFilters): Prisma.ListingWhereInput {
  return {
    deletedAt: null,
    status: "PUBLISHED",
    listingType: filters.listingType,
    propertyType: filters.propertyTypes.length ? { in: filters.propertyTypes as never[] } : undefined,
    province: filters.province ? { slug: filters.province } : undefined,
    district: filters.district ? { slug: filters.district } : undefined,
    commune: filters.commune ? { slug: filters.commune } : undefined,
    priceUsd: {
      gte: filters.minPriceUsd,
      lte: filters.maxPriceUsd,
    },
    bedrooms: {
      gte: filters.minBedrooms,
      lte: filters.maxBedrooms,
    },
    bathrooms: {
      gte: filters.minBathrooms,
    },
    furnishingLevel: filters.furnished ? { not: null } : undefined,
    isVerified: filters.verifiedOnly ? true : undefined,
    parkingSpaces: filters.hasParking ? { gt: 0 } : undefined,
    translations: filters.q
      ? {
          some: {
            OR: [
              { title: { contains: filters.q, mode: "insensitive" } },
              { description: { contains: filters.q, mode: "insensitive" } },
            ],
          },
        }
      : undefined,
  };
}

export function buildOrderByClause(filters: SearchFilters): Prisma.ListingOrderByWithRelationInput[] {
  switch (filters.sort) {
    case "newest":
      return [{ publishedAt: "desc" }];
    case "price_asc":
      return [{ priceUsd: "asc" }];
    case "price_desc":
      return [{ priceUsd: "desc" }];
    case "relevance":
    default:
      return [{ isFeatured: "desc" }, { isVerified: "desc" }, { publishedAt: "desc" }];
  }
}
