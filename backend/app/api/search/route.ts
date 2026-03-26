import { NextRequest } from "next/server";
import { searchListings } from "@/services/search.service";
import { handleApiError, ok } from "@/lib/http";
import { parseFiltersFromSearchParams } from "@/search/filters";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = parseFiltersFromSearchParams(searchParams);
    const data = await searchListings(filters);

    return ok(data);
  } catch (error) {
    return handleApiError(error);
  }
}
