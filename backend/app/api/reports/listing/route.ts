import { NextRequest } from "next/server";
import { handleApiError, ok } from "@/lib/http";
import { reportListing } from "@/services/moderation-case.service";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const body = await request.json();
    const result = await reportListing({
      listingId: body.listingId,
      reporterId: auth.userId,
      reasonCode: body.reasonCode,
      description: body.description,
    });
    return ok(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
