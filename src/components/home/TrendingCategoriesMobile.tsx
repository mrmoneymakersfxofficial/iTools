"use client";

import Link from "next/link";
import { Wrench, ChevronRight, TrendingUp } from "lucide-react";
import * as LucideIcons from "lucide-react";

export function TrendingCategoriesMobile({ categories }: { categories: any[] }) {
  const safeCategories = categories || [];

  if (safeCategories.length === 0) return null;

  return (
    <section className="bg-white dark:bg-[#111111] py-2.5 lg:hidden" data-section="Categorías de Tendencia Móvil">
      <div className="px-2.5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-[#00A651]" />
          <h2 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wide">
            Categorías de Tendencia
          </h2>
        </div>

        {/* 2-column grid of category cards */}
        <div className="grid grid-cols-2 gap-2">
          {safeCategories.map((cat) => {
            // Support both old iconType logic and new iconName (Lucide) logic
            let Icon = Wrench;
            if (cat.iconName && (LucideIcons as any)[cat.iconName]) {
              Icon = (LucideIcons as any)[cat.iconName];
            } else if (cat.iconType === "drill") {
              Icon = (LucideIcons as any)["Drill"] || Wrench;
            } else if (cat.iconType === "saw") {
              Icon = (LucideIcons as any)["Disc"] || Wrench;
            } else if (cat.iconType) {
              Icon = (LucideIcons as any)["Settings"] || Wrench;
            }

            return (
              <Link
                key={cat._id}
                href={`/categoria/${cat.slug}`}
                className="group flex items-center gap-2.5 p-3 bg-white dark:bg-[#1a1a1a] border border-[#E0E0E0] dark:border-[#333] rounded-lg hover:shadow-md hover:border-[#ccc] dark:hover:border-[#444] transition-all"
              >
                {/* Icon circle */}
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#F5F6F8] dark:bg-[#2a2a2a] flex items-center justify-center group-hover:bg-[#E8EDF2] dark:group-hover:bg-[#333] transition-colors">
                  <Icon className="h-5 w-5 text-[#555] dark:text-gray-300" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#333] dark:text-gray-200 group-hover:text-[#E35205] transition-colors leading-tight line-clamp-2">
                    {cat.name}
                  </p>
                  {cat.viewCount && (
                    <span className="inline-flex items-center gap-0.5 mt-0.5">
                      <span className="text-[10px] text-[#0071C5] dark:text-[#3399FF] font-bold bg-[#E8F4FD] dark:bg-[#0a2a44] px-1.5 py-0.5 rounded-full">
                        {cat.viewCount}
                      </span>
                    </span>
                  )}
                </div>

                {/* Arrow */}
                <ChevronRight className="h-3.5 w-3.5 text-[#ccc] dark:text-gray-500 group-hover:text-[#E35205] shrink-0 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}