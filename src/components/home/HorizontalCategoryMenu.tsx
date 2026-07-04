"use client";

import Link from "next/link";
import { Wrench, Zap, TreePine, Shield, Package, Settings, Hammer, Disc, Ruler, HardHat, Cog, Drill } from "lucide-react";

/**
 * Horizontal scrolling category menu for mobile.
 * Matches Acme's "ALL TOOLS | OUTDOOR LIVING | LAWN & GARDEN" overflow scroll.
 * Shows icon + label in white rounded pills, scrollable horizontally.
 */
const menuItems = [
  { name: "Todas las Herramientas", slug: "herramientas-electricas", icon: Wrench },
  { name: "Herramientas Eléctricas", slug: "herramientas-electricas", icon: Zap },
  { name: "Herramientas Manuales", slug: "herramientas-manuales", icon: Hammer },
  { name: "Sierras y Corte", slug: "esmeriladoras", icon: Disc },
  { name: "Medición", slug: "herramientas-manuales", icon: Ruler },
  { name: "Seguridad y EPP", slug: "equipos-de-proteccion", icon: Shield },
  { name: "Almacenamiento", slug: "almacenamiento-herramientas", icon: HardHat },
  { name: "Accesorios", slug: "accesorios-herramientas", icon: Package },
  { name: "Kits Combinados", slug: "herramientas-electricas", icon: Settings },
  { name: "Taladros", slug: "taladros", icon: Drill },
  { name: "Jardín", slug: "herramientas-manuales", icon: TreePine },
  { name: "Corte y Pulido", slug: "esmeriladoras", icon: Cog },
];

export function HorizontalCategoryMenu() {
  return (
    <div
      className="overflow-x-auto flex gap-2 px-2.5 py-2.5 bg-white"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.slug + item.name}
            href={`/categoria/${item.slug}`}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#F5F6F8] hover:bg-[#E8EDF2] rounded-lg text-[11px] font-semibold text-[#333] whitespace-nowrap transition-colors shrink-0"
          >
            <Icon className="h-3.5 w-3.5 text-[#666]" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}