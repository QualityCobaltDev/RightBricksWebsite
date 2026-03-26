import Link from "next/link";
import { ListingCard } from "@/components/listings/listing-card";

export function HomepageSections({
  featuredListings,
  featuredGuides,
}: {
  featuredListings: Array<{ id: string; slug: string; title: string; priceUsd: string; province?: string; isVerified?: boolean }>;
  featuredGuides: Array<{ id: string; slug: string; title: string }>;
}) {
  return (
    <div>
      <section className="rb-hero">
        <div className="rb-card">
          <h1 style={{ fontSize: "2rem", marginTop: 0 }}>Find verified property and trusted local experts with RightBricks</h1>
          <p className="rb-muted">Search by location, property type, and budget with verification and moderation safeguards built in.</p>
          <form action="/search" className="rb-search-row" style={{ marginTop: 16 }}>
            <input className="rb-input" name="q" placeholder="Keyword, neighborhood, project..." />
            <input className="rb-input" name="province" placeholder="Province" />
            <select className="rb-select" name="propertyType" defaultValue="">
              <option value="">Any category</option>
              <option value="CONDO">Condo</option>
              <option value="VILLA">Villa</option>
              <option value="LAND">Land</option>
            </select>
            <button className="rb-btn rb-btn-primary" type="submit">Search</button>
          </form>
        </div>
      </section>

      <section className="rb-grid" style={{ gridTemplateColumns: "2fr 1fr", marginBottom: 18 }}>
        <article className="rb-card">
          <h2 style={{ marginTop: 0 }}>How RightBricks protects your search</h2>
          <ul className="rb-muted">
            <li>Listing verification indicators and trusted publisher profiles.</li>
            <li>Structured moderation and abuse report workflow for safer discovery.</li>
            <li>Clear inquiry pathways backed by audit-aware backend systems.</li>
          </ul>
        </article>
        <article className="rb-card">
          <h3 style={{ marginTop: 0 }}>For agents and owners</h3>
          <p className="rb-muted">Publish listings, manage inquiries, and verify your profile in one dashboard.</p>
          <Link className="rb-btn rb-btn-secondary" href="/dashboard/owner">Open dashboard</Link>
        </article>
      </section>

      <section style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Featured listings</h2>
          <Link href="/search" className="rb-muted">View all</Link>
        </div>
        <div className="rb-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={{ slug: listing.slug, title: listing.title, priceUsd: listing.priceUsd, location: listing.province, verified: listing.isVerified }} />
          ))}
        </div>
      </section>

      <section className="rb-card" style={{ marginBottom: 18 }}>
        <h2 style={{ marginTop: 0 }}>Popular discovery paths</h2>
        <div className="rb-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
          <Link href="/areas/phnom-penh" className="rb-btn rb-btn-secondary">Phnom Penh</Link>
          <Link href="/areas/siem-reap" className="rb-btn rb-btn-secondary">Siem Reap</Link>
          <Link href="/categories/condo" className="rb-btn rb-btn-secondary">Condo listings</Link>
          <Link href="/categories/villa" className="rb-btn rb-btn-secondary">Villa listings</Link>
        </div>
      </section>

      <section className="rb-card">
        <h2 style={{ marginTop: 0 }}>Latest guides</h2>
        <div className="rb-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
          {featuredGuides.map((guide) => (
            <Link key={guide.id} href={`/guides/${guide.slug}`} className="rb-btn rb-btn-secondary">{guide.title}</Link>
          ))}
        </div>
      </section>
    </div>
  );
}
