import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { assertPermission } from "@/lib/rbac";
import { handleApiError, ok } from "@/lib/http";
import { createViewingRequest } from "@/services/viewing-request.service";
import { viewingRequestCreateSchema } from "@/validation/inquiries";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    assertPermission(auth.roles, "viewing:create");

    const input = viewingRequestCreateSchema.parse(await request.json());
    const result = await createViewingRequest({
      requesterId: auth.userId,
      listingId: input.listingId,
      requestedAt: new Date(input.requestedAt),
      note: input.note,
    });

    return ok(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
