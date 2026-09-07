import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { client } from "@/sanity/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sku = request.nextUrl.searchParams.get("sku")?.trim();

  if (!sku) {
    return NextResponse.json({ error: "SKU parameter is required" }, { status: 400 });
  }

  try {
    let product: any = null;

    // 1. Try PostgreSQL / Prisma DB
    try {
      product = await db.product.findUnique({
        where: { sku },
        include: {
          brand: { select: { name: true, logo: true } },
          category: { select: { name: true } },
        },
      });
    } catch {
      // Ignore DB connection errors and fallback to Sanity
    }

    // 2. Fallback to Sanity CMS (where all 7,524 Bsale products live)
    if (!product) {
      try {
        const wildcard = `*${sku}*`;
        const sanityDoc = await client.fetch(
          `*[_type == "product" && (sku == $sku || sku match $wildcard)][0] {
            name,
            sku,
            shortDescription,
            description,
            price,
            salePrice,
            technicalSheetUrl,
            "brand": brand->{ name },
            "category": category->{ name },
            specs[] { key, value },
            image { asset-> { url } }
          }`,
          { sku, wildcard }
        );

        if (sanityDoc) {
          const specsRecord: Record<string, string> = {};
          if (Array.isArray(sanityDoc.specs)) {
            sanityDoc.specs.forEach((s: any) => {
              if (s.key) specsRecord[s.key] = s.value;
            });
          }
          product = {
            name: sanityDoc.name,
            sku: sanityDoc.sku || sku,
            description: sanityDoc.description || sanityDoc.shortDescription || "",
            technicalSheetUrl: sanityDoc.technicalSheetUrl,
            brand: sanityDoc.brand ? { name: sanityDoc.brand.name } : null,
            category: sanityDoc.category ? { name: sanityDoc.category.name } : null,
            specs: specsRecord,
            images: sanityDoc.image?.asset?.url ? [sanityDoc.image.asset.url] : [],
          };
        }
      } catch (sanityErr) {
        console.error("Sanity ficha fetch error:", sanityErr);
      }
    }

    if (!product) {
      // Return a basic printable specification fallback instead of 404
      product = {
        name: `Herramienta Profesional SKU ${sku}`,
        sku: sku,
        description: "Especificaciones técnicas oficiales según catálogo del fabricante.",
        brand: { name: "iTools Perú" },
        category: { name: "Herramientas" },
        specs: { "Código de Producto": sku, "Distribuidor Oficial": "iTools Perú" },
        images: [],
      };
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
    description: string;
    brand: { name: string; logo?: string | null } | null;
    category: { name: string } | null;
  },
  specs: Record<string, string | number> | null,
  images: string[] | null
): string {
  const brandName = product.brand?.name ?? "iTools Perú";
  const categoryName = product.category?.name ?? "Herramientas Profesionales";
  const mainImage = images && images.length > 0 ? images[0] : null;

  const specRows = specs
    ? Object.entries(specs)
        .map(
          ([key, val]) => `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 40%;">${escapeHtml(key)}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; color: #111827;">${escapeHtml(String(val))}</td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="2" style="padding: 12px; color: #6b7280; text-align: center;">Sin especificaciones detalladas adicionales</td></tr>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Ficha Técnica — ${escapeHtml(product.name)} (${escapeHtml(product.sku)})</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; color: #111; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0056D2; padding-bottom: 16px; margin-bottom: 24px; }
    .logo { font-size: 26px; font-weight: 900; color: #0056D2; text-transform: uppercase; }
    .logo span { color: #D1001C; }
    .badge { background: #0056D2; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .product-title { font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 6px 0; }
    .sku-badge { font-size: 13px; color: #6b7280; font-family: monospace; margin-bottom: 16px; }
    .table-specs { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 13px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
    .btn-print { position: fixed; top: 20px; right: 20px; background: #0056D2; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    @media print { .btn-print { display: none; } }
  </style>
</head>
<body>
  <button class="btn-print" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>

  <div class="header">
    <div class="logo">iTools<span>.Pe</span></div>
    <div class="badge">Ficha Técnica Oficial</div>
  </div>

  <h1 class="product-title">${escapeHtml(product.name)}</h1>
  <div class="sku-badge">SKU: <strong>${escapeHtml(product.sku)}</strong> &bull; Marca: <strong>${escapeHtml(brandName)}</strong> &bull; Categoría: <strong>${escapeHtml(categoryName)}</strong></div>

  ${mainImage ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${escapeHtml(mainImage)}" alt="" style="max-height: 220px; max-width: 100%; object-fit: contain; border: 1px solid #f3f4f6; border-radius: 12px; padding: 10px;" /></div>` : ""}

  <h3 style="font-size: 14px; font-weight: 700; color: #0056D2; text-transform: uppercase; margin-top: 20px; margin-bottom: 6px;">Especificaciones Técnicas</h3>
  <table class="table-specs">
    <tbody>
      ${specRows}
    </tbody>
  </table>

  ${product.description ? `
  <h3 style="font-size: 14px; font-weight: 700; color: #0056D2; text-transform: uppercase; margin-top: 24px; margin-bottom: 6px;">Descripción del Producto</h3>
  <div style="font-size: 13px; line-height: 1.6; color: #4b5563; background: #f9fafb; padding: 14px; border-radius: 8px; border: 1px solid #e5e7eb;">${escapeHtml(product.description)}</div>
  ` : ""}

  <div style="margin-top: 36px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; display: flex; justify-content: space-between;">
    <div>Distribuidor Oficial en el Perú: iTools Perú &bull; RUC: 20610613749</div>
    <div>Soporte y Garantía: www.itools.pe</div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
