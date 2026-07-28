"use client";
import Link from "next/link";
import { TrendingUp, ChevronRight } from "lucide-react";

export function TrendingSidebar({ categories }: { categories: any[] }) {
  const safeCategories = categories || [];

  if (safeCategories.length === 0) return null;

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