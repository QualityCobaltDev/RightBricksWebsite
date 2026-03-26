import { LocaleCode, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";

export async function createSavedSearch(userId: string, input: {
  name: string;
  locale?: LocaleCode;
  listingType?: "SALE" | "RENT";
  propertyTypes?: Prisma.PropertyTypeListFilter["hasSome"];
  provinceId?: string;
  districtId?: string;
  minPriceUsd?: number;
  maxPriceUsd?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  createAlert?: boolean;
}) {
  const savedSearch = await prisma.savedSearch.create({
    data: {
      userId,
      name: input.name,
      locale: input.locale ?? LocaleCode.EN,
      listingType: input.listingType,
      propertyTypes: input.propertyTypes ?? [],
      provinceId: input.provinceId,
      districtId: input.districtId,
      minPriceUsd: input.minPriceUsd ? new Prisma.Decimal(input.minPriceUsd) : undefined,
      maxPriceUsd: input.maxPriceUsd ? new Prisma.Decimal(input.maxPriceUsd) : undefined,
      minBedrooms: input.minBedrooms,
      maxBedrooms: input.maxBedrooms,
      alerts: input.createAlert
        ? {
            create: {
              userId,
              name: `${input.name} Alert`,
              locale: input.locale ?? LocaleCode.EN,
              listingType: input.listingType,
              propertyTypes: input.propertyTypes ?? [],
              provinceId: input.provinceId,
              districtId: input.districtId,
              minPriceUsd: input.minPriceUsd ? new Prisma.Decimal(input.minPriceUsd) : undefined,
              maxPriceUsd: input.maxPriceUsd ? new Prisma.Decimal(input.maxPriceUsd) : undefined,
              minBedrooms: input.minBedrooms,
              maxBedrooms: input.maxBedrooms,
            },
          }
        : undefined,
    },
    include: { alerts: true },
  });

  await auditLog({
    actorType: "USER",
    actorUserId: userId,
    action: "search.saved.create",
    entityType: "SavedSearch",
    entityId: savedSearch.id,
    afterJson: savedSearch,
  });

  return savedSearch;
}

export async function getSavedSearches(userId: string) {
  return prisma.savedSearch.findMany({
    where: { userId, deletedAt: null },
    include: { alerts: true },
    orderBy: { createdAt: "desc" },
  });
}
