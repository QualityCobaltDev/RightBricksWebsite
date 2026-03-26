import { SearchFilters, DEFAULT_FILTERS } from "@/search/types";

function parseBoolean(value: string | null): boolean | undefined {
  if (value === null) return undefined;
  if (value === "1" || value.toLowerCase() === "true") return true;
  if (value === "0" || value.toLowerCase() === "false") return false;
  return undefined;
}

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function parseFiltersFromSearchParams(params: URLSearchParams): SearchFilters {
  return {
    q: params.get("q") ?? undefined,
    listingType: (params.get("listingType") as SearchFilters["listingType"]) ?? undefined,
    propertyTypes: params.getAll("propertyType").filter(Boolean),
    province: params.get("province") ?? undefined,
    district: params.get("district") ?? undefined,
    commune: params.get("commune") ?? undefined,
    minPriceUsd: parseNumber(params.get("minPriceUsd")),
    maxPriceUsd: parseNumber(params.get("maxPriceUsd")),
    minBedrooms: parseNumber(params.get("minBedrooms")),
    maxBedrooms: parseNumber(params.get("maxBedrooms")),
    minBathrooms: parseNumber(params.get("minBathrooms")),
    furnished: parseBoolean(params.get("furnished")),
    verifiedOnly: parseBoolean(params.get("verifiedOnly")),
    hasParking: parseBoolean(params.get("hasParking")),
    page: parseNumber(params.get("page")) ?? DEFAULT_FILTERS.page,
    pageSize: parseNumber(params.get("pageSize")) ?? DEFAULT_FILTERS.pageSize,
    sort: (params.get("sort") as SearchFilters["sort"]) ?? DEFAULT_FILTERS.sort,
    viewMode: (params.get("view") as SearchFilters["viewMode"]) ?? DEFAULT_FILTERS.viewMode,
  };
}

export function serializeFiltersToSearchParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.listingType) params.set("listingType", filters.listingType);
  filters.propertyTypes.forEach((type) => params.append("propertyType", type));
  if (filters.province) params.set("province", filters.province);
  if (filters.district) params.set("district", filters.district);
  if (filters.commune) params.set("commune", filters.commune);
  if (filters.minPriceUsd !== undefined) params.set("minPriceUsd", String(filters.minPriceUsd));
  if (filters.maxPriceUsd !== undefined) params.set("maxPriceUsd", String(filters.maxPriceUsd));
  if (filters.minBedrooms !== undefined) params.set("minBedrooms", String(filters.minBedrooms));
  if (filters.maxBedrooms !== undefined) params.set("maxBedrooms", String(filters.maxBedrooms));
  if (filters.minBathrooms !== undefined) params.set("minBathrooms", String(filters.minBathrooms));
  if (filters.furnished !== undefined) params.set("furnished", filters.furnished ? "1" : "0");
  if (filters.verifiedOnly !== undefined) params.set("verifiedOnly", filters.verifiedOnly ? "1" : "0");
  if (filters.hasParking !== undefined) params.set("hasParking", filters.hasParking ? "1" : "0");
  if (filters.page !== DEFAULT_FILTERS.page) params.set("page", String(filters.page));
  if (filters.pageSize !== DEFAULT_FILTERS.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set("sort", filters.sort);
  if (filters.viewMode !== DEFAULT_FILTERS.viewMode) params.set("view", filters.viewMode);

  return params;
}
