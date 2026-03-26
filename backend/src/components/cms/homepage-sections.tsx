import Link from "next/link";

export function HomepageSections({
  featuredListings,
  featuredGuides,
}: {
  featuredListings: Array<{ id: string; slug: string; title: string; priceUsd: string }>;
  featuredGuides: Array<{ id: string; slug: string; title: string }>;
}) {
  return (
    <div className="space-y-8">
      <section className="rounded border bg-white p-4">
        <h2 className="text-xl font-semibold">Featured Listings</h2>
        <div className="grid md:grid-cols-3 gap-3 mt-3">
          {featuredListings.map((listing) => (
            <Link key={listing.id} href={`/listing/${listing.slug}`} className="border rounded p-3 hover:bg-slate-50">
              <p className="font-medium">{listing.title}</p>
              <p className="text-sm text-slate-500">${listing.priceUsd}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded border bg-white p-4">
        <h2 className="text-xl font-semibold">Guides</h2>
        <div className="grid md:grid-cols-3 gap-3 mt-3">
          {featuredGuides.map((guide) => (
            <Link key={guide.id} href={`/guides/${guide.slug}`} className="border rounded p-3 hover:bg-slate-50">
              <p className="font-medium">{guide.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
