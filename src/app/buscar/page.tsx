import { client } from "@/sanity/client";
import { SearchPageClient } from "./search-page-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const term = q ? `"${q}"` : "Herramientas";
  return {
    title: `Buscar: ${term} | iTools Perú`,
    description: `Resultados de búsqueda para ${term} en iTools Perú. Distribuidor oficial de herramientas profesionales.`,
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const queryTerm = q?.trim() || "";

  let products: any[] = [];

  if (queryTerm.length >= 2) {
    const sanitized = queryTerm.replace(/[*"'\\]/g, "");
    const wildcard = `*${sanitized}*`;

    const groqQuery = `*[_type == "product" && (
      sku match $wildcard || 
      name match $wildcard || 
      brand->name match $wildcard || 
      category->name match $wildcard ||
      shortDescription match $wildcard
    )][0...48] {
      _id,
      name,
      "slug": slug.current,
      sku,
      price,
      salePrice,
      discountBadge,
      stock,
      rating,
      reviews,
      "brand": brand->{ name, slug },
      "category": category->{ name, slug },
      image { asset-> { url } }
    }`;

    products = await client.fetch(groqQuery, { wildcard });
  }

  const formattedProducts = (products || []).map((p: any) => ({
    id: p._id,
    name: p.name,
    slug: p.slug,
    sku: p.sku || "",
    price: p.salePrice || p.price || 0,
    comparePrice: p.salePrice ? p.price : undefined,
    discountBadge: p.discountBadge,
    stock: p.stock ?? 10,
    rating: p.rating || 4.8,
    reviews: p.reviews || 12,
    brand: p.brand ? { name: p.brand.name, slug: p.brand.slug?.current || "" } : undefined,
    image: p.image?.asset?.url || null,
  }));

  return <SearchPageClient query={queryTerm} products={formattedProducts} />;
}
