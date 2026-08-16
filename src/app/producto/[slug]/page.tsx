import { notFound } from "next/navigation";
import { ProductDetailClient } from "./product-detail-client";
import { fetchProductBySlug, fetchRelatedProducts, fetchAllProductSlugs, fetchProductReviews } from "@/lib/sanity/fetch-product";
import { urlFor } from "@/sanity/image";

const SITE_URL = "https://itools.pe";

export async function generateStaticParams() {
  const products = await fetchAllProductSlugs();
  return products.map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado | iTools Perú" };

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return {
    title: product.name,
    description: `${product.shortDescription || ""} Compra online en iTools Perú. Envío a todo Perú. ${discount > 0 ? `${discount}% de descuento.` : ""} RUC: 20610613749.`,
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
      description: product.shortDescription || "",
      type: "website",
      locale: "es_PE",
      siteName: "iTools Perú",
      url: `${SITE_URL}/producto/${product.slug}`,
      images: (product.images?.[0] || product.image)
        ? [{ url: urlFor(product.images?.[0] || product.image).width(800).height(800).url(), width: 800, height: 800, alt: product.name }]
        : [{ url: "/og-image.png", width: 1200, height: 630, alt: "iTools Perú" }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription || "",
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) notFound();

  const relatedProducts = product.category?.slug
    ? await fetchRelatedProducts(product.category.slug, product.slug)
    : [];

  const reviews = await fetchProductReviews(slug);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} reviews={reviews} />;
}