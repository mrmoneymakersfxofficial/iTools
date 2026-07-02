import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategorySlug, categories } from "@/lib/data";
import { CategoryPageClient } from "./category-page-client";

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
    title: `${category.name} | iTools Perú`,
    description: `Explora nuestra selección de ${category.name.toLowerCase()}. Envío a todo Perú.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const products = getProductsByCategorySlug(slug);

  return <CategoryPageClient category={category} products={products} />;
}