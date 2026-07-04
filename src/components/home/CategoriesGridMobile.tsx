"use client";
import Link from "next/link";
import { LayoutGrid, Zap, Wrench, Settings, Scissors, Disc, Hammer, Trees, Shield, Package, HardHat, Ruler, Cog, Drill, HandMetal } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="h-5 w-5" />, Wrench: <Wrench className="h-5 w-5" />, Settings: <Settings className="h-5 w-5" />,
  Scissors: <Scissors className="h-5 w-5" />, Disc: <Disc className="h-5 w-5" />, Hammer: <Hammer className="h-5 w-5" />,
  Trees: <Trees className="h-5 w-5" />, Shield: <Shield className="h-5 w-5" />, Package: <Package className="h-5 w-5" />,
  HardHat: <HardHat className="h-5 w-5" />, Ruler: <Ruler className="h-5 w-5" />, Cog: <Cog className="h-5 w-5" />,
  Drill: <Drill className="h-5 w-5" />, HandMetal: <HandMetal className="h-5 w-5" />,
};

const mainCategories = [
  { name: "Herramientas Eléctricas", slug: "herramientas-electricas", icon: "Zap", color: "#0A2A44" },
  { name: "Herramientas Manuales", slug: "herramientas-manuales", icon: "Wrench", color: "#2C3E50" },
  { name: "Accesorios", slug: "accesorios-herramientas", icon: "Package", color: "#333" },
  { name: "Kits Combinados", slug: "herramientas-electricas", icon: "Settings", color: "#D1001C" },
  { name: "Medición", slug: "herramientas-manuales", icon: "Ruler", color: "#0077C8" },
  { name: "Seguridad y EPP", slug: "equipos-de-proteccion", icon: "Shield", color: "#00A651" },
  { name: "Almacenamiento", slug: "almacenamiento-herramientas", icon: "HardHat", color: "#E35205" },
  { name: "Corte y Pulido", slug: "esmeriladoras", icon: "Disc", color: "#CC3300" },
];

export function CategoriesGridMobile() {
  return (
    <section className="bg-white py-2.5 lg:hidden" data-section="Categorías Principales">
      <div className="mx-auto max-w-7xl px-2.5 sm:px-4">
        <div className="flex items-center gap-2 mb-2">
          <LayoutGrid className="h-4 w-4 text-[#E35205]" />
          <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">Categorías Principales</h2>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {mainCategories.map((cat) => (
            <Link key={cat.slug + cat.name} href={`/categoria/${cat.slug}`} className="group flex flex-col items-center justify-center gap-1.5 py-3 px-1 rounded-lg transition-colors hover:opacity-90" style={{ backgroundColor: cat.color }}>
              <div className="text-white/90 group-hover:scale-110 transition-transform">{iconMap[cat.icon] || <Wrench className="h-5 w-5" />}</div>
              <p className="text-white text-[9px] sm:text-[10px] font-semibold text-center leading-tight">{cat.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}