import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/http";
import { createMessageThread, sendMessage } from "@/services/inquiry.service";
import { messageCreateSchema } from "@/validation/inquiries";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const body = await request.json();

    if (body.action === "create-thread") {
      const thread = await createMessageThread({
        inquiryId: body.inquiryId,
        listingId: body.listingId,
        participantAId: auth.userId,
        participantBId: body.participantBId,
      });
      return ok(thread, 201);
    }

    const parsed = messageCreateSchema.parse(body);
    const message = await sendMessage({
      threadId: parsed.threadId,
      senderId: auth.userId,
      body: parsed.body,
    });

    return ok(message, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
