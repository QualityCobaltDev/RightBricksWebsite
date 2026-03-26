import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { assertPermission } from "@/lib/rbac";
import { handleApiError, ok } from "@/lib/http";
import { createArticle, listPublishedArticles } from "@/services/cms.service";
import { articleCreateSchema } from "@/validation/cms";

export async function GET() {
  try {
    const items = await listPublishedArticles();
    return ok(items);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    assertPermission(auth.roles, "cms:write");

    const input = articleCreateSchema.parse(await request.json());
    const created = await createArticle({
      userId: auth.userId,
      slug: input.slug,
      category: input.category,
      canonicalUrl: input.canonicalUrl,
      titleEn: input.titleEn,
      bodyEn: input.bodyEn,
      titleKm: input.titleKm,
      bodyKm: input.bodyKm,
      publishNow: input.publishNow,
    });

    return ok(created, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
