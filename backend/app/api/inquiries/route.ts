import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { assertPermission } from "@/lib/rbac";
import { handleApiError, ok } from "@/lib/http";
import { createInquiry } from "@/services/inquiry.service";
import { inquiryCreateSchema } from "@/validation/inquiries";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    assertPermission(auth.roles, "inquiry:create");

    const input = inquiryCreateSchema.parse(await request.json());
    const inquiry = await createInquiry({ ...input, createdById: auth.userId });
    return ok(inquiry, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
