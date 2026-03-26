import { ListingStatus, LocaleCode, Prisma } from "@prisma/client";
import { notFound } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";

export async function createListing(userId: string, input: {
  slug: string;
  listingType: "SALE" | "RENT";
  propertyType: Prisma.ListingCreateInput["propertyType"];
  provinceId: string;
  districtId: string;
  communeId?: string;
  addressLine1: string;
  latitude: number;
  longitude: number;
  priceUsd: number;
  priceKhrApprox?: number;
  bedrooms?: number;
  bathrooms?: number;
  titleEn: string;
  descriptionEn: string;
  titleKm?: string;
  descriptionKm?: string;
}) {
  const listing = await prisma.listing.create({
    data: {
      slug: input.slug,
      listingType: input.listingType,
      propertyType: input.propertyType,
      status: ListingStatus.PENDING_REVIEW,
      creatorId: userId,
      updaterId: userId,
      provinceId: input.provinceId,
      districtId: input.districtId,
      communeId: input.communeId,
      addressLine1: input.addressLine1,
      latitude: new Prisma.Decimal(input.latitude),
      longitude: new Prisma.Decimal(input.longitude),
      priceUsd: new Prisma.Decimal(input.priceUsd),
      priceKhrApprox: input.priceKhrApprox ? new Prisma.Decimal(input.priceKhrApprox) : undefined,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      translations: {
        create: [
          { locale: LocaleCode.EN, title: input.titleEn, description: input.descriptionEn },
          ...(input.titleKm && input.descriptionKm
            ? [{ locale: LocaleCode.KM, title: input.titleKm, description: input.descriptionKm }]
            : []),
        ],
      },
    },
    include: { translations: true },
  });

  await auditLog({
    actorType: "USER",
    actorUserId: userId,
    action: "listing.create",
    entityType: "Listing",
    entityId: listing.id,
    afterJson: listing,
  });

  return listing;
}

export async function updateListing(userId: string, listingId: string, input: Prisma.ListingUpdateInput) {
  const existing = await prisma.listing.findFirst({ where: { id: listingId, deletedAt: null } });
  if (!existing) throw notFound("Listing not found");

  const updated = await prisma.listing.update({
    where: { id: listingId },
    data: { ...input, updaterId: userId },
  });

  await auditLog({
    actorType: "USER",
    actorUserId: userId,
    action: "listing.update",
    entityType: "Listing",
    entityId: listingId,
    beforeJson: existing,
    afterJson: updated,
  });

  return updated;
}

export async function listPublicListings(query: {
  provinceId?: string;
  districtId?: string;
  minPriceUsd?: number;
  maxPriceUsd?: number;
  bedrooms?: number;
}) {
  return prisma.listing.findMany({
    where: {
      deletedAt: null,
      status: "PUBLISHED",
      provinceId: query.provinceId,
      districtId: query.districtId,
      bedrooms: query.bedrooms,
      priceUsd: {
        gte: query.minPriceUsd,
        lte: query.maxPriceUsd,
      },
    },
    include: { translations: true, media: true },
    orderBy: [{ publishedAt: "desc" }],
    take: 50,
  });
}
