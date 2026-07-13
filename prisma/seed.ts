import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-require-imports
// Import static data – tsx resolves TS paths & type-only imports are erased at runtime
const { brands, categories, products } = require("../src/lib/data") as {
  brands: Array<{
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    featured: boolean;
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    image: string | null;
    icon: string | null;
    order: number;
    children?: Array<{
      id: string;
      name: string;
      slug: string;
      parentId: string;
      image: string | null;
      icon: string | null;
      order: number;
    }>;
  }>;
  products: Array<{
    id: string;
    sku: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: number;
    comparePrice: number | null;
    costPrice?: number;
    categoryId: string;
    brandId: string;
    brand?: { id: string; name: string; slug: string };
    category?: { id: string; name: string; slug: string };
    stock: number;
    lowStockAlert?: number;
    images: string[];
    specs: Record<string, string>;
    rating: number;
    reviewCount: number;
    technicalSheetUrl?: string | null;
    videoUrl?: string | null;
    isFeatured: boolean;
    isOnSale: boolean;
    isNewArrival: boolean;
    isPublished?: boolean;
    metaTitle?: string | null;
    metaDescription?: string | null;
  }>;
};

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── Clean existing data (reverse dependency order) ──────────
  console.log("🗑  Cleaning existing data...");
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // ── 1. Seed Brands ─────────────────────────────────────────
  console.log("\n📦 Seeding brands...");
  for (const b of brands) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, logo: b.logo, featured: b.featured },
      create: { id: b.id, name: b.name, slug: b.slug, logo: b.logo, featured: b.featured },
    });
  }
  console.log(`   ✅ ${brands.length} brands seeded`);

  // ── 2. Seed Categories (parents first, then children) ──────
  console.log("\n📦 Seeding categories...");

  const parentCategories = categories.filter((c) => !c.parentId);
  const childCategories = categories.flatMap((c) => c.children ?? []);

  // Seed parents
  for (const c of parentCategories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, image: c.image, icon: c.icon, order: c.order },
      create: { id: c.id, name: c.name, slug: c.slug, image: c.image, icon: c.icon, order: c.order },
    });
  }
  console.log(`   ✅ ${parentCategories.length} parent categories seeded`);

  // Seed children
  for (const c of childCategories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, parentId: c.parentId, image: c.image, icon: c.icon, order: c.order },
      create: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        parentId: c.parentId,
        image: c.image,
        icon: c.icon,
        order: c.order,
      },
    });
  }
  console.log(`   ✅ ${childCategories.length} child categories seeded`);

  // ── 3. Seed Products ──────────────────────────────────────
  console.log("\n📦 Seeding products...");
  let productCount = 0;
  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription,
        price: p.price,
        comparePrice: p.comparePrice,
        costPrice: p.costPrice ?? null,
        categoryId: p.categoryId,
        brandId: p.brandId,
        stock: p.stock,
        lowStockAlert: p.lowStockAlert ?? 5,
        images: JSON.stringify(p.images),
        specs: JSON.stringify(p.specs),
        rating: p.rating,
        reviewCount: p.reviewCount,
        technicalSheetUrl: p.technicalSheetUrl ?? null,
        videoUrl: p.videoUrl ?? null,
        isFeatured: p.isFeatured,
        isOnSale: p.isOnSale,
        isNewArrival: p.isNewArrival,
        isPublished: p.isPublished ?? true,
        metaTitle: p.metaTitle ?? null,
        metaDescription: p.metaDescription ?? null,
      },
      create: {
        id: p.id,
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription,
        price: p.price,
        comparePrice: p.comparePrice,
        costPrice: p.costPrice ?? null,
        categoryId: p.categoryId,
        brandId: p.brandId,
        stock: p.stock,
        lowStockAlert: p.lowStockAlert ?? 5,
        images: JSON.stringify(p.images),
        specs: JSON.stringify(p.specs),
        rating: p.rating,
        reviewCount: p.reviewCount,
        technicalSheetUrl: p.technicalSheetUrl ?? null,
        videoUrl: p.videoUrl ?? null,
        isFeatured: p.isFeatured,
        isOnSale: p.isOnSale,
        isNewArrival: p.isNewArrival,
        isPublished: p.isPublished ?? true,
        metaTitle: p.metaTitle ?? null,
        metaDescription: p.metaDescription ?? null,
      },
    });
    productCount++;
  }
  console.log(`   ✅ ${productCount} products seeded`);

  // ── 4. Seed default admin user ────────────────────────────
  console.log("\n👤 Seeding admin user...");
  // Placeholder bcrypt hash for "admin123" – this is development only
  // Real hash would be generated with: bcrypt.hash("admin123", 12)
  const adminPasswordHash =
    "$2b$12$_placeholder_dev_only_hash_do_not_use_in_production";
  await prisma.user.upsert({
    where: { email: "admin@itools.pe" },
    update: { name: "Admin", role: "ADMIN", passwordHash: adminPasswordHash },
    create: {
      email: "admin@itools.pe",
      name: "Admin",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
  });
  console.log("   ✅ Admin user seeded (admin@itools.pe)");

  // ── 5. Seed default coupon ────────────────────────────────
  console.log("\n🏷️  Seeding coupon...");
  await prisma.coupon.upsert({
    where: { code: "ITOOLS10" },
    update: {
      type: "PERCENTAGE",
      value: 10,
      minOrder: 100,
      isActive: true,
    },
    create: {
      code: "ITOOLS10",
      type: "PERCENTAGE",
      value: 10,
      minOrder: 100,
      isActive: true,
    },
  });
  console.log("   ✅ Coupon ITOOLS10 seeded (10% off, min S/100)");

  // ── Summary ───────────────────────────────────────────────
  console.log("\n" + "═".repeat(50));
  console.log("  SEED COMPLETE");
  console.log("═".repeat(50));
  console.log(`  Brands:         ${brands.length}`);
  console.log(`  Categories:     ${parentCategories.length} parents + ${childCategories.length} children = ${parentCategories.length + childCategories.length} total`);
  console.log(`  Products:       ${productCount}`);
  console.log(`  Admin User:     1`);
  console.log(`  Coupons:        1`);
  console.log("═".repeat(50) + "\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });