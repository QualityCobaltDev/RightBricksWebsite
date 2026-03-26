export type ListingType = "SALE" | "RENT";

export type SearchFilters = {
  q?: string;
  listingType?: ListingType;
  propertyTypes: string[];
  province?: string;
  district?: string;
  commune?: string;
  minPriceUsd?: number;
  maxPriceUsd?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  furnished?: boolean;
  verifiedOnly?: boolean;
  hasParking?: boolean;
  page: number;
  pageSize: number;
  sort: "relevance" | "newest" | "price_asc" | "price_desc";
  viewMode: "list" | "map";
};

export type SearchResultItem = {
  id: string;
  slug: string;
  title: string;
  listingType: string;
  propertyType: string;
  priceUsd: string;
  bedrooms: number | null;
  bathrooms: number | null;
  isFeatured: boolean;
  isVerified: boolean;
  latitude: string;
  longitude: string;
  imageUrl?: string;
  publishedAt?: string;
};

export const DEFAULT_FILTERS: SearchFilters = {
  propertyTypes: [],
  page: 1,
  pageSize: 24,
  sort: "relevance",
  viewMode: "list",
};
