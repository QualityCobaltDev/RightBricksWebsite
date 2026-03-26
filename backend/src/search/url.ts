import { SearchFilters } from "@/search/types";
import { serializeFiltersToSearchParams } from "@/search/filters";

const CLEAN_SEGMENT = /[^a-z0-9-]/g;

function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(CLEAN_SEGMENT, "");
}

export function buildSeoSearchPath(filters: SearchFilters): string {
  const scope = filters.district ?? filters.province ?? "cambodia";
  const type = filters.listingType === "RENT" ? "for-rent" : filters.listingType === "SALE" ? "for-sale" : "all";
  return `/search/${slugify(scope)}/${type}`;
}

export function buildSearchUrl(filters: SearchFilters): string {
  const path = buildSeoSearchPath(filters);
  const params = serializeFiltersToSearchParams(filters);
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export function canonicalSearchUrl(baseUrl: string, filters: SearchFilters) {
  const path = buildSeoSearchPath(filters);
  return `${baseUrl}${path}`;
}
