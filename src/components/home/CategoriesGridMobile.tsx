"use client";
import Link from "next/link";
import { LayoutGrid, Zap, Wrench, Settings, Disc, Hammer, Trees, Shield, Package, HardHat, Ruler, Cog, Drill, HandMetal, Scissors, Ladder, BatteryCharging, Gauge } from "lucide-react";

const mainCategories = [
  { name: "Herramientas Eléctricas", slug: "herramientas-electricas", Icon: Zap, color: "#D1001C" },
  { name: "Herramientas Manuales", slug: "herramientas-manuales", Icon: Wrench, color: "#E35205" },
  { name: "Accesorios", slug: "accesorios-herramientas", Icon: Package, color: "#CC3300" },
  { name: "Kits Combinados", slug: "herramientas-electricas", Icon: Settings, color: "#D1001C" },
  { name: "Almacenamiento", slug: "almacenamiento-herramientas", Icon: HardHat, color: "#555" },
  { name: "Sierras", slug: "sierras", Icon: Disc, color: "#0077C8" },
  { name: "Jardín", slug: "jardin-exterior", Icon: Trees, color: "#00A651" },
  { name: "EPI y Seguridad", slug: "equipos-de-proteccion", Icon: Shield, color: "#333" },
  { name: "Medición", slug: "medicion", Icon: Ruler, color: "#0077C8" },
  { name: "Corte y Pulido", slug: "esmeriladoras", Icon: Cog, color: "#666" },
  { name: "Taladros", slug: "taladros", Icon: Drill, color: "#005691" },
  { name: "Rotomartillos", slug: "rotomartillos", Icon: Hammer, color: "#1A1A1A" },
];

export function CategoriesGridMobile() {
  return (
    <section className="bg-white dark:bg-[#111111] py-2.5 lg:hidden" data-section="Categorías Principales">
      <div className="mx-auto max-w-7xl px-2.5 sm:px-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <LayoutGrid className="h-4 w-4 text-[#CC3300]" />
          <h2 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wide">
            Categorías Principales
          </h2>
        </div>

        {/* Square cards with rounded borders, light gray bg */}
        <div className="grid grid-cols-4 gap-2">
          {mainCategories.map((cat) => {
            const { Icon } = cat;
            return (
              <Link
                key={cat.slug + cat.name}
                href={`/categoria/${cat.slug}`}
                className="group flex flex-col items-center justify-center gap-2 p-3 bg-[#F5F6F8] dark:bg-[#1a1a1a] border border-[#E8E8E8] dark:border-[#333] rounded-xl aspect-square transition-all hover:shadow-md hover:border-[#ccc]"
              >
                <div className="transition-transform group-hover:scale-110" style={{ color: cat.color }}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-[#1A1A1A] dark:text-white text-[9px] sm:text-[10px] font-semibold text-center leading-tight line-clamp-2">
                  {cat.name}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}