import { NextRequest, NextResponse } from "next/server";
import * as bsale from "@/lib/bsale/client";
import { syncVariantStock, syncVariantPrice } from "@/lib/bsale/sync";

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

const processedWebhooks = new Set<string>();

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.BSALE_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = request.headers.get("x-bsale-signature") || request.headers.get("authorization");
    if (signature !== webhookSecret && signature !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }
  }

  try {
    const payload: BsaleWebhookPayload = await request.json();

    const dedupKey = `${payload.topic}-${payload.resourceId}-${payload.action}-${payload.send}`;
    if (processedWebhooks.has(dedupKey)) {
      return NextResponse.json({ status: "duplicate", topic: payload.topic });
    }
    processedWebhooks.add(dedupKey);

    if (processedWebhooks.size > 1000) processedWebhooks.clear();

    console.log(`[Bsale Webhook] ${payload.action} ${payload.topic} id=${payload.resourceId}`);

    switch (payload.topic) {
      case "product":
        await handleProductWebhook(payload);
        break;
      case "variant":
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

    return NextResponse.json({ status: "processed", topic: payload.topic, action: payload.action, resourceId: payload.resourceId });
  } catch (error) {
    console.error("[Bsale Webhook] Error:", error);
    return NextResponse.json({ status: "error", message: "Internal error" });
  }
}

async function handleProductWebhook(payload: BsaleWebhookPayload) {
  const productId = Number(payload.resourceId);
  const bsaleProduct = await bsale.getProduct(productId, ["product_type"]);
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
    const sku = `BSALE-${bsaleProduct.id}`;
    const slug = bsaleProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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
    console.log(`[Bsale] Created new product in DB: ${bsaleProduct.name}`);
  }
}

async function handlePriceWebhook(payload: BsaleWebhookPayload) {
  const variantId = Number(payload.resourceId);
  const priceListId = Number(payload.priceListId || process.env.BSALE_PRICE_LIST_ID || 1);
  await syncVariantPrice(variantId, priceListId);
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
  const documentId = Number(payload.resourceId);
  try {
    const { db } = await import("@/lib/db");
    const docData = await bsale.getDocument(documentId);
    if (!docData) return;

    const order = await db.order.findFirst({
      where: { notes: { contains: `bsale-doc:${documentId}` } },
    });

    if (order) {
      const statusMap: Record<number, string> = { 0: "PENDING", 1: "CONFIRMED", 2: "CANCELLED" };
      const newStatus = statusMap[docData.state] ?? order.status;

      const paymentMap: Record<number, string> = { 0: "PENDING", 1: "PAID", 2: "PARTIAL" };
      const newPaymentStatus = docData.paymentStatus !== undefined ? (paymentMap[docData.paymentStatus] ?? order.paymentStatus) : order.paymentStatus;

      await db.order.update({
        where: { id: order.id },
        data: { status: newStatus, paymentStatus: newPaymentStatus },
      });
    }
  } catch (error) {
    console.error(`[Bsale] Document webhook error:`, error);
  }
}

async function handlePaymentWebhook(payload: BsaleWebhookPayload) {
  const paymentId = Number(payload.resourceId);
  try {
    const { db } = await import("@/lib/db");
    const paymentData = await bsale.getPayment(paymentId);
    if (!paymentData || !paymentData.documentId) return;

    const order = await db.order.findFirst({
      where: { notes: { contains: `bsale-doc:${paymentData.documentId}` } },
    });

    if (order) {
      const paymentStatusMap: Record<number, string> = { 0: "PENDING", 1: "PAID", 2: "PARTIAL" };
      const newPaymentStatus = paymentStatusMap[paymentData.state] ?? order.paymentStatus;

      const updateData: Record<string, string> = { paymentStatus: newPaymentStatus };
      if (newPaymentStatus === "PAID" && order.status === "PENDING") {
        updateData.status = "CONFIRMED";
      }

      await db.order.update({
        where: { id: order.id },
        data: updateData,
      });
    }
  } catch (error) {
    console.error(`[Bsale] Payment webhook error:`, error);
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/webhooks/bsale",
    status: "active",
    topics: ["product", "variant", "price", "stock", "document", "payment"],
  });
}