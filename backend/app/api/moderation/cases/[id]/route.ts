import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { assertPermission } from "@/lib/rbac";
import { handleApiError, ok } from "@/lib/http";
import { getModerationCaseById, moderateCaseAction } from "@/services/moderation-case.service";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request);
    assertPermission(auth.roles, "listing:moderate");
    const { id } = await context.params;

    const row = await getModerationCaseById(id);
    return ok(row);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request);
    assertPermission(auth.roles, "listing:moderate");
    const { id } = await context.params;
    const body = await request.json();

    const updated = await moderateCaseAction({
      caseId: id,
      moderatorId: auth.userId,
      action: body.action,
      reasonCode: body.reasonCode,
      note: body.note,
    });
    return ok(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
