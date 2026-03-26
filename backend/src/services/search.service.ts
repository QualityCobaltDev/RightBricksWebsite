import { prisma } from "@/lib/prisma";
import { buildListingWhereClause, buildOrderByClause } from "@/search/query-builder";
import { SearchFilters } from "@/search/types";

export async function searchListings(filters: SearchFilters) {
  const skip = (filters.page - 1) * filters.pageSize;
  return prisma.listing.findMany({
    where: buildListingWhereClause(filters),
    include: { translations: true, media: true },
    orderBy: buildOrderByClause(filters),
    skip,
    take: filters.pageSize,
  });
}
