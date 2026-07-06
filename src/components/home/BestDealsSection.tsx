"use client";
import { Flame, CircleArrowRight } from "lucide-react";
import { HorizontalScroll } from "@/components/home/HorizontalScroll";

const dealTiles = [
  { brand: "BOSCH", brandColor: "#1e4b8f", title: "Batería de 18 V de regalo", subtitle: "Consigue una batería GRATIS con la compra de determinados kits de herramientas BOSCH.", href: "/marca/bosch" },
  { brand: "MILWAUKEE", brandColor: "#c61010", title: "Herramienta gratuita de elección", subtitle: "Con la compra de kits Milwaukee M18 seleccionados.", href: "/marca/milwaukee" },
  { brand: "DEWALT", brandColor: "#e6a817", textColor: "#1A1A1A", title: "Herramienta gratuita por nuestra cuenta", subtitle: "Con kit de batería DEWALT 20V MAX XR seleccionado.", href: "/marca/dewalt" },
  { brand: "MAKITA", brandColor: "#0077C8", title: "18V LXT — 15% adicional", subtitle: "15% extra en herramientas Makita 18V.", href: "/marca/makita" },
  { brand: "STANLEY", brandColor: "#E35205", title: "Envío Gratis en Manuales", subtitle: "Herramientas manuales Stanley envío gratis.", href: "/categoria/herramientas-manuales" },
  { brand: "3M", brandColor: "#CC3300", title: "Seguridad — 10% extra", subtitle: "EPP 3M con 10% de descuento adicional.", href: "/categoria/equipos-de-proteccion" },
];

function DealCard({ tile }: { tile: typeof dealTiles[0] }) {
  const textCol = tile.textColor || "#FFFFFF";
  return (
    <a
      href={tile.href}
      className="group relative flex-shrink-0 w-[200px] sm:w-[260px] h-[260px] sm:h-[300px] overflow-hidden rounded-lg snap-start transition-shadow hover:shadow-lg"
    >
      {/* Brand color background */}
      <div className="absolute inset-0" style={{ backgroundColor: tile.brandColor }} />

      {/* Dark gradient at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-4">
        {/* Top: brand name */}
        <span
          className="text-[11px] font-bold tracking-[0.08em] uppercase self-start"
          style={{ color: textCol, opacity: 0.85 }}
        >
          {tile.brand}
        </span>

        {/* Bottom: title, subtitle, arrow */}
        <div>
          <p
            className="font-impact text-base sm:text-lg leading-tight mb-1.5"
            style={{ color: textCol }}
          >
            {tile.title}
          </p>
          <p
            className="text-[10px] sm:text-xs leading-relaxed mb-3 line-clamp-2"
            style={{ color: textCol, opacity: 0.8 }}
          >
            {tile.subtitle}
          </p>
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-full transition-all"
            style={{
              backgroundColor: `${textCol}20`,
              color: textCol,
            }}
          >
            <CircleArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
}

export function BestDealsSection() {
  return (
    <section className="bg-white dark:bg-[#111111] py-2.5 md:py-3" data-section="Las Mejores Ofertas de Hoy">
      <div className="mx-auto max-w-7xl px-2.5 sm:px-4 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="h-4 w-4 text-[#CC3300]" />
          <h2 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wide">
            Las Mejores Ofertas de Hoy
          </h2>
        </div>

        {/* Mobile: horizontal scroll tall cards */}
        <div className="lg:hidden">
          <HorizontalScroll>
            {dealTiles.map((tile) => (
              <DealCard key={tile.brand} tile={tile} />
            ))}
          </HorizontalScroll>
        </div>

        {/* Desktop: 3-col grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-2.5">
          {dealTiles.slice(0, 6).map((tile) => (
            <a
              key={tile.brand}
              href={tile.href}
              className="group relative overflow-hidden rounded-lg h-[200px] transition-shadow hover:shadow-lg"
            >
              <div className="absolute inset-0" style={{ backgroundColor: tile.brandColor }} />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%)",
                }}
              />
              <div className="relative z-10 flex flex-col justify-between h-full p-4">
                <span
                  className="text-[11px] font-bold tracking-[0.08em] uppercase"
                  style={{ color: tile.textColor || "#FFFFFF", opacity: 0.85 }}
                >
                  {tile.brand}
                </span>
                <div>
                  <p
                    className="font-impact text-sm leading-tight mb-1"
                    style={{ color: tile.textColor || "#FFFFFF" }}
                  >
                    {tile.title}
                  </p>
                  <p
                    className="text-[10px] leading-relaxed mb-2 line-clamp-2"
                    style={{ color: tile.textColor || "#FFFFFF", opacity: 0.8 }}
                  >
                    {tile.subtitle}
                  </p>
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full transition-all"
                    style={{
                      backgroundColor: `${tile.textColor || "#FFFFFF"}20`,
                      color: tile.textColor || "#FFFFFF",
                    }}
                  >
                    <CircleArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <a
          href="/categoria/herramientas-electricas"
          className="mt-2.5 block w-full text-center bg-[#E35205] hover:bg-[#CC4400] text-white py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors"
        >
          Ver Todas Las Ofertas
        </a>
      </div>
    </section>
  );
}