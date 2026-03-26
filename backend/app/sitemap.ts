import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/seo/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries();
}
