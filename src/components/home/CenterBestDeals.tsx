"use client";

import Link from "next/link";
import { CircleArrowRight, ArrowRight, Flame, ChevronDown } from "lucide-react";

/* ── Deal tile data (7by-style) — 2 tiles per row ── */
const dealTiles = [
  {
    brand: "BOSCH",
    brandColor: "#005691",
    title: "Batería de 18 V de regalo",
    subtitle: "Consigue una batería GRATIS con la compra de determinados kits de herramientas BOSCH.",
    href: "/categoria/herramientas-electricas",
  },
  {
    brand: "MILWAUKEE",
    brandColor: "#D1001C",
    title: "Kit M18 FUEL™ con 2 baterías",
    subtitle: "Lleva el kit M18 FUEL™ y recibe una batería extra de cortesía.",
    href: "/categoria/herramientas-electricas",
  },
  {
    brand: "DEWALT",
    brandColor: "#FFD700",
    textColor: "#1A1A1A",
    title: "20V MAX XR — Hasta 25% OFF",
    subtitle: "Aprovecha descuentos exclusivos en la línea 20V MAX XR.",
    href: "/categoria/herramientas-electricas",
  },
  {
    brand: "MAKITA",
    brandColor: "#0077C8",
    title: "18V LXT — 15% adicional",
    subtitle: "Obtén un 15% extra de descuento en herramientas Makita 18V.",
    href: "/categoria/herramientas-electricas",
  },
];

/**
 * Center column: "Las Mejores Ofertas de Hoy" deal tiles + "Ver Todas" button.
 * 2-column grid of clickable brand deal tiles.
 * Matches Acme's enhanced-7by-tile layout.
 */
export function CenterBestDeals() {
  return (
    <div>
      {/* Section heading */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-[#CC3300]" />
          <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">
            Las Mejores Ofertas
          </h2>
          <ChevronDown className="h-3.5 w-3.5 text-[#999]" />
        </div>
      </div>

      {/* Deal tiles — 2 columns */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {dealTiles.map((tile) => (
          <Link
            key={tile.brand}
            href={tile.href}
            className="enhanced-7by-tile group block relative overflow-hidden rounded-lg bg-white border border-[#E0E0E0] hover:border-[#ccc] transition-all duration-200 hover:shadow-md"
          >
            {/* Top color bar */}
            <div className="h-1 w-full" style={{ backgroundColor: tile.brandColor }} />

            <div className="enhanced-7by-overlay p-3 sm:p-4">
              {/* Brand */}
              <div className="enhanced-7by-logo mb-2">
                <span
                  className="text-[11px] sm:text-xs font-bold tracking-[0.06em]"
                  style={{ color: tile.brandColor }}
                >
                  {tile.brand}
                </span>
              </div>

              {/* Text */}
              <div className="enhanced-7by-text">
                <p className="enhanced-7by-title font-impact text-[#1A1A1A] text-xs sm:text-sm leading-tight mb-1">
                  {tile.title}
                </p>
                <p className="enhanced-7by-subtitle text-[#666] text-[10px] sm:text-[11px] leading-relaxed mb-2 line-clamp-2">
                  {tile.subtitle}
                </p>

                {/* Arrow */}
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F5F6F8] group-hover:bg-[#E35205] text-[#999] group-hover:text-white transition-all duration-200">
                  <CircleArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* "Ver Todas Las Ofertas" button */}
      <Link
        href="/categoria/herramientas-electricas"
        className="block w-full text-center bg-[#E35205] hover:bg-[#CC4400] text-white py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors"
      >
        Ver Todas Las Ofertas
      </Link>
    </div>
  );
}