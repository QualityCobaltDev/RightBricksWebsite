import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/login", "/unauthorized"],
      },
    ],
    sitemap: "https://rightbricks.online/sitemap.xml",
    host: "https://rightbricks.online",
  };
}
