"use client";
import Link from "next/link";
import { ShoppingBag, ChevronRight, Wrench } from "lucide-react";

const brands = [
  { name: "Milwaukee", color: "#D1001C", textColor: "#FFF", slug: "milwaukee", products: "28.1K", fontStyle: "italic" },
  { name: "DEWALT", color: "#FFD700", textColor: "#1A1A1A", slug: "dewalt", products: "22.4K" },
  { name: "BOSCH", color: "#005691", textColor: "#FFF", slug: "bosch", products: "19.6K" },
  { name: "MAKITA", color: "#0077C8", textColor: "#FFF", slug: "makita", products: "24.5K" },
  { name: "STANLEY", color: "#E35205", textColor: "#FFF", slug: "stanley", products: "15.8K" },
  { name: "3M", color: "#CC3300", textColor: "#FFF", slug: "3m", products: "12.4K" },
  { name: "HONDA", color: "#CC0000", textColor: "#FFF", slug: "honda", products: "8.9K" },
  { name: "KLEIN TOOLS", color: "#FFC220", textColor: "#1A1A1A", slug: "klein-tools", products: "14.2K" },
  { name: "TORO", color: "#1A1A1A", textColor: "#CC0000", slug: "toro", products: "5.4K" },
  { name: "EGO", color: "#0d5c4a", textColor: "#FFF", slug: "ego", products: "5.7K" },
  { name: "metabo HPT", color: "#1b7a3a", textColor: "#FFF", slug: "metabo-hpt", products: "9.4K" },
  { name: "FLEX", color: "#1A1A1A", textColor: "#FFF", slug: "flex", products: "12.6K" },
  { name: "STIHL", color: "#E35205", textColor: "#FFF", slug: "stihl", products: "8.4K" },
  { name: "FEIN", color: "#666666", textColor: "#FFF", slug: "fein", products: "5.7K" },
  { name: "SKIL", color: "#CC0000", textColor: "#FFF", slug: "skil", products: "8.4K" },
  { name: "FESTOOL", color: "#1A1A1A", textColor: "#00A651", slug: "festool", products: "8.2K" },
  { name: "JET", color: "#CC0000", textColor: "#FFF", slug: "jet", products: "2.8K" },
  { name: "KNAACK", color: "#8B6914", textColor: "#FFF", slug: "knaack", products: "4.2K" },
];

export function BrandsGridMobile() {
  return (
    <section className="bg-[#F5F6F8] dark:bg-[#1a1a1a] py-3 lg:hidden" data-section="Comprar por Marca">
      <div className="mx-auto max-w-7xl px-2.5 sm:px-4">
        {/* Header with "Ver Todo" link */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#E35205]" />
            <h2 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wide">
              Comprar por Marca
            </h2>
          </div>
          <span className="text-[11px] text-[#E35205] font-semibold">18 MARCAS →</span>
        </div>

        {/* Horizontal scrolling brand cards — Acme Tools style */}
        <nav
          className="flex gap-2.5 overflow-x-auto pb-1 -mx-2.5 px-2.5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {brands.map((brand) => {
            const isLight = brand.textColor !== "#FFF" && brand.textColor !== "#00A651";
            return (
              <Link
                key={brand.slug}
                href={`/marca/${brand.slug}`}
                className="shrink-0 w-[140px] sm:w-[160px] group relative overflow-hidden rounded-xl transition-all active:scale-[0.97] hover:shadow-md border border-[#E0E0E0] dark:border-[#333]"
              >
                {/* Brand color header area */}
                <div
                  className="relative px-3 pt-4 pb-3"
                  style={{ backgroundColor: brand.color }}
                >
                  {/* Subtle pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 4px,
                        ${isLight ? "#000" : "#FFF"} 4px,
                        ${isLight ? "#000" : "#FFF"} 5px
                      )`,
                    }}
                  />
                  <div className="relative z-10">
                    {/* Brand name */}
                    <p
                      className="text-sm sm:text-base font-black uppercase tracking-wider leading-tight"
                      style={{ color: brand.textColor, fontStyle: brand.fontStyle || "normal" }}
                    >
                      {brand.name}
                    </p>
                    {/* Product count */}
                    <p
                      className="text-[10px] mt-1 font-medium opacity-75"
                      style={{ color: brand.textColor }}
                    >
                      {brand.products} productos
                    </p>
                  </div>
                </div>
                {/* White bottom area with CTA */}
                <div className="bg-white dark:bg-[#111111] px-3 py-2.5 flex items-center justify-between">
                  <span className="text-[10px] text-[#666] dark:text-gray-300 dark:text-gray-500 font-medium uppercase tracking-wide">
                    Ver tienda
                  </span>
                  <ChevronRight
                    className="h-3.5 w-3.5 text-[#999] dark:text-gray-400 group-hover:text-[#E35205] group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}