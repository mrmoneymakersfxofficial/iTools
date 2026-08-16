import { NextRequest, NextResponse } from "next/server";
import { syncAllProducts } from "@/lib/bsale/sync";
import * as bsale from "@/lib/bsale/client";

/**
 * POST /api/bsale/sync
 *
 * Trigger product sync from Bsale → iTools DB.
 * Requires authorization with SANITY_REVALIDATE_SECRET.
 *
 * Body (optional):
 *   officeId     - Bsale office/branch ID for stock filtering
 *   priceListId  - Price list ID for price resolution
 *   dryRun       - If true, report what would be synced without making changes
 *   productIds   - Array of specific Bsale product IDs to sync (partial sync)
 */
export async function POST(request: NextRequest) {
  // ─── Auth check ────────────────────────────────────────────────
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
    const officeId =
      body.officeId || Number(process.env.BSALE_OFFICE_ID) || undefined;
    const priceListId =
      body.priceListId || Number(process.env.BSALE_PRICE_LIST_ID) || undefined;
    const dryRun = body.dryRun === true;
    const productIds: number[] | undefined = body.productIds?.length
      ? body.productIds
      : undefined;

    // ─── Dry run: just report what's available ───────────────────
    if (dryRun) {
      const [productCount, offices] = await Promise.all([
        bsale.countProducts(),
        bsale.listOffices(),
      ]);

      return NextResponse.json({
        dryRun: true,
        availableProducts: productCount,
        offices: offices.items?.map((o) => ({
          id: o.id,
          name: o.name,
          isVirtual: o.isVirtual === 1,
        })),
        officeId: officeId || "not specified",
        priceListId: priceListId || "not specified",
        specificProducts: productIds || "all",
        message: `Would sync ${productIds?.length || productCount} products from Bsale`,
      });
    }

    // ─── Partial sync: specific product IDs ─────────────────────
    if (productIds && productIds.length > 0) {
      const result = await syncSpecificProducts(
        productIds,
        officeId,
        priceListId
      );
      return NextResponse.json({ success: true, ...result });
    }

    // ─── Full sync ──────────────────────────────────────────────
    const result = await syncAllProducts(officeId, priceListId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("[Bsale Sync] Error:", error);
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
 * Sync specific products by their Bsale IDs.
 */
async function syncSpecificProducts(
  productIds: number[],
  officeId?: number,
  priceListId?: number
) {
  const result = {
    productsSynced: 0,
    variantsSynced: 0,
    stockUpdated: 0,
    errors: [] as string[],
  };

  const { db } = await import("@/lib/db");

  for (const productId of productIds) {
    try {
      const bsaleProduct = await bsale.getProduct(productId, ["product_type"]);

      // Get variants
      const variantsResponse = await bsale.getProductVariants(productId);
      const variants = variantsResponse.items || [];
      const primaryVariant = variants[0];

      // Get stock
      let stock = 0;
      if (primaryVariant && officeId) {
        try {
          const stockData = await bsale.getStockByVariant(
            primaryVariant.id,
            officeId
          );
          stock = stockData.length > 0 ? stockData[0].quantityAvailable : 0;
        } catch {
          // Stock not available
        }
      }

      // Get price
      let price = 0;
      let comparePrice: number | null = null;
      if (primaryVariant && priceListId) {
        try {
          const priceData = await bsale.getPriceListDetails(
            priceListId,
            primaryVariant.id
          );
          if (priceData.items && priceData.items.length > 0) {
            price = priceData.items[0].priceWithTax / 100;
            comparePrice = priceData.items[0].basePrice / 100;
          }
        } catch {
          // Price not available
        }
      }

      // Upsert product
      const sku = primaryVariant?.code || `BSALE-${bsaleProduct.id}`;
      const slug = bsaleProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      await db.product.upsert({
        where: { sku },
        create: {
          sku,
          name: bsaleProduct.name,
          slug,
          description: bsaleProduct.description || undefined,
          price: price || 0,
          comparePrice: comparePrice || undefined,
          stock,
          images: [],
          specs: {
            bsaleId: bsaleProduct.id,
            bsaleVariants: variants.map((v) => v.id),
          },
          isPublished: bsaleProduct.state === 0,
        },
        update: {
          name: bsaleProduct.name,
          description: bsaleProduct.description || undefined,
          price: price || undefined,
          stock,
          specs: {
            bsaleId: bsaleProduct.id,
            bsaleVariants: variants.map((v) => v.id),
          },
          isPublished: bsaleProduct.state === 0,
        },
      });

      result.productsSynced++;
      result.variantsSynced += variants.length;
      result.stockUpdated++;

      console.log(
        `[Bsale Sync] Synced: ${bsaleProduct.name} (${variants.length} variants, stock: ${stock})`
      );
    } catch (error) {
      const msg = `Error syncing product ${productId}: ${error instanceof Error ? error.message : "Unknown"}`;
      result.errors.push(msg);
      console.error(`[Bsale Sync] ${msg}`);
    }
  }

  return result;
}

/**
 * GET /api/bsale/sync
 *
 * Check sync status - count of products synced from Bsale vs total,
 * plus available products in Bsale.
 */
export async function GET() {
  try {
    const { db } = await import("@/lib/db");

    const [bsaleProducts, totalProducts] = await Promise.all([
      db.product.count({
        where: {
          specs: { path: ["bsaleId"], not: null as unknown as undefined },
        },
      }),
      db.product.count(),
    ]);

    // Also check how many products are available in Bsale
    let bsaleAvailable = 0;
    let bsaleConnected = false;
    try {
      bsaleAvailable = await bsale.countProducts();
      bsaleConnected = true;
    } catch {
      // Bsale not reachable
    }

    return NextResponse.json({
      // iTools DB stats
      syncedFromBsale: bsaleProducts,
      totalProducts,
      syncCoverage:
        totalProducts > 0
          ? `${Math.round((bsaleProducts / totalProducts) * 100)}%`
          : "0%",
      // Bsale API stats
      bsaleConnected,
      bsaleAvailable,
      // Sync recommendation
      needsSync: bsaleConnected && bsaleAvailable > bsaleProducts,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not check sync status" },
      { status: 500 }
    );
  }
}
