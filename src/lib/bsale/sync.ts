/**
 * Bsale <-> iTools Product Sync
 * 
 * Syncs products from Bsale to the iTools database (Prisma/Supabase) AND Sanity (CMS).
 */

import { db } from "@/lib/db";
import * as bsale from "./client";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function patchSanityProduct(sku: string, data: { stock?: number; price?: number; salePrice?: number }) {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.warn("[Sanity Sync] Skipping Sanity update because SANITY_API_WRITE_TOKEN is not set.");
    return;
  }
  try {
    // Find product in Sanity by SKU
    const sanityProduct = await sanityWriteClient.fetch(`*[_type == "product" && sku == $sku][0]{_id}`, { sku });
    if (!sanityProduct) {
      console.warn(`[Sanity Sync] Product with SKU ${sku} not found in Sanity.`);
      return;
    }
    
    // Patch product
    await sanityWriteClient.patch(sanityProduct._id).set(data).commit();
    console.log(`[Sanity Sync] Patched product ${sku} successfully in Sanity.`);
  } catch (err) {
    console.error(`[Sanity Sync] Error patching product ${sku}:`, err);
  }
}

interface SyncResult {
  productsSynced: number;
  variantsSynced: number;
  stockUpdated: number;
  errors: string[];
}

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
    log("Fetching products from Bsale...");
    let offset = 0;
    const limit = 50;
    let hasMore = true;

    while (hasMore) {
      const response = await bsale.listProducts(limit, offset, ["product_type"]);
      const products = response.items || [];

      for (const bsaleProduct of products) {
        try {
          const variantsResponse = await bsale.getProductVariants(bsaleProduct.id);
          const variants = variantsResponse.items || [];
          const primaryVariant = variants[0];

          let stock = 0;
          if (primaryVariant && officeId) {
            try {
              const stockData = await bsale.getStockByVariant(primaryVariant.id, officeId);
              stock = stockData.length > 0 ? stockData[0].quantityAvailable : 0;
            } catch {}
          }

          let price = 0;
          let comparePrice: number | null = null;
          if (primaryVariant && priceListId) {
            try {
              const priceData = await bsale.getPriceListDetails(priceListId, primaryVariant.id);
              if (priceData.items && priceData.items.length > 0) {
                price = priceData.items[0].priceWithTax / 100;
                comparePrice = priceData.items[0].basePrice / 100;
              }
            } catch {}
          }

          const sku = primaryVariant?.code || `BSALE-${bsaleProduct.id}`;
          const slug = bsaleProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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

          // Sync stock & price to Sanity as well
          await patchSanityProduct(sku, {
            stock,
            price: price || undefined,
            salePrice: (comparePrice && comparePrice !== price) ? comparePrice : undefined
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

export async function syncVariantStock(
  variantId: number,
  officeId: number
): Promise<{ stock: number; sku: string } | null> {
  try {
    const stockData = await bsale.getStockByVariant(variantId, officeId);
    if (stockData.length === 0) return null;

    const available = stockData[0].quantityAvailable;

    const products = await db.product.findMany({
      where: {
        specs: { path: ["bsaleVariants"], array_contains: variantId },
      },
    });

    if (products.length > 0) {
      const p = products[0];
      await db.product.update({
        where: { id: p.id },
        data: { stock: available },
      });
      
      // Update Sanity
      await patchSanityProduct(p.sku, { stock: available });

      return { stock: available, sku: p.sku };
    }
    return null;
  } catch (error) {
    console.error(`[Bsale] Stock sync error for variant ${variantId}:`, error);
    return null;
  }
}

export async function syncVariantPrice(variantId: number, priceListId: number): Promise<void> {
    try {
        const priceData = await bsale.getPriceListDetails(priceListId, variantId);
        if (!priceData.items?.length) return;
    
        const price = priceData.items[0].priceWithTax / 100;
        const comparePrice = priceData.items[0].basePrice / 100;
    
        const products = await db.product.findMany({
          where: { specs: { path: ["bsaleVariants"], array_contains: variantId } },
        });
    
        if (products.length > 0) {
          const p = products[0];
          await db.product.update({
            where: { id: p.id },
            data: { price, comparePrice: comparePrice !== price ? comparePrice : null },
          });
          
          await patchSanityProduct(p.sku, {
              price,
              salePrice: comparePrice !== price ? comparePrice : undefined
          });
        }
    } catch (err) {
        console.error(`[Bsale] Price sync error for variant ${variantId}:`, err);
    }
}