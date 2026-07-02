import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategorySlug, categories } from "@/lib/data";
import { CategoryPageClient } from "./category-page-client";

const SITE_URL = "https://itools.pe";

export async function generateStaticParams() {
  const allSlugs: { slug: string }[] = [];
  for (const cat of categories) {
    allSlugs.push({ slug: cat.slug });
    cat.children?.forEach((child) => allSlugs.push({ slug: child.slug }));
  }
  return allSlugs;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
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
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const products = getProductsByCategorySlug(slug);

  return <CategoryPageClient category={category} products={products} />;
}