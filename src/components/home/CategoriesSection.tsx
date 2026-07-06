"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Wrench,
  Scissors,
  Disc,
  Hammer,
  Trees,
  Shield,
  Settings,
  Package,
  HardHat,
  Ruler,
  type LucideIcon,
} from "lucide-react";
import { getTopCategories } from "@/lib/data";
import type { Category } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  Zap, Wrench, Scissors, Disc, Hammer, Trees, Shield, Settings, Package, HardHat, Ruler,
};

export function CategoriesSection() {
  const topCategories = getTopCategories();

  return (
    <section className="py-10 md:py-14 bg-white dark:bg-[#111111]" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2
              id="categories-heading"
              className="text-xl md:text-2xl font-impact text-foreground"
            >
              Top Categorías
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Encuentra todo lo que necesitas para tu trabajo
            </p>
          </div>
          <a
            href="#"
            className="hidden sm:flex items-center gap-1 text-sm text-itools-blue hover:text-itools-blue-dark transition-colors"
          >
            Ver Todas
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
          {topCategories.map((category, i) => (
            <CategoryCard key={category.id} category={category} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const Icon = iconMap[category.icon ?? ""] ?? Wrench;

  return (
    <motion.a
      href={`/categoria/${category.slug}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group flex flex-col items-center text-center p-3 md:p-4 rounded-lg border border-border hover:border-itools-blue/30 hover:shadow-md transition-all duration-200 bg-white dark:bg-[#111111] cursor-pointer"
    >
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-surface flex items-center justify-center mb-2.5 group-hover:bg-itools-blue/10 transition-colors">
        <Icon className="h-6 w-6 md:h-7 md:w-7 text-itools-steel-light group-hover:text-itools-blue transition-colors" />
      </div>
      <span className="text-xs md:text-sm text-foreground group-hover:text-itools-blue transition-colors leading-tight line-clamp-2">
        {category.name}
      </span>
    </motion.a>
  );
}