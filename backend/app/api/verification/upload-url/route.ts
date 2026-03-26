import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/http";
import { generatePrivateUploadUrl } from "@/lib/private-storage";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const body = await request.json();

    const signed = await generatePrivateUploadUrl({
      scope: "verification",
      filename: body.filename,
      contentType: body.contentType,
      actorId: auth.userId,
    });

    return ok(signed, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
