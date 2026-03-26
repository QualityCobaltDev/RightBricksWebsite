import { notFound } from "next/navigation";
import { LocaleCode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/seo/metadata";
import { listingSchema, breadcrumbSchema } from "@/seo/schema";
import { localizedField, normalizeLocale } from "@/seo/i18n";
import { JsonLd } from "@/components/cms/json-ld";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = normalizeLocale(lang);

  const listing = await prisma.listing.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: { translations: true, media: true },
  });

  if (!listing) return buildMetadata({ path: `/listing/${slug}`, noIndex: true });

  const en = listing.translations.find((t) => t.locale === LocaleCode.EN);
  const km = listing.translations.find((t) => t.locale === LocaleCode.KM);
  const input = {
    titleEn: en?.seoTitle ?? en?.title,
    titleKm: km?.seoTitle ?? km?.title,
    descriptionEn: en?.seoDescription ?? en?.description,
    descriptionKm: km?.seoDescription ?? km?.description,
  };

  return buildMetadata({
    path: `/listing/${listing.slug}`,
    title: localizedField(input, locale, "title"),
    description: localizedField(input, locale, "description"),
    image: listing.media[0]?.publicUrl,
  });
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await prisma.listing.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: { translations: true, media: true },
  });

  if (!listing) notFound();

  const title = listing.translations[0]?.title ?? listing.slug;
  const description = listing.translations[0]?.description ?? "";

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-4">
      <JsonLd data={listingSchema({
        name: title,
        description,
        slug: listing.slug,
        image: listing.media[0]?.publicUrl,
        priceUsd: listing.priceUsd.toString(),
        latitude: listing.latitude.toString(),
        longitude: listing.longitude.toString(),
        address: listing.addressLine1,
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Search", path: "/search" },
        { name: title, path: `/listing/${listing.slug}` },
      ])} />

      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-lg">${listing.priceUsd.toString()}</p>
      <p>{description}</p>
    </main>
  );
}
