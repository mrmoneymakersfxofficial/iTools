"use client";
import Link from "next/link";
import { ShoppingBag, ChevronRight, ImagePlus } from "lucide-react";

const brands = [
  { name: "Milwaukee", color: "#D1001C", textColor: "#FFF", slug: "milwaukee", products: "28.1K", fontStyle: "italic", logo: "/brands/milwaukee.svg" },
  { name: "DEWALT", color: "#FFD700", textColor: "#1A1A1A", slug: "dewalt", products: "22.4K", logo: "/brands/dewalt.svg" },
  { name: "BOSCH", color: "#005691", textColor: "#FFF", slug: "bosch", products: "19.6K", logo: "/brands/bosch.svg" },
  { name: "MAKITA", color: "#0077C8", textColor: "#FFF", slug: "makita", products: "24.5K", logo: "/brands/makita.svg" },
  { name: "STANLEY", color: "#E35205", textColor: "#FFF", slug: "stanley", products: "15.8K", logo: "/brands/stanley.svg" },
  { name: "3M", color: "#CC3300", textColor: "#FFF", slug: "3m", products: "12.4K", logo: "/brands/3m.svg" },
  { name: "HONDA", color: "#CC0000", textColor: "#FFF", slug: "honda", products: "8.9K", logo: "/brands/honda.svg" },
  { name: "KLEIN TOOLS", color: "#FFC220", textColor: "#1A1A1A", slug: "klein-tools", products: "14.2K", logo: "/brands/klein-tools.svg" },
  { name: "TORO", color: "#1A1A1A", textColor: "#CC0000", slug: "toro", products: "5.4K", logo: "/brands/toro.svg" },
  { name: "EGO", color: "#0d5c4a", textColor: "#FFF", slug: "ego", products: "5.7K", logo: "/brands/ego.svg" },
  { name: "metabo HPT", color: "#1b7a3a", textColor: "#FFF", slug: "metabo-hpt", products: "9.4K", logo: "/brands/metabo-hpt.svg" },
  { name: "FLEX", color: "#1A1A1A", textColor: "#FFF", slug: "flex", products: "12.6K", logo: "/brands/flex.svg" },
  { name: "STIHL", color: "#E35205", textColor: "#FFF", slug: "stihl", products: "8.4K", logo: "/brands/stihl.svg" },
  { name: "FEIN", color: "#666666", textColor: "#FFF", slug: "fein", products: "5.7K", logo: "/brands/fein.svg" },
  { name: "SKIL", color: "#CC0000", textColor: "#FFF", slug: "skil", products: "8.4K", logo: "/brands/skil.svg" },
  { name: "FESTOOL", color: "#1A1A1A", textColor: "#00A651", slug: "festool", products: "8.2K", logo: "/brands/festool.svg" },
  { name: "JET", color: "#CC0000", textColor: "#FFF", slug: "jet", products: "2.8K", logo: "/brands/jet.svg" },
  { name: "KNAACK", color: "#8B6914", textColor: "#FFF", slug: "knaack", products: "4.2K", logo: "/brands/knaack.svg" },
];

export function BrandsGridMobile() {
  return (
    <section className="bg-[#0A0A0A] py-3 lg:hidden" data-section="Comprar por Marca">
      <div className="mx-auto max-w-7xl px-2.5 sm:px-4">
        {/* Header with "Ver Todo" link */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#E35205]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              Comprar por Marca
            </h2>
          </div>
          <span className="text-[11px] text-[#E35205] font-semibold">18 MARCAS →</span>
        </div>

        {/* Horizontal scrolling brand cards */}
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
                className="shrink-0 w-[155px] sm:w-[170px] group relative overflow-hidden rounded-xl transition-all active:scale-[0.97] hover:shadow-md border border-[#222]"
                style={{ backgroundColor: brand.color }}
              >
                {/* Subtle pattern overlay */}
                <div
                  className="absolute inset-0 opacity-[0.05] pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 5px,
                      ${isLight ? "#000" : "#FFF"} 5px,
                      ${isLight ? "#000" : "#FFF"} 6px
                    )`,
                  }}
                />

                {/* Card content */}
                <div className="relative z-10 flex flex-col items-center justify-center px-3 pt-5 pb-3 min-h-[140px]">
                  {/* Logo area */}
                  <div className="flex items-center justify-center w-full h-[65px] mb-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-[55px] max-w-[120px] object-contain opacity-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <div className="hidden flex items-center justify-center">
                      <ImagePlus
                        className="h-5 w-5 opacity-25"
                        style={{ color: brand.textColor }}
                      />
                    </div>
                  </div>

                  {/* Brand name */}
                  <p
                    className="text-xs sm:text-sm font-black uppercase tracking-wider leading-tight text-center"
                    style={{ color: brand.textColor, fontStyle: brand.fontStyle || "normal" }}
                  >
                    {brand.name}
                  </p>
                  {/* Product count */}
                  <p
                    className="text-[10px] mt-0.5 font-medium opacity-60 text-center"
                    style={{ color: brand.textColor }}
                  >
                    {brand.products} productos
                  </p>
                </div>

                {/* Bottom CTA strip */}
                <div className="relative z-10 bg-black/20 px-3 py-2 flex items-center justify-between">
                  <span className="text-[10px] text-white/70 font-medium uppercase tracking-wide">
                    Ver tienda
                  </span>
                  <ChevronRight
                    className="h-3.5 w-3.5 text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all"
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