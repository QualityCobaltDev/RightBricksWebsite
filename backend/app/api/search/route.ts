import { NextRequest } from "next/server";
import { searchListings } from "@/services/search.service";
import { handleApiError, ok } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const data = await searchListings({
      text: searchParams.get("q") ?? undefined,
      provinceId: searchParams.get("provinceId") ?? undefined,
      districtId: searchParams.get("districtId") ?? undefined,
      minPriceUsd: searchParams.get("minPriceUsd") ? Number(searchParams.get("minPriceUsd")) : undefined,
      maxPriceUsd: searchParams.get("maxPriceUsd") ? Number(searchParams.get("maxPriceUsd")) : undefined,
      minBedrooms: searchParams.get("minBedrooms") ? Number(searchParams.get("minBedrooms")) : undefined,
      maxBedrooms: searchParams.get("maxBedrooms") ? Number(searchParams.get("maxBedrooms")) : undefined,
    });

    return ok(data);
  } catch (error) {
    return handleApiError(error);
  }
}
