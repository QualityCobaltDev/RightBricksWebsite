import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { assertPermission } from "@/lib/rbac";
import { handleApiError, ok } from "@/lib/http";
import { createSavedSearch, getSavedSearches } from "@/services/saved-search.service";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    assertPermission(auth.roles, "search:save");
    const results = await getSavedSearches(auth.userId);
    return ok(results);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    assertPermission(auth.roles, "search:save");
    const payload = await request.json();

    const created = await createSavedSearch(auth.userId, {
      name: payload.name,
      locale: payload.locale,
      listingType: payload.listingType,
      propertyTypes: payload.propertyTypes,
      provinceId: payload.provinceId,
      districtId: payload.districtId,
      minPriceUsd: payload.minPriceUsd,
      maxPriceUsd: payload.maxPriceUsd,
      minBedrooms: payload.minBedrooms,
      maxBedrooms: payload.maxBedrooms,
      createAlert: Boolean(payload.createAlert),
    });

    return ok(created, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
