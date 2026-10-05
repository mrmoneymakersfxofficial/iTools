import { notFound } from "next/navigation";
import { ProductDetailClient } from "./product-detail-client";
import { fetchProductBySlug, fetchRelatedProducts, fetchProductReviews } from "@/lib/sanity/fetch-product";
import { getLiveBsaleData } from "@/lib/bsale/live-stock";
import { urlFor } from "@/sanity/image";

export const revalidate = 60;

const SITE_URL = "https://itools.pe";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const product = await fetchProductBySlug(slug);
    if (!product) return { title: "Producto no encontrado | iTools Peru" };
    const discount = product.comparePrice
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
    return {
      title: product.name,
      description: product.shortDescription || "",
      openGraph: {
        title: product.name,
        description: product.shortDescription || "",
        type: "website",
        images: (() => {
          try {
            const img = product.images?.[0] || product.image;
            if (img?.asset) return [{ url: urlFor(img).width(800).height(800).url(), width: 800, height: 800, alt: product.name }];
          } catch {}
          return [{ url: "/og-image.png", width: 1200, height: 630 }];
        })(),
      },
    };
  } catch {
    return { title: "Producto | iTools Peru" };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product: any = null;
  let relatedProducts: any[] = [];
  let reviews: any[] = [];
  try {
    product = await fetchProductBySlug(slug);
  } catch (err) {
    console.error("[ProductPage] fetch error:", err);
    notFound();
  }
  if (!product) notFound();

  // Resolve real-time stock, base price ("precio antes"), and active discount from Bsale
  if (product.sku) {
    try {
      const bsaleData = await getLiveBsaleData(product.sku);
      if (bsaleData) {
        const prevStock = product.stock;
        const prevPrice = product.price;
        const prevSale = product.salePrice ?? null;

        if (typeof bsaleData.stock === "number") {
          product.stock = bsaleData.stock;
          product.inStock = bsaleData.stock > 0;
        }
        if (typeof bsaleData.price === "number" && bsaleData.price > 0) {
          product.price = bsaleData.price;
          product.salePrice = bsaleData.salePrice ?? null;
          product.comparePrice = null;
        }

        // Auto-sync Sanity in background if Bsale values changed
        if (
          prevStock !== product.stock ||
          prevPrice !== product.price ||
          prevSale !== (product.salePrice ?? null)
        ) {
          import("@/lib/bsale/sync")
            .then(({ patchSanityProduct }) =>
              patchSanityProduct(product.sku, {
                stock: product.stock,
                price: product.price,
                salePrice: product.salePrice ?? ( null as any ),
              })
            )
            .catch(() => {});
        }
      }
    } catch {
      // Fallback to Sanity product values gracefully
    }
  }

  try {
    if (product.category?.slug) {
      relatedProducts = await fetchRelatedProducts(product.category.slug, product.slug);
    }
  } catch { relatedProducts = []; }
  try {
    reviews = await fetchProductReviews(slug);
  } catch { reviews = []; }
  return <ProductDetailClient product={product} relatedProducts={relatedProducts} reviews={reviews} />;
}