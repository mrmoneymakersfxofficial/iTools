"use client";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import * as LucideIcons from "lucide-react";

export function CategoriesGridMobile({ categories }: { categories: any[] }) {
  const safeCategories = (categories || []).filter(c => c.showInGrid);

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