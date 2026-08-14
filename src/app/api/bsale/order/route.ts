import { NextRequest, NextResponse } from "next/server";
import { createBsaleOrder, type iToolsOrder } from "@/lib/bsale/orders";

/**
 * POST /api/bsale/order
 * 
 * Create a Bsale document (Factura/Boleta) from an iTools order.
 * 
 * Body: iToolsOrder object with:
 *   - orderId: External order ID
 *   - items: Array of { sku, name, quantity, price, bsaleVariantId? }
 *   - customer: { documentType, documentNumber, firstName, lastName, email, ... }
 *   - subtotal, shippingCost, discount, total
 *   - paymentMethod: "credit_card" | "debit_card" | "transfer" | "cash" | "yape" | "plin"
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
    const order: iToolsOrder = await request.json();

    // Validate required fields
    if (!order.orderId || !order.items?.length || !order.customer || !order.total) {
      return NextResponse.json(
        { error: "Missing required fields: orderId, items, customer, total" },
        { status: 400 }
      );
    }

    const result = await createBsaleOrder(order);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Document ${result.bsaleDocumentNumber} created in Bsale`,
        ...result,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: result.error,
      },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 500 }
    );
  }
}
