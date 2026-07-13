"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

/* ── Brand data — matches real logos in /public/brands/ ── */
const brands = [
  { name: "Milwaukee",    color: "#D1001C", textColor: "#FFF",     slug: "milwaukee",    fontStyle: "italic",  logo: "/brands/milwaukee.webp" },
  { name: "BOSCH",        color: "#005691", textColor: "#FFF",     slug: "bosch",        fontStyle: "normal",  logo: "/brands/bosch.webp" },
  { name: "DEWALT",       color: "#FFD700", textColor: "#1A1A1A",  slug: "dewalt",       fontStyle: "normal",  logo: "/brands/dewalt.webp" },
  { name: "MAKITA",       color: "#0077C8", textColor: "#FFF",     slug: "makita",       fontStyle: "normal",  logo: "/brands/makita.webp" },
  { name: "STANLEY",      color: "#E35205", textColor: "#FFF",     slug: "stanley",      fontStyle: "normal",  logo: "/brands/stanley.webp" },
  { name: "INGCO",        color: "#E35205", textColor: "#FFF",     slug: "ingco",        fontStyle: "normal",  logo: "/brands/ingco.webp" },
  { name: "TRUPER",       color: "#CC0000", textColor: "#FFF",     slug: "truper",       fontStyle: "normal",  logo: "/brands/truper.webp" },
  { name: "TOTAL",        color: "#D1001C", textColor: "#FFF",     slug: "total",        fontStyle: "normal",  logo: "/brands/total.webp" },
  { name: "TOPTUL",       color: "#1A1A1A", textColor: "#E35205",  slug: "toptul",       fontStyle: "normal",  logo: "/brands/toptul.webp" },
  { name: "DONG CHENG",   color: "#CC0000", textColor: "#FFF",     slug: "dong-cheng",   fontStyle: "normal",  logo: "/brands/dong-cheng.webp" },
  { name: "KAMASA",       color: "#D1001C", textColor: "#FFF",     slug: "kamasa",       fontStyle: "normal",  logo: "/brands/kamasa.webp" },
  { name: "BAHCO",        color: "#003366", textColor: "#FFF",     slug: "bahco",        fontStyle: "normal",  logo: "/brands/bahco.webp" },
  { name: "TRAMONTINA",   color: "#006633", textColor: "#FFF",     slug: "tramontina",   fontStyle: "normal",  logo: "/brands/tramontina.webp" },
  { name: "WAGNER",       color: "#004B87", textColor: "#FFF",     slug: "wagner",       fontStyle: "normal",  logo: "/brands/wagner.webp" },
  { name: "SATA",         color: "#005BAC", textColor: "#FFF",     slug: "sata",         fontStyle: "normal",  logo: "/brands/sata.webp" },
  { name: "EMTOP",        color: "#1A5276", textColor: "#FFF",     slug: "emtop",        fontStyle: "normal",  logo: "/brands/emtop.webp" },
  { name: "DCA",          color: "#FF8C00", textColor: "#1A1A1A",  slug: "dca",          fontStyle: "normal",  logo: "/brands/dca.webp" },
  { name: "KAILI",        color: "#B22222", textColor: "#FFF",     slug: "kaili",        fontStyle: "normal",  logo: "/brands/kaili.webp" },
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

                <div className="relative z-10 flex flex-col items-center justify-center px-3 pt-4 pb-3 min-h-[100px]">
                  {/* Logo area — ratio 2.6:1, auto-scales to fit */}
                  <div className="flex items-center justify-center w-full h-[40px] mb-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-[40px] w-auto object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Brand name below logo */}
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