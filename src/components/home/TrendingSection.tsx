"use client";

import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Wrench,
  Settings,
  Scissors,
  Disc,
  Hammer,
  Trees,
  Shield,
  Package,
  HardHat,
  Ruler,
  TrendingUp,
  Flame,
} from "lucide-react";
import { categories, products } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";

/* ── Icon mapping for categories ── */
const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="h-4 w-4" />,
  Wrench: <Wrench className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />,
  Scissors: <Scissors className="h-4 w-4" />,
  Disc: <Disc className="h-4 w-4" />,
  Hammer: <Hammer className="h-4 w-4" />,
  Trees: <Trees className="h-4 w-4" />,
  Shield: <Shield className="h-4 w-4" />,
  Package: <Package className="h-4 w-4" />,
  HardHat: <HardHat className="h-4 w-4" />,
  Ruler: <Ruler className="h-4 w-4" />,
};

/* ── Trending categories data ── */
const trendingCategories = [
  { name: "Taladros", slug: "taladros", icon: "Zap", count: 12 },
  { name: "Atornilladores", slug: "atornilladores", icon: "Settings", count: 8 },
  { name: "Sierras", slug: "sierras", icon: "Scissors", count: 6 },
  { name: "Rotomartillos", slug: "rotomartillos", icon: "Hammer", count: 5 },
  { name: "Esmeriladoras", slug: "esmeriladoras", icon: "Disc", count: 4 },
  { name: "Baterías y Cargadores", slug: "baterias-cargadores", icon: "Zap", count: 7 },
  { name: "Accesorios", slug: "accesorios-herramientas", icon: "Package", count: 15 },
  { name: "Almacenamiento", slug: "almacenamiento-herramientas", icon: "HardHat", count: 6 },
];

/**
 * Side-by-side layout: Trending Categories (left) + Trending Products (right)
 * Matches Acme's layout pattern.
 */
export function TrendingSection() {
  /* Pick 4 trending products (on sale or featured) */
  const trendingProducts = products
    .filter((p) => p.isOnSale || p.isFeatured)
    .slice(0, 4);

  return (
    <section
      className="bg-white py-6 md:py-8"
      data-section="Tendencias"
      aria-label="Categorías de tendencia y productos de moda"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* ── LEFT: Trending Categories ── */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-[#E35205]" />
              <h2 className="text-lg md:text-xl font-impact text-[#1A1A1A]">
                Categor&iacute;as de Tendencia
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {trendingCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className="group flex items-center gap-2.5 bg-[#F5F6F8] hover:bg-[#E8EDF2] rounded-lg px-3.5 py-3 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-[#0A2A44] flex items-center justify-center text-white">
                    {iconMap[cat.icon] || <Wrench className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#E35205] transition-colors truncate">
                      {cat.name}
                    </p>
                    <p className="text-[11px] text-[#999]">{cat.count} productos</p>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/categoria/herramientas-electricas"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#E35205] hover:underline"
            >
              Ver todas las categorías <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* ── RIGHT: Trending Products ── */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-[#CC3300]" />
              <h2 className="text-lg md:text-xl font-impact text-[#1A1A1A]">
                Productos de Moda
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {trendingProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            <Link
              href="/categoria/herramientas-electricas"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#E35205] hover:underline"
            >
              Ver todos los productos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}