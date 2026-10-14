import { notFound } from "next/navigation";
import { getBrandTheme, getBrandBySlug, getProductsByBrandSlug } from "@/lib/data";
import { fetchBrandBySlug, fetchProductsByBrandSlug, fetchAllBrandSlugs } from "@/lib/sanity/fetch-brand";
import { BrandPageClient } from "./brand-page-client";

import { BRAND_SHOWCASE_ORDER } from "@/lib/constants/brands";

const SITE_URL = "https://itools.pe";

export const revalidate = 60;

export async function generateStaticParams() {
  const sanityBrands = await fetchAllBrandSlugs();
  const sanitySlugs = sanityBrands.map((b: any) => b.slug).filter(Boolean);
  const allSlugs = Array.from(new Set([...BRAND_SHOWCASE_ORDER, ...sanitySlugs]));
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = (await fetchBrandBySlug(slug)) || getBrandBySlug(slug);
  if (!brand) return { title: "Marca no encontrada | iTools Perú" };

  return {
    title: `Herramientas ${brand.name} — Comprar Online | iTools Perú`,
    description: `Explora toda la línea de herramientas ${brand.name} en iTools Perú. Envío a todo el país. RUC: 20610613749.`,
    alternates: { canonical: `/marca/${brand.slug}` },
    openGraph: {
      title: `Herramientas ${brand.name} | iTools Perú`,
      description: `Tienda oficial ${brand.name} en iTools Perú.`,
      type: "website",
      locale: "es_PE",
      siteName: "iTools Perú",
      url: `${SITE_URL}/marca/${brand.slug}`,
    },
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let brand = await fetchBrandBySlug(slug);
  if (!brand) {
    brand = getBrandBySlug(slug) || null;
  }
  if (!brand) notFound();

  let products = await fetchProductsByBrandSlug(slug);
  if (!products || products.length === 0) {
    products = getProductsByBrandSlug(slug);
  }

  const theme = getBrandTheme(slug);

  return <BrandPageClient brand={brand as any} products={products as any} theme={theme} />;
}