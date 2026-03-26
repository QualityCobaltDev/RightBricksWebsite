import { absoluteUrl } from "@/seo/metadata";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RightBricks",
    url: "https://rightbricks.online",
    logo: "https://rightbricks.online/logo.png",
  };
}

export function listingSchema(input: {
  name: string;
  description: string;
  slug: string;
  image?: string | null;
  priceUsd: string;
  latitude: string;
  longitude: string;
  address: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: input.name,
    description: input.description,
    url: absoluteUrl(`/listing/${input.slug}`),
    image: input.image ? absoluteUrl(input.image) : undefined,
    priceCurrency: "USD",
    price: input.priceUsd,
    itemOffered: {
      "@type": "Residence",
      name: input.name,
      address: input.address,
      geo: {
        "@type": "GeoCoordinates",
        latitude: input.latitude,
        longitude: input.longitude,
      },
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  slug: string;
  category: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: absoluteUrl(`/${input.category}/${input.slug}`),
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    publisher: {
      "@type": "Organization",
      name: "RightBricks",
      url: "https://rightbricks.online",
    },
  };
}
