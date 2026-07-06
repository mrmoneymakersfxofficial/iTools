"use client";
import Link from "next/link";
import { TrendingUp, ChevronRight } from "lucide-react";

const trendingCategories = [
  { name: "Taladros", views: "18.8K", slug: "taladros" },
  { name: "Impactos y Atornilladores", views: "17.3K", slug: "atornilladores" },
  { name: "Herramientas Manuales", views: "16.0K", slug: "herramientas-manuales" },
  { name: "Sierras", views: "12.0K", slug: "sierras" },
  { name: "Kits Combinados", views: "10.0K", slug: "herramientas-electricas" },
  { name: "Milwaukee M18", views: "8.6K", slug: "herramientas-electricas" },
  { name: "Milwaukee M12", views: "8.2K", slug: "herramientas-electricas" },
  { name: "Baterías y Cargadores", views: "7.0K", slug: "accesorios-herramientas" },
  { name: "Rotomartillos", views: "6.7K", slug: "rotomartillos" },
  { name: "Esmeriladoras", views: "6.6K", slug: "esmeriladoras" },
  { name: "Equipos de Protección", views: "6.2K", slug: "equipos-de-proteccion" },
  { name: "Almacenamiento", views: "6.0K", slug: "almacenamiento-herramientas" },
];

export function TrendingSidebar() {
  return (
    <aside className="bg-white dark:bg-[#111111] border border-[#E0E0E0] dark:border-[#333] rounded-lg overflow-hidden" data-section="Categorías de Tendencia">
      <div className="bg-[#F5F6F8] dark:bg-[#1a1a1a] px-4 py-3 border-b border-[#E0E0E0] dark:border-[#333]">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#00A651]" />
          <h2 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wide">Categorías de Tendencia</h2>
        </div>
      </div>
      <ul className="divide-y divide-[#F0F0F0]">
        {trendingCategories.map((cat) => (
          <li key={cat.slug + cat.name}>
            <Link href={`/categoria/${cat.slug}`} className="flex items-center justify-between px-4 py-2.5 hover:bg-[#F5F6F8] dark:bg-[#1a1a1a] transition-colors group">
              <span className="text-sm text-[#333] dark:text-gray-200 group-hover:text-[#E35205] transition-colors truncate mr-2">{cat.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-[#999] dark:text-gray-400">{cat.views}</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#ccc] dark:text-gray-500 group-hover:text-[#E35205] transition-colors" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}