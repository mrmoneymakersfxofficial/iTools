"use client";

import Link from "next/link";

/**
 * Horizontal scrolling category menu for mobile.
 * Acme style: "ALL TOOLS | OUTDOOR POWER | LAWN & GARDEN" —
 * text-only items with pipe separators, overflow-x scroll.
 */
const menuItems = [
  { name: "Todas las Herramientas", slug: "herramientas-electricas" },
  { name: "Herramientas Eléctricas", slug: "herramientas-electricas" },
  { name: "Herramientas Manuales", slug: "herramientas-manuales" },
  { name: "Taladros", slug: "taladros" },
  { name: "Impactos y Atornilladores", slug: "atornilladores" },
  { name: "Sierras y Corte", slug: "sierras" },
  { name: "Milwaukee M18", slug: "herramientas-electricas" },
  { name: "Milwaukee M12", slug: "herramientas-electricas" },
  { name: "Baterías y Cargadores", slug: "accesorios-herramientas" },
  { name: "Seguridad y EPP", slug: "equipos-de-proteccion" },
  { name: "Almacenamiento", slug: "almacenamiento-herramientas" },
  { name: "Accesorios", slug: "accesorios-herramientas" },
  { name: "Kits Combinados", slug: "herramientas-electricas" },
  { name: "Jardín", slug: "herramientas-manuales" },
];

export function HorizontalCategoryMenu() {
  return (
    <nav
      className="overflow-x-auto bg-white border-b border-[#E0E0E0]"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="flex items-center whitespace-nowrap px-3 py-2.5 gap-0">
        {menuItems.map((item, i) => (
          <span key={item.slug + item.name} className="flex items-center shrink-0">
            {i > 0 && (
              <span className="text-[#D0D0D0] mx-2 select-none" aria-hidden="true">|</span>
            )}
            <Link
              href={`/categoria/${item.slug}`}
              className="text-[11px] font-semibold text-[#333] hover:text-[#E35205] uppercase tracking-[0.04em] transition-colors"
            >
              {item.name}
            </Link>
          </span>
        ))}
      </div>
    </nav>
  );
}