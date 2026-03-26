import { NextRequest } from "next/server";
import { loginSchema } from "@/validation/auth";
import { loginUser } from "@/services/auth.service";
import { handleApiError, ok } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const input = loginSchema.parse(await request.json());
    const result = await loginUser(input);
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}
