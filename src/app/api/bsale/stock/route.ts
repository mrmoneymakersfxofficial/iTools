import { NextRequest, NextResponse } from "next/server";
import { getLiveBsaleStock } from "@/lib/bsale/live-stock";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sku = searchParams.get("sku")?.trim();

    if (!sku) {
      return NextResponse.json({ error: "SKU is required" }, { status: 400 });
    }

    const stock = await getLiveBsaleStock(sku);
    return NextResponse.json({
      sku,
      stock: typeof stock === "number" ? stock : null,
      inStock: typeof stock === "number" ? stock > 0 : null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stock" },
      { status: 500 }
    );
  }
}
