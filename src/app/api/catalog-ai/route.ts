import { NextResponse } from "next/server";
import { client } from "@/sanity/client.server";

// Cache this route heavily (revalidates every 12 hours)
export const revalidate = 43200; 

export async function GET() {
  try {
    const products = await client.fetch(
      `*[_type == "product" && isActive == true] {
        _id,
        name,
        "slug": slug.current,
        sku,
        price,
        salePrice,
        stock,
        "image": image.asset->url
      }`
    );
    return NextResponse.json({ products });
  } catch (error) {
    console.error("[Catalog AI] Error fetching products", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
