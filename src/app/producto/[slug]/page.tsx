import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByCategory } from "@/lib/data";
import { ProductDetailClient } from "./product-detail-client";

export async function generateStaticParams() {
  const { products } = await import("@/lib/data");
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado | iTools Perú" };
  return {
    title: `${product.name} | iTools Perú`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const relatedProducts = product.categoryId
    ? getProductsByCategory(product.categoryId).filter((p) => p.id !== product.id).slice(0, 4)
    : [];

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}