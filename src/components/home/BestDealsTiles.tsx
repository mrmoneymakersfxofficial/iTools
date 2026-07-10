"use client";

import Link from "next/link";
import { CircleArrowRight, ArrowRight, Flame } from "lucide-react";

/* ── Deal tile data (7by-style) ── */
const dealTiles = [
  {
    brand: "BOSCH",
    brandColor: "#005691",
    title: "Batería de 18 V de regalo",
    subtitle:
      "Consigue una batería GRATIS con la compra de determinados kits de herramientas BOSCH.",
    href: "/categoria/herramientas-electricas",
  },
  {
    brand: "MILWAUKEE",
    brandColor: "#D1001C",
    title: "Kit M18 FUEL™ con 2 baterías",
    subtitle:
      "Lleva el kit M18 FUEL™ y recibe una batería extra de cortesía en tu compra.",
    href: "/categoria/herramientas-electricas",
  },
  {
    brand: "DEWALT",
    brandColor: "#FFD700",
    textColor: "#1A1A1A",
    title: "20V MAX XR — Hasta 25% OFF",
    subtitle:
      "Aprovecha descuentos exclusivos en la línea 20V MAX XR de DeWalt.",
    href: "/categoria/herramientas-electricas",
  },
  {
    brand: "MAKITA",
    brandColor: "#0077C8",
    title: "18V LXT — 15% adicional",
    subtitle:
      "Obtén un 15% extra de descuento en herramientas Makita 18V seleccionadas.",
    href: "/categoria/herramientas-electricas",
  },
  {
    brand: "STANLEY",
    brandColor: "#E35205",
    title: "Herramientas Manuales — Envío Gratis",
    subtitle:
      "Compra herramientas manuales Stanley y recibe envío gratis a todo el Perú.",
    href: "/categoria/herramientas-manuales",
  },
  {
    brand: "3M",
    brandColor: "#CC3300",
    title: "Seguridad Industrial — 10% extra",
    subtitle:
      "Equipo de protección personal 3M con 10% de descuento adicional.",
    href: "/categoria/equipos-de-proteccion",
  },
];

/**
 * Acme-style "Today's Best Deals" section.
 * 2-column grid of deal tiles with brand logo, title, subtitle, and arrow CTA.
 * Matches Acme's enhanced-7by-tile pattern.
 */
export function BestDealsTiles() {
  return (
    <section
      className="bg-[#F5F6F8] py-6 md:py-8"
      data-section="Las Mejores Ofertas de Hoy"
      aria-labelledby="best-deals-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-[#CC3300]" />
            <h2
              id="best-deals-heading"
              className="text-lg md:text-xl font-impact text-[#1A1A1A]"
            >
              Las Mejores Ofertas de Hoy
            </h2>
          </div>
          <Link
            href="/categoria/herramientas-electricas"
            className="flex items-center gap-1 text-sm font-medium text-[#E35205] hover:underline"
          >
            Ver Todas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Deal tiles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {dealTiles.map((tile) => (
            <Link
              key={tile.brand}
              href={tile.href}
              className="enhanced-7by-tile group relative overflow-hidden rounded-lg bg-white border border-[#E0E0E0] hover:border-[#ccc] transition-all duration-200 hover:shadow-lg"
            >
              {/* Top color bar */}
              <div
                className="h-1.5 w-full"
                style={{ backgroundColor: tile.brandColor }}
              />

              <div className="enhanced-7by-overlay p-4 sm:p-5 md:p-6">
                {/* Brand logo */}
                <div className="enhanced-7by-logo mb-3">
                  <span
                    className="text-sm font-bold tracking-[0.08em]"
                    style={{ color: tile.brandColor }}
                  >
                    {tile.brand}
                  </span>
                </div>

                {/* Text */}
                <div className="enhanced-7by-text">
                  <p className="enhanced-7by-title text-[#1A1A1A] font-impact text-base sm:text-lg leading-tight mb-1.5">
                    {tile.title}
                  </p>
                  <p className="enhanced-7by-subtitle text-[#666] text-xs sm:text-sm leading-relaxed mb-3">
                    {tile.subtitle}
                  </p>

                  {/* Arrow button */}
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F5F6F8] group-hover:bg-[#E35205] text-[#999] group-hover:text-white transition-all duration-200"
                    aria-label={`Ver oferta de ${tile.brand}`}
                  >
                    <CircleArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}