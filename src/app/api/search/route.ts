import { NextResponse } from "next/server";
import { client } from "@/sanity/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const sanitized = q.replace(/[*"'\\]/g, "");
    const wildcard = `*${sanitized}*`;

    const groqQuery = `*[_type == "product" && (
      sku match $wildcard || 
      name match $wildcard || 
      brand->name match $wildcard || 
      category->name match $wildcard ||
      shortDescription match $wildcard
    )][0...12] {
      _id,
      name,
      "slug": slug.current,
      sku,
      price,
      salePrice,
      "brand": brand->name,
      image {
        asset-> {
          url
        }
      }
    }`;

    const results = await client.fetch(groqQuery, { wildcard });

    return NextResponse.json({
      results: (results || []).map((p: any) => ({
        id: p._id,
        name: p.name,
        slug: p.slug,
        sku: p.sku || "",
        price: p.salePrice || p.price || 0,
        comparePrice: p.salePrice ? p.price : null,
        brand: p.brand ? { name: p.brand } : undefined,
        image: p.image?.asset?.url || null,
      })),
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
  }
}
