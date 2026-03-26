import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { assertPermission } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { handleApiError, ok } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    assertPermission(auth.roles, "audit:read");

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType") ?? undefined;
    const entityId = searchParams.get("entityId") ?? undefined;

    const records = await prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return ok(records);
  } catch (error) {
    return handleApiError(error);
  }
}
