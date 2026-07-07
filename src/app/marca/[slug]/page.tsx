import { notFound } from "next/navigation";
import { getBrandBySlug, getProductsByBrandSlug, getBrandTheme, brands } from "@/lib/data";
import { BrandPageClient } from "./brand-page-client";

const SITE_URL = "https://itools.pe";

export async function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
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
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const products = getProductsByBrandSlug(slug);
  const theme = getBrandTheme(slug);

  return <BrandPageClient brand={brand} products={products} theme={theme} />;
}