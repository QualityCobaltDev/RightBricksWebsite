import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { assertPermission } from "@/lib/rbac";
import { handleApiError, ok } from "@/lib/http";
import { moderateListing } from "@/services/moderation.service";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request);
    assertPermission(auth.roles, "listing:moderate");
    const { id } = await context.params;
    const body = await request.json();

    const result = await moderateListing({
      listingId: id,
      moderatorId: auth.userId,
      decision: body.decision,
      reasonCode: body.reasonCode,
      notes: body.notes,
    });

    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}
