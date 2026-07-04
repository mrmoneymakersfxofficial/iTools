"use client";
import { Flame, CircleArrowRight } from "lucide-react";
import { HorizontalScroll } from "@/components/home/HorizontalScroll";

const dealTiles = [
  { brand: "BOSCH", brandColor: "#005691", title: "Batería de 18 V de regalo", subtitle: "Consigue una batería GRATIS con kits BOSCH.", href: "/categoria/herramientas-electricas" },
  { brand: "MILWAUKEE", brandColor: "#D1001C", title: "Herramienta gratuita de elección", subtitle: "Elige tu herramienta gratis con kits M18.", href: "/categoria/herramientas-electricas" },
  { brand: "DEWALT", brandColor: "#FFD700", textColor: "#1A1A1A", title: "20V MAX XR — Hasta 25% OFF", subtitle: "Descuentos exclusivos en 20V MAX XR.", href: "/categoria/herramientas-electricas" },
  { brand: "MAKITA", brandColor: "#0077C8", title: "18V LXT — 15% adicional", subtitle: "15% extra en herramientas Makita 18V.", href: "/categoria/herramientas-electricas" },
  { brand: "STANLEY", brandColor: "#E35205", title: "Envío Gratis en Manuales", subtitle: "Herramientas manuales Stanley envío gratis.", href: "/categoria/herramientas-manuales" },
  { brand: "3M", brandColor: "#CC3300", title: "Seguridad — 10% extra", subtitle: "EPP 3M con 10% de descuento adicional.", href: "/categoria/equipos-de-proteccion" },
];

export function BestDealsSection() {
  return (
    <section className="bg-white py-2.5 md:py-3" data-section="Las Mejores Ofertas de Hoy">
      <div className="mx-auto max-w-7xl px-2.5 sm:px-4 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="h-4 w-4 text-[#CC3300]" />
          <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">Las Mejores Ofertas de Hoy</h2>
        </div>
        <div className="lg:hidden">
          <HorizontalScroll>
            {dealTiles.map((tile) => (
              <a key={tile.brand} href={tile.href} className="enhanced-7by-tile group relative flex-shrink-0 w-[200px] sm:w-[260px] overflow-hidden rounded-lg bg-white border border-[#E0E0E0] hover:shadow-md transition-shadow snap-start">
                <div className="h-1 w-full" style={{ backgroundColor: tile.brandColor }} />
                <div className="p-2.5">
                  <span className="text-[11px] font-bold tracking-[0.06em]" style={{ color: tile.brandColor }}>{tile.brand}</span>
                  <p className="font-impact text-[#1A1A1A] text-sm leading-tight mt-1 mb-1">{tile.title}</p>
                  <p className="text-[#666] text-[11px] leading-relaxed mb-2 line-clamp-2">{tile.subtitle}</p>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F5F6F8] group-hover:bg-[#E35205] text-[#999] group-hover:text-white transition-all">
                    <CircleArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </a>
            ))}
          </HorizontalScroll>
        </div>
        <div className="hidden lg:grid lg:grid-cols-3 gap-2">
          {dealTiles.slice(0, 6).map((tile) => (
            <a key={tile.brand} href={tile.href} className="enhanced-7by-tile group relative overflow-hidden rounded-lg bg-white border border-[#E0E0E0] hover:shadow-md transition-shadow">
              <div className="h-1 w-full" style={{ backgroundColor: tile.brandColor }} />
              <div className="p-3">
                <span className="text-[11px] font-bold tracking-[0.06em]" style={{ color: tile.brandColor }}>{tile.brand}</span>
                <p className="font-impact text-[#1A1A1A] text-xs leading-tight mt-1 mb-1">{tile.title}</p>
                <p className="text-[#666] text-[10px] leading-relaxed mb-2 line-clamp-2">{tile.subtitle}</p>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F5F6F8] group-hover:bg-[#E35205] text-[#999] group-hover:text-white transition-all">
                  <CircleArrowRight className="h-3 w-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
        <a href="/categoria/herramientas-electricas" className="mt-2 block w-full text-center bg-[#E35205] hover:bg-[#CC4400] text-white py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors">Ver Todas Las Ofertas</a>
      </div>
    </section>
  );
}