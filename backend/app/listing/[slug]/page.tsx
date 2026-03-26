import Link from "next/link";
import { notFound } from "next/navigation";
import { LocaleCode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/seo/metadata";
import { listingSchema, breadcrumbSchema } from "@/seo/schema";
import { localizedField, normalizeLocale } from "@/seo/i18n";
import { JsonLd } from "@/components/cms/json-ld";
import { ListingTrustBadge } from "@/components/trust/listing-trust-badge";
import { ReportListingModal } from "@/components/trust/report-listing-modal";
import { formatCurrency } from "@/lib/frontend/format";
import { ListingCard } from "@/components/listings/listing-card";

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> }) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = normalizeLocale(lang);
  const listing = await prisma.listing.findFirst({ where: { slug, status: "PUBLISHED", deletedAt: null }, include: { translations: true, media: true, owner: true } });
  if (!listing) return buildMetadata({ path: `/listing/${slug}`, noIndex: true });

  const en = listing.translations.find((t) => t.locale === LocaleCode.EN);
  const km = listing.translations.find((t) => t.locale === LocaleCode.KM);
  return buildMetadata({
    path: `/listing/${listing.slug}`,
    title: localizedField({ titleEn: en?.seoTitle ?? en?.title, titleKm: km?.seoTitle ?? km?.title }, locale, "title"),
    description: localizedField({ descriptionEn: en?.seoDescription ?? en?.description, descriptionKm: km?.seoDescription ?? km?.description }, locale, "description"),
    image: listing.media[0]?.publicUrl,
  });
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await prisma.listing.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: { translations: true, media: true, owner: true, province: true, district: true, amenityLinks: { include: { amenity: true } } },
  });
  if (!listing) notFound();

  const title = listing.translations[0]?.title ?? listing.slug;
  const description = listing.translations[0]?.description ?? "";

  const related = await prisma.listing.findMany({
    where: { id: { not: listing.id }, status: "PUBLISHED", deletedAt: null, provinceId: listing.provinceId },
    include: { translations: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <main className="rb-container" style={{ padding: "1rem" }}>
      <JsonLd data={listingSchema({ name: title, description, slug: listing.slug, image: listing.media[0]?.publicUrl, priceUsd: listing.priceUsd.toString(), latitude: listing.latitude.toString(), longitude: listing.longitude.toString(), address: listing.addressLine1 })} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Search", path: "/search" }, { name: title, path: `/listing/${listing.slug}` }])} />

      <p className="rb-muted" style={{ marginTop: 0 }}><Link href="/">Home</Link> / <Link href="/search">Search</Link> / {title}</p>
      <section className="rb-grid" style={{ gridTemplateColumns: "2fr 1fr", alignItems: "start" }}>
        <article className="rb-card">
          <h1 style={{ marginTop: 0 }}>{title}</h1>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <ListingTrustBadge isVerified={listing.isVerified} publisherVerified={listing.owner ? listing.owner.verificationStatus === "VERIFIED" : false} />
            <ReportListingModal listingId={listing.id} />
          </div>
          <p style={{ fontSize: "1.4rem", margin: "0 0 10px" }}><strong>{formatCurrency(listing.priceUsd.toString())}</strong></p>
          <p className="rb-muted">{listing.province.nameEn}, {listing.district.nameEn}</p>
          <p>{description}</p>
          <h3>Features</h3>
          <p className="rb-muted">{listing.bedrooms ?? "-"} beds • {listing.bathrooms ?? "-"} baths • {listing.floorAreaSqm?.toString() ?? "-"} sqm</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {listing.amenityLinks.slice(0, 10).map((item) => <span key={item.id} className="rb-btn rb-btn-secondary">{item.amenity.nameEn}</span>)}
          </div>
        </article>
        <aside className="rb-card">
          <h2 style={{ marginTop: 0 }}>Contact publisher</h2>
          <p className="rb-muted">Secure inquiries are logged for moderation and trust protection.</p>
          <Link href={`/search?listing=${listing.slug}`} className="rb-btn rb-btn-primary">Send inquiry</Link>
          <p className="rb-muted" style={{ marginTop: 12 }}>Need help? Report suspicious listings directly from this page.</p>
        </aside>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2>Related listings</h2>
        <div className="rb-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
          {related.map((item) => <ListingCard key={item.id} listing={{ slug: item.slug, title: item.translations[0]?.title ?? item.slug, priceUsd: item.priceUsd.toString(), verified: item.isVerified }} />)}
        </div>
      </section>
    </main>
  );
}
