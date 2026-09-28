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

export async function patchSanityProduct(sku: string, data: { name?: string; slug?: string; stock?: number; price?: number; salePrice?: number | null; isActive?: boolean }) {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.warn("[Sanity Sync] Skipping Sanity update because SANITY_API_WRITE_TOKEN is not set.");
    return;
  }
  try {
    const sanityProduct = await sanityWriteClient.fetch(`*[_type == "product" && sku == $sku][0]{_id}`, { sku });
    if (!sanityProduct) {
      if (data.name && data.slug) {
        // Create it
        await sanityWriteClient.create({
          _type: "product",
          name: data.name,
          slug: { _type: "slug", current: data.slug },
          sku: sku,
          price: data.price || 0,
          salePrice: data.salePrice ?? undefined,
          stock: data.stock || 0,
          isActive: data.isActive !== false
        });
        console.log(`[Sanity Sync] Created new product ${sku} in Sanity.`);
      }
      return;
    }
    
    // Patch existing
    const patchData: any = {};
    const unsetFields: string[] = [];

    if (data.stock !== undefined) patchData.stock = data.stock;
    if (data.price !== undefined) patchData.price = data.price;
    if (data.salePrice !== undefined && data.salePrice !== null) {
      patchData.salePrice = data.salePrice;
    } else if (data.salePrice === null) {
      unsetFields.push("salePrice");
    }
    
    let patchOp = sanityWriteClient.patch(sanityProduct._id);
    if (Object.keys(patchData).length > 0) {
      patchOp = patchOp.set(patchData);
    }
    if (unsetFields.length > 0) {
      patchOp = patchOp.unset(unsetFields);
    }
    if (Object.keys(patchData).length > 0 || unsetFields.length > 0) {
      await patchOp.commit();
      console.log(`[Sanity Sync] Patched product ${sku} successfully in Sanity.`);
    }
  } catch (err) {
    console.error(`[Sanity Sync] Error with product ${sku}:`, err);
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
          let salePrice: number | null = null;
          if (primaryVariant && priceListId) {
            try {
              const [priceData, discountData] = await Promise.all([
                bsale.getPriceListDetails(priceListId, primaryVariant.id),
                bsale.getVariantDiscounts(primaryVariant.id, priceListId).catch(() => ({ data: [] })),
              ]);
              if (priceData.items && priceData.items.length > 0) {
                const detail = priceData.items[0];
                const rawVal = Number(detail.variantValueWithTaxes ?? detail.variantValue ?? 0);
                price = rawVal > 0 ? Math.round(rawVal * 100) / 100 : 0;
              }
              const activeDiscount = Array.isArray(discountData?.data)
                ? discountData.data.find((d) => d.discountState === 0 && Number(d.discountPercentage) > 0)
                : null;
              if (price > 0 && activeDiscount) {
                const pct = Number(activeDiscount.discountPercentage);
                const discounted = Math.round(price * (1 - pct / 100) * 100) / 100;
                if (discounted > 0 && discounted < price) {
                  salePrice = discounted;
                }
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
              price: salePrice || price || 0,
              comparePrice: salePrice ? price : undefined,
              stock,
              images: [],
              specs: { bsaleId: bsaleProduct.id, bsaleVariants: variants.map(v => v.id) },
              isPublished: bsaleProduct.state === 0,
            },
            update: {
              name: bsaleProduct.name,
              description: bsaleProduct.description || undefined,
              price: salePrice || price || undefined,
              comparePrice: salePrice ? price : null,
              stock,
              specs: { bsaleId: bsaleProduct.id, bsaleVariants: variants.map(v => v.id) },
              isPublished: bsaleProduct.state === 0,
            },
          });

          // Sync stock & price to Sanity as well
          await patchSanityProduct(sku, {
            name: bsaleProduct.name,
            slug: slug,
            isActive: bsaleProduct.state === 0,
            stock,
            price: price || undefined,
            salePrice: salePrice
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
        const [priceData, discountData] = await Promise.all([
          bsale.getPriceListDetails(priceListId, variantId),
          bsale.getVariantDiscounts(variantId, priceListId).catch(() => ({ data: [] })),
        ]);
        if (!priceData.items?.length) return;
    
        const detail = priceData.items[0];
        const rawVal = Number(detail.variantValueWithTaxes ?? detail.variantValue ?? 0);
        const price = rawVal > 0 ? Math.round(rawVal * 100) / 100 : 0;

        let salePrice: number | null = null;
        const activeDiscount = Array.isArray(discountData?.data)
          ? discountData.data.find((d) => d.discountState === 0 && Number(d.discountPercentage) > 0)
          : null;
        if (price > 0 && activeDiscount) {
          const pct = Number(activeDiscount.discountPercentage);
          const discounted = Math.round(price * (1 - pct / 100) * 100) / 100;
          if (discounted > 0 && discounted < price) {
            salePrice = discounted;
          }
        }
    
        const products = await db.product.findMany({
          where: { specs: { path: ["bsaleVariants"], array_contains: variantId } },
        });
    
        if (products.length > 0) {
          const p = products[0];
          await db.product.update({
            where: { id: p.id },
            data: {
              price: salePrice || price,
              comparePrice: salePrice ? price : null,
            },
          });
          
          await patchSanityProduct(p.sku, {
              price,
              salePrice
          });
        }
    } catch (err) {
        console.error(`[Bsale] Price sync error for variant ${variantId}:`, err);
    }
}
