import { NextRequest, NextResponse } from "next/server";
import { syncAllProducts } from "@/lib/bsale/sync";

/**
 * POST /api/bsale/sync
 * 
 * Trigger full product sync from Bsale → iTools DB.
 * Requires authorization with SANITY_REVALIDATE_SECRET.
 * 
 * Body (optional):
 *   officeId - Bsale office/branch ID for stock
 *   priceListId - Price list ID for prices
 */
export async function POST(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  const secret = process.env.SANITY_REVALIDATE_SECRET || "itools2024";

  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BSALE_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "BSALE_ACCESS_TOKEN is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const officeId = body.officeId || Number(process.env.BSALE_OFFICE_ID) || undefined;
    const priceListId = body.priceListId || Number(process.env.BSALE_PRICE_LIST_ID) || undefined;

    const result = await syncAllProducts(officeId, priceListId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Sync failed",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bsale/sync
 * Check sync status (count of products with Bsale IDs)
 */
export async function GET() {
  try {
    const { db } = await import("@/lib/db");
    const bsaleProducts = await db.product.count({
      where: {
        specs: { path: ["bsaleId"], not: null },
      },
    });

    const totalProducts = await db.product.count();

    return NextResponse.json({
      syncedFromBsale: bsaleProducts,
      totalProducts,
      syncCoverage: totalProducts > 0 ? `${Math.round((bsaleProducts / totalProducts) * 100)}%` : "0%",
    });
  } catch {
    return NextResponse.json(
      { error: "Could not check sync status" },
      { status: 500 }
    );
  }
}
