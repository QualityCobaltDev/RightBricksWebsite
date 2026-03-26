import { env } from "@/config/env";
import { prisma } from "@/lib/prisma";

export async function getListingSeoMeta(slug: string) {
  const listing = await prisma.listing.findFirst({
    where: { slug, deletedAt: null, status: "PUBLISHED" },
    include: {
      translations: { where: { locale: "EN" }, take: 1 },
      media: { where: { deletedAt: null }, orderBy: { displayOrder: "asc" }, take: 1 },
    },
  });

  if (!listing) return null;

  const translation = listing.translations[0];
  const canonicalUrl = `${env.CANONICAL_BASE_URL}/listing/${listing.slug}`;

  return {
    title: translation?.seoTitle ?? translation?.title ?? "RightBricks Listing",
    description: translation?.seoDescription ?? translation?.description?.slice(0, 160) ?? "Property in Cambodia",
    canonicalUrl,
    ogImage: listing.media[0]?.publicUrl ?? null,
    robots: "index,follow",
  };
}
