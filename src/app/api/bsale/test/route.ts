import { NextResponse } from "next/server";
import { testConnection } from "@/lib/bsale/client";

/**
 * GET /api/bsale/test
 * 
 * Test Bsale API connectivity.
 * Returns office and product counts if connected.
 */
export async function GET() {
  const token = process.env.BSALE_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json(
      {
        connected: false,
        error: "BSALE_ACCESS_TOKEN is not configured",
        setup: "Add BSALE_ACCESS_TOKEN to your Vercel environment variables",
        docs: "https://docs.bsale.dev/",
      },
      { status: 200 }
    );
  }

  const result = await testConnection();

  if (result.connected) {
    return NextResponse.json({
      connected: true,
      offices: result.offices.map((o) => ({
        id: o.id,
        name: o.name,
        isVirtual: o.isVirtual === 1,
        address: o.address,
        city: o.city,
      })),
      productCount: result.productCount,
      officeCount: result.officeCount,
      message: `Connected to Bsale. ${result.productCount} products, ${result.officeCount} offices.`,
    });
  }

  return NextResponse.json(
    {
      connected: false,
      error: "Failed to connect to Bsale API. Check your access token.",
    },
    { status: 502 }
  );
}
