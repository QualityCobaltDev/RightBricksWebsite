import { notFound } from "next/navigation";
import { LocaleCode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/seo/metadata";
import { normalizeLocale } from "@/seo/i18n";
import { BilingualContent } from "@/components/cms/bilingual-content";

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> }) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = normalizeLocale(lang);

  const page = await prisma.cmsArticle.findFirst({ where: { slug, status: "PUBLISHED", category: "page", deletedAt: null }, include: { translations: true } });
  if (!page) return buildMetadata({ path: `/${slug}`, noIndex: true });

  const en = page.translations.find((t) => t.locale === LocaleCode.EN);
  const km = page.translations.find((t) => t.locale === LocaleCode.KM);
  const title = locale === LocaleCode.KM ? km?.seoTitle ?? km?.title ?? en?.seoTitle ?? en?.title : en?.seoTitle ?? en?.title ?? km?.seoTitle ?? km?.title;
  const description = locale === LocaleCode.KM ? km?.seoDescription ?? km?.excerpt ?? en?.seoDescription ?? en?.excerpt : en?.seoDescription ?? en?.excerpt ?? km?.seoDescription ?? km?.excerpt;
  return buildMetadata({ path: `/${slug}`, title, description });
}

export default async function StaticPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> }) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = normalizeLocale(lang);
  const page = await prisma.cmsArticle.findFirst({ where: { slug, status: "PUBLISHED", category: "page", deletedAt: null }, include: { translations: true } });
  if (!page) notFound();

  const en = page.translations.find((t) => t.locale === LocaleCode.EN);
  const km = page.translations.find((t) => t.locale === LocaleCode.KM);

  return (
    <main className="rb-container" style={{ padding: "1.25rem 1rem 2rem" }}>
      <div className="rb-card" style={{ marginBottom: 14 }}>
        <p className="rb-muted" style={{ margin: 0 }}>RightBricks Information</p>
        <h1 style={{ marginBottom: 0 }}>{en?.title ?? km?.title ?? slug}</h1>
      </div>
      <div className="rb-card">
        <BilingualContent locale={locale} input={{ titleEn: en?.title, titleKm: km?.title, descriptionEn: en?.excerpt, descriptionKm: km?.excerpt, bodyEn: en?.body, bodyKm: km?.body }} />
      </div>
    </main>
  );
}
