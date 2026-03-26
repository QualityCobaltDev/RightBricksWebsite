import { buildMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const label = category.replace(/-/g, " ");
  return buildMetadata({
    path: `/categories/${category}`,
    title: `${label} Properties | RightBricks`,
    description: `Discover ${label} property listings in Cambodia on RightBricks.`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-3">
      <h1 className="text-3xl font-semibold capitalize">{category.replace(/-/g, " ")}</h1>
      <p>Use this page for SEO category expansion and internal linking into filtered search URLs.</p>
    </main>
  );
}
