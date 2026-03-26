import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/seo/metadata";
import { breadcrumbSchema } from "@/seo/schema";
import { JsonLd } from "@/components/cms/json-ld";
import { ListingCard } from "@/components/listings/listing-card";

export async function generateMetadata({ params }: { params: Promise<{ province: string }> }) {
  const { province } = await params;
  const p = await prisma.province.findFirst({ where: { slug: province } });
  if (!p) return buildMetadata({ path: `/areas/${province}`, noIndex: true });
  return buildMetadata({ path: `/areas/${p.slug}`, title: `Property in ${p.nameEn} | RightBricks`, description: `Explore homes, condos, and rentals in ${p.nameEn}, Cambodia.` });
}

export default async function AreaPage({ params }: { params: Promise<{ province: string }> }) {
  const { province } = await params;
  const data = await prisma.province.findFirst({
    where: { slug: province },
    include: { listings: { where: { status: "PUBLISHED", deletedAt: null }, include: { translations: true }, orderBy: { publishedAt: "desc" }, take: 24 } },
  });
  if (!data) notFound();

  return (
    <main className="rb-container" style={{ padding: "1rem" }}>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Areas", path: "/areas" }, { name: data.nameEn, path: `/areas/${data.slug}` }])} />
      <section className="rb-card" style={{ marginBottom: 14 }}>
        <p className="rb-muted" style={{ marginTop: 0 }}><Link href="/">Home</Link> / Areas / {data.nameEn}</p>
        <h1 style={{ marginBottom: 8 }}>Properties in {data.nameEn}</h1>
        <p className="rb-muted">Browse verified listings, compare neighborhoods, and connect with trusted agents in {data.nameEn}.</p>
      </section>
      <section className="rb-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
        {data.listings.length ? data.listings.map((listing) => (
          <ListingCard key={listing.id} listing={{ slug: listing.slug, title: listing.translations[0]?.title ?? listing.slug, priceUsd: listing.priceUsd.toString(), location: data.nameEn, verified: listing.isVerified }} />
        )) : <div className="rb-card"><p>No active listings yet for this province.</p><Link href="/search" className="rb-btn rb-btn-secondary">Search all areas</Link></div>}
      </section>
    </main>
  );
}
