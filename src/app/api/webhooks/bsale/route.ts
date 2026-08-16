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
const processedWebhooks = new Set<string>();
const WEBHOOK_DEDUP_TTL = 300000; // 5 minutes

export async function POST(request: NextRequest) {
  // Validate webhook secret (if configured)
  const webhookSecret = process.env.BSALE_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = request.headers.get("x-bsale-signature") || 
                      request.headers.get("authorization");
    if (signature !== webhookSecret && signature !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }
  }

  try {
    const payload: BsaleWebhookPayload = await request.json();

    // Dedup check
    const dedupKey = `${payload.topic}-${payload.resourceId}-${payload.action}-${payload.send}`;
    if (processedWebhooks.has(dedupKey)) {
      return NextResponse.json({ status: "duplicate", topic: payload.topic });
    }
    processedWebhooks.add(dedupKey);

    // Clean old entries periodically
    if (processedWebhooks.size > 1000) {
      processedWebhooks.clear();
    }

    console.log(`[Bsale Webhook] ${payload.action} ${payload.topic} id=${payload.resourceId}`);

    // Process based on topic
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
        console.log(`[Bsale Webhook] Unknown topic: ${payload.topic}`);
    }

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({
      status: "processed",
      topic: payload.topic,
      action: payload.action,
      resourceId: payload.resourceId,
    });
  } catch (error) {
    console.error("[Bsale Webhook] Error:", error);
    // Still return 200 to prevent Bsale from retrying
    return NextResponse.json({ status: "error", message: "Internal error" });
  }
}

// ─── Webhook Handlers ───────────────────────────────────────────

async function handleProductWebhook(payload: BsaleWebhookPayload) {
  // Fetch the full product data from Bsale
  const productId = Number(payload.resourceId);
  const bsaleProduct = await bsale.getProduct(productId, ["product_type"]);

  // Update the corresponding product in iTools DB
  const { db } = await import("@/lib/db");
  
  const existing = await db.product.findFirst({
    where: { specs: { path: ["bsaleId"], equals: productId } },
  });

  if (existing) {
    await db.product.update({
      where: { id: existing.id },
      data: {
        name: bsaleProduct.name,
        description: bsaleProduct.description || undefined,
        isPublished: bsaleProduct.state === 0,
      },
    });
    console.log(`[Bsale] Updated product: ${bsaleProduct.name}`);
  } else {
    // New product from Bsale - create in iTools
    const sku = `BSALE-${bsaleProduct.id}`;
    const slug = bsaleProduct.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await db.product.create({
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
    console.log(`[Bsale] Created new product: ${bsaleProduct.name}`);
  }
}

async function handleVariantWebhook(payload: BsaleWebhookPayload) {
  // Variant created or updated - refresh product data
  console.log(`[Bsale] Variant ${payload.action}: ${payload.resourceId}`);
  // The product webhook will handle the full update
}

async function handlePriceWebhook(payload: BsaleWebhookPayload) {
  const variantId = Number(payload.resourceId);
  const priceListId = Number(payload.priceListId || process.env.BSALE_PRICE_LIST_ID || 1);

  try {
    const priceData = await bsale.getPriceListDetails(priceListId, variantId);
    if (!priceData.items?.length) return;

    const price = priceData.items[0].priceWithTax / 100; // Cents to soles
    const comparePrice = priceData.items[0].basePrice / 100;

    // Update price in iTools DB
    const { db } = await import("@/lib/db");
    const product = await db.product.findFirst({
      where: { specs: { path: ["bsaleVariants"], array_contains: variantId } },
    });

    if (product) {
      await db.product.update({
        where: { id: product.id },
        data: { price, comparePrice: comparePrice !== price ? comparePrice : null },
      });
      console.log(`[Bsale] Updated price for ${product.name}: S/${price}`);
    }
  } catch (error) {
    console.error(`[Bsale] Price update error:`, error);
  }
}

async function handleStockWebhook(payload: BsaleWebhookPayload) {
  const variantId = Number(payload.resourceId);
  const officeId = Number(payload.officeId || process.env.BSALE_OFFICE_ID || 1);

  const result = await syncVariantStock(variantId, officeId);
  if (result) {
    console.log(`[Bsale] Stock updated: ${result.sku} → ${result.stock} units`);
  }
}

async function handleDocumentWebhook(payload: BsaleWebhookPayload) {
  // Document created/updated in Bsale - could be a refund, credit note, etc.
  console.log(`[Bsale] Document ${payload.action}: ${payload.resourceId}`);
  // TODO: Handle document status changes (e.g., payment confirmed, invoice rejected by SUNAT)
}

async function handlePaymentWebhook(payload: BsaleWebhookPayload) {
  // Payment registered in Bsale
  console.log(`[Bsale] Payment ${payload.action}: ${payload.resourceId}`);
  // TODO: Update order payment status in iTools
}

// ─── GET endpoint for webhook verification ──────────────────────

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/webhooks/bsale",
    status: "active",
    topics: ["product", "variant", "price", "stock", "document", "payment"],
    info: "Configure this URL in Bsale Dashboard → Configuration → Webhooks",
  });
}
