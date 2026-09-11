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

            const thumbUrl =
              cat.image?.asset?.url ||
              (cat.slug?.includes("taladro")
                ? "/products/dewalt-drill.webp"
                : cat.slug?.includes("impact")
                ? "/products/bosch-flexiclick.webp"
                : cat.slug?.includes("sierra")
                ? "/products/makita-grinder.webp"
                : cat.slug?.includes("combo")
                ? "/products/dongcheng-combo.webp"
                : cat.slug?.includes("milwaukee")
                ? "/products/milwaukee-m18.webp"
                : "/products/paint-sprayer.webp");

            return (
              <Link
                key={cat._id}
                href={`/categoria/${cat.slug}`}
                className="group flex items-center gap-2 p-2.5 bg-white dark:bg-[#1a1a1a] border border-[#E0E0E0] dark:border-[#333] rounded-xl hover:shadow-md hover:border-[#ccc] dark:hover:border-[#444] transition-all"
              >
                {/* Product Thumbnail */}
                <div className="shrink-0 w-9 h-9 rounded-lg bg-[#F5F6F8] dark:bg-[#252525] p-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={thumbUrl}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/products/dewalt-drill.webp";
                    }}
                  />
                </div>

                {/* Text & Blue Eye */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#333] dark:text-gray-200 group-hover:text-[#E35205] transition-colors leading-tight line-clamp-1">
                    {cat.name}
                  </p>
                  {cat.viewCount && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] text-[#0080FF] font-bold">👁 {cat.viewCount}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}