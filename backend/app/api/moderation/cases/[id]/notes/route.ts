import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { assertPermission } from "@/lib/rbac";
import { handleApiError, ok } from "@/lib/http";
import { addModerationNote } from "@/services/moderation-case.service";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request);
    assertPermission(auth.roles, "listing:moderate");
    const { id } = await context.params;
    const body = await request.json();

    const note = await addModerationNote({
      caseId: id,
      authorId: auth.userId,
      body: body.body,
      isInternal: body.isInternal,
    });

    return ok(note, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
