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
    where: { slug, status: "PUBLISHED", category: "blog", deletedAt: null },
    include: { translations: true },
  });

  if (!article) return buildMetadata({ path: `/blog/${slug}`, noIndex: true });

  const en = article.translations.find((t) => t.locale === LocaleCode.EN);
  const km = article.translations.find((t) => t.locale === LocaleCode.KM);

  return buildMetadata({
    path: `/blog/${article.slug}`,
    title: localizedField({ titleEn: en?.seoTitle ?? en?.title, titleKm: km?.seoTitle ?? km?.title }, locale, "title"),
    description: localizedField({ descriptionEn: en?.seoDescription ?? en?.excerpt, descriptionKm: km?.seoDescription ?? km?.excerpt }, locale, "description"),
    type: "article",
  });
}

export default async function BlogPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> }) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = normalizeLocale(lang);

  const article = await prisma.cmsArticle.findFirst({
    where: { slug, status: "PUBLISHED", category: "blog", deletedAt: null },
    include: { translations: true },
  });

  if (!article) notFound();

  const en = article.translations.find((t) => t.locale === LocaleCode.EN);
  const km = article.translations.find((t) => t.locale === LocaleCode.KM);

  return (
    <main className="rb-container" style={{ padding: "1rem" }}>
      <article className="rb-card" style={{ marginBottom: 14 }}>
        <p className="rb-muted" style={{ marginTop: 0 }}><a href="/">Home</a> / Blogs</p>
      <JsonLd data={articleSchema({
        headline: en?.title ?? km?.title ?? article.slug,
        description: en?.excerpt ?? km?.excerpt ?? "",
        slug: article.slug,
        category: "blog",
        datePublished: article.publishedAt?.toISOString(),
        dateModified: article.updatedAt.toISOString(),
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: en?.title ?? km?.title ?? article.slug, path: `/blog/${article.slug}` },
      ])} />

      <BilingualContent locale={locale} input={{
        titleEn: en?.title,
        titleKm: km?.title,
        descriptionEn: en?.excerpt,
        descriptionKm: km?.excerpt,
        bodyEn: en?.body,
        bodyKm: km?.body,
      }} />
          </article>
    </main>
  );
}
