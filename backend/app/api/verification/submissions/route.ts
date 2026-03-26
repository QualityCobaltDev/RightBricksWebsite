import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/http";
import { submitVerificationRequest } from "@/services/verification.service";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const body = await request.json();
    const created = await submitVerificationRequest({
      userId: auth.userId,
      requestedType: body.requestedType,
      documentStorageKey: body.documentStorageKey,
    });
    return ok(created, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
