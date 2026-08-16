import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/pdf/ficha-tecnica?sku=XXX
 *
 * Generates a printable HTML technical sheet (ficha técnica) for a product.
 * The browser can then print-to-PDF.
 *
 * If the product has a `technicalSheetUrl` set (external URL),
 * redirects to that URL instead of generating one.
 */

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sku = request.nextUrl.searchParams.get("sku");

  if (!sku) {
    return NextResponse.json({ error: "SKU parameter is required" }, { status: 400 });
  }

  try {
    const product = await db.product.findUnique({
      where: { sku },
      include: {
        brand: { select: { name: true, logo: true } },
        category: { select: { name: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // If product has an external technical sheet URL, redirect there
    if (product.technicalSheetUrl) {
      return NextResponse.redirect(product.technicalSheetUrl);
    }

    const specs = product.specs as Record<string, string | number> | null;
    const images = product.images as string[] | null;

    const html = buildFichaTecnicaHTML(product, specs, images);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Failed to generate ficha técnica", details: message }, { status: 500 });
  }
}

function buildFichaTecnicaHTML(
  product: {
    name: string;
    sku: string;
    description: string | null;
    price: number;
    comparePrice: number | null;
    stock: number;
    lowStockAlert: number;
    brand: { name: string; logo: string | null } | null;
    category: { name: string } | null;
  },
  specs: Record<string, string | number> | null,
  images: string[] | null
) {
  const date = new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" });
  const stockClass = product.stock <= 0 ? "stock-out" : product.stock <= product.lowStockAlert ? "stock-low" : "stock-in";
  const stockLabel = product.stock <= 0 ? "Agotado" : product.stock <= product.lowStockAlert ? `Últimas ${product.stock} unidades` : `En stock (${product.stock} unidades)`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ficha Técnica - ${product.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: 700; color: #2563eb; }
    .brand-label { font-size: 14px; color: #666; }
    h1 { font-size: 28px; margin-bottom: 8px; }
    .sku { font-size: 13px; color: #888; margin-bottom: 24px; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 16px; font-weight: 600; color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 12px; }
    .specs-table { width: 100%; border-collapse: collapse; }
    .specs-table tr:nth-child(even) { background: #f9fafb; }
    .specs-table td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    .specs-table td:first-child { font-weight: 600; color: #374151; width: 40%; }
    .price { font-size: 32px; font-weight: 700; color: #16a34a; }
    .price-compare { font-size: 18px; color: #999; text-decoration: line-through; margin-left: 12px; }
    .stock { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 13px; font-weight: 500; margin-top: 8px; }
    .stock-in { background: #dcfce7; color: #166534; }
    .stock-low { background: #fef3c7; color: #92400e; }
    .stock-out { background: #fee2e2; color: #991b1b; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #888; text-align: center; }
    @media print { body { padding: 20px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div><div class="logo">iTools.pe</div><div class="brand-label">Herramientas y Equipos Industriales</div></div>
    <div style="text-align:right;font-size:12px;color:#888;">Ficha Técnica<br/>${date}</div>
  </div>
  <h1>${product.name}</h1>
  <div class="sku">SKU: ${product.sku}${product.brand ? ` | Marca: ${product.brand.name}` : ""}${product.category ? ` | Categoría: ${product.category.name}` : ""}</div>
  <div class="section">
    <div class="section-title">Precio</div>
    <span class="price">S/ ${product.price.toFixed(2)}</span>${product.comparePrice ? `<span class="price-compare">S/ ${product.comparePrice.toFixed(2)}</span>` : ""}
    <br/><span class="stock ${stockClass}">${stockLabel}</span>
  </div>
  ${product.description ? `<div class="section"><div class="section-title">Descripción</div><p style="font-size:14px;line-height:1.6;">${product.description}</p></div>` : ""}
  ${specs && Object.keys(specs).length > 0 ? `<div class="section"><div class="section-title">Especificaciones Técnicas</div><table class="specs-table">${Object.entries(specs).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</table></div>` : ""}
  <div class="footer">iTools.pe — Av. Universitaria 4974, Los Olivos, Lima, Perú | Tel: 01 234 5678<br/>Este documento es informativo. Precios sujetos a cambio sin previo aviso.</div>
  <button class="no-print" onclick="window.print()" style="position:fixed;bottom:20px;right:20px;padding:12px 24px;background:#2563eb;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.2);">Imprimir / Guardar PDF</button>
</body>
</html>`;
}
