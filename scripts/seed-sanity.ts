import { createClient } from "next-sanity";
import { brands, categories, products } from "../src/lib/data";

const projectId = "kytfgk41";
const dataset = "production";
const token = "sk3TVifNMJi9ejiLQAy21tNpb1yvd2G517OP8TLjFn8hT388sfLeHbQKQU1E1lOm1tHdsWU5MLfSorsMQHoeAVGq5GhQ9jvrnXUsTaCi23MiBHkTZ73iv6rQdr5jfNdKsi5AgUUA5lkI5roaO66SojhlQpNdDnGM37qXWHlQq0nCWRdma9x6";

if (!projectId || !token) {
  console.error("Missing SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

async function seed() {
  console.log("Seeding Sanity...");

  // 1. Marcas (brandShowcaseItem)
  console.log("Migrating Brands...");
  for (const [index, b] of brands.entries()) {
    try {
      await client.createIfNotExists({
        _id: `brand-${b.slug}`,
        _type: "brandShowcaseItem",
        name: b.name,
        slug: { _type: "slug", current: b.slug },
        showInGrid: true,
        isActive: true,
        order: index + 1,
      });
      console.log(`Created brand: ${b.name}`);
    } catch (err) {
      console.error(`Failed to create brand: ${b.name}`, err);
    }
  }

  // 2. Categories
  console.log("Migrating Categories...");
  for (const c of categories) {
    try {
      await client.createIfNotExists({
        _id: `category-${c.slug}`,
        _type: "category",
        title: c.name,
        slug: { _type: "slug", current: c.slug },
      });
      console.log(`Created category: ${c.name}`);
    } catch (err) {
      console.error(`Failed to create category: ${c.name}`, err);
    }
  }

  // 3. Products
  console.log("Migrating Products...");
  for (const p of products) {
    try {
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
      console.log(`Created product: ${p.name}`);
    } catch (err) {
      console.error(`Failed to create product: ${p.name}`, err);
    }
  }

  // 4. Hero Banners
  console.log("Migrating Hero Banners...");
  const heroBanners = [
    { id: "hero-1", title: "Rendimiento FUEL™ M18", subtitle: "Potencia sin límites para profesionales", buttonText: "Comprar M18 FUEL", link: "/categoria/herramientas-electricas" },
    { id: "hero-2", title: "Nuevos Rotomartillos", subtitle: "Perfora más rápido con SDS-Plus", buttonText: "Ver Catálogo", link: "/categoria/rotomartillos" }
  ];
  for (const [index, h] of heroBanners.entries()) {
    try {
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
    } catch (err) {}
  }

  // 5. Home Settings
  console.log("Migrating Home Settings...");
  try {
    await client.createIfNotExists({
      _id: "homeSettings",
      _type: "homeSettings",
      seoTitle: "iTools Perú | Herramientas Milwaukee",
      seoDescription: "Distribuidor autorizado de herramientas Milwaukee en Perú.",
    });
    console.log("Created homeSettings");
  } catch (err) {}

  // 6. Deal Tiles
  console.log("Migrating Deal Tiles...");
  const dealTilesData = [
    { id: "d1", brand: "Milwaukee", brandColor: "#DB001C", textColor: "#FFFFFF", title: "18V LXT", subtitle: "15% de descuento adicional en kits seleccionados.", href: "/marca/milwaukee" },
    { id: "d2", brand: "DeWalt", brandColor: "#F3C51A", textColor: "#000000", title: "20V MAX", subtitle: "Combos con batería y cargador al mejor precio.", href: "/marca/dewalt" },
    { id: "d3", brand: "Makita", brandColor: "#008B8B", textColor: "#FFFFFF", title: "40V XGT", subtitle: "Nueva generación de potencia inalámbrica.", href: "/marca/makita" }
  ];
  for (const [index, d] of dealTilesData.entries()) {
    try {
      await client.createIfNotExists({
        _id: d.id, _type: "dealTile", brand: d.brand, brandColor: d.brandColor, textColor: d.textColor, title: d.title, subtitle: d.subtitle, href: d.href, isActive: true, order: index + 1,
      });
    } catch (err) {}
  }

  // 7. Giveaway Banner
  console.log("Migrating Giveaway Banner...");
  try {
    await client.createIfNotExists({
      _id: "giveaway-1", _type: "giveawayBanner", isActive: true, heading: "Sorteo del Mes", preTitle: "¡Participa y Gana!", prize: "Kit M18 FUEL Taladro + Atornillador", ctaText: "Ver Bases y Condiciones", ctaLink: "/sorteo", smsText: "O envía", smsKeyword: "MILWAUKEE", smsNumber: "al 7778", finePrint: "Sorteo válido hasta fin de mes. Aplican T&C.",
    });
  } catch (err) {}

  // 8. Promo Banners
  console.log("Migrating Promo Banners...");
  const promoBannersData = [
    { id: "promo-1", title: "Liquidación", headline: "Hasta 40% OFF", description: "En herramientas seleccionadas de temporadas anteriores.", ctaText: "Ver Ofertas", link: "/ofertas", order: 1 },
    { id: "promo-2", title: "Nuevos Ingresos", headline: "Línea M12 FUEL", description: "Descubre la nueva generación de herramientas compactas.", ctaText: "Comprar Ahora", link: "/nuevos-ingresos", order: 2 }
  ];
  for (const p of promoBannersData) {
    try {
      await client.createIfNotExists({
        _id: p.id, _type: "promoBanner", isActive: true, title: p.title, headline: p.headline, description: p.description, ctaText: p.ctaText, link: p.link, order: p.order,
      });
    } catch (err) {}
  }

  // 9. Section Headers
  console.log("Migrating Section Headers...");
  const headers = [
    { id: "sh-1", sectionId: "featured", title: "Herramientas Destacadas", subtitle: "Las favoritas por los profesionales." },
    { id: "sh-2", sectionId: "new-arrivals", title: "Nuevos Ingresos", subtitle: "Lo último en tecnología y potencia." }
  ];
  for (const h of headers) {
    try {
      await client.createIfNotExists({ _id: h.id, _type: "sectionHeader", sectionId: h.sectionId, title: h.title, subtitle: h.subtitle });
    } catch (err) {}
  }

  // 10. Trending Categories
  console.log("Migrating Trending Categories...");
  const tcats = [
    { slug: "herramientas-electricas", name: "Eléctricas", iconType: "Zap", viewCount: "18.8K", order: 1 },
    { slug: "herramientas-manuales", name: "Manuales", iconType: "Wrench", viewCount: "12.4K", order: 2 },
    { slug: "accesorios", name: "Accesorios", iconType: "Package", viewCount: "9.2K", order: 3 },
  ];
  for (const tc of tcats) {
    try {
      await client.createIfNotExists({ _id: `tc-${tc.slug}`, _type: "trendingCategory", isActive: true, name: tc.name, slug: { _type: "slug", current: tc.slug }, iconType: tc.iconType, viewCount: tc.viewCount, order: tc.order });
    } catch(err) {}
  }

  // 11. Header & Footer Configs
  console.log("Migrating Header & Footer Configs...");
  try {
    await client.createIfNotExists({
      _id: "headerConfig-main", _type: "headerConfig", phone: "01 234 5678", phoneUrl: "tel:+5112345678", location: "Lima, Perú", badge1: "Servicio Técnico Oficial", badge2: "Envío a todo Perú"
    });
    await client.createIfNotExists({
      _id: "footerConfig-main", _type: "footerConfig", aboutText: "Somos iTools Perú, distribuidores autorizados de las mejores marcas de herramientas. Nuestro compromiso es ofrecer productos de alta calidad y un servicio excepcional a los profesionales de todo el país.", contactInfo: { address: "Av. Industrial 1234, Lima", phone: "+51 987 654 321", email: "ventas@itools.pe", hours: "Lun - Vie: 8am - 6pm" }
    });
  } catch (err) {}

  console.log("Migration completed!");
}

seed().catch(console.error);
