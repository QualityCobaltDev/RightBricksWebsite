import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { assertPermission } from "@/lib/rbac";
import { handleApiError, ok } from "@/lib/http";
import { notificationProvider } from "@/services/notification.service";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    assertPermission(auth.roles, "search:save");

    const payload = await request.json();
    await notificationProvider.sendEmail({
      to: payload.to,
      subject: "RightBricks Alert Test",
      body: `This is a test alert for ${auth.email}`,
    });

    return ok({ sent: true });
  } catch (error) {
    return handleApiError(error);
  }
}
