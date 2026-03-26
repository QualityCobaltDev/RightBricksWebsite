import { SearchFilters, SearchResultItem } from "@/search/types";

export function scoreResult(filters: SearchFilters, item: SearchResultItem): number {
  let score = 0;

  if (item.isFeatured) score += 10;
  if (item.isVerified) score += 8;

  if (filters.q) {
    const q = filters.q.toLowerCase();
    if (item.title.toLowerCase().includes(q)) score += 6;
  }

  if (filters.listingType && item.listingType === filters.listingType) score += 3;

  if (item.publishedAt) {
    const ageDays = (Date.now() - new Date(item.publishedAt).getTime()) / 86_400_000;
    score += Math.max(0, 5 - ageDays / 10);
  }

  return score;
}

export function rankResults(filters: SearchFilters, results: SearchResultItem[]): SearchResultItem[] {
  if (filters.sort !== "relevance") return results;
  return [...results].sort((a, b) => scoreResult(filters, b) - scoreResult(filters, a));
}
