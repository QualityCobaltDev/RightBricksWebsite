import Link from "next/link";
import { formatCurrency } from "@/lib/frontend/format";

export function ListingCard({ listing }: { listing: { slug: string; title: string; priceUsd: string; location?: string; verified?: boolean } }) {
  return (
    <Link href={`/listing/${listing.slug}`} className="rb-card" style={{ display: "block" }}>
      <p style={{ fontWeight: 700, margin: "0 0 6px" }}>{listing.title}</p>
      <p className="rb-muted" style={{ margin: "0 0 10px" }}>{listing.location ?? "Cambodia"}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>{formatCurrency(listing.priceUsd)}</strong>
        {listing.verified ? <span style={{ background: "#ecfdf5", color: "#065f46", padding: "2px 8px", borderRadius: 999 }}>Verified</span> : null}
      </div>
    </Link>
  );
}
