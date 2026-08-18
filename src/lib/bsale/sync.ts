/**
 * Bsale ↔ iTools Product Sync
 * 
 * Syncs products from Bsale to the iTools database (Prisma/Supabase).
 * This is the INITIAL sync that should be run once after setup.
 */

import { db } from "@/lib/db";
import * as bsale from "./client";

interface SyncResult {
  productsSynced: number;
  variantsSynced: number;
  stockUpdated: number;
  errors: string[];
}

/**
 * Full product sync from Bsale → iTools DB
 * Run this once after initial Bsale setup.
 */
export async function syncAllProducts(
  officeId?: number,
  priceListId?: number,
  onProgress?: (msg: string) => void
): Promise<SyncResult> {
  const result: SyncResult = {
    productsSynced: 0,
    variantsSynced: 0,
    stockUpdated: 0,
    errors: [],
  };

  const log = (msg: string) => {
    onProgress?.(msg);
    console.log(`[Bsale Sync] ${msg}`);
  };

  try {
    // 1. Fetch all products from Bsale (paginated)
    log("Fetching products from Bsale...");
    let offset = 0;
    const limit = 50;
    let hasMore = true;

    while (hasMore) {
      const response = await bsale.listProducts(limit, offset, ["product_type"]);
      const products = response.items || [];

      for (const bsaleProduct of products) {
        try {
          // 2. Get variants for this product
          const variantsResponse = await bsale.getProductVariants(bsaleProduct.id);
          const variants = variantsResponse.items || [];

          // 3. Get the primary variant (first one) for price/stock
          const primaryVariant = variants[0];

          // 4. Get stock for the primary variant
          let stock = 0;
          if (primaryVariant && officeId) {
            try {
              const stockData = await bsale.getStockByVariant(
                primaryVariant.id,
                officeId
              );
              stock = stockData.length > 0 ? stockData[0].quantityAvailable : 0;
            } catch {
              // Stock not found is OK
            }
          }

          // 5. Get price from price list
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
              // Price not found is OK
            }
          }

          // 6. Create or update product in iTools DB
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
              specs: { bsaleId: bsaleProduct.id, bsaleVariants: variants.map(v => v.id) },
              isPublished: bsaleProduct.state === 0,
            },
            update: {
              name: bsaleProduct.name,
              description: bsaleProduct.description || undefined,
              price: price || undefined,
              stock,
              specs: { bsaleId: bsaleProduct.id, bsaleVariants: variants.map(v => v.id) },
              isPublished: bsaleProduct.state === 0,
            },
          });

          result.productsSynced++;
          result.variantsSynced += variants.length;
          result.stockUpdated++;

          log(`Synced: ${bsaleProduct.name} (${variants.length} variants, stock: ${stock})`);
        } catch (error) {
          const msg = `Error syncing product ${bsaleProduct.id}: ${error instanceof Error ? error.message : "Unknown"}`;
          result.errors.push(msg);
          log(msg);
        }
      }

      // Pagination
      hasMore = products.length === limit;
      offset += limit;
    }

    log(`Sync complete: ${result.productsSynced} products, ${result.variantsSynced} variants`);
  } catch (error) {
    const msg = `Fatal sync error: ${error instanceof Error ? error.message : "Unknown"}`;
    result.errors.push(msg);
    log(msg);
  }

  return result;
}

/**
 * Quick stock sync for a single variant (used by webhooks)
 */
export async function syncVariantStock(
  variantId: number,
  officeId: number
): Promise<{ stock: number; sku: string } | null> {
  try {
    const stockData = await bsale.getStockByVariant(variantId, officeId);
    if (stockData.length === 0) return null;

    const available = stockData[0].quantityAvailable;

    // Find the product in iTools DB that has this variant
    const products = await db.product.findMany({
      where: {
        specs: { path: ["bsaleVariants"], array_contains: variantId },
      },
    });

    if (products.length > 0) {
      await db.product.update({
        where: { id: products[0].id },
        data: { stock: available },
      });
    }

    return { stock: available, sku: products[0]?.sku || "" };
  } catch (error) {
    console.error(`[Bsale] Stock sync error for variant ${variantId}:`, error);
    return null;
  }
}
