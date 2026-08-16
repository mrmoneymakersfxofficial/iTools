import { NextRequest, NextResponse } from "next/server";
import {
  createBsaleOrder,
  type iToolsOrder,
  type iToolsOrderItem,
  type iToolsCustomer,
} from "@/lib/bsale/orders";

/**
 * POST /api/bsale/order
 *
 * Create a Bsale document (Factura/Boleta) from an iTools checkout order.
 * The document type (Factura vs Boleta) is determined by the customer's
 * document type: RUC → Factura, DNI/CE → Boleta.
 *
 * Authorization: Bearer token with SANITY_REVALIDATE_SECRET
 *
 * Body: iToolsOrder object with:
 *   - orderId: External order ID (prevents duplicate emission)
 *   - items: Array of { sku, name, quantity, price, bsaleVariantId? }
 *   - customer: {
 *       documentType: "ruc" | "dni" | "ce",
 *       documentNumber: string (RUC/DNI/CE number),
 *       firstName, lastName, email,
 *       phone?, address?, city?
 *     }
 *   - subtotal, shippingCost, discount, total (in soles)
 *   - paymentMethod: "credit_card" | "debit_card" | "transfer" | "cash" | "yape" | "plin"
 *
 * Response:
 *   - success: boolean
 *   - bsaleDocumentId: Bsale document ID
 *   - bsaleDocumentNumber: Bsale document number (for printing)
 *   - bsalePdfUrl: URL to the PDF document
 *   - bsalePublicUrl: Public URL to view the document
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

  // ─── Parse and validate order ──────────────────────────────────
  let order: iToolsOrder;

  try {
    order = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // Validate required fields
  const validationErrors = validateOrder(order);
  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: validationErrors },
      { status: 400 }
    );
  }

  // ─── Create document in Bsale ──────────────────────────────────
  try {
    console.log(
      `[Bsale Order] Creating document for order ${order.orderId} ` +
        `(${order.items.length} items, total: S/${order.total.toFixed(2)}, ` +
        `customer: ${order.customer.documentType} ${order.customer.documentNumber})`
    );

    const result = await createBsaleOrder(order);

    if (result.success) {
      console.log(
        `[Bsale Order] Document created successfully: #${result.bsaleDocumentNumber} (id=${result.bsaleDocumentId})`
      );

      // Update the order in iTools DB with Bsale document reference
      try {
        const { db } = await import("@/lib/db");
        await db.order.updateMany({
          where: { orderNumber: order.orderId },
          data: {
            status: "PROCESSING",
            notes: `Bsale doc #${result.bsaleDocumentNumber} (id=${result.bsaleDocumentId})`,
          },
        });
      } catch (dbErr) {
        // Non-critical: the Bsale document was created, DB update is nice-to-have
        console.warn(
          `[Bsale Order] Could not update order in DB:`,
          dbErr
        );
      }

      return NextResponse.json({
        success: true,
        message: `Document ${result.bsaleDocumentNumber} created in Bsale`,
        documentType:
          order.customer.documentType === "ruc"
            ? "Factura"
            : "Boleta de Venta",
        bsaleDocumentId: result.bsaleDocumentId,
        bsaleDocumentNumber: result.bsaleDocumentNumber,
        bsalePdfUrl: result.bsalePdfUrl,
        bsalePublicUrl: result.bsalePublicUrl,
      });
    }

    console.error(
      `[Bsale Order] Document creation failed for order ${order.orderId}: ${result.error}`
    );

    return NextResponse.json(
      {
        success: false,
        error: result.error,
      },
      { status: 500 }
    );
  } catch (error) {
    console.error(
      `[Bsale Order] Unexpected error for order ${order.orderId}:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create order in Bsale",
      },
      { status: 500 }
    );
  }
}

/**
 * Validate the order payload and return an array of error messages.
 */
function validateOrder(order: Partial<iToolsOrder>): string[] {
  const errors: string[] = [];

  if (!order.orderId) {
    errors.push("orderId is required");
  }

  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    errors.push("items must be a non-empty array");
  } else {
    order.items.forEach((item: Partial<iToolsOrderItem>, i: number) => {
      if (!item.sku && !item.name) {
        errors.push(`items[${i}]: sku or name is required`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`items[${i}]: quantity must be positive`);
      }
      if (item.price == null || item.price < 0) {
        errors.push(`items[${i}]: price must be non-negative`);
      }
    });
  }

  if (!order.customer) {
    errors.push("customer is required");
  } else {
    const c = order.customer as Partial<iToolsCustomer>;
    if (!c.documentType || !["ruc", "dni", "ce"].includes(c.documentType)) {
      errors.push(
        'customer.documentType must be "ruc", "dni", or "ce"'
      );
    }
    if (!c.documentNumber) {
      errors.push("customer.documentNumber is required");
    } else {
      // Validate RUC (11 digits) or DNI (8 digits)
      if (c.documentType === "ruc" && !/^\d{11}$/.test(c.documentNumber)) {
        errors.push("RUC must be 11 digits");
      }
      if (c.documentType === "dni" && !/^\d{8}$/.test(c.documentNumber)) {
        errors.push("DNI must be 8 digits");
      }
    }
    if (!c.firstName) {
      errors.push("customer.firstName is required");
    }
    if (!c.lastName) {
      errors.push("customer.lastName is required");
    }
    if (!c.email) {
      errors.push("customer.email is required");
    }
  }

  if (order.total == null || order.total <= 0) {
    errors.push("total must be positive");
  }

  if (
    order.paymentMethod &&
    ![
      "credit_card",
      "debit_card",
      "transfer",
      "cash",
      "yape",
      "plin",
    ].includes(order.paymentMethod)
  ) {
    errors.push("paymentMethod is invalid");
  }

  return errors;
}
