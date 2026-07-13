"use client";
import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";

/* ── Brand data — matches real logos in /public/brands/ ── */
const brands = [
  { name: "Milwaukee",    color: "#D1001C", textColor: "#FFF",     slug: "milwaukee",    fontStyle: "italic",  logo: "/brands/milwaukee.webp",  products: "28.1K" },
  { name: "DEWALT",       color: "#FFD700", textColor: "#1A1A1A",  slug: "dewalt",       fontStyle: "normal",  logo: "/brands/dewalt.webp",     products: "22.4K" },
  { name: "BOSCH",        color: "#005691", textColor: "#FFF",     slug: "bosch",        fontStyle: "normal",  logo: "/brands/bosch.webp",      products: "19.6K" },
  { name: "MAKITA",       color: "#0077C8", textColor: "#FFF",     slug: "makita",       fontStyle: "normal",  logo: "/brands/makita.webp",     products: "24.5K" },
  { name: "STANLEY",      color: "#E35205", textColor: "#FFF",     slug: "stanley",      fontStyle: "normal",  logo: "/brands/stanley.webp",    products: "15.8K" },
  { name: "INGCO",        color: "#E35205", textColor: "#FFF",     slug: "ingco",        fontStyle: "normal",  logo: "/brands/ingco.webp",      products: "18.2K" },
  { name: "TRUPER",       color: "#CC0000", textColor: "#FFF",     slug: "truper",       fontStyle: "normal",  logo: "/brands/truper.webp",     products: "16.8K" },
  { name: "TOTAL",        color: "#D1001C", textColor: "#FFF",     slug: "total",        fontStyle: "normal",  logo: "/brands/total.webp",      products: "14.3K" },
  { name: "TOPTUL",       color: "#1A1A1A", textColor: "#E35205",  slug: "toptul",       fontStyle: "normal",  logo: "/brands/toptul.webp",     products: "8.9K" },
  { name: "DONG CHENG",   color: "#CC0000", textColor: "#FFF",     slug: "dong-cheng",   fontStyle: "normal",  logo: "/brands/dong-cheng.webp", products: "12.1K" },
  { name: "KAMASA",       color: "#D1001C", textColor: "#FFF",     slug: "kamasa",       fontStyle: "normal",  logo: "/brands/kamasa.webp",     products: "6.4K" },
  { name: "BAHCO",        color: "#003366", textColor: "#FFF",     slug: "bahco",        fontStyle: "normal",  logo: "/brands/bahco.webp",      products: "9.7K" },
  { name: "TRAMONTINA",   color: "#006633", textColor: "#FFF",     slug: "tramontina",   fontStyle: "normal",  logo: "/brands/tramontina.webp", products: "11.5K" },
  { name: "WAGNER",       color: "#004B87", textColor: "#FFF",     slug: "wagner",       fontStyle: "normal",  logo: "/brands/wagner.webp",     products: "5.8K" },
  { name: "SATA",         color: "#005BAC", textColor: "#FFF",     slug: "sata",         fontStyle: "normal",  logo: "/brands/sata.webp",       products: "7.3K" },
  { name: "EMTOP",        color: "#1A5276", textColor: "#FFF",     slug: "emtop",        fontStyle: "normal",  logo: "/brands/emtop.webp",      products: "8.1K" },
  { name: "DCA",          color: "#FF8C00", textColor: "#1A1A1A",  slug: "dca",          fontStyle: "normal",  logo: "/brands/dca.webp",        products: "10.6K" },
  { name: "KAILI",        color: "#B22222", textColor: "#FFF",     slug: "kaili",        fontStyle: "normal",  logo: "/brands/kaili.webp",      products: "4.9K" },
];

export function BrandsGridMobile() {
  return (
    <section className="bg-[#0A0A0A] py-3 lg:hidden" data-section="Comprar por Marca">
      <div className="mx-auto max-w-7xl px-2.5 sm:px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#E35205]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              Comprar por Marca
            </h2>
          </div>
          <span className="text-[11px] text-[#E35205] font-semibold">18 MARCAS &rarr;</span>
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
                className="shrink-0 w-[150px] sm:w-[165px] group relative overflow-hidden rounded-xl transition-all active:scale-[0.97] hover:shadow-md border border-[#222]"
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
                <div className="relative z-10 flex flex-col items-center justify-center px-3 pt-4 pb-2.5 min-h-[110px]">
                  {/* Logo area — ratio 2.6:1 preserved, auto-scales */}
                  <div className="flex items-center justify-center w-full h-[42px] mb-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-[42px] w-auto object-contain"
                      loading="lazy"
                    />
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