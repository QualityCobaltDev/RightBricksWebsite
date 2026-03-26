import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="rb-footer">
      <div className="rb-container rb-footer-grid">
        <div>
          <p style={{ fontWeight: 700 }}>RightBricks</p>
          <p style={{ color: "#94a3b8" }}>Trusted property discovery with verification-first workflows.</p>
        </div>
        <div>
          <p style={{ fontWeight: 700 }}>Explore</p>
          <p><Link href="/search">Search Listings</Link></p>
          <p><Link href="/verification/submit">Get Verified</Link></p>
        </div>
        <div>
          <p style={{ fontWeight: 700 }}>Resources</p>
          <p><Link href="/guides/renting-in-cambodia">Guides</Link></p>
          <p><Link href="/blog/property-market-updates">Blog</Link></p>
        </div>
      </div>
    </footer>
  );
}
