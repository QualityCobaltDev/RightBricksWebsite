"use client";

import { SearchFilters } from "@/search/types";

export function ActiveFilterChips({ filters, onClear }: { filters: SearchFilters; onClear: (key: keyof SearchFilters | "propertyTypes") => void }) {
  const chips: Array<{ label: string; key: keyof SearchFilters | "propertyTypes" }> = [];
  if (filters.listingType) chips.push({ label: filters.listingType === "SALE" ? "For Sale" : "For Rent", key: "listingType" });
  if (filters.propertyTypes.length) chips.push({ label: `Types: ${filters.propertyTypes.join(", ")}`, key: "propertyTypes" });
  if (filters.minPriceUsd !== undefined) chips.push({ label: `Min $${filters.minPriceUsd}`, key: "minPriceUsd" });
  if (filters.maxPriceUsd !== undefined) chips.push({ label: `Max $${filters.maxPriceUsd}`, key: "maxPriceUsd" });
  if (filters.verifiedOnly) chips.push({ label: "Verified", key: "verifiedOnly" });

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button key={chip.label} onClick={() => onClear(chip.key)} className="border rounded-full px-3 py-1 text-xs bg-white">
          {chip.label} ✕
        </button>
      ))}
    </div>
  );
}
