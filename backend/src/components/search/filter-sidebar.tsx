"use client";

import { SearchFilters } from "@/search/types";

const PROPERTY_TYPES = ["APARTMENT", "CONDO", "HOUSE", "VILLA", "LAND", "OFFICE", "RETAIL"];

export function FilterSidebar({
  filters,
  patch,
  togglePropertyType,
  onApply,
}: {
  filters: SearchFilters;
  patch: (next: Partial<SearchFilters>) => void;
  togglePropertyType: (propertyType: string) => void;
  onApply: () => void;
}) {
  return (
    <aside className="w-80 shrink-0 rounded border bg-white p-4 space-y-4">
      <h2 className="text-lg font-semibold">Filters</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium">Listing Type</label>
        <select className="w-full border rounded p-2" value={filters.listingType ?? ""} onChange={(e) => patch({ listingType: (e.target.value || undefined) as SearchFilters["listingType"] })}>
          <option value="">All</option>
          <option value="SALE">For Sale</option>
          <option value="RENT">For Rent</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Property Types</label>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              className={`border rounded px-2 py-1 text-sm ${filters.propertyTypes.includes(type) ? "bg-slate-900 text-white" : "bg-white"}`}
              onClick={() => togglePropertyType(type)}
              type="button"
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input className="border rounded p-2" placeholder="Min USD" value={filters.minPriceUsd ?? ""} onChange={(e) => patch({ minPriceUsd: e.target.value ? Number(e.target.value) : undefined })} />
        <input className="border rounded p-2" placeholder="Max USD" value={filters.maxPriceUsd ?? ""} onChange={(e) => patch({ maxPriceUsd: e.target.value ? Number(e.target.value) : undefined })} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <input className="border rounded p-2" placeholder="Beds ≥" value={filters.minBedrooms ?? ""} onChange={(e) => patch({ minBedrooms: e.target.value ? Number(e.target.value) : undefined })} />
        <input className="border rounded p-2" placeholder="Beds ≤" value={filters.maxBedrooms ?? ""} onChange={(e) => patch({ maxBedrooms: e.target.value ? Number(e.target.value) : undefined })} />
        <input className="border rounded p-2" placeholder="Baths ≥" value={filters.minBathrooms ?? ""} onChange={(e) => patch({ minBathrooms: e.target.value ? Number(e.target.value) : undefined })} />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(filters.furnished)} onChange={(e) => patch({ furnished: e.target.checked ? true : undefined })} /> Furnished only</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(filters.verifiedOnly)} onChange={(e) => patch({ verifiedOnly: e.target.checked ? true : undefined })} /> Verified only</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(filters.hasParking)} onChange={(e) => patch({ hasParking: e.target.checked ? true : undefined })} /> Parking available</label>
      </div>

      <button className="w-full bg-slate-900 text-white rounded px-3 py-2" onClick={onApply} type="button">Apply Filters</button>
    </aside>
  );
}
