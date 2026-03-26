import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/seo/metadata";
import { breadcrumbSchema } from "@/seo/schema";
import { JsonLd } from "@/components/cms/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ province: string }> }) {
  const { province } = await params;
  const p = await prisma.province.findFirst({ where: { slug: province } });
  if (!p) return buildMetadata({ path: `/areas/${province}`, noIndex: true });

  return buildMetadata({
    path: `/areas/${p.slug}`,
    title: `Property in ${p.nameEn} | RightBricks`,
    description: `Explore homes, condos, and rentals in ${p.nameEn}, Cambodia.`,
  });
}

export default async function AreaPage({ params }: { params: Promise<{ province: string }> }) {
  const { province } = await params;
  const data = await prisma.province.findFirst({
    where: { slug: province },
    include: {
      listings: {
        where: { status: "PUBLISHED", deletedAt: null },
        include: { translations: true },
        take: 40,
      },
    },
  });

  if (!data) notFound();

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-4">
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Areas", path: "/areas" },
        { name: data.nameEn, path: `/areas/${data.slug}` },
      ])} />

      <h1 className="text-3xl font-semibold">Properties in {data.nameEn}</h1>
      <p className="text-slate-600">{data.listings.length} listings available</p>
      <ul className="space-y-2">
        {data.listings.map((listing) => (
          <li key={listing.id} className="border rounded p-3">{listing.translations[0]?.title ?? listing.slug}</li>
        ))}
      </ul>
    </main>
  );
}
