"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brands } from "@/lib/data";

const topDeals = [
  { brandId: "b1", headline: "KIT M18 FUEL GRATIS", subtext: "Compra 2 herramientas M18, llévate la 3ra gratis", accentColor: "#D1001C" },
  { brandId: "b2", headline: "BATERÍA 20V BONUS", subtext: "Batería adicional gratis en kits DeWalt seleccionados", accentColor: "#FFD700" },
  { brandId: "b3", headline: "HERRAMIENTA DE REGALO", subtext: "En compras mayores a S/ 3,000 en Bosch Professional", accentColor: "#005691" },
  { brandId: "b4", headline: "15% OFF EN MAKITA", subtext: "Descuento especial en toda la línea Makita 18V", accentColor: "#0077C8" },
  { brandId: "b5", headline: "ENVÍO GRATIS STANLEY", subtext: "Envío gratis en herramientas manuales Stanley", accentColor: "#E35205" },
  { brandId: "b6", headline: "CUPÓN 3M PRO", subtext: "Usa el código IT3MPRO y obtén 10% adicional", accentColor: "#CC3300" },
];

export function TopDealsSection() {
  return (
    <section className="bg-surface py-10 md:py-14" aria-labelledby="top-deals-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <h2 id="top-deals-heading" className="text-xl md:text-2xl font-impact text-foreground">
              Ofertas del Día
            </h2>
          </div>
          <Link
            href="#"
            className="flex items-center gap-1.5 text-sm font-medium text-itools-red hover:underline"
          >
            Ver Todas las Ofertas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Deal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topDeals.map((deal) => {
            const brand = brands.find((b) => b.id === deal.brandId);
            return (
              <Link
                key={deal.brandId}
                href={`/categoria/herramientas-electricas`}
                className="group bg-white dark:bg-[#111111] p-5 rounded-lg shadow-sm border border-border dark:border-[#333] hover:shadow-md transition-all duration-200"
                style={{ borderLeftWidth: "4px", borderLeftColor: deal.accentColor }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-sm text-white"
                    style={{ backgroundColor: deal.accentColor, color: deal.brandId === "b2" ? "#1A1A2E" : "#FFF" }}
                  >
                    {brand?.name ?? "OFERTA"}
                  </span>
                  <span className="text-[10px] bg-itools-red text-white px-2 py-0.5 rounded font-medium">
                    OFERTA
                  </span>
                </div>
                <p className="text-base font-semibold text-foreground leading-snug mb-1">
                  {deal.headline}
                </p>
                <p className="text-sm text-muted-foreground leading-snug">
                  {deal.subtext}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Promo code */}
        <div className="mt-6 inline-flex items-center gap-3 bg-white dark:bg-[#111111] px-5 py-3 rounded-lg border border-border dark:border-[#333] text-sm">
          <span className="text-muted-foreground">Código promocional:</span>
          <span className="font-mono font-bold text-itools-blue tracking-wide">M18PERU2026</span>
          <span className="text-muted-foreground text-xs">(10% adicional en M18)</span>
        </div>
      </div>
    </section>
  );
}