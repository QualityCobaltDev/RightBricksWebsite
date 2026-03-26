import { notFound } from "next/navigation";
import { LocaleCode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/seo/metadata";
import { articleSchema, breadcrumbSchema } from "@/seo/schema";
import { localizedField, normalizeLocale } from "@/seo/i18n";
import { BilingualContent } from "@/components/cms/bilingual-content";
import { JsonLd } from "@/components/cms/json-ld";

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> }) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = normalizeLocale(lang);

  const article = await prisma.cmsArticle.findFirst({
    where: { slug, status: "PUBLISHED", category: "guides", deletedAt: null },
    include: { translations: true },
  });

  if (!article) return buildMetadata({ path: `/guides/${slug}`, noIndex: true });

  const en = article.translations.find((t) => t.locale === LocaleCode.EN);
  const km = article.translations.find((t) => t.locale === LocaleCode.KM);

  return buildMetadata({
    path: `/guides/${article.slug}`,
    title: localizedField({ titleEn: en?.seoTitle ?? en?.title, titleKm: km?.seoTitle ?? km?.title }, locale, "title"),
    description: localizedField({ descriptionEn: en?.seoDescription ?? en?.excerpt, descriptionKm: km?.seoDescription ?? km?.excerpt }, locale, "description"),
    type: "article",
  });
}

export default async function GuidePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> }) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = normalizeLocale(lang);

  const article = await prisma.cmsArticle.findFirst({
    where: { slug, status: "PUBLISHED", category: "guides", deletedAt: null },
    include: { translations: true },
  });

  if (!article) notFound();

  const en = article.translations.find((t) => t.locale === LocaleCode.EN);
  const km = article.translations.find((t) => t.locale === LocaleCode.KM);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <JsonLd data={articleSchema({
        headline: en?.title ?? km?.title ?? article.slug,
        description: en?.excerpt ?? km?.excerpt ?? "",
        slug: article.slug,
        category: "guides",
        datePublished: article.publishedAt?.toISOString(),
        dateModified: article.updatedAt.toISOString(),
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Guides", path: "/guides" },
        { name: en?.title ?? km?.title ?? article.slug, path: `/guides/${article.slug}` },
      ])} />

      <BilingualContent locale={locale} input={{
        titleEn: en?.title,
        titleKm: km?.title,
        descriptionEn: en?.excerpt,
        descriptionKm: km?.excerpt,
        bodyEn: en?.body,
        bodyKm: km?.body,
      }} />
    </main>
  );
}
