/**
 * Bsale Order Creation
 * 
 * When a customer completes checkout on iTools,
 * this creates the corresponding document in Bsale (Factura/Boleta).
 */

import * as bsale from "./client";
import type { CreateDocumentRequest, BsaleDocument } from "./client";

// ─── Types ──────────────────────────────────────────────────────

interface iToolsOrderItem {
  sku: string;
  name: string;
  quantity: number;
  price: number; // In soles (not cents)
  bsaleVariantId?: number;
}

interface iToolsCustomer {
  documentType: "ruc" | "dni" | "ce"; // RUC, DNI, or Carnet de Extranjería
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
}

interface iToolsOrder {
  orderId: string;
  items: iToolsOrderItem[];
  customer: iToolsCustomer;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: "credit_card" | "debit_card" | "transfer" | "cash" | "yape" | "plin";
}

interface BsaleOrderResult {
  success: boolean;
  bsaleDocumentId?: number;
  bsaleDocumentNumber?: number;
  bsalePdfUrl?: string;
  bsalePublicUrl?: string;
  error?: string;
}

// ─── Config ─────────────────────────────────────────────────────

function getOfficeId(): number {
  return Number(process.env.BSALE_OFFICE_ID) || 1;
}

function getPriceListId(): number {
  return Number(process.env.BSALE_PRICE_LIST_ID) || 1;
}

function getBoletaTypeId(): number {
  return Number(process.env.BSALE_BOLETA_TYPE_ID) || 0;
}

function getFacturaTypeId(): number {
  return Number(process.env.BSALE_FACTURA_TYPE_ID) || 0;
}

/**
 * Determine if customer needs Factura (RUC) or Boleta (DNI)
 */
function getDocumentTypeId(customer: iToolsCustomer): number {
  if (customer.documentType === "ruc") {
    const facturaId = getFacturaTypeId();
    if (facturaId) return facturaId;
  }
  const boletaId = getBoletaTypeId();
  if (boletaId) return boletaId;
  
  // Fallback: let Bsale determine by codeSii
  throw new Error("BSALE_BOLETA_TYPE_ID and BSALE_FACTURA_TYPE_ID must be configured");
}

/**
 * Map iTools payment method to Bsale payment type ID
 * These IDs must be configured in Bsale Dashboard
 */
function getPaymentTypeId(method: string): number {
  const mapping: Record<string, number> = {
    credit_card: Number(process.env.BSALE_PAYMENT_CREDIT_CARD) || 1,
    debit_card: Number(process.env.BSALE_PAYMENT_DEBIT_CARD) || 1,
    transfer: Number(process.env.BSALE_PAYMENT_TRANSFER) || 2,
    cash: Number(process.env.BSALE_PAYMENT_CASH) || 3,
    yape: Number(process.env.BSALE_PAYMENT_YAPE) || 3,
    plin: Number(process.env.BSALE_PAYMENT_PLIN) || 3,
  };
  return mapping[method] || 1;
}

/**
 * Convert soles to cents (Bsale expects prices in cents)
 */
function solesToCents(soles: number): number {
  return Math.round(soles * 100);
}

/**
 * Get current Unix timestamp
 */
function nowTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

// ─── Main Order Creation ────────────────────────────────────────

/**
 * Create a Bsale document (Factura/Boleta) from an iTools order
 */
export async function createBsaleOrder(order: iToolsOrder): Promise<BsaleOrderResult> {
  try {
    const documentTypeId = getDocumentTypeId(order.customer);
    const officeId = getOfficeId();
    const priceListId = getPriceListId();
    const emissionDate = nowTimestamp();

    // Build client object
    const isCompany = order.customer.documentType === "ruc";
    const client: bsale.BsaleDocumentClient = {
      code: order.customer.documentNumber,
      company: isCompany ? `${order.customer.firstName} ${order.customer.lastName}` : undefined,
      firstName: isCompany ? undefined : order.customer.firstName,
      lastName: isCompany ? undefined : order.customer.lastName,
      email: order.customer.email,
      address: order.customer.address,
      city: order.customer.city || "Lima",
      municipality: "Los Olivos",
      activity: isCompany ? "VENTA DE HERRAMIENTAS" : undefined,
      companyOrPerson: isCompany ? 1 : 0,
    };

    // Build line items
    const details: bsale.BsaleDocumentDetail[] = order.items.map((item) => ({
      ...(item.bsaleVariantId ? { variantId: item.bsaleVariantId } : { code: Number(item.sku) || undefined }),
      netUnitValue: solesToCents(item.price), // Price before IGV
      quantity: item.quantity,
      taxId: "[1]", // IGV 18% (Peru)
      comment: item.name,
      discount: 0,
    }));

    // Add shipping as a line item if applicable
    if (order.shippingCost > 0) {
      details.push({
        comment: "Envío a domicilio",
        netUnitValue: solesToCents(order.shippingCost),
        quantity: 1,
        taxId: "[1]",
        discount: 0,
      });
    }

    // Build payments
    const payments: bsale.BsaleDocumentPayment[] = [
      {
        paymentTypeId: getPaymentTypeId(order.paymentMethod),
        amount: solesToCents(order.total),
        recordDate: emissionDate,
      },
    ];

    // Create the document in Bsale
    const documentData: CreateDocumentRequest = {
      documentTypeId,
      officeId,
      emissionDate,
      expirationDate: emissionDate, // Same day
      declareSii: 1, // Declare to SUNAT
      priceListId,
      dispatch: 1, // Auto-deduct stock from Bsale
      sendEmail: 1, // Send document to customer
      salesId: order.orderId, // Prevent duplicate emission
      client,
      details,
      payments,
    };

    const bsaleDoc = await bsale.createDocument(documentData);

    return {
      success: true,
      bsaleDocumentId: bsaleDoc.id,
      bsaleDocumentNumber: bsaleDoc.number,
      bsalePdfUrl: bsaleDoc.urlPdf,
      bsalePublicUrl: bsaleDoc.urlPublicView,
    };
  } catch (error) {
    console.error("[Bsale] Order creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error creating Bsale document",
    };
  }
}

export type { iToolsOrder, iToolsOrderItem, iToolsCustomer, BsaleOrderResult };
