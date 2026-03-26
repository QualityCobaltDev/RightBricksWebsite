import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { assertPermission } from "@/lib/rbac";
import { handleApiError, ok } from "@/lib/http";
import { listModerationCases } from "@/services/moderation-case.service";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    assertPermission(auth.roles, "listing:moderate");

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as any;
    const rows = await listModerationCases(status ?? undefined);
    return ok(rows);
  } catch (error) {
    return handleApiError(error);
  }
}
