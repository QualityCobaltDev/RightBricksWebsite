import { NextRequest } from "next/server";
import { registerSchema } from "@/validation/auth";
import { registerUser } from "@/services/auth.service";
import { handleApiError, ok } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const input = registerSchema.parse(await request.json());
    const result = await registerUser(input);
    return ok(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
