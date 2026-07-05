"use client";

import Link from "next/link";
import { Wrench, ChevronRight, TrendingUp } from "lucide-react";

const trendingCategories = [
  { name: "Taladros", views: "18.8K", slug: "taladros", icon: "drill" },
  { name: "Impactos y Atornilladores", views: "17.3K", slug: "atornilladores", icon: "impact" },
  { name: "Herramientas Manuales", views: "16.0K", slug: "herramientas-manuales", icon: "wrench" },
  { name: "Sierras", views: "12.0K", slug: "sierras", icon: "saw" },
  { name: "Kits Combinados", views: "10.0K", slug: "herramientas-electricas", icon: "kit" },
  { name: "Milwaukee M18", views: "8.6K", slug: "herramientas-electricas", icon: "m18" },
  { name: "Milwaukee M12", views: "8.2K", slug: "herramientas-electricas", icon: "m12" },
  { name: "Baterías y Cargadores", views: "7.0K", slug: "accesorios-herramientas", icon: "battery" },
];

/** Simple SVG icons for categories */
function CategoryIcon({ type }: { type: string }) {
  const iconClass = "h-5 w-5 text-[#555]";
  switch (type) {
    case "drill":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
        </svg>
      );
    default:
      return <Wrench className={iconClass} />;
  }
}

/**
 * Mobile: "Categorías de Tendencia" in a 2-column grid.
 * Each card shows icon, category name, and view count.
 * Matches Acme's mobile trending categories layout (image 2).
 */
export function TrendingCategoriesMobile() {
  return (
    <section className="bg-white py-2.5 lg:hidden" data-section="Categorías de Tendencia Móvil">
      <div className="px-2.5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-[#00A651]" />
          <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">
            Categorías de Tendencia
          </h2>
        </div>

        {/* 2-column grid of category cards */}
        <div className="grid grid-cols-2 gap-2">
          {trendingCategories.map((cat) => (
            <Link
              key={cat.slug + cat.name}
              href={`/categoria/${cat.slug}`}
              className="group flex items-center gap-2.5 p-3 bg-white border border-[#E0E0E0] rounded-lg hover:shadow-md hover:border-[#ccc] transition-all"
            >
              {/* Icon circle */}
              <div className="shrink-0 w-10 h-10 rounded-full bg-[#F5F6F8] flex items-center justify-center group-hover:bg-[#E8EDF2] transition-colors">
                <CategoryIcon type={cat.icon} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#333] group-hover:text-[#E35205] transition-colors leading-tight line-clamp-2">
                  {cat.name}
                </p>
                <span className="inline-flex items-center gap-0.5 mt-0.5">
                  <span className="text-[10px] text-[#0071C5] font-bold bg-[#E8F4FD] px-1.5 py-0.5 rounded-full">
                    {cat.views}
                  </span>
                </span>
              </div>

              {/* Arrow */}
              <ChevronRight className="h-3.5 w-3.5 text-[#ccc] group-hover:text-[#E35205] shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}