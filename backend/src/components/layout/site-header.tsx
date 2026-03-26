import Link from "next/link";

const nav = [
  { href: "/search", label: "Search" },
  { href: "/categories/condo", label: "Categories" },
  { href: "/areas/phnom-penh", label: "Areas" },
  { href: "/guides/renting-in-cambodia", label: "Guides" },
];

export function SiteHeader() {
  return (
    <header className="rb-header">
      <div className="rb-container rb-header-inner">
        <Link href="/" className="rb-brand">RightBricks</Link>
        <nav className="rb-nav" aria-label="Primary navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rb-muted">{item.label}</Link>
          ))}
        </nav>
        <div className="rb-nav" style={{ gap: 8 }}>
          <Link href="/login" className="rb-btn rb-btn-secondary">Log in</Link>
          <Link href="/dashboard/owner" className="rb-btn rb-btn-primary">Dashboard</Link>
        </div>
      </div>
    </header>
  );
}
