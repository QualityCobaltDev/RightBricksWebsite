import { prisma } from "@/lib/prisma";

export async function searchListings(query: {
  text?: string;
  provinceId?: string;
  districtId?: string;
  minPriceUsd?: number;
  maxPriceUsd?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
}) {
  return prisma.listing.findMany({
    where: {
      deletedAt: null,
      status: "PUBLISHED",
      provinceId: query.provinceId,
      districtId: query.districtId,
      bedrooms: {
        gte: query.minBedrooms,
        lte: query.maxBedrooms,
      },
      priceUsd: {
        gte: query.minPriceUsd,
        lte: query.maxPriceUsd,
      },
      translations: query.text
        ? {
            some: {
              OR: [
                { title: { contains: query.text, mode: "insensitive" } },
                { description: { contains: query.text, mode: "insensitive" } },
              ],
            },
          }
        : undefined,
    },
    include: { translations: true, media: true },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    take: 100,
  });
}
