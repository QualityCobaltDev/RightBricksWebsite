"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseFiltersFromSearchParams, serializeFiltersToSearchParams } from "@/search/filters";
import { SearchFilters } from "@/search/types";
import { buildSeoSearchPath } from "@/search/url";

export function useSearchState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initial = useMemo(() => parseFiltersFromSearchParams(searchParams), [searchParams]);
  const [filters, setFilters] = useState<SearchFilters>(initial);

  function patch(next: Partial<SearchFilters>) {
    setFilters((prev) => ({ ...prev, ...next, page: next.page ?? 1 }));
  }

  function togglePropertyType(propertyType: string) {
    setFilters((prev) => {
      const exists = prev.propertyTypes.includes(propertyType);
      return {
        ...prev,
        propertyTypes: exists
          ? prev.propertyTypes.filter((t) => t !== propertyType)
          : [...prev.propertyTypes, propertyType],
        page: 1,
      };
    });
  }

  function applyUrlState() {
    const params = serializeFiltersToSearchParams(filters).toString();
    const seoPath = buildSeoSearchPath(filters);
    const nextUrl = params ? `${seoPath}?${params}` : seoPath;
    if (pathname !== nextUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }

  function reset() {
    setFilters((prev) => ({ ...prev, q: "", propertyTypes: [], minPriceUsd: undefined, maxPriceUsd: undefined, minBedrooms: undefined, maxBedrooms: undefined, minBathrooms: undefined, furnished: undefined, verifiedOnly: undefined, hasParking: undefined, page: 1 }));
  }

  return {
    filters,
    patch,
    reset,
    togglePropertyType,
    applyUrlState,
  };
}
