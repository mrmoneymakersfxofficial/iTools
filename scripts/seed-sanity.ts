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
    console.log(`Mutation successful!`);
  }
}

async function migrateData() {
  console.log("Starting pure fetch migration to Sanity...");

  try {
    // Header config
    console.log("Migrating headerConfig...");
    await sanityMutate([
      {
        createOrReplace: {
          _id: "headerConfig",
          _type: "headerConfig",
          phone: "987 654 321",
          phoneUrl: "tel:987654321",
          location: "Av. Principal 123",
          badge1: "Garantía Oficial",
          badge2: "Envío Gratis a todo el Perú",
          announcementBar: "¡ENVÍO GRATIS A TODO EL PERÚ EN COMPRAS MAYORES A S/ 500!",
        },
      },
    ]);

    // Footer config
    console.log("Migrating footerConfig...");
    await sanityMutate([
      {
        createOrReplace: {
          _id: "footerConfig",
          _type: "footerConfig",
          aboutText: "Somos iTools Perú, tu distribuidor oficial de herramientas Milwaukee.",
          companyAddress: "Av. Principal 123, Lima",
          companyPhone: "+51 987 654 321",
          companyEmail: "ventas@itools.pe",
          workingHours: "Lunes a Viernes: 8:00 AM - 6:00 PM",
        },
      },
    ]);

    // Deals
    console.log("Migrating deals...");
    const dealTilesData = [
      { id: "d1", brand: "Milwaukee", brandColor: "#DB001C", textColor: "#FFFFFF", title: "Hasta 20% dscto. en M18 FUEL", subtitle: "Promoción válida hasta agotar stock", href: "/marca/milwaukee" },
      { id: "d2", brand: "DeWalt", brandColor: "#F2C75C", textColor: "#000000", title: "Combos 20V MAX", subtitle: "Incluyen baterías y cargador", href: "/marca/dewalt" },
      { id: "d3", brand: "Makita", brandColor: "#008B8B", textColor: "#FFFFFF", title: "Especial LXT 18V", subtitle: "Herramientas seleccionadas", href: "/marca/makita" }
    ];

    for (const deal of dealTilesData) {
      await sanityMutate([{
        createOrReplace: {
          _id: deal.id,
          _type: "dealTile",
          brand: deal.brand,
          brandColor: deal.brandColor,
          textColor: deal.textColor,
          title: deal.title,
          subtitle: deal.subtitle,
          href: deal.href,
        }
      }]);
    }

    console.log("Migration completed!");
  } catch (err) {
    console.error("Migration failed", err);
  }
}

migrateData();
