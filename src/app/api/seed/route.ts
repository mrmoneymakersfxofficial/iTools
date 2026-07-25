import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { brands, categories, products } from "@/lib/data";

const projectId = "kytfgk41";
const dataset = "production";
const token = "sk3TVifNMJi9ejiLQAy21tNpb1yvd2G517OP8TLjFn8hT388sfLeHbQKQU1E1lOm1tHdsWU5MLfSorsMQHoeAVGq5GhQ9jvrnXUsTaCi23MiBHkTZ73iv6rQdr5jfNdKsi5AgUUA5lkI5roaO66SojhlQpNdDnGM37qXWHlQq0nCWRdma9x6";

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

export async function GET() {
  console.log("Seeding Sanity...");

  try {
    // 1. Marcas (brandShowcaseItem)
    console.log("Migrating Brands...");
    for (const [index, b] of brands.entries()) {
      await client.createIfNotExists({
        _id: `brand-${b.slug}`,
        _type: "brandShowcaseItem",
        name: b.name,
        slug: { _type: "slug", current: b.slug },
        showInGrid: true,
        isActive: true,
        order: index + 1,
      });
    }

    // 2. Categories
    console.log("Migrating Categories...");
    for (const c of categories) {
      await client.createIfNotExists({
        _id: `category-${c.slug}`,
        _type: "category",
        title: c.name,
        slug: { _type: "slug", current: c.slug },
      });
    }

    // 3. Products
    console.log("Migrating Products...");
    for (const p of products) {
      await client.createIfNotExists({
        _id: `product-${p.slug}`,
        _type: "product",
        name: p.name,
        slug: { _type: "slug", current: p.slug },
        sku: p.sku,
        description: p.description,
        shortDescription: p.shortDescription,
        price: p.price,
        salePrice: p.comparePrice ? p.price : undefined,
        isActive: true,
        showInTrending: p.isFeatured,
        showInToolCrib: true,
        showInFeatured: p.isFeatured,
        showInNewArrivals: p.isNewArrival,
        rating: p.rating,
        reviews: p.reviewCount,
      });
    }

    // 4. Hero Banners
    console.log("Migrating Hero Banners...");
    const heroBanners = [
      { id: "hero-1", title: "Rendimiento FUEL™ M18", subtitle: "Potencia sin límites para profesionales", buttonText: "Comprar M18 FUEL", link: "/categoria/herramientas-electricas" },
      { id: "hero-2", title: "Nuevos Rotomartillos", subtitle: "Perfora más rápido con SDS-Plus", buttonText: "Ver Catálogo", link: "/categoria/rotomartillos" }
    ];
    for (const [index, h] of heroBanners.entries()) {
      await client.createIfNotExists({
        _id: h.id,
        _type: "heroSlide",
        title: h.title,
        subtitle: h.subtitle,
        buttonText: h.buttonText,
        link: h.link,
        isActive: true,
        order: index + 1,
      });
    }

    // 5. Home Settings
    console.log("Migrating Home Settings...");
    await client.createIfNotExists({
      _id: "homeSettings",
      _type: "homeSettings",
      seoTitle: "iTools Perú | Herramientas Milwaukee",
      seoDescription: "Distribuidor autorizado de herramientas Milwaukee en Perú.",
    });

    return NextResponse.json({ success: true, message: "Migration completed!" });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
