import Link from "next/link";
import { SearchResultItem } from "@/search/types";

export function ResultList({ items }: { items: SearchResultItem[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {items.map((item) => (
        <article key={item.id} className="rounded border bg-white overflow-hidden">
          <div className="p-3 space-y-1">
            <h3 className="font-semibold">
              <Link href={`/listing/${item.slug}`}>{item.title}</Link>
            </h3>
            <p className="text-sm text-slate-500">{item.propertyType} · {item.listingType}</p>
            <p className="font-semibold">${item.priceUsd}</p>
            <p className="text-xs text-slate-500">{item.bedrooms ?? "-"} bed · {item.bathrooms ?? "-"} bath</p>
          </div>
        </article>
      ))}
    </div>
  );
}
