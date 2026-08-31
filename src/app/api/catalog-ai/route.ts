import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/sanity/client.server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    
    if (!query || query.length < 3) {
      return NextResponse.json({ products: [] });
    }

    // Basic Sanity text search on name or sku
    const products = await serverClient.fetch(
      `*[_type == "product" && isActive == true && (name match $searchQuery || sku match $searchQuery)][0...5] {
        _id,
        name,
        "slug": slug.current,
        sku,
        price,
        salePrice,
        stock,
        "image": image.asset->url
      }`,
      { searchQuery: `*${query}*` }
    );

    return NextResponse.json({ products });
  } catch (error) {
    console.error("[Catalog AI] Error fetching products", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
