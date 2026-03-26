import { NextRequest } from "next/server";
import { handleApiError, ok } from "@/lib/http";
import { getListingSeoMeta } from "@/services/seo.service";
import { notFound } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("listingSlug");
    if (!slug) throw notFound("listingSlug is required");

    const meta = await getListingSeoMeta(slug);
    if (!meta) throw notFound("SEO metadata not found");

    return ok(meta);
  } catch (error) {
    return handleApiError(error);
  }
}
