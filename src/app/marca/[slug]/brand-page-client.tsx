"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight, CircleArrowRight, Wrench, Star, TrendingUp, Plus,
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product, Brand } from "@/types";

interface BrandTheme {
  color: string;
  textColor: string;
  tabs?: string[];
}

const brandCategories: Record<string, { name: string; count: string; icon: string }[]> = {
  milwaukee: [
    { name: "Herramientas eléctricas M18", count: "28.1K", icon: "drill" },
    { name: "Herramientas manuales", count: "18.7K", icon: "wrench" },
    { name: "Herramientas eléctricas M12", count: "17.7K", icon: "drill" },
    { name: "Packout", count: "13.1K", icon: "box" },
    { name: "Baterías y cargadores", count: "7.2K", icon: "battery" },
    { name: "Tubería", count: "4.7K", icon: "wrench" },
    { name: "Taladros de percusión", count: "4.6K", icon: "drill" },
    { name: "Kits combinados", count: "4.6K", icon: "box" },
    { name: "Llaves de impacto", count: "4.5K", icon: "wrench" },
    { name: "EPI y seguridad", count: "4.3K", icon: "shield" },
    { name: "Sierras", count: "2.3K", icon: "saw" },
  ],
};

const defaultBrandCategories = [
  { name: "Herramientas eléctricas", count: "15.2K", icon: "drill" },
  { name: "Herramientas manuales", count: "12.1K", icon: "wrench" },
  { name: "Baterías y cargadores", count: "8.4K", icon: "battery" },
  { name: "Kits combinados", count: "5.8K", icon: "box" },
  { name: "Accesorios", count: "9.3K", icon: "settings" },
  { name: "Almacenamiento", count: "6.1K", icon: "box" },
  { name: "Sierras", count: "3.7K", icon: "saw" },
  { name: "EPI y seguridad", count: "4.0K", icon: "shield" },
];

function BrandCategoryIcon({ type }: { type: string }) {
  const cls = "h-4 w-4";
  switch (type) {
    case "drill":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121" />
        </svg>
      );
    case "battery":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="6" y="4" width="12" height="18" rx="2" /><path d="M9 2h6" /><path d="M10 9h4M10 13h4M10 17h4" />
        </svg>
      );
    default:
      return <Wrench className={cls} />;
  }
}

function formatPrice(price: number): string {
  return `S/ ${price.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function BrandPageClient({
  brand,
  products,
  theme,
}: {
  brand: Brand;
  products: Product[];
  theme: BrandTheme;
}) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const cats = brandCategories[brand.slug] || defaultBrandCategories;
  const brandColor = theme.color;
  const textCol = theme.textColor;
  const isDark = textCol === "#FFF";

  return (
    <main className="min-h-screen bg-[#F5F6F8]">
      <div className="mx-auto max-w-[1440px] px-2.5 lg:px-4 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[#666] mb-4 flex-wrap">
          <Link href="/" className="hover:text-[#E35205] transition-colors">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-[#1A1A1A]">Herramientas {brand.name}</span>
        </nav>

        {/* ── 3-Column Layout (desktop) ── */}
        <div className="flex gap-3">
          {/* LEFT SIDEBAR — Brand categories */}
          <aside className="hidden lg:block w-[240px] xl:w-[260px] shrink-0">
            <div className="sticky top-[120px] bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
              {/* Header */}
              <div
                className="px-4 py-3 flex items-center gap-2"
                style={{ backgroundColor: brandColor, color: textCol }}
              >
                <Wrench className="h-4 w-4" />
                <h2 className="text-sm font-bold uppercase tracking-wide">
                  Herramientas {brand.name}
                </h2>
              </div>
              {/* Category list */}
              <ul className="divide-y divide-[#F0F0F0]">
                {cats.map((cat, i) => (
                  <li key={i}>
                    <Link
                      href={`/marca/${brand.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-[#F5F6F8] transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span style={{ color: brandColor }}>
                          <BrandCategoryIcon type={cat.icon} />
                        </span>
                        <span className="text-sm text-[#333] group-hover:text-[#E35205] transition-colors truncate">
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-[#999] bg-[#F0F0F0] px-1.5 py-0.5 rounded-full">
                          {cat.count}
                        </span>
                        <ChevronRight className="h-3 w-3 text-[#ccc] group-hover:text-[#E35205] transition-colors" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* CENTER COLUMN */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Brand promo banners */}
            <Link
              href={`/marca/${brand.slug}`}
              className="block relative overflow-hidden rounded-lg"
            >
              <div className="absolute inset-0" style={{ backgroundColor: brandColor }} />
              <div
                className="absolute inset-0"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.4) 100%)"
                    : "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)",
                }}
              />
              <div className="relative z-10 flex items-center justify-between px-6 py-8 md:py-12">
                <div className="max-w-md space-y-2">
                  <span className="font-impact text-2xl md:text-3xl" style={{ color: textCol }}>
                    MÁS {brand.name.toUpperCase()}, MÁS AHORROS
                  </span>
                  <p className="text-sm md:text-base" style={{ color: textCol, opacity: 0.85 }}>
                    Ofertas exclusivas en herramientas {brand.name}. Envío a todo Perú.
                  </p>
                  <span
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wide transition-all hover:scale-105"
                    style={{
                      backgroundColor: isDark ? "white" : "#1A1A1A",
                      color: isDark ? brandColor : textCol,
                    }}
                  >
                    COMPRAR AHORA
                    <CircleArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Two smaller promo banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <Link href={`/marca/${brand.slug}`} className="block relative overflow-hidden rounded-lg">
                <div className="absolute inset-0" style={{ backgroundColor: brandColor }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%)" }} />
                <div className="relative z-10 flex flex-col justify-between h-[160px] md:h-[200px] p-4">
                  <span className="text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: textCol, opacity: 0.85 }}>
                    {brand.name.toUpperCase()}
                  </span>
                  <div>
                    <p className="font-impact text-sm leading-tight mb-1" style={{ color: textCol }}>
                      PRODUCTO GRATUITO A ELECCIÓN
                    </p>
                    <p className="text-[10px] leading-relaxed mb-2" style={{ color: textCol, opacity: 0.8 }}>
                      Con un paquete de 2 baterías seleccionado.
                    </p>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded text-[11px] font-bold" style={{ backgroundColor: isDark ? "white" : "#1A1A1A", color: isDark ? brandColor : textCol }}>
                      COMPRAR AHORA <CircleArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
              <Link href={`/marca/${brand.slug}`} className="block relative overflow-hidden rounded-lg">
                <div className="absolute inset-0" style={{ backgroundColor: brandColor, filter: "brightness(0.85)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)" }} />
                <div className="relative z-10 flex flex-col justify-between h-[160px] md:h-[200px] p-4">
                  <span className="text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: textCol, opacity: 0.85 }}>
                    {brand.name.toUpperCase()}
                  </span>
                  <div>
                    <p className="font-impact text-sm leading-tight mb-1" style={{ color: textCol }}>
                      OFERTA DE BONIFICACIÓN POR BATERÍA
                    </p>
                    <p className="text-[10px] leading-relaxed mb-2" style={{ color: textCol, opacity: 0.8 }}>
                      Elige un artículo GRATIS con tu compra.
                    </p>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded text-[11px] font-bold" style={{ backgroundColor: isDark ? "white" : "#1A1A1A", color: isDark ? brandColor : textCol }}>
                      COMPRAR AHORA <CircleArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Products grid */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4" style={{ color: brandColor }} />
                <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">
                  Productos {brand.name}
                </h2>
                <span className="text-xs text-[#999]">({products.length})</span>
              </div>
              {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-8 text-center">
                  <p className="text-[#999] text-sm">
                    No hay productos de {brand.name} disponibles aún.
                  </p>
                  <Link
                    href="/"
                    className="inline-block mt-3 text-sm font-semibold hover:underline"
                    style={{ color: brandColor }}
                  >
                    Volver al inicio
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR — Featured products / Pipeline */}
          <aside className="hidden lg:block w-[280px] xl:w-[300px] shrink-0">
            <div className="sticky top-[120px] bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
              {/* Header */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: brandColor, color: textCol }}
              >
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <h2 className="text-sm font-bold uppercase tracking-wide">
                    PIPELINE
                  </h2>
                </div>
                <Link href={`/marca/${brand.slug}`} className="text-xs underline opacity-80">
                  Ver más
                </Link>
              </div>
              {/* Product cards */}
              <div>
                {(products.slice(0, 7)).map((product) => {
                  const discount = product.comparePrice
                    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                    : 0;
                  return (
                    <Link
                      key={product.id}
                      href={`/producto/${product.slug}`}
                      className="group flex gap-3 p-3 hover:bg-[#F5F6F8] transition-colors border-b border-[#F0F0F0] last:border-b-0"
                    >
                      <div className="shrink-0 w-16 h-16 rounded bg-[#F5F5F5] flex items-center justify-center border border-[#E8E8E8]">
                        <Wrench className="h-7 w-7 text-gray-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {discount > 0 && (
                          <span
                            className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded text-white mb-1"
                            style={{ backgroundColor: brandColor }}
                          >
                            -{discount}%
                          </span>
                        )}
                        <p className="text-xs leading-snug text-[#333] group-hover:text-[#E35205] transition-colors line-clamp-2 mb-1">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-1 mb-0.5">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-2.5 w-2.5 ${
                                  star <= Math.round(product.rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-gray-200 text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-[#999]">({product.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {product.comparePrice && (
                            <span className="text-[11px] text-[#999] line-through">
                              {formatPrice(product.comparePrice)}
                            </span>
                          )}
                          <span className="text-sm font-bold" style={{ color: brandColor }}>
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* ── Bottom Tabs ── */}
        {theme.tabs && theme.tabs.length > 0 && (
          <div className="mt-4 flex gap-0 overflow-x-auto rounded-lg border border-[#E0E0E0]" style={{ scrollbarWidth: "none" }}>
            {theme.tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(activeTab === tab ? null : tab)}
                className="shrink-0 px-4 py-3 text-xs font-bold uppercase tracking-wide transition-all border-r border-[#E0E0E0] last:border-r-0"
                style={{
                  backgroundColor: activeTab === tab ? brandColor : isDark ? "#1A1A1A" : "#F5F6F8",
                  color: activeTab === tab ? textCol : isDark ? (brandColor === "#1A1A1A" ? "#FFF" : brandColor) : brandColor,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}