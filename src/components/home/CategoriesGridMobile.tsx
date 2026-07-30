"use client";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import * as LucideIcons from "lucide-react";

const fallbackCategories = [
  { _id: "c1", name: "Taladros", slug: "taladros", iconName: "Drill", color: "#E35205", showInGrid: true },
  { _id: "c2", name: "Sierras", slug: "sierras", iconName: "Disc", color: "#0077C8", showInGrid: true },
  { _id: "c3", name: "Impactos", slug: "impactos", iconName: "Zap", color: "#c61010", showInGrid: true },
  { _id: "c4", name: "Baterías", slug: "baterias", iconName: "Battery", color: "#000", showInGrid: true },
  { _id: "c5", name: "Medición", slug: "medicion", iconName: "Ruler", color: "#E6A817", showInGrid: true },
  { _id: "c6", name: "Accesorios", slug: "accesorios", iconName: "Wrench", color: "#1e4b8f", showInGrid: true },
  { _id: "c7", name: "Seguridad", slug: "seguridad", iconName: "Shield", color: "#CC3300", showInGrid: true },
  { _id: "c8", name: "Almacenaje", slug: "almacenaje", iconName: "Box", color: "#1A1A1A", showInGrid: true },
];

export function CategoriesGridMobile({ categories }: { categories: any[] }) {
  const safeCategories = (categories && categories.length > 0) ? categories.filter(c => c.showInGrid) : fallbackCategories;

  if (safeCategories.length === 0) return null;

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
          {safeCategories.map((cat) => {
            const Icon = (LucideIcons as any)[cat.iconName] || LucideIcons.Zap;
            return (
              <Link
                key={cat._id}
                href={`/categoria/${cat.slug}`}
                className="group flex flex-col items-center justify-center gap-2 p-3 bg-[#F5F6F8] dark:bg-[#1a1a1a] border border-[#E8E8E8] dark:border-[#333] rounded-xl aspect-square transition-all hover:shadow-md hover:border-[#ccc]"
              >
                <div className="transition-transform group-hover:scale-110" style={{ color: cat.color || "#000" }}>
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