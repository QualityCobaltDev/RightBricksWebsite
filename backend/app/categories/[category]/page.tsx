import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/seo/metadata";
import { ListingCard } from "@/components/listings/listing-card";
import { startCase } from "@/lib/frontend/format";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const label = category.replace(/-/g, " ");
  return buildMetadata({ path: `/categories/${category}`, title: `${label} Properties | RightBricks`, description: `Discover ${label} property listings in Cambodia on RightBricks.` });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const allowed = ["APARTMENT","CONDO","VILLA","HOUSE","SHOPHOUSE","OFFICE","RETAIL","LAND","WAREHOUSE","FACTORY","HOTEL","OTHER"] as const;
  const normalized = category.replace(/-/g, "_").toUpperCase();
  const propertyType = allowed.includes(normalized as (typeof allowed)[number]) ? normalized as (typeof allowed)[number] : undefined;
  const listings = await prisma.listing.findMany({
    where: { status: "PUBLISHED", deletedAt: null, ...(propertyType ? { propertyType } : {}) },
    include: { translations: true, province: true },
    orderBy: { publishedAt: "desc" },
    take: 30,
  });

  return (
    <main className="rb-container" style={{ padding: "1rem" }}>
      <section className="rb-card" style={{ marginBottom: 14 }}>
        <h1 style={{ marginTop: 0 }}>{startCase(category)} properties</h1>
        <p className="rb-muted">Discover verified {category.replace(/-/g, " ")} listings, compare options, and contact trusted publishers.</p>
      </section>
      <section className="rb-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
        {listings.length ? listings.map((listing) => (
          <ListingCard key={listing.id} listing={{ slug: listing.slug, title: listing.translations[0]?.title ?? listing.slug, priceUsd: listing.priceUsd.toString(), location: listing.province.nameEn, verified: listing.isVerified }} />
        )) : <article className="rb-card"><p>No published listings in this category yet.</p><Link href="/search" className="rb-btn rb-btn-secondary">Open full search</Link></article>}
      </section>
    </main>
  );
}
