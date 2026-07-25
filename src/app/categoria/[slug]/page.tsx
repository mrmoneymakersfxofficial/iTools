import { notFound } from "next/navigation";
import { CategoryPageClient } from "./category-page-client";
import { fetchCategoryBySlug, fetchProductsByCategorySlug, fetchAllCategorySlugs } from "@/lib/sanity/fetch-category";

const SITE_URL = "https://itools.pe";

export async function generateStaticParams() {
  const categories = await fetchAllCategorySlugs();
  return categories.map((cat: any) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) return { title: "Categoría no encontrada | iTools Perú" };

  return {
    title: `${category.name} — Comprar Online | iTools Perú`,
    description: `Explora nuestra selección de ${category.name.toLowerCase()}. Herramientas profesionales de Milwaukee, DeWalt, Bosch y más. Envío a todo Perú. RUC: 20610613749.`,
    keywords: [
      category.name,
      `${category.name} Perú`,
      `comprar ${category.name.toLowerCase()}`,
      "iTools Perú",
      "herramientas profesionales Perú",
    ],
    alternates: {
      canonical: `/categoria/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | iTools Perú`,
      description: `Explora ${category.name} en iTools Perú. Herramientas profesionales con envío a todo el país.`,
      type: "website",
      locale: "es_PE",
      siteName: "iTools Perú",
      url: `${SITE_URL}/categoria/${category.slug}`,
    },
    twitter: {
      card: "summary",
      title: `${category.name} | iTools Perú`,
      description: `Explora ${category.name} en iTools Perú. Envío a todo Perú.`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);

  if (!category) notFound();

  const products = await fetchProductsByCategorySlug(slug);

  return <CategoryPageClient category={category} products={products} />;
}