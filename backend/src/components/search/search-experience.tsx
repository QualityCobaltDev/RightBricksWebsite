"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchFilters, SearchResultItem } from "@/search/types";
import { useSearchState } from "@/search/use-search-state";
import { rankResults } from "@/search/ranking";
import { FilterSidebar } from "@/components/search/filter-sidebar";
import { MobileFilterDrawer } from "@/components/search/mobile-filter-drawer";
import { SearchResultsHeader } from "@/components/search/search-results-header";
import { ActiveFilterChips } from "@/components/search/active-filter-chips";
import { SaveSearchModal } from "@/components/search/save-search-modal";
import { AlertCreationFlow } from "@/components/search/alert-creation-flow";
import { MapListToggle } from "@/components/search/map-list-toggle";
import { ResultList } from "@/components/search/result-list";
import { MapPlaceholder } from "@/components/search/map-placeholder";
import { serializeFiltersToSearchParams } from "@/search/filters";

export function SearchExperience() {
  const { filters, patch, togglePropertyType, applyUrlState, reset } = useSearchState();
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const params = serializeFiltersToSearchParams(filters).toString();
      const response = await fetch(`/api/search?${params}`);
      const payload = await response.json();

      const mapped: SearchResultItem[] = (payload.data ?? []).map((item: any) => ({
        id: item.id,
        slug: item.slug,
        title: item.translations?.[0]?.title ?? item.slug,
        listingType: item.listingType,
        propertyType: item.propertyType,
        priceUsd: String(item.priceUsd),
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        isFeatured: item.isFeatured,
        isVerified: item.isVerified,
        latitude: String(item.latitude),
        longitude: String(item.longitude),
        imageUrl: item.media?.[0]?.publicUrl,
        publishedAt: item.publishedAt,
      }));

      setResults(rankResults(filters, mapped));
      setLoading(false);
    };

    run().catch(() => setLoading(false));
  }, [filters]);

  const total = results.length;
  const paged = useMemo(() => {
    const start = (filters.page - 1) * filters.pageSize;
    return results.slice(start, start + filters.pageSize);
  }, [filters.page, filters.pageSize, results]);

  function clearChip(key: keyof SearchFilters | "propertyTypes") {
    if (key === "propertyTypes") return patch({ propertyTypes: [] });
    patch({ [key]: undefined } as Partial<SearchFilters>);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-[1400px] mx-auto space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <input
              value={filters.q ?? ""}
              onChange={(e) => patch({ q: e.target.value })}
              onBlur={applyUrlState}
              placeholder="Search in Cambodia (e.g. condo in Phnom Penh)"
              className="border rounded p-2 w-full bg-white"
            />
            <MapListToggle viewMode={filters.viewMode} onChange={(viewMode) => patch({ viewMode })} />
            <SaveSearchModal filters={filters} />
          </div>
          <MobileFilterDrawer filters={filters} patch={patch} togglePropertyType={togglePropertyType} onApply={applyUrlState} />
        </div>

        <SearchResultsHeader total={total} filters={filters} onSort={(sort) => patch({ sort })} />
        <ActiveFilterChips filters={filters} onClear={clearChip} />

        <div className="hidden md:block">
          <button className="text-sm underline" onClick={reset}>Reset filters</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4">
          <div className="hidden md:block">
            <FilterSidebar filters={filters} patch={patch} togglePropertyType={togglePropertyType} onApply={applyUrlState} />
          </div>

          <section className="space-y-3">
            <AlertCreationFlow />
            {loading ? <div className="rounded border bg-white p-4">Loading...</div> : null}
            {!loading && filters.viewMode === "list" ? <ResultList items={paged} /> : null}
            {!loading && filters.viewMode === "map" ? <MapPlaceholder items={paged} /> : null}
          </section>
        </div>
      </div>
    </main>
  );
}
