"use client";

import { SearchFilters } from "@/search/types";

export function SearchResultsHeader({
  total,
  filters,
  onSort,
}: {
  total: number;
  filters: SearchFilters;
  onSort: (sort: SearchFilters["sort"]) => void;
}) {
  return (
    <header className="flex flex-wrap gap-2 items-center justify-between rounded border bg-white p-3">
      <div>
        <h1 className="text-lg font-semibold">Search Results</h1>
        <p className="text-sm text-slate-500">{total} properties found</p>
      </div>
      <select className="border rounded p-2" value={filters.sort} onChange={(e) => onSort(e.target.value as SearchFilters["sort"])}>
        <option value="relevance">Most Relevant</option>
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </header>
  );
}
