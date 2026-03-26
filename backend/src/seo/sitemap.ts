import { prisma } from "@/lib/prisma";
import { SEO_DEFAULTS } from "@/seo/config";

export async function buildSitemapEntries() {
  const [listings, guides, blog, provinces] = await Promise.all([
    prisma.listing.findMany({ where: { status: "PUBLISHED", deletedAt: null }, select: { slug: true, updatedAt: true }, take: 50000 }),
    prisma.cmsArticle.findMany({ where: { status: "PUBLISHED", deletedAt: null, category: "guides" }, select: { slug: true, updatedAt: true }, take: 50000 }),
    prisma.cmsArticle.findMany({ where: { status: "PUBLISHED", deletedAt: null, category: "blog" }, select: { slug: true, updatedAt: true }, take: 50000 }),
    prisma.province.findMany({ select: { slug: true, createdAt: true }, take: 50000 }),
  ]);

  const staticUrls = ["/", "/search", "/buy", "/rent", "/about", "/contact", "/guides", "/blog"].map((path) => ({
    url: `${SEO_DEFAULTS.baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const listingUrls = listings.map((listing) => ({
    url: `${SEO_DEFAULTS.baseUrl}/listing/${listing.slug}`,
    lastModified: listing.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const guideUrls = guides.map((article) => ({
    url: `${SEO_DEFAULTS.baseUrl}/guides/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const blogUrls = blog.map((article) => ({
    url: `${SEO_DEFAULTS.baseUrl}/blog/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const areaUrls = provinces.map((province) => ({
    url: `${SEO_DEFAULTS.baseUrl}/areas/${province.slug}`,
    lastModified: province.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticUrls, ...listingUrls, ...guideUrls, ...blogUrls, ...areaUrls];
}
