"use client";
import Link from "next/link";
import { TrendingUp, ChevronRight } from "lucide-react";

const fallbackCategories = [
  { _id: "tc1", name: "Taladros", slug: "taladros", viewCount: "18.5K", iconType: "drill" },
  { _id: "tc2", name: "Impactos y Atornilladores", slug: "atornilladores", viewCount: "17.2K", iconType: "drill" },
  { _id: "tc3", name: "Herramientas Manuales", slug: "herramientas-manuales", viewCount: "15.0K", iconType: "settings" },
  { _id: "tc4", name: "Sierras", slug: "sierras", viewCount: "12.0K", iconType: "saw" },
  { _id: "tc5", name: "Kits Combinados", slug: "kits", viewCount: "10.5K", iconType: "settings" },
  { _id: "tc6", name: "Milwaukee M18", slug: "milwaukee-m18", viewCount: "9.8K", iconType: "settings" },
  { _id: "tc7", name: "Milwaukee M12", slug: "milwaukee-m12", viewCount: "8.2K", iconType: "settings" },
  { _id: "tc8", name: "Baterías y Cargadores", slug: "baterias-cargadores", viewCount: "7.9K", iconType: "settings" },
  { _id: "tc9", name: "Rotomartillos", slug: "rotomartillos", viewCount: "6.7K", iconType: "drill" },
  { _id: "tc10", name: "Esmeriladoras", slug: "esmeriladoras", viewCount: "6.5K", iconType: "saw" },
  { _id: "tc11", name: "Equipos de Protección", slug: "equipos-proteccion", viewCount: "6.2K", iconType: "settings" },
  { _id: "tc12", name: "Almacenamiento", slug: "almacenamiento", viewCount: "6.0K", iconType: "settings" },
];

export function TrendingSidebar({ categories }: { categories: any[] }) {
  const safeCategories = (categories && categories.length > 0) ? categories : fallbackCategories;

  return (
    <aside className="bg-white dark:bg-[#111111] border border-[#E0E0E0] dark:border-[#333] rounded-lg overflow-hidden" data-section="Categorías de Tendencia">
      <div className="bg-[#F5F6F8] dark:bg-[#1a1a1a] px-4 py-3 border-b border-[#E0E0E0] dark:border-[#333]">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#00A651]" />
          <h2 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wide">Categorías de Tendencia</h2>
        </div>
      </div>
      <ul className="divide-y divide-[#F0F0F0]">
        {safeCategories.map((cat) => (
          <li key={cat._id}>
            <Link href={`/categoria/${cat.slug}`} className="flex items-center justify-between px-4 py-2.5 hover:bg-[#F5F6F8] dark:bg-[#1a1a1a] transition-colors group">
              <span className="text-sm text-[#333] dark:text-gray-200 group-hover:text-[#E35205] transition-colors truncate mr-2">{cat.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-[#999] dark:text-gray-400">{cat.viewCount}</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#ccc] dark:text-gray-500 group-hover:text-[#E35205] transition-colors" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}