import { NextResponse } from "next/server";
import { testConnection, listDocumentTypes } from "@/lib/bsale/client";

/**
 * GET /api/bsale/test
 *
 * Test Bsale API connectivity and show configuration status.
 * Returns:
 *   - Connection status
 *   - Office list (branches)
 *   - Product count
 *   - Document types available
 *   - Configuration status (which env vars are set)
 */
export async function GET() {
  // ─── Configuration status ──────────────────────────────────────
  const config = {
    BSALE_ACCESS_TOKEN: !!process.env.BSALE_ACCESS_TOKEN,
    BSALE_WEBHOOK_SECRET: !!process.env.BSALE_WEBHOOK_SECRET,
    BSALE_OFFICE_ID: !!process.env.BSALE_OFFICE_ID,
    BSALE_PRICE_LIST_ID: !!process.env.BSALE_PRICE_LIST_ID,
    BSALE_BOLETA_TYPE_ID: !!process.env.BSALE_BOLETA_TYPE_ID,
    BSALE_FACTURA_TYPE_ID: !!process.env.BSALE_FACTURA_TYPE_ID,
    BSALE_PAYMENT_CREDIT_CARD: !!process.env.BSALE_PAYMENT_CREDIT_CARD,
    BSALE_PAYMENT_DEBIT_CARD: !!process.env.BSALE_PAYMENT_DEBIT_CARD,
    BSALE_PAYMENT_TRANSFER: !!process.env.BSALE_PAYMENT_TRANSFER,
    BSALE_PAYMENT_CASH: !!process.env.BSALE_PAYMENT_CASH,
    BSALE_PAYMENT_YAPE: !!process.env.BSALE_PAYMENT_YAPE,
    BSALE_PAYMENT_PLIN: !!process.env.BSALE_PAYMENT_PLIN,
  };

  // Count how many are configured
  const configuredCount = Object.values(config).filter(Boolean).length;
  const totalConfigVars = Object.keys(config).length;

  const token = process.env.BSALE_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({
      connected: false,
      error: "BSALE_ACCESS_TOKEN is not configured",
      setup: "Add BSALE_ACCESS_TOKEN to your environment variables",
      docs: "https://docs.bsale.dev/",
      config,
      configSummary: `${configuredCount}/${totalConfigVars} variables set`,
    });
  }

  // ─── Test connectivity ─────────────────────────────────────────
  const result = await testConnection();

  if (result.connected) {
    // Also fetch document types for reference
    let documentTypes: Array<{ id: number; name: string; codeSii: number }> = [];
    try {
      const dtResponse = await listDocumentTypes();
      documentTypes = (dtResponse.items || []).map((dt) => ({
        id: dt.id,
        name: dt.name,
        codeSii: dt.codeSii,
      }));
    } catch {
      // Document types fetch failed - non-critical
    }

    return NextResponse.json({
      connected: true,
      message: `Connected to Bsale. ${result.productCount} products, ${result.officeCount} offices.`,
      offices: result.offices.map((o) => ({
        id: o.id,
        name: o.name,
        isVirtual: o.isVirtual === 1,
        address: o.address,
        city: o.city,
        state: o.state === 0 ? "active" : "inactive",
      })),
      productCount: result.productCount,
      officeCount: result.officeCount,
      documentTypes,
      config,
      configSummary: `${configuredCount}/${totalConfigVars} variables set`,
      // Helpful hints for missing config
      recommendations: getRecommendations(config),
    });
  }

  return NextResponse.json(
    {
      connected: false,
      error: "Failed to connect to Bsale API. Check your access token.",
      config,
      configSummary: `${configuredCount}/${totalConfigVars} variables set`,
    },
    { status: 502 }
  );
}

/**
 * Generate recommendations for missing configuration.
 */
function getRecommendations(
  config: Record<string, boolean>
): string[] {
  const recommendations: string[] = [];

  if (!config.BSALE_OFFICE_ID) {
    recommendations.push(
      "Set BSALE_OFFICE_ID to specify which branch/warehouse to use for stock"
    );
  }
  if (!config.BSALE_PRICE_LIST_ID) {
    recommendations.push(
      "Set BSALE_PRICE_LIST_ID to specify which price list to use"
    );
  }
  if (!config.BSALE_BOLETA_TYPE_ID) {
    recommendations.push(
      "Set BSALE_BOLETA_TYPE_ID for DNI customers (Boleta de Venta)"
    );
  }
  if (!config.BSALE_FACTURA_TYPE_ID) {
    recommendations.push(
      "Set BSALE_FACTURA_TYPE_ID for RUC customers (Factura)"
    );
  }
  if (!config.BSALE_WEBHOOK_SECRET) {
    recommendations.push(
      "Set BSALE_WEBHOOK_SECRET to secure webhook endpoint"
    );
  }
  if (
    !config.BSALE_PAYMENT_CREDIT_CARD &&
    !config.BSALE_PAYMENT_DEBIT_CARD &&
    !config.BSALE_PAYMENT_TRANSFER &&
    !config.BSALE_PAYMENT_CASH
  ) {
    recommendations.push(
      "Set BSALE_PAYMENT_* IDs for payment method mapping (credit_card, debit_card, transfer, cash, yape, plin)"
    );
  }

  return recommendations;
}
