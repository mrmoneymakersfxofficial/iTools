import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { format } from "date-fns";

/**
 * POST /api/pdf
 *
 * Generate a professional "Ficha Técnica" PDF for a product.
 *
 * Body:
 *   name        - Product name (required)
 *   description - Product description
 *   price       - Price in soles (required)
 *   specs       - Record<string, string> of technical specifications
 *   brand       - Brand name
 *   sku         - Product SKU
 *   images      - Array of image URLs (first one used in PDF)
 *   slug        - Product slug (for filename)
 */

interface PdfProductData {
  name: string;
  description?: string;
  price: number;
  specs?: Record<string, string>;
  brand?: string;
  sku?: string;
  images?: string[];
  slug?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: PdfProductData = await request.json();

    if (!data.name || data.price == null) {
      return NextResponse.json(
        { error: "Missing required fields: name, price" },
        { status: 400 }
      );
    }

    const pdfBuffer = await generateProductPdf(data);

    const filename = (data.slug || data.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="ficha-tecnica-${filename}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error("[PDF] Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PDF generation failed" },
      { status: 500 }
    );
  }
}

async function generateProductPdf(data: PdfProductData): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 60, left: 50, right: 50 },
        info: {
          Title: `Ficha Técnica - ${data.name}`,
          Author: "iTools Perú",
          Subject: "Ficha Técnica de Producto",
          Creator: "iTools Store",
        },
      });

      const buffers: Buffer[] = [];
      doc.on("data", (buffer: Buffer) => buffers.push(buffer));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const accentColor = "#E53E3E"; // Red accent
      const darkColor = "#1A202C";
      const grayColor = "#718096";
      const lightBg = "#F7FAFC";

      // ─── HEADER ─────────────────────────────────────────────────
      // Header background
      doc.rect(0, 0, doc.page.width, 80).fill(accentColor);

      // iTools logo text (white on red)
      doc.fontSize(28).font("Helvetica-Bold");
      doc.fillColor("#FFFFFF").text("iTools", 50, 22, { continued: true });
      doc.fontSize(16).font("Helvetica").text(" Perú", { continued: false });

      // Subtitle
      doc.fontSize(10).font("Helvetica");
      doc.fillColor("#FFFFFF").text("Distribuidor Autorizado de Herramientas", 50, 52);

      // Date on the right
      const dateStr = format(new Date(), "dd/MM/yyyy");
      doc.fontSize(9).font("Helvetica");
      doc.fillColor("#FFFFFF").text(`Generado: ${dateStr}`, 50, 65);

      doc.fillColor(darkColor);
      doc.y = 100;

      // ─── PRODUCT NAME & BRAND ────────────────────────────────────
      doc.fontSize(22).font("Helvetica-Bold");
      doc.text(data.name, { align: "left" });

      if (data.brand) {
        doc.moveDown(0.3);
        doc.fontSize(12).font("Helvetica");
        doc.fillColor(accentColor).text(data.brand);
        doc.fillColor(darkColor);
      }

      if (data.sku) {
        doc.fontSize(9).font("Helvetica");
        doc.fillColor(grayColor).text(`SKU: ${data.sku}`);
        doc.fillColor(darkColor);
      }

      doc.moveDown(0.8);

      // ─── PRODUCT IMAGE ──────────────────────────────────────────
      if (data.images && data.images.length > 0) {
        try {
          const imageUrl = data.images[0];
          const imageResponse = await fetch(imageUrl, {
            signal: AbortSignal.timeout(5000),
          });
          if (imageResponse.ok) {
            const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
            const imageWidth = Math.min(pageWidth * 0.55, 280);
            doc.image(imageBuffer, doc.page.margins.left, doc.y, {
              width: imageWidth,
              fit: [imageWidth, 200],
            });
            doc.y += 210;
          }
        } catch {
          // Image failed to load, skip it
          console.log("[PDF] Could not load product image, skipping");
        }
      }

      doc.moveDown(0.5);

      // ─── PRICE ──────────────────────────────────────────────────
      // Price box
      const priceBoxY = doc.y;
      const priceBoxHeight = 50;
      doc.rect(doc.page.margins.left, priceBoxY, pageWidth, priceBoxHeight).fill(lightBg);

      doc.fontSize(11).font("Helvetica");
      doc.fillColor(grayColor).text("Precio:", doc.page.margins.left + 15, priceBoxY + 8, {
        continued: false,
      });

      const formattedPrice = new Intl.NumberFormat("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(data.price);

      doc.fontSize(22).font("Helvetica-Bold");
      doc.fillColor(accentColor).text(
        `S/ ${formattedPrice}`,
        doc.page.margins.left + 15,
        priceBoxY + 20
      );
      doc.fillColor(darkColor);

      doc.y = priceBoxY + priceBoxHeight + 15;

      // ─── TECHNICAL SPECIFICATIONS ───────────────────────────────
      const specs = data.specs || {};
      const specEntries = Object.entries(specs);

      if (specEntries.length > 0) {
        // Section title
        doc.moveDown(0.3);
        doc.fontSize(14).font("Helvetica-Bold");
        doc.text("Especificaciones Técnicas");
        doc.moveDown(0.4);

        // Divider line
        doc
          .moveTo(doc.page.margins.left, doc.y)
          .lineTo(doc.page.width - doc.page.margins.right, doc.y)
          .strokeColor(accentColor)
          .lineWidth(2)
          .stroke();
        doc.moveDown(0.5);

        // Table header
        const tableX = doc.page.margins.left;
        const colWidth = pageWidth / 2;
        const rowHeight = 26;

        // Header row
        doc.rect(tableX, doc.y, pageWidth, rowHeight).fill(accentColor);
        const headerY = doc.y + 7;
        doc.fontSize(10).font("Helvetica-Bold");
        doc.fillColor("#FFFFFF").text("Característica", tableX + 10, headerY, {
          width: colWidth - 20,
        });
        doc.text("Valor", tableX + colWidth + 10, headerY, {
          width: colWidth - 20,
        });
        doc.y = headerY - 7 + rowHeight;
        doc.fillColor(darkColor);

        // Data rows
        for (let i = 0; i < specEntries.length; i++) {
          const [key, value] = specEntries[i];
          const rowY = doc.y;

          // Alternate row background
          if (i % 2 === 0) {
            doc.rect(tableX, rowY, pageWidth, rowHeight).fill(lightBg);
          }

          doc.fontSize(9).font("Helvetica-Bold");
          doc.fillColor(darkColor).text(key, tableX + 10, rowY + 7, {
            width: colWidth - 20,
            ellipsis: true,
          });

          doc.fontSize(9).font("Helvetica");
          doc.text(String(value), tableX + colWidth + 10, rowY + 7, {
            width: colWidth - 20,
            ellipsis: true,
          });

          doc.y = rowY + rowHeight;

          // Page break check
          if (doc.y > doc.page.height - 100) {
            doc.addPage();
          }
        }
      }

      // ─── DESCRIPTION ────────────────────────────────────────────
      if (data.description) {
        doc.moveDown(1);

        // Page break check
        if (doc.y > doc.page.height - 180) {
          doc.addPage();
        }

        doc.fontSize(14).font("Helvetica-Bold");
        doc.text("Descripción");
        doc.moveDown(0.4);

        doc
          .moveTo(doc.page.margins.left, doc.y)
          .lineTo(doc.page.width - doc.page.margins.right, doc.y)
          .strokeColor(accentColor)
          .lineWidth(2)
          .stroke();
        doc.moveDown(0.5);

        doc.fontSize(10).font("Helvetica");
        doc.fillColor(darkColor).text(data.description, {
          width: pageWidth,
          align: "justify",
          lineGap: 4,
        });
      }

      // ─── FOOTER ─────────────────────────────────────────────────
      // Add footer on every page
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);

        // Footer line
        const footerY = doc.page.height - 45;
        doc
          .moveTo(doc.page.margins.left, footerY)
          .lineTo(doc.page.width - doc.page.margins.right, footerY)
          .strokeColor(accentColor)
          .lineWidth(1)
          .stroke();

        // Footer text
        doc.fontSize(8).font("Helvetica-Bold");
        doc.fillColor(accentColor).text(
          "iTools Perú - Distribuidor Autorizado",
          doc.page.margins.left,
          footerY + 8,
          { width: pageWidth, align: "center" }
        );

        doc.fontSize(7).font("Helvetica");
        doc.fillColor(grayColor).text(
          "Av. Carlos Izaguirre 988, Los Olivos, Lima | www.itools.pe | info@itools.pe",
          doc.page.margins.left,
          footerY + 22,
          { width: pageWidth, align: "center" }
        );

        // Page number
        doc.text(
          `Página ${i + 1} de ${pages.count}`,
          doc.page.margins.left,
          footerY + 32,
          { width: pageWidth, align: "center" }
        );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
