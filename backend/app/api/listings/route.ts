import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { assertPermission } from "@/lib/rbac";
import { handleApiError, ok } from "@/lib/http";
import { createListing, listPublicListings } from "@/services/listing.service";
import { listingCreateSchema } from "@/validation/listings";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const results = await listPublicListings({
      provinceId: searchParams.get("provinceId") ?? undefined,
      districtId: searchParams.get("districtId") ?? undefined,
      minPriceUsd: searchParams.get("minPriceUsd") ? Number(searchParams.get("minPriceUsd")) : undefined,
      maxPriceUsd: searchParams.get("maxPriceUsd") ? Number(searchParams.get("maxPriceUsd")) : undefined,
      bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
    });
    return ok(results);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    assertPermission(auth.roles, "listing:create");

    const input = listingCreateSchema.parse(await request.json());
    const listing = await createListing(auth.userId, input);
    return ok(listing, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
