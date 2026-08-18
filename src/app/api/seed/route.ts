import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { brands, categories, products } from "@/lib/data";

const projectId = "kytfgk41";
const dataset = "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

export async function GET() {
  // Allow in production with valid secret, or always in development
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (process.env.NODE_ENV === 'production' && !token) {
    return NextResponse.json({ error: 'Missing SANITY_API_WRITE_TOKEN — cannot seed without write access' }, { status: 403 });
  }

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

    // 6. Promo Popup
    console.log("Seeding Promo Popup...");
    await client.createIfNotExists({
      _id: "promo-popup-1",
      _type: "promoPopup",
      title: "¡OFERTA EXCLUSIVA!",
      subtitle: "Hasta 25% de descuento en herramientas Milwaukee M18 FUEL. ¡Solo por tiempo limitado!",
      ctaText: "Ver Ofertas",
      ctaLink: "/categoria/herramientas-electricas",
      countdownEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    });

    // 7. Video Section
    console.log("Seeding Video Section...");
    await client.createIfNotExists({
      _id: "video-section-1",
      _type: "videoSection",
      sectionTitle: "iTools en Acción",
      sectionSubtitle: "Descubre nuestras herramientas en uso real — tutoriales, demostraciones y más",
      videos: [
        {
          _type: "videoItem",
          title: "Milwaukee M18 FUEL™ — Taladro Percutor en Obra",
          googleDriveUrl: "https://drive.google.com/file/d/1EXAMPLE_VIDEO_1/preview",
          order: 0,
        },
        {
          _type: "videoItem",
          title: "PACKOUT — Sistema Modular de Almacenamiento",
          googleDriveUrl: "https://drive.google.com/file/d/1EXAMPLE_VIDEO_2/preview",
          order: 1,
        },
        {
          _type: "videoItem",
          title: "DeWalt 20V MAX — Comparativa de Taladros",
          googleDriveUrl: "https://drive.google.com/file/d/1EXAMPLE_VIDEO_3/preview",
          order: 2,
        },
      ],
      order: 0,
      isActive: true,
    });

    // 8. PACKOUT Components
    console.log("Seeding PACKOUT Components...");
    const packoutItems = [
      { id: "packout-base-rolling", name: "Caja Rodante PACKOUT™ Grande", slug: "packout-rolling-large", componentType: "base", price: 499.90, dimensions: "56.2 x 40.6 x 48.3 cm", productId: "milwaukee-packout-rolling", order: 0 },
      { id: "packout-base-medium", name: "Caja Rodante PACKOUT™ Mediana", slug: "packout-rolling-medium", componentType: "base", price: 369.90, dimensions: "48.9 x 40.6 x 41.3 cm", productId: "milwaukee-packout-medium", order: 1 },
      { id: "packout-mod-organizer", name: "Organizador Modular PACKOUT™", slug: "packout-organizer", componentType: "stackable", price: 129.90, dimensions: "48.9 x 40.6 x 10.5 cm", compatibleBases: [], productId: "milwaukee-packout-organizer", order: 2 },
      { id: "packout-mod-box-small", name: "Caja de Herramientas PACKOUT™ Pequeña", slug: "packout-box-small", componentType: "stackable", price: 189.90, dimensions: "48.9 x 40.6 x 19.3 cm", compatibleBases: [], productId: "milwaukee-packout-box-small", order: 3 },
      { id: "packout-mod-box-large", name: "Caja de Herramientas PACKOUT™ Grande", slug: "packout-box-large", componentType: "stackable", price: 219.90, dimensions: "48.9 x 40.6 x 26.4 cm", compatibleBases: [], productId: "milwaukee-packout-box-large", order: 4 },
      { id: "packout-acc-side", name: "Bolsa Lateral PACKOUT™", slug: "packout-side-bag", componentType: "accessory", price: 89.90, dimensions: "32.4 x 12.1 x 28.6 cm", compatibleBases: ["packout-rolling-large", "packout-rolling-medium"], productId: "milwaukee-packout-side", order: 5 },
    ];
    for (const item of packoutItems) {
      await client.createIfNotExists({
        _id: item.id,
        _type: "packoutComponent",
        name: item.name,
        slug: { _type: "slug", current: item.slug },
        componentType: item.componentType,
        price: item.price,
        dimensions: item.dimensions,
        compatibleBases: item.compatibleBases || [],
        productId: item.productId,
        order: item.order,
        isActive: true,
      });
    }

    // 9. Product Reviews (sample)
    console.log("Seeding Product Reviews...");
    const sampleReviews = [
      { id: "review-1", productName: "taladro-percutor-m18-fuel", author: "Carlos Mendoza", rating: 5, title: "Potencia increíble", comment: "Lo uso todos los días en obra y la verdad es que supera cualquier taladro que he tenido. La batería dura bastante y el torque es brutal.", isVerified: true, source: "website", order: 0 },
      { id: "review-2", productName: "taladro-percutor-m18-fuel", author: "María García", rating: 4, title: "Excelente pero pesado", comment: "Muy buen rendimiento, aunque para trabajos encima de la cabeza se siente pesado. La calidad de Milwaukee es indiscutible.", isVerified: true, source: "website", order: 1 },
      { id: "review-3", productName: "taladro-percutor-m18-fuel", author: "Jorge Ramírez", rating: 5, title: "Best in class", comment: "No hay otro taladro inalámbrico que se le compare. Lo recomiendo 100%.", isVerified: false, source: "google", order: 2 },
      { id: "review-4", productName: "sierra-circular-m18-fuel", author: "Ana Torres", rating: 5, title: "Corta como butter", comment: "Corta madera como si fuera mantequilla. La batería M18 es compatible con todas mis herramientas.", isVerified: true, source: "website", order: 3 },
      { id: "review-5", productName: "sierra-circular-m18-fuel", author: "Luis Paredes", rating: 4, title: "Gran herramienta", comment: "Muy buena sierra. Solo le doy 4 estrellas porque me gustaría que viniera con una guía de corte.", isVerified: true, source: "website", order: 4 },
    ];
    for (const r of sampleReviews) {
      await client.createIfNotExists({
        _id: r.id,
        _type: "productReview",
        productName: r.productName,
        author: r.author,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        isVerified: r.isVerified,
        source: r.source,
        isActive: true,
        order: r.order,
      });
    }

    // 10. Update Deal Tiles with countdown
    console.log("Seeding Deal Tiles with countdown...");
    const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    const dealTiles = [
      { id: "deal-1", brand: "Milwaukee", brandColor: "#dd1e21", textColor: "#ffffff", title: "M18 FUEL™ Taladro Percutor", subtitle: "Hasta 25% OFF", href: "/producto/taladro-percutor-m18-fuel", countdownEnd: futureDate, order: 0, isActive: true },
      { id: "deal-2", brand: "DeWalt", brandColor: "#ffc107", textColor: "#000000", title: "20V MAX Sierra Circular", subtitle: "Precio especial", href: "/producto/sierra-circular-dewalt-20v", countdownEnd: futureDate, order: 1, isActive: true },
      { id: "deal-3", brand: "Bosch", brandColor: "#005691", textColor: "#ffffff", title: "Rotomartillo SDS-Plus", subtitle: "Solo esta semana", href: "/producto/rotomartillo-bosch-sds", countdownEnd: futureDate, order: 2, isActive: true },
    ];
    for (const d of dealTiles) {
      await client.createIfNotExists({
        _id: d.id,
        _type: "dealTile",
        brand: d.brand,
        brandColor: d.brandColor,
        textColor: d.textColor,
        title: d.title,
        subtitle: d.subtitle,
        href: d.href,
        countdownEnd: d.countdownEnd,
        order: d.order,
        isActive: d.isActive,
      });
    }

    return NextResponse.json({ success: true, message: "Migration completed with all new features!" });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
