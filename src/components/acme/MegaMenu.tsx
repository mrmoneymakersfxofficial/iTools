"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { megaMenuCategories } from "@/app/data/mock";
import { ChevronDown } from "lucide-react";

export function MegaMenu() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 150);
  }, []);

  return (
    <nav className="hidden md:block bg-[#D1001C]" aria-label="Categorías principales">
      <div className="mx-auto max-w-7xl px-4 flex items-center h-10 overflow-x-auto">
        {megaMenuCategories.map((cat, index) => {
          const hasSubcategories =
            "subcategories" in cat && cat.subcategories && cat.subcategories.length > 0;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={cat.name}
              className="relative"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={cat.href}
                className={`flex items-center gap-1 px-3 py-2 text-[12px] font-bold uppercase tracking-wider text-white whitespace-nowrap transition-colors ${
                  isHovered ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                {cat.name}
                {hasSubcategories && <ChevronDown className="h-3 w-3" />}
              </Link>

              {/* Subcategory dropdown */}
              {hasSubcategories && isHovered && (
                <div
                  className="absolute left-0 top-full z-50 mt-0 bg-white rounded-b-lg shadow-xl border border-gray-200 min-w-[200px] py-2"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  {cat.subcategories!.map((sub) => (
                    <Link
                      key={sub}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D1001C] transition-colors"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}