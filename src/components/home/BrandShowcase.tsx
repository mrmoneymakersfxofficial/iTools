"use client";

import Link from "next/link";
import { ShoppingBag, ImagePlus } from "lucide-react";

const brands = [
  { name: "Milwaukee", color: "#D1001C", textColor: "#FFF", slug: "milwaukee", fontStyle: "italic", logo: "/brands/milwaukee.svg" },
  { name: "BOSCH", color: "#005691", textColor: "#FFF", slug: "bosch", logo: "/brands/bosch.svg" },
  { name: "HONDA", color: "#CC0000", textColor: "#FFF", slug: "honda", logo: "/brands/honda.svg" },
  { name: "KLEIN TOOLS", color: "#FFC220", textColor: "#1A1A1A", slug: "klein-tools", logo: "/brands/klein-tools.svg" },
  { name: "TORO", color: "#1A1A1A", textColor: "#CC0000", slug: "toro", logo: "/brands/toro.svg" },
  { name: "DEWALT", color: "#FFD700", textColor: "#1A1A1A", slug: "dewalt", logo: "/brands/dewalt.svg" },
  { name: "EGO", color: "#0d5c4a", textColor: "#FFF", slug: "ego", logo: "/brands/ego.svg" },
  { name: "MAKITA", color: "#0077C8", textColor: "#FFF", slug: "makita", logo: "/brands/makita.svg" },
  { name: "metabo HPT", color: "#1b7a3a", textColor: "#FFF", slug: "metabo-hpt", logo: "/brands/metabo-hpt.svg" },
  { name: "FLEX", color: "#1A1A1A", textColor: "#FFF", slug: "flex", logo: "/brands/flex.svg" },
  { name: "STIHL", color: "#E35205", textColor: "#FFF", slug: "stihl", logo: "/brands/stihl.svg" },
  { name: "FEIN", color: "#666666", textColor: "#FFF", slug: "fein", logo: "/brands/fein.svg" },
  { name: "STANLEY", color: "#E35205", textColor: "#FFF", slug: "stanley", logo: "/brands/stanley.svg" },
  { name: "3M", color: "#CC3300", textColor: "#FFF", slug: "3m", logo: "/brands/3m.svg" },
  { name: "SKIL", color: "#CC0000", textColor: "#FFF", slug: "skil", logo: "/brands/skil.svg" },
  { name: "FESTOOL", color: "#1A1A1A", textColor: "#00A651", slug: "festool", logo: "/brands/festool.svg" },
  { name: "JET", color: "#CC0000", textColor: "#FFF", slug: "jet", logo: "/brands/jet.svg" },
  { name: "KNAACK", color: "#8B6914", textColor: "#FFF", slug: "knaack", logo: "/brands/knaack.svg" },
];

export function BrandShowcase() {
  return (
    <section className="py-6 bg-[#0A0A0A]" data-section="Comprar por Marca">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="h-5 w-5 text-[#E35205]" />
          <h2 className="text-base font-bold text-white uppercase tracking-wide">
            Comprar por Marca
          </h2>
        </div>

        {/* Brand cards grid — 6 per row on desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {brands.map((brand) => {
            const isLight = brand.textColor !== "#FFF" && brand.textColor !== "#00A651";
            return (
              <Link
                key={brand.slug}
                href={`/marca/${brand.slug}`}
                className="group relative overflow-hidden rounded-lg transition-all hover:opacity-90 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
                style={{ backgroundColor: brand.color }}
              >
                {/* Subtle diagonal stripe pattern */}
                <div
                  className="absolute inset-0 opacity-[0.05] pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 6px,
                      ${isLight ? "#000" : "#FFF"} 6px,
                      ${isLight ? "#000" : "#FFF"} 7px
                    )`,
                  }}
                />

                <div className="relative z-10 flex flex-col items-center justify-center px-3 pt-5 pb-4 min-h-[130px]">
                  {/* Logo placeholder area — center of card */}
                  <div className="flex items-center justify-center w-full h-[60px] mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-[50px] max-w-[130px] object-contain opacity-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <div className="hidden flex items-center justify-center gap-1">
                      <ImagePlus
                        className="h-5 w-5 opacity-30"
                        style={{ color: brand.textColor }}
                      />
                    </div>
                  </div>

                  {/* Brand name below logo area */}
                  <p
                    className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-center leading-tight"
                    style={{
                      color: brand.textColor,
                      fontStyle: brand.fontStyle || "normal",
                    }}
                  >
                    {brand.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}