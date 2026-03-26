import { buildMetadata } from "@/seo/metadata";
import { organizationSchema } from "@/seo/schema";
import { prisma } from "@/lib/prisma";
import { HomepageSections } from "@/components/cms/homepage-sections";
import { JsonLd } from "@/components/cms/json-ld";

export const metadata = buildMetadata({
  path: "/",
  title: "RightBricks | Cambodia Property Marketplace",
  description: "Search homes, condos, and investment property across Cambodia on RightBricks.",
});

export default async function HomePage() {
  const [listings, guides] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      include: { translations: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: 9,
    }),
    prisma.cmsArticle.findMany({
      where: { status: "PUBLISHED", deletedAt: null, category: "guides" },
      include: { translations: true },
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <JsonLd data={organizationSchema()} />
      <HomepageSections
        featuredListings={listings.map((listing) => ({
          id: listing.id,
          slug: listing.slug,
          title: listing.translations[0]?.title ?? listing.slug,
          priceUsd: listing.priceUsd.toString(),
        }))}
        featuredGuides={guides.map((guide) => ({
          id: guide.id,
          slug: guide.slug,
          title: guide.translations[0]?.title ?? guide.slug,
        }))}
      />
    </main>
  );
}
