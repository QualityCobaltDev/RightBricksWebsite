import type { Metadata } from "next";
import { SEO_DEFAULTS } from "@/seo/config";

type MetadataInput = {
  title?: string;
  description?: string;
  path: string;
  image?: string | null;
  locale?: "en" | "km";
  type?: "website" | "article";
  noIndex?: boolean;
};

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SEO_DEFAULTS.baseUrl}${normalized}`;
}

export function buildMetadata(input: MetadataInput): Metadata {
  const title = input.title ?? SEO_DEFAULTS.defaultTitle;
  const description = input.description ?? SEO_DEFAULTS.defaultDescription;
  const canonical = absoluteUrl(input.path);
  const image = input.image ? absoluteUrl(input.image) : SEO_DEFAULTS.ogImage;
  const locale = input.locale ?? "en";

  return {
    metadataBase: new URL(SEO_DEFAULTS.baseUrl),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        km: canonical,
      },
    },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: input.type ?? "website",
      title,
      description,
      url: canonical,
      siteName: SEO_DEFAULTS.siteName,
      locale,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: SEO_DEFAULTS.twitterHandle,
    },
  };
}
