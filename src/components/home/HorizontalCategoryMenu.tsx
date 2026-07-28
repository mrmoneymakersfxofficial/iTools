"use client";

import Link from "next/link";

export function HorizontalCategoryMenu({ categories }: { categories: any[] }) {
  const safeCategories = categories || [];

  if (safeCategories.length === 0) return null;

  return (
    <nav
      className="overflow-x-auto bg-white dark:bg-[#111111] border-b border-[#E0E0E0] dark:border-[#333]"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="flex items-center whitespace-nowrap px-3 py-2.5 gap-0">
        {safeCategories.map((item, i) => (
          <span key={item._id} className="flex items-center shrink-0">
            {i > 0 && (
              <span className="text-[#D0D0D0] mx-2 select-none" aria-hidden="true">|</span>
            )}
            <Link
              href={`/categoria/${item.slug}`}
              className="text-[11px] font-semibold text-[#333] dark:text-gray-200 hover:text-[#E35205] uppercase tracking-[0.04em] transition-colors"
            >
              {item.name}
            </Link>
          </span>
        ))}
      </div>
    </nav>
  );
}