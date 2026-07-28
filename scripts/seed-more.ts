import { brands, categories, products } from "../src/lib/data";

const projectId = "kytfgk41";
const dataset = "production";
const apiVersion = "2024-01-01";
const token = "sk3TVifNMJi9ejiLQAy21tNpb1yvd2G517OP8TLjFn8hT388sfLeHbQKQU1E1lOm1tHdsWU5MLfSorsMQHoeAVGq5GhQ9jvrnXUsTaCi23MiBHkTZ73iv6rQdr5jfNdKsi5AgUUA5lkI5roaO66SojhlQpNdDnGM37qXWHlQq0nCWRdma9x6";

async function sanityMutate(mutations: any[]) {
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Mutation failed: ${response.status} ${response.statusText}`, error);
  } else {
    // console.log(`Mutation successful!`);
  }
}

async function migrateMoreData() {
  console.log("Migrating Banners...");
  const heroBanners = [
    { id: "hero-1", title: "Rendimiento FUEL™ M18", subtitle: "Potencia sin límites para profesionales", buttonText: "Comprar M18 FUEL", link: "/categoria/herramientas-electricas" },
    { id: "hero-2", title: "Nuevos Rotomartillos", subtitle: "Perfora más rápido con SDS-Plus", buttonText: "Ver Catálogo", link: "/categoria/rotomartillos" }
  ];
  for (const [index, h] of heroBanners.entries()) {
    await sanityMutate([{
      createOrReplace: {
        _id: h.id,
        _type: "heroSlide",
        title: h.title,
        subtitle: h.subtitle,
        buttonText: h.buttonText,
        link: h.link,
        isActive: true,
        order: index + 1,
      }
    }]);
  }

  console.log("Migrating Brands...");
  for (const [index, b] of brands.entries()) {
    await sanityMutate([{
      createOrReplace: {
        _id: `brand-${b.slug}`,
        _type: "brandShowcaseItem",
        name: b.name,
        slug: { _type: "slug", current: b.slug },
        showInGrid: true,
        isActive: true,
        order: index + 1,
      }
    }]);
  }

  console.log("Migrating Categories...");
  for (const c of categories) {
    await sanityMutate([{
      createOrReplace: {
        _id: `category-${c.slug}`,
        _type: "category",
        title: c.name,
        slug: { _type: "slug", current: c.slug },
      }
    }]);
  }

  console.log("Migrating Products...");
  for (const p of products) {
    await sanityMutate([{
      createOrReplace: {
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
      }
    }]);
  }
  
  await sanityMutate([{
      createOrReplace: {
        _id: "giveaway-1", 
        _type: "giveawayBanner", 
        isActive: true, 
        heading: "Sorteo del Mes", 
        preTitle: "¡Participa y Gana!", 
        prize: "Kit M18 FUEL Taladro + Atornillador", 
        ctaText: "Ver Bases y Condiciones", 
        ctaLink: "/sorteo", 
        smsText: "O envía", 
        smsKeyword: "MILWAUKEE", 
        smsNumber: "al 7778", 
        finePrint: "Sorteo válido hasta fin de mes. Aplican T&C."
      }
  }]);

  console.log("Migration completed!");
}

migrateMoreData();
