import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByCategory, products } from "@/lib/data";
import { ProductDetailClient } from "./product-detail-client";

const SITE_URL = "https://itools.pe";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado | iTools Perú" };

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return {
    title: product.name,
    description: `${product.shortDescription} Compra online en iTools Perú. Envío a todo Perú. ${discount > 0 ? `${discount}% de descuento.` : ""} RUC: 20610613749.`,
    keywords: [
      product.name,
      product.brand?.name || "",
      product.sku,
      "comprar herramientas Perú",
      "iTools Perú",
      "Milwaukee Perú",
    ].filter(Boolean),
    alternates: {
      canonical: `/producto/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | iTools Perú`,
      description: product.shortDescription,
      type: "website",
      locale: "es_PE",
      siteName: "iTools Perú",
      url: `${SITE_URL}/producto/${product.slug}`,
      images: product.images[0]
        ? [{ url: product.images[0], width: 800, height: 800, alt: product.name }]
        : [{ url: "/og-image.png", width: 1200, height: 630, alt: "iTools Perú" }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
    },
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