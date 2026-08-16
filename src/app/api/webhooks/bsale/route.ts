import { NextRequest, NextResponse } from "next/server";
import * as bsale from "@/lib/bsale/client";
import { syncVariantStock } from "@/lib/bsale/sync";

/**
 * POST /api/webhooks/bsale
 *
 * Receives webhook notifications from Bsale ERP.
 * Handles: product, variant, price, stock, document, payment events.
 *
 * Webhook payload format:
 * {
 *   "cpnId": 2,
 *   "resource": "/v2/products/952.json",
 *   "resourceId": "952",
 *   "topic": "product" | "variant" | "price" | "stock" | "document" | "payment",
 *   "action": "post" | "put",
 *   "officeId": "1",        // stock only
 *   "priceListId": "2",     // price only
 *   "send": 1503500856
 * }
 *
 * Design principles:
 * - Return 200 OK immediately to prevent Bsale retries
 * - Process events asynchronously (fire-and-forget for heavy work)
 * - Dedup events to avoid double processing
 * - Log all events for audit/debugging
 */

interface BsaleWebhookPayload {
  cpnId: number;
  resource: string;
  resourceId: string;
  topic: "product" | "variant" | "price" | "stock" | "document" | "payment";
  action: "post" | "put";
  officeId?: string;
  priceListId?: string;
  send: number;
}

// Track processed webhooks to prevent duplicates (in-memory, resets on redeploy)
const processedWebhooks = new Map<string, number>();
const WEBHOOK_DEDUP_TTL = 300_000; // 5 minutes

// Clean up old dedup entries periodically
function cleanDedupCache() {
  const now = Date.now();
  for (const [key, timestamp] of processedWebhooks) {
    if (now - timestamp > WEBHOOK_DEDUP_TTL) {
      processedWebhooks.delete(key);
    }
  }
}

export async function POST(request: NextRequest) {
  // ─── Verify webhook signature ──────────────────────────────────
  const webhookSecret = process.env.BSALE_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature =
      request.headers.get("x-bsale-signature") ||
      request.headers.get("authorization");

    if (
      signature !== webhookSecret &&
      signature !== `Bearer ${webhookSecret}`
    ) {
      console.warn("[Bsale Webhook] Invalid signature attempt");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }
  }

  let payload: BsaleWebhookPayload;

  try {
    payload = await request.json();
  } catch {
    console.error("[Bsale Webhook] Invalid JSON payload");
    return NextResponse.json(
      { status: "error", message: "Invalid JSON" },
      { status: 400 }
    );
  }

  // ─── Dedup check ───────────────────────────────────────────────
  const dedupKey = `${payload.topic}-${payload.resourceId}-${payload.action}-${payload.send}`;
  const lastProcessed = processedWebhooks.get(dedupKey);
  if (lastProcessed && Date.now() - lastProcessed < WEBHOOK_DEDUP_TTL) {
    console.log(`[Bsale Webhook] Duplicate: ${dedupKey}`);
    return NextResponse.json({ status: "duplicate", topic: payload.topic });
  }
  processedWebhooks.set(dedupKey, Date.now());

  // Clean old entries periodically
  if (processedWebhooks.size > 500) {
    cleanDedupCache();
  }

  // ─── Log the event ─────────────────────────────────────────────
  const timestamp = new Date().toISOString();
  console.log(
    `[Bsale Webhook] ${timestamp} | ${payload.action.toUpperCase()} ${payload.topic} | id=${payload.resourceId}` +
      (payload.officeId ? ` | office=${payload.officeId}` : "") +
      (payload.priceListId ? ` | priceList=${payload.priceListId}` : "")
  );

  // ─── Return 200 OK immediately, process asynchronously ─────────
  // This prevents Bsale from retrying if our processing takes long.
  // We use .catch() to ensure unhandled rejections don't crash.

  processWebhookEvent(payload).catch((err) => {
    console.error(
      `[Bsale Webhook] Async processing error for ${payload.topic}/${payload.resourceId}:`,
      err
    );
  });

  return NextResponse.json({
    status: "received",
    topic: payload.topic,
    action: payload.action,
    resourceId: payload.resourceId,
    timestamp,
  });
}

// ─── Async Event Processor ───────────────────────────────────────

async function processWebhookEvent(payload: BsaleWebhookPayload) {
  switch (payload.topic) {
    case "product":
      await handleProductWebhook(payload);
      break;
    case "variant":
      await handleVariantWebhook(payload);
      break;
    case "price":
      await handlePriceWebhook(payload);
      break;
    case "stock":
      await handleStockWebhook(payload);
      break;
    case "document":
      await handleDocumentWebhook(payload);
      break;
    case "payment":
      await handlePaymentWebhook(payload);
      break;
    default:
      console.warn(
        `[Bsale Webhook] Unhandled topic: ${payload.topic}`,
        payload
      );
  }
}

// ─── Webhook Handlers ─────────────────────────────────────────────

async function handleProductWebhook(payload: BsaleWebhookPayload) {
  const productId = Number(payload.resourceId);
  const action = payload.action === "post" ? "created" : "updated";

  try {
    // Fetch the full product data from Bsale
    const bsaleProduct = await bsale.getProduct(productId, ["product_type"]);
    console.log(
      `[Bsale Webhook] Product ${action}: "${bsaleProduct.name}" (state=${bsaleProduct.state})`
    );

    // Update the corresponding product in iTools DB
    const { db } = await import("@/lib/db");

    const existing = await db.product.findFirst({
      where: { specs: { path: ["bsaleId"], equals: productId } },
    });

    if (existing) {
      // Product exists - update it
      await db.product.update({
        where: { id: existing.id },
        data: {
          name: bsaleProduct.name,
          description: bsaleProduct.description || undefined,
          isPublished: bsaleProduct.state === 0,
        },
      });
      console.log(
        `[Bsale Webhook] Updated product in DB: ${bsaleProduct.name} (id=${existing.id})`
      );
    } else {
      // New product from Bsale - create in iTools
      const sku = `BSALE-${bsaleProduct.id}`;
      const slug = bsaleProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const created = await db.product.create({
        data: {
          sku,
          name: bsaleProduct.name,
          slug,
          description: bsaleProduct.description || undefined,
          price: 0,
          stock: 0,
          images: [],
          specs: { bsaleId: bsaleProduct.id },
          isPublished: bsaleProduct.state === 0,
        },
      });
      console.log(
        `[Bsale Webhook] Created product in DB: ${bsaleProduct.name} (id=${created.id})`
      );
    }

    // Also sync variants if the product has them
    try {
      const variantsResponse = await bsale.getProductVariants(productId);
      const variants = variantsResponse.items || [];
      if (variants.length > 0) {
        // Update the product specs with variant IDs
        const { db } = await import("@/lib/db");
        const product = await db.product.findFirst({
          where: { specs: { path: ["bsaleId"], equals: productId } },
        });
        if (product) {
          const currentSpecs = (product.specs as Record<string, unknown>) || {};
          await db.product.update({
            where: { id: product.id },
            data: {
              specs: {
                ...currentSpecs,
                bsaleVariants: variants.map((v) => v.id),
              },
            },
          });
        }
        console.log(
          `[Bsale Webhook] Synced ${variants.length} variants for product ${productId}`
        );
      }
    } catch (variantErr) {
      console.warn(
        `[Bsale Webhook] Could not sync variants for product ${productId}:`,
        variantErr
      );
    }
  } catch (error) {
    console.error(
      `[Bsale Webhook] Product ${action} handler failed for id=${productId}:`,
      error
    );
  }
}

async function handleVariantWebhook(payload: BsaleWebhookPayload) {
  const variantId = Number(payload.resourceId);
  const action = payload.action === "post" ? "created" : "updated";

  console.log(
    `[Bsale Webhook] Variant ${action}: id=${variantId}, resource=${payload.resource}`
  );

  // Extract product ID from resource path: "/v2/products/952/variants/123.json"
  const productMatch = payload.resource.match(/\/products\/(\d+)\//);
  if (productMatch) {
    const productId = Number(productMatch[1]);
    try {
      // Refresh the product's variant list in the DB
      const variantsResponse = await bsale.getProductVariants(productId);
      const variants = variantsResponse.items || [];

      const { db } = await import("@/lib/db");
      const product = await db.product.findFirst({
        where: { specs: { path: ["bsaleId"], equals: productId } },
      });

      if (product) {
        const currentSpecs = (product.specs as Record<string, unknown>) || {};
        await db.product.update({
          where: { id: product.id },
          data: {
            specs: {
              ...currentSpecs,
              bsaleVariants: variants.map((v) => v.id),
            },
          },
        });
        console.log(
          `[Bsale Webhook] Updated variant list for product ${product.name}`
        );
      }
    } catch (error) {
      console.error(
        `[Bsale Webhook] Variant ${action} handler failed:`,
        error
      );
    }
  }
}

async function handlePriceWebhook(payload: BsaleWebhookPayload) {
  const variantId = Number(payload.resourceId);
  const priceListId = Number(
    payload.priceListId || process.env.BSALE_PRICE_LIST_ID || 1
  );

  try {
    const priceData = await bsale.getPriceListDetails(priceListId, variantId);
    if (!priceData.items?.length) {
      console.log(
        `[Bsale Webhook] No price data for variant=${variantId}, priceList=${priceListId}`
      );
      return;
    }

    const price = priceData.items[0].priceWithTax / 100; // Cents to soles
    const comparePrice = priceData.items[0].basePrice / 100;

    // Update price in iTools DB
    const { db } = await import("@/lib/db");
    const product = await db.product.findFirst({
      where: {
        specs: { path: ["bsaleVariants"], array_contains: variantId },
      },
    });

    if (product) {
      await db.product.update({
        where: { id: product.id },
        data: {
          price,
          comparePrice: comparePrice !== price ? comparePrice : null,
        },
      });
      console.log(
        `[Bsale Webhook] Updated price for "${product.name}": S/${price.toFixed(2)}`
      );
    } else {
      console.log(
        `[Bsale Webhook] No product found for variant=${variantId} to update price`
      );
    }
  } catch (error) {
    console.error(
      `[Bsale Webhook] Price update failed for variant=${variantId}:`,
      error
    );
  }
}

async function handleStockWebhook(payload: BsaleWebhookPayload) {
  const variantId = Number(payload.resourceId);
  const officeId = Number(
    payload.officeId || process.env.BSALE_OFFICE_ID || 1
  );

  try {
    const result = await syncVariantStock(variantId, officeId);
    if (result) {
      console.log(
        `[Bsale Webhook] Stock updated: SKU=${result.sku} → ${result.stock} units`
      );
    } else {
      console.log(
        `[Bsale Webhook] No stock sync result for variant=${variantId}, office=${officeId}`
      );
    }
  } catch (error) {
    console.error(
      `[Bsale Webhook] Stock update failed for variant=${variantId}:`,
      error
    );
  }
}

async function handleDocumentWebhook(payload: BsaleWebhookPayload) {
  const docId = Number(payload.resourceId);
  const action = payload.action === "post" ? "created" : "updated";

  console.log(
    `[Bsale Webhook] Document ${action}: id=${docId}`
  );

  try {
    // Fetch the document details for logging
    const doc = await bsale.getDocument(docId);
    console.log(
      `[Bsale Webhook] Document details: number=${doc.number}, total=${doc.totalAmount}, state=${doc.state}, urlPdf=${doc.urlPdf || "N/A"}`
    );

    // Update corresponding order in iTools DB if it has a salesId mapping
    const { db } = await import("@/lib/db");
    const order = await db.order.findFirst({
      where: { orderNumber: String(docId) },
    });

    if (order) {
      // Map Bsale document state to order status
      // Bsale states: 0=normal, 1=informing SUNAT, 2=accepted, 3=rejected, 4=canceled
      const stateMapping: Record<number, string> = {
        0: "PROCESSING",
        1: "PROCESSING",
        2: "CONFIRMED",
        3: "REJECTED",
        4: "CANCELLED",
      };

      await db.order.update({
        where: { id: order.id },
        data: {
          status: stateMapping[doc.state] || order.status,
          notes: `Bsale doc #${doc.number} | state=${doc.state}`,
        },
      });
      console.log(
        `[Bsale Webhook] Updated order ${order.orderNumber} from Bsale document`
      );
    }
  } catch (error) {
    console.error(
      `[Bsale Webhook] Document ${action} handler failed for id=${docId}:`,
      error
    );
  }
}

async function handlePaymentWebhook(payload: BsaleWebhookPayload) {
  const paymentId = Number(payload.resourceId);

  console.log(
    `[Bsale Webhook] Payment ${payload.action === "post" ? "created" : "updated"}: id=${paymentId}`
  );

  try {
    // If we can correlate a payment to an order, update payment status
    const { db } = await import("@/lib/db");

    // Look for orders that might match this payment
    // Payment webhooks don't always include a direct order reference,
    // so we log it for manual reconciliation if needed
    console.log(
      `[Bsale Webhook] Payment event recorded for id=${paymentId}. Manual reconciliation may be needed.`
    );
  } catch (error) {
    console.error(
      `[Bsale Webhook] Payment handler failed for id=${paymentId}:`,
      error
    );
  }
}

// ─── GET endpoint for webhook verification ──────────────────────

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/webhooks/bsale",
    status: "active",
    topics: ["product", "variant", "price", "stock", "document", "payment"],
    actions: ["post", "put"],
    info: "Configure this URL in Bsale Dashboard → Configuration → Webhooks",
    secretConfigured: !!process.env.BSALE_WEBHOOK_SECRET,
  });
}
