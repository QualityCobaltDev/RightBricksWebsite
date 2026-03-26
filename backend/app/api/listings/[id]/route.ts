import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { assertPermission } from "@/lib/rbac";
import { handleApiError, ok } from "@/lib/http";
import { updateListing } from "@/services/listing.service";
import { listingUpdateSchema } from "@/validation/listings";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request);
    assertPermission(auth.roles, "listing:update");
    const { id } = await context.params;
    const payload = listingUpdateSchema.parse(await request.json());

    const updated = await updateListing(auth.userId, id, {
      ...payload,
      latitude: payload.latitude,
      longitude: payload.longitude,
      priceUsd: payload.priceUsd,
      priceKhrApprox: payload.priceKhrApprox,
    });

    return ok(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
