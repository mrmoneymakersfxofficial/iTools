import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";

export const dynamic = "force-dynamic";

function mapSanityProduct(p: any) {
  const imageUrl =
    p.image?.asset?.url ||
    (Array.isArray(p.images) && p.images[0]?.asset?.url) ||
    null;

  const currentPrice = p.salePrice || p.price || 0;
  const originalPrice = p.salePrice && p.price && p.price > p.salePrice ? p.price : null;

  return {
    id: p._id,
    _id: p._id,
    name: p.name,
    slug: typeof p.slug === "string" ? p.slug : p.slug?.current || "",
    sku: p.sku || "",
    price: currentPrice,
    comparePrice: originalPrice,
    discountBadge: p.discountBadge || (originalPrice ? `-${Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%` : null),
    stock: typeof p.stock === "number" ? p.stock : 10,
    rating: p.rating || 4.8,
    reviews: p.reviews || 16,
    brand: p.brand ? { name: p.brand.name, slug: p.brand.slug } : null,
    image: imageUrl,
  };
}

export async function GET() {
  try {
    const recommendedQuery = `*[_type == "product" && price > 0] | order(_createdAt desc)[0...12] {
      _id,
      name,
      slug,
      sku,
      price,
      salePrice,
      discountBadge,
      stock,
      rating,
      reviews,
      "brand": brand->{ name, "slug": slug.current },
      image { asset-> { url } },
      images[] { asset-> { url } }
    }`;

    const rawRecommended = await client.fetch(recommendedQuery);
    const recommended = (rawRecommended || []).map(mapSanityProduct);

    return NextResponse.json({ products: [], recommended });
  } catch (err) {
    console.error("Wishlist GET error:", err);
    return NextResponse.json({ products: [], recommended: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    let ids: string[] = [];
    try {
      const body = await request.json();
      ids = Array.isArray(body.ids) ? body.ids.filter(Boolean) : [];
    } catch {
      ids = [];
    }

    let products: any[] = [];

    if (ids.length > 0) {
      const query = `*[_type == "product" && (_id in $ids || slug.current in $ids || sku in $ids)][0...50] {
        _id,
        name,
        slug,
        sku,
        price,
        salePrice,
        discountBadge,
        stock,
        rating,
        reviews,
        "brand": brand->{ name, "slug": slug.current },
        image { asset-> { url } },
        images[] { asset-> { url } }
      }`;

      try {
        const rawProducts = await client.fetch(query, { ids });
        products = (rawProducts || []).map(mapSanityProduct);
      } catch (err) {
        console.warn("Sanity fetch error in wishlist:", err);
      }

      // Check if any requested ID was not in Sanity, load from local catalog
      const foundIds = new Set(
        products.flatMap((p) => [p.id, p._id, p.slug, p.sku].filter(Boolean))
      );
      const missingIds = ids.filter((id) => !foundIds.has(id));

      if (missingIds.length > 0) {
        const { products: staticProducts } = await import("@/lib/data");
        const matched = staticProducts.filter(
          (p) =>
            missingIds.includes(p.id) ||
            missingIds.includes(p.slug) ||
            missingIds.includes(p.sku)
        );
        for (const m of matched) {
          products.push({
            id: m.id,
            _id: m.id,
            name: m.name,
            slug: m.slug,
            sku: m.sku,
            price: m.price,
            comparePrice: m.comparePrice,
            stock: m.stock,
            rating: m.rating || 4.8,
            reviews: m.reviewCount || 16,
            brand: m.brand ? { name: m.brand.name, slug: m.brand.slug } : null,
            image: m.images?.[0] || null,
          });
        }
      }
    }

    // Always fetch popular recommendations from real Sanity database
    const recommendedQuery = `*[_type == "product" && price > 0] | order(_createdAt desc)[0...8] {
      _id,
      name,
      slug,
      sku,
      price,
      salePrice,
      discountBadge,
      stock,
      rating,
      reviews,
      "brand": brand->{ name, "slug": slug.current },
      image { asset-> { url } },
      images[] { asset-> { url } }
    }`;

    let recommended: any[] = [];
    try {
      const rawRecommended = await client.fetch(recommendedQuery);
      recommended = (rawRecommended || []).map(mapSanityProduct);
    } catch (recErr) {
      console.warn("Could not fetch recommendations in wishlist API:", recErr);
    }

    return NextResponse.json({ products, recommended });
  } catch (err) {
    console.error("Wishlist API POST error:", err);
    return NextResponse.json({ products: [], recommended: [], error: "Failed to load wishlist" }, { status: 500 });
  }
}
